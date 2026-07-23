import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useFirstVisit } from '../hooks/useFirstVisit'

function getRect(selector) {
  try {
    const el = document.querySelector(selector)
    if (!el) return null
    return el.getBoundingClientRect()
  } catch {
    return null
  }
}

export default function TutorialTooltip({ steps, onDone, pageKey }) {
  const { isFirstVisit, markDone } = useFirstVisit(pageKey)
  const [currentStep, setCurrentStep] = useState(0)
  const [targetRect, setTargetRect] = useState(null)
  const [visible, setVisible] = useState(true)

  const updateRect = useCallback(() => {
    if (!steps[currentStep]) return
    const rect = getRect(steps[currentStep].target)
    setTargetRect(rect)
  }, [steps, currentStep])

  useEffect(() => {
    if (!isFirstVisit || !visible) return
    // Small delay to let the page render
    const t = setTimeout(updateRect, 120)
    window.addEventListener('resize', updateRect)
    window.addEventListener('scroll', updateRect, true)
    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', updateRect)
      window.removeEventListener('scroll', updateRect, true)
    }
  }, [isFirstVisit, visible, updateRect])

  if (!isFirstVisit || !visible) return null

  const step = steps[currentStep]
  const isLast = currentStep === steps.length - 1

  function handleNext() {
    if (isLast) {
      markDone()
      setVisible(false)
      if (onDone) onDone()
    } else {
      setCurrentStep(s => s + 1)
    }
  }

  function handleSkip() {
    markDone()
    setVisible(false)
    if (onDone) onDone()
  }

  // Compute tooltip position relative to target
  function getTooltipStyle() {
    if (!targetRect) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }

    const tooltipW = 280
    const margin = 12
    const vpW = window.innerWidth
    const vpH = window.innerHeight

    let top, left
    // Try below first
    if (targetRect.bottom + 120 < vpH) {
      top = targetRect.bottom + margin
    } else {
      top = Math.max(8, targetRect.top - 150 - margin)
    }

    // Center horizontally on target, clamp to viewport
    left = targetRect.left + targetRect.width / 2 - tooltipW / 2
    left = Math.max(12, Math.min(left, vpW - tooltipW - 12))

    return { top, left }
  }

  const tooltipStyle = getTooltipStyle()

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9100, pointerEvents: 'none' }}>
      {/* Dark overlay with hole cut around target */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'all' }}
        onClick={handleSkip}
      >
        <defs>
          <mask id="tutorial-mask">
            <rect width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect
                x={targetRect.left - 6}
                y={targetRect.top - 6}
                width={targetRect.width + 12}
                height={targetRect.height + 12}
                rx={10}
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.65)"
          mask="url(#tutorial-mask)"
        />
      </svg>

      {/* Highlight ring around target */}
      {targetRect && (
        <div
          style={{
            position: 'absolute',
            top: targetRect.top - 6,
            left: targetRect.left - 6,
            width: targetRect.width + 12,
            height: targetRect.height + 12,
            borderRadius: 10,
            border: '2.5px solid var(--green-main)',
            boxShadow: '0 0 0 3px rgba(21,122,74,0.25)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Tooltip card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.92, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: -8 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute',
            ...tooltipStyle,
            width: 280,
            background: 'var(--surface)',
            borderRadius: 16,
            padding: '16px 18px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
            border: '1px solid var(--border-light)',
            pointerEvents: 'all',
          }}
        >
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, flex: 1, paddingRight: 8 }}>
              {step.title}
            </p>
            <button
              onClick={handleSkip}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2, flexShrink: 0 }}
              aria-label="Chiudi tutorial"
            >
              <X size={15} />
            </button>
          </div>

          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 14 }}>
            {step.text}
          </p>

          {/* Footer: dots + button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Step dots */}
            <div style={{ display: 'flex', gap: 5 }}>
              {steps.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === currentStep ? 16 : 6,
                    height: 6,
                    borderRadius: 3,
                    background: i <= currentStep ? 'var(--green-main)' : 'var(--border-light)',
                    transition: 'width 0.25s ease, background 0.25s ease',
                  }}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              style={{
                background: 'var(--green-main)',
                color: 'white',
                border: 'none',
                borderRadius: 9,
                padding: '7px 16px',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {isLast ? 'Capito!' : 'Capito'}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
