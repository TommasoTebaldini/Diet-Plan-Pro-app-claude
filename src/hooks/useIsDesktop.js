import { useState, useEffect } from 'react'

// Stessa soglia usata da BottomNav.jsx (sidebar desktop vs barra mobile) e
// dal breakpoint CSS in index.css (@media(min-width:1024px)) — un'unica
// fonte di verità per i componenti che devono cambiare layout in JS invece
// che con puro CSS (es. MealPlannerPage: griglia settimanale su desktop,
// vista a singolo giorno su mobile).
export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const handler = (e) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isDesktop
}
