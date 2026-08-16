// api/food-swap.js — Vercel Serverless Function
// "Sostituisci in sicurezza": dato un alimento del piano prescritto che il
// paziente non ha a disposizione, genera 3 alternative nutrizionalmente
// equivalenti (stessi macro target) che rispettano le allergie/intolleranze
// registrate dal dietista sulla cartella collegata. Stesso schema di
// autenticazione di api/fetch-page.js (repo gemella NutriPlan-Pro, stesso
// progetto Supabase) — token utente verificato via /auth/v1/user, mai
// service role qui.
//
// Env richiesta: SUPABASE_URL, SUPABASE_ANON_KEY, GEMINI_API_KEY (Groq —
// stessa chiave gratuita già usata da NutriPlan-Pro/api/claude.js).

import { withErrorLogging, logServerError } from './_errorLog.js';

// Fallback ai nomi VITE_-prefixed: il progetto Vercel di questo repo ha solo
// VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY configurate (per il bundle client),
// non le versioni "server" senza prefisso — senza questo fallback la verifica
// del token utente falliva sempre silenziosamente (SUPABASE_URL/ANON_KEY
// undefined → verifySupabaseToken ritorna sempre null → 401).
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const MAX_TOKENS = 900;

// In-memoria per istanza, come api/fetch-page.js: bassa frequenza (un tasto
// premuto dal paziente per pasto), non serve un rate limiter distribuito.
const _rl = new Map();
const RL_MAX = 8;
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

// Le allergie/intolleranze/patologie sono compilate dal dietista sulla
// cartella del paziente (NutriPlan-Pro), non duplicate in questo progetto.
// Le leggiamo qui in sola lettura con il token dell'utente stesso (RLS:
// is_linked_patient/patient_dietitian_select_own), mai con la service role.
// Best-effort: se la query fallisce (paziente non ancora collegato a un
// dietista, o tabelle non presenti in questo Supabase project) proseguiamo
// senza lista esclusioni piuttosto che bloccare la feature.
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

