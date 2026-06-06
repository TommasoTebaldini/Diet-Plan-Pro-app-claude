import { supabase } from './supabase'

// ─── Shared food database (same as dietitian site: CREA + BDA + ONS + APROTEICI + FLAVIS + UPF) ──
let _allFoods = null
async function getAllFoods() {
  if (_allFoods) return _allFoods
  const mod = await import('../data/all-foods.js')
  _allFoods = mod.ALL_FOODS
  return _allFoods
}

async function searchAllFoods(query) {
  const q = query.toLowerCase().trim()
  if (!q) return []
  const ALL_FOODS = await getAllFoods()
  const tokens = q.split(/\s+/)
  const results = ALL_FOODS.filter(f => {
    if (!f?.name) return false
    const name = f.name.toLowerCase()
    return tokens.every(t => name.includes(t))
  })
  results.sort((a, b) => {
    const aStarts = (a.name || '').toLowerCase().startsWith(q) ? 0 : 1
    const bStarts = (b.name || '').toLowerCase().startsWith(q) ? 0 : 1
    return aStarts - bStarts
  })
  return results.map(f => ({ ...f, brand: `${f.src || 'CREA'} — ${f.category || 'Generico'}`, source: 'dietitian' }))
}

// ─── Foods added by the dietitian via database.html (shared via Supabase) ────
async function searchPublicFoods(query) {
  try {
    const { data } = await supabase
      .from('public_foods')
      .select('id, name, category, kcal_100g, proteins_100g, carbs_100g, fats_100g, fiber_100g, sugar_100g, fat_sat_100g, src, source_id')
      .ilike('name', `%${query}%`)
      .limit(20)
    if (!data?.length) return []
    return data.map(f => {
      // Static foods (CREA, BDA, UPF, …) have no source_id; custom dietitian foods do
      const isStatic = !f.source_id
      const srcLabel = isStatic
        ? `${f.src || 'CREA'} — ${f.category || 'Generico'}`
        : '🥗 Aggiunto dal dietista'
      return {
        id: `public_${f.id}`,
        name: f.name,
        brand: srcLabel,
        category: f.category || '',
        kcal_100g: f.kcal_100g || 0,
        proteins_100g: f.proteins_100g || 0,
        carbs_100g: f.carbs_100g || 0,
        fats_100g: f.fats_100g || 0,
        fiber_100g: f.fiber_100g || 0,
        sugar_100g: f.sugar_100g || 0,
        fatSat_100g: f.fat_sat_100g || 0,
        source: 'public',
      }
    })
  } catch { return [] }
}

