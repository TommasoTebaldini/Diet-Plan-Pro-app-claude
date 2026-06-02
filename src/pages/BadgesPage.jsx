import { motion } from 'framer-motion'
import { Lock, Award } from 'lucide-react'
import { useAchievements, ALL_ACHIEVEMENTS } from '../context/AchievementsContext'
import PageTransition from '../components/PageTransition'

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const CATEGORIES = ['Tutti', 'Diario', 'Acqua', 'Peso', 'Benessere', 'Ricette', 'Attività', 'Social', 'Engagement', 'Speciali']

export default function BadgesPage() {
  const { earned } = useAchievements()
  const earnedCount = Object.keys(earned).length
  const totalCount = ALL_ACHIEVEMENTS.length

  return (
    <PageTransition>
      <div style={{ padding: '0 0 calc(var(--nav) + 24px)', minHeight: '100vh', background: 'var(--surface-2)' }}>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0a4a2e 0%, #1a7f5a 100%)',
          padding: '48px 20px 28px',
          textAlign: 'center',
          color: '#fff',
        }}>
          <div style={{
            width: 64, height: 64,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px',
            fontSize: '32px',
          }}>
            🏆
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 6px', fontFamily: 'var(--font-d)' }}>
            I tuoi Badge
          </h1>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255,255,255,0.18)',
            borderRadius: '20px',
            padding: '4px 14px',
            fontSize: '14px',
            fontWeight: 600,
          }}>
            <Award size={14} />
            {earnedCount} badge su {totalCount}
          </div>

          {/* Progress bar */}
          <div style={{
            marginTop: '16px',
            height: '6px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '3px',
            maxWidth: '280px',
            margin: '16px auto 0',
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(earnedCount / totalCount) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{
                height: '100%',
                background: '#fbbf24',
                borderRadius: '3px',
              }}
            />
          </div>
        </div>

        {/* Grid */}
        <div style={{ padding: '20px 16px' }}>
          {CATEGORIES.slice(1).map(category => {
            const items = ALL_ACHIEVEMENTS.filter(a => a.category === category)
            if (!items.length) return null
            return (
              <div key={category} style={{ marginBottom: '28px' }}>
                <h2 style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                  color: 'var(--text-muted)',
                  marginBottom: '12px',
                  paddingLeft: '4px',
                }}>
                  {category}
                </h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '10px',
                }}>
                  {items.map((ach, idx) => {
                    const isEarned = !!earned[ach.key]
                    const earnedAt = earned[ach.key]
                    return (
                      <motion.div
                        key={ach.key}
                        initial={{ opacity: 0, scale: 0.88 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.04, duration: 0.22 }}
                        style={{
                          background: isEarned ? 'var(--surface)' : 'var(--surface-3)',
                          border: isEarned
                            ? '1.5px solid #fde68a'
                            : '1.5px solid var(--border-light)',
                          borderRadius: 'var(--r-md)',
                          padding: '14px 10px',
                          textAlign: 'center',
                          boxShadow: isEarned ? '0 2px 12px rgba(245,158,11,0.12)' : 'none',
                          position: 'relative',
                          opacity: isEarned ? 1 : 0.65,
                        }}
                      >
                        {/* Icon */}
                        <div style={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          background: isEarned
                            ? 'linear-gradient(135deg, #fef3c7, #fde68a)'
                            : 'var(--border-light)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 8px',
                          fontSize: isEarned ? '24px' : '20px',
                          filter: isEarned ? 'none' : 'grayscale(1)',
                        }}>
                          {isEarned ? ach.icon : <Lock size={18} color="var(--text-muted)" />}
                        </div>

                        {/* Name */}
                        <div style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: isEarned ? 'var(--text-primary)' : 'var(--text-muted)',
                          lineHeight: 1.3,
                          marginBottom: '4px',
                        }}>
                          {ach.name}
                        </div>

                        {/* Description */}
                        <div style={{
                          fontSize: '10px',
                          color: 'var(--text-muted)',
                          lineHeight: 1.35,
                        }}>
                          {ach.description}
                        </div>

                        {/* Earned date */}
                        {isEarned && earnedAt && (
                          <div style={{
                            marginTop: '6px',
                            fontSize: '10px',
                            color: '#92400e',
                            fontWeight: 600,
                          }}>
                            {formatDate(earnedAt)}
                          </div>
                        )}

                        {/* Gold star for earned */}
                        {isEarned && (
                          <div style={{
                            position: 'absolute',
                            top: '6px',
                            right: '6px',
                            fontSize: '12px',
                          }}>
                            ⭐
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </PageTransition>
  )
}
