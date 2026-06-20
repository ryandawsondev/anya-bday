import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { OPENING_MESSAGES } from '../../data/messages'

interface Props {
  onComplete: () => void
}

export default function CinematicText({ onComplete }: Props) {
  const [idx, setIdx] = useState(0)

  const advance = () => {
    if (idx + 1 >= OPENING_MESSAGES.length) onComplete()
    else setIdx(i => i + 1)
  }

  useEffect(() => {
    const t = setTimeout(() => {
      if (idx + 1 >= OPENING_MESSAGES.length) onComplete()
      else setIdx(i => i + 1)
    }, 4000)
    return () => clearTimeout(t)
  }, [idx, onComplete])

  return (
    <div
      onClick={advance}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000208',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'default',
        zIndex: 50,
      }}
    >
      {/* Subtle radial glow behind text */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(60,80,180,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <AnimatePresence mode="wait">
        <motion.p
          key={idx}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            margin: 0,
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(1.3rem, 3.5vw, 2rem)',
            fontWeight: 400,
            color: '#e8e4dc',
            letterSpacing: '0.04em',
            lineHeight: 1.55,
            textAlign: 'center',
            maxWidth: '560px',
            padding: '0 2rem',
            textShadow: '0 0 40px rgba(120,150,255,0.25)',
          }}
        >
          {OPENING_MESSAGES[idx]}
        </motion.p>
      </AnimatePresence>

      {/* Progress dots */}
      <div style={{ position: 'absolute', bottom: '48px', display: 'flex', gap: '8px', alignItems: 'center' }}>
        {OPENING_MESSAGES.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              width: i === idx ? '20px' : '6px',
              background: i === idx ? 'rgba(180,200,255,0.7)' : 'rgba(255,255,255,0.2)',
            }}
            transition={{ duration: 0.3 }}
            style={{ height: '6px', borderRadius: '3px', cursor: 'pointer' }}
            onClick={e => { e.stopPropagation(); setIdx(i) }}
          />
        ))}
      </div>

      {/* Skip */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        whileHover={{ opacity: 0.8 }}
        transition={{ delay: 1.5, duration: 0.4 }}
        onClick={e => { e.stopPropagation(); onComplete() }}
        style={{
          position: 'absolute',
          bottom: '48px',
          right: '32px',
          background: 'transparent',
          border: 'none',
          color: '#fff',
          fontSize: '12px',
          letterSpacing: '0.12em',
          cursor: 'pointer',
          textTransform: 'uppercase',
        }}
      >
        Skip
      </motion.button>
    </div>
  )
}
