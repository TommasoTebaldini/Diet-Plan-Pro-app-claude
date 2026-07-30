// generate-all-foods.cjs
// Run: node generate-all-foods.cjs
// Reads NutriPlan-Pro/js/db.js, extracts ALL_DB sources (CREA, BDA, ONS, APROTEICI, FLAVIS, UPF),
// converts to patient-app format and writes src/data/all-foods.js

const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, '../NutriPlan-Pro/js/db.js');
const outPath = path.resolve(__dirname, 'src/data/all-foods.js');

const dbContent = fs.readFileSync(dbPath, 'utf8');

function extractArray(content, varName) {
  const start = content.indexOf(`const ${varName}=[`) !== -1
    ? content.indexOf(`const ${varName}=[`)
    : content.indexOf(`const ${varName} = [`);
  if (start === -1) { console.warn(`${varName} not found`); return []; }
  const arrStart = content.indexOf('[', start);
  let depth = 0, arrEnd = -1;
  for (let i = arrStart; i < content.length; i++) {
    if (content[i] === '[') depth++;
    else if (content[i] === ']') { depth--; if (depth === 0) { arrEnd = i; break; } }
  }
  const arrContent = content.slice(arrStart, arrEnd + 1);
  let result;
  eval(`result = ${arrContent}`);
  console.log(`  ${varName}: ${result.length} entries`);
  return result;
}

const DB_CREA     = extractArray(dbContent, 'DB_CREA');
const DB_BDA      = extractArray(dbContent, 'DB_BDA');
const DB_UPF      = extractArray(dbContent, 'DB_UPF');
const DB_ONS      = extractArray(dbContent, 'DB_ONS');
const DB_APROTEICI = extractArray(dbContent, 'DB_APROTEICI');
const DB_FLAVIS   = extractArray(dbContent, 'DB_FLAVIS');
const DB_EXTRA    = extractArray(dbContent, 'DB_EXTRA');

const ALL_RAW = [...DB_CREA, ...DB_BDA, ...DB_ONS, ...DB_APROTEICI, ...DB_FLAVIS, ...DB_UPF, ...DB_EXTRA];
console.log(`Total raw entries: ${ALL_RAW.length}`);

