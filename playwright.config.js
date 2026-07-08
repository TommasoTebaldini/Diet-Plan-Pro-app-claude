import { defineConfig, devices } from '@playwright/test'

// Basic smoke-test config: runs against a production build served by `vite preview`.
// No real Supabase project is needed for these tests — src/lib/supabase.js already
// falls back to placeholder values, and an unauthenticated session resolves locally
// (no stored session ⇒ no network round-trip needed) before route guards redirect.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
