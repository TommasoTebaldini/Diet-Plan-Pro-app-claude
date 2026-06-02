import { useState, useCallback } from 'react'

export function useFirstVisit(pageKey) {
  const key = 'tutorial_' + pageKey
  const [isFirstVisit] = useState(() => !localStorage.getItem(key))

  const markDone = useCallback(() => {
    localStorage.setItem(key, '1')
  }, [key])

  return { isFirstVisit, markDone }
}
