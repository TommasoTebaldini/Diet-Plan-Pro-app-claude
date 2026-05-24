import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { AppSettingsProvider } from './context/AppSettingsContext'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

// Registra il SW in modalità silenziosa — nessun reload automatico.
// Il SW nuovo aspetta che tutti i tab siano chiusi prima di attivarsi.
registerSW({ immediate: false })

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
