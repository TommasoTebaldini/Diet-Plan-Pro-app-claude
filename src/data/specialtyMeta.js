// Metadata + field configuration for the "Speciale" section.
//
// Mirrors the `specMap` used in NutriPlan-Pro's pazienti.html (same icons/colors
// where a lucide equivalent exists) so the two apps stay visually consistent.
// `tipo` values match exactly what each specialist page in NutriPlan-Pro writes
// to `note_specialistiche.tipo` — do not rename without updating both repos.

export const SPECIALTIES = [
  { key: 'diabete', label: 'Diabete', icon: 'Droplet', color: '#1D4ED8', bg: '#DBEAFE' },
  { key: 'obesita', label: 'Obesità', icon: 'Scale', color: '#EA580C', bg: '#FFF7ED' },
  { key: 'sport', label: 'Nutrizione Sportiva', icon: 'Activity', color: '#065F46', bg: '#ECFDF5' },
  { key: 'dca', label: 'DCA', icon: 'HeartPulse', color: '#991B1B', bg: '#FEE2E2' },
  { key: 'renale', label: 'Nefropatia / IRC', icon: 'Droplets', color: '#0F766E', bg: '#CCFBF1' },
  { key: 'chetogenica', label: 'Dieta Chetogenica', icon: 'Flame', color: '#7C3AED', bg: '#F5F3FF' },
  { key: 'oncologia', label: 'Oncologia', icon: 'Stethoscope', color: '#7C3AED', bg: '#F5F3FF' },
  { key: 'pancreas', label: 'IPE — Pancreas', icon: 'FlaskConical', color: '#C2410C', bg: '#FFF7ED' },
  { key: 'pediatria', label: 'Pediatria', icon: 'Baby', color: '#5B21B6', bg: '#EDE9FE' },
  { key: 'disfagia', label: 'Disfagia', icon: 'MessageCircle', color: '#0369A1', bg: '#E0F2FE' },
  { key: 'paziente_sano', label: 'Percorso Nutrizionale', icon: 'Leaf', color: '#16A34A', bg: '#F0FDF4' },
  { key: 'gravidanza', label: 'Gravidanza', icon: 'Heart', color: '#BE185D', bg: '#FDF2F8' },
]

export const SPECIALTY_KEYS = SPECIALTIES.map(s => s.key)

// IDDSI texture levels (disfagia) — name + color, from disfagia.html's IDDSI_META
export const IDDSI_LEVELS = {
  1: { nome: 'Leggermente Addensato', color: '#9CA3AF' },
  2: { nome: 'Moderatamente Addensato', color: '#EC4899' },
  3: { nome: 'Liquidizzato', color: '#F59E0B' },
  4: { nome: 'Frullato / Passato', color: '#10B981' },
  5: { nome: 'Tritato Umido', color: '#EF4444' },
  6: { nome: 'Morbido a Pezzi', color: '#3B82F6' },
  7: { nome: 'Facile da Masticare', color: '#F97316' },
}

