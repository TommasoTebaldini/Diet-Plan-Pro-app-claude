import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { execFileSync } from 'child_process'
import { existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── Plugin: sincronizza all-foods.js da NutriPlan-Pro/js/db.js prima di ogni build/dev ──
// Gira solo se il repo dietista è presente (locale). Su Vercel usa all-foods.js committato.
function syncFoodsPlugin() {
  return {
    name: 'sync-foods',
    buildStart() {
      const dbPath = resolve(__dirname, '../NutriPlan-Pro/js/db.js')
      const genScript = resolve(__dirname, 'generate-all-foods.cjs')
      if (existsSync(dbPath) && existsSync(genScript)) {
        console.log('[sync-foods] Rigenero all-foods.js da NutriPlan-Pro/js/db.js...')
        try {
          execFileSync('node', [genScript], { stdio: 'inherit' })
        } catch (e) {
          console.warn('[sync-foods] Rigenerazione fallita (non critico):', e.message)
        }
      }
    }
  }
}

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
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
          charts: ['recharts'],
          supabase: ['@supabase/supabase-js'],
          // Native-only (Health Connect/HealthKit) — only ever pulled in via
          // dynamic import() from pedometer.js on a native build. Without its
          // own chunk, Rollup was inlining it straight into the main entry,
          // shipping it to every plain-browser visitor for nothing.
          health: ['capacitor-health'],
        }
      }
    }
  },
  plugins: [
    syncFoodsPlugin(),
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      injectRegister: 'auto',
      registerType: 'autoUpdate',
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
      injectManifest: {
        globPatterns: ['**/*.{html,css,js,ico,png,svg,woff2,woff}'],
        // Questi chunk sono già lazy-loaded via import() dinamico (solo su
        // /quiz, scanner barcode, export PDF) — precacharli eagerly per OGNI
        // visitatore fin dalla prima visita vanificherebbe il lazy-loading
        // (~2MB extra scaricati anche da chi non apre mai quelle pagine).
        // Restano comunque cacheati normalmente dall'HTTP cache del browser
        // al primo uso (/assets/* ha Cache-Control immutable in vercel.json).
        globIgnores: ['**/all-foods*.js', '**/QuizPage-*.js', '**/BarcodeScanner-*.js', '**/jspdf*.js', '**/html2canvas*.js'],
      }
    })
  ]
})
