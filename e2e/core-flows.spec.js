import { test, expect } from '@playwright/test'

// Core authenticated flows (log a meal, log water, view the prescribed diet).
// smoke.spec.js deliberately stays unauthenticated/network-free; these tests
// need a "logged in" patient, so they fake a Supabase session in localStorage
// (matching src/lib/supabase.js's storageKey: 'nutriplan_patient_auth') and
// intercept every /rest/v1/* call — no live Supabase project is touched.

const FAKE_USER_ID = 'e2e00000-0000-4000-8000-000000000001'
const FAKE_DIET_ID = 'e2e00000-0000-4000-8000-000000000002'

function fakeSession() {
  const nowSec = Math.floor(Date.now() / 1000)
  return {
    access_token: 'e2e-fake-access-token',
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: nowSec + 24 * 3600, // far enough out that autoRefreshToken never fires during the test
    refresh_token: 'e2e-fake-refresh-token',
    user: {
      id: FAKE_USER_ID,
      aud: 'authenticated',
      role: 'authenticated',
      email: 'e2e-patient@example.com',
      app_metadata: {},
      user_metadata: {},
    },
  }
}

const FAKE_PROFILE = {
  id: FAKE_USER_ID, email: 'e2e-patient@example.com', role: 'patient',
  full_name: 'Paziente Test', first_name: 'Paziente', last_name: 'Test',
  avatar_url: null, target_weight: null, height_cm: null, birth_date: null,
  gender: null, activity_level: 'moderato', intolerances: [], food_preferences: [],
  last_seen_at: null, ai_photo_consent_at: null, coach_ai_consent_at: null, nutrition_goal: null,
}

// PostgREST's single-row contract: a query built with .single()/.maybeSingle()
// sends `Accept: application/vnd.pgrst.object+json` and expects the response
// body to be one JSON object (not an array) — everything else expects an array.
function wantsSingleObject(headers) {
  return (headers['accept'] || '').includes('vnd.pgrst.object')
}

function tableFromUrl(url) {
  const m = url.match(/\/rest\/v1\/([^?]+)/)
  return m ? m[1] : ''
}

/**
 * Registers one catch-all handler for /rest/v1/* and /auth/v1/* so no test
 * hits a real network. `overrides[table]` can supply a function
 * (route, table) => true if it handled the request, false to fall through
 * to the generic default (empty array / created echo).
 */
async function mockBackend(page, overrides = {}) {
  await page.addInitScript(([storageKey, session]) => {
    localStorage.setItem(storageKey, JSON.stringify(session))
  }, ['nutriplan_patient_auth', fakeSession()])

  await page.route('**/auth/v1/**', route => {
    const url = route.request().url()
    if (url.includes('/auth/v1/user')) {
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(fakeSession().user) })
    }
    // Anything else (token refresh, etc.) — shouldn't be hit given the far-future expiry, but don't hang the test if it is.
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(fakeSession()) })
  })

  await page.route('**/rest/v1/**', async route => {
    const req = route.request()
    const table = tableFromUrl(req.url())
    const handled = overrides[table] && await overrides[table](route, req)
    if (handled) return

    if (table === 'profiles') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(wantsSingleObject(req.headers()) ? FAKE_PROFILE : [FAKE_PROFILE]) })
    }

    // Generic default: inserts/updates echo back what was sent (as the
    // single object PostgREST would return with `select().single()`),
    // everything else returns "no rows" in the shape the caller asked for.
    if (req.method() === 'POST' || req.method() === 'PATCH') {
      const body = req.postDataJSON()
      const echoed = Array.isArray(body) ? body.map(b => ({ id: 'e2e-' + Math.random().toString(36).slice(2), ...b })) : { id: 'e2e-' + Math.random().toString(36).slice(2), ...body }
      return route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(echoed) })
    }
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(wantsSingleObject(req.headers()) ? null : []) })
  })
}

