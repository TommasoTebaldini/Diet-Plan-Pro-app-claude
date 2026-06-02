import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

const SS = 'C:/Users/Manutenzione/Desktop/Nut/screenshots';
try { mkdirSync(SS, { recursive: true }); } catch {}

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();

const jsErrors = [];
const netErrors = [];
page.on('pageerror', e => jsErrors.push(e.message));
page.on('requestfailed', r => netErrors.push(r.url().split('?')[0]));

// ─── 1. Login page ────────────────────────────────────────────────
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 20000 });
await page.screenshot({ path: SS + '/01_login.png', fullPage: true });
const title = await page.title();
const hasEmail = await page.locator('input[type=email]').count();
const hasPwd   = await page.locator('input[type=password]').count();
const bodyText = (await page.locator('body').innerText().catch(() => '')).trim().slice(0,150);
console.log('── 01 login ──');
console.log('  title:', title);
console.log('  email input:', hasEmail, '| password input:', hasPwd);
console.log('  visible text:', bodyText.replace(/\n/g,' '));

// ─── 2. Check critical JS modules load (no 404 on main chunks) ───
const resources = await page.evaluate(() =>
  performance.getEntriesByType('resource')
    .filter(r => r.initiatorType === 'script')
    .map(r => ({ url: r.name.split('localhost:5173')[1]?.split('?')[0] || r.name, status: 'ok' }))
);
console.log('\n── 02 scripts loaded ──');
resources.slice(0,8).forEach(r => console.log(' ', r.url));

// ─── 3. Console errors so far ─────────────────────────────────────
await page.waitForTimeout(1500);
console.log('\n── 03 errors ──');
console.log('  JS errors:', jsErrors.length ? jsErrors.join('; ') : 'none');
console.log('  Failed requests:', netErrors.length ? netErrors.slice(0,5).join(', ') : 'none');

// ─── 4. Check route transitions (no auth — just check app doesn't crash) ─
const routes = ['/', '/macro', '/dieta', '/documenti', '/benessere', '/profilo'];
for (const route of routes) {
  await page.goto('http://localhost:5173' + route, { waitUntil: 'domcontentloaded', timeout: 8000 });
  await page.waitForTimeout(500);
  const err = jsErrors.length;
  const text = (await page.locator('body').innerText().catch(() => '')).trim().slice(0,60);
  console.log(`  ${route.padEnd(14)} → "${text.replace(/\n/g,' ')}" | js_errors: ${err}`);
}

await page.screenshot({ path: SS + '/02_last_route.png', fullPage: true });

await browser.close();
console.log('\nScreenshots in:', SS);
