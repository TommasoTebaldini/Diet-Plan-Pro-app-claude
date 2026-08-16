// api/fetch-page.js — Vercel Serverless Function
// Proxy per fetch di pagine web (risolve CORS per l'import ricette da URL in
// RecipesPage.jsx). Stessa protezione SSRF e stesso schema di autenticazione
// di NutriPlan-Pro/api/fetch-page.js (repo gemella, stesso progetto Supabase).

import dns from 'node:dns';
import { withErrorLogging, logServerError } from './_errorLog.js';
const dnsLookup = dns.promises.lookup;

// Fallback ai nomi VITE_-prefixed: il progetto Vercel di questo repo ha solo
// VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY configurate (per il bundle client),
// non le versioni "server" senza prefisso — senza questo fallback la verifica
// del token utente falliva sempre silenziosamente (SUPABASE_URL/ANON_KEY
// undefined → verifySupabaseToken ritorna sempre null → 401).
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

// Rate limiter in-memoria per istanza — vedi api/send-push.js per lo stesso
// pattern già in uso in questo repo. Non serve la variante distribuita
// (Upstash) di NutriPlan-Pro: questo endpoint è a bassa frequenza (un import
// ricetta alla volta, non un'AI chiamata ad ogni tasto).
const _rl = new Map();
const RL_MAX = 15;
const RL_WIN = 60_000;
function rateLimit(userId) {
  const now = Date.now();
  const e = _rl.get(userId);
  if (!e || now - e.t > RL_WIN) { _rl.set(userId, { n: 1, t: now }); return true; }
  if (e.n >= RL_MAX) return false;
  e.n++;
  return true;
}

const PRIVATE_IP_PATTERNS = [
  /^0\./, /^127\./, /^10\./, /^172\.(1[6-9]|2\d|3[01])\./, /^192\.168\./,
  /^169\.254\./, /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./,
  /^::1$/, /^fc00:/i, /^fe80:/i,
];
function isPrivateIp(ip) {
  const normalized = ip.replace(/^::ffff:/i, '');
  return PRIVATE_IP_PATTERNS.some(re => re.test(normalized));
}
function isPrivateHost(hostname) {
  return isPrivateIp(hostname) || hostname === 'localhost';
}
async function resolvesToPrivateIp(hostname) {
  if (isPrivateHost(hostname)) return true;
  try {
    const records = await dnsLookup(hostname, { all: true, verbatim: true });
    return records.some(r => isPrivateIp(r.address));
  } catch {
    return true;
  }
}

const _tkCache = new Map();
async function verifySupabaseToken(token) {
  const now = Date.now();
  const cached = _tkCache.get(token);
  if (cached && now < cached.exp) return cached.user;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { Authorization: `Bearer ${token}`, apikey: SUPABASE_ANON_KEY },
  });
  if (!res.ok) { _tkCache.delete(token); return null; }
  const user = await res.json();
  if (user?.id) {
    if (_tkCache.size > 200) {
      for (const [k, v] of _tkCache) if (v.exp < now) _tkCache.delete(k);
    }
    _tkCache.set(token, { user, exp: now + 60_000 });
  }
  return user;
}

async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Non autorizzato: token mancante.' });
  }
  const token = authHeader.slice(7);
  const user = await verifySupabaseToken(token);
  if (!user?.id) {
    return res.status(401).json({ error: 'Non autorizzato: sessione non valida.' });
  }
  if (!rateLimit(user.id)) {
    return res.status(429).json({ error: 'Troppe richieste. Riprova tra un minuto.' });
  }

  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Parametro url mancante' });

  let parsedUrl;
  try {
    parsedUrl = new URL(url);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return res.status(400).json({ error: 'Protocollo non supportato' });
    }
  } catch {
    return res.status(400).json({ error: 'URL non valido' });
  }

  if (await resolvesToPrivateIp(parsedUrl.hostname)) {
    return res.status(400).json({ error: 'URL non consentito' });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NutriPlanApp/1.0)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'it-IT,it;q=0.9',
      },
    });
    clearTimeout(timeout);

    if (!response.ok) return res.status(response.status).json({ error: `HTTP ${response.status}` });

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) {
      return res.status(400).json({ error: 'La pagina non è HTML' });
    }

    const html = await response.text();
    return res.status(200).json({ contents: html, url });
  } catch (err) {
    if (err.name === 'AbortError') {
      return res.status(408).json({ error: 'Timeout: la pagina ha impiegato troppo a rispondere' });
    }
    await logServerError('fetch-page', err, req).catch(() => {});
    return res.status(500).json({ error: 'Errore fetch: ' + err.message });
  }
}

export default withErrorLogging('fetch-page', handler);
