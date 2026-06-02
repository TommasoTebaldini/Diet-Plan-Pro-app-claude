import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import './index.css'

// NOTE: vite-plugin-pwa con registerType:'autoUpdate' gestisce già il reload
// quando il service worker si aggiorna. NON aggiungere un secondo listener
// controllerchange qui — causerebbe un loop di refresh infinito.

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
