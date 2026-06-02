// Vercel Serverless Function: POST /api/send-push
// Sends a Web Push notification to a specific user via their stored subscription.
//
// Required env vars (Vercel project settings):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
//   VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_CONTACT_EMAIL
//
// Body: { userId, title, body, url?, tag? }

import webpush from 'web-push'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
)

webpush.setVapidDetails(
  'mailto:' + (process.env.VAPID_CONTACT_EMAIL || 'app@nutriplan.it'),
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY,
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { userId, title, body, url = '/', tag = 'nutriplan' } = req.body || {}
  if (!userId || !title) {
    return res.status(400).json({ error: 'userId and title are required' })
  }

  const { data: sub, error } = await supabaseAdmin
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth')
    .eq('user_id', userId)
    .single()

  if (error || !sub) {
    return res.status(404).json({ error: 'No push subscription found for this user' })
  }

  try {
    await webpush.sendNotification(
      { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
      JSON.stringify({ title, body, url, tag }),
    )
    res.status(200).json({ sent: true })
  } catch (e) {
    console.error('[send-push] Error:', e.message)
    res.status(500).json({ error: e.message })
  }
}
