// Step counter with two engines, chosen automatically:
//
// - Native app (Android/iOS via Capacitor): reads the OS's own step count
//   (Google Health Connect / Apple Health) through the `capacitor-health`
//   plugin. Android and iOS already count steps in the background all day
//   using a low-power hardware sensor, completely independent of whether
//   this app is open — we just read that aggregated total whenever the app
//   happens to be opened. This is what makes steps count "even when the app
//   isn't open".
// - Browser / plain PWA tab (no native wrapper): DeviceMotionEvent-based
//   accelerometer counter, same as before. This ONLY counts while the tab is
//   open and in the foreground — a genuine platform limitation (no website,
//   on any browser, can read Health Connect/HealthKit or run JS while
//   backgrounded/closed).
import { Capacitor } from '@capacitor/core'

const STORAGE_PREFIX = 'nutriplan_steps_'
const GOAL_KEY = 'nutriplan_step_goal'
const PERM_KEY = 'nutriplan_motion_perm'
const DEFAULT_GOAL = 10000

const THRESHOLD = 1.5        // m/s² above gravity to count as peak
const MIN_STEP_MS = 280      // minimum ~214 steps/min (very fast running)
const GRAVITY = 9.81

const NATIVE_POLL_MS = 20000 // re-read the OS step count this often while the app is open

function todayKey() {
  return STORAGE_PREFIX + new Date().toISOString().split('T')[0]
}

function startOfTodayISO() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
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

export function isNativeApp() {
  return Capacitor.isNativePlatform()
}

// Returns true if this platform CAN count steps at all — native app always
// can (Health Connect/HealthKit), browser only if it exposes DeviceMotionEvent.
export function isPedometerSupported() {
  if (isNativeApp()) return true
  return typeof window !== 'undefined' && 'DeviceMotionEvent' in window
}

// Returns true if permission is already known-granted (cached from a previous
// successful request) or not needed on this platform.
export function hasMotionPermission() {
  if (isNativeApp()) return localStorage.getItem(PERM_KEY) === 'granted'
  if (typeof DeviceMotionEvent?.requestPermission !== 'function') return true
  return localStorage.getItem(PERM_KEY) === 'granted'
}

// Native only: true once we've confirmed Health Connect (Android) is actually
// installed, or unconditionally true on iOS (HealthKit is part of the OS).
// Callers use this to show an "install Health Connect" prompt instead of a
// silent failure when requesting permission.
export async function isNativeHealthAvailable() {
  if (!isNativeApp()) return false
  try {
    const { Health } = await import('capacitor-health')
    const { available } = await Health.isHealthAvailable()
    return available
  } catch {
    return false
  }
}

export async function openHealthConnectInstall() {
  if (Capacitor.getPlatform() !== 'android') return
  try {
    const { Health } = await import('capacitor-health')
    await Health.showHealthConnectInPlayStore()
  } catch { /* ignore */ }
}

// Requests the platform's motion/health permission. On iOS Safari (PWA) this
// is the classic DeviceMotionEvent gesture-gated prompt; on a native app this
// requests Health Connect/HealthKit's READ_STEPS permission instead.
export async function requestMotionPermission() {
  if (isNativeApp()) {
    if (localStorage.getItem(PERM_KEY) === 'granted') return true
    try {
      const { Health } = await import('capacitor-health')
      const available = await isNativeHealthAvailable()
      if (!available) return false
      const res = await Health.requestHealthPermissions({ permissions: ['READ_STEPS'] })
      // iOS can't report per-permission grant/denial (Apple hides this from
      // apps) — the plugin resolves assuming success, so a resolved promise
      // is the only signal we get there. Android does report it truthfully.
      const granted = Capacitor.getPlatform() === 'ios'
        ? true
        : !!res?.permissions?.find(p => p.READ_STEPS)?.READ_STEPS
      if (granted) localStorage.setItem(PERM_KEY, 'granted')
      return granted
    } catch {
      return false
    }
  }

  if (typeof DeviceMotionEvent?.requestPermission === 'function') {
    if (localStorage.getItem(PERM_KEY) === 'granted') return true
    try {
      const result = await DeviceMotionEvent.requestPermission()
      if (result === 'granted') {
        localStorage.setItem(PERM_KEY, 'granted')
        return true
      }
      return false
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
    this._pollTimer = null
    this._visHandler = null
  }

  get steps() { return this._steps }
  get active() { return this._active }

  async start() {
    if (this._active) return true
    const ok = await requestMotionPermission()
    if (!ok) return false
    this._steps = getTodaySteps()

    if (isNativeApp()) {
      this._active = true
      this.dispatchEvent(new CustomEvent('start'))
      await this._refreshFromNativeHealth()
      this._pollTimer = setInterval(() => this._refreshFromNativeHealth(), NATIVE_POLL_MS)
      this._visHandler = () => { if (document.visibilityState === 'visible') this._refreshFromNativeHealth() }
      document.addEventListener('visibilitychange', this._visHandler)
      return true
    }

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
    if (this._pollTimer) {
      clearInterval(this._pollTimer)
      this._pollTimer = null
    }
    if (this._visHandler) {
      document.removeEventListener('visibilitychange', this._visHandler)
      this._visHandler = null
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

  // Reads the OS's own step count for today via Health Connect/HealthKit —
  // this is what actually reflects steps taken while the app was closed.
  // Takes the max against the current value: the OS total can only grow
  // through the day, so this guards against a transient/partial read (e.g.
  // Health Connect still syncing) briefly showing fewer steps than before.
  async _refreshFromNativeHealth() {
    try {
      const { Health } = await import('capacitor-health')
      const { aggregatedData } = await Health.queryAggregated({
        startDate: startOfTodayISO(),
        endDate: new Date().toISOString(),
        dataType: 'steps',
        bucket: 'day',
      })
      const total = Math.round((aggregatedData || []).reduce((s, b) => s + (b.value || 0), 0))
      if (total > this._steps) {
        this._steps = total
        setTodaySteps(this._steps)
        this.dispatchEvent(new CustomEvent('step', { detail: { steps: this._steps } }))
      }
    } catch { /* Health Connect/HealthKit temporarily unavailable — keep last known value */ }
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
