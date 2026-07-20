// Supabase Edge Function: daily-tips
// Genera 2-3 suggerimenti nutrizionali personalizzati basati sui dati di ieri.
//
// Setup:
//   supabase secrets set GEMINI_API_KEY=<chiave>
//   (opzionale) supabase secrets set GROQ_API_KEY=<chiave>
//   supabase functions deploy daily-tips
//
// Chiamata: POST /functions/v1/daily-tips
// Headers: Authorization: Bearer <supabase-jwt>

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createRateLimiter } from '../_shared/rateLimit.ts'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
}

// This only needs to run once a day per user in normal use — cap it so a buggy
// client polling in a loop can't run up the AI API bill.
const rateLimiter = createRateLimiter(10, 60_000)

function yesterday() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

async function callGemini(prompt: string): Promise<string> {
  const key = Deno.env.get('GEMINI_API_KEY')
  if (!key) throw new Error('GEMINI_API_KEY non configurata')
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${key}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 512, responseMimeType: 'application/json' },
    }),
  })
  if (!res.ok) throw new Error(`Gemini error ${res.status}`)
  const data = await res.json() as { candidates?: { content?: { parts?: { text?: string }[] } }[] }
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

async function callGroq(prompt: string): Promise<string> {
  const key = Deno.env.get('GROQ_API_KEY')
  if (!key) throw new Error('GROQ_API_KEY non configurata')
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 512,
      temperature: 0.4,
    }),
  })
  if (!res.ok) throw new Error(`Groq error ${res.status}`)
  const data = await res.json() as { choices?: { message?: { content?: string } }[] }
  return data.choices?.[0]?.message?.content || ''
}

function buildPrompt(ctx: {
  date: string
  kcal: number; proteins: number; carbs: number; fats: number
  sugar: number; fiber: number
  waterMl: number
  mood: number | null
  targetKcal: number | null; targetProt: number | null
  topFoods: string[]
}) {
  const lines = [
    `Data: ${ctx.date}`,
    `Calorie: ${ctx.kcal} kcal${ctx.targetKcal ? ` (obiettivo: ${ctx.targetKcal})` : ''}`,
    `Proteine: ${ctx.proteins}g${ctx.targetProt ? ` (obiettivo: ${ctx.targetProt}g)` : ''}`,
    `Carboidrati: ${ctx.carbs}g  Grassi: ${ctx.fats}g`,
    `Zuccheri semplici: ${ctx.sugar}g  Fibra: ${ctx.fiber}g`,
    `Acqua: ${ctx.waterMl}ml`,
    ctx.mood ? `Umore: ${ctx.mood}/5` : '',
    ctx.topFoods.length ? `Alimenti principali: ${ctx.topFoods.join(', ')}` : '',
  ].filter(Boolean).join('\n')

  return `Sei un nutrizionista italiano esperto e empatico. Analizza i dati nutrizionali di ieri del paziente e genera esattamente 2 o 3 suggerimenti pratici e personalizzati.

Dati di ieri:
${lines}

Rispondi SOLO con un JSON valido in questo formato (nessun testo prima o dopo):
{
  "tips": [
    {
      "category": "macros|sugar|hydration|protein|fiber|habit|mood",
      "icon": "<un emoji pertinente>",
      "title": "<titolo breve max 6 parole>",
      "text": "<consiglio pratico e specifico basato sui dati, max 2 frasi>"
    }
  ]
}

Regole:
- Fai riferimento ai valori specifici (es. "hai consumato 45g di zuccheri")
- Sii concreto e positivo, non generico
- Se i valori sono buoni, fallo notare e suggerisci come mantenerli
- Max 3 suggerimenti`
}

