// Supabase Edge Function: analyze-meal-text
// Come analyze-meal (stesso schema di output, stesso fallback Gemini→Groq→Claude,
// stessa autenticazione/rate-limit), ma per testo libero invece di una foto —
// logging vocale/testuale in linguaggio naturale ("ho mangiato una mela e
// del pollo alla griglia") invece di dover cercare ogni alimento a mano.
// Il testo può arrivare sia digitato sia dettato (Web Speech API lato client,
// che produce già testo prima di arrivare qui — nessuna trascrizione server-side).
//
// Setup: stesse chiavi già configurate per analyze-meal (nessun secret nuovo)
//   supabase functions deploy analyze-meal-text

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

// Testo, non vision: più economico della foto, ma resta una chiamata AI a
// pagamento — stesso limite prudenziale di analyze-meal.
const rateLimiter = createRateLimiter(15, 60_000)

const PROMPT = `Sei un esperto nutrizionista italiano. L'utente descrive a voce o per iscritto, in linguaggio naturale e colloquiale italiano, cosa ha mangiato. Estrai OGNI alimento citato e stima porzioni realistiche in grammi usando quantità tipiche italiane quando non specificate (es. "un piatto di pasta" ≈ 80g pasta secca, "una mela" ≈ 150g, "una fetta di pane" ≈ 30g, "un petto di pollo" ≈ 150g).
Rispondi SOLO con un JSON valido (nessun testo prima o dopo) nel formato:
{
  "foods": [
    {
      "name": "nome alimento in italiano",
      "grams": 150,
      "kcal_100g": 250,
      "proteins_100g": 10,
      "carbs_100g": 30,
      "fats_100g": 8
    }
  ],
  "meal_description": "descrizione breve del pasto",
  "confidence": "alta|media|bassa"
}
Usa i valori nutrizionali per 100g dal database CREA italiano. Se il testo non descrive alimenti riconoscibili, rispondi con foods: [] e confidence: "bassa".`

async function callGemini(text: string) {
  const key = Deno.env.get('GEMINI_API_KEY')
  if (!key) throw new Error('GEMINI_API_KEY non configurata nel server Supabase')

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${key}`
  const body = {
    contents: [{ parts: [{ text: `${PROMPT}\n\nTesto utente: "${text}"` }] }],
    generationConfig: { temperature: 0.2, maxOutputTokens: 1024, responseMimeType: 'application/json' },
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: { message?: string } })?.error?.message || `Gemini error ${res.status}`)
  }
  const data = await res.json() as { candidates?: { content?: { parts?: { text?: string }[] } }[] }
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

async function callGroq(text: string): Promise<string> {
  const key = Deno.env.get('GROQ_API_KEY')
  if (!key) throw new Error('GROQ_API_KEY non configurata')

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: PROMPT },
        { role: 'user', content: text },
      ],
      max_tokens: 1024,
      temperature: 0.2,
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: { message?: string } })?.error?.message || `Groq error ${res.status}`)
  }
  const data = await res.json() as { choices?: { message?: { content?: string } }[] }
  return data.choices?.[0]?.message?.content || ''
}

async function callClaude(text: string) {
  const key = Deno.env.get('ANTHROPIC_API_KEY')
  if (!key) throw new Error('ANTHROPIC_API_KEY non configurata nel server Supabase')

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: PROMPT,
      messages: [{ role: 'user', content: text }],
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: { message?: string } })?.error?.message || `Claude error ${res.status}`)
  }
  const data = await res.json() as { content?: { text?: string }[] }
  return data.content?.[0]?.text || ''
}

function parseResponse(text: string) {
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Risposta AI non valida')
  const parsed = JSON.parse(match[0]) as {
    foods?: { name?: string; grams?: number; kcal_100g?: number; proteins_100g?: number; carbs_100g?: number; fats_100g?: number }[]
    meal_description?: string
    confidence?: string
  }
  if (!Array.isArray(parsed.foods)) throw new Error('Formato risposta non valido')
  return {
    foods: parsed.foods.map(f => ({
      name: f.name || 'Alimento',
      grams: Math.max(1, Math.round(f.grams || 100)),
      kcal_100g: Math.max(0, Math.round(f.kcal_100g || 0)),
      proteins_100g: Math.max(0, Math.round((f.proteins_100g || 0) * 10) / 10),
      carbs_100g: Math.max(0, Math.round((f.carbs_100g || 0) * 10) / 10),
      fats_100g: Math.max(0, Math.round((f.fats_100g || 0) * 10) / 10),
    })),
    description: parsed.meal_description || '',
    confidence: parsed.confidence || 'media',
  }
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

  let body: { text?: string }
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Payload non valido' }, 400)
  }

  const text = (body.text || '').trim().slice(0, 500) // stesso limite di buon senso di un messaggio vocale/testuale
  if (!text) return json({ error: 'Testo mancante' }, 400)

  const hasGemini = !!Deno.env.get('GEMINI_API_KEY')
  const hasGroq   = !!Deno.env.get('GROQ_API_KEY')
  const hasClaude = !!Deno.env.get('ANTHROPIC_API_KEY')

  if (!hasGemini && !hasGroq && !hasClaude) {
    return json({ error: 'Nessuna chiave AI configurata. Aggiungi GEMINI_API_KEY o GROQ_API_KEY nei segreti Supabase.' }, 500)
  }

  const providers: Array<() => Promise<string>> = []
  if (hasGemini) providers.push(() => callGemini(text))
  if (hasGroq)   providers.push(() => callGroq(text))
  if (hasClaude) providers.push(() => callClaude(text))

  let result: string | undefined
  let lastError = ''
  for (const call of providers) {
    try { result = await call(); break } catch (e) { lastError = (e as Error).message }
  }
  if (!result) return json({ error: lastError || 'Errore AI' }, 500)

  try {
    return json(parseResponse(result))
  } catch (e) {
    return json({ error: (e as Error).message }, 500)
  }
})
