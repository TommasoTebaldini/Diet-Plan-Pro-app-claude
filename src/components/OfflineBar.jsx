import { useState, useEffect, useCallback } from 'react'
import { WifiOff, Wifi, RefreshCw, AlertTriangle } from 'lucide-react'
import { useT } from '../i18n'
import { syncPendingWrites, getPendingCount, getFailedCount } from '../lib/offlineDB'

/**
 * Shows a banner when the device is offline.
 * On reconnect: syncs IndexedDB queue to Supabase, then fires onReconnect.
 */
export default function OfflineBar({ onReconnect }) {
  const t = useT()
  const [online, setOnline] = useState(() => navigator.onLine)
  const [justReconnected, setJustReconnected] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState(null) // { synced, failed, gaveUp }
  const [pendingCount, setPendingCount] = useState(0)
  const [failedCount, setFailedCount] = useState(0)

  // Writes that gave up permanently (see offlineDB MAX_SYNC_ATTEMPTS) used to
  // vanish silently — check once on mount so a user who reopens the app days
  // later still finds out something was never saved, not just right after
  // the sync that gave up on it.
  useEffect(() => {
    let mounted = true
    getFailedCount().then(n => { if (mounted) setFailedCount(n) })
    return () => { mounted = false }
  }, [])

  // Poll pending count while offline
  useEffect(() => {
    if (online) { setPendingCount(0); return }
    let mounted = true
    async function poll() {
      const n = await getPendingCount()
      if (mounted) setPendingCount(n)
    }
    poll()
    const id = setInterval(poll, 5000)
    return () => { mounted = false; clearInterval(id) }
  }, [online])

  const handleOnline = useCallback(async () => {
    setOnline(true)
    setJustReconnected(true)
    setSyncing(true)
    try {
      const result = await syncPendingWrites()
      setSyncResult(result)
      if (result.gaveUp > 0) setFailedCount(n => n + result.gaveUp)
      if (typeof onReconnect === 'function') await onReconnect()
    } finally {
      setSyncing(false)
      setTimeout(() => { setJustReconnected(false); setSyncResult(null) }, 4000)
    }
  }, [onReconnect])

  const handleOffline = useCallback(() => {
    setOnline(false)
    setJustReconnected(false)
  }, [])

  useEffect(() => {
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [handleOnline, handleOffline])

  const isOffline = !online

  // A permanently-failed write (see offlineDB MAX_SYNC_ATTEMPTS) used to just
  // vanish once the reconnect banner faded — now it keeps a persistent
  // notice up even fully online/idle, since the data was genuinely never
  // saved and the user has no other way to find out.
  const showFailedNotice = failedCount > 0 && online && !justReconnected && !syncing
  if (online && !justReconnected && !showFailedNotice) return null

  let message
  let bg = isOffline ? '#2d2d2d' : 'var(--green-main)'
  if (isOffline) {
    message = (
      <>
        <WifiOff size={15} />
        <span>{t('offline.no_connection')}</span>
        {pendingCount > 0 && (
          <span style={{ fontSize: 11, opacity: 0.85, background: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: '2px 8px' }}>
            {t('offline.pending_count', { count: pendingCount }, '{{count}} log in attesa')}
          </span>
        )}
      </>
    )
  } else if (syncing) {
    message = <><RefreshCw size={15} style={{ animation: 'spin 0.7s linear infinite' }} /> {t('offline.syncing')}</>
  } else if (syncResult && syncResult.gaveUp > 0) {
    bg = '#B45309'
    message = <><AlertTriangle size={15} /> {t('offline.gave_up_count', { count: syncResult.gaveUp }, '{{count}} elementi non salvati: riprova o contatta il supporto')}</>
  } else if (syncResult && syncResult.synced > 0) {
    message = <><Wifi size={15} /> ✓ {t('offline.synced_count', { count: syncResult.synced }, '{{count}} log sincronizzati')}</>
  } else if (justReconnected) {
    message = <><Wifi size={15} /> {t('offline.reconnected')}</>
  } else {
    // showFailedNotice, tornati online da un pezzo: solo il residuo mai salvato
    bg = '#B45309'
    message = <><AlertTriangle size={15} /> {t('offline.failed_count', { count: failedCount }, '{{count}} elementi non salvati in un tentativo precedente')}</>
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 300,
      background: bg,
      color: 'white',
      padding: 'calc(env(safe-area-inset-top) + 10px) 16px 10px',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      fontSize: 13, fontWeight: 500,
      transition: 'background 0.3s',
      animation: 'slideDown 0.3s ease',
    }}>
      {message}
    </div>
  )
}
