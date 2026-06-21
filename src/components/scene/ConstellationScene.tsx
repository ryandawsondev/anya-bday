import { Suspense, useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import Starfield from './Starfield'
import MemoryStar from './MemoryStar'
import ConstellationLines from './ConstellationLines'
import CameraRig from './CameraRig'
import GalaxyMap from './GalaxyMap'
import HyperspaceEffect from './HyperspaceEffect'
import ShootingStars from './ShootingStars'
import { galaxies } from '../../data/galaxies'
import { useConstellationStore } from '../../state/useConstellationStore'
import { useConstellationDrag } from '../../hooks/useConstellationDrag'
import { useScrollZoom } from '../../hooks/useScrollZoom'

const BASE_BG = new THREE.Color('#000208')

// Lerps scene.background toward the current galaxy's theme tint (M32)
function SceneAmbience() {
  const { scene } = useThree()
  const viewMode        = useConstellationStore(s => s.viewMode)
  const currentGalaxyId = useConstellationStore(s => s.currentGalaxyId)

  const currentColor = useRef(new THREE.Color('#000208'))
  const targetColor  = useRef(new THREE.Color('#000208'))

  useEffect(() => {
    scene.background = currentColor.current
    return () => { scene.background = null }
  }, [scene])

  useFrame((_, delta) => {
    const galaxy = viewMode === 'galaxy'
      ? galaxies.find(g => g.id === currentGalaxyId)
      : null

    if (galaxy) {
      targetColor.current.set(galaxy.themeColor).multiplyScalar(0.035).add(BASE_BG)
    } else {
      targetColor.current.copy(BASE_BG)
    }
    currentColor.current.lerp(targetColor.current, 1 - Math.exp(-1.8 * delta))
  })

  return null
}

function SceneClickCatcher() {
  const setSelected = useConstellationStore(s => s.setSelected)
  return (
    <mesh position={[0, 0, -20]} onClick={() => setSelected(null)} visible={false}>
      <planeGeometry args={[200, 200]} />
    </mesh>
  )
}

function ConstellationGroup() {
  const currentGalaxyId = useConstellationStore(s => s.currentGalaxyId)
  const galaxy = galaxies.find(g => g.id === currentGalaxyId) ?? galaxies[0]
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (!groupRef.current) return
    const { constellationRotX, constellationRotY } = useConstellationStore.getState()
    groupRef.current.rotation.x = constellationRotX
    groupRef.current.rotation.y = constellationRotY
  })

  return (
    <group ref={groupRef}>
      <ConstellationLines memories={galaxy.memories} connections={galaxy.connections} />
      {galaxy.memories.map((m, i) => (
        <MemoryStar key={m.id} memory={m} revealDelay={0.5 + i * 0.12} />
      ))}
    </group>
  )
}

export default function ConstellationScene() {
  useConstellationDrag()
  useScrollZoom()

  const viewMode = useConstellationStore(s => s.viewMode)

  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 75, near: 0.1, far: 300 }}
      gl={{ antialias: false, alpha: false }}
      style={{ width: '100%', height: '100%' }}
      dpr={[1, 1.5]}
    >
      <SceneAmbience />

      <Suspense fallback={null}>
        <Starfield />
        <ShootingStars />
        {viewMode === 'map' ? (
          <GalaxyMap />
        ) : (
          <>
            <ConstellationGroup />
            <SceneClickCatcher />
            <CameraRig />
          </>
        )}
      </Suspense>

      <HyperspaceEffect />

      <EffectComposer>
        <Bloom
          luminanceThreshold={1.0}
          luminanceSmoothing={0.8}
          intensity={2.2}
          mipmapBlur
          radius={0.75}
        />
      </EffectComposer>
    </Canvas>
  )
}
