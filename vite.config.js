import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
    headers: {
      'Cache-Control': 'no-store'
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
          charts: ['recharts'],
          supabase: ['@supabase/supabase-js'],
        }
      }
    }
  },
  plugins: [
    react(),
    VitePWA({
      injectRegister: null,
      registerType: 'prompt',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'NutriPlan – Il tuo piano nutrizionale',
        short_name: 'NutriPlan',
        description: 'Visualizza le tue diete, traccia i macro e monitora l\'idratazione',
        theme_color: '#1a7f5a',
        background_color: '#f8faf9',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        shortcuts: [
          {
            name: 'Registra pasto',
            short_name: 'Pasto',
            description: 'Aggiungi alimenti al diario',
            url: '/macro',
            icons: [{ src: 'icons/icon-96x96.png', sizes: '96x96', type: 'image/png' }],
          },
          {
            name: 'Acqua',
            short_name: 'Acqua',
            description: 'Registra idratazione',
            url: '/acqua',
            icons: [{ src: 'icons/icon-96x96.png', sizes: '96x96', type: 'image/png' }],
          },
          {
            name: 'Attività fisica',
            short_name: 'Attività',
            description: 'Contapassi e attività',
            url: '/attivita',
            icons: [{ src: 'icons/icon-96x96.png', sizes: '96x96', type: 'image/png' }],
          },
          {
            name: 'Chat dietista',
            short_name: 'Chat',
            description: 'Messaggia con il tuo dietista',
            url: '/chat',
            icons: [{ src: 'icons/icon-96x96.png', sizes: '96x96', type: 'image/png' }],
          },
        ],
        icons: [
          { src: 'icons/icon-72x72.png', sizes: '72x72', type: 'image/png' },
          { src: 'icons/icon-96x96.png', sizes: '96x96', type: 'image/png' },
          { src: 'icons/icon-128x128.png', sizes: '128x128', type: 'image/png' },
          { src: 'icons/icon-144x144.png', sizes: '144x144', type: 'image/png' },
          { src: 'icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
          { src: 'icons/icon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: 'icons/icon-384x384.png', sizes: '384x384', type: 'image/png' },
          { src: 'icons/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{html,css,js,ico,png,svg,woff2}'],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: { cacheName: 'supabase-cache', networkTimeoutSeconds: 3 }
          },
          {
            urlPattern: /\.(?:js|css)$/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'static-assets', cacheableResponse: { statuses: [0, 200] } }
          }
        ]
      }
    })
  ]
})