function parseResponse(text: string) {
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Risposta AI non valida')
  const parsed = JSON.parse(match[0]) as {
    tips?: { category?: string; icon?: string; title?: string; text?: string }[]
  }
  if (!Array.isArray(parsed.tips)) throw new Error('Formato risposta non valido')
  return parsed.tips.slice(0, 3).map(t => ({
    category: t.category || 'habit',
    icon: t.icon || '💡',
    title: t.title || 'Suggerimento',
    text: t.text || '',
  }))
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return json({ error: 'Non autorizzato' }, 401)

  // Migrazione chiavi: publishable key nuova se presente, altrimenti anon legacy.
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SB_PUBLISHABLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } },
  )

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return json({ error: 'Non autorizzato' }, 401)

  rateLimiter.prune()
  if (!rateLimiter.allow(user.id)) {
    return json({ error: 'Troppe richieste, riprova tra un minuto.' }, 429)
  }

  const yest = yesterday()

  // Fetch all data in parallel
  const [logsRes, waterRes, wellnessRes, dietRes] = await Promise.all([
    supabase.from('food_logs').select('food_name,grams,kcal,proteins,carbs,fats,food_data').eq('user_id', user.id).eq('date', yest).neq('food_name', '__note__'),
    supabase.from('water_logs').select('amount_ml').eq('user_id', user.id).eq('date', yest),
    supabase.from('daily_wellness').select('mood').eq('user_id', user.id).eq('date', yest).maybeSingle(),
    supabase.from('patient_diets').select('kcal_target,protein_target').eq('user_id', user.id).eq('is_active', true).maybeSingle(),
  ])

  const logs = logsRes.data || []
  if (logs.length === 0) {
    return json({ tips: [], noData: true, date: yest })
  }

  const totals = logs.reduce((a, f) => ({
    kcal: a.kcal + (f.kcal || 0),
    proteins: a.proteins + (f.proteins || 0),
    carbs: a.carbs + (f.carbs || 0),
    fats: a.fats + (f.fats || 0),
    sugar: a.sugar + ((f.food_data?.sugar_100g || 0) * (f.grams || 100) / 100),
    fiber: a.fiber + ((f.food_data?.fiber_100g || 0) * (f.grams || 100) / 100),
  }), { kcal: 0, proteins: 0, carbs: 0, fats: 0, sugar: 0, fiber: 0 })

  const waterMl = (waterRes.data || []).reduce((s, w) => s + w.amount_ml, 0)
  const topFoods = [...new Set(logs.slice(0, 6).map(f => f.food_name))]

  const prompt = buildPrompt({
    date: yest,
    kcal: Math.round(totals.kcal),
    proteins: Math.round(totals.proteins * 10) / 10,
    carbs: Math.round(totals.carbs * 10) / 10,
    fats: Math.round(totals.fats * 10) / 10,
    sugar: Math.round(totals.sugar * 10) / 10,
    fiber: Math.round(totals.fiber * 10) / 10,
    waterMl,
    mood: wellnessRes.data?.mood ?? null,
    targetKcal: dietRes.data?.kcal_target ?? null,
    targetProt: dietRes.data?.protein_target ?? null,
    topFoods,
  })

  let text: string
  const hasGemini = !!Deno.env.get('GEMINI_API_KEY')
  const hasGroq = !!Deno.env.get('GROQ_API_KEY')

  if (!hasGemini && !hasGroq) {
    return json({ error: 'Nessuna chiave AI configurata. Aggiungi GEMINI_API_KEY o GROQ_API_KEY nei segreti Supabase.' }, 500)
  }

  try {
    text = hasGemini ? await callGemini(prompt) : await callGroq(prompt)
  } catch {
    if (hasGroq && hasGemini) {
      try { text = await callGroq(prompt) } catch (e2) {
        return json({ error: (e2 as Error).message }, 500)
      }
    } else {
      return json({ error: 'Errore AI' }, 500)
    }
  }

  try {
    const tips = parseResponse(text)
    return json({ tips, date: yest })
  } catch {
    return json({ error: 'Parsing risposta AI fallito' }, 500)
  }
})
