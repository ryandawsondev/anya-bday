import { motion } from 'motion/react'

interface Props {
  progress: number
}

const STARS = [
  { x: 50, y: 14 },
  { x: 79, y: 36 },
  { x: 68, y: 70 },
  { x: 32, y: 70 },
  { x: 21, y: 36 },
]

const LINES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 0],
]

export default function LoadingScreen({ progress }: Props) {
  const pct = Math.round(progress * 100)

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 1.4, ease: 'easeInOut' }}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000208',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(120,80,200,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Constellation */}
      <svg
        width="180"
        height="150"
        viewBox="0 0 100 85"
        style={{ overflow: 'visible' }}
      >
        {/* Lines */}
        {LINES.map(([a, b], i) => (
          <motion.path
            key={i}
            d={`M ${STARS[a].x} ${STARS[a].y} L ${STARS[b].x} ${STARS[b].y}`}
            stroke="rgba(160,130,240,0.28)"
            strokeWidth="0.6"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 1.0,
              delay: 0.6 + i * 0.22,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Stars */}
        {STARS.map((s, i) => (
          <g key={i}>
            {/* Outer glow */}
            <motion.circle
              cx={s.x}
              cy={s.y}
              r={4}
              fill="rgba(180,150,255,0.06)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.8, 1.2], opacity: [0, 0.6, 0.3] }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: 'easeOut' }}
            />
            {/* Core */}
            <motion.circle
              cx={s.x}
              cy={s.y}
              r={1.8}
              fill="white"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.5, 1],
                opacity: [0, 1, 0.9],
              }}
              transition={{ duration: 0.55, delay: i * 0.12, ease: 'easeOut' }}
              style={{ filter: 'drop-shadow(0 0 3px rgba(200,170,255,0.9))' }}
            />
          </g>
        ))}

        {/* Pulse ring on centre star once all lines drawn */}
        <motion.circle
          cx={STARS[0].x}
          cy={STARS[0].y}
          r={3}
          fill="none"
          stroke="rgba(180,150,255,0.4)"
          strokeWidth="0.5"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
          transition={{
            duration: 1.4,
            delay: 2.2,
            repeat: Infinity,
            repeatDelay: 1.2,
            ease: 'easeOut',
          }}
        />
      </svg>

      {/* Progress */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        style={{ marginTop: '2rem', textAlign: 'center' }}
      >
        <div
          style={{
            width: '140px',
            height: '1px',
            background: 'rgba(255,255,255,0.07)',
            borderRadius: '1px',
            overflow: 'hidden',
            marginBottom: '0.9rem',
          }}
        >
          <motion.div
            style={{
              height: '100%',
              background:
                'linear-gradient(90deg, rgba(160,120,240,0.7), rgba(120,180,255,0.7))',
              borderRadius: '1px',
            }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>

        <motion.span
          style={{
            fontSize: '0.62rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(150,130,200,0.5)',
          }}
        >
          {pct < 100 ? 'charting stars' : 'ready'}
        </motion.span>
      </motion.div>
    </motion.div>
  )
}
