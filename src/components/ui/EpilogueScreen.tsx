import { motion } from 'motion/react'

interface Props {
  onClose: () => void
}

const LINES = [
  "You've found them all.",
  "Every moment. Every place. Every us.",
  "",
  "Thank you for being the person",
  "these memories were made with.",
  "",
  "Happy Birthday, Anya.",
  "Here's to every moment still to come.",
]

export default function EpilogueScreen({ onClose }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(20,10,40,1) 0%, #000208 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 60,
        cursor: 'default',
      }}
    >
      {/* Soft glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 50% 35% at 50% 50%, rgba(180,120,255,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '520px', padding: '0 2rem', textAlign: 'center' }}>
        {LINES.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: line === '' ? 0 : 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 + i * 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{
              margin: line === '' ? '0.5rem 0' : '0 0 0.2rem',
              fontFamily: 'Georgia, serif',
              fontSize: line.startsWith('Happy') ? 'clamp(1.3rem, 3.5vw, 1.8rem)' : 'clamp(0.95rem, 2.5vw, 1.15rem)',
              fontWeight: 400,
              color: line.startsWith('Happy') ? '#e8e4dc' : 'rgba(200,210,230,0.75)',
              letterSpacing: '0.04em',
              lineHeight: 1.7,
              textShadow: line.startsWith('Happy') ? '0 0 40px rgba(180,150,255,0.3)' : 'none',
            }}
          >
            {line || ' '}
          </motion.p>
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        whileHover={{ opacity: 0.9 }}
        transition={{ delay: LINES.length * 0.35 + 1.2, duration: 0.5 }}
        onClick={onClose}
        style={{
          marginTop: '3rem',
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '2rem',
          color: '#fff',
          fontSize: '0.7rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          padding: '0.6rem 1.6rem',
          cursor: 'pointer',
        }}
      >
        Back to the Stars
      </motion.button>
    </motion.div>
  )
}
