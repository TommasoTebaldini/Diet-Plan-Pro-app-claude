// Supabase Edge Function: send-medication-reminders
// Invocata da pg_cron ogni minuto (SEZIONE 120 di supabase_setup.sql, stesso
// pattern di dispatch_scheduled_messages/generate-giornale-monthly) via
// pg_net, con un secret condiviso letto da Vault.
//
// Perché serve: prima i promemoria farmaci erano programmati interamente
// lato client con setTimeout (src/lib/notifications.js,
// scheduleMedicationReminders) — funzionavano solo mentre l'app restava
// aperta in primo piano. Su mobile (iOS/Android) un tab/PWA in background
// sospende i timer entro pochi minuti: il promemoria semplicemente non
// partiva mai, nonostante la UI prometta l'invio "all'orario giusto".
// Questa funzione chiude il gap inviando una vera push notification
// server-side, indipendente dallo stato dell'app.
//
// Setup:
//   supabase secrets set VAPID_PUBLIC_KEY=<chiave>       (già impostata per notify-on-event)
//   supabase secrets set VAPID_PRIVATE_KEY=<chiave>
//   supabase secrets set VAPID_CONTACT_EMAIL=app@nutriplan.it
//   supabase secrets set MEDICATION_REMINDERS_CRON_SECRET=<valore da vault.decrypted_secrets>
//   supabase functions deploy send-medication-reminders
//
// Semplificazione deliberata: fuso orario fisso Europe/Rome (nessuna colonna
// timezone su profiles/medication_reminders — l'app è interamente in
// italiano, stesso presupposto già usato altrove nel progetto, es.
// dispatch_scheduled_messages e il report settimanale pazienti inattivi).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import webpush from 'https://esm.sh/web-push@3.6.7'

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
}

const SERVICE_KEY = Deno.env.get('SB_SECRET_KEY') ?? Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const CRON_SECRET = Deno.env.get('MEDICATION_REMINDERS_CRON_SECRET') ?? ''

const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL') ?? '', SERVICE_KEY)

function timingSafeEqualStr(a: string, b: string): boolean {
  const bufA = new TextEncoder().encode(a)
  const bufB = new TextEncoder().encode(b)
  if (bufA.length !== bufB.length) return false
  let diff = 0
  for (let i = 0; i < bufA.length; i++) diff |= bufA[i] ^ bufB[i]
  return diff === 0
}

// 'HH:MM' in Europe/Rome, indipendentemente dal fuso del server Deno.
function currentTimeRome(): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Rome', hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(new Date())
}
function currentDateRome(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome' }).format(new Date()) // YYYY-MM-DD
}

// Invia a TUTTE le sottoscrizioni push dell'utente (push_subscriptions
// supporta più dispositivi, unique su endpoint non su user_id — stesso fix
// già applicato a notify-on-event/sendPushToUser): un endpoint scaduto su un
// dispositivo non deve bloccare la notifica sugli altri.
async function sendPushToUser(userId: string, title: string, body: string): Promise<boolean> {
  // Centro notifiche in-app (SEZIONE 123): registrato indipendentemente dal
  // successo della push, così il promemoria resta consultabile anche se il
  // dispositivo era spento o non aveva mai una sottoscrizione attiva.
  await supabaseAdmin.from('notifications').insert({ user_id: userId, title, body, url: '/farmaci', type: 'medication' }).then(() => {}, () => {})
  const { data: subs } = await supabaseAdmin.from('push_subscriptions').select('id, endpoint, p256dh, auth').eq('user_id', userId)
  if (!subs?.length) return false
  let sentToAtLeastOne = false
  for (const sub of subs) {
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        JSON.stringify({ title, body, url: '/farmaci', tag: 'medication' }),
      )
      sentToAtLeastOne = true
    } catch (e) {
      if ((e as { statusCode?: number }).statusCode === 410) {
        await supabaseAdmin.from('push_subscriptions').delete().eq('id', sub.id)
      }
    }
  }
  return sentToAtLeastOne
}

Deno.serve(async (req: Request) => {
  const authHeader = req.headers.get('Authorization') || ''
  const token = authHeader.replace(/^Bearer\s+/i, '')
  if (!CRON_SECRET || !timingSafeEqualStr(token, CRON_SECRET)) {
    return json({ error: 'Non autorizzato' }, 401)
  }

  const vapidPublic = Deno.env.get('VAPID_PUBLIC_KEY')
  const vapidPrivate = Deno.env.get('VAPID_PRIVATE_KEY')
  if (!vapidPublic || !vapidPrivate) return json({ ok: true, skipped: 'no_vapid' })
  webpush.setVapidDetails(`mailto:${Deno.env.get('VAPID_CONTACT_EMAIL') || 'app@nutriplan.it'}`, vapidPublic, vapidPrivate)

  const nowTime = currentTimeRome()
  const today = currentDateRome()

  // times è text[]: PostgREST "cs" (contains) su un array letterale trova le
  // righe il cui array include esattamente questo 'HH:MM'.
  const { data: due, error } = await supabaseAdmin
    .from('medication_reminders')
    .select('id, user_id, name, dosage, times')
    .eq('active', true)
    .filter('times', 'cs', `{${nowTime}}`)

  if (error) return json({ error: error.message }, 500)
  if (!due?.length) return json({ ok: true, checked: 0 })

  let sent = 0, skipped = 0
  for (const med of due) {
    // Un promemoria può comparire qui più volte se l'orario si ripete
    // nell'array (raro ma non impedito lato UI) — dedup sul singolo giro.
    const alreadyLogged = await supabaseAdmin
      .from('medication_reminder_log')
      .select('id', { count: 'exact', head: true })
      .eq('reminder_id', med.id).eq('time_slot', nowTime).eq('sent_date', today)
    if ((alreadyLogged.count || 0) > 0) { skipped++; continue }

    // Claim ottimistico: inserisce PRIMA di inviare, sul vincolo UNIQUE
    // (reminder_id, time_slot, sent_date) — se un'esecuzione concorrente del
    // cron (improbabile ma non impossibile) ha già inserito la stessa riga,
    // questo INSERT fallisce e il conflitto evita un doppio invio.
    const claim = await supabaseAdmin.from('medication_reminder_log').insert({
      reminder_id: med.id, time_slot: nowTime, sent_date: today,
    })
    if (claim.error) { skipped++; continue }

    const body = med.dosage ? `Dose: ${med.dosage}` : 'È ora di prendere il farmaco'
    if (await sendPushToUser(med.user_id, `💊 ${med.name}`, body)) sent++
  }

  return json({ ok: true, checked: due.length, sent, skipped })
})