// Allowed / caution / avoid food examples per IDDSI level — ported verbatim
// (Italian) from disfagia.html's IDDSI_ALIMENTI reference table.
export const IDDSI_ALIMENTI = {
  1: {
    ok: ['Acqua addensata (livello 1)', 'Latte intero addensato', 'Succhi di frutta chiari setacciati + addensante', 'Brodo chiaro addensato', 'Tè/caffè addensato', 'ONS liquidi addensabili'],
    mod: ['Succhi con polpa (setacciare prima)', 'Frullati densi molto diluiti + setacciati'],
    no: ['Acqua non addensata', 'Bevande gassate', 'Qualsiasi alimento solido', 'Succhi con semi o fibre', 'Alcolici'],
  },
  2: {
    ok: ['Latte intero + addensante', 'Semolino fluido addensato', 'Creme vellutate setacciate finissime', 'ONS densi addensabili', 'Yogurt liquido setacciato', 'Succhi densi + addensante'],
    mod: ['Frullati di frutta senza bucce né semi', 'Minestre passate molto fini'],
    no: ['Liquidi sottili non addensati', 'Alimenti con grumi', 'Pezzi solidi anche piccoli', 'Alimenti filamentosi', 'Bevande gassate'],
  },
  3: {
    ok: ['Frullati densi (banana, avocado)', 'Crema di cereali frullata', 'Minestre liquidizzate passate', 'ONS crema', 'Yogurt cremoso senza grumi', 'Purè di patate molto fluido'],
    mod: ['Composta di frutta frullata (rimuovere bucce/semi)', 'Creme di legumi passate finissime'],
    no: ['Alimenti con grumi o fibre lunghe', 'Pane in qualsiasi forma', 'Carni non frullate', 'Verdure crude', 'Riso non frullato', 'Alimenti con doppia consistenza'],
  },
  4: {
    ok: ['Purè di patate denso', 'Purè di verdure omogeneo', 'Purè di carne / pesce con besciamella', 'Budino / panna cotta', 'Crema pasticcera', 'Yogurt greco denso', 'Purè di frutta cotta', 'Uova strapazzate morbidissime', 'Formaggio spalmabile'],
    mod: ['Polenta morbida (senza grumi)', 'Semolino denso', 'Gelato cremoso senza pezzi'],
    no: ['Qualsiasi alimento con grumi o pezzi', 'Pane', 'Pasta', 'Riso', 'Vegetali non frullati', 'Carni non frullate', 'Frutta intera', 'Noci / frutta secca', 'Alimenti appiccicosi'],
  },
  5: {
    ok: ['Carne macinata tenera in umido', 'Pesce sminuzzato (lische rimosse)', 'Pastina ben cotta in brodo', 'Riso stracotto morbido', 'Uova strapazzate', 'Verdure tenere cotte a pezzetti', 'Frutta morbida a pezzi fini', 'Yogurt con frutta tritata', 'Formaggi morbidi a pezzetti'],
    mod: ['Gnocchi ben cotti e morbidi', 'Legumi ben cotti schiacciati parzialmente', 'Polenta morbida a pezzi piccoli'],
    no: ['Carni fibrose o dure', 'Pane croccante / grissini', 'Verdure crude', 'Frutta con bucce/semi duri', 'Noci / nocciole / mandorle', 'Riso al dente', 'Alimenti appiccicosi (caramelle, gommose)'],
  },
  6: {
    ok: ['Pasta ben cotta con sugo', 'Riso morbido / risotto', 'Pesce al forno o al vapore', 'Pollo / tacchino morbido', 'Uova in qualsiasi cottura morbida', 'Formaggi molli', 'Verdure cotte morbide a pezzi', 'Legumi in umido', 'Frutta morbida matura', 'Pane morbido senza crosta'],
    mod: ['Carne bovina magra ben cotta e umida', 'Insalata cotta', 'Banana, kiwi, fragole'],
    no: ['Pane croccante', 'Carni dure o fibrose', 'Verdure crude croccanti', 'Noci / frutta secca', 'Alimenti molto appiccicosi', 'Salumi duri', 'Riso al dente', 'Alimenti che si sbriciolano'],
  },
  7: {
    ok: ['Pasta e riso normali ben cotti', 'Carni tenere (pollo, tacchino, pesce)', 'Uova in tutte le cotture', 'Formaggi', 'Legumi cotti', 'Verdure cotte o tenere crude', 'Frutta fresca morbida', 'Pane morbido', 'Yogurt', 'Prodotti latticini morbidi'],
    mod: ['Carne bovina magra ben cotta', 'Pane con crosta leggera', 'Mela sbucciata tenera'],
    no: ['Pane molto croccante / biscotti secchi duri', 'Carni particolarmente fibrose o dure', 'Noci intere', 'Caramelle dure / gomme', 'Alimenti che si attaccano al palato (burro di arachidi)', 'Crostacei con guscio'],
  },
}

// Meal-array field keys we know how to render, in display order (MealsTable skips absent ones)
const MEAL_COLUMNS = [
  { key: 'nome', label: 'Pasto' },
  { key: 'ora', label: 'Orario' },
  { key: 'cho', label: 'CHO', unit: 'g' },
  { key: 'kcal', label: 'Kcal', unit: 'kcal' },
  { key: 'grassi', label: 'Grassi', unit: 'g' },
  { key: 'alimenti', label: 'Alimenti' },
  { key: 'note', label: 'Note' },
]
export { MEAL_COLUMNS }

// Comorbidity checkbox labels (obesita.valutazione.comor)
export const OBESITA_COMOR_LABELS = {
  dm2: 'Diabete tipo 2', prediab: 'Prediabete', ipert: 'Ipertensione', dislipi: 'Dislipidemia',
  steatosi: 'Steatosi epatica', osas: 'OSAS (apnee notturne)', artrosi: 'Artrosi', sop: 'PCOS',
  ipotiroidismo: 'Ipotiroidismo', depressione: 'Depressione', reflusso: 'Reflusso', irc: 'Insufficienza renale cronica',
}

