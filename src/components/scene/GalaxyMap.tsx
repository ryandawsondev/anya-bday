import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import GalaxyCluster from './GalaxyCluster'
import { galaxies } from '../../data/galaxies'
import { useConstellationStore } from '../../state/useConstellationStore'

const _camTarget = new THREE.Vector3()

function GalaxyMapCameraRig() {
  const { camera } = useThree()
  const timeRef = useRef(0)

  useFrame((_, delta) => {
    timeRef.current += delta
    const t = timeRef.current
    _camTarget.set(
      Math.sin(t * 0.08) * 1,
      Math.cos(t * 0.06) * 0.8,
      26 + Math.sin(t * 0.05) * 0.6,
    )
    camera.position.lerp(_camTarget, 1 - Math.exp(-1.2 * delta))
    camera.lookAt(0, 0, 0)
  })

  return null
}

export default function GalaxyMap() {
  const visitedIds = useConstellationStore(s => s.visitedIds)
  const mainGalaxies = galaxies.filter(g => !g.hidden)
  const allMainComplete = mainGalaxies.length > 0 &&
    mainGalaxies.every(g => g.memories.length > 0 && g.memories.every(m => visitedIds.includes(m.id)))

  return (
    <>
      <GalaxyMapCameraRig />
      {galaxies.map(g => (
        <GalaxyCluster
          key={g.id}
          galaxy={g}
          isLocked={!!g.hidden && !allMainComplete}
        />
      ))}
    </>
  )
}
