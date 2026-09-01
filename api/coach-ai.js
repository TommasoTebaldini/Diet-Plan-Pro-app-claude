// api/coach-ai.js — Vercel Serverless Function
// Coach AI conversazionale: un assistente nutrizionale generico a cui il
// paziente può fare domande libere (distinto dal parser dei pasti e dal
// "sostituisci in sicurezza" di api/food-swap.js, che restano invariati).
// Stesso schema di autenticazione/rate-limit/contesto di api/food-swap.js —
// vedi quel file per i commenti di dettaglio sulle scelte di sicurezza.
//
// Env richiesta: SUPABASE_URL, SUPABASE_ANON_KEY, GEMINI_API_KEY (Groq —
// stessa chiave già usata da food-swap.js e da NutriPlan-Pro/api/claude.js).

import { withErrorLogging, logServerError } from './_errorLog.js';

// Funzione disattivata in attesa di una decisione esplicita su rischi/
// benefici (vedi sessione del 2026-08-15) — tenuta a bandiera unica invece
// che rimossa, stesso pattern di PAYMENTS_ACTIVE in useSubscription.js. Va
// tenuta manualmente allineata con COACH_AI_ENABLED in
// src/lib/coachAiConfig.js (repo separati, nessun modo di condividerla).
const COACH_AI_ENABLED = false;

// Fallback ai nomi VITE_-prefixed: il progetto Vercel di questo repo ha solo
// VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY configurate (per il bundle client),
// non le versioni "server" senza prefisso — senza questo fallback la verifica
// del token utente falliva sempre silenziosamente (SUPABASE_URL/ANON_KEY
// undefined → verifySupabaseToken ritorna sempre null → 401).
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const MAX_TOKENS = 700;
const MAX_HISTORY_MESSAGES = 12; // ultimi N turni inviati al modello, limita costo/contesto
const MAX_MESSAGE_LEN = 2000;

// Tag DCA/disturbi alimentari (dal vocabolario suggerito in pazienti.html,
// PAZ_COMMON_TAGS) — se presenti sulla cartella del paziente, il Coach AI
// non genera MAI una risposta libera: un'AI generica che risponde a domande
// su restrizione calorica/alimentazione a una persona con un disturbo
// alimentare è un rischio noto, non mitigabile con un semplice prompt più
// cauto. I chip suggeriti sono parole nude ("Anoressia","Bulimia","BED",
// "ARFID","Ortoressia") ma il dietista può anche scrivere un tag a mano —
// match a sottostringa per i termini lunghi abbastanza da non rischiare
// falsi positivi (anoressia/bulimia/ortoressia coprono anche varianti
// cliniche plausibili come "anoressia nervosa", non solo la parola nuda).
// BED/ARFID restano a match esatto: sigle di 3-5 lettere, troppo ambigue
// per un controllo "contains" (rischio di falso positivo su parole non
// correlate) — coperte comunque dalle frasi lunghe esplicite sotto.
const DCA_EXACT_TAGS = new Set(['bed', 'arfid']);
const DCA_SUBSTRINGS = [
  'anoressia', 'bulimia', 'ortoressia',
  'disturbo alimentare', 'disturbi alimentari', 'disturbo del comportamento alimentare',
  'disturbo evitante restrittivo', 'binge eating', 'alimentazione incontrollata',
];
function hasDcaTag(tags) {
  return (tags || []).some(t => {
    const norm = String(t).trim().toLowerCase();
    return DCA_EXACT_TAGS.has(norm) || DCA_SUBSTRINGS.some(s => norm.includes(s));
  });
}
const DCA_SAFE_REPLY = 'Per il tipo di percorso che stai seguendo con il tuo dietista, preferisco non rispondere in autonomia a domande su alimentazione e peso — è un ambito in cui una risposta generica può fare più male che bene. Scrivi direttamente al tuo dietista in chat: è la persona giusta per questo.';

