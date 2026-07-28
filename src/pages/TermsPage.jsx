import { Link } from 'react-router-dom'

const S = {
  page: { maxWidth: 760, margin: '0 auto', padding: '24px 16px 64px' },
  back: { display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--green-main)', fontSize: 13, fontWeight: 600, textDecoration: 'none', marginBottom: 20 },
  h1: { fontFamily: 'var(--font-d)', fontSize: 28, color: 'var(--text-primary)', marginBottom: 4 },
  subtitle: { fontSize: 12.5, color: 'var(--text-muted)', marginBottom: 20 },
  h2: { fontSize: 15.5, fontWeight: 700, color: 'var(--text-primary)', margin: '26px 0 8px' },
  p: { fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 10 },
  ul: { paddingLeft: 20, marginBottom: 10 },
  li: { fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 4 },
  banner: { background: 'var(--alert-warning-bg)', border: '1.5px solid var(--alert-warning-border)', color: 'var(--alert-warning-text)', borderRadius: 12, padding: '14px 16px', fontSize: 13, lineHeight: 1.6, marginBottom: 20 },
  todo: { background: '#FEF9C3', color: '#854D0E', padding: '1px 6px', borderRadius: 4, fontWeight: 700, fontSize: 12 },
  hr: { border: 'none', borderTop: '1.5px solid var(--border-light)', margin: '22px 0' },
  contact: { background: 'var(--green-dark)', color: 'white', borderRadius: 14, padding: '18px 20px', marginTop: 24 },
}

