// Lightweight skeleton shown during lazy-chunk loading (replaces full LoadingScreen).
// Renders in <1ms, no heavy animations, matches the page bg so the flash is invisible.
export default function PageSkeleton() {
  return (
    <div style={{
      flex: 1,
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      padding: '20px 16px',
      animation: 'skeletonPulse 1.4s ease-in-out infinite',
    }}>
      {/* Header bar */}
      <div style={{ height: 52, borderRadius: 14, background: 'linear-gradient(160deg, var(--green-dark) 0%, var(--green-main) 100%)', opacity: 0.18 }} />
      {/* Content rows */}
      {[90, 60, 80, 50, 70].map((w, i) => (
        <div key={i} style={{
          height: 52, borderRadius: 12,
          background: 'var(--border-light)',
          width: `${w}%`,
          animationDelay: `${i * 0.07}s`,
        }} />
      ))}
      <style>{`
        @keyframes skeletonPulse {
          0%, 100% { opacity: 0.5 }
          50% { opacity: 1 }
        }
      `}</style>
    </div>
  )
}
