import { supabase } from './supabase'

// Recent foods from patient's own logs (fastest, most relevant)
async function searchRecentFoods(query) {
  try {
    const { data } = await supabase
      .from('food_logs')
      .select('food_name, kcal, proteins, carbs, fats, grams, food_data')
      .ilike('food_name', `%${query}%`)
      .order('created_at', { ascending: false })
      .limit(80)
    if (!data?.length) return []
    const seen = new Map()
    for (const row of data) {
      if (seen.has(row.food_name)) continue
      const fd = row.food_data || {}
      const g = row.grams || 100
      seen.set(row.food_name, {
        id: `recent_${row.food_name}`,
        name: row.food_name,
        brand: fd.brand || '',
        kcal_100g: fd.kcal_100g ?? Math.round(row.kcal / g * 100),
        proteins_100g: fd.proteins_100g ?? Math.round(row.proteins / g * 1000) / 10,
        carbs_100g: fd.carbs_100g ?? Math.round(row.carbs / g * 1000) / 10,
        fats_100g: fd.fats_100g ?? Math.round(row.fats / g * 1000) / 10,
        fiber_100g: fd.fiber_100g || 0,
        source: 'recent',
      })
    }
    return [...seen.values()].slice(0, 6)
  } catch { return [] }
}

// Foods from dietitian's diet meals (foods in prescribed diets)
async function searchDietMealFoods(query) {
  try {
    const { data } = await supabase
      .from('diet_meals').select('foods').not('foods', 'is', null).limit(200)
    if (!data?.length) return []
    const seen = new Set()
    const results = []
    const q = query.toLowerCase()
    for (const meal of data) {
      if (!Array.isArray(meal.foods)) continue
      for (const food of meal.foods) {
        const name = food.name || food.nome || ''
        if (!name || !name.toLowerCase().includes(q) || seen.has(name)) continue
        seen.add(name)
        results.push({
          id: `diet_${name}`,
          name, brand: '🥗 Dal tuo piano',
          kcal_100g: food.kcal_100g || food.calorie || 0,
          proteins_100g: food.proteins_100g || food.proteine || 0,
          carbs_100g: food.carbs_100g || food.carboidrati || 0,
          fats_100g: food.fats_100g || food.grassi || 0,
          fiber_100g: food.fiber_100g || 0,
          source: 'diet',
        })
      }
    }
    return results.slice(0, 8)
  } catch { return [] }
}

// Recipes table
async function searchRicette(query) {
  try {
    const { data } = await supabase.from('ricette').select('*').ilike('nome', `%${query}%`).limit(8)
    if (!data?.length) return []
    return data.map(r => ({
      id: `ricetta_${r.id}`, name: r.nome || r.name || '',
      brand: '🍳 Ricetta',
      kcal_100g: r.kcal_100g || r.calorie_porzione || r.calorie || r.kcal || 0,
      proteins_100g: r.proteins_100g || r.proteine || r.proteins || 0,
      carbs_100g: r.carbs_100g || r.carboidrati || r.carbs || 0,
      fats_100g: r.fats_100g || r.grassi || r.lipidi || 0,
      fiber_100g: r.fibra || 0, source: 'recipe',
    })).filter(r => r.name)
  } catch { return [] }
}

// Custom meals (user-created meal combos)
async function searchCustomMeals(query) {
  try {
    const { data } = await supabase
      .from('custom_meals')
      .select('*')
      .ilike('name', `%${query}%`)
      .limit(6)
    if (!data?.length) return []
    return data.map(m => {
      const w = m.peso_totale_g || 100
      return {
        id: `meal_${m.id}`,
        name: m.name,
        brand: '🍽️ Pasto personalizzato',
        kcal_100g: w > 0 ? Math.round(m.kcal_total / w * 100) : 0,
        proteins_100g: w > 0 ? Math.round(m.proteins_total / w * 1000) / 10 : 0,
        carbs_100g: w > 0 ? Math.round(m.carbs_total / w * 1000) / 10 : 0,
        fats_100g: w > 0 ? Math.round(m.fats_total / w * 1000) / 10 : 0,
        fiber_100g: 0,
        source: 'custom_meal',
        meal_id: m.id,
        default_grams: w,
      }
    })
  } catch { return [] }
}

