# NutriPlan – Patient App

Vite + React PWA for nutrition tracking, backed by Supabase.

## Stack
- React 18 + React Router 6
- Vite 5 (dev server on port 5000, host 0.0.0.0)
- Supabase (auth + database)
- vite-plugin-pwa (service worker / offline)
- framer-motion, recharts, lucide-react, jspdf

## Replit setup
- Workflow `Start application` runs `npm run dev` on port 5000.
- `vite.config.js` sets `server.host = 0.0.0.0`, `server.port = 5000`, and `allowedHosts: true` so the Replit preview iframe can connect.
- Vercel-specific files (`vercel.json`) remain in the repo but are not used.

## Environment variables (Replit Secrets)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Scripts
- `npm run dev` – start Vite dev server
- `npm run build` – production build to `dist/`
- `npm run preview` – serve the built bundle
