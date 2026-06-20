import { useState, useEffect, useRef } from 'react'
import { motion, useSpring } from 'motion/react'
import { useConstellationStore } from '../../state/useConstellationStore'

const hasFinePointer =
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches

interface Spark { id: number; x: number; y: number; dx: number }

let _sparkId = 0

export default function CustomCursor() {
  const hoveredId = useConstellationStore((s) => s.hoveredId)
  const selectedId = useConstellationStore((s) => s.selectedId)
  const [sparks, setSparks] = useState<Spark[]>([])
  const lastSpawnRef = useRef(0)

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

      const now = Date.now()
      if (now - lastSpawnRef.current > 35) {
        lastSpawnRef.current = now
        const id = ++_sparkId
        const spark: Spark = {
          id,
          x: e.clientX,
          y: e.clientY,
          dx: (Math.random() - 0.5) * 16,
        }
        setSparks(prev => [...prev.slice(-16), spark])
        setTimeout(() => setSparks(prev => prev.filter(s => s.id !== id)), 900)
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [dotX, dotY, ringX, ringY])

  if (!hasFinePointer) return null

  const isActive = !!hoveredId || !!selectedId

  return (
    <>
      {/* Sparkle trail */}
      {sparks.map(spark => (
        <motion.div
          key={spark.id}
          initial={{ opacity: 0.9, scale: 1, x: spark.x + spark.dx, y: spark.y }}
          animate={{ opacity: 0, scale: 0.1, x: spark.x + spark.dx * 2.5, y: spark.y - 18 - Math.random() * 14 }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: 'rgba(180, 215, 255, 1)',
            boxShadow: '0 0 6px 2px rgba(150, 200, 255, 0.7)',
            pointerEvents: 'none',
            zIndex: 9997,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

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
