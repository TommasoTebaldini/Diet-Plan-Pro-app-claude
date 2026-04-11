:root {
  --green-dark: #0d5c3a;
  --green-main: #1a7f5a;
  --green-mid: #2da06e;
  --green-light: #4fc38a;
  --green-pale: #e8f7f0;
  --green-mist: #f2fbf6;
  --text-primary: #0f1f18;
  --text-secondary: #3d5a4a;
  --text-muted: #7a9a88;
  --surface: #ffffff;
  --surface-2: #f8faf9;
  --border: #d4e8dc;
  --border-light: #e8f2ec;
  --red: #e05a5a;
  --orange: #f0922b;
  --blue: #3b82f6;
  --shadow-sm: 0 1px 3px rgba(13,92,58,0.08);
  --shadow-md: 0 4px 16px rgba(13,92,58,0.10);
  --shadow-lg: 0 12px 40px rgba(13,92,58,0.14);
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-xl: 28px;
  --font-display: 'Fraunces', Georgia, serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
  --bottom-nav: 64px;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; -webkit-text-size-adjust: 100%; }
body {
  font-family: var(--font-body);
  background: var(--surface-2);
  color: var(--text-primary);
  min-height: 100dvh;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}
#root { min-height: 100dvh; display: flex; flex-direction: column; }

/* Scrollbar */
::-webkit-scrollbar { width: 3px; height: 3px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

/* Buttons */
.btn {
  display: inline-flex; align-items: center; justify-content: center;
  gap: 7px; font-family: var(--font-body); font-weight: 500;
  cursor: pointer; border: none; transition: all 0.18s ease;
  white-space: nowrap; user-select: none; -webkit-tap-highlight-color: transparent;
}
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-primary {
  background: var(--green-main); color: white;
  padding: 13px 22px; border-radius: var(--radius-md); font-size: 15px;
  box-shadow: 0 2px 8px rgba(26,127,90,0.28);
}
.btn-primary:hover:not(:disabled) { background: var(--green-dark); transform: translateY(-1px); }
.btn-primary:active:not(:disabled) { transform: translateY(0); }
.btn-secondary { background: var(--green-pale); color: var(--green-main); padding: 11px 18px; border-radius: var(--radius-md); font-size: 14px; }
.btn-secondary:hover:not(:disabled) { background: var(--border); }
.btn-ghost { background: transparent; color: var(--text-secondary); padding: 9px 14px; border-radius: var(--radius-sm); font-size: 14px; }
.btn-ghost:hover { background: var(--surface-2); }
.btn-full { width: 100%; }

/* Cards */
.card {
  background: var(--surface); border-radius: var(--radius-lg);
  padding: 16px; box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-light);
}

/* Inputs */
.input-group { display: flex; flex-direction: column; gap: 5px; }
.input-label { font-size: 12px; font-weight: 500; color: var(--text-secondary); }
.input-field {
  width: 100%; padding: 12px 14px;
  border: 1.5px solid var(--border); border-radius: var(--radius-md);
  font-family: var(--font-body); font-size: 15px; color: var(--text-primary);
  background: var(--surface); outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  -webkit-appearance: none;
}
.input-field:focus { border-color: var(--green-main); box-shadow: 0 0 0 3px rgba(26,127,90,0.1); }
.input-field::placeholder { color: var(--text-muted); }

/* Animations */
@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
@keyframes spin { to { transform: rotate(360deg); } }
.animate-fadeIn { animation: fadeIn 0.3s ease forwards; }
.animate-slideUp { animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

/* Utilities */
.text-display { font-family: var(--font-display); }
.text-muted { color: var(--text-muted); font-size: 13px; }
.divider { height: 1px; background: var(--border-light); margin: 14px 0; }
.badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 100px; font-size: 11px; font-weight: 500; }
.badge-green { background: var(--green-pale); color: var(--green-dark); }
.badge-orange { background: #fff4e6; color: #c45e00; }
.badge-red { background: #fff0f0; color: #c42b2b; }
.badge-blue { background: #eff6ff; color: #1d4ed8; }

/* Page wrapper — accounts for bottom nav on ALL screen sizes */
.page {
  flex: 1; display: flex; flex-direction: column;
  padding-bottom: calc(var(--bottom-nav) + env(safe-area-inset-bottom) + 12px);
  width: 100%; max-width: 600px; margin: 0 auto;
}

/* Bottom nav — always visible */
.bottom-nav-spacer { height: calc(var(--bottom-nav) + env(safe-area-inset-bottom)); }

@media (min-width: 768px) {
  .page { max-width: 680px; }
}
@media (min-width: 1024px) {
  .page { max-width: 800px; }
}
