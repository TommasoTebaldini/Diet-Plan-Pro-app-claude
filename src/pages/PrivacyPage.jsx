import { Link } from 'react-router-dom'

const S = {
  page: { maxWidth: 760, margin: '0 auto', padding: '24px 16px 64px' },
  back: { display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--green-main)', fontSize: 13, fontWeight: 600, textDecoration: 'none', marginBottom: 20 },
  h1: { fontFamily: 'var(--font-d)', fontSize: 28, color: 'var(--text-primary)', marginBottom: 4 },
  subtitle: { fontSize: 12.5, color: 'var(--text-muted)', marginBottom: 20 },
  h2: { fontSize: 15.5, fontWeight: 700, color: 'var(--text-primary)', margin: '26px 0 8px' },
  h3: { fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)', margin: '16px 0 6px' },
  p: { fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 10 },
  ul: { paddingLeft: 20, marginBottom: 10 },
  li: { fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 4 },
  banner: { background: 'var(--alert-warning-bg)', border: '1.5px solid var(--alert-warning-border)', color: 'var(--alert-warning-text)', borderRadius: 12, padding: '14px 16px', fontSize: 13, lineHeight: 1.6, marginBottom: 20 },
  todo: { background: '#FEF9C3', color: '#854D0E', padding: '1px 6px', borderRadius: 4, fontWeight: 700, fontSize: 12 },
  hr: { border: 'none', borderTop: '1.5px solid var(--border-light)', margin: '22px 0' },
  contact: { background: 'var(--green-dark)', color: 'white', borderRadius: 14, padding: '18px 20px', marginTop: 24 },
}

