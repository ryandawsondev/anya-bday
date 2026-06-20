import { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { BIRTHDAY_DATE } from './config'
import CountdownGate from './components/ui/CountdownGate'
import IntroScreen from './components/ui/IntroScreen'
import MemoryPanel from './components/ui/MemoryPanel'
import CustomCursor from './components/ui/CustomCursor'
import ConstellationScene from './components/scene/ConstellationScene'
import ResetButton from './components/ui/ResetButton'
import BackButton from './components/ui/BackButton'
import { useConstellationStore } from './state/useConstellationStore'

const isPastBirthday = () => new Date() >= BIRTHDAY_DATE

type Scene = 'countdown' | 'intro' | 'constellation'

function DevNav({ scene, setScene }: { scene: Scene; setScene: (s: Scene) => void }) {
  if (!import.meta.env.DEV) return null
  const viewMode = useConstellationStore(s => s.viewMode)

  const goTo = (s: Scene, vm?: 'map' | 'galaxy') => {
    useConstellationStore.getState().setSelected(null)
    if (vm) useConstellationStore.getState().setViewMode(vm)
    setScene(s)
  }

  const isActive = (s: Scene, vm?: 'map' | 'galaxy') => {
    if (s !== scene) return false
    if (vm && scene === 'constellation') return viewMode === vm
    return true
  }

  const btn = (s: Scene, label: string, vm?: 'map' | 'galaxy') => (
    <button
      key={label}
      onClick={() => goTo(s, vm)}
      style={{
        padding: '4px 10px',
        fontSize: '11px',
        background: isActive(s, vm) ? '#4a8fff' : 'rgba(0,0,0,0.6)',
        color: isActive(s, vm) ? '#fff' : '#aaa',
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
      {btn('constellation', 'Map', 'map')}
      {btn('constellation', 'Galaxy', 'galaxy')}
    </div>
  )
}

export default function App() {
  const [scene, setScene] = useState<Scene>(isPastBirthday() ? 'intro' : 'countdown')
  const selectedId = useConstellationStore(s => s.selectedId)
  const viewMode   = useConstellationStore(s => s.viewMode)

  return (
    <>
      <CustomCursor />
      <DevNav scene={scene} setScene={setScene} />

      {scene === 'countdown' && (
        <CountdownGate
          targetDate={BIRTHDAY_DATE}
          onUnlock={() => setScene('intro')}
        />
      )}

      {scene === 'intro' && (
        <IntroScreen onEnter={() => {
          useConstellationStore.getState().setViewMode('map')
          setScene('constellation')
        }} />
      )}

      {scene === 'constellation' && (
        <div style={{ width: '100vw', height: '100dvh', position: 'relative' }}>
          <ConstellationScene />
          {viewMode === 'galaxy' && <BackButton />}
          {viewMode === 'galaxy' && <ResetButton />}
          <AnimatePresence>
            {selectedId && <MemoryPanel key={selectedId} />}
          </AnimatePresence>
        </div>
      )}
    </>
  )
}
