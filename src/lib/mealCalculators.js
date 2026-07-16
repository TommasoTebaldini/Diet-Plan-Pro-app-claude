// Shared dose-calculation formulas for pathologies where a logged meal maps
// directly to an actionable number (insulin units, enzyme units...). Used by
// both the standalone Speciale calculators (DiabeteCalculator.jsx,
// PancreasCalculator.jsx) and the diario's per-meal summary
// (MealDoseCalculator.jsx) — extracted here so the two call sites can never
// drift onto two different formulas for the same dose.

function num(v) {
  if (v === null || v === undefined || v === '') return null
  const n = parseFloat(String(v).replace(',', '.'))
  return Number.isFinite(n) && n > 0 ? n : null
}

// Free-text result strings like "1U : 8g" or "45 mg/dL" (the live calculators
// on diabete.html write their result as display text, not a clean number) —
// used as a fallback when the dedicated numeric field is empty.
function firstNumber(v) {
  if (!v) return null
  const m = String(v).match(/[\d.,]+/)
  return m ? num(m[0]) : null
}

export function round05(n) {
  return Math.round(n * 2) / 2
}

function timeToMinutes(t) {
  if (!t) return null
  const [h, m] = String(t).split(':').map(Number)
  return Number.isFinite(h) ? h * 60 + (m || 0) : null
}
function isInRange(current, from, to) {
  if (from === null || to === null) return false
  return from <= to ? current >= from && current < to : current >= from || current < to // wraps midnight
}
function findFasciaIdx(fasce, atMinutes) {
  const idx = fasce.findIndex(f => isInRange(atMinutes, timeToMinutes(f.oraDa), timeToMinutes(f.oraA)))
  return idx >= 0 ? idx : 0
}

// dati: the diabete note's `dati` object (note_specialistiche.dati).
// choGrams: carbs in the meal. glicemia: current blood glucose (optional,
// only needed for the correction dose). atTime: 'HH:MM' to pick the right
// time-block profile for — pass the meal's own time so a meal logged this
// morning still uses this morning's ratio, not whatever time it is now.
export function calcDiabeteMealDose(dati, { choGrams, glicemia, atTime } = {}) {
  const fasce = (dati?.fasce_orarie || []).filter(f => f && (f.ic || f.fsi))
  const atMinutes = timeToMinutes(atTime) ?? (new Date().getHours() * 60 + new Date().getMinutes())
  const fasciaIdx = fasce.length ? findFasciaIdx(fasce, atMinutes) : -1
  const fasciaAttiva = fasciaIdx >= 0 ? fasce[fasciaIdx] : null

  const icRatio = num(fasciaAttiva?.ic) ?? num(dati?.dose_pasto?.ic) ?? firstNumber(dati?.rapporto_ic?.risultato) ?? firstNumber(dati?.depliant?.ic)
  const fsi = num(fasciaAttiva?.fsi) ?? num(dati?.dose_pasto?.fsi) ?? firstNumber(dati?.fsi?.risultato) ?? firstNumber(dati?.depliant?.fsi)
  const target = num(fasciaAttiva?.target) ?? num(dati?.dose_pasto?.target) ?? firstNumber(dati?.depliant?.target)

  const choVal = num(choGrams)
  const glicemiaVal = num(glicemia)

  const mealDoseRaw = icRatio && choVal ? choVal / icRatio : null
  const correctionDoseRaw = fsi && target && glicemiaVal ? (glicemiaVal - target) / fsi : null
  const total = mealDoseRaw !== null || correctionDoseRaw !== null
    ? round05((mealDoseRaw || 0) + (correctionDoseRaw || 0))
    : null

  return {
    available: !!(icRatio || fsi),
    total,
    mealDose: mealDoseRaw !== null ? round05(mealDoseRaw) : null,
    correctionDose: correctionDoseRaw !== null ? round05(correctionDoseRaw) : null,
    icRatio, fsi, target,
    fasciaNome: fasciaAttiva?.nome || null,
    // true when a correction COULD be computed (fsi+target known) but the
    // caller hasn't supplied a current glycemia reading yet
    needsGlicemia: !!fsi && !!target && glicemiaVal === null,
  }
}

// The dietist's own PERT reference dose (grams of fat → UL, or UL/kg × weight)
// is the source of truth for the per-unit rate — back-derived instead of
// re-implementing the pathology/method lookup table from pancreas.html, so
// this can never drift out of sync with what the dietist actually prescribed.
function parseULText(v) {
  if (!v) return null
  const digits = String(v).replace(/[^\d]/g, '')
  return digits ? parseInt(digits, 10) : null
}

// dati: the pancreas note's `dati` object. fatGrams: fat in the meal (only
// used for the 'grassi' method). currentWeight: patient's latest logged
// weight in kg (only used for the 'peso' method, falls back to the
// dietitian's reference weight if no weight has been logged yet).
export function calcPancreasMealDose(dati, { fatGrams, currentWeight } = {}) {
  const isGrassiMethod = dati?.pert?.metodo === 'grassi'
  const isPesoMethod = dati?.pert?.metodo === 'peso'
  const grassiRef = num(dati?.pert?.grassi)
  const pesoRef = num(dati?.pert?.peso)
  const ulRef = parseULText(dati?.pert?.risultato_ul)

  const ratePerGram = isGrassiMethod && grassiRef && ulRef ? ulRef / grassiRef : null
  const ratePerKg = isPesoMethod && pesoRef && ulRef ? ulRef / pesoRef : null
  const weightForDose = currentWeight ?? pesoRef
  const ulFromWeight = ratePerKg && weightForDose ? Math.round(ratePerKg * weightForDose) : null

  const fatVal = num(fatGrams)
  const ul = isPesoMethod ? ulFromWeight : (ratePerGram && fatVal ? Math.round(ratePerGram * fatVal) : null)

  return {
    available: isGrassiMethod ? !!ratePerGram : isPesoMethod ? !!ratePerKg : false,
    ul,
    isGrassiMethod, isPesoMethod,
    ratePerGram, ratePerKg, pesoRef, grassiRef,
    creon40: ul ? Math.ceil(ul / 40000) : null,
    creon25: ul ? Math.ceil(ul / 25000) : null,
    creon10: ul ? Math.ceil(ul / 10000) : null,
  }
}
