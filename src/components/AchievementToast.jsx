import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const AUTO_DISMISS_MS = 4000

export default function AchievementToast({ achievement, onDismiss }) {
  useEffect(() => {
    if (!achievement) return
    const timer = setTimeout(onDismiss, AUTO_DISMISS_MS)
    return () => clearTimeout(timer)
  }, [achievement, onDismiss])

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          key={achievement.key}
          initial={{ opacity: 0, y: 40, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 420, damping: 28 }}
          onClick={onDismiss}
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
          }}
        >
          {/* Gold accent bar */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: '3px',
            borderRadius: 'var(--r-lg) var(--r-lg) 0 0',
            background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
          }} />

          {/* Icon */}
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(245,158,11,0.25)',
          }}>
            {achievement.icon}
          </div>

          {/* Text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#b45309',
              marginBottom: '2px',
            }}>
              Badge sbloccato!
            </div>
            <div style={{
              fontSize: '15px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: 1.2,
            }}>
              {achievement.name}
            </div>
            <div style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              marginTop: '2px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {achievement.description}
            </div>
          </div>

          {/* Progress bar */}
          <motion.div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #1a7f5a, #3dba7a)',
              borderRadius: '0 0 0 var(--r-lg)',
            }}
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: AUTO_DISMISS_MS / 1000, ease: 'linear' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
