import { useState, useEffect, useCallback } from 'react'
import { WifiOff, Wifi, RefreshCw } from 'lucide-react'
import { useT } from '../i18n'
import { syncPendingWrites, getPendingCount } from '../lib/offlineDB'

/**
 * Shows a banner when the device is offline.
 * On reconnect: syncs IndexedDB queue to Supabase, then fires onReconnect.
 */
export default function OfflineBar({ onReconnect }) {
  const t = useT()
  const [online, setOnline] = useState(() => navigator.onLine)
  const [justReconnected, setJustReconnected] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState(null) // { synced, failed }
  const [pendingCount, setPendingCount] = useState(0)

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

  if (online && !justReconnected) return null

  const isOffline = !online

  let message
  if (isOffline) {
    message = (
      <>
        <WifiOff size={15} />
        <span>{t('offline.no_connection')}</span>
        {pendingCount > 0 && (
          <span style={{ fontSize: 11, opacity: 0.85, background: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: '2px 8px' }}>
            {pendingCount} log in attesa
          </span>
        )}
      </>
    )
  } else if (syncing) {
    message = <><RefreshCw size={15} style={{ animation: 'spin 0.7s linear infinite' }} /> {t('offline.syncing')}</>
  } else if (syncResult && syncResult.synced > 0) {
    message = <><Wifi size={15} /> ✓ {syncResult.synced} log sincronizzati</>
  } else {
    message = <><Wifi size={15} /> {t('offline.reconnected')}</>
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 300,
      background: isOffline ? '#2d2d2d' : 'var(--green-main)',
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
