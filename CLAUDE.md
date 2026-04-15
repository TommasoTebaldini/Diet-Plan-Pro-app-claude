# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server at http://localhost:5173
npm run build      # Build production bundle to /dist
npm run preview    # Preview production build locally
```

No test or lint scripts are configured.

## Environment Setup

Create `.env.local` in the project root:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

## Architecture Overview

**NutriPlan** is a patient-facing nutrition tracking PWA (installable on iOS/Android/Desktop). It pairs with a separate dietitian admin panel (`Diet-Plan-Pro`) that shares the same Supabase project.

**Stack:** React 18 + Vite 5, React Router v6, Supabase (auth + PostgreSQL + Realtime), Framer Motion, Recharts, jsPDF, vite-plugin-pwa (Workbox).

**Styling:** Custom CSS with CSS variables only — no Tailwind or CSS-in-JS. Dark mode, high contrast, and text-size scaling are implemented via CSS variable swaps stored in `localStorage`. Global styles in `src/index.css`.

### Entry & Provider Chain

```
index.html → src/main.jsx
  └─ AppSettingsContext (dark mode, text size, high contrast)
       └─ AuthContext (session, profile, isDietitian)
            └─ NotificationContext (Supabase Realtime subscriptions)
                 └─ App.jsx (Router + route guards)
```

### Route Guards

Three custom wrappers in `src/App.jsx`:
- `PrivateRoute` — requires login
- `PublicRoute` — redirects logged-in users to `/`
- `PatientRoute` — redirects dietitians to `/dietitian/chat`

### State Management

React Context API only (no Redux/Zustand). There are three contexts:
- `src/context/AuthContext.jsx` — user session, profile, login/logout
- `src/context/AppSettingsContext.jsx` — UI preferences (persisted to `localStorage`)
- `src/context/NotificationContext.jsx` — Supabase Realtime subscriptions

### Supabase Data Model

Key tables (defined in `supabase-schema.sql`):
- `profiles` — extends `auth.users`; has `role: 'patient' | 'dietitian'`
- `patient_diets` → `diet_meals` (meals with `foods` JSONB array) — prescribed plans
- `food_logs` — individual food entries logged by patients
- `daily_logs` — cached macro totals per day
- `water_logs`, `daily_wellness`, `custom_foods`, `custom_meals`
- `chat_messages`, `patient_documents`, `appointments`, `ricette`

All tables use Row Level Security — users only access their own rows.

### Food Search (`src/lib/foodSearch.js`)

`searchFoods()` queries 6 sources in priority order, then deduplicates by lowercase name:
1. Embedded dietitian DB (`src/data/foods.js` — 400+ curated Italian foods, 115 KB)
2. User's recent food logs
3. Foods from the patient's prescribed diet
4. Recipes table (`ricette`)
5. User's custom meals
6. Open Food Facts API (4-tier fallback: IT region → Meilisearch → World+Italy tag → World)

### PWA / Service Worker

Configured in `vite.config.js` via `vite-plugin-pwa`. Workbox strategy:
- Static assets (JS, CSS, fonts, images) → cache-first
- Supabase API calls → network-first with 10s timeout

Run `node generate-icons.js` to regenerate the PWA icon set.

### Biometric Auth

`src/lib/biometric.js` uses WebAuthn (Touch ID / Face ID). Credential IDs are stored in `localStorage` after initial email login. Subsequent logins verify the credential without a password.

### Localization

All UI text is in Italian. Meal type keys use Italian names: `colazione`, `spuntino_mattina`, `pranzo`, `spuntino_pomeriggio`, `cena`. Open Food Facts queries prefer the Italian (`it`) region.

### Macro Calculations

Foods store macros per 100g. Portions are calculated as `(grams / 100) * macro_per_100g`. Display: proteins/carbs/fats rounded to 1 decimal, kcal rounded to integer.

## Key Files

| File | Purpose |
|---|---|
| `src/lib/supabase.js` | Supabase client initialization |
| `src/lib/foodSearch.js` | Multi-source food search (most complex file) |
| `src/lib/notifications.js` | Local notification scheduling + push setup |
| `src/lib/biometric.js` | WebAuthn credential management |
| `src/data/foods.js` | Embedded dietitian food database |
| `src/index.css` | All global styles, CSS variables, dark mode |
| `vite.config.js` | Vite + PWA plugin + Workbox cache config |
| `vercel.json` | SPA routing fallback + security headers |
| `supabase-schema.sql` | Full DB schema with RLS policies |
