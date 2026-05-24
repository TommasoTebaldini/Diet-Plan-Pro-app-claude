// Serverless proxy for Open Food Facts — avoids CORS on the browser side
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const { q, barcode } = req.query
  const FIELDS = 'code,product_name,product_name_it,product_name_en,brands,nutriments'

  const OFF_HEADERS = {
    'User-Agent': 'NutriPlanApp/1.0 (nutrition tracking; https://diet-plan-pro-app-claude.vercel.app)',
    'Accept': 'application/json',
  }

  async function tryFetch(url, extraHeaders = {}) {
    const r = await fetch(url, { headers: { ...OFF_HEADERS, ...extraHeaders } })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    return r.json()
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
      const encoded = encodeURIComponent(barcode)
      // Try Meilisearch filter first (fast), then v0 API
      const errors = []
      try {
        const data = await tryFetch(
          `https://search.openfoodfacts.org/search?q=${encoded}&page_size=5&filter=code:${encoded}`
        )
        const hit = data.hits?.find(h => h.code === barcode)
        if (hit) {
          res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600')
          return res.status(200).json({ status: 1, product: hitToProduct(hit) })
        }
      } catch (e) { errors.push(`meilisearch: ${e.message}`) }

      try {
        const data = await tryFetch(`https://world.openfoodfacts.org/api/v0/product/${encoded}.json`)
        res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600')
        return res.status(200).json(data)
      } catch (e) { errors.push(`v0: ${e.message}`) }

      return res.status(200).json({ status: 0, _errors: errors })
    }

    // ── Text search ────────────────────────────────────────────────────────
    if (!q) return res.status(400).json({ error: 'missing q' })

    const encoded = encodeURIComponent(q)
    const errors = []

    // 1) Meilisearch — dedicated search service, separate infra from OFF API
    try {
      const data = await tryFetch(
        `https://search.openfoodfacts.org/search?q=${encoded}&page_size=24`
      )
      if (data.hits?.length) {
        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
        return res.status(200).json({ products: data.hits.map(hitToProduct) })
      }
    } catch (e) { errors.push(`meilisearch: ${e.message}`) }

    // 2) OFF v2 API fallback
    try {
      const data = await tryFetch(
        `https://world.openfoodfacts.org/api/v2/search?search_terms=${encoded}&fields=${FIELDS}&page_size=24&sort_by=unique_scans_n`
      )
      if (data.products?.length) {
        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
        return res.status(200).json(data)
      }
    } catch (e) { errors.push(`v2: ${e.message}`) }

    // 3) CGI fallback
    try {
      const data = await tryFetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encoded}&search_simple=1&action=process&json=1&page_size=24&fields=${FIELDS}`
      )
      if (data.products?.length) {
        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
        return res.status(200).json(data)
      }
    } catch (e) { errors.push(`cgi: ${e.message}`) }

    return res.status(200).json({ products: [], _errors: errors })
  } catch (e) {
    return res.status(200).json({ error: e.message || 'proxy error', products: [] })
  }
}
