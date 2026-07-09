// Vercel Serverless Function: POST /api/send-push
// Sends a Web Push notification to a specific user via their stored subscription.
//
// Required env vars (Vercel project settings):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
//   VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_CONTACT_EMAIL
//
// This endpoint is server-to-server only (called from trusted backends/webhooks,
// never from the browser) — it must present the Supabase service role key as a
// bearer token, the same secret already required to read push_subscriptions here.
//   Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>
//
// Body: { userId, title, body, url?, tag? }

import { timingSafeEqual } from 'crypto'
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

function isAuthorized(req) {
  const expected = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  const provided = (req.headers.authorization || '').replace(/^Bearer\s+/i, '')
  const a = Buffer.from(provided)
  const b = Buffer.from(expected)
  if (!expected || a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

// Defense in depth: this endpoint is already gated by the service role key, but
// a rate limit per target userId caps the blast radius of a bug (or a leaked
// secret) that ends up calling this in a loop and spamming one patient.
const _rl = new Map()
const RL_MAX = 20
const RL_WIN = 60_000
function rateLimit(userId) {
  const now = Date.now()
  const e = _rl.get(userId)
  if (!e || now - e.t > RL_WIN) { _rl.set(userId, { n: 1, t: now }); return true }
  if (e.n >= RL_MAX) return false
  e.n++; return true
}
function pruneRl() {
  if (_rl.size < 500) return
  const cutoff = Date.now() - RL_WIN
  for (const [k, v] of _rl) if (v.t < cutoff) _rl.delete(k)
}

// Dedup identical notifications to the same user in quick succession — covers
// retry loops on the caller side (e.g. a webhook firing twice for one event)
// that would otherwise double-notify the patient with the same content.
const _dedup = new Map() // `${userId}|${tag}|${title}|${body}` → timestamp
const DEDUP_WIN = 30_000
function isDuplicate(userId, title, body, tag) {
  const key = `${userId}|${tag}|${title}|${body}`
  const now = Date.now()
  const last = _dedup.get(key)
  if (last && now - last < DEDUP_WIN) return true
  _dedup.set(key, now)
  if (_dedup.size > 1000) {
    const cutoff = now - DEDUP_WIN
    for (const [k, t] of _dedup) if (t < cutoff) _dedup.delete(k)
  }
  return false
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  if (!isAuthorized(req)) return res.status(401).json({ error: 'Unauthorized' })

  const { userId, title, body, url = '/', tag = 'nutriplan' } = req.body || {}
  if (!userId || !title) {
    return res.status(400).json({ error: 'userId and title are required' })
  }

  pruneRl()
  if (!rateLimit(userId)) {
    return res.status(429).json({ error: 'Too many notifications for this user, try again later' })
  }

  if (isDuplicate(userId, title, body, tag)) {
    return res.status(200).json({ sent: false, deduped: true })
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
