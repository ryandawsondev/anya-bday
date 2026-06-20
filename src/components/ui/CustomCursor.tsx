import { useEffect } from 'react'
import { motion, useSpring } from 'motion/react'
import { useConstellationStore } from '../../state/useConstellationStore'

// Only show on devices with a fine pointer (mouse). Touch = skip.
const hasFinePointer =
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches

export default function CustomCursor() {
  const hoveredId = useConstellationStore((s) => s.hoveredId)
  const selectedId = useConstellationStore((s) => s.selectedId)

  const dotX = useSpring(-200, { stiffness: 1200, damping: 60 })
  const dotY = useSpring(-200, { stiffness: 1200, damping: 60 })
  const ringX = useSpring(-200, { stiffness: 220, damping: 20 })
  const ringY = useSpring(-200, { stiffness: 220, damping: 20 })

  useEffect(() => {
    if (!hasFinePointer) return
    const onMove = (e: MouseEvent) => {
      dotX.set(e.clientX)
      dotY.set(e.clientY)
      ringX.set(e.clientX)
      ringY.set(e.clientY)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [dotX, dotY, ringX, ringY])

  if (!hasFinePointer) return null

  const isActive = !!hoveredId || !!selectedId

  return (
    <>
      {/* Trailing ring */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: ringX,
          y: ringY,
          pointerEvents: 'none',
          zIndex: 9998,
        }}
      >
        <motion.div
          animate={{
            width: isActive ? 30 : 18,
            height: isActive ? 30 : 18,
            borderColor: isActive
              ? 'rgba(255, 210, 100, 0.75)'
              : 'rgba(255, 255, 255, 0.38)',
            boxShadow: isActive
              ? '0 0 8px rgba(255, 200, 80, 0.3)'
              : '0 0 0px transparent',
          }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          style={{
            width: 18,
            height: 18,
            border: '1px solid rgba(255,255,255,0.38)',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </motion.div>

      {/* Dot — follows instantly */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: dotX,
          y: dotY,
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      >
        <motion.div
          animate={{
            background: isActive
              ? 'rgba(255, 220, 120, 0.95)'
              : 'rgba(255, 255, 255, 0.85)',
            width: isActive ? 5 : 3,
            height: isActive ? 5 : 3,
          }}
          transition={{ duration: 0.15 }}
          style={{
            width: 3,
            height: 3,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.85)',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </motion.div>
    </>
  )
}
