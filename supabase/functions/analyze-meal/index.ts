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

  // Parse body
  let body: { image?: string; mediaType?: string }
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Payload non valido' }, 400)
  }

  const { image, mediaType = 'image/jpeg' } = body
  if (!image) return json({ error: 'Immagine mancante' }, 400)

  // Try Gemini first (free), fall back to Claude
  let text: string
  const hasGemini = !!Deno.env.get('GEMINI_API_KEY')
  const hasClaude = !!Deno.env.get('ANTHROPIC_API_KEY')

  if (!hasGemini && !hasClaude) {
    return json({ error: 'Nessuna chiave AI configurata. Vai su Supabase → Settings → Edge Functions Secrets e aggiungi GEMINI_API_KEY.' }, 500)
  }

  try {
    text = hasGemini ? await callGemini(image, mediaType) : await callClaude(image, mediaType)
  } catch (e) {
    if (hasClaude && hasGemini) {
      // Gemini failed, try Claude
      try { text = await callClaude(image, mediaType) } catch (e2) {
        return json({ error: (e2 as Error).message }, 500)
      }
    } else {
      return json({ error: (e as Error).message }, 500)
    }
  }

  try {
    return json(parseResponse(text))
  } catch (e) {
    return json({ error: (e as Error).message }, 500)
  }
})
