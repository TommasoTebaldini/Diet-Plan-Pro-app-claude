// Matcher condiviso "parola chiave con eccezioni per falsi positivi da
// sottostringa" — usato per categorizzare alimenti in liste/piani per nome
// (es. "pesca" dentro "pescatrice", "orzo" dentro "scorzonera", "aglio"
// dentro "taglio"). Prima MealPlannerPage.jsx e ShoppingListPage.jsx avevano
// ciascuno una propria copia quasi identica di questa funzione (una faceva
// .includes(), l'altra new RegExp(w,'i').test() — necessaria perché le sue
// liste di keyword contengono pattern regex veri, es. 'mel[ae]', 'sale\\b').
// Qui si usa sempre la versione regex (compatibile anche con le keyword
// "semplici" di MealPlannerPage, che non contengono caratteri speciali).
//
// Deliberatamente NON riusato in MacroTrackerPage.jsx (detectAllergens): quel
// codice gestisce anche override "vegano"/"senza glutine" e un caso speciale
// per parole corte (confine di parola) intrecciati nella stessa logica, ed è
// safety-critical (avvisa il paziente sui SUOI allergeni registrati) — un
// refactor lì andrebbe testato dal vivo pagina per pagina prima di toccarlo,
// non fatto alla cieca in una sessione senza browser interattivo.

/**
 * @param {string} text - testo già in minuscolo su cui cercare
 * @param {string[]} words - parole/pattern regex da cercare (almeno una deve matchare)
 * @param {Record<string, RegExp>} exclusions - per ogni parola, un pattern che se matcha ESCLUDE quel match (falso positivo noto)
 */
export function matchesAnyKeyword(text, words, exclusions = {}) {
  return words.some(w => !exclusions[w]?.test(text) && new RegExp(w, 'i').test(text))
}
