// IndexedDB offline queue — writes are queued when offline and synced on reconnect
const DB_NAME = 'nutriplan_offline'
const DB_VERSION = 1
const QUEUE_STORE = 'sync_queue'

let _db = null

async function getDB() {
  if (_db) return _db
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = (e) => {
      const db = e.target.result
      if (!db.objectStoreNames.contains(QUEUE_STORE)) {
        const store = db.createObjectStore(QUEUE_STORE, { keyPath: 'id', autoIncrement: true })
        store.createIndex('table_name', 'table_name', { unique: false })
        store.createIndex('synced', 'synced', { unique: false })
      }
    }
    req.onsuccess = (e) => { _db = e.target.result; resolve(_db) }
    req.onerror = () => reject(req.error)
  })
}

async function queueWrite(tableName, operation, data) {
  const db = await getDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(QUEUE_STORE, 'readwrite')
    const store = tx.objectStore(QUEUE_STORE)
    const req = store.add({
      table_name: tableName,
      operation, // 'insert' | 'update' | 'delete'
      data,
      synced: 0,
      queued_at: new Date().toISOString(),
    })
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function getPendingItems() {
  const db = await getDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(QUEUE_STORE, 'readonly')
    const store = tx.objectStore(QUEUE_STORE)
    const idx = store.index('synced')
    const req = idx.getAll(IDBKeyRange.only(0))
    req.onsuccess = () => resolve(req.result || [])
    req.onerror = () => reject(req.error)
  })
}

async function markSynced(id) {
  const db = await getDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(QUEUE_STORE, 'readwrite')
    const store = tx.objectStore(QUEUE_STORE)
    const getReq = store.get(id)
    getReq.onsuccess = () => {
      const item = getReq.result
      if (!item) return resolve()
      item.synced = 1
      const putReq = store.put(item)
      putReq.onsuccess = () => resolve()
      putReq.onerror = () => reject(putReq.error)
    }
    getReq.onerror = () => reject(getReq.error)
  })
}

/** Returns number of unsynced writes waiting in the queue */
export async function getPendingCount() {
  try {
    const items = await getPendingItems()
    return items.length
  } catch {
    return 0
  }
}

/**
 * Sync all pending queue items to Supabase.
 * Call this on reconnect (OfflineBar) or on app focus.
 * Returns { synced, failed }.
 */
export async function syncPendingWrites() {
  if (!navigator.onLine) return { synced: 0, failed: 0 }
  let pending = []
  try { pending = await getPendingItems() } catch { return { synced: 0, failed: 0 } }
  if (!pending.length) return { synced: 0, failed: 0 }

  const { supabase } = await import('./supabase')
  let synced = 0, failed = 0

  for (const item of pending) {
    try {
      if (item.operation === 'insert') {
        const { error } = await supabase.from(item.table_name).insert(item.data)
        if (error) throw error
      } else if (item.operation === 'update') {
        const { id, ...rest } = item.data
        const { error } = await supabase.from(item.table_name).update(rest).eq('id', id)
        if (error) throw error
      } else if (item.operation === 'delete') {
        const { error } = await supabase.from(item.table_name).delete().eq('id', item.data.id)
        if (error) throw error
      }
      await markSynced(item.id)
      synced++
    } catch (e) {
      console.warn('[offlineDB] Sync failed for item', item.id, e.message)
      failed++
    }
  }

  return { synced, failed }
}

/**
 * Safe write: attempts Supabase first, falls back to IndexedDB queue when offline.
 * Returns { data, offline: boolean }.
 */
export async function safeWrite(tableName, data, operation = 'insert') {
  if (navigator.onLine) {
    try {
      const { supabase } = await import('./supabase')
      let result
      if (operation === 'insert') {
        result = await supabase.from(tableName).insert(data).select().single()
      } else if (operation === 'update') {
        const { id, ...rest } = data
        result = await supabase.from(tableName).update(rest).eq('id', id).select().single()
      } else if (operation === 'delete') {
        result = await supabase.from(tableName).delete().eq('id', data.id)
      }
      if (!result?.error) return { data: result?.data ?? data, offline: false }
    } catch {
      // Fall through to offline queue
    }
  }
  await queueWrite(tableName, operation, data)
  return { data: { ...data, id: data.id || 'pending_' + Date.now() }, offline: true }
}