// Contesto reale sull'utente oltre alle sole allergie: obiettivo dichiarato
// in onboarding (profiles.nutrition_goal, SEZIONE 54) + un riassunto fattuale
// degli ultimi 14 giorni di food_logs/weight_logs. Stesso schema di accesso
// di fetchPatientTags (token utente, mai service role), best-effort: un
// fallimento qui non deve mai bloccare la generazione delle alternative.
async function fetchRecentTrends(token, userId) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  const headers = { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${token}` };
  try {
    const since = new Date(Date.now() - 14 * 86400000).toISOString().slice(0, 10);
    const [logsRes, weightRes, profileRes] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/food_logs?user_id=eq.${userId}&date=gte.${since}&select=date,kcal,proteins,carbs,fats`, { headers }),
      fetch(`${SUPABASE_URL}/rest/v1/weight_logs?user_id=eq.${userId}&date=gte.${since}&select=date,weight_kg,weight&order=date.asc`, { headers }),
      fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=nutrition_goal`, { headers }),
    ]);
    const logs = logsRes.ok ? await logsRes.json() : [];
    const weights = weightRes.ok ? await weightRes.json() : [];
    const profiles = profileRes.ok ? await profileRes.json() : [];
    const goal = profiles?.[0]?.nutrition_goal || null;

    const daysWithLog = new Set((logs || []).map(l => l.date)).size;
    let avgLine = 'Nessuno storico di log disponibile ancora.';
    if (logs.length) {
      const totals = logs.reduce((a, l) => ({
        kcal: a.kcal + (+l.kcal || 0), prot: a.prot + (+l.proteins || 0),
        carbs: a.carbs + (+l.carbs || 0), fats: a.fats + (+l.fats || 0),
      }), { kcal: 0, prot: 0, carbs: 0, fats: 0 });
      const n = Math.max(1, daysWithLog);
      avgLine = `Negli ultimi 14 giorni ha registrato pasti in ${daysWithLog}/14 giorni, con una media di ~${Math.round(totals.kcal / n)} kcal, ${Math.round(totals.prot / n)}g proteine, ${Math.round(totals.carbs / n)}g carboidrati, ${Math.round(totals.fats / n)}g grassi nei giorni in cui ha registrato.`;
    }

    let weightLine = '';
    const wRows = (weights || []).map(w => +(w.weight_kg ?? w.weight)).filter(Number.isFinite);
    if (wRows.length >= 2) {
      const delta = wRows[wRows.length - 1] - wRows[0];
      const dir = delta < -0.3 ? 'in calo' : delta > 0.3 ? 'in aumento' : 'stabile';
      weightLine = ` Il peso nello stesso periodo è ${dir} (${delta > 0 ? '+' : ''}${delta.toFixed(1)}kg).`;
    }

    const GOAL_LABELS = { lose: 'perdere peso', maintain: 'mantenere il peso', gain: 'aumentare la massa' };
    const goalLine = goal && GOAL_LABELS[goal] ? `Obiettivo dichiarato dal paziente: ${GOAL_LABELS[goal]}.` : '';

    return [goalLine, avgLine + weightLine].filter(Boolean).join(' ');
  } catch {
    return null;
  }
}

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

async function handler(req, res) {
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
    return res.status(429).json({ error: 'Troppe richieste. Riprova tra un minuto.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API Key non configurata (GEMINI_API_KEY su Vercel).' });
  }

  const { name, quantity, unit, kcal, proteins, carbs, fats } = req.body || {};
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Parametro name mancante.' });
  }
  const safeName = name.trim().slice(0, 120);
  const safeQuantity = Number.isFinite(+quantity) ? +quantity : null;
  const safeUnit = typeof unit === 'string' ? unit.slice(0, 10) : 'g';
  const hasMacros = [kcal, proteins, carbs, fats].some(v => Number.isFinite(+v));

  const tags = await fetchPatientTags(token, user.id);
  const trendsLine = (await fetchRecentTrends(token, user.id)) || 'Nessuno storico di log disponibile ancora.';

  const macroLine = hasMacros
    ? `Valori nutrizionali dell'alimento originale a questa porzione — le alternative devono avvicinarsi il più possibile a questi valori (tolleranza ±15% circa): ${Number.isFinite(+kcal) ? Math.round(+kcal) + ' kcal, ' : ''}${Number.isFinite(+proteins) ? Math.round(+proteins) + 'g proteine, ' : ''}${Number.isFinite(+carbs) ? Math.round(+carbs) + 'g carboidrati, ' : ''}${Number.isFinite(+fats) ? Math.round(+fats) + 'g grassi' : ''}.`
    : `Valori nutrizionali dell'alimento originale non disponibili: stima tu i macro tipici per questo alimento e proponi porzioni equivalenti in energia e composizione.`;

  const exclusionLine = tags.length
    ? `Il paziente ha le seguenti allergie/intolleranze/condizioni registrate dal dietista (codici interni, interpretali per il loro significato clinico): ${tags.join(', ')}. Escludi TASSATIVAMENTE qualunque alimento in conflitto con una di queste condizioni, anche negli ingredienti nascosti (es. tracce, derivati).`
    : `Nessuna allergia/intolleranza registrata per questo paziente: non hai vincoli di esclusione oltre al buon senso clinico.`;

  const system = `Sei un assistente per un'app di nutrizione clinica italiana. Un paziente non ha a disposizione un alimento del suo piano alimentare prescritto e chiede 3 alternative sicure e nutrizionalmente equivalenti, da poter scegliere subito senza contattare il dietista.

Alimento da sostituire: "${safeName}"${safeQuantity ? ` (${safeQuantity}${safeUnit})` : ''}.
${macroLine}
${exclusionLine}
Contesto sulle abitudini recenti del paziente (usalo per proporre alternative realistiche rispetto a ciò che mangia di solito, non ripeterlo nella risposta): ${trendsLine}

Rispondi SOLO con un oggetto JSON valido (nessun testo fuori dal JSON), in questo formato esatto:
{"alternatives":[{"name":"nome alimento in italiano","quantity":123,"unit":"g","note":"perché è una buona alternativa, in una riga breve"}]}
Esattamente 3 alternative, concrete e facilmente reperibili al supermercato o al ristorante. Le quantità devono essere realistiche per l'unità indicata (g, ml, pz). Non includere MAI l'alimento originale o le sue varianti dirette (es. "pasta integrale" non è un'alternativa a "pasta di semola").`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: system }],
        max_tokens: MAX_TOKENS,
        temperature: 0.4,
        response_format: { type: 'json_object' },
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        return res.status(401).json({ error: 'Chiave API Groq non valida. Verifica GEMINI_API_KEY su Vercel.' });
      }
      return res.status(503).json({ error: data.error?.message || `Servizio AI non disponibile (HTTP ${response.status}).` });
    }

    const raw = data.choices?.[0]?.message?.content || '';
    let parsed;
    try { parsed = JSON.parse(raw); } catch { return res.status(502).json({ error: 'Risposta AI non in formato valido. Riprova.' }); }

    const alternatives = (Array.isArray(parsed.alternatives) ? parsed.alternatives : [])
      .filter(a => a && typeof a.name === 'string' && a.name.trim() && Number.isFinite(+a.quantity))
      .slice(0, 3)
      .map(a => ({
        name: a.name.trim().slice(0, 80),
        quantity: Math.max(1, Math.round(+a.quantity)),
        unit: typeof a.unit === 'string' && a.unit.trim() ? a.unit.trim().slice(0, 10) : 'g',
        note: typeof a.note === 'string' ? a.note.trim().slice(0, 200) : '',
      }));

    if (!alternatives.length) {
      return res.status(502).json({ error: 'Nessuna alternativa generata. Riprova.' });
    }

    return res.status(200).json({ alternatives, excludedTags: tags });
  } catch (err) {
    console.error('food-swap error:', err);
    await logServerError('food-swap', err, req).catch(() => {});
    return res.status(500).json({ error: 'Errore server: ' + err.message });
  }
}

export default withErrorLogging('food-swap', handler);
