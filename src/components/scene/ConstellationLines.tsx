import { useMemo } from 'react'
import * as THREE from 'three'
import { memories, CONSTELLATION_CONNECTIONS } from '../../data/memories'

export default function ConstellationLines() {
  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = []
    for (const [a, b] of CONSTELLATION_CONNECTIONS) {
      points.push(new THREE.Vector3(...memories[a].position))
      points.push(new THREE.Vector3(...memories[b].position))
    }
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [])

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#1a2a4a" transparent opacity={0.35} />
    </lineSegments>
  )
}
