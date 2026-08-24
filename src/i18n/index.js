import { useAppSettings } from '../context/AppSettingsContext'
import translations from './translations'

const SETTINGS_KEY = 'nutriplan_app_settings'

function translate(lang, key, vars, fallback) {
  // Support both t('key', 'fallback') and t('key', { var: val }, 'fallback')
  let fb
  if (typeof vars === 'string') {
    fb = vars
  } else {
    fb = fallback
  }
  let str = (translations[lang]?.[key]) ?? (translations.it?.[key]) ?? fb ?? key
  // Simple {{var}} interpolation
  if (vars && typeof vars === 'object') {
    str = str.replace(/\{\{(\w+)\}\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : `{{${k}}}`))
  }
  return str
}

export function useT() {
  const { settings } = useAppSettings()
  const lang = settings?.language || 'it'
  return (key, vars, fallback) => translate(lang, key, vars, fallback)
}

/** Current language, read directly from localStorage (no React context). */
export function getLang() {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}').language || 'it'
  } catch {
    return 'it'
  }
}

/**
 * Standalone translator for code that runs outside the React tree
 * (pure modules, setTimeout-scheduled notifications, etc.) and therefore
 * can't call the useT() hook. Same lookup/interpolation logic, just reads
 * the language from localStorage instead of context.
 */
export function t(key, vars, fallback) {
  return translate(getLang(), key, vars, fallback)
}