test.describe('Core patient flows', () => {
  test('logging water updates the daily total', async ({ page }) => {
    const waterLogs = []
    await mockBackend(page, {
      water_logs: async (route, req) => {
        if (req.method() === 'GET') {
          await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(waterLogs) })
          return true
        }
        if (req.method() === 'POST') {
          const body = req.postDataJSON()
          const row = { id: 'e2e-water-' + waterLogs.length, amount_ml: body.amount_ml, created_at: new Date().toISOString() }
          waterLogs.push(row)
          await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(row) })
          return true
        }
        return false
      },
    })

    await page.goto('/acqua')
    await expect(page.getByText('0', { exact: true }).first()).toBeVisible({ timeout: 10_000 })

    // First quick-add preset (250 ml glass)
    await page.locator('.water-preset-btn').first().click()
    await expect(page.getByText(/^250\s*$/).first()).toBeVisible({ timeout: 10_000 })
  })

  test('logging a food from search adds it to the diary', async ({ page }) => {
    const foodLogs = []
    await mockBackend(page, {
      food_logs: async (route, req) => {
        if (req.method() === 'GET') {
          await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(foodLogs) })
          return true
        }
        if (req.method() === 'POST') {
          const body = req.postDataJSON()
          const row = { id: 'e2e-food-' + foodLogs.length, ...body }
          foodLogs.push(row)
          await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(row) })
          return true
        }
        return false
      },
      patient_diets: async (route, req) => {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(wantsSingleObject(req.headers()) ? null : []) })
        return true
      },
      daily_wellness: async (route, req) => {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(null) })
        return true
      },
      daily_logs: async (route, req) => {
        await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({}) })
        return true
      },
    })

    await page.goto('/macro')
    // "Colazione" is the default active meal (activeMealAdd initial state), so
    // its inline search box is open without needing to click "Aggiungi a X".
    const searchInput = page.getByPlaceholder(/Cerca alimento/i)
    await searchInput.fill('mela')
    // Local dataset search (src/data/all-foods.js) — no network involved, should surface a result quickly.
    const firstResult = page.locator('.animate-listItem').filter({ hasText: /mela/i }).first()
    await expect(firstResult).toBeVisible({ timeout: 10_000 })
    await firstResult.click()

    const addButton = page.getByRole('button', { name: 'Aggiungi al diario' })
    await addButton.click()

    await expect.poll(() => foodLogs.length, { timeout: 10_000 }).toBeGreaterThan(0)
  })

  test('viewing the prescribed diet shows meals from the dietitian', async ({ page }) => {
    await mockBackend(page, {
      patient_diets: async (route, req) => {
        const single = wantsSingleObject(req.headers())
        const row = { id: FAKE_DIET_ID, name: 'Piano E2E', kcal_target: 2000, protein_target: 120, carbs_target: 220, fats_target: 70, duration_weeks: 4, notes: null, is_active: true, created_at: new Date().toISOString() }
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(single ? row : [row]) })
        return true
      },
      diet_meals: async (route, req) => {
        const meals = [
          { id: 'e2e-meal-1', diet_id: FAKE_DIET_ID, meal_type: 'colazione', meal_order: 1, day_number: null, kcal: 400, proteins: 20, carbs: 50, fats: 10, notes: null, description: 'Colazione E2E test', foods: [] },
        ]
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(meals) })
        return true
      },
      meal_completions: async (route, req) => {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
        return true
      },
      patient_dietitian: async (route, req) => {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(wantsSingleObject(req.headers()) ? null : []) })
        return true
      },
    })

    await page.goto('/dieta')
    await expect(page.getByText('Piano E2E')).toBeVisible({ timeout: 10_000 })
    const mealButton = page.getByRole('button', { name: /Colazione.*400 kcal/i })
    await expect(mealButton).toBeVisible({ timeout: 10_000 })
    // Description only renders once the meal card is expanded.
    await mealButton.click()
    await expect(page.getByText('Colazione E2E test')).toBeVisible({ timeout: 10_000 })
  })
})
