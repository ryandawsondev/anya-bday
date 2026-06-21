import { motion, AnimatePresence } from 'motion/react'
import { galaxies } from '../../data/galaxies'
import { useConstellationStore } from '../../state/useConstellationStore'

export default function YouAreHereLabel() {
  const viewMode = useConstellationStore(s => s.viewMode)
  const currentGalaxyId = useConstellationStore(s => s.currentGalaxyId)
  const warpPhase = useConstellationStore(s => s.warpPhase)
  const selectedId = useConstellationStore(s => s.selectedId)
  const galaxy = galaxies.find(g => g.id === currentGalaxyId)

  const visible = viewMode === 'galaxy' && warpPhase === 'idle' && !!galaxy && !selectedId

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'center',
      pointerEvents: 'none',
      zIndex: 10,
    }}>
      <AnimatePresence>
        {visible && galaxy && (
          <motion.div
            key={currentGalaxyId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{
              fontSize: '0.6rem',
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '0.3rem',
              fontFamily: 'Georgia, serif',
            }}>
              ◆ you are in
            </div>
            <div style={{
              fontSize: '0.85rem',
              color: galaxy.themeColor,
              letterSpacing: '0.12em',
              fontFamily: 'Georgia, serif',
              textShadow: `0 0 16px ${galaxy.themeColor}70`,
            }}>
              {galaxy.name}
            </div>
            <div style={{
              fontSize: '0.65rem',
              color: 'rgba(255,255,255,0.28)',
              letterSpacing: '0.08em',
              marginTop: '0.2rem',
              fontFamily: 'Georgia, serif',
            }}>
              {galaxy.description}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
