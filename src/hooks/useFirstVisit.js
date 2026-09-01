import { useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'

export function useFirstVisit(pageKey) {
  // Scoped by user id (like docs_last_seen_${user.id} in BottomNav.jsx,
  // doc_bookmarks_${user?.id} in DocumentsPage.jsx) so that on a shared
  // device, one patient dismissing a tutorial doesn't hide it from the next
  // patient who logs in on the same browser.
  const { user } = useAuth()
  const key = 'tutorial_' + pageKey + (user?.id ? '_' + user.id : '')
  const [isFirstVisit] = useState(() => !localStorage.getItem(key))

  const markDone = useCallback(() => {
    localStorage.setItem(key, '1')
  }, [key])

  return { isFirstVisit, markDone }
}
