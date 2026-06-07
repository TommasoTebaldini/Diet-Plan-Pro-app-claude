import { useEffect, useState } from 'react'

const AUTO_DISMISS_MS = 4000

export default function AchievementToast({ achievement, onDismiss }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!achievement) { setVisible(false); return }
    // small delay so CSS transition triggers after mount
    const show = setTimeout(() => setVisible(true), 10)
    const hide = setTimeout(() => { setVisible(false); setTimeout(onDismiss, 300) }, AUTO_DISMISS_MS)
    return () => { clearTimeout(show); clearTimeout(hide) }
  }, [achievement, onDismiss])

  if (!achievement) return null

  return (
    <div
      onClick={() => { setVisible(false); setTimeout(onDismiss, 300) }}
      style={{
        position: 'fixed',
        bottom: 'calc(var(--nav) + 16px)',
        right: '16px',
        zIndex: 9999,
        background: 'var(--surface)',
        border: '1.5px solid var(--border-light)',
        borderRadius: 'var(--r-lg)',
        boxShadow: 'var(--shadow-lg)',
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        maxWidth: '320px',
        cursor: 'pointer',
        userSelect: 'none',
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.92)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.28s cubic-bezier(.16,1,.3,1), opacity 0.22s ease',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, borderRadius: 'var(--r-lg) var(--r-lg) 0 0', background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }} />

      <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #fef3c7, #fde68a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0, boxShadow: '0 2px 8px rgba(245,158,11,.25)' }}>
        {achievement.icon}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#b45309', marginBottom: 2 }}>Badge sbloccato!</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>{achievement.name}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{achievement.description}</div>
      </div>

      {/* Progress bar via CSS animation */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, height: 3, background: 'linear-gradient(90deg, #1a7f5a, #3dba7a)', borderRadius: '0 0 0 var(--r-lg)', animation: visible ? `_toast-shrink ${AUTO_DISMISS_MS}ms linear forwards` : 'none', width: '100%' }} />
      <style>{`@keyframes _toast-shrink { from { width: 100% } to { width: 0% } }`}</style>
    </div>
  )
}
