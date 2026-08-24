// Import ricetta da URL o da foto — usa /api/fetch-page (proxy Vercel, evita
// CORS) per leggere una pagina web e la Edge Function extract-recipe (Gemini/
// Groq/Claude, stesso fallback di analyze-meal) per estrarne la struttura.
// Stesso schema di output di NutriPlan-Pro/ricette.html (importaRicetta):
// {nome, porzioni, categoria, ingredienti:[{nome,qt}], note} — così gli
// ingredienti si risolvono con la stessa resolveSharedIngredient già usata
// in RecipesPage.jsx per le ricette condivise dal dietista.
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

function htmlToText(html) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  doc.querySelectorAll('script,style,nav,header,footer,aside').forEach(el => el.remove())
  return (doc.body ? doc.body.textContent : '').replace(/\s+/g, ' ').trim().slice(0, 6000)
}

async function authHeader() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error(t('macro.session_expired', 'Sessione scaduta'))
  return { Authorization: `Bearer ${session.access_token}` }
}

async function fetchPageText(url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 15000)
  try {
    const res = await fetch('/api/fetch-page?url=' + encodeURIComponent(url), {
      signal: controller.signal,
      headers: await authHeader(),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
    const text = htmlToText(data.contents || '')
    if (text.length < 40) throw new Error(t('recipes.page_no_text', 'La pagina non contiene testo sufficiente per riconoscere una ricetta.'))
    return text
  } finally {
    clearTimeout(timer)
  }
}

function invokeExtract(body) {
  return supabase.functions.invoke('extract-recipe', { body }).then(({ data, error }) => {
    if (error) throw new Error(error.message || t('common.err_edge_function', 'Errore Edge Function'))
    if (data?.error) throw new Error(data.error)
    if (!Array.isArray(data?.ingredienti) || !data.ingredienti.length) {
      throw new Error(t('recipes.no_recipe_recognized', 'Nessuna ricetta riconosciuta.'))
    }
    return data
  })
}

export async function importRecipeFromUrl(url) {
  const text = await fetchPageText(url)
  return invokeExtract({ text })
}

export async function importRecipeFromPhoto(file) {
  const image = await fileToBase64(file)
  const mediaType = getMimeType(file)
  return invokeExtract({ image, mediaType })
}
