import { motion } from 'motion/react'
import { useConstellationStore } from '../../state/useConstellationStore'

export default function BackButton() {
  const startWarp = useConstellationStore(s => s.startWarp)
  const warpPhase = useConstellationStore(s => s.warpPhase)

  if (warpPhase !== 'idle') return null

  return (
    <motion.button
      onClick={() => startWarp(null)}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 0.55, x: 0 }}
      whileHover={{ opacity: 1, scale: 1.05 }}
      transition={{ duration: 0.3, delay: 0.6 }}
      style={{
        position: 'fixed',
        top: '24px',
        left: '24px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.12)',
        color: '#fff',
        borderRadius: '8px',
        padding: '8px 14px',
        fontSize: '12px',
        letterSpacing: '0.1em',
        backdropFilter: 'blur(4px)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        zIndex: 100,
      }}
    >
      ← Galaxy Map
    </motion.button>
  )
}
