// Analizza foto pasto tramite Supabase Edge Function (analyze-meal).
// La chiave AI (Gemini/Claude) è sul server — mai esposta nel browser.
//
// Setup una-tantum (lato server):
//   1. Apri Supabase Dashboard → Edge Functions → analyze-meal → Secrets
//   2. Aggiungi: GEMINI_API_KEY = <tua_chiave>  (gratis su aistudio.google.com)
//   3. supabase functions deploy analyze-meal

import { supabase } from './supabase'
import { t } from '../i18n'

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function getMimeType(file) {
  const fileType = file.type
  if (fileType === 'image/png') return 'image/png'
  if (fileType === 'image/webp') return 'image/webp'
  return 'image/jpeg'
}

const MAX_DIMENSION = 1280 // px, lato più lungo
const JPEG_QUALITY = 0.82

/**
 * Ridimensiona/comprime la foto lato client prima di inviarla. Prima, una
 * foto scattata dalla fotocamera (facilmente 10-20MB in HEIC/JPEG ad alta
 * risoluzione) veniva mandata all'Edge Function senza alcun limite —
 * rallentava l'invio e consumava la quota mensile (150 foto/mese) più in
 * fretta del necessario. L'analisi non ha bisogno di più di ~1280px per
 * riconoscere gli alimenti nel piatto. Se il canvas fallisce per qualsiasi
 * motivo (formato non decodificabile dal browser, ecc.), si procede con il
 * file originale invece di bloccare l'utente.
 */
async function compressImage(file) {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') return file
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
    if (scale >= 1 && file.size <= 2 * 1024 * 1024) {
      bitmap.close?.()
      return file // già abbastanza piccola, non ricomprimere inutilmente
    }
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close?.()
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY))
    if (!blob) return file
    return new File([blob], file.name || 'meal.jpg', { type: 'image/jpeg' })
  } catch {
    return file
  }
}

export function isMealAIAvailable() {
  return true // always available — key lives on the server
}

export async function analyzeMealPhoto(rawFile) {
  const file = await compressImage(rawFile)
  const image = await fileToBase64(file)
  const mediaType = getMimeType(file)

  const { data, error } = await supabase.functions.invoke('analyze-meal', {
    body: { image, mediaType },
  })

  if (error) {
    throw new Error(error.message || t('common.err_edge_function', 'Errore Edge Function'))
  }

  if (data?.error) {
    throw new Error(data.error)
  }

  if (!Array.isArray(data?.foods)) {
    throw new Error(t('common.err_invalid_server_response', 'Risposta non valida dal server'))
  }

  return {
    foods: data.foods,
    description: data.description || '',
    confidence: data.confidence || 'media',
    // Mappa {indice: motivo} — alimenti da limitare in base alle patologie del
    // paziente (arricchimento RAG best-effort, vedi analyze-meal/index.ts).
    // Assente/vuota se NUTRIPLAN_API_URL non è configurato server-side.
    conflicts: data.conflicts || {},
  }
}
