// Category metadata for QuizPage — kept as a tiny JS module (unlike the
// ~2000 question bank, which lives in public/data/quiz-questions.json and
// is fetched on demand so it never bloats the QuizPage JS chunk).
// `label` stays as the Italian fallback string; `labelKey` is resolved via
// t() at render time in QuizPage.jsx (this module can't call useT() itself
// since it's plain data, not a component).
export const CATEGORIES = {
  calorie:       { label: 'Calorie',        labelKey: 'quiz.category.calorie',        emoji: '🔥', color: '#ea580c', bg: '#fff7ed', light: '#fed7aa' },
  vitamine:      { label: 'Vitamine',       labelKey: 'quiz.category.vitamine',       emoji: '🥕', color: '#16a34a', bg: '#f0fdf4', light: '#bbf7d0' },
  minerali:      { label: 'Minerali',       labelKey: 'quiz.category.minerali',       emoji: '⚡', color: '#0891b2', bg: '#ecfeff', light: '#a5f3fc' },
  idratazione:   { label: 'Idratazione',    labelKey: 'quiz.category.idratazione',    emoji: '💧', color: '#2563eb', bg: '#eff6ff', light: '#bfdbfe' },
  macronutrienti:{ label: 'Macronutrienti', labelKey: 'quiz.category.macronutrienti', emoji: '🥗', color: '#7c3aed', bg: '#f5f3ff', light: '#ddd6fe' },
  salute:        { label: 'Salute',         labelKey: 'quiz.category.salute',         emoji: '❤️', color: '#dc2626', bg: '#fef2f2', light: '#fecaca' },
  miti:          { label: 'Miti & Verità',  labelKey: 'quiz.category.miti',           emoji: '🔍', color: '#d97706', bg: '#fefce8', light: '#fde68a' },
  porzioni:      { label: 'Porzioni',       labelKey: 'quiz.category.porzioni',       emoji: '🍽️', color: '#9333ea', bg: '#faf5ff', light: '#e9d5ff' },
}
