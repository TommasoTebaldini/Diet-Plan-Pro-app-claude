// Supabase Edge Function: notify-on-event
// Webhook handler — Supabase chiama questa funzione quando avvengono eventi sul DB.
//
// Setup (Supabase Dashboard → Database → Webhooks → Create):
//   Name: notify-chat-message
//   Table: chat_messages  Events: INSERT
//   URL: https://<project>.supabase.co/functions/v1/notify-on-event
//   HTTP Headers: Authorization: Bearer <service_role_key>
//
//   Name: notify-diet-update
//   Table: patient_diets  Events: INSERT, UPDATE
//   URL: https://<project>.supabase.co/functions/v1/notify-on-event
//
// Setup segreti:
//   supabase secrets set VAPID_PUBLIC_KEY=<chiave>
//   supabase secrets set VAPID_PRIVATE_KEY=<chiave>
//   supabase secrets set VAPID_CONTACT_EMAIL=app@nutriplan.it
//   supabase functions deploy notify-on-event
//
// Genera chiavi VAPID:
//   node -e "const wp=require('web-push');const k=wp.generateVAPIDKeys();console.log(JSON.stringify(k,null,2))"

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import webpush from 'https://esm.sh/web-push@3.6.7'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
}

// ── Migrazione chiavi Supabase ──────────────────────────────────────────────
// ACCESSO AL DATABASE: usa la secret key nuova (SB_SECRET_KEY) se impostata,
// altrimenti la service_role legacy. Questa DEVE essere valida, quindi dopo
// aver disattivato le legacy va impostato SB_SECRET_KEY.
const SERVICE_KEY = Deno.env.get('SB_SECRET_KEY') ?? Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

// AUTORIZZAZIONE DEL WEBHOOK: i Database Webhooks di Supabase inviano in
// automatico la vecchia service_role nell'header Authorization e la UI non
// permette di cambiarla. Quindi accettiamo come "parola d'ordine" del webhook
// sia la secret key nuova SIA il token in WEBHOOK_TOKEN (da impostare = alla
// vecchia service_role, quella che i webhook continuano a mandare). Dopo la
// disattivazione delle legacy quel valore non ha più alcun potere sul DB:
// serve solo come segreto condiviso per far scattare la notifica.
const WEBHOOK_TOKEN = Deno.env.get('WEBHOOK_TOKEN') ?? Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  SERVICE_KEY,
)

async function sendPushToUser(userId: string, title: string, body: string, url = '/', tag = 'nutriplan') {
  const vapidPublic = Deno.env.get('VAPID_PUBLIC_KEY')
  const vapidPrivate = Deno.env.get('VAPID_PRIVATE_KEY')
  const vapidEmail = Deno.env.get('VAPID_CONTACT_EMAIL') || 'app@nutriplan.it'

  if (!vapidPublic || !vapidPrivate) {
    console.warn('[notify] VAPID keys not configured — skipping push')
    return { sent: false, reason: 'no_vapid' }
  }

  webpush.setVapidDetails(`mailto:${vapidEmail}`, vapidPublic, vapidPrivate)

  const { data: sub, error } = await supabaseAdmin
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth')
    .eq('user_id', userId)
    .maybeSingle()

  if (error || !sub) return { sent: false, reason: 'no_subscription' }

  try {
    await webpush.sendNotification(
      { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
      JSON.stringify({ title, body, url, tag }),
    )
    return { sent: true }
  } catch (e) {
    console.error('[notify] Push failed:', (e as Error).message)
    // Remove invalid subscription
    if ((e as { statusCode?: number }).statusCode === 410) {
      await supabaseAdmin.from('push_subscriptions').delete().eq('user_id', userId)
    }
    return { sent: false, reason: (e as Error).message }
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  // SECURITY: the setup comment above says this webhook is called with
  // "Authorization: Bearer <service_role_key>", but that header was never
  // actually verified — anyone with the public function URL could POST an
  // arbitrary {table, record} and trigger a push notification impersonating
  // "il tuo dietista" to any patient_id (phishing).
  // Accetta o la secret key nuova o il token del webhook (vecchia service_role).
  const accepted = [SERVICE_KEY, WEBHOOK_TOKEN].filter(Boolean).map(k => `Bearer ${k}`)
  const provided = req.headers.get('authorization') || ''
  if (!accepted.length || !accepted.includes(provided)) {
    return json({ error: 'unauthorized' }, 401)
  }

  let payload: {
    type?: string
    table?: string
    record?: Record<string, unknown>
    old_record?: Record<string, unknown>
  }
  try {
    payload = await req.json()
  } catch {
    return json({ error: 'Payload non valido' }, 400)
  }

  const { table, record } = payload
  if (!record) return json({ skipped: 'no record' })

  let result: { sent: boolean; reason?: string } = { sent: false, reason: 'unhandled_table' }

  // ── New chat message from dietitian ──────────────────────────────────────────
  if (table === 'chat_messages') {
    const { patient_id, sender_role, content, message_type } = record as {
      patient_id?: string; sender_role?: string; content?: string; message_type?: string
    }
    if (sender_role === 'dietitian' && patient_id) {
      if (message_type === 'video_call') {
        result = await sendPushToUser(
          patient_id,
          '📹 Videochiamata in arrivo',
          'Il tuo dietista ti sta chiamando',
          '/chat',
          'video-call',
        )
      } else {
        const preview = String(content || '').slice(0, 80)
        result = await sendPushToUser(
          patient_id,
          '💬 Messaggio dal tuo dietista',
          preview || 'Hai un nuovo messaggio',
          '/chat',
          'chat-msg',
        )
      }
    }
  }

  // ── Diet plan created or updated ──────────────────────────────────────────────
  if (table === 'patient_diets') {
    const { user_id } = record as { user_id?: string }
    if (user_id) {
      result = await sendPushToUser(
        user_id,
        '🥗 Piano alimentare aggiornato',
        'Il tuo dietista ha aggiornato il tuo piano nutrizionale',
        '/dieta',
        'diet-update',
      )
    }
  }

  // ── New document shared by dietitian ─────────────────────────────────────────
  if (table === 'patient_documents') {
    const { patient_id, title, visible } = record as {
      patient_id?: string; title?: string; visible?: boolean
    }
    if (patient_id && visible) {
      result = await sendPushToUser(
        patient_id,
        '📄 Nuovo documento condiviso',
        String(title || 'Il tuo dietista ha condiviso un documento'),
        '/documenti',
        'doc-new',
      )
    }
  }

  return json(result)
})
