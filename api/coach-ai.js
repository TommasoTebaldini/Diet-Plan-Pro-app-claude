// api/coach-ai.js — Vercel Serverless Function
// Coach AI conversazionale: un assistente nutrizionale generico a cui il
// paziente può fare domande libere (distinto dal parser dei pasti e dal
// "sostituisci in sicurezza" di api/food-swap.js, che restano invariati).
// Stesso schema di autenticazione/rate-limit/contesto di api/food-swap.js —
// vedi quel file per i commenti di dettaglio sulle scelte di sicurezza.
//
// Env richiesta: SUPABASE_URL, SUPABASE_ANON_KEY, GEMINI_API_KEY (Groq —
// stessa chiave già usata da food-swap.js e da NutriPlan-Pro/api/claude.js).

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const MAX_TOKENS = 700;
const MAX_HISTORY_MESSAGES = 12; // ultimi N turni inviati al modello, limita costo/contesto
const MAX_MESSAGE_LEN = 2000;

// Conversazionale: più permissivo del singolo tasto "sostituisci" di food-swap.
const _rl = new Map();
const RL_MAX = 20;
const RL_WIN = 60_000;
function rateLimit(userId) {
  const now = Date.now();
  const e = _rl.get(userId);
  if (!e || now - e.t > RL_WIN) { _rl.set(userId, { n: 1, t: now }); return true; }
  if (e.n >= RL_MAX) return false;
  e.n++;
  return true;
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

// Stesso approccio di fetchPatientTags in food-swap.js: sola lettura con il
// token dell'utente stesso (RLS), mai service role. Best-effort.
async function fetchPatientTags(token, userId) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return [];
  const headers = { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${token}` };
  try {
    const linkRes = await fetch(
      `${SUPABASE_URL}/rest/v1/patient_dietitian?patient_id=eq.${userId}&select=cartella_id&limit=5`,
      { headers }
    );
    if (!linkRes.ok) return [];
    const links = await linkRes.json();
    const cartellaIds = [...new Set((links || []).map(l => l.cartella_id).filter(Boolean))];
    if (!cartellaIds.length) return [];

    const cartRes = await fetch(
      `${SUPABASE_URL}/rest/v1/cartelle?id=in.(${cartellaIds.join(',')})&select=tags`,
      { headers }
    );
    if (!cartRes.ok) return [];
    const cartelle = await cartRes.json();
    const tags = new Set();
    for (const c of cartelle || []) {
      for (const t of Array.isArray(c.tags) ? c.tags : []) tags.add(String(t));
    }
    return [...tags];
  } catch {
    return [];
  }
}

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

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
    return res.status(429).json({ error: 'Troppe richieste. Aspetta un minuto prima di continuare la conversazione.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API Key non configurata (GEMINI_API_KEY su Vercel).' });
  }

  const rawMessages = Array.isArray(req.body?.messages) ? req.body.messages : null;
  if (!rawMessages || !rawMessages.length) {
    return res.status(400).json({ error: 'Parametro messages mancante.' });
  }

  const history = rawMessages
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .slice(-MAX_HISTORY_MESSAGES)
    .map(m => ({ role: m.role, content: m.content.trim().slice(0, MAX_MESSAGE_LEN) }));

  if (!history.length || history[history.length - 1].role !== 'user') {
    return res.status(400).json({ error: 'L\'ultimo messaggio deve essere dell\'utente.' });
  }

  const tags = await fetchPatientTags(token, user.id);
  const exclusionLine = tags.length
    ? `Il paziente ha le seguenti allergie/intolleranze/condizioni registrate dal suo dietista (codici interni, interpretali per il loro significato clinico): ${tags.join(', ')}. Tienile sempre presenti nei tuoi consigli, non suggerire mai alimenti in conflitto con una di queste.`
    : `Nessuna allergia/intolleranza registrata per questo paziente.`;

  const system = `Sei il Coach AI di DietPlan Pro, un assistente nutrizionale amichevole e competente all'interno dell'app. Rispondi in italiano a domande libere su alimentazione, abitudini alimentari, idratazione, integrazione, gestione del peso — in modo pratico, chiaro e basato su evidenze scientifiche aggiornate.

${exclusionLine}

Regole importanti:
- NON sei un medico e non fai diagnosi: per sintomi, dubbi clinici, terapie farmacologiche o condizioni patologiche specifiche, invita sempre a contattare il proprio dietista o medico tramite la chat dell'app, invece di dare un parere clinico definitivo.
- Non prescrivere piani alimentari dettagliati o target calorici precisi: quello resta compito del dietista che segue il paziente — puoi dare indicazioni generali ed educative.
- Risposte concise e colloquiali (indicativamente sotto le 150 parole), a meno che l'utente chieda esplicitamente più dettaglio.`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: system }, ...history],
        max_tokens: MAX_TOKENS,
        temperature: 0.6,
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        return res.status(401).json({ error: 'Chiave API Groq non valida. Verifica GEMINI_API_KEY su Vercel.' });
      }
      return res.status(503).json({ error: data.error?.message || `Servizio AI non disponibile (HTTP ${response.status}).` });
    }

    const reply = (data.choices?.[0]?.message?.content || '').trim();
    if (!reply) {
      return res.status(502).json({ error: 'Risposta AI vuota. Riprova.' });
    }

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('coach-ai error:', err);
    return res.status(500).json({ error: 'Errore server: ' + err.message });
  }
}
