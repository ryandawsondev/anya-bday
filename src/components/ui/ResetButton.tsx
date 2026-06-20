import { motion } from 'motion/react'
import { useConstellationStore } from '../../state/useConstellationStore'

export default function ResetButton() {
  const reset = () => {
    const s = useConstellationStore.getState()
    s.setConstellationRotX(0)
    s.setConstellationRotY(0)
    s.setCameraZ(12)
    s.setSelected(null)
  }

  return (
    <motion.button
      onClick={reset}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.45 }}
      whileHover={{ opacity: 1, scale: 1.05 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.12)',
        color: '#fff',
        borderRadius: '8px',
        padding: '8px 14px',
        fontSize: '12px',
        letterSpacing: '0.08em',
        backdropFilter: 'blur(4px)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        zIndex: 100,
      }}
    >
      ↺ Reset view
    </motion.button>
  )
}