export default function PrivacyPage() {
  return (
    <div style={S.page}>
      <Link to="/login" style={S.back}>← Torna al login</Link>
      <h1 style={S.h1}>Informativa sulla Privacy</h1>
      <p style={S.subtitle}>Ai sensi degli artt. 13-14 GDPR — App pazienti NutriPlan</p>

      <div style={S.banner}>
        ⚠️ <strong>Bozza in attesa di validazione legale.</strong> Redatta per riflettere accuratamente il funzionamento reale dell'app, ma da far rivedere da un avvocato/DPO prima della pubblicazione definitiva — trattandosi di dati sanitari (art. 9 GDPR). I campi <span style={S.todo}>DA COMPLETARE</span> vanno riempiti quando disponibili.
      </div>

      <p style={S.p}>Questa informativa riguarda l'app NutriPlan riservata ai <strong>pazienti</strong>. Se sei un professionista, fa fede l'informativa privacy pubblicata sul gestionale NutriPlan-Pro.</p>

      <hr style={S.hr} />
      <h2 style={S.h2}>1. Titolari e Responsabile del Trattamento</h2>
      <ul style={S.ul}>
        <li style={S.li}><strong>Il tuo dietista/nutrizionista</strong> è il Titolare del Trattamento dei tuoi dati sanitari (piano alimentare, diario, note cliniche): è lui/lei a decidere quali dati raccogliere e per quale finalità terapeutica, ed è il tuo primo interlocutore per esercitare i tuoi diritti.</li>
        <li style={S.li}><strong>NutriPlan</strong> — <span style={S.todo}>DA COMPLETARE</span> (Nome/Ragione Sociale) — fornisce la piattaforma tecnica e agisce come <strong>Responsabile del Trattamento</strong> per conto del tuo dietista, oltre ad essere autonomo Titolare per i dati del tuo account (email, credenziali, impostazioni app).</li>
      </ul>

      <hr style={S.hr} />
      <h2 style={S.h2}>2. Dati raccolti</h2>
      <h3 style={S.h3}>2.1 Dati del tuo account</h3>
      <ul style={S.ul}>
        <li style={S.li}>Email e password (memorizzata in forma crittografata); se attivo, credenziale biometrica (Face ID/Touch ID) — quest'ultima resta solo sul tuo dispositivo, non viene mai inviata al server.</li>
      </ul>
      <h3 style={S.h3}>2.2 Dati sanitari e di diario (inseriti da te o dal tuo dietista)</h3>
      <ul style={S.ul}>
        <li style={S.li}>Piano alimentare prescritto e pasti registrati (diario alimentare), incluse foto dei pasti se usi il riconoscimento automatico.</li>
        <li style={S.li}>Peso, misure corporee, obiettivi, dati di attività fisica, sonno e digiuno se registrati.</li>
        <li style={S.li}>Diario del benessere: umore, energia, stress, idratazione e, se lo utilizzi, ciclo mestruale.</li>
        <li style={S.li}>Farmaci/integratori registrati, questionari e check-in compilati.</li>
        <li style={S.li}>Messaggi di chat con il tuo dietista (testo, vocali, immagini) e documenti/referti condivisi.</li>
      </ul>
      <h3 style={S.h3}>2.3 Dati tecnici</h3>
      <ul style={S.ul}>
        <li style={S.li}>Log di accesso, informazioni sul dispositivo necessarie per le notifiche push, dati di utilizzo dell'app in forma aggregata.</li>
      </ul>

      <hr style={S.hr} />
      <h2 style={S.h2}>3. Riconoscimento automatico dei pasti tramite foto (AI)</h2>
      <div style={S.banner}>
        📷 Se scegli di fotografare un pasto per farlo riconoscere automaticamente, l'immagine viene inviata a <strong>Google (modello Gemini)</strong> tramite un server intermedio, al solo fine di stimare gli alimenti presenti nella foto. L'immagine non viene associata al tuo nome quando inviata al modello, ma essendo una foto del tuo pasto rientra comunque tra i dati che riguardano le tue abitudini alimentari. <strong>L'uso di questa funzione è sempre facoltativo</strong>: puoi sempre registrare i pasti manualmente senza usare la fotocamera.
      </div>
      <p style={S.p}>Base giuridica: consenso (art. 9.2.a GDPR), prestato scattando/caricando volontariamente la foto. Puoi revocarlo semplicemente non utilizzando più questa funzione.</p>

      <hr style={S.hr} />
      <h2 style={S.h2}>4. Finalità e basi giuridiche</h2>
      <ul style={S.ul}>
        <li style={S.li}>Erogazione del servizio (gestione account, sincronizzazione con il tuo dietista): esecuzione del contratto (art. 6.1.b).</li>
        <li style={S.li}>Supporto al percorso nutrizionale tramite il tuo dietista: finalità di cura, tramite il rapporto professionale con il Titolare (art. 9.2.h, in capo al dietista).</li>
        <li style={S.li}>Riconoscimento foto pasti, ciclo mestruale, dati di benessere: consenso esplicito (art. 9.2.a) — funzioni sempre opzionali.</li>
        <li style={S.li}>Notifiche push (promemoria pasti/acqua/farmaci): consenso del browser/dispositivo, revocabile in qualsiasi momento dalle impostazioni.</li>
        <li style={S.li}>Sicurezza e prevenzione abusi: legittimo interesse (art. 6.1.f).</li>
      </ul>

      <hr style={S.hr} />
      <h2 style={S.h2}>5. Destinatari dei dati</h2>
      <ul style={S.ul}>
        <li style={S.li}><strong>Il tuo dietista</strong>, che vede i dati che gli servono per seguirti (piano, diario, chat) tramite il proprio gestionale.</li>
        <li style={S.li}><strong>Supabase Inc.</strong> (USA) — database, autenticazione, storage di allegati/vocali/foto.</li>
        <li style={S.li}><strong>Vercel Inc.</strong> (USA) — hosting dell'app.</li>
        <li style={S.li}><strong>Google (Gemini API)</strong> (USA/UE) — solo per le foto che scegli di far analizzare, vedi sezione 3.</li>
        <li style={S.li}>Servizi di notifica push del tuo browser/sistema operativo (Google, Apple, Mozilla) — solo il token del dispositivo, per recapitare le notifiche, nessun contenuto sanitario.</li>
      </ul>
      <p style={S.p}>Tutti i trasferimenti verso paesi extra-UE avvengono sulla base delle Clausole Contrattuali Standard (SCC).</p>

      <hr style={S.hr} />
      <h2 style={S.h2}>6. Conservazione dei dati</h2>
      <p style={S.p}>I dati sanitari sono conservati per la durata del rapporto con il tuo dietista e per il periodo di conservazione della documentazione clinica previsto dalla normativa (tipicamente 10 anni), salvo tua richiesta di cancellazione anticipata tramite il tuo dietista o direttamente tramite le funzioni di export/cancellazione disponibili nel tuo profilo.</p>

      <hr style={S.hr} />
      <h2 style={S.h2}>7. I tuoi diritti</h2>
      <p style={S.p}>Hai diritto di accesso, rettifica, cancellazione, limitazione, portabilità e opposizione (artt. 15-22 GDPR) sui tuoi dati. Per i dati clinici, rivolgiti in prima battuta al tuo dietista; per i dati del tuo account app, puoi usare le funzioni "Esporta i miei dati" nel tuo profilo o scrivere a NutriPlan ai contatti sotto. Puoi anche proporre reclamo al <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--green-main)' }}>Garante Privacy</a>.</p>

      <hr style={S.hr} />
      <h2 style={S.h2}>8. Minori</h2>
      <p style={S.p}>Se sei minorenne, l'app va usata con il consenso e sotto la supervisione di chi esercita la responsabilità genitoriale, che agisce in accordo con il dietista curante.</p>

      <hr style={S.hr} />
      <h2 style={S.h2}>9. Documenti collegati</h2>
      <ul style={S.ul}>
        <li style={S.li}><Link to="/termini" style={{ color: 'var(--green-main)' }}>Termini di Servizio</Link> dell'app.</li>
      </ul>

      <div style={S.contact}>
        <h3 style={{ color: '#6dd9a0', marginTop: 0, fontSize: 14 }}>📩 Contatti</h3>
        <p style={{ color: '#dfeee5', fontSize: 13 }}>Per domande sui tuoi dati, contatta il tuo dietista o NutriPlan all'indirizzo indicato nell'app.</p>
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 24, textAlign: 'center' }}>Ultimo aggiornamento: Luglio 2026 — NutriPlan</p>
    </div>
  )
}