// Normalise category names to patient-app standard categories
const CAT_MAP = {
  // CREA / BDA
  'Bevande':                    'Bevande',
  'Alcolici':                   'Bevande',
  'Biscotti e crackers':        'Pane e Prodotti da Forno',
  'Carni bianche':              'Proteine',
  'Carni rosse':                'Proteine',
  'Carni e derivati':           'Proteine',
  'Cereali da colazione':       'Cereali',
  'Cereali e pasta':            'Cereali',
  'Cereali':                    'Cereali',
  'Cereali e pane':             'Pane e Prodotti da Forno',
  'Cereali e derivati':         'Cereali',
  'Crostacei':                  'Proteine',
  'Dolci':                      'Dolci e Zuccheri',
  'Dolcificanti':               'Dolci e Zuccheri',
  'Spezie':                     'Condimenti e Salse',
  'Formaggi':                   'Latticini',
  'Frutta fresca':              'Frutta',
  'Frutta lipidica':            'Frutta',
  'Frutta':                     'Frutta',
  'Frutta secca':               'Frutta secca',
  'Semi oleosi':                'Frutta secca',
  'Grassi':                     'Grassi',
  'Grassi e oli':               'Grassi',
  'Latte e derivati':           'Latticini',
  'Legumi':                     'Legumi',
  'Molluschi':                  'Proteine',
  'Pane':                       'Pane e Prodotti da Forno',
  'Pesce':                      'Proteine',
  'Piatti pronti':              'Piatti Pronti',
  'Salumi':                     'Salumi e Insaccati',
  'Uova':                       'Proteine',
  'Verdure':                    'Verdure',
  'Condimenti':                 'Condimenti e Salse',
  // UPF
  'Snack salati':               'Snack e Ultra-Processati',
  'Snack dolci':                'Snack e Ultra-Processati',
  'Bevande zuccherate':         'Bevande',
  'Fast food':                  'Snack e Ultra-Processati',
  'Piatti pronti ultra-processati': 'Piatti Pronti',
  'Salumi e insaccati UPF':     'Salumi e Insaccati',
  'Dessert e gelati':           'Dolci e Zuccheri',
  'Cereali da colazione UPF':   'Cereali',
  'Salse e condimenti UPF':     'Condimenti e Salse',
  'Pane e prodotti da forno UPF': 'Pane e Prodotti da Forno',
  'Formaggi fusi e spalmabili UPF': 'Latticini',
  // DB_EXTRA
  'Cucina etnica':              'Piatti Pronti',
  'Gelati':                     'Dolci e Zuccheri',
  'Baby food':                  'Altro',
  'Prodotti vegani':            'Altro',
  'Senza glutine':              'Altro',
  'Integratori sportivi':       'Altro',
  'Energy drink':               'Bevande',
  'Alternative vegetali':       'Latticini',
  'Bevande alcoliche':          'Bevande',
  'Dolci e dessert':            'Dolci e Zuccheri',
  'Cioccolato e dolciumi':      'Dolci e Zuccheri',
  'Frutta esotica':             'Frutta',
  // Categorie residue trovate con un audit completo delle 166 categorie grezze presenti in
  // db.js (2026-07-30) - senza questa estensione ~117 nomi di categoria grezzi (es. "Carne",
  // "ONS - Diabete", "Formaggi e latticini") passavano invariati nel campo `category` mostrato
  // all'utente (badge alimento in MacroTrackerPage, sottotitolo "brand" nella ricerca alimenti
  // in foodSearch.js) invece di essere consolidati nelle categorie standard dell'app.
  'Alcolici e simili':          'Bevande',
  'Alghe':                      'Verdure',
  'Alimenti per l\'infanzia':   'Altro',
  'Alimenti prima infanzia':    'Altro',
  'Alimenti vari':              'Altro',
  'Aminoacidi':                 'Altro',
  'Aproteici - Biscotti':       'Pane e Prodotti da Forno',
  'Aproteici - Cereali':        'Cereali',
  'Aproteici - Condimenti':     'Condimenti e Salse',
  'Aproteici - Dessert':        'Dolci e Zuccheri',
  'Aproteici - Dolci':          'Dolci e Zuccheri',
  'Aproteici - Farine':         'Cereali',
  'Aproteici - Formula':        'Altro',
  'Aproteici - Pane':           'Pane e Prodotti da Forno',
  'Aproteici - Pasta':          'Cereali',
  'Aproteici - Piatti pronti':  'Piatti Pronti',
  'Aproteici - Riso':           'Cereali',
  'Aproteici - Sostituti':      'Altro',
  'Barrette proteiche':         'Snack e Ultra-Processati',
  'Bevande vegetali':           'Latticini',
  'Bibite zuccherate':          'Bevande',
  'Biscotti industriali':       'Pane e Prodotti da Forno',
  'Carne':                      'Proteine',
  'Carne e derivati':           'Proteine',
  'Carni':                      'Proteine',
  'Carni cotte':                'Proteine',
  'Cereali confezionati':       'Cereali',
  'Cereali cotti':              'Cereali',
  'Colazione industriale':      'Snack e Ultra-Processati',
  'Condimenti e sughi':         'Condimenti e Salse',
  'Conserve vegetali':          'Verdure',
  'Creme e spalmate':           'Condimenti e Salse',
  'Dolci confezionati':         'Dolci e Zuccheri',
  'Dolci e pasticceria':        'Dolci e Zuccheri',
  'Erbe aromatiche':            'Condimenti e Salse',
  'Fast food catene':           'Snack e Ultra-Processati',
  'Fibra Integratore':          'Altro',
  'Flavis - Biscotti':          'Pane e Prodotti da Forno',
  'Flavis - Cereali':           'Cereali',
  'Flavis - Condimenti':        'Condimenti e Salse',
  'Flavis - Dessert':           'Dolci e Zuccheri',
  'Flavis - Dolci':             'Dolci e Zuccheri',
  'Flavis - Farine':            'Cereali',
  'Flavis - Pane':              'Pane e Prodotti da Forno',
  'Flavis - Pasta':             'Cereali',
  'Flavis - Piatti pronti':     'Piatti Pronti',
  'Flavis - Riso':              'Cereali',
  'Flavis - Snack':             'Snack e Ultra-Processati',
  'Formaggi e latticini':       'Latticini',
  'Frutta conservata':          'Frutta',
  'Frutta secca a guscio':      'Frutta secca',
  'Frutta secca e semi':        'Frutta secca',
  'Funghi':                     'Verdure',
  'Gelati e sorbetti':          'Dolci e Zuccheri',
  'Grassi Speciali':            'Grassi',
  'Insalate':                   'Verdure',
  'Insalate e contorni':        'Verdure',
  'Integratori':                'Altro',
  'Integratori alimentari':     'Altro',
  'Latticini':                  'Latticini',
  'Latticini alternativi':      'Latticini',
  'Latticini e formaggi':       'Latticini',
  'Latticini industriali':      'Latticini',
  'Legumi cotti':               'Legumi',
  'Legumi e verdure':           'Verdure',
  'Minerali':                   'Altro',
  'Molluschi e crostacei':      'Proteine',
  'Omega-3':                    'Altro',
  'ONS - Alta energia':         'Altro',
  'ONS - Diabete':              'Altro',
  'ONS - Enterale':             'Altro',
  'ONS - Iperproteico':         'Altro',
  'ONS - Oncologico':           'Altro',
  'ONS - Renale':               'Altro',
  'ONS - Renale ICU':           'Altro',
  'ONS - Specialistico':        'Altro',
  'ONS - Standard':             'Altro',
  'ONS Diabete':                'Altro',
  'ONS IBD/CDED':               'Altro',
  'ONS Ipercalorico':           'Altro',
  'ONS Iperproteico':           'Altro',
  'ONS Normocalorico':          'Altro',
  'ONS Oncologico':             'Altro',
  'ONS Polmonare':              'Altro',
  'ONS Renale':                 'Altro',
  'Ortaggi':                    'Verdure',
  'Pane e derivati':            'Pane e Prodotti da Forno',
  'Pane e prodotti da forno':   'Pane e Prodotti da Forno',
  'Pane farcito':               'Pane e Prodotti da Forno',
  'Pasta e cereali':            'Cereali',
  'Pesce cotto':                'Proteine',
  'Pesce e frutti di mare':     'Proteine',
  'Pesce e prodotti ittici':    'Proteine',
  'Piatti tipici regionali':    'Piatti Pronti',
  'Piatti unici':               'Piatti Pronti',
  'Pollame':                    'Proteine',
  'Prodotti clinici':           'Altro',
  'Prodotti pronti':            'Piatti Pronti',
  'Proteine in Polvere':        'Altro',
  'Salse e condimenti':         'Condimenti e Salse',
  'Salumi cotti':               'Salumi e Insaccati',
  'Salumi e insaccati':         'Salumi e Insaccati',
  'Salumi processati':          'Salumi e Insaccati',
  'Semi e frutta secca':        'Frutta secca',
  'Snack':                      'Snack e Ultra-Processati',
  'Sostituti carne vegetali':   'Proteine',
  'Sostituti latticini':        'Latticini',
  'Spezie e aromi':             'Condimenti e Salse',
  'Succhi di frutta':           'Bevande',
  'Superfoods':                 'Altro',
  'Surgelati':                  'Piatti Pronti',
  'Uova cotte':                 'Proteine',
  'Verdure cotte':              'Verdure',
  'Verdure e ortaggi':          'Verdure',
  'Vitamine':                   'Altro',
  'Zuccheri':                   'Dolci e Zuccheri',
  'Zuppe e minestre':           'Piatti Pronti',
};

