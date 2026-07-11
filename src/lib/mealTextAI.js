// Logging in linguaggio naturale del pasto ("ho mangiato una mela e del
// pollo") tramite Supabase Edge Function (analyze-meal-text) — stessa
// pipeline AI di mealPhotoAI.js (analyze-meal), stesse chiavi server-side,
// solo testo invece di un'immagine. La chiave AI resta sul server.

import { supabase } from './supabase'

export async function analyzeMealText(text) {
  const trimmed = (text || '').trim()
  if (!trimmed) throw new Error('Descrivi cosa hai mangiato')

  const { data, error } = await supabase.functions.invoke('analyze-meal-text', {
    body: { text: trimmed },
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
