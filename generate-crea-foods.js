// generate-crea-foods.js
// Run: node generate-crea-foods.js
// Reads NutriPlan-Pro/js/db.js, converts DB_CREA to patient-app format,
// writes src/data/crea-foods.js

const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, '../NutriPlan-Pro/js/db.js');
const outPath = path.resolve(__dirname, 'src/data/crea-foods.js');

const dbContent = fs.readFileSync(dbPath, 'utf8');

// Extract DB_CREA array content (between first [ and its matching ])
const start = dbContent.indexOf('const DB_CREA=[');
if (start === -1) { console.error('DB_CREA not found'); process.exit(1); }
const arrStart = dbContent.indexOf('[', start);
let depth = 0, arrEnd = -1;
for (let i = arrStart; i < dbContent.length; i++) {
  if (dbContent[i] === '[') depth++;
  else if (dbContent[i] === ']') { depth--; if (depth === 0) { arrEnd = i; break; } }
}
const arrContent = dbContent.slice(arrStart, arrEnd + 1);

let DB_CREA;
eval(`DB_CREA = ${arrContent}`);
console.log(`Parsed ${DB_CREA.length} entries from DB_CREA`);

const CAT_MAP = {
  'Bevande': 'Bevande',
  'Alcolici': 'Bevande',
  'Biscotti e crackers': 'Pane e Prodotti da Forno',
  'Carni bianche': 'Proteine',
  'Carni rosse': 'Proteine',
  'Carni e derivati': 'Proteine',
  'Cereali da colazione': 'Cereali',
  'Cereali e pasta': 'Cereali',
  'Cereali': 'Cereali',
  'Cereali e pane': 'Pane e Prodotti da Forno',
  'Cereali e derivati': 'Cereali',
  'Crostacei': 'Proteine',
  'Dolci': 'Dolci e Zuccheri',
  'Dolcificanti': 'Dolci e Zuccheri',
  'Spezie': 'Condimenti e Salse',
  'Formaggi': 'Latticini',
  'Frutta fresca': 'Frutta',
  'Frutta lipidica': 'Frutta',
  'Frutta': 'Frutta',
  'Frutta secca': 'Frutta secca',
  'Semi oleosi': 'Frutta secca',
  'Grassi': 'Grassi',
  'Grassi e oli': 'Grassi',
  'Latte e derivati': 'Latticini',
  'Legumi': 'Legumi',
  'Molluschi': 'Proteine',
  'Pane': 'Pane e Prodotti da Forno',
  'Pesce': 'Proteine',
  'Piatti pronti': 'Piatti Pronti',
  'Salumi': 'Salumi e Insaccati',
  'Uova': 'Proteine',
  'Verdure': 'Verdure',
  'Condimenti': 'Condimenti e Salse',
};

const SERVING_BY_CAT = {
  'Proteine': 100,
  'Legumi': 150,
  'Verdure': 200,
  'Frutta': 150,
  'Frutta secca': 30,
  'Latticini': 125,
  'Grassi': 10,
  'Cereali': 80,
  'Condimenti e Salse': 15,
  'Bevande': 200,
  'Dolci e Zuccheri': 50,
  'Salumi e Insaccati': 50,
  'Pane e Prodotti da Forno': 50,
  'Piatti Pronti': 200,
};

const converted = DB_CREA.map((f, i) => {
  const cat = CAT_MAP[f.c] || 'Altro';
  return {
    id: `crea_${i}`,
    name: f.n,
    category: cat,
    kcal_100g: f.k || 0,
    proteins_100g: f.p || 0,
    carbs_100g: f.ch || 0,
    fats_100g: f.g || 0,
    fiber_100g: f.fi || 0,
    sugar_100g: f.z || 0,
    fatSat_100g: f.gs || 0,
    serving_size_g: SERVING_BY_CAT[cat] || 100,
  };
});

// Deduplicate by lowercase name (keep first occurrence)
const seen = new Set();
const deduped = converted.filter(f => {
  const k = f.name.toLowerCase().trim();
  if (seen.has(k)) return false;
  seen.add(k);
  return true;
});

console.log(`After dedup: ${deduped.length} unique foods`);

const lines = deduped.map(f => `  ${JSON.stringify(f)}`).join(',\n');
const output = `// CREA food database — auto-generated from NutriPlan-Pro/js/db.js
// Do not edit manually. Run: node generate-crea-foods.js
export const CREA_FOODS = [\n${lines}\n]\n`;

fs.writeFileSync(outPath, output, 'utf8');
console.log(`Written to ${outPath}`);
