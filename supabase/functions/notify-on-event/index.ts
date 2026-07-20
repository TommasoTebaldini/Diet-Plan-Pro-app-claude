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

// Migrazione chiavi Supabase: usa la secret key nuova (custom secret
// SB_SECRET_KEY) se impostata, altrimenti ricade sulla service_role legacy —
// così la funzione resta valida prima e dopo la disattivazione delle legacy.
// I Database Webhooks che chiamano questa funzione vanno aggiornati per
// inviare la stessa secret key nell'header Authorization.
const SERVICE_KEY = Deno.env.get('SB_SECRET_KEY') ?? Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

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
  const expected = `Bearer ${SERVICE_KEY}`
  const provided = req.headers.get('authorization') || ''
  if (!SERVICE_KEY || provided !== expected) {
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
