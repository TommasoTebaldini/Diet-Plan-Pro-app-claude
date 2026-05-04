import { useAppSettings } from '../context/AppSettingsContext'
import translations from './translations'

export function useT() {
  const { settings } = useAppSettings()
  const lang = settings?.language || 'it'
  return function t(key, fallback) {
    return (translations[lang]?.[key]) ?? (translations.it?.[key]) ?? fallback ?? key
  }
}
