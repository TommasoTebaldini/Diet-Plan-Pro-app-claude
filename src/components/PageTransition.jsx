// Pure CSS — no framer-motion in the critical path
export default function PageTransition({ children }) {
  return (
    <div className="animate-fadeIn" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {children}
    </div>
  )
}
