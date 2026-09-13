// Serverless proxy for Open Food Facts — avoids CORS on the browser side

import { withErrorLogging, logServerError } from './_errorLog.js';

// In-process response cache — survives across warm invocations of the same Lambda instance
const _cache = new Map(); // key → { data, exp }

function getCached(key) {
  const e = _cache.get(key);
  if (!e) return null;
  if (Date.now() > e.exp) { _cache.delete(key); return null; }
  return e.data;
}

function setCached(key, data, ttlMs) {
  if (_cache.size > 1000) {
    const now = Date.now();
    for (const [k, v] of _cache) if (v.exp < now) _cache.delete(k);
  }
  _cache.set(key, { data, exp: Date.now() + ttlMs });
}

// In-memory sliding-window rate limit per IP. Best-effort only: it resets on
// every cold start and isn't shared across Lambda instances, but it still
// caps how hard a single misbehaving client (buggy retry loop, scraping)
// can hammer the upstream OFF/Meilisearch APIs from one warm instance.
const _rateLimit = new Map(); // ip → [timestamps]
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 60

function isRateLimited(ip) {
  const now = Date.now()
  const hits = (_rateLimit.get(ip) || []).filter(t => now - t < RATE_LIMIT_WINDOW_MS)
  hits.push(now)
  _rateLimit.set(ip, hits)
  if (_rateLimit.size > 5000) {
    for (const [k, v] of _rateLimit) if (!v.length || now - v[v.length - 1] > RATE_LIMIT_WINDOW_MS) _rateLimit.delete(k)
  }
  return hits.length > RATE_LIMIT_MAX
}

async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim()
  if (isRateLimited(ip)) {
    res.setHeader('Retry-After', '60')
    return res.status(429).json({ error: 'Too many requests, riprova tra poco.', products: [] })
  }

  const { q, barcode } = req.query
  const FIELDS = 'code,product_name,product_name_it,product_name_en,brands,nutriments'

  const OFF_HEADERS = {
    'User-Agent': 'NutriPlanApp/1.0 (nutrition tracking; https://diet-plan-pro-app-claude.vercel.app)',
    'Accept': 'application/json',
  }

  // Per-tier timeout: a slow (not erroring) upstream must not eat the whole
  // client-side budget (10s) before the next fallback tier gets a chance.
  async function tryFetch(url, extraHeaders = {}, timeoutMs = 3000) {
    const ac = new AbortController()
    const tid = setTimeout(() => ac.abort(), timeoutMs)
    try {
      const r = await fetch(url, { headers: { ...OFF_HEADERS, ...extraHeaders }, signal: ac.signal })
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      return await r.json()
    } finally {
      clearTimeout(tid)
    }
  }

  // Normalize a Meilisearch hit to the same shape as mapOFFProduct expects
  function hitToProduct(h) {
    return {
      code: h.code,
      product_name: h.product_name || '',
      product_name_it: h.product_name_it || '',
      product_name_en: h.product_name_en || '',
      brands: Array.isArray(h.brands) ? h.brands.join(', ') : (h.brands || ''),
      nutriments: h.nutriments || {},
    }
  }

  try {
    // ── Barcode lookup ──────────────────────────────────────────────────────
    if (barcode) {
      const cacheKey = `bc:${barcode}`
      const cached = getCached(cacheKey)
      if (cached) {
        res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600')
        return res.status(200).json(cached)
      }

      const encoded = encodeURIComponent(barcode)
      const errors = []
      try {
        const data = await tryFetch(
          `https://search.openfoodfacts.org/search?q=${encoded}&page_size=5&filter=code:${encoded}`
        )
        const hit = data.hits?.find(h => h.code === barcode)
        if (hit) {
          const result = { status: 1, product: hitToProduct(hit) }
          setCached(cacheKey, result, 86_400_000) // 24 ore
          res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600')
          return res.status(200).json(result)
        }
      } catch (e) { errors.push(`meilisearch: ${e.message}`) }

      try {
        const data = await tryFetch(`https://world.openfoodfacts.org/api/v0/product/${encoded}.json`)
        if (data.status === 1) setCached(cacheKey, data, 86_400_000) // 24 ore
        res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600')
        return res.status(200).json(data)
      } catch (e) { errors.push(`v0: ${e.message}`) }

      return res.status(200).json({ status: 0, _errors: errors })
    }

    // ── Text search ────────────────────────────────────────────────────────
    if (!q) return res.status(400).json({ error: 'missing q' })

    const cacheKey = `q:${q.toLowerCase().trim()}`
    const cached = getCached(cacheKey)
    if (cached) {
      res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
      return res.status(200).json(cached)
    }

    const encoded = encodeURIComponent(q)
    const errors = []

    // 1) Meilisearch — dedicated search service, separate infra from OFF API
    try {
      const data = await tryFetch(
        `https://search.openfoodfacts.org/search?q=${encoded}&page_size=24`
      )
      if (data.hits?.length) {
        const result = { products: data.hits.map(hitToProduct) }
        setCached(cacheKey, result, 300_000) // 5 minuti
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
        return res.status(200).json(result)
      }
    } catch (e) { errors.push(`meilisearch: ${e.message}`) }

    // 2) OFF v2 API fallback
    try {
      const data = await tryFetch(
        `https://world.openfoodfacts.org/api/v2/search?search_terms=${encoded}&fields=${FIELDS}&page_size=24&sort_by=unique_scans_n`
      )
      if (data.products?.length) {
        setCached(cacheKey, data, 300_000)
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
        return res.status(200).json(data)
      }
    } catch (e) { errors.push(`v2: ${e.message}`) }

    // 3) CGI fallback
    try {
      const data = await tryFetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encoded}&search_simple=1&action=process&json=1&page_size=24&fields=${FIELDS}`
      )
      if (data.products?.length) {
        setCached(cacheKey, data, 300_000)
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
        return res.status(200).json(data)
      }
    } catch (e) { errors.push(`cgi: ${e.message}`) }

    return res.status(200).json({ products: [], _errors: errors })
  } catch (e) {
    await logServerError('off-proxy', e, req).catch(() => {})
    return res.status(200).json({ error: e.message || 'proxy error', products: [] })
  }
}

export default withErrorLogging('off-proxy', handler);