const SERVING_BY_CAT = {
  'Proteine':                100,
  'Legumi':                  150,
  'Verdure':                 200,
  'Frutta':                  150,
  'Frutta secca':             30,
  'Latticini':               125,
  'Grassi':                   10,
  'Cereali':                  80,
  'Condimenti e Salse':       15,
  'Bevande':                 200,
  'Dolci e Zuccheri':         50,
  'Salumi e Insaccati':       50,
  'Pane e Prodotti da Forno': 50,
  'Piatti Pronti':           200,
  'Snack e Ultra-Processati': 30,
};

const converted = ALL_RAW.map((f, i) => {
  const rawCat = f.c || '';
  // Fallback esplicito a 'Altro' (non piu' al nome grezzo non mappato) - un CAT_MAP incompleto
  // deve degradare a una categoria pulita nota, non far trapelare una stringa arbitraria di
  // db.js nell'app paziente (vedi audit 2026-07-30 che ha trovato 117 categorie grezze cosi').
  if (rawCat && !CAT_MAP[rawCat]) {
    console.warn(`  [CAT_MAP] categoria non mappata, uso 'Altro': "${rawCat}"`);
  }
  const cat = CAT_MAP[rawCat] || 'Altro';
  // Sodium (na, mg/100g) → salt equivalent (g/100g): salt = sodium * 2.5 / 1000
  const saltFromSodium = f.na != null ? Math.round(f.na * 2.5) / 1000 : 0;
  return {
    id: `db_${i}`,
    name: f.n,
    category: cat,
    src: f.src || 'CREA',
    kcal_100g:     f.k  || 0,
    proteins_100g: f.p  || 0,
    carbs_100g:    f.ch || 0,
    fats_100g:     f.g  || 0,
    fiber_100g:    f.fi || 0,
    sugar_100g:    f.z  || 0,
    fatSat_100g:   f.gs || 0,
    salt_100g:      saltFromSodium,
    calcium_100g:   f.ca  || 0,
    iron_100g:      f.fe  || 0,
    magnesium_100g: f.mg  || 0,
    potassium_100g: f.k2  || 0,
    sodium_100g:    f.na  || 0,
    zinc_100g:      f.zn  || 0,
    folate_100g:    f.fo  || 0,
    selenium_100g:  f.se  || 0,
    cholesterol_100g: f.col || 0,
    serving_size_g: SERVING_BY_CAT[cat] || 100,
  };
});

// Deduplicate by lowercase name (keep first occurrence)
const seen = new Set();
const deduped = converted.filter(f => {
  if (!f.name) return false;
  const k = f.name.toLowerCase().trim();
  if (seen.has(k)) return false;
  seen.add(k);
  return true;
});

console.log(`After dedup: ${deduped.length} unique foods`);

const lines = deduped.map(f => `  ${JSON.stringify(f)}`).join(',\n');
const output = `// Combined food database — auto-generated from NutriPlan-Pro/js/db.js
// Sources: CREA, BDA, ONS, APROTEICI, FLAVIS, UPF
// Do not edit manually. Run: node generate-all-foods.cjs
export const ALL_FOODS = [\n${lines}\n]\n`;

fs.writeFileSync(outPath, output, 'utf8');
console.log(`Written to ${outPath} (${Math.round(fs.statSync(outPath).size / 1024)} KB)`);
