import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { AppSettingsProvider } from './context/AppSettingsContext'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

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
