import { motion } from 'motion/react'
import { memories } from '../../data/memories'
import { useConstellationStore } from '../../state/useConstellationStore'

const panelStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: '1.5rem',
  left: '50%',
  width: 'min(460px, calc(100vw - 2rem))',
  background: 'rgba(4, 8, 24, 0.88)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(100, 150, 255, 0.12)',
  borderRadius: '1.25rem',
  overflow: 'hidden',
  color: 'white',
  zIndex: 20,
  boxShadow: '0 24px 64px rgba(0, 0, 0, 0.6)',
}

export default function MemoryPanel() {
  const { selectedId, setSelected } = useConstellationStore()
  const memory = memories.find(m => m.id === selectedId)
  if (!memory) return null

  return (
    <motion.div
      style={{ ...panelStyle, x: '-50%' }}
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 32 }}
      transition={{ type: 'spring', damping: 28, stiffness: 320 }}
    >
      {memory.photoSrc && (
        <img
          src={memory.photoSrc}
          alt={memory.title}
          style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
        />
      )}

      <div style={{ padding: '1.25rem 1.5rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '0.75rem',
            gap: '1rem',
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: '1rem',
                fontWeight: 600,
                color: '#ccdaee',
                letterSpacing: '0.01em',
              }}
            >
              {memory.title}
            </h2>
            {memory.date && (
              <p
                style={{
                  margin: '0.2rem 0 0',
                  fontSize: '0.7rem',
                  color: '#3a5070',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                {memory.date}
              </p>
            )}
          </div>
          <button
            onClick={() => setSelected(null)}
            aria-label="Close"
            style={{
              flexShrink: 0,
              background: 'transparent',
              border: 'none',
              color: '#3a5070',
              cursor: 'pointer',
              fontSize: '1.5rem',
              lineHeight: 1,
              padding: '0 0.1rem',
              marginTop: '-0.1rem',
            }}
          >
            ×
          </button>
        </div>

        <p
          style={{
            margin: 0,
            fontSize: '0.88rem',
            lineHeight: 1.75,
            color: '#7a94b0',
          }}
        >
          {memory.note}
        </p>
      </div>
    </motion.div>
  )
}
