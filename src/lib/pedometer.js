// Step counter using DeviceMotionEvent accelerometer.
// Works in foreground on iOS and Android. On Android Chrome (installed PWA),
// counting continues as long as the browser process is alive in recent apps.

const STORAGE_PREFIX = 'nutriplan_steps_'
const GOAL_KEY = 'nutriplan_step_goal'
const DEFAULT_GOAL = 10000

const THRESHOLD = 1.5        // m/s² above gravity to count as peak
const MIN_STEP_MS = 280      // minimum ~214 steps/min (very fast running)
const GRAVITY = 9.81

function todayKey() {
  return STORAGE_PREFIX + new Date().toISOString().split('T')[0]
}

export function getTodaySteps() {
  return parseInt(localStorage.getItem(todayKey()) || '0', 10)
}

export function setTodaySteps(n) {
  localStorage.setItem(todayKey(), String(n))
}

export function getStepGoal() {
  const v = parseInt(localStorage.getItem(GOAL_KEY), 10)
  return isNaN(v) ? DEFAULT_GOAL : v
}

export function setStepGoal(n) {
  localStorage.setItem(GOAL_KEY, String(n))
}

// Returns true if DeviceMotionEvent is available on this device
export function isPedometerSupported() {
  return typeof window !== 'undefined' && 'DeviceMotionEvent' in window
}

// iOS 13+ requires explicit permission request from a user gesture
export async function requestMotionPermission() {
  if (typeof DeviceMotionEvent?.requestPermission === 'function') {
    try {
      const result = await DeviceMotionEvent.requestPermission()
      return result === 'granted'
    } catch {
      return false
    }
  }
  return true
}

// ─── Core pedometer class ──────────────────────────────────────────────────
export class Pedometer extends EventTarget {
  constructor() {
    super()
    this._steps = getTodaySteps()
    this._lastStepMs = 0
    this._prevMag = 0
    this._rising = false
    this._handler = null
    this._active = false
    this._notifId = null
  }

  get steps() { return this._steps }
  get active() { return this._active }

  async start() {
    if (this._active) return true
    const ok = await requestMotionPermission()
    if (!ok) return false
    this._steps = getTodaySteps()
    this._handler = e => this._onMotion(e)
    window.addEventListener('devicemotion', this._handler, { passive: true })
    this._active = true
    this.dispatchEvent(new CustomEvent('start'))
    this._showNotification()
    return true
  }

  stop() {
    if (!this._active) return
    if (this._handler) {
      window.removeEventListener('devicemotion', this._handler)
      this._handler = null
    }
    this._active = false
    this.dispatchEvent(new CustomEvent('stop'))
    this._hideNotification()
  }

  addSteps(n) {
    this._steps += n
    setTodaySteps(this._steps)
    this.dispatchEvent(new CustomEvent('step', { detail: { steps: this._steps } }))
  }

  _onMotion(e) {
    const g = e.accelerationIncludingGravity
    if (!g || g.x == null) return
    const mag = Math.sqrt(g.x * g.x + g.y * g.y + g.z * g.z) - GRAVITY
    const now = Date.now()

    if (!this._rising && mag > THRESHOLD) {
      this._rising = true
    } else if (this._rising && mag < THRESHOLD * 0.5) {
      this._rising = false
      const dt = now - this._lastStepMs
      if (this._lastStepMs === 0 || dt > MIN_STEP_MS) {
        this._steps++
        this._lastStepMs = now
        setTodaySteps(this._steps)
        this.dispatchEvent(new CustomEvent('step', { detail: { steps: this._steps } }))
        if (this._steps % 50 === 0) this._updateNotification()
      }
    }
    this._prevMag = mag
  }

  async _showNotification() {
    if (!('Notification' in window) || Notification.permission !== 'granted') return
    if (!navigator.serviceWorker?.controller) return
    try {
      const reg = await navigator.serviceWorker.ready
      await reg.showNotification('NutriPlan – Contapassi attivo', {
        body: `${this._steps} passi oggi`,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        tag: 'pedometer',
        silent: true,
        renotify: false,
      })
    } catch { /* permission denied or SW not ready */ }
  }

  async _updateNotification() {
    this._hideNotification()
    this._showNotification()
  }

  async _hideNotification() {
    if (!navigator.serviceWorker?.controller) return
    try {
      const reg = await navigator.serviceWorker.ready
      const notifs = await reg.getNotifications({ tag: 'pedometer' })
      notifs.forEach(n => n.close())
    } catch { /* ignore */ }
  }
}

// Singleton instance for the app
let _instance = null
export function getPedometer() {
  if (!_instance) _instance = new Pedometer()
  return _instance
}
