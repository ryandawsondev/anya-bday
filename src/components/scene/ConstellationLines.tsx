import { useMemo } from 'react'
import * as THREE from 'three'
import type { Memory } from '../../data/memories'

interface Props {
  memories: Memory[]
  connections: [number, number][]
}

export default function ConstellationLines({ memories, connections }: Props) {
  const geometry = useMemo(() => {
    const arr = new Float32Array(connections.length * 6)
    connections.forEach(([a, b], i) => {
      const [ax, ay, az] = memories[a].position
      const [bx, by, bz] = memories[b].position
      arr.set([ax, ay, az, bx, by, bz], i * 6)
    })
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(arr, 3))
    return geo
  }, [memories, connections])

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#1a2a4a" transparent opacity={0.35} />
    </lineSegments>
  )
}
