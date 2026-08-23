import { Link } from 'react-router-dom'
import { useT } from '../i18n'

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
  const t = useT()
  return (
    <div style={S.page}>
      <Link to="/login" style={S.back}>{t('terms.back', '← Torna al login')}</Link>
      <h1 style={S.h1}>{t('terms.title', 'Termini di Servizio')}</h1>
      <p style={S.subtitle}>{t('terms.subtitle', "Condizioni d'uso dell'app pazienti NutriPlan")}</p>

      <div style={S.banner}>
        ⚠️ <strong>{t('terms.draft_notice_title', 'Bozza in attesa di validazione legale.')}</strong>{' '}
        {t('terms.draft_notice_body', 'Da far rivedere da un avvocato prima della pubblicazione definitiva, in particolare le clausole di responsabilità. I campi')}{' '}
        <span style={S.todo}>{t('terms.todo_badge', 'DA COMPLETARE')}</span>{' '}
        {t('terms.draft_notice_suffix', 'vanno riempiti quando disponibili.')}
      </div>

      <p style={S.p}>
        {t('terms.intro_pre', "I presenti Termini regolano l'uso dell'app")}{' '}
        <strong>{t('terms.intro_bold', 'NutriPlan')}</strong>
        {t('terms.intro_post', ' ("l\'App") da parte dei pazienti seguiti da un professionista che utilizza NutriPlan-Pro. Creando un account o usando l\'App, accetti questi Termini.')}
      </p>

      <hr style={S.hr} />
      <h2 style={S.h2}>{t('terms.s1_title', '1. Il fornitore del servizio')}</h2>
      <p style={S.p}>
        {t('terms.s1_pre', "L'App è fornita da")}{' '}
        <span style={S.todo}>{t('terms.todo_badge', 'DA COMPLETARE')}</span>{' '}
        {t('terms.s1_mid', '(Nome/Ragione Sociale, P.IVA). Contatti:')}{' '}
        <span style={S.todo}>{t('terms.todo_badge', 'DA COMPLETARE')}</span>.
      </p>

      <hr style={S.hr} />
      <h2 style={S.h2}>{t('terms.s2_title', "2. Cos'è l'App — e cosa non è")}</h2>
      <div style={S.banner}>
        🩺 {t('terms.s2_banner_pre', 'NutriPlan è uno strumento di supporto al percorso nutrizionale seguito dal tuo dietista/nutrizionista.')}{' '}
        <strong>{t('terms.s2_banner_bold', 'Non è un dispositivo medico, non fornisce diagnosi e non sostituisce il parere del tuo professionista.')}</strong>{' '}
        {t('terms.s2_banner_post', 'Il riconoscimento automatico dei pasti tramite foto è una stima orientativa, non un dato clinico certificato: verifica sempre con il tuo dietista in caso di dubbio, specialmente se segui un percorso per allergie, intolleranze o patologie che richiedono precisione.')}
      </div>
      <p style={S.p}>{t('terms.s2_p1', "In caso di urgenza medica, contatta i servizi di emergenza — l'App non è un canale per richieste urgenti.")}</p>

      <hr style={S.hr} />
      <h2 style={S.h2}>{t('terms.s3_title', '3. Il tuo account')}</h2>
      <ul style={S.ul}>
        <li style={S.li}>{t('terms.s3_li1', "L'accesso all'App richiede di essere collegato a un professionista che utilizza NutriPlan-Pro; l'account viene attivato dal tuo dietista o tramite un invito da lui/lei generato.")}</li>
        <li style={S.li}>{t('terms.s3_li2', 'Sei responsabile della riservatezza delle tue credenziali e di ogni attività svolta tramite il tuo account.')}</li>
        <li style={S.li}>{t('terms.s3_li3', 'I dati che inserisci (diario, peso, foto pasti, ciclo mestruale, ecc.) devono riferirsi a te stesso; non inserire dati di terzi senza il loro consenso.')}</li>
      </ul>

      <hr style={S.hr} />
      <h2 style={S.h2}>{t('terms.s4_title', '4. Funzioni basate su intelligenza artificiale')}</h2>
      <p style={S.p}>{t('terms.s4_p1', 'Il riconoscimento automatico dei pasti tramite foto utilizza un modello di intelligenza artificiale di terze parti (Google Gemini). È una funzione facoltativa: puoi sempre inserire i pasti manualmente. I risultati sono stime e possono contenere errori — verifica sempre le porzioni/alimenti proposti prima di salvarli.')}</p>

      <hr style={S.hr} />
      <h2 style={S.h2}>{t('terms.s5_title', '5. Abbonamento (se previsto dal tuo piano)')}</h2>
      <p style={S.p}>{t('terms.s5_p1', 'Alcune funzionalità avanzate dell\'App possono richiedere un abbonamento a pagamento, con le condizioni di prezzo indicate al momento della sottoscrizione. I pagamenti sono elaborati da Stripe; NutriPlan non memorizza i dati completi della tua carta.')}</p>
      <p style={S.p}>
        {t('terms.s5_p2_pre', "Se sei un consumatore (persona fisica che sottoscrive l'abbonamento per uso personale, non professionale), hai diritto di recedere dal contratto entro")}{' '}
        <strong>{t('terms.s5_p2_bold', '14 giorni')}</strong>{' '}
        {t('terms.s5_p2_post', 'dalla sottoscrizione senza fornire motivazione, ai sensi del Codice del Consumo (D.Lgs. 206/2005, artt. 52 ss.). Se richiedi espressamente di iniziare a usare le funzionalità a pagamento prima della scadenza dei 14 giorni, riconosci che il diritto di recesso si estingue una volta che il servizio digitale è stato interamente fornito, oppure — per contenuti/servizi forniti progressivamente — si riduce proporzionalmente alla parte di servizio già goduta. Per esercitare il recesso, contatta l\'indirizzo indicato nell\'Informativa Privacy.')}
      </p>

      <hr style={S.hr} />
      <h2 style={S.h2}>{t('terms.s6_title', '6. Proprietà intellettuale')}</h2>
      <p style={S.p}>{t('terms.s6_p1', "L'App, il suo software e i contenuti editoriali (ricette, database alimenti, contenuti informativi) restano di proprietà del fornitore del Servizio o dei rispettivi licenzianti. I dati che inserisci restano tuoi; sono trattati dal tuo dietista (Titolare) e da NutriPlan (Responsabile) secondo l'Informativa Privacy.")}</p>

      <hr style={S.hr} />
      <h2 style={S.h2}>{t('terms.s7_title', '7. Limitazione di responsabilità')}</h2>
      <ul style={S.ul}>
        <li style={S.li}>{t('terms.s7_li1', 'L\'App è fornita "così com\'è". Non garantiamo l\'assenza di interruzioni o errori, incluse imprecisioni nelle stime automatiche (foto pasti, calcoli calorici).')}</li>
        <li style={S.li}>{t('terms.s7_li2', "Nei limiti massimi consentiti dalla legge, il fornitore del Servizio non risponde per danni indiretti derivanti dall'uso dell'App, incluse decisioni alimentari basate esclusivamente su stime automatiche senza verifica del tuo dietista.")}</li>
        <li style={S.li}>
          <span style={S.todo}>{t('terms.s7_li3_badge', 'DA VALIDARE CON UN AVVOCATO')}</span>{' '}
          {t('terms.s7_li3_text', 'prima della pubblicazione definitiva.')}
        </li>
      </ul>

      <hr style={S.hr} />
      <h2 style={S.h2}>{t('terms.s8_title', "8. Recesso e cancellazione dell'account")}</h2>
      <p style={S.p}>{t('terms.s8_p1', 'Puoi richiedere la cancellazione del tuo account e dei tuoi dati in qualsiasi momento tramite il tuo dietista o le funzioni disponibili nel tuo profilo, salvo gli obblighi di conservazione della documentazione sanitaria previsti dalla legge.')}</p>

      <hr style={S.hr} />
      <h2 style={S.h2}>{t('terms.s9_title', '9. Legge applicabile')}</h2>
      <p style={S.p}>
        {t('terms.s9_pre', 'I presenti Termini sono regolati dalla legge italiana. Foro competente:')}{' '}
        <span style={S.todo}>{t('terms.todo_badge', 'DA COMPLETARE')}</span>
        {t('terms.s9_post', ', salve le norme inderogabili a tutela del consumatore.')}
      </p>

      <hr style={S.hr} />
      <h2 style={S.h2}>{t('terms.s10_title', '10. Documenti collegati')}</h2>
      <ul style={S.ul}>
        <li style={S.li}>
          <Link to="/privacy" style={{ color: 'var(--green-main)' }}>{t('terms.s10_link', 'Informativa Privacy')}</Link>
          {t('terms.s10_after', " dell'app.")}
        </li>
      </ul>

      <div style={S.contact}>
        <h3 style={{ color: '#6dd9a0', marginTop: 0, fontSize: 14 }}>📩 {t('terms.contact_title', 'Contatti')}</h3>
        <p style={{ color: '#dfeee5', fontSize: 13 }}>{t('terms.contact_text', "Per domande su questi Termini, contatta NutriPlan all'indirizzo indicato nell'app.")}</p>
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 24, textAlign: 'center' }}>{t('terms.last_updated', 'Ultimo aggiornamento: Luglio 2026 — NutriPlan')}</p>
    </div>
  )
}
