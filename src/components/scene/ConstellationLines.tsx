import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Memory } from '../../data/memories'

interface Props {
  memories: Memory[]
  connections: [number, number][]
}

const DRAW_DURATION = 1.6

export default function ConstellationLines({ memories, connections }: Props) {
  const mountTime = useRef(performance.now())

  const geometry = useMemo(() => {
    const arr = new Float32Array(connections.length * 6)
    connections.forEach(([a, b], i) => {
      const [ax, ay, az] = memories[a].position
      const [bx, by, bz] = memories[b].position
      arr.set([ax, ay, az, bx, by, bz], i * 6)
    })
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(arr, 3))
    geo.setDrawRange(0, 0)
    return geo
  }, [memories, connections])

  useFrame(() => {
    const elapsed = (performance.now() - mountTime.current) / 1000
    const progress = Math.min(elapsed / DRAW_DURATION, 1)
    geometry.setDrawRange(0, Math.floor(progress * connections.length) * 2)
  })

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#1a2a4a" transparent opacity={0.35} />
    </lineSegments>
  )
}
