// generate-all-foods.js
// Run: node generate-all-foods.js
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
  const cat = CAT_MAP[rawCat] || rawCat || 'Altro';
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
// Do not edit manually. Run: node generate-all-foods.js
export const ALL_FOODS = [\n${lines}\n]\n`;

fs.writeFileSync(outPath, output, 'utf8');
console.log(`Written to ${outPath} (${Math.round(fs.statSync(outPath).size / 1024)} KB)`);
