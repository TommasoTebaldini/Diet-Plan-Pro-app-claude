// Serverless proxy for Open Food Facts — avoids CORS on the browser side
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const { q, barcode, italy } = req.query
  const FIELDS = 'code,product_name,product_name_it,product_name_en,brands,nutriments'

  const OFF_HEADERS = {
    'User-Agent': 'NutriPlanApp/1.0 (nutrition tracking; https://diet-plan-pro-app-claude.vercel.app)',
    'Accept': 'application/json',
  }

  async function tryFetch(url) {
    const r = await fetch(url, { headers: OFF_HEADERS })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    return r.json()
  }

  try {
    if (barcode) {
      const url = `https://world.openfoodfacts.org/api/v0/product/${encodeURIComponent(barcode)}.json`
      const data = await tryFetch(url)
      res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600')
      return res.status(200).json(data)
    }

    if (!q) return res.status(400).json({ error: 'missing q' })

    const encoded = encodeURIComponent(q)
    const errors = []

    // 1) v2 search API — Italian products first
    const urls = [
      italy === '1'
        ? `https://world.openfoodfacts.org/api/v2/search?search_terms=${encoded}&fields=${FIELDS}&page_size=24&sort_by=unique_scans_n&countries_tags_en=italy`
        : `https://world.openfoodfacts.org/api/v2/search?search_terms=${encoded}&fields=${FIELDS}&page_size=24&sort_by=unique_scans_n`,
    ]

    for (const url of urls) {
      try {
        const data = await tryFetch(url)
        if (data.products?.length) {
          res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
          return res.status(200).json(data)
        }
      } catch (e) { errors.push(`v2: ${e.message}`) }
    }

    // 2) CGI search API fallback (older but very reliable)
    try {
      const cgiUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encoded}&search_simple=1&action=process&json=1&page_size=24&fields=${FIELDS}`
      const data = await tryFetch(cgiUrl)
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
