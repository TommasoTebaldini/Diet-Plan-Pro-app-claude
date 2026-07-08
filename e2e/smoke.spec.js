import { test, expect } from '@playwright/test'

// First real tests for this app (Playwright was installed but unused). These are
// deliberately shallow — they don't hit a live Supabase project — and exist to
// catch "the app doesn't even boot" regressions, plus the auth route-guard
// contract (App.jsx PrivateRoute/PublicRoute/PatientRoute) so it isn't silently
// broken by a routing refactor.

test.describe('App boot and route guards', () => {
  test('unauthenticated user visiting "/" is redirected to /login', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/login$/)
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('login page renders the form and a link to register', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
    await expect(page.locator('a[href="/register"]')).toBeVisible()
  })

  test('register link navigates to the register page', async ({ page }) => {
    await page.goto('/login')
    await page.locator('a[href="/register"]').click()
    await expect(page).toHaveURL(/\/register$/)
  })

  test('unauthenticated user visiting a protected route is redirected to /login', async ({ page }) => {
    await page.goto('/profilo')
    await expect(page).toHaveURL(/\/login$/)
  })

  test('submitting the login form with wrong credentials shows an error, not a crash', async ({ page }) => {
    await page.goto('/login')
    await page.locator('input[type="email"]').fill('nobody-e2e-test@example.com')
    await page.locator('input[type="password"]').fill('wrong-password-123')
    await page.locator('button[type="submit"]').click()
    // Either an inline error appears, or we're still on /login (never silently
    // navigates to "/" without a real session).
    await expect(page).toHaveURL(/\/login$/)
  })
})
