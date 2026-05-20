import { motion } from 'framer-motion'
import { Leaf } from 'lucide-react'

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(160deg, var(--green-dark) 0%, var(--green-main) 100%)',
        gap: 20,
      }}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        style={{
          width: 72, height: 72,
          borderRadius: 24,
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid rgba(255,255,255,0.2)',
        }}
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, ease: 'linear', repeat: Infinity }}
        >
          <Leaf size={36} color="white" />
        </motion.div>
      </motion.div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.9, delay: i * 0.18, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: 8, height: 8,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.7)',
            }}
          />
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, fontFamily: 'var(--font-display)', fontWeight: 300 }}
      >
        NutriPlan
      </motion.p>
    </motion.div>
  )
}
