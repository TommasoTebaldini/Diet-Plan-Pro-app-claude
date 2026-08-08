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

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

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
    return res.status(500).json({ error: 'Errore server: ' + err.message });
  }
}