// ── Per-tipo field groups ────────────────────────────────────────────────────
// Each group: { path (dot-path into `dati`), label, fields: [{key,label,unit?}], meals?: 'arrayKey', checkboxGroup?: labelsMap }
// A group/field renders only if it has a non-empty value — no walls of "—".
export const FIELD_CONFIG = {
  diabete: {
    groups: [
      { path: 'dose_pasto', label: 'Ultima dose calcolata', fields: [
        { key: 'cho', label: 'Carboidrati del pasto', unit: 'g' },
        { key: 'glicemia', label: 'Glicemia rilevata', unit: 'mg/dL' },
        { key: 'target', label: 'Target glicemico', unit: 'mg/dL' },
        { key: 'ic', label: 'Rapporto insulina/carboidrati (I:C)' },
        { key: 'fsi', label: 'Fattore di Sensibilità Insulinica (FSI)', unit: 'mg/dL per U' },
      ] },
      { path: 'rapporto_ic', label: 'Rapporto Insulina/Carboidrati', fields: [
        { key: 'tipo', label: 'Tipo di diabete' },
        { key: 'tdd', label: 'Dose totale insulina/die', unit: 'U' },
        { key: 'metodo', label: 'Metodo di calcolo' },
        { key: 'risultato', label: 'Rapporto I:C calcolato' },
      ] },
      { path: 'piano', label: 'Piano alimentare', fields: [
        { key: 'tipo', label: 'Tipo di diabete' },
        { key: 'insulina', label: 'Terapia insulinica' },
        { key: 'kcal', label: 'Kcal target', unit: 'kcal/die' },
        { key: 'cho_tot', label: 'Carboidrati target', unit: 'g/die' },
        { key: 'note_cliniche', label: 'Note cliniche' },
        { key: 'limita', label: 'Alimenti da limitare' },
        { key: 'sport', label: 'Gestione sport/ipoglicemia' },
        { key: 'note_generali', label: 'Note generali' },
      ], meals: 'pasti' },
    ],
  },
  obesita: {
    groups: [
      { path: 'valutazione', label: 'Valutazione', fields: [
        { key: 'peso', label: 'Peso', unit: 'kg' }, { key: 'alt', label: 'Altezza', unit: 'cm' },
        { key: 'vita', label: 'Circonferenza vita', unit: 'cm' }, { key: 'fianchi', label: 'Circonferenza fianchi', unit: 'cm' },
        { key: 'bmi', label: 'BMI' }, { key: 'whr', label: 'Rapporto vita/fianchi (WHR)' },
        { key: 'peso_max', label: 'Peso massimo storico', unit: 'kg' }, { key: 'peso_min', label: 'Peso minimo storico', unit: 'kg' },
      ], checkboxGroup: { path: 'comor', labels: OBESITA_COMOR_LABELS, label: 'Condizioni associate' } },
      { path: 'fabbisogno', label: 'Fabbisogno calorico', fields: [
        { key: 'formula', label: 'Formula utilizzata' }, { key: 'deficit', label: 'Deficit calorico' },
        { key: 'peso_target', label: 'Peso target', unit: 'kg' }, { key: 'approccio', label: 'Approccio' },
        { key: 'note', label: 'Note' },
      ] },
      { path: 'piano', label: 'Piano alimentare', fields: [
        { key: 'kcal', label: 'Kcal target', unit: 'kcal/die' }, { key: 'prot', label: 'Proteine', unit: 'g' },
        { key: 'cho', label: 'Carboidrati', unit: 'g' }, { key: 'grassi', label: 'Grassi', unit: 'g' },
        { key: 'fibra', label: 'Fibra', unit: 'g' }, { key: 'liquidi', label: 'Liquidi', unit: 'L' },
        { key: 'distrib', label: 'Distribuzione pasti' }, { key: 'privilegiare', label: 'Alimenti da privilegiare' },
        { key: 'limitare', label: 'Alimenti da limitare' }, { key: 'integrazione', label: 'Integrazione' },
        { key: 'note', label: 'Note' }, { key: 'followup', label: 'Follow-up' },
      ] },
    ],
  },
  sport: {
    groups: [
      { path: 'calc', label: 'Dati sportivo', fields: [
        { key: 'sport', label: 'Sport praticato' }, { key: 'sess', label: 'Sessioni/settimana' },
      ] },
      { path: 'piano', label: 'Piano nutrizionale', fields: [
        { key: 'sport', label: 'Sport' }, { key: 'obiettivo', label: 'Obiettivo' },
        { key: 'kcal_train', label: 'Kcal giorni allenamento', unit: 'kcal' }, { key: 'kcal_rest', label: 'Kcal giorni riposo', unit: 'kcal' },
        { key: 'ora_train', label: 'Timing pre-workout' }, { key: 'prot_per_kg', label: 'Proteine', unit: 'g/kg' },
        { key: 'integr', label: 'Integrazione' }, { key: 'gara', label: 'Gestione gare' },
        { key: 'note_generali', label: 'Note generali' },
      ], meals: 'pasti' },
    ],
  },
  dca: {
    // NOTA: i blocchi "meccanismi_compenso" (comportamenti compensatori: vomito,
    // lassativi, diuretici, digiuno...) e "scoff" (screening diagnostico) sono
    // deliberatamente ESCLUSI dalla vista paziente per prudenza clinica — sono
    // dati sensibili pensati per uso professionale, non per l'autoconsultazione
    // del paziente. Il dietista li discute direttamente in percorso terapeutico.
    groups: [
      { path: 'panoramica', label: 'Panoramica', fields: [
        { key: 'altre_info', label: 'Note' },
      ] },
      { path: 'panoramica.giornata_tipo', label: 'Giornata alimentare tipo', fields: [
        { key: 'colazione', label: 'Colazione' }, { key: 'spuntino_mattina', label: 'Spuntino mattina' },
        { key: 'pranzo', label: 'Pranzo' }, { key: 'spuntino_pomeriggio', label: 'Spuntino pomeriggio' },
        { key: 'cena', label: 'Cena' }, { key: 'spuntino_serale', label: 'Spuntino serale' },
      ] },
      { path: 'piano', label: 'Piano alimentare', fields: [
        { key: 'fase', label: 'Fase del percorso' }, { key: 'kcal', label: 'Kcal target', unit: 'kcal/die' },
        { key: 'approccio', label: 'Approccio' }, { key: 'intro_foods', label: 'Alimenti in reintroduzione' },
        { key: 'note_generali', label: 'Note generali' },
      ], meals: 'pasti' },
    ],
  },
  renale: {
    groups: [
      { path: 'calcolo', label: 'Parametri clinici', fields: [
        { key: 'peso', label: 'Peso', unit: 'kg' }, { key: 'peso_ideale', label: 'Peso ideale', unit: 'kg' },
        { key: 'stadio', label: 'Stadio IRC' }, { key: 'attivita', label: 'Livello di attività' },
        { key: 'diabete', label: 'Diabete concomitante' },
      ] },
      { path: 'piano', label: 'Piano alimentare', fields: [
        { key: 'kcal', label: 'Kcal totali', unit: 'kcal' }, { key: 'prot_tot', label: 'Proteine totali', unit: 'g' },
        { key: 'note_generali', label: 'Note' },
      ], meals: 'pasti' },
    ],
  },
  chetogenica: {
    groups: [
      { path: 'calcolo', label: 'Parametri', fields: [
        { key: 'tipo', label: 'Tipo di protocollo' }, { key: 'obiettivo', label: 'Obiettivo' },
        { key: 'attivita', label: 'Livello di attività' },
      ] },
      { path: 'gki', label: 'Glucose Ketone Index (ultima rilevazione)', fields: [
        { key: 'glicemia', label: 'Glicemia', unit: 'mg/dL' }, { key: 'chetoni', label: 'Chetoni', unit: 'mmol/L' },
      ] },
    ],
  },
  oncologia: {
    groups: [
      { path: 'clinica', label: 'Quadro clinico', fields: [
        { key: 'tipo', label: 'Tipo' }, { key: 'stadio', label: 'Stadio' }, { key: 'tratt', label: 'Trattamento in corso' },
        { key: 'peso', label: 'Peso attuale', unit: 'kg' }, { key: 'dpeso', label: 'Variazione di peso recente', unit: 'kg' },
        { key: 'ecog', label: 'Performance status (ECOG)' },
      ] },
      { path: 'fabbisogno', label: 'Fabbisogno nutrizionale', fields: [
        { key: 'kcal_target', label: 'Kcal target', unit: 'kcal/die' }, { key: 'prot_target', label: 'Proteine target', unit: 'g/die' },
        { key: 'note', label: 'Note' },
      ] },
      { path: 'supporto', label: 'Supporto nutrizionale', fields: [
        { key: 'piano', label: 'Piano' }, { key: 'integr', label: 'Integrazione' }, { key: 'ons', label: 'Supplementi orali (ONS)' },
      ] },
      { path: 'sintomi', label: 'Gestione sintomi', fields: [
        { key: 'note', label: 'Note' }, { key: 'int', label: 'Interventi consigliati' },
      ] },
      { path: 'piano', label: 'Piano alimentare', fields: [
        { key: 'text', label: 'Indicazioni' }, { key: 'note', label: 'Note' },
      ] },
    ],
  },
  pancreas: {
    groups: [
      { path: 'pert', label: 'Dosaggio enzimi pancreatici', fields: [
        { key: 'patologia', label: 'Patologia' }, { key: 'metodo', label: 'Metodo di calcolo' },
        { key: 'risultato_ul', label: 'Unità lipasi calcolate' },
      ] },
      { path: 'piano', label: 'Piano alimentare', fields: [
        { key: 'causa', label: 'Causa' }, { key: 'kcal', label: 'Kcal target', unit: 'kcal/die' },
        { key: 'grassi_tot', label: 'Grassi totali', unit: 'g/die' }, { key: 'enzima', label: 'Terapia enzimatica' },
        { key: 'note_cliniche', label: 'Note cliniche' },
        { key: 'vitD', label: 'Vitamina D' }, { key: 'vitE', label: 'Vitamina E' },
        { key: 'vitA', label: 'Vitamina A' }, { key: 'vitK', label: 'Vitamina K' },
        { key: 'note_generali', label: 'Note generali' },
      ], meals: 'pasti' },
    ],
  },
  pediatria: {
    groups: [
      { path: 'paziente', label: 'Dati bambino/a', fields: [
        { key: 'anni', label: 'Età', unit: 'anni' }, { key: 'mesi', label: 'Mesi aggiuntivi', unit: 'mesi' },
        { key: 'peso', label: 'Peso', unit: 'kg' }, { key: 'altezza', label: 'Altezza', unit: 'cm' },
      ] },
      { path: 'piano', label: 'Piano alimentare', fields: [
        { key: 'motivo', label: 'Motivo del percorso' }, { key: 'kcal', label: 'Kcal target', unit: 'kcal/die' },
        { key: 'note_cliniche', label: 'Note cliniche' }, { key: 'suppl', label: 'Integrazione' },
        { key: 'edu', label: 'Indicazioni educative' }, { key: 'note_generali', label: 'Note generali' },
      ], meals: 'pasti' },
    ],
  },
  disfagia: {
    // shape is flat: { iddsi: number, kcal: number } — no nested groups
    flatFields: [
      { key: 'iddsi', label: 'Livello texture IDDSI', format: 'iddsi' },
      { key: 'kcal', label: 'Target calorico', unit: 'kcal/die' },
    ],
  },
  paziente_sano: {
    groups: [
      { path: 'valutazione', label: 'Valutazione', fields: [
        { key: 'peso', label: 'Peso', unit: 'kg' }, { key: 'altezza', label: 'Altezza', unit: 'cm' },
        { key: 'obiettivo', label: 'Obiettivo' }, { key: 'bmi', label: 'BMI' },
        { key: 'bmr', label: 'Metabolismo basale (BMR)', unit: 'kcal' }, { key: 'tdee', label: 'Fabbisogno totale (TDEE)', unit: 'kcal' },
        { key: 'target', label: 'Target calorico', unit: 'kcal' },
      ] },
      { path: 'piano_config', label: 'Piano alimentare', fields: [
        { key: 'kcal', label: 'Kcal target', unit: 'kcal/die' }, { key: 'npasti', label: 'N. pasti' },
        { key: 'schema', label: 'Schema' }, { key: 'preferiti', label: 'Alimenti preferiti' },
        { key: 'evitare', label: 'Alimenti da evitare' }, { key: 'note_extra', label: 'Note' },
      ] },
    ],
  },
  gravidanza: {
    // shape is flat: { pesoPre, altezza, pesoAtt, settimane, tipo, bmi }
    flatFields: [
      { key: 'settimane', label: 'Settimana gestazionale', unit: 'sett.' },
      { key: 'tipo', label: 'Tipo di gravidanza' },
      { key: 'pesoPre', label: 'Peso pre-gravidanza', unit: 'kg' },
      { key: 'pesoAtt', label: 'Peso attuale', unit: 'kg' },
      { key: 'bmi', label: 'BMI pre-gravidanza' },
      { key: 'altezza', label: 'Altezza', unit: 'cm' },
    ],
  },
}
