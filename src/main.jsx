import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { AppSettingsProvider } from './context/AppSettingsContext'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

// ── Cache-bust: se il bundle è cambiato, cancella cache SW e ricarica ──────────
// BUILD_ID è iniettato da Vite (cambia ad ogni build) ed è usato per rilevare
// quando il codice è aggiornato. Al primo run dopo un nuovo deploy, cancella
// tutte le cache e ricarica per ottenere il codice fresco da Vercel.
const BUILD_ID = __BUILD_ID__
;(async () => {
  const stored = localStorage.getItem('_bid')
  if (stored && stored !== BUILD_ID) {
    localStorage.setItem('_bid', BUILD_ID)
    try {
      if ('caches' in window) {
        const keys = await caches.keys()
        await Promise.all(keys.map(k => caches.delete(k)))
      }
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations()
        await Promise.all(regs.map(r => r.unregister()))
      }
    } catch (_) {}
    window.location.reload()
    return
  }
  localStorage.setItem('_bid', BUILD_ID)
})()

// Registra il service worker e forza il reload della pagina quando
// viene distribuita una nuova versione (evita cache stale del bundle JS)
registerSW({ immediate: true })

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppSettingsProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </AppSettingsProvider>
    </BrowserRouter>
  </React.StrictMode>
)
