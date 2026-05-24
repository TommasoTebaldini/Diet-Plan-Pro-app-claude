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

  const fetchWithTimeout = async (url, ms) => {
    const ac = new AbortController()
    const tid = setTimeout(() => ac.abort(), ms)
    try {
      const r = await fetch(url, { signal: ac.signal, headers: OFF_HEADERS })
      clearTimeout(tid)
      return r
    } catch (e) {
      clearTimeout(tid)
      throw e
    }
  }

  try {
    if (barcode) {
      const url = `https://world.openfoodfacts.org/api/v0/product/${encodeURIComponent(barcode)}.json`
      const r = await fetchWithTimeout(url, 8000)
      if (!r.ok) return res.status(200).json({ status: 0 })
      const data = await r.json()
      res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600')
      return res.status(200).json(data)
    }

    if (!q) return res.status(400).json({ error: 'missing q' })

    const encoded = encodeURIComponent(q)
    const base = `https://world.openfoodfacts.org/api/v2/search?search_terms=${encoded}&fields=${FIELDS}&page_size=24&sort_by=unique_scans_n`
    const url = italy === '1' ? `${base}&countries_tags_en=italy` : base

    const r = await fetchWithTimeout(url, 8000)
    if (!r.ok) return res.status(200).json({ products: [] })
    const data = await r.json()

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
    return res.status(200).json(data)
  } catch (e) {
    return res.status(200).json({ error: e.message || 'proxy error', products: [] })
  }
}
