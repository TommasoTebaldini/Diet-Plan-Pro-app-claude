# Setup Push Notifications

## 1. Genera chiavi VAPID

Installa `web-push` globalmente (o usa npx) e genera le chiavi:

```bash
npx web-push generate-vapid-keys
```

Output esempio:
```
Public Key: BNxxx...
Private Key: xxx...
```

## 2. Configura le variabili d'ambiente

### .env.local (app paziente)
```
VITE_VAPID_PUBLIC_KEY=<Public Key sopra>
```

### Vercel (dashboard → Settings → Environment Variables)
```
VAPID_PUBLIC_KEY=<Public Key>
VAPID_PRIVATE_KEY=<Private Key>
VAPID_CONTACT_EMAIL=tua@email.com
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...  (Settings → API → service_role)
```

## 3. Installa web-push nelle API

Nel `package.json` aggiungi nelle `dependencies`:
```json
"web-push": "^3.6.7"
```

Poi `npm install`.

## 4. Esegui le SQL migration su Supabase

Copia ed esegui nel Supabase SQL Editor:
- `src/sql/push_notifications_migration.sql`
- `src/sql/achievements_checkin_migration.sql`
- `src/sql/mealplanner_migration.sql`

## 5. Come inviare una push dal server

```bash
curl -X POST https://tua-app.vercel.app/api/send-push \
  -H "Content-Type: application/json" \
  -d '{"userId":"uuid-paziente","title":"Test","body":"Funziona!"}'
```
