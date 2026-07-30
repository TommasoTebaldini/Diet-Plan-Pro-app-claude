// Stima "a occhio" della porzione con il metodo delle misure a mano — una
// tecnica di educazione nutrizionale usata da molti dietisti per stimare le
// porzioni quando non si ha una bilancia a disposizione (tipicamente fuori
// casa, al ristorante, a una cena). Ogni riferimento corrisponde a un peso
// approssimativo che varia in base al tipo di alimento.
export const HAND_PORTIONS = [
  { key: 'palmo', label: '🤚 Palmo di mano', hint: 'proteine (carne, pesce, uova, formaggio)', grams: { protein: 120, default: 100 } },
  { key: 'pugno', label: '✊ Pugno chiuso', hint: 'carboidrati o verdure (riso, pasta, insalata)', grams: { carb: 150, veg: 200, default: 150 } },
  { key: 'coppa', label: '🥣 Mano a coppa', hint: 'frutta secca, snack, cereali da colazione', grams: { snack: 30, default: 40 } },
  { key: 'pollice', label: '👍 Pollice', hint: 'condimenti, olio, salse, burro', grams: { fat: 15, default: 15 } },
]

const CATEGORY_GROUP = {
  Proteine: 'protein',
  'Salumi e Insaccati': 'protein',
  Latticini: 'protein',
  Cereali: 'carb',
  'Pane e Prodotti da Forno': 'carb',
  Legumi: 'carb',
  Verdure: 'veg',
  Grassi: 'fat',
  'Condimenti e Salse': 'fat',
  'Frutta secca': 'snack',
  'Dolci e Zuccheri': 'snack',
  'Snack e Ultra-Processati': 'snack',
}

// Ritorna una stima in grammi per un dato riferimento a mano, adattata alla
// categoria dell'alimento (le stesse categorie già usate da getDefaultServingSize
// in MacroTrackerPage.jsx). Sempre e solo una stima — mai spacciata per un
// valore pesato con precisione.
export function estimateHandPortionGrams(handKey, foodCategory) {
  const hand = HAND_PORTIONS.find(h => h.key === handKey)
  if (!hand) return null
  const group = CATEGORY_GROUP[foodCategory]
  return hand.grams[group] ?? hand.grams.default
}