// Scrive un turno (utente o assistente) su coach_ai_messages con il token
// dell'utente stesso — mai service role, stessa regola già seguita da
// fetchPatientTags. Best-effort: un fallimento di scrittura non deve mai
// impedire la risposta all'utente, solo essere loggato lato server.
async function logMessage(token, patientId, role, content, blocked = false) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return;
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/coach_ai_messages`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ patient_id: patientId, role, content: content.slice(0, 4000), blocked }),
    });
  } catch (err) {
    console.error('coach-ai: log message failed', err);
  }
}

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
// token dell'utente stesso (RLS), mai service role. Ritorna null (non [])
// quando i tag non sono stati letti con successo, così il chiamante può
// distinguere "nessun tag DCA" da "non sappiamo" — il blocco DCA più sotto
// deve restare in vigore (fail-safe) anche quando una lettura fallisce, non
// aprirsi per default come farebbe un [] indistinguibile dal caso "niente
// tag".
async function fetchPatientTags(token, userId) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  const headers = { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${token}` };
  try {
    const linkRes = await fetch(
      `${SUPABASE_URL}/rest/v1/patient_dietitian?patient_id=eq.${userId}&select=cartella_id&limit=5`,
      { headers }
    );
    if (!linkRes.ok) return null;
    const links = await linkRes.json();
    const cartellaIds = [...new Set((links || []).map(l => l.cartella_id).filter(Boolean))];
    if (!cartellaIds.length) return [];

    const cartRes = await fetch(
      `${SUPABASE_URL}/rest/v1/cartelle?id=in.(${cartellaIds.join(',')})&select=tags`,
      { headers }
    );
    if (!cartRes.ok) return null;
    const cartelle = await cartRes.json();
    const tags = new Set();
    for (const c of cartelle || []) {
      for (const t of Array.isArray(c.tags) ? c.tags : []) tags.add(String(t));
    }
    return [...tags];
  } catch {
    return null;
  }
}

// Contesto reale sull'utente oltre alle sole allergie: obiettivo dichiarato
// in onboarding (profiles.nutrition_goal, SEZIONE 54) + un riassunto fattuale
// degli ultimi 14 giorni di food_logs/weight_logs. Stesso schema di accesso
// di fetchPatientTags (token utente, mai service role), best-effort: un
// fallimento qui non deve mai bloccare la risposta del Coach AI.
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

  if (!COACH_AI_ENABLED) {
    return res.status(503).json({ error: 'Il Coach AI è temporaneamente disattivato. Per domande su alimentazione o dubbi, scrivi al tuo dietista in chat.' });
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

  const lastUserMessage = history[history.length - 1].content;

  const tags = await fetchPatientTags(token, user.id);

  // Blocco totale per pazienti con tag DCA/disturbi alimentari — mai
  // generare una risposta libera, mai chiamare il modello. Vedi commento
  // in testa al file per il razionale.
  if (hasDcaTag(tags)) {
    await logMessage(token, user.id, 'user', lastUserMessage);
    await logMessage(token, user.id, 'assistant', DCA_SAFE_REPLY, true);
    return res.status(200).json({ reply: DCA_SAFE_REPLY });
  }

  const exclusionLine = tags.length
    ? `Il paziente ha le seguenti allergie/intolleranze/condizioni registrate dal suo dietista (codici interni, interpretali per il loro significato clinico): ${tags.join(', ')}. Tienile sempre presenti nei tuoi consigli, non suggerire mai alimenti in conflitto con una di queste.`
    : `Nessuna allergia/intolleranza registrata per questo paziente.`;

  const trendsLine = (await fetchRecentTrends(token, user.id)) || 'Nessuno storico di log disponibile ancora.';

  const system = `Sei il Coach AI di DietPlan Pro, un assistente nutrizionale amichevole e competente all'interno dell'app. Rispondi in italiano a domande libere su alimentazione, abitudini alimentari, idratazione, integrazione, gestione del peso — in modo pratico, chiaro e basato su evidenze scientifiche aggiornate.

${exclusionLine}

Contesto sulle abitudini recenti del paziente (usalo per personalizzare i consigli, non ripeterlo meccanicamente all'utente): ${trendsLine}

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

    await logMessage(token, user.id, 'user', lastUserMessage);
    await logMessage(token, user.id, 'assistant', reply);

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('coach-ai error:', err);
    await logServerError('coach-ai', err, req).catch(() => {});
    return res.status(500).json({ error: 'Errore server: ' + err.message });
  }
}

export default withErrorLogging('coach-ai', handler);