export default function TermsPage() {
  return (
    <div style={S.page}>
      <Link to="/login" style={S.back}>← Torna al login</Link>
      <h1 style={S.h1}>Termini di Servizio</h1>
      <p style={S.subtitle}>Condizioni d'uso dell'app pazienti NutriPlan</p>

      <div style={S.banner}>
        ⚠️ <strong>Bozza in attesa di validazione legale.</strong> Da far rivedere da un avvocato prima della pubblicazione definitiva, in particolare le clausole di responsabilità. I campi <span style={S.todo}>DA COMPLETARE</span> vanno riempiti quando disponibili.
      </div>

      <p style={S.p}>I presenti Termini regolano l'uso dell'app <strong>NutriPlan</strong> ("l'App") da parte dei pazienti seguiti da un professionista che utilizza NutriPlan-Pro. Creando un account o usando l'App, accetti questi Termini.</p>

      <hr style={S.hr} />
      <h2 style={S.h2}>1. Il fornitore del servizio</h2>
      <p style={S.p}>L'App è fornita da <span style={S.todo}>DA COMPLETARE</span> (Nome/Ragione Sociale, P.IVA). Contatti: <span style={S.todo}>DA COMPLETARE</span>.</p>

      <hr style={S.hr} />
      <h2 style={S.h2}>2. Cos'è l'App — e cosa non è</h2>
      <div style={S.banner}>
        🩺 NutriPlan è uno strumento di supporto al percorso nutrizionale seguito dal tuo dietista/nutrizionista. <strong>Non è un dispositivo medico, non fornisce diagnosi e non sostituisce il parere del tuo professionista.</strong> Il riconoscimento automatico dei pasti tramite foto è una stima orientativa, non un dato clinico certificato: verifica sempre con il tuo dietista in caso di dubbio, specialmente se segui un percorso per allergie, intolleranze o patologie che richiedono precisione.
      </div>
      <p style={S.p}>In caso di urgenza medica, contatta i servizi di emergenza — l'App non è un canale per richieste urgenti.</p>

      <hr style={S.hr} />
      <h2 style={S.h2}>3. Il tuo account</h2>
      <ul style={S.ul}>
        <li style={S.li}>L'accesso all'App richiede di essere collegato a un professionista che utilizza NutriPlan-Pro; l'account viene attivato dal tuo dietista o tramite un invito da lui/lei generato.</li>
        <li style={S.li}>Sei responsabile della riservatezza delle tue credenziali e di ogni attività svolta tramite il tuo account.</li>
        <li style={S.li}>I dati che inserisci (diario, peso, foto pasti, ciclo mestruale, ecc.) devono riferirsi a te stesso; non inserire dati di terzi senza il loro consenso.</li>
      </ul>

      <hr style={S.hr} />
      <h2 style={S.h2}>4. Funzioni basate su intelligenza artificiale</h2>
      <p style={S.p}>Il riconoscimento automatico dei pasti tramite foto utilizza un modello di intelligenza artificiale di terze parti (Google Gemini). È una funzione facoltativa: puoi sempre inserire i pasti manualmente. I risultati sono stime e possono contenere errori — verifica sempre le porzioni/alimenti proposti prima di salvarli.</p>

      <hr style={S.hr} />
      <h2 style={S.h2}>5. Abbonamento (se previsto dal tuo piano)</h2>
      <p style={S.p}>Alcune funzionalità avanzate dell'App possono richiedere un abbonamento a pagamento, con le condizioni di prezzo e recesso indicate al momento della sottoscrizione. I pagamenti sono elaborati da Stripe; NutriPlan non memorizza i dati completi della tua carta.</p>

      <hr style={S.hr} />
      <h2 style={S.h2}>6. Proprietà intellettuale</h2>
      <p style={S.p}>L'App, il suo software e i contenuti editoriali (ricette, database alimenti, contenuti informativi) restano di proprietà del fornitore del Servizio o dei rispettivi licenzianti. I dati che inserisci restano tuoi; sono trattati dal tuo dietista (Titolare) e da NutriPlan (Responsabile) secondo l'Informativa Privacy.</p>

      <hr style={S.hr} />
      <h2 style={S.h2}>7. Limitazione di responsabilità</h2>
      <ul style={S.ul}>
        <li style={S.li}>L'App è fornita "così com'è". Non garantiamo l'assenza di interruzioni o errori, incluse imprecisioni nelle stime automatiche (foto pasti, calcoli calorici).</li>
        <li style={S.li}>Nei limiti massimi consentiti dalla legge, il fornitore del Servizio non risponde per danni indiretti derivanti dall'uso dell'App, incluse decisioni alimentari basate esclusivamente su stime automatiche senza verifica del tuo dietista.</li>
        <li style={S.li}><span style={S.todo}>DA VALIDARE CON UN AVVOCATO</span> prima della pubblicazione definitiva.</li>
      </ul>

      <hr style={S.hr} />
      <h2 style={S.h2}>8. Recesso e cancellazione dell'account</h2>
      <p style={S.p}>Puoi richiedere la cancellazione del tuo account e dei tuoi dati in qualsiasi momento tramite il tuo dietista o le funzioni disponibili nel tuo profilo, salvo gli obblighi di conservazione della documentazione sanitaria previsti dalla legge.</p>

      <hr style={S.hr} />
      <h2 style={S.h2}>9. Legge applicabile</h2>
      <p style={S.p}>I presenti Termini sono regolati dalla legge italiana. Foro competente: <span style={S.todo}>DA COMPLETARE</span>, salve le norme inderogabili a tutela del consumatore.</p>

      <hr style={S.hr} />
      <h2 style={S.h2}>10. Documenti collegati</h2>
      <ul style={S.ul}>
        <li style={S.li}><Link to="/privacy" style={{ color: 'var(--green-main)' }}>Informativa Privacy</Link> dell'app.</li>
      </ul>

      <div style={S.contact}>
        <h3 style={{ color: '#6dd9a0', marginTop: 0, fontSize: 14 }}>📩 Contatti</h3>
        <p style={{ color: '#dfeee5', fontSize: 13 }}>Per domande su questi Termini, contatta NutriPlan all'indirizzo indicato nell'app.</p>
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 24, textAlign: 'center' }}>Ultimo aggiornamento: Luglio 2026 — NutriPlan</p>
    </div>
  )
}
