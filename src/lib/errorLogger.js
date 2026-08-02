// Cattura automatica di errori JS non gestiti e promise rejection non gestite,
// registrati sulla tabella condivisa `client_errors` (Supabase). Sostituto
// leggero di un servizio esterno tipo Sentry: nessun costo/account terzo,
// serve solo a far emergere errori silenziosi in produzione. Letto solo dagli
// admin (RLS in supabase-schema.sql / supabase_setup.sql, sezione "schema_migrations
// + client_errors").
import { supabase } from './supabase'

const MAX_PER_SESSION = 20 // evita di floodare la tabella in caso di errore ripetuto in loop
let sent = 0
const seen = new Set()

async function logClientError(level, message, stack) {
  if (sent >= MAX_PER_SESSION) return
  const key = `${level}|${message || ''}`.slice(0, 300)
  if (seen.has(key)) return
  seen.add(key)
  sent++
  try {
    const { data: { user } = {} } = await supabase.auth.getUser()
    await supabase.from('client_errors').insert({
      app: 'diet-plan-pro-app',
      level,
      message: String(message || '(nessun messaggio)').slice(0, 2000),
      stack: stack ? String(stack).slice(0, 4000) : null,
      page_url: window.location.href,
      user_id: user?.id || null,
      user_email: user?.email || null,
      user_agent: navigator.userAgent,
    })
  } catch { /* silenzioso: un logger di errori non deve mai generare altri errori */ }
}

export function installErrorLogger() {
  window.addEventListener('error', e => {
    logClientError('error', e.message, e.error?.stack)
  })
  window.addEventListener('unhandledrejection', e => {
    const reason = e.reason
    logClientError('unhandledrejection', reason?.message || String(reason), reason?.stack)
  })
}
