import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
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
      {galaxy.memories.map(m => (
        <MemoryStar key={m.id} memory={m} />
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
      <color attach="background" args={['#000208']} />

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
