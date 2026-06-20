import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { galaxies } from '../../data/galaxies'
import { useConstellationStore } from '../../state/useConstellationStore'

function useTypewriter(text: string, charDelay = 26) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    setCount(0)
    if (!text) return
    const id = setInterval(() => {
      setCount(c => {
        if (c >= text.length) { clearInterval(id); return c }
        return c + 1
      })
    }, charDelay)
    return () => clearInterval(id)
  }, [text, charDelay])
  return { displayed: text.slice(0, count), done: count >= text.length }
}

interface CarouselProps {
  photos: string[]
  themeColor: string
}

function PhotoCarousel({ photos, themeColor }: CarouselProps) {
  const [idx, setIdx] = useState(0)
  const prev = () => setIdx(i => (i - 1 + photos.length) % photos.length)
  const next = () => setIdx(i => (i + 1) % photos.length)

  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '1.25rem 1.25rem 0 0' }}>
      <AnimatePresence mode="wait">
        <motion.img
          key={idx}
          src={photos[idx]}
          alt=""
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          style={{ width: '100%', height: '240px', objectFit: 'cover', display: 'block' }}
        />
      </AnimatePresence>

      {photos.length > 1 && (
        <>
          {[{ fn: prev, side: 'left', icon: '‹' }, { fn: next, side: 'right', icon: '›' }].map(({ fn, side, icon }) => (
            <button
              key={side}
              onClick={fn}
              style={{
                position: 'absolute',
                [side]: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.45)',
                border: 'none',
                color: '#fff',
                fontSize: '22px',
                lineHeight: 1,
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(4px)',
              }}
            >
              {icon}
            </button>
          ))}

          <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px' }}>
            {photos.map((_, i) => (
              <div
                key={i}
                onClick={() => setIdx(i)}
                style={{
                  width: i === idx ? '18px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  background: i === idx ? themeColor : 'rgba(255,255,255,0.35)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function MemoryPanel() {
  const { selectedId, setSelected, currentGalaxyId } = useConstellationStore()
  const galaxy = galaxies.find(g => g.id === currentGalaxyId) ?? galaxies[0]
  const memory = galaxy.memories.find(m => m.id === selectedId)

  const { displayed, done } = useTypewriter(memory?.note ?? '')

  if (!memory) return null

  const theme = galaxy.themeColor
  const hasPhotos = memory.photos.length > 0

  return (
    <motion.div
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        left: '50%',
        x: '-50%',
        width: 'min(460px, calc(100vw - 2rem))',
        background: 'rgba(4, 8, 24, 0.88)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: `1px solid ${theme}40`,
        borderRadius: '1.25rem',
        overflow: 'hidden',
        color: 'white',
        zIndex: 20,
        boxShadow: `0 24px 64px rgba(0,0,0,0.6), 0 0 48px ${theme}1a`,
      }}
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 32 }}
      transition={{ type: 'spring', damping: 28, stiffness: 320 }}
    >
      {/* Photo carousel — slides in after typewriter finishes */}
      <AnimatePresence>
        {done && hasPhotos && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <PhotoCarousel photos={memory.photos} themeColor={theme} />
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '1rem' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#ccdaee', letterSpacing: '0.01em' }}>
              {memory.title}
            </h2>
            {memory.date && (
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.7rem', color: `${theme}bb`, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {memory.date}
              </p>
            )}
          </div>
          <button
            onClick={() => setSelected(null)}
            aria-label="Close"
            style={{ flexShrink: 0, background: 'transparent', border: 'none', color: '#3a5070', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1, padding: '0 0.1rem', marginTop: '-0.1rem' }}
          >
            ×
          </button>
        </div>

        <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.75, color: '#7a94b0', minHeight: '1.5em' }}>
          {displayed}
          {!done && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1.0, repeat: Infinity, ease: 'linear' }}
              style={{ color: theme, marginLeft: '1px' }}
            >
              |
            </motion.span>
          )}
        </p>
      </div>
    </motion.div>
  )
}
