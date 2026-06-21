import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { BIRTHDAY_DATE } from './config'
import { galaxies } from './data/galaxies'
import CountdownGate from './components/ui/CountdownGate'
import IntroScreen from './components/ui/IntroScreen'
import MemoryPanel from './components/ui/MemoryPanel'
import CustomCursor from './components/ui/CustomCursor'
import ConstellationScene from './components/scene/ConstellationScene'
import ResetButton from './components/ui/ResetButton'
import BackButton from './components/ui/BackButton'
import CinematicText from './components/ui/CinematicText'
import VolumeControl from './components/ui/VolumeControl'
import YouAreHereLabel from './components/ui/YouAreHereLabel'
import EpilogueScreen from './components/ui/EpilogueScreen'
import { useConstellationStore } from './state/useConstellationStore'
import { useAmbientAudio } from './hooks/useAmbientAudio'
import { useEasterEgg } from './hooks/useEasterEgg'

const isPastBirthday = () => new Date() >= BIRTHDAY_DATE

type Scene = 'countdown' | 'intro' | 'cinematic' | 'constellation' | 'epilogue'

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
      {btn('cinematic', 'Cinematic')}
      {btn('constellation', 'Map', 'map')}
      {btn('constellation', 'Galaxy', 'galaxy')}
      {btn('epilogue', 'Epilogue')}
    </div>
  )
}

function allGalaxiesComplete(visitedIds: string[]): boolean {
  return galaxies
    .filter(g => !g.hidden)
    .every(g => g.memories.length > 0 && g.memories.every(m => visitedIds.includes(m.id)))
}

export default function App() {
  const [scene, setScene] = useState<Scene>(isPastBirthday() ? 'intro' : 'countdown')
  const [epilogueSeen, setEpilogueSeen] = useState(false)
  const selectedId = useConstellationStore(s => s.selectedId)
  const viewMode   = useConstellationStore(s => s.viewMode)
  const warpPhase  = useConstellationStore(s => s.warpPhase)
  const visitedIds = useConstellationStore(s => s.visitedIds)
  const { play: playAudio, toggle: toggleAudio, isMuted, volume, setVolume } = useAmbientAudio()
  const { triggered: easterEgg, dismiss: dismissEgg } = useEasterEgg()

  useEffect(() => {
    if (!easterEgg) return
    const t = setTimeout(dismissEgg, 4000)
    return () => clearTimeout(t)
  }, [easterEgg, dismissEgg])

  useEffect(() => {
    if (!epilogueSeen && scene === 'constellation' && warpPhase === 'idle' && viewMode === 'map' && allGalaxiesComplete(visitedIds)) {
      const t = setTimeout(() => { setEpilogueSeen(true); setScene('epilogue') }, 400)
      return () => clearTimeout(t)
    }
  }, [warpPhase, viewMode, scene, visitedIds, epilogueSeen])

  return (
    <>
      <CustomCursor />
      <DevNav scene={scene} setScene={setScene} />

      <AnimatePresence>
        {easterEgg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={dismissEgg}
            style={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 200,
              background: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(10px)',
              cursor: 'pointer',
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
              style={{ textAlign: 'center', pointerEvents: 'none' }}
            >
              <motion.div
                animate={{ rotate: [0, 12, -12, 8, -8, 0] }}
                transition={{ duration: 0.55, delay: 0.15 }}
                style={{
                  fontSize: '3.5rem',
                  marginBottom: '1.2rem',
                  color: 'rgba(255,220,160,0.95)',
                  textShadow: '0 0 30px rgba(255,200,100,0.6)',
                }}
              >
                ✦
              </motion.div>
              <div style={{
                fontFamily: 'Georgia, serif',
                fontSize: 'clamp(1.3rem, 4vw, 1.7rem)',
                color: '#e8e4dc',
                letterSpacing: '0.08em',
                marginBottom: '0.6rem',
                textShadow: '0 0 30px rgba(180,150,255,0.3)',
              }}>
                Hi Anya
              </div>
              <div style={{
                fontSize: '0.72rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(200,180,255,0.55)',
              }}>
                You found the secret
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {scene === 'countdown' && (
        <CountdownGate
          targetDate={BIRTHDAY_DATE}
          onUnlock={() => setScene('intro')}
        />
      )}

      {scene === 'intro' && (
        <IntroScreen onEnter={() => {
          playAudio()
          setScene('cinematic')
        }} />
      )}

      {scene === 'cinematic' && (
        <CinematicText onComplete={() => {
          useConstellationStore.getState().setViewMode('map')
          setScene('constellation')
        }} />
      )}

      {scene === 'epilogue' && (
        <EpilogueScreen onClose={() => {
          useConstellationStore.getState().setViewMode('map')
          setScene('constellation')
        }} />
      )}

      {(scene === 'constellation' || scene === 'epilogue') && (
        <div style={{ width: '100vw', height: '100dvh', position: 'relative' }}>
          <ConstellationScene />
          {viewMode === 'galaxy' && <BackButton />}
          {viewMode === 'galaxy' && <ResetButton />}
          <VolumeControl
            isMuted={isMuted}
            volume={volume}
            onToggle={toggleAudio}
            onVolumeChange={setVolume}
          />
          <YouAreHereLabel />
          <AnimatePresence>
            {selectedId && <MemoryPanel key={selectedId} />}
          </AnimatePresence>
        </div>
      )}
    </>
  )
}
