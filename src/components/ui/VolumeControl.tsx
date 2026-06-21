import { motion } from 'motion/react'

const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches

interface Props {
  isMuted: boolean
  volume: number
  onToggle: () => void
  onVolumeChange: (v: number) => void
}

export default function VolumeControl({ isMuted, volume, onToggle, onVolumeChange }: Props) {
  const displayVol = isMuted ? 0 : volume

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.55 }}
      whileHover={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.8 }}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '8px',
        padding: '7px 12px',
        backdropFilter: 'blur(4px)',
        zIndex: 100,
      }}
    >
      <button
        onClick={onToggle}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          fontSize: '15px',
          padding: 0,
          lineHeight: 1,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {isMuted || volume === 0 ? '🔇' : volume < 0.4 ? '🔉' : '🔊'}
      </button>

      {!isTouchDevice && (
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={displayVol}
          onChange={e => onVolumeChange(Number(e.target.value))}
          style={{
            width: '72px',
            accentColor: '#4a8fff',
            cursor: 'pointer',
            margin: 0,
          }}
        />
      )}
    </motion.div>
  )
}
