import { createContext, useContext, useEffect, useState } from 'react'

const AppSettingsContext = createContext({})

export function AppSettingsProvider({ children }) {
  const [theme, setThemeState] = useState(() => localStorage.getItem('nutriplan_theme') || 'light')
  const [language, setLanguageState] = useState(() => localStorage.getItem('nutriplan_lang') || 'it')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('nutriplan_theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('nutriplan_lang', language)
  }, [language])

  // Apply saved theme immediately on first render
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [])

  function setTheme(t) {
    setThemeState(t)
  }

  function setLanguage(l) {
    setLanguageState(l)
  }

  return (
    <AppSettingsContext.Provider value={{ theme, setTheme, language, setLanguage }}>
      {children}
    </AppSettingsContext.Provider>
  )
}

export const useAppSettings = () => useContext(AppSettingsContext)
