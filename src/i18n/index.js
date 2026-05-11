import { useAppSettings } from '../context/AppSettingsContext'
import translations from './translations'

export function useT() {
  const { settings } = useAppSettings()
  const lang = settings?.language || 'it'
  return function t(key, vars, fallback) {
    // Support both t('key', 'fallback') and t('key', { var: val }, 'fallback')
    let str, fb
    if (typeof vars === 'string') {
      str = undefined
      fb = vars
    } else {
      str = undefined
      fb = fallback
    }
    str = (translations[lang]?.[key]) ?? (translations.it?.[key]) ?? fb ?? key
    // Simple {{var}} interpolation
    if (vars && typeof vars === 'object') {
      str = str.replace(/\{\{(\w+)\}\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : `{{${k}}}`))
    }
    return str
  }
}
