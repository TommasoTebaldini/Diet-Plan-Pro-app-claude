// Analyzes a meal photo using Claude Vision API and returns structured food data.
// Requires VITE_ANTHROPIC_API_KEY in .env.local

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY

export function isMealAIAvailable() {
  return !!API_KEY
}

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function getMimeType(file) {
  const t = file.type
  if (t === 'image/png') return 'image/png'
  if (t === 'image/webp') return 'image/webp'
  if (t === 'image/gif') return 'image/gif'
  return 'image/jpeg'
}

const SYSTEM_PROMPT = `Sei un esperto nutrizionista italiano. Analizza la foto del pasto e identifica tutti gli alimenti visibili.
Rispondi SOLO con un JSON valido (nessun testo prima o dopo) nel seguente formato:
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

export async function analyzeMealPhoto(file) {
  if (!API_KEY) {
    throw new Error('Chiave API Anthropic mancante. Aggiungi VITE_ANTHROPIC_API_KEY in .env.local')
  }

  const base64 = await fileToBase64(file)
  const mediaType = getMimeType(file)

  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType, data: base64 },
          },
          {
            type: 'text',
            text: 'Analizza questo pasto e fornisci i dati nutrizionali stimati.',
          },
        ],
      }],
    }),
  })

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Errore API: ${resp.status}`)
  }

  const data = await resp.json()
  const text = data.content?.[0]?.text || ''

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Risposta AI non valida')

  const parsed = JSON.parse(jsonMatch[0])
  if (!Array.isArray(parsed.foods)) throw new Error('Formato risposta non valido')

  return {
    foods: parsed.foods.map(f => ({
      name: f.name || 'Alimento sconosciuto',
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
