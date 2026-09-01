// api/fetch-page.js — Vercel Serverless Function
// Proxy per fetch di pagine web (risolve CORS per l'import ricette da URL in
// RecipesPage.jsx). Stessa protezione SSRF e stesso schema di autenticazione
// di NutriPlan-Pro/api/fetch-page.js (repo gemella, stesso progetto Supabase).

import dns from 'node:dns';
import http from 'node:http';
import https from 'node:https';
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

// Blocklist of private/internal IP ranges to prevent SSRF
const PRIVATE_IP_PATTERNS = [
  /^0\./,                             // "this" network
  /^127\./,                          // loopback
  /^10\./,                           // RFC1918
  /^172\.(1[6-9]|2\d|3[01])\./,     // RFC1918
  /^192\.168\./,                     // RFC1918
  /^169\.254\./,                     // link-local / cloud metadata (AWS/GCP/Azure)
  /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./,  // CGNAT RFC6598
  /^::1$/,                           // IPv6 loopback
  /^f[cd][0-9a-f]{0,2}:/i,           // IPv6 ULA (fc00::/7 — fd00::/8 is what's
                                      // actually assigned in practice)
  /^fe80:/i,                         // IPv6 link-local
];

// Normalizza IPv4-mapped IPv6 (::ffff:127.0.0.1 → 127.0.0.1), incluse le
// varianti che Node può restituire in forma esadecimale pura
// (::ffff:7f00:1, stessa entità di 127.0.0.1) a seconda di come arriva
// l'input — solo la forma "dotted" veniva gestita in precedenza.
function isPrivateIp(ip) {
  let normalized = ip.replace(/^::ffff:/i, '');
  const hexMatch = normalized.match(/^([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i);
  if (hexMatch) {
    const hi = parseInt(hexMatch[1], 16);
    const lo = parseInt(hexMatch[2], 16);
    normalized = [hi >> 8, hi & 0xff, lo >> 8, lo & 0xff].join('.');
  }
  return PRIVATE_IP_PATTERNS.some(re => re.test(normalized));
}

function isPrivateHost(hostname) {
  return isPrivateIp(hostname) || hostname === 'localhost';
}

// Protezione SSRF contro DNS rebinding: un lookup DNS separato per validare
// l'hostname, seguito da un secondo lookup implicito dentro fetch()/http
// per la connessione vera, può restituire IP diversi (TTL bassissimo o DNS
// server malevolo) — un IP pubblico alla validazione, un IP privato/interno
// alla connessione reale. Qui si risolve UNA VOLTA, si validano TUTTI gli
// indirizzi restituiti, e la richiesta si connette esplicitamente al primo
// IP già validato invece di ri-risolvere l'hostname (vedi pinnedRequest
// sotto) — l'hostname originale resta usato per l'header Host e per
// l'SNI/verifica del certificato TLS.
async function resolveValidatedIp(hostname) {
  if (isPrivateHost(hostname)) return null;
  let records;
  try {
    records = await dnsLookup(hostname, { all: true, verbatim: true });
  } catch {
    return null; // dominio non risolvibile → non consentito
  }
  if (!records.length || records.some(r => isPrivateIp(r.address))) return null;
  return records[0].address;
}

// Richiesta HTTP(S) "pinnata" al preciso IP già validato da
// resolveValidatedIp, evitando che Node risolva di nuovo l'hostname in fase
// di connessione. Per HTTPS, servername forza comunque l'SNI e la verifica
// del certificato sull'hostname reale (non sull'IP) — la connessione è
// pinnata, la sicurezza TLS resta quella corretta.
function pinnedRequest(urlObj, ip, signal) {
  return new Promise((resolve, reject) => {
    const isHttps = urlObj.protocol === 'https:';
    const mod = isHttps ? https : http;
    const req = mod.request({
      hostname: ip,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'Host': urlObj.hostname,
        'User-Agent': 'Mozilla/5.0 (compatible; NutriPlanApp/1.0)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'it-IT,it;q=0.9',
      },
      servername: isHttps ? urlObj.hostname : undefined,
      signal,
    }, resp => {
      const chunks = [];
      resp.on('data', c => chunks.push(c));
      resp.on('end', () => resolve({
        status: resp.statusCode,
        headers: resp.headers,
        text: () => Buffer.concat(chunks).toString('utf-8'),
      }));
      resp.on('error', reject);
    });
    req.on('error', reject);
    req.end();
  });
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

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    let response;
    try {
      // redirect seguiti manualmente e ri-validati (IP pinnato) ad ogni hop:
      // altrimenti un sito esterno consentito potrebbe rispondere con un 3xx
      // verso 169.254.169.254 (metadata cloud) o localhost/10.x e la
      // richiesta lo seguirebbe automaticamente, bypassando la protezione.
      let currentUrl = parsedUrl;
      let hops = 0;
      const MAX_REDIRECTS = 5;
      for (;;) {
        if (!['http:', 'https:'].includes(currentUrl.protocol)) {
          return res.status(400).json({ error: 'Protocollo non supportato' });
        }
        const validatedIp = await resolveValidatedIp(currentUrl.hostname);
        if (!validatedIp) {
          return res.status(400).json({ error: 'URL non consentito' });
        }

        response = await pinnedRequest(currentUrl, validatedIp, controller.signal);

        if ([301, 302, 303, 307, 308].includes(response.status)) {
          const location = response.headers.location;
          if (!location || ++hops > MAX_REDIRECTS) {
            return res.status(400).json({ error: 'Troppi redirect o redirect senza destinazione' });
          }
          try {
            currentUrl = new URL(location, currentUrl);
          } catch {
            return res.status(400).json({ error: 'Redirect verso un URL non valido' });
          }
          continue;
        }
        break;
      }
    } finally {
      clearTimeout(timeout);
    }

    if (response.status < 200 || response.status >= 300) {
      return res.status(response.status).json({ error: `HTTP ${response.status}` });
    }

    const contentType = response.headers['content-type'] || '';
    if (!contentType.includes('text/html')) {
      return res.status(400).json({ error: 'La pagina non è HTML' });
    }

    const html = response.text();
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
