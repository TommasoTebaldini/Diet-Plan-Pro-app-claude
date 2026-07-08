// Per-user, in-memory, per-instance rate limiter for Edge Functions.
// Mirrors the same pattern already used in NutriPlan-Pro's Vercel functions
// (api/claude.js, api/gemini.js). It's instance-scoped, not global/distributed —
// a cold start or multiple concurrent instances reset/split the count — so it's
// a "raise the cost of abuse" measure, not an exact quota. Good enough for
// throttling a single misbehaving client against a paid AI API without adding
// an external dependency (Upstash/Redis) that this project doesn't otherwise need.

interface Entry { n: number; t: number }

export function createRateLimiter(maxRequests: number, windowMs: number) {
  const hits = new Map<string, Entry>()

  function allow(key: string): boolean {
    const now = Date.now()
    const entry = hits.get(key)
    if (!entry || now - entry.t > windowMs) {
      hits.set(key, { n: 1, t: now })
      return true
    }
    if (entry.n >= maxRequests) return false
    entry.n++
    return true
  }

  function prune() {
    if (hits.size < 500) return
    const cutoff = Date.now() - windowMs
    for (const [k, v] of hits) if (v.t < cutoff) hits.delete(k)
  }

  return { allow, prune }
}