// Open Food Facts — uses Meilisearch-based API for accurate, relevant results
function mapOFFProduct(p) {
  const n = p.nutriments || {}
  // Try kcal directly, then convert from kJ (1 kcal ≈ 4.184 kJ)
  const kcal = n['energy-kcal_100g']
    || (n['energy_100g'] ? Math.round(n['energy_100g'] / 4.184) : 0)
    || n['energy-kcal']
    || 0
  return {
    id: p.code || p._id, name: p.product_name, brand: p.brands || '',
    kcal_100g: Math.round(kcal),
    proteins_100g: Math.round((n['proteins_100g'] || 0) * 10) / 10,
    carbs_100g: Math.round((n['carbohydrates_100g'] || 0) * 10) / 10,
    fats_100g: Math.round((n['fat_100g'] || 0) * 10) / 10,
    fiber_100g: Math.round((n['fiber_100g'] || 0) * 10) / 10,
    source: 'openfoodfacts',
  }
}

function hasEnergyData(p) {
  const n = p.nutriments || {}
  return p.product_name && (n['energy-kcal_100g'] || n['energy_100g'] || n['energy-kcal'])
}

export async function searchOpenFoodFacts(query) {
  const fields = 'code,product_name,brands,nutriments'
  // Primary: Meilisearch-based API — returns results ranked by relevance to product name
  try {
    const res = await fetch(
      `https://search.openfoodfacts.org/search?q=${encodeURIComponent(query)}&page_size=24&fields=${fields}`,
      { signal: AbortSignal.timeout(9000) }
    )
    const data = await res.json()
    const hits = (data.hits || [])
      .filter(hasEnergyData)
      .map(mapOFFProduct)
    if (hits.length > 0) return hits
  } catch { /* fall through to legacy API */ }

  // Fallback: legacy CGI search
  try {
    const res = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&fields=${fields}&page_size=24`,
      { signal: AbortSignal.timeout(9000) }
    )
    const data = await res.json()
    return (data.products || [])
      .filter(hasEnergyData)
      .map(mapOFFProduct)
  } catch { return [] }
}

export async function searchFoods(query) {
  const [a, b, c, d, e] = await Promise.allSettled([
    searchRecentFoods(query),
    searchDietMealFoods(query),
    searchRicette(query),
    searchCustomMeals(query),
    searchOpenFoodFacts(query),
  ])
  const seen = new Set()
  const dedup = arr => (arr.status === 'fulfilled' ? arr.value : []).filter(f => {
    const k = (f.name || '').toLowerCase().trim()
    if (!k || seen.has(k)) return false
    seen.add(k); return true
  })
  return [...dedup(a), ...dedup(b), ...dedup(c), ...dedup(d), ...dedup(e)]
}

export async function searchDatabaseFoods(query) {
  return searchDietMealFoods(query)
}

export async function searchByBarcode(barcode) {
  try {
    const res = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${encodeURIComponent(barcode)}.json`,
      { signal: AbortSignal.timeout(8000) }
    )
    const data = await res.json()
    if (data.status !== 1 || !data.product) return null
    const p = data.product
    const n = p.nutriments || {}
    const name = p.product_name_it || p.product_name || ''
    if (!name) return null
    return {
      id: p.code || barcode,
      name,
      brand: p.brands || '',
      kcal_100g: Math.round(n['energy-kcal_100g'] || 0),
      proteins_100g: Math.round((n['proteins_100g'] || 0) * 10) / 10,
      carbs_100g: Math.round((n['carbohydrates_100g'] || 0) * 10) / 10,
      fats_100g: Math.round((n['fat_100g'] || 0) * 10) / 10,
      fiber_100g: Math.round((n['fiber_100g'] || 0) * 10) / 10,
      source: 'openfoodfacts',
    }
  } catch { return null }
}
