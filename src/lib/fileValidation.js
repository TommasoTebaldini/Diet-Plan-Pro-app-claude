// Validazione client-side (difesa in profondità, non l'unica barriera — i
// bucket Supabase Storage vanno comunque configurati con allowed_mime_types
// lato server) per ogni upload di immagine avviato dall'utente: prima di
// questa validazione, l'unico controllo era l'attributo HTML accept="image/*"
// (solo un suggerimento per il file picker, bypassabile da devtools/drag&drop/
// fetch) e, per l'avatar, un limite di dimensione senza verifica del tipo.

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const DEFAULT_MAX_BYTES = 8 * 1024 * 1024 // 8 MB

/**
 * Ritorna null se il file è un'immagine valida, altrimenti una stringa
 * identificativa dell'errore ('invalid_type' | 'too_large') da mappare a un
 * messaggio tradotto nel punto di chiamata.
 */
export function validateImageFile(file, { maxBytes = DEFAULT_MAX_BYTES } = {}) {
  if (!file) return 'no_file'
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return 'invalid_type'
  if (file.size > maxBytes) return 'too_large'
  return null
}
