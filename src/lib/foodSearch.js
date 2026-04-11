import { supabase } from './supabase'

// ─── Discover food table schema dynamically ───────────────────────────────────
// The dietitian site uses CREA 2019 + BDA INRAN — likely table "alimenti"
// We try multiple possible schemas and return the first that works

const FOOD_TABLE_CANDIDATES = [
  // Italian names (CREA/BDA INRAN standard)
  {
    table: 'alimenti',
    name: ['nome', 'alimento', 'descrizione'],
    kcal: ['calorie', 'energia_kcal', 'energia', 'kcal', 'energia_kj'],
    proteins: ['proteine', 'protidi', 'proteine_totali'],
    carbs: ['carboidrati', 'glucidi', 'carboidrati_disponibili', 'zuccheri_totali'],
    fats: ['lipidi', 'grassi', 'lipidi_totali', 'grassi_totali'],
    fiber: ['fibra', 'fibra_totale', 'fibra_alimentare'],
  },
  // English names
  {
    table: 'foods',
    name: ['name', 'food_name', 'description'],
    kcal: ['calories_per_100g', 'calories', 'kcal', 'energy_kcal', 'calorie'],
    proteins: ['proteins_per_100g', 'proteins', 'protein'],
    carbs: ['carbs_per_100g', 'carbs', 'carbohydrates'],
    fats: ['fats_per_100g', 'fats', 'fat'],
    fiber: ['fiber_per_100g', 'fiber', 'fibre'],
  },
  { table: 'food_items', name: ['name', 'food_name'], kcal: ['calories', 'kcal'], proteins: ['proteins', 'protein'], carbs: ['carbs', 'carbohydrates'], fats: ['fats', 'fat'], fiber: ['fiber'] },
  { table: 'ingredients', name: ['name', 'nome'], kcal: ['calories', 'calorie', 'kcal'], proteins: ['proteins', 'proteine'], carbs: ['carbs', 'carboidrati'], fats: ['fats', 'lipidi'], fiber: ['fiber', 'fibra'] },
  { table: 'food_database', name: ['name', 'nome'], kcal: ['calories', 'calorie'], proteins: ['proteins', 'proteine'], carbs: ['carbs', 'carboidrati'], fats: ['fats', 'lipidi'], fiber: ['fiber', 'fibra'] },
]

let _cachedSchema = null

async function discoverSchema() {
  if (_cachedSchema) return _cachedSchema
  for (const candidate of FOOD_TABLE_CANDIDATES) {
    try {
      const { data, error } = await supabase.from(candidate.table).select('*').limit(1)
      if (error || !data || data.length === 0) continue
      const row = data[0]
      const keys = Object.keys(row)
      const find = (arr) => arr.find(k => keys.includes(k)) || null
      const schema = {
        table: candidate.table,
        nameCol: find(candidate.name),
        kcalCol: find(candidate.kcal),
        proteinsCol: find(candidate.proteins),
        carbsCol: find(candidate.carbs),
        fatsCol: find(candidate.fats),
        fiberCol: find(candidate.fiber),
      }
      if (schema.nameCol && schema.kcalCol) {
        _cachedSchema = schema
        console.log('Food schema discovered:', schema)
        return schema
      }
    } catch { /* try next */ }
  }
  return null
}

function mapRow(row, schema) {
  const get = (col) => col ? (parseFloat(row[col]) || 0) : 0
  return {
    id: `db_${row.id || row.codice || Math.random()}`,
    name: row[schema.nameCol] || '',
    brand: row.brand || row.marca || row.categoria || '',
    kcal_100g: Math.round(get(schema.kcalCol)),
    proteins_100g: Math.round(get(schema.proteinsCol) * 10) / 10,
    carbs_100g: Math.round(get(schema.carbsCol) * 10) / 10,
    fats_100g: Math.round(get(schema.fatsCol) * 10) / 10,
    fiber_100g: Math.round(get(schema.fiberCol) * 10) / 10,
    source: 'database',
  }
}

export async function searchDatabaseFoods(query) {
  const schema = await discoverSchema()
  if (!schema) return []
  try {
    const { data, error } = await supabase
      .from(schema.table)
      .select('*')
      .ilike(schema.nameCol, `%${query}%`)
      .limit(20)
    if (error || !data) return []
    return data.map(row => mapRow(row, schema))
  } catch { return [] }
}

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

export async function searchFoods(query) {
  const [db, off] = await Promise.allSettled([
    searchDatabaseFoods(query),
    searchOpenFoodFacts(query),
  ])
  const dbResults = db.status === 'fulfilled' ? db.value : []
  const offResults = off.status === 'fulfilled' ? off.value : []
  // DB results first, deduplicated by name
  const seen = new Set(dbResults.map(f => f.name.toLowerCase()))
  const filtered = offResults.filter(f => !seen.has(f.name.toLowerCase()))
  return [...dbResults, ...filtered]
}
