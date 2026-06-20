import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import GalaxyCluster from './GalaxyCluster'
import { galaxies } from '../../data/galaxies'

const _camTarget = new THREE.Vector3()

function GalaxyMapCameraRig() {
  const { camera } = useThree()
  const timeRef = useRef(0)

  useFrame((_, delta) => {
    timeRef.current += delta
    const t = timeRef.current
    _camTarget.set(
      Math.sin(t * 0.08) * 2,
      Math.cos(t * 0.06) * 1.5,
      20 + Math.sin(t * 0.05) * 1,
    )
    camera.position.lerp(_camTarget, 1 - Math.exp(-1.2 * delta))
    camera.lookAt(0, 0, 0)
  })

  return null
}

export default function GalaxyMap() {
  return (
    <>
      <GalaxyMapCameraRig />
      {galaxies.map(g => (
        <GalaxyCluster key={g.id} galaxy={g} />
      ))}
    </>
  )
}
