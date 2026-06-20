import { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { BIRTHDAY_DATE } from './config'
import CountdownGate from './components/ui/CountdownGate'
import IntroScreen from './components/ui/IntroScreen'
import MemoryPanel from './components/ui/MemoryPanel'
import ConstellationScene from './components/scene/ConstellationScene'
import { useConstellationStore } from './state/useConstellationStore'

const isPastBirthday = () => new Date() >= BIRTHDAY_DATE

type Scene = 'countdown' | 'intro' | 'constellation'

function DevNav({ scene, setScene }: { scene: Scene; setScene: (s: Scene) => void }) {
  if (!import.meta.env.DEV) return null
  const btn = (s: Scene, label: string) => (
    <button
      key={s}
      onClick={() => setScene(s)}
      style={{
        padding: '4px 10px',
        fontSize: '11px',
        background: scene === s ? '#4a8fff' : 'rgba(0,0,0,0.6)',
        color: scene === s ? '#fff' : '#aaa',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  )
  return (
    <div
      style={{
        position: 'fixed',
        top: '12px',
        right: '12px',
        zIndex: 9999,
        display: 'flex',
        gap: '6px',
        alignItems: 'center',
      }}
    >
      <span style={{ fontSize: '10px', color: '#555', letterSpacing: '0.1em' }}>DEV</span>
      {btn('countdown', 'Countdown')}
      {btn('intro', 'Intro')}
      {btn('constellation', 'Scene')}
    </div>
  )
}

export default function App() {
  const [scene, setScene] = useState<Scene>(isPastBirthday() ? 'intro' : 'countdown')
  const selectedId = useConstellationStore(s => s.selectedId)

  const goToScene = (s: Scene) => {
    useConstellationStore.getState().setSelected(null)
    setScene(s)
  }

  return (
    <>
      <DevNav scene={scene} setScene={goToScene} />

      {scene === 'countdown' && (
        <CountdownGate
          targetDate={BIRTHDAY_DATE}
          onUnlock={() => setScene('intro')}
        />
      )}

      {scene === 'intro' && (
        <IntroScreen onEnter={() => setScene('constellation')} />
      )}

      {scene === 'constellation' && (
        <div style={{ width: '100vw', height: '100dvh', position: 'relative' }}>
          <ConstellationScene />
          <AnimatePresence>
            {selectedId && <MemoryPanel key={selectedId} />}
          </AnimatePresence>
        </div>
      )}
    </>
  )
}
