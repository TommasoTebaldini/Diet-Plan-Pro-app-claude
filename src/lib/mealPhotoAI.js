// Analizza foto pasto tramite Supabase Edge Function (analyze-meal).
// La chiave AI (Gemini/Claude) è sul server — mai esposta nel browser.
//
// Setup una-tantum (lato server):
//   1. Apri Supabase Dashboard → Edge Functions → analyze-meal → Secrets
//   2. Aggiungi: GEMINI_API_KEY = <tua_chiave>  (gratis su aistudio.google.com)
//   3. supabase functions deploy analyze-meal

import { supabase } from './supabase'

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
  return 'image/jpeg'
}

export function isMealAIAvailable() {
  return true // always available — key lives on the server
}

export async function analyzeMealPhoto(file) {
  const image = await fileToBase64(file)
  const mediaType = getMimeType(file)

  const { data, error } = await supabase.functions.invoke('analyze-meal', {
    body: { image, mediaType },
  })

  if (error) {
    throw new Error(error.message || 'Errore Edge Function')
  }

  if (data?.error) {
    throw new Error(data.error)
  }

  if (!Array.isArray(data?.foods)) {
    throw new Error('Risposta non valida dal server')
  }

  return {
    foods: data.foods,
    description: data.description || '',
    confidence: data.confidence || 'media',
  }
}
