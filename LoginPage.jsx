import { supabase } from './supabase'

// ─── NO food DB table found in Supabase ───────────────────────────────────────
// The dietitian site uses CREA/BDA INRAN as a local JSON file.
// We search: 1) patient's own food_logs (recent), 2) diet_meals (prescribed foods),
// 3) ricette (recipes), 4) Open Food Facts (millions of products)

// ─── 1. Recent foods from patient's own logs ─────────────────────────────────
async function searchRecentFoods(query) {
  try {
    const { data, error } = await supabase
      .from('food_logs')
      .select('food_name, kcal, proteins, carbs, fats, grams, food_data')
      .ilike('food_name', `%${query}%`)
      .order('created_at', { ascending: false })
      .limit(60)
    if (error || !data) return []

    const seen = new Map()
    for (const row of data) {
      if (seen.has(row.food_name)) continue
      const fd = row.food_data || {}
      const g = row.grams || 100
      seen.set(row.food_name, {
        id: `recent_${row.food_name}`,
        name: row.food_name,
        brand: fd.brand || '',
        kcal_100g: fd.kcal_100g ?? Math.round((row.kcal / g) * 100),
        proteins_100g: fd.proteins_100g ?? Math.round((row.proteins / g) * 1000) / 10,
        carbs_100g: fd.carbs_100g ?? Math.round((row.carbs / g) * 1000) / 10,
        fats_100g: fd.fats_100g ?? Math.round((row.fats / g) * 1000) / 10,
        fiber_100g: fd.fiber_100g || 0,
        source: 'recent',
      })
    }
    return [...seen.values()].slice(0, 8)
  } catch { return [] }
}

// ─── 2. Foods from prescribed diet meals ─────────────────────────────────────
async function searchDietMealFoods(query) {
  try {
    const { data, error } = await supabase
      .from('diet_meals')
      .select('foods, description')
      .not('foods', 'is', null)
      .limit(100)
    if (error || !data) return []

    const results = []
    const seen = new Set()
    const q = query.toLowerCase()

    for (const meal of data) {
      const foods = meal.foods || []
      if (!Array.isArray(foods)) continue
      for (const food of foods) {
        const name = food.name || food.nome || ''
        if (!name || !name.toLowerCase().includes(q)) continue
        if (seen.has(name.toLowerCase())) continue
        seen.add(name.toLowerCase())
        results.push({
          id: `diet_${name}`,
          name,
          brand: 'Piano alimentare',
          kcal_100g: food.kcal_100g || food.calorie || 0,
          proteins_100g: food.proteins_100g || food.proteine || 0,
          carbs_100g: food.carbs_100g || food.carboidrati || 0,
          fats_100g: food.fats_100g || food.grassi || 0,
          fiber_100g: food.fiber_100g || food.fibra || 0,
          source: 'diet',
        })
      }
    }
    return results.slice(0, 10)
  } catch { return [] }
}

// ─── 3. Recipes from ricette table ───────────────────────────────────────────
async function searchRicette(query) {
  try {
    const { data, error } = await supabase
      .from('ricette')
      .select('*')
      .ilike('nome', `%${query}%`)
      .limit(10)
    if (error || !data) return []

    return data.map(r => ({
      id: `ricetta_${r.id}`,
      name: r.nome || r.name || '',
      brand: '🍳 Ricetta',
      kcal_100g: r.calorie_porzione || r.calorie || r.kcal || 0,
      proteins_100g: r.proteine || r.proteins || 0,
      carbs_100g: r.carboidrati || r.carbs || 0,
      fats_100g: r.grassi || r.lipidi || r.fats || 0,
      fiber_100g: r.fibra || r.fiber || 0,
      source: 'recipe',
    })).filter(r => r.name)
  } catch { return [] }
}

// ─── 4. Open Food Facts ───────────────────────────────────────────────────────
export async function searchOpenFoodFacts(query) {
  try {
    const res = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&json=1&fields=product_name,nutriments,brands,code&page_size=20&lc=it&cc=it`,
      { signal: AbortSignal.timeout(8000) }
    )
    const data = await res.json()
    return (data.products || [])
      .filter(p => p.product_name && p.nutriments?.['energy-kcal_100g'])
      .map(p => ({
        id: p.code,
        name: p.product_name,
        brand: p.brands || '',
        kcal_100g: Math.round(p.nutriments['energy-kcal_100g'] || 0),
        proteins_100g: Math.round((p.nutriments['proteins_100g'] || 0) * 10) / 10,
        carbs_100g: Math.round((p.nutriments['carbohydrates_100g'] || 0) * 10) / 10,
        fats_100g: Math.round((p.nutriments['fat_100g'] || 0) * 10) / 10,
        fiber_100g: Math.round((p.nutriments['fiber_100g'] || 0) * 10) / 10,
        source: 'openfoodfacts',
      }))
  } catch { return [] }
}

// ─── Combined search ──────────────────────────────────────────────────────────
export async function searchFoods(query) {
  const [recent, dietMeals, ricette, off] = await Promise.allSettled([
    searchRecentFoods(query),
    searchDietMealFoods(query),
    searchRicette(query),
    searchOpenFoodFacts(query),
  ])

  const get = r => r.status === 'fulfilled' ? r.value : []

  const seen = new Set()
  const dedup = arr => arr.filter(f => {
    const k = f.name.toLowerCase().trim()
    if (!k || seen.has(k)) return false
    seen.add(k)
    return true
  })

  return [
    ...dedup(get(recent)),      // 🕐 mangiati di recente
    ...dedup(get(dietMeals)),   // 🥗 dalla dieta prescritta
    ...dedup(get(ricette)),     // 🍳 ricette
    ...dedup(get(off)),         // 🌍 Open Food Facts
  ]
}

// ─── Search database foods (alias for compatibility) ─────────────────────────
export async function searchDatabaseFoods(query) {
  const [a, b] = await Promise.allSettled([
    searchDietMealFoods(query),
    searchRicette(query),
  ])
  return [...(a.value || []), ...(b.value || [])]
}
