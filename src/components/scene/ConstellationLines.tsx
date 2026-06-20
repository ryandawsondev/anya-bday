import { useMemo } from 'react'
import * as THREE from 'three'
import type { Memory } from '../../data/memories'

interface Props {
  memories: Memory[]
  connections: [number, number][]
}

export default function ConstellationLines({ memories, connections }: Props) {
  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = []
    for (const [a, b] of connections) {
      points.push(new THREE.Vector3(...memories[a].position))
      points.push(new THREE.Vector3(...memories[b].position))
    }
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [memories, connections])

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#1a2a4a" transparent opacity={0.35} />
    </lineSegments>
  )
}
