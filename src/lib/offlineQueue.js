const DB_NAME = 'nutriplan_offline'
const DB_VERSION = 2
const STORE = 'food_logs_queue'

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = e => {
      const db = e.target.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { autoIncrement: true })
      }
    }
    req.onsuccess = e => resolve(e.target.result)
    req.onerror = e => reject(e.target.error)
  })
}

export async function queueFoodLog(logData) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).add({ ...logData, queued_at: new Date().toISOString() })
    tx.oncomplete = resolve
    tx.onerror = e => reject(e.target.error)
  })
}

export async function flushQueue(supabase, userId) {
  const db = await openDB()
  const items = await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).getAll()
    req.onsuccess = e => resolve(e.target.result)
    req.onerror = e => reject(e.target.error)
  })
  if (!items.length) return 0
  const { error } = await supabase.from('food_logs').insert(
    items.map(({ queued_at, ...log }) => ({ ...log, user_id: userId }))
  )
  if (error) throw error
  // Clear queue after successful flush
  await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).clear()
    tx.oncomplete = resolve
    tx.onerror = e => reject(e.target.error)
  })
  return items.length
}

export async function getQueuedCount() {
  const db = await openDB()
  return new Promise((resolve) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).count()
    req.onsuccess = e => resolve(e.target.result)
    req.onerror = () => resolve(0)
  })
}