// Recent foods from patient's own logs (fastest, most relevant)
async function searchRecentFoods(query) {
  try {
    const { data, error } = await supabase
      .from('food_logs')
      .select('food_name, kcal, proteins, carbs, fats, grams')
      .ilike('food_name', `%${query}%`)
      .neq('food_name', '__note__')
      .order('created_at', { ascending: false })
      .limit(20)
    if (error || !data?.length) return []
    const seen = new Map()
    for (const row of data) {
      if (seen.has(row.food_name)) continue
      const g = row.grams || 100
      seen.set(row.food_name, {
        id: `recent_${row.food_name}`,
        name: row.food_name,
        brand: '',
        kcal_100g: Math.round((row.kcal || 0) / g * 100),
        proteins_100g: Math.round((row.proteins || 0) / g * 1000) / 10,
        carbs_100g: Math.round((row.carbs || 0) / g * 1000) / 10,
        fats_100g: Math.round((row.fats || 0) / g * 1000) / 10,
        fiber_100g: 0,
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
      .from('diet_meals').select('foods').not('foods', 'is', null).limit(40)
    if (!data?.length) return []
    const seen = new Set()
    const results = []
    const q = query.toLowerCase()
    for (const meal of data) {
      if (!Array.isArray(meal.foods)) continue
      for (const food of meal.foods) {
        if (!food || typeof food !== 'object') continue
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

// Cached userId — avoids calling getSession() on every keystroke during search
let _cachedUserId = null
supabase.auth.onAuthStateChange((event, sess) => {
  _cachedUserId = sess?.user?.id ?? null
})
async function _getUserId() {
  if (_cachedUserId) return _cachedUserId
  const { data: { session } } = await supabase.auth.getSession()
  _cachedUserId = session?.user?.id ?? null
  return _cachedUserId
}

// Recipes table (own recipes only — public recipes saved by user become their own copy)
async function searchRicette(query) {
  try {
    const userId = await _getUserId()
    if (!userId) return []
    const { data } = await supabase.from('ricette')
      .select('*')
      .eq('user_id', userId)
      .ilike('nome', `%${query}%`)
      .limit(10)
    if (!data?.length) return []
    return data.map(r => {
      const porzG = r.peso_totale_g && r.porzioni ? Math.round(r.peso_totale_g / r.porzioni) : null
      return {
        id: `ricetta_${r.id}`, name: r.nome || '',
        brand: '🍳 Ricetta',
        kcal_100g: r.kcal_100g || 0,
        proteins_100g: r.proteins_100g || 0,
        carbs_100g: r.carbs_100g || 0,
        fats_100g: r.fats_100g || 0,
        fiber_100g: r.fibra || 0,
        source: 'recipe',
        serving_size_g: porzG || null,
        serving_size_label: 'porzione',
      }
    }).filter(r => r.name)
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

// Open Food Facts — Italian-first search with multiple endpoint fallbacks
function mapOFFProduct(p) {
  const n = p.nutriments || {}
  // Try kcal directly, then convert from kJ (1 kcal ≈ 4.184 kJ)
  const kcal = n['energy-kcal_100g']
    || (n['energy_100g'] ? Math.round(n['energy_100g'] / 4.184) : 0)
    || n['energy-kcal']
    || 0
  const name = p.product_name_it || p.product_name || p.product_name_en || ''
  return {
    id: p.code || p._id, name, brand: p.brands || '',
    kcal_100g: Math.round(kcal),
    proteins_100g: Math.round((n['proteins_100g'] || 0) * 10) / 10,
    carbs_100g: Math.round((n['carbohydrates_100g'] || 0) * 10) / 10,
    fats_100g: Math.round((n['fat_100g'] || 0) * 10) / 10,
    fatSat_100g: Math.round((n['saturated-fat_100g'] || 0) * 10) / 10 || null,
    sugar_100g: Math.round((n['sugars_100g'] || 0) * 10) / 10 || null,
    salt_100g: Math.round((n['salt_100g'] || 0) * 100) / 100 || null,
    fiber_100g: Math.round((n['fiber_100g'] || 0) * 10) / 10,
    source: 'openfoodfacts',
  }
}

function hasUsefulData(p) {
  const n = p.nutriments || {}
  const name = p.product_name_it || p.product_name || p.product_name_en || ''
  if (!name) return false
  return (
    n['energy-kcal_100g'] || n['energy_100g'] || n['energy-kcal'] ||
    n['proteins_100g'] || n['carbohydrates_100g'] || n['fat_100g']
  )
}

// AbortController wrapper — compatible with all browsers (no AbortSignal.timeout)
function _fetchTimeout(url, ms, opts = {}) {
  const ac = new AbortController()
  const tid = setTimeout(() => ac.abort(), ms)
  return fetch(url, { ...opts, signal: ac.signal })
    .then(r => { clearTimeout(tid); return r })
    .catch(e => { clearTimeout(tid); throw e })
}

export async function searchOpenFoodFacts(query) {
  const q = encodeURIComponent(query)
  const tokens = query.toLowerCase().split(/\s+/).filter(t => t.length > 1)

  const nameMatches = (p) => {
    const name = (p.product_name_it || p.product_name || p.product_name_en || '').toLowerCase()
    return tokens.length === 0 || tokens.some(t => name.includes(t))
  }
  const processResults = (data) =>
    (data.products || []).filter(hasUsefulData).filter(nameMatches).map(mapOFFProduct).filter(p => p.name)

  // Direct requests to world.openfoodfacts.org are CORS-blocked from vercel.app origin.
  // Route everything through the server-side proxy which uses Meilisearch as primary source.
  try {
    const res = await _fetchTimeout(`/api/off-proxy?q=${q}`, 10000)
    if (res.ok) {
      const data = await res.json()
      if (data._errors) console.warn('[OFF proxy] errors:', data._errors)
      const hits = processResults(data)
      if (hits.length > 0) return hits
    }
  } catch (e) { console.warn('[OFF proxy] failed:', e.message) }

  return []
}

function _dedup(results, seen) {
  const out = []
  for (const arr of results) {
    const items = arr.status === 'fulfilled' ? arr.value : []
    for (const food of items) {
      if (!food || typeof food !== 'object') continue
      const k = (food.name || '').toLowerCase().trim()
      if (!k || seen.has(k)) continue
      seen.add(k)
      out.push(food)
    }
  }
  return out
}

// Fast local-only search: returns in < 400ms without external API calls
export async function searchFoodsLocal(query) {
  const q = query.toLowerCase().trim()
  if (!q) return []
  const [a, b, c, d, e, f] = await Promise.allSettled([
    searchRecentFoods(q),
    searchRicette(q),
    searchDietMealFoods(q),
    searchCustomMeals(q),
    searchPublicFoods(q),
    searchAllFoods(q),
  ])
  const seen = new Set()
  return _dedup([a, b, c, d, e, f], seen).slice(0, 50)
}

export async function searchFoods(query) {
  const normalizedQuery = query.toLowerCase().trim()
  if (!normalizedQuery) return []

  const [a, b, c, d, e, f] = await Promise.allSettled([
    searchRecentFoods(normalizedQuery),
    searchRicette(normalizedQuery),
    searchDietMealFoods(normalizedQuery),
    searchCustomMeals(normalizedQuery),
    searchPublicFoods(normalizedQuery),
    searchAllFoods(normalizedQuery),
  ])
  const seen = new Set()
  const localItems = _dedup([a, b, c, d, e, f], seen)

  if (normalizedQuery.length < 3) {
    return localItems.slice(0, 50)
  }

  const offItems = await searchOpenFoodFacts(normalizedQuery)
  const extra = offItems.filter(food => {
    if (!food || typeof food !== 'object') return false
    const k = (food.name || '').toLowerCase().trim()
    if (!k || seen.has(k)) return false
    seen.add(k); return true
  })
  return [...localItems, ...extra].slice(0, 50)
}

export async function searchDatabaseFoods(query) {
  return searchDietMealFoods(query)
}

export async function searchByBarcode(barcode) {
  const bc = encodeURIComponent(barcode)
  try {
    const res = await _fetchTimeout(`/api/off-proxy?barcode=${bc}`, 10000)
    if (!res.ok) return null
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
      fatSat_100g: Math.round((n['saturated-fat_100g'] || 0) * 10) / 10 || null,
      sugar_100g: Math.round((n['sugars_100g'] || 0) * 10) / 10 || null,
      salt_100g: Math.round((n['salt_100g'] || 0) * 100) / 100 || null,
      fiber_100g: Math.round((n['fiber_100g'] || 0) * 10) / 10,
      source: 'openfoodfacts',
    }
  } catch { return null }
}
