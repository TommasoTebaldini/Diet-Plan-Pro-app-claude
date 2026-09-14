import { describe, it, expect } from 'vitest'
import { round05, calcDiabeteMealDose, calcPancreasMealDose } from './mealCalculators'

describe('round05', () => {
  it('rounds to the nearest 0.5', () => {
    expect(round05(2.1)).toBe(2)
    expect(round05(2.24)).toBe(2)
    expect(round05(2.26)).toBe(2.5)
    expect(round05(2.25)).toBe(2.5)
    expect(round05(0)).toBe(0)
  })
})

describe('calcDiabeteMealDose', () => {
  it('computes a simple meal-only dose from the IC ratio', () => {
    const dati = { dose_pasto: { ic: 10 } }
    const r = calcDiabeteMealDose(dati, { choGrams: 50 })
    expect(r.available).toBe(true)
    expect(r.mealDose).toBe(5)
    expect(r.correctionDose).toBeNull()
    expect(r.total).toBe(5)
    expect(r.hypoglycemiaWarning).toBe(false)
  })

  it('adds a positive correction dose on top of the meal dose', () => {
    const dati = { dose_pasto: { ic: 10, fsi: 30, target: 120 } }
    const r = calcDiabeteMealDose(dati, { choGrams: 50, glicemia: 180 })
    expect(r.mealDose).toBe(5)
    expect(r.correctionDose).toBe(2) // (180-120)/30
    expect(r.total).toBe(7)
  })

  // Bug class this guards against: a raw negative correction (glicemia below
  // target) must never be surfaced as "remove insulin" — it must clamp to 0
  // and flag hypoglycemia instead, per the comment in mealCalculators.js.
  it('clamps a negative correction dose to 0 and raises the hypoglycemia flag', () => {
    const dati = { dose_pasto: { fsi: 30, target: 120 } }
    const r = calcDiabeteMealDose(dati, { glicemia: 90 })
    expect(r.correctionDose).toBe(-1)
    expect(r.total).toBe(0)
    expect(r.hypoglycemiaWarning).toBe(true)
  })

  it('picks the time-block (fascia) matching atTime over the flat dose_pasto fallback', () => {
    const dati = {
      fasce_orarie: [
        { nome: 'Colazione', oraDa: '06:00', oraA: '10:00', ic: 8 },
        { nome: 'Pranzo', oraDa: '12:00', oraA: '15:00', ic: 12 },
      ],
      dose_pasto: { ic: 999 },
    }
    const r = calcDiabeteMealDose(dati, { choGrams: 60, atTime: '13:00' })
    expect(r.fasciaNome).toBe('Pranzo')
    expect(r.icRatio).toBe(12)
    expect(r.mealDose).toBe(5) // 60/12
  })

  it('falls back to the flat dose_pasto ratio when no fascia matches atTime', () => {
    const dati = {
      fasce_orarie: [{ nome: 'Colazione', oraDa: '06:00', oraA: '10:00', ic: 8 }],
      dose_pasto: { ic: 10 },
    }
    const r = calcDiabeteMealDose(dati, { choGrams: 50, atTime: '20:00' })
    expect(r.fasciaNome).toBeNull()
    expect(r.icRatio).toBe(10)
  })

  it('reports needsGlicemia when a correction could be computed but no reading was supplied', () => {
    const dati = { dose_pasto: { fsi: 30, target: 120 } }
    const r = calcDiabeteMealDose(dati, {})
    expect(r.needsGlicemia).toBe(true)
    expect(r.total).toBeNull()
  })

  it('is unavailable when neither an IC ratio nor an FSI is configured', () => {
    const r = calcDiabeteMealDose({}, { choGrams: 50 })
    expect(r.available).toBe(false)
    expect(r.total).toBeNull()
  })
})

describe('calcPancreasMealDose', () => {
  it('computes PERT units from the fat-grams method', () => {
    const dati = { pert: { metodo: 'grassi', grassi: 10, risultato_ul: '800' } }
    const r = calcPancreasMealDose(dati, { fatGrams: 25 })
    expect(r.available).toBe(true)
    expect(r.isGrassiMethod).toBe(true)
    expect(r.ul).toBe(2000) // (800/10) * 25
    expect(r.creon40).toBe(1)
    expect(r.creon25).toBe(1)
    expect(r.creon10).toBe(1)
  })

  it('computes PERT units from the weight method, using the logged weight over the reference weight', () => {
    const dati = { pert: { metodo: 'peso', peso: 70, risultato_ul: '25000 UL/kg' } }
    const r = calcPancreasMealDose(dati, { currentWeight: 80 })
    expect(r.available).toBe(true)
    expect(r.isPesoMethod).toBe(true)
    expect(r.ul).toBe(28571) // round((25000/70) * 80)
    expect(r.creon40).toBe(1)
    expect(r.creon25).toBe(2)
    expect(r.creon10).toBe(3)
  })

  it('falls back to the dietitian reference weight when no current weight is logged', () => {
    const dati = { pert: { metodo: 'peso', peso: 70, risultato_ul: '7000' } }
    const r = calcPancreasMealDose(dati, {})
    expect(r.ul).toBe(7000) // round((7000/70) * 70)
  })

  it('is unavailable when the method is unset', () => {
    const r = calcPancreasMealDose({}, { fatGrams: 20 })
    expect(r.available).toBe(false)
    expect(r.ul).toBeNull()
  })
})
