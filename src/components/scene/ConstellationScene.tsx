import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import Starfield from './Starfield'
import MemoryStar from './MemoryStar'
import ConstellationLines from './ConstellationLines'
import CameraRig from './CameraRig'
import { memories } from '../../data/memories'
import { useConstellationStore } from '../../state/useConstellationStore'

function SceneClickCatcher() {
  const setSelected = useConstellationStore(s => s.setSelected)
  return (
    <mesh
      position={[0, 0, -20]}
      onClick={() => setSelected(null)}
      visible={false}
    >
      <planeGeometry args={[200, 200]} />
    </mesh>
  )
}

export default function ConstellationScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 60, near: 0.1, far: 300 }}
      gl={{ antialias: true, alpha: false }}
      style={{ width: '100%', height: '100%' }}
      dpr={[1, 2]}
    >
      <color attach="background" args={['#000208']} />

      <Suspense fallback={null}>
        <Starfield />
        <ConstellationLines />
        {memories.map(m => (
          <MemoryStar key={m.id} memory={m} />
        ))}
      </Suspense>

      <SceneClickCatcher />
      <CameraRig />

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
