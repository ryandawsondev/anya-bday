import { useEffect, useRef } from 'react'
import { motion, useSpring } from 'motion/react'
import { useConstellationStore } from '../../state/useConstellationStore'

const hasFinePointer =
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches

interface Particle { x: number; y: number; dx: number; dy: number; age: number }

export default function CustomCursor() {
  const hoveredId  = useConstellationStore((s) => s.hoveredId)
  const selectedId = useConstellationStore((s) => s.selectedId)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const particles  = useRef<Particle[]>([])
  const lastSpawn  = useRef(0)

  const dotX  = useSpring(-200, { stiffness: 1200, damping: 60 })
  const dotY  = useSpring(-200, { stiffness: 1200, damping: 60 })
  const ringX = useSpring(-200, { stiffness: 220,  damping: 20 })
  const ringY = useSpring(-200, { stiffness: 220,  damping: 20 })

  useEffect(() => {
    if (!hasFinePointer) return
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    const ctx = canvas.getContext('2d')!
    let rafId: number
    let last = performance.now()

    const draw = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const ps = particles.current
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i]
        p.age += dt
        const life = p.age / 0.85
        if (life >= 1) { ps.splice(i, 1); continue }
        const opacity = (1 - life) * 0.9
        const scale   = 1 - life * 0.9
        ctx.beginPath()
        ctx.arc(p.x + p.dx * life, p.y + p.dy * life, Math.max(2.5 * scale, 0.1), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(180,215,255,${opacity.toFixed(2)})`
        ctx.fill()
      }

      rafId = requestAnimationFrame(draw)
    }
    rafId = requestAnimationFrame(draw)

    const onMove = (e: MouseEvent) => {
      dotX.set(e.clientX)
      dotY.set(e.clientY)
      ringX.set(e.clientX)
      ringY.set(e.clientY)

      const now = Date.now()
      if (now - lastSpawn.current > 35) {
        lastSpawn.current = now
        const ps = particles.current
        if (ps.length >= 16) ps.shift()
        ps.push({
          x: e.clientX,
          y: e.clientY,
          dx: (Math.random() - 0.5) * 16,
          dy: -(18 + Math.random() * 14),
          age: 0,
        })
      }
    }

    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafId)
    }
  }, [dotX, dotY, ringX, ringY])

  if (!hasFinePointer) return null

  const isActive = !!hoveredId || !!selectedId

  return (
    <>
      {/* Sparkle trail — canvas rAF loop, zero React re-renders */}
      <canvas
        ref={canvasRef}
        style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9997 }}
      />

      {/* Trailing ring */}
      <motion.div
        style={{ position: 'fixed', top: 0, left: 0, x: ringX, y: ringY, pointerEvents: 'none', zIndex: 9998 }}
      >
        <motion.div
          animate={{
            width:       isActive ? 30 : 18,
            height:      isActive ? 30 : 18,
            borderColor: isActive ? 'rgba(255, 210, 100, 0.75)' : 'rgba(255, 255, 255, 0.38)',
            boxShadow:   isActive ? '0 0 8px rgba(255, 200, 80, 0.3)' : '0 0 0px transparent',
          }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          style={{
            width: 18, height: 18,
            border: '1px solid rgba(255,255,255,0.38)',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </motion.div>

      {/* Dot — follows instantly */}
      <motion.div
        style={{ position: 'fixed', top: 0, left: 0, x: dotX, y: dotY, pointerEvents: 'none', zIndex: 9999 }}
      >
        <motion.div
          animate={{
            background: isActive ? 'rgba(255, 220, 120, 0.95)' : 'rgba(255, 255, 255, 0.85)',
            width:  isActive ? 5 : 3,
            height: isActive ? 5 : 3,
          }}
          transition={{ duration: 0.15 }}
          style={{
            width: 3, height: 3,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.85)',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </motion.div>
    </>
  )
}
