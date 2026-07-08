// Supabase Edge Function: analyze-meal
// Analizza foto pasto con Google Gemini Flash (free tier) o Claude.
// La chiave API rimane sul server — non è mai esposta al browser.
//
// Setup:
//   supabase secrets set GEMINI_API_KEY=<tua_chiave_gemini>
//   (opzionale) supabase secrets set ANTHROPIC_API_KEY=<tua_chiave_claude>
//
// Deploy:
//   supabase functions deploy analyze-meal
//
// Google Gemini Flash free tier: 1500 richieste/giorno, 15 RPM, 1M tokens/mese

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

// Vision calls are the most expensive request this app makes to a paid AI API —
// cap per-user usage so a buggy client (or a stolen JWT) can't run up the bill.
const rateLimiter = createRateLimiter(10, 60_000)

const PROMPT = `Sei un esperto nutrizionista italiano. Analizza la foto del pasto e identifica tutti gli alimenti visibili.
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
Stima le porzioni in base alla dimensione visibile nel piatto. Usa i valori nutrizionali per 100g dal database CREA italiano.`

async function callGemini(imageBase64: string, mediaType: string) {
  const key = Deno.env.get('GEMINI_API_KEY')
  if (!key) throw new Error('GEMINI_API_KEY non configurata nel server Supabase')

  // Use gemini-2.0-flash-lite — free tier, fast, vision support
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${key}`

  const body = {
    contents: [{
      parts: [
        { text: PROMPT },
        { inlineData: { mimeType: mediaType, data: imageBase64 } },
      ],
    }],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 1024,
      responseMimeType: 'application/json',
    },
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
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
  return text
}

async function callGroq(imageBase64: string, mediaType: string): Promise<string> {
  const key = Deno.env.get('GROQ_API_KEY')
  if (!key) throw new Error('GROQ_API_KEY non configurata')

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: 'llama-3.2-11b-vision-preview',
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: PROMPT },
          { type: 'image_url', image_url: { url: `data:${mediaType};base64,${imageBase64}` } },
        ],
      }],
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

async function callClaude(imageBase64: string, mediaType: string) {
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
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: imageBase64 } },
          { type: 'text', text: 'Analizza questo pasto.' },
        ],
      }],
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
  // CORS preflight
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  // Auth: verify Supabase JWT
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return json({ error: 'Non autorizzato' }, 401)

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } },
  )
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return json({ error: 'Non autorizzato' }, 401)

  rateLimiter.prune()
  if (!rateLimiter.allow(user.id)) {
    return json({ error: 'Troppe richieste, riprova tra un minuto.' }, 429)
  }

  // Parse body
  let body: { image?: string; mediaType?: string }
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Payload non valido' }, 400)
  }

  const { image, mediaType = 'image/jpeg' } = body
  if (!image) return json({ error: 'Immagine mancante' }, 400)

  // Try available AI provider: Gemini → Groq → Claude
  let text: string
  const hasGemini = !!Deno.env.get('GEMINI_API_KEY')
  const hasGroq   = !!Deno.env.get('GROQ_API_KEY')
  const hasClaude = !!Deno.env.get('ANTHROPIC_API_KEY')

  if (!hasGemini && !hasGroq && !hasClaude) {
    return json({ error: 'Nessuna chiave AI configurata. Aggiungi GEMINI_API_KEY o GROQ_API_KEY nei segreti Supabase.' }, 500)
  }

  const providers: Array<() => Promise<string>> = []
  if (hasGemini) providers.push(() => callGemini(image, mediaType))
  if (hasGroq)   providers.push(() => callGroq(image, mediaType))
  if (hasClaude) providers.push(() => callClaude(image, mediaType))

  let lastError = ''
  for (const call of providers) {
    try { text = await call(); break } catch (e) { lastError = (e as Error).message }
  }
  if (!text!) return json({ error: lastError || 'Errore AI' }, 500)

  try {
    return json(parseResponse(text))
  } catch (e) {
    return json({ error: (e as Error).message }, 500)
  }
})
