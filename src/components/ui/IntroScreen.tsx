import { useMemo } from 'react'
import { motion } from 'motion/react'

interface Props {
  onEnter: () => void
}

interface Dot {
  x: number
  y: number
  size: number
  opacity: number
}

export default function IntroScreen({ onEnter }: Props) {
  const dots = useMemo<Dot[]>(
    () =>
      Array.from({ length: 70 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 0.8 + Math.random() * 1.2,
        opacity: 0.15 + Math.random() * 0.45,
      })),
    [],
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse 80% 60% at 50% 40%, #070d20 0%, #000208 100%)',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      {/* Static star field */}
      <div
        style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}
        aria-hidden
      >
        {dots.map((dot, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: dot.size,
              height: dot.size,
              borderRadius: '50%',
              background: 'white',
              left: `${dot.x}%`,
              top: `${dot.y}%`,
              opacity: dot.opacity,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: 'relative' }}
      >
        <p
          style={{
            fontSize: '0.65rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#4a6a9a',
            marginBottom: '1.5rem',
          }}
        >
          happy birthday
        </p>

        <h1
          style={{
            fontSize: 'clamp(3rem, 12vw, 6rem)',
            fontWeight: 300,
            letterSpacing: '0.06em',
            color: '#ddeeff',
            lineHeight: 1,
            marginBottom: '1rem',
          }}
        >
          Anya
        </h1>

        <p
          style={{
            fontSize: 'clamp(0.85rem, 2.5vw, 1.05rem)',
            color: '#3a5070',
            marginBottom: '3rem',
            fontWeight: 300,
            lineHeight: 1.6,
            maxWidth: '26ch',
            margin: '0 auto 3rem',
          }}
        >
          some memories, scattered across the stars
        </p>

        <motion.button
          onClick={onEnter}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          style={{
            background: 'transparent',
            border: '1px solid rgba(120, 170, 255, 0.25)',
            color: '#7aaaf0',
            padding: '0.7rem 2.5rem',
            borderRadius: '2rem',
            fontSize: '0.75rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          enter
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
