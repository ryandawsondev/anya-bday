import { motion } from 'motion/react'

interface Props {
  onClose: () => void
}

// The date everything started — matches the 'the-date' galaxy (30 · 06 · 24)
const TOGETHER_SINCE = new Date('2024-06-30')

const LETTER_LINES = [
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
  const daysTogether = Math.floor((Date.now() - TOGETHER_SINCE.getTime()) / 86400000)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.4 }}
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
        background: 'radial-gradient(ellipse 50% 35% at 50% 50%, rgba(180,120,255,0.09) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '520px', padding: '0 2rem', textAlign: 'center', position: 'relative' }}>

        {/* Seal */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
          style={{
            marginBottom: '2rem',
            fontSize: '2rem',
            color: 'rgba(200,180,255,0.6)',
            letterSpacing: '0.05em',
            textShadow: '0 0 30px rgba(180,130,255,0.4)',
          }}
        >
          ✦
        </motion.div>

        {/* Days together counter */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.9, ease: 'easeOut' }}
          style={{ marginBottom: '0.4rem' }}
        >
          <span style={{
            fontSize: 'clamp(2.4rem, 6vw, 3.4rem)',
            fontFamily: 'Georgia, serif',
            fontWeight: 400,
            color: '#e8e4dc',
            letterSpacing: '0.04em',
            textShadow: '0 0 40px rgba(180,150,255,0.35)',
          }}>
            {daysTogether}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 1.2 }}
          style={{
            fontSize: '0.7rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(160,140,200,0.65)',
            marginBottom: '2.5rem',
          }}
        >
          days together
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.9, delay: 1.5, ease: 'easeInOut' }}
          style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(180,150,255,0.25), transparent)',
            marginBottom: '2.5rem',
            transformOrigin: 'center',
          }}
        />

        {/* Letter */}
        {LETTER_LINES.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: line === '' ? 0 : 1, y: 0 }}
            transition={{ duration: 1.0, delay: 1.9 + i * 0.42, ease: [0.22, 1, 0.36, 1] }}
            style={{
              margin: line === '' ? '0.5rem 0' : '0 0 0.25rem',
              fontFamily: 'Georgia, serif',
              fontSize: line.startsWith('Happy') ? 'clamp(1.35rem, 3.8vw, 1.9rem)' : 'clamp(0.95rem, 2.5vw, 1.1rem)',
              fontStyle: line.startsWith('Happy') ? 'italic' : 'normal',
              fontWeight: 400,
              color: line.startsWith('Happy') ? '#e8e4dc' : 'rgba(200,210,230,0.72)',
              letterSpacing: line.startsWith('Happy') ? '0.06em' : '0.03em',
              lineHeight: 1.75,
              textShadow: line.startsWith('Happy') ? '0 0 48px rgba(180,150,255,0.35)' : 'none',
            }}
          >
            {line || ' '}
          </motion.p>
        ))}

        {/* Signature line */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1.9 + LETTER_LINES.length * 0.42 + 0.2, ease: 'easeOut' }}
          style={{
            height: '1px',
            width: '80px',
            background: 'rgba(180,150,255,0.25)',
            margin: '1.8rem auto 0',
            transformOrigin: 'center',
          }}
        />
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        whileHover={{ opacity: 0.9 }}
        transition={{ delay: 1.9 + LETTER_LINES.length * 0.42 + 1.0, duration: 0.5 }}
        onClick={onClose}
        style={{
          marginTop: '3rem',
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.18)',
          borderRadius: '2rem',
          color: '#fff',
          fontSize: '0.68rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          padding: '0.6rem 1.8rem',
          cursor: 'pointer',
        }}
      >
        Back to the Stars
      </motion.button>
    </motion.div>
  )
}
