import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'

interface Props {
  targetDate: Date
  onUnlock: () => void
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const getTimeLeft = (target: Date): TimeLeft => {
  const diff = Math.max(0, target.getTime() - Date.now())
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

const unit: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.3rem',
}

const numStyle: React.CSSProperties = {
  fontSize: 'clamp(2.8rem, 10vw, 5.5rem)',
  fontWeight: 700,
  lineHeight: 1,
  fontVariantNumeric: 'tabular-nums',
  letterSpacing: '-0.02em',
  color: '#ddeeff',
}

const labelStyle: React.CSSProperties = {
  fontSize: '0.65rem',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: '#3a5a88',
}

export default function CountdownGate({ targetDate, onUnlock }: Props) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetDate))

  useEffect(() => {
    const timer = setInterval(() => {
      const t = getTimeLeft(targetDate)
      setTimeLeft(t)
      if (t.days === 0 && t.hours === 0 && t.minutes === 0 && t.seconds === 0) {
        onUnlock()
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [targetDate, onUnlock])

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100dvh', overflow: 'hidden' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ position: 'absolute', inset: 0 }}
        gl={{ antialias: false }}
      >
        <color attach="background" args={['#000208']} />
        <Stars radius={80} depth={50} count={3000} factor={3.5} saturation={0.1} fade />
      </Canvas>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '2rem',
          gap: '1rem',
        }}
      >
        <p
          style={{
            fontSize: '0.7rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: '#4a6a9a',
            marginBottom: '0.5rem',
          }}
        >
          something special awaits
        </p>

        <div style={{ display: 'flex', gap: 'clamp(1rem, 4vw, 2.5rem)' }}>
          {(
            [
              { value: timeLeft.days, label: 'days' },
              { value: timeLeft.hours, label: 'hours' },
              { value: timeLeft.minutes, label: 'min' },
              { value: timeLeft.seconds, label: 'sec' },
            ] as const
          ).map(({ value, label }) => (
            <div key={label} style={unit}>
              <span style={numStyle}>{String(value).padStart(2, '0')}</span>
              <span style={labelStyle}>{label}</span>
            </div>
          ))}
        </div>

        <p style={{ fontSize: '0.75rem', color: '#2a4060', marginTop: '1rem' }}>
          come back on June 25th ✦
        </p>
      </div>
    </div>
  )
}
