import { defineConfig } from 'vitest/config'

// Primo giro di unit test per questo repo (prima zero, solo 2 e2e minimi su
// 76 componenti). Scope: logica pura ad alto rischio clinico in src/lib —
// non componenti React (che richiederebbero @testing-library/react, non
// installato, e sono già in parte coperti da e2e). Priorità a
// mealCalculators.js: le formule di dose insulina/enzimi pancreatici sono
// esattamente il tipo di bug che un audit manuale può mancare e un test
// automatico intercetta subito.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.js'],
  },
})
