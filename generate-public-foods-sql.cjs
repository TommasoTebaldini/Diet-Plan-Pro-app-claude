// generate-public-foods-sql.cjs
// Reads src/data/all-foods.js and generates INSERT SQL for the public_foods Supabase table.
// Run: node generate-public-foods-sql.cjs
// Then paste the output SQL into the Supabase SQL editor.

const fs = require('fs');
const path = require('path');

const allFoodsPath = path.resolve(__dirname, 'src/data/all-foods.js');
const outPath = path.resolve(__dirname, 'public_foods_migration.sql');

// all-foods.js is one JSON object per line — parse it directly
const src = fs.readFileSync(allFoodsPath, 'utf8');

// Extract the array content between the first '[' and the last ']'
const start = src.indexOf('[');
const end = src.lastIndexOf(']');
const arrayStr = src.slice(start, end + 1);

const ALL_FOODS = JSON.parse(arrayStr);
console.log(`Loaded ${ALL_FOODS.length} foods`);

function esc(str) {
  if (str == null) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}
function num(v) {
  const n = parseFloat(v);
  return isNaN(n) ? 'NULL' : String(n);
}

const lines = [];
lines.push('-- public_foods migration — auto-generated from all-foods.js');
lines.push('-- Run once in the Supabase SQL editor to populate the shared food database.');
lines.push('-- Safe to re-run: uses INSERT ... ON CONFLICT DO NOTHING based on (name, category).');
lines.push('');
lines.push('-- Step 1: add the src column if it does not already exist');
lines.push("ALTER TABLE public_foods ADD COLUMN IF NOT EXISTS src text DEFAULT 'custom';");
lines.push('');
lines.push('-- Step 2: add unique constraint if not already present');
lines.push('DO $$ BEGIN');
lines.push('  ALTER TABLE public_foods ADD CONSTRAINT public_foods_name_cat_key UNIQUE (name, category);');
lines.push("EXCEPTION WHEN duplicate_table THEN NULL; END $$;");
lines.push('');

// Split into chunks of 500 to avoid SQL statement size limits
const CHUNK = 500;
for (let i = 0; i < ALL_FOODS.length; i += CHUNK) {
  const chunk = ALL_FOODS.slice(i, i + CHUNK);
  lines.push(`-- Chunk ${Math.floor(i/CHUNK) + 1}: foods ${i+1}–${Math.min(i+CHUNK, ALL_FOODS.length)}`);
  lines.push('INSERT INTO public_foods (name, category, kcal_100g, proteins_100g, carbs_100g, fats_100g, fiber_100g, sugar_100g, fat_sat_100g, src)');
  lines.push('VALUES');
  const rows = chunk.map(f =>
    `  (${esc(f.name)}, ${esc(f.category)}, ${num(f.kcal_100g)}, ${num(f.proteins_100g)}, ${num(f.carbs_100g)}, ${num(f.fats_100g)}, ${num(f.fiber_100g)}, ${num(f.sugar_100g)}, ${num(f.fatSat_100g)}, ${esc(f.src || 'CREA')})`
  );
  lines.push(rows.join(',\n'));
  lines.push('ON CONFLICT (name, category) DO NOTHING;');
  lines.push('');
}

lines.push(`-- Total: ${ALL_FOODS.length} foods`);

fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
console.log(`Written to ${outPath} (${Math.round(fs.statSync(outPath).size / 1024)} KB)`);
