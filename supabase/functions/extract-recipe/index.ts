// Supabase Edge Function: extract-recipe
// Estrae una ricetta strutturata (nome, porzioni, ingredienti, note) da:
//   - testo (già estratto lato client dalla pagina web via /api/fetch-page —
//     vedi RecipesPage.jsx), oppure
//   - una foto (es. una pagina di ricettario o un appunto scritto a mano)
// Stesso schema di output di NutriPlan-Pro/ricette.html (importaRicetta), così
// gli ingredienti estratti si possono risolvere con la stessa logica già
// usata in RecipesPage.jsx per le ricette condivise dal dietista
// (resolveSharedIngredient: {nome, qt} → alimento nel DB + macro).
// Stesso fallback Gemini→Groq→Claude e stessa autenticazione/rate-limit di
// analyze-meal / analyze-meal-text — nessun secret nuovo da configurare.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createRateLimiter } from '../_shared/rateLimit.ts'
import { checkMonthlyQuota } from '../_shared/monthlyQuota.ts'

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

const rateLimiter = createRateLimiter(10, 60_000)

const PROMPT = `Sei un esperto di cucina italiana. Estrai la ricetta dal contenuto fornito (testo di una pagina web di ricette, oppure foto di una pagina di ricettario/appunto scritto a mano).
Rispondi SOLO con un JSON valido (nessun testo prima o dopo) nel formato:
{
  "nome": "nome ricetta",
  "porzioni": 4,
  "categoria": "Primo piatto",
  "ingredienti": [{"nome": "pasta", "qt": "80"}],
  "note": "breve nota di preparazione (2-3 frasi)"
}
Categorie possibili: Primo piatto, Secondo piatto, Contorno, Colazione, Spuntino, Dessert, Altro.
Le quantità (qt) devono essere in grammi, come stringa numerica (stima quantità tipiche italiane se non specificate).
Se il contenuto non descrive chiaramente una ricetta, rispondi con ingredienti: [].`

async function callGeminiText(text: string) {
  const key = Deno.env.get('GEMINI_API_KEY')
  if (!key) throw new Error('GEMINI_API_KEY non configurata nel server Supabase')
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${key}`
  const body = {
    contents: [{ parts: [{ text: `${PROMPT}\n\nContenuto:\n${text}` }] }],
    generationConfig: { temperature: 0.2, maxOutputTokens: 1024, responseMimeType: 'application/json' },
  }
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: { message?: string } })?.error?.message || `Gemini error ${res.status}`)
  }
  const data = await res.json() as { candidates?: { content?: { parts?: { text?: string }[] } }[] }
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

async function callGeminiImage(imageBase64: string, mediaType: string) {
  const key = Deno.env.get('GEMINI_API_KEY')
  if (!key) throw new Error('GEMINI_API_KEY non configurata nel server Supabase')
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${key}`
  const body = {
    contents: [{ parts: [{ text: PROMPT }, { inlineData: { mimeType: mediaType, data: imageBase64 } }] }],
    generationConfig: { temperature: 0.2, maxOutputTokens: 1024, responseMimeType: 'application/json' },
  }
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: { message?: string } })?.error?.message || `Gemini error ${res.status}`)
  }
  const data = await res.json() as { candidates?: { content?: { parts?: { text?: string }[] } }[] }
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

async function callGroq(text?: string, image?: string, mediaType?: string): Promise<string> {
  const key = Deno.env.get('GROQ_API_KEY')
  if (!key) throw new Error('GROQ_API_KEY non configurata')
  const content = image
    ? [{ type: 'text', text: PROMPT }, { type: 'image_url', image_url: { url: `data:${mediaType};base64,${image}` } }]
    : `${PROMPT}\n\nContenuto:\n${text}`
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: image ? 'meta-llama/llama-4-scout-17b-16e-instruct' : 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content }],
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

async function callClaude(text?: string, image?: string, mediaType?: string) {
  const key = Deno.env.get('ANTHROPIC_API_KEY')
  if (!key) throw new Error('ANTHROPIC_API_KEY non configurata nel server Supabase')
  const content = image
    ? [{ type: 'image', source: { type: 'base64', media_type: mediaType, data: image } }, { type: 'text', text: 'Estrai la ricetta da questa immagine.' }]
    : text!
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 1024, system: PROMPT, messages: [{ role: 'user', content }] }),
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
    nome?: string
    porzioni?: number
    categoria?: string
    ingredienti?: { nome?: string; qt?: string }[]
    note?: string
  }
  if (!Array.isArray(parsed.ingredienti) || !parsed.ingredienti.length) {
    throw new Error('Nessuna ricetta riconosciuta nel contenuto fornito')
  }
  return {
    nome: (parsed.nome || 'Ricetta importata').slice(0, 120),
    porzioni: Math.max(1, Math.round(parsed.porzioni || 4)),
    categoria: parsed.categoria || 'Altro',
    ingredienti: parsed.ingredienti
      .filter(i => i && i.nome)
      .map(i => ({ nome: String(i.nome).slice(0, 80), qt: String(parseFloat(String(i.qt)) || 100) })),
    note: (parsed.note || '').slice(0, 500),
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return json({ error: 'Non autorizzato' }, 401)

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
  // Tetto mensile duraturo per utente (vedi _shared/monthlyQuota.ts).
  if (!(await checkMonthlyQuota(supabase, user.id, 'ai_calls', 300))) {
    return json({ error: 'Hai raggiunto il limite di richieste AI incluse per questo mese. Il conteggio si azzera a inizio mese.' }, 429)
  }

  let body: { text?: string; image?: string; mediaType?: string }
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Payload non valido' }, 400)
  }

  const text = body.text ? String(body.text).trim().slice(0, 6000) : undefined
  const image = body.image
  const mediaType = body.mediaType || 'image/jpeg'
  if (!text && !image) return json({ error: 'Testo o immagine mancante' }, 400)

  const hasGemini = !!Deno.env.get('GEMINI_API_KEY')
  const hasGroq   = !!Deno.env.get('GROQ_API_KEY')
  const hasClaude = !!Deno.env.get('ANTHROPIC_API_KEY')
  if (!hasGemini && !hasGroq && !hasClaude) {
    return json({ error: 'Nessuna chiave AI configurata. Aggiungi GEMINI_API_KEY o GROQ_API_KEY nei segreti Supabase.' }, 500)
  }

  const providers: Array<() => Promise<string>> = []
  if (image) {
    if (hasGemini) providers.push(() => callGeminiImage(image, mediaType))
    if (hasGroq)   providers.push(() => callGroq(undefined, image, mediaType))
    if (hasClaude) providers.push(() => callClaude(undefined, image, mediaType))
  } else {
    if (hasGemini) providers.push(() => callGeminiText(text!))
    if (hasGroq)   providers.push(() => callGroq(text))
    if (hasClaude) providers.push(() => callClaude(text))
  }

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
