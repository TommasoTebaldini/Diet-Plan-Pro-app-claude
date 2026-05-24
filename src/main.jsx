import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { AppSettingsProvider } from './context/AppSettingsContext'
import './index.css'

// Unregister any leftover service workers (selfDestroying build handles new installs)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(r => r.unregister()))
}

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
