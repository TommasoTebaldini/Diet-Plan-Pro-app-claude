export default function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(160deg, var(--green-dark) 0%, var(--green-main) 100%)',
      gap: 20,
    }}>
      <div style={{
        width: 72, height: 72,
        borderRadius: 24,
        background: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '1px solid rgba(255,255,255,0.2)',
        animation: '_ls-pulse 2s ease-in-out infinite',
      }}>
        <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
          <path d="M16 4C10 4, 5 10, 7 16 C9 21, 14 24, 16 28 C18 24, 23 21, 25 16 C27 10, 22 4, 16 4Z" fill="white" opacity="0.9"/>
        </svg>
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            style={{
              width: 8, height: 8,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.7)',
              animation: `_ls-bounce 0.9s ease-in-out ${i * 0.18}s infinite`,
            }}
          />
        ))}
      </div>

      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 300 }}>NutriPlan</p>

      <style>{`
        @keyframes _ls-pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
        @keyframes _ls-bounce { 0%,100%{transform:translateY(0);opacity:.4} 50%{transform:translateY(-8px);opacity:1} }
      `}</style>
    </div>
  )
}
