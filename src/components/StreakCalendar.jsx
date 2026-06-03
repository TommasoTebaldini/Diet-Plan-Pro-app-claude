/**
 * StreakCalendar — GitHub contribution-style 12-week food log heatmap
 * Feature 4: Streak visuale a calendario (contribution style)
 */
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

function getColor(count) {
  if (!count || count === 0) return '#EBEDF0'
  if (count <= 3) return '#9BE9A8'
  if (count <= 7) return '#40C463'
  return '#216E39'
}

export default function StreakCalendar() {
  const { user } = useAuth()
  const [dayCounts, setDayCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [tooltip, setTooltip] = useState(null)

  useEffect(() => {
    if (!user) return
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - 83)
    const from = cutoff.toISOString().split('T')[0]

    supabase
      .from('food_logs')
      .select('date')
      .eq('user_id', user.id)
      .gte('date', from)
      .neq('food_name', '__note__')
      .then(({ data }) => {
        const counts = {}
        if (data) {
          for (const row of data) {
            counts[row.date] = (counts[row.date] || 0) + 1
          }
        }
        setDayCounts(counts)
        setLoading(false)
      })
  }, [user])

  // Build 84-day grid starting from 83 days ago up to today
  const today = new Date()
  today.setHours(12, 0, 0, 0)
  const days = []
  for (let i = 83; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().split('T')[0])
  }

  // Pad so the first day starts on Monday
  const firstDate = new Date(days[0] + 'T12:00:00')
  const startDow = (firstDate.getDay() + 6) % 7 // 0=Mon..6=Sun
  const paddedDays = Array(startDow).fill(null).concat(days)

  // Split into weeks (columns of 7)
  const weeks = []
  for (let i = 0; i < paddedDays.length; i += 7) {
    weeks.push(paddedDays.slice(i, i + 7))
  }

  const DAYS_IT = ['L', 'M', 'M', 'G', 'V', 'S', 'D']

  if (loading) {
    return (
      <div style={{ padding: '14px 0', color: 'var(--text-muted)', fontSize: 13, textAlign: 'center' }}>
        Caricamento streak…
      </div>
    )
  }

  const streakCount = (() => {
    let count = 0
    for (let i = 83; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const ds = d.toISOString().split('T')[0]
      if (!dayCounts[ds] && count === 0 && i > 0) continue
      if (dayCounts[ds]) count++
      else if (count > 0) break
    }
    return count
  })()

  return (
    <div style={{ overflowX: 'auto', textAlign: 'center' }}>
      {/* Streak info */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 20 }}>🔥</span>
        <div style={{ textAlign: 'left' }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: streakCount >= 7 ? '#216E39' : 'var(--text-primary)' }}>
            {streakCount} {streakCount === 1 ? 'giorno' : 'giorni'} consecutivi
          </p>
          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Ultime 12 settimane di log alimentari</p>
        </div>
      </div>

      <div style={{ display: 'inline-flex', gap: 2, position: 'relative' }}>
        {/* Day labels on the left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginRight: 4, paddingTop: 18 }}>
          {DAYS_IT.map((d, i) => (
            <div key={i} style={{ width: 10, height: 12, fontSize: 9, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {i % 2 === 0 ? d : ''}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
          {weeks.map((week, wi) => {
            // Get month label for first day of week
            const firstReal = week.find(d => d !== null)
            let monthLabel = ''
            if (firstReal) {
              const d = new Date(firstReal + 'T12:00:00')
              if (d.getDate() <= 7) {
                monthLabel = d.toLocaleDateString('it-IT', { month: 'short' })
              }
            }
            return (
              <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{ height: 16, fontSize: 9, color: 'var(--text-muted)', textAlign: 'center', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {monthLabel}
                </div>
                {week.map((day, di) => {
                  if (!day) {
                    return <div key={di} style={{ width: 12, height: 12 }} />
                  }
                  const count = dayCounts[day] || 0
                  const isToday = day === today.toISOString().split('T')[0]
                  const d = new Date(day + 'T12:00:00')
                  const label = d.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' })
                  return (
                    <div
                      key={di}
                      style={{
                        width: 12, height: 12,
                        borderRadius: 3,
                        background: getColor(count),
                        cursor: 'pointer',
                        outline: isToday ? '2px solid #216E39' : 'none',
                        outlineOffset: 1,
                        flexShrink: 0,
                        position: 'relative',
                      }}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect()
                        setTooltip({ day, count, x: rect.left, y: rect.top, label })
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8, justifyContent: 'center' }}>
        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Meno</span>
        {['#EBEDF0', '#9BE9A8', '#40C463', '#216E39'].map(c => (
          <div key={c} style={{ width: 12, height: 12, borderRadius: 3, background: c }} />
        ))}
        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Di più</span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div style={{
          position: 'fixed',
          top: tooltip.y - 40,
          left: tooltip.x,
          background: 'rgba(0,0,0,0.82)',
          color: 'white',
          fontSize: 11,
          borderRadius: 7,
          padding: '5px 10px',
          zIndex: 99999,
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          transform: 'translateX(-50%)',
        }}>
          {tooltip.label}: {tooltip.count} {tooltip.count === 1 ? 'alimento' : 'alimenti'}
        </div>
      )}
    </div>
  )
}
