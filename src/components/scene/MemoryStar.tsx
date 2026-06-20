import { useRef, useState, useMemo } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import type { Memory } from '../../data/memories'
import { useConstellationStore } from '../../state/useConstellationStore'

// HDR colors (toneMapped=false) so only these stars exceed bloom threshold
const COLOR_DEFAULT = new THREE.Color(4, 3.5, 1.5)
const COLOR_HOVERED = new THREE.Color(5, 4.5, 2)
const COLOR_SELECTED = new THREE.Color(6, 5, 2.5)
const COLOR_AURA = new THREE.Color(3, 2.5, 1)

interface Props {
  memory: Memory
}

export default function MemoryStar({ memory }: Props) {
  const meshRef = useRef<THREE.Mesh>(null)
  const auraRef = useRef<THREE.Mesh>(null)
  const { selectedId, hoveredId, setSelected, setHovered } = useConstellationStore()
  const isSelected = selectedId === memory.id
  const isHovered = hoveredId === memory.id
  const pulseOffset = useMemo(() => Math.random() * Math.PI * 2, [])

  const [matRef] = useState(() => new THREE.MeshBasicMaterial({ toneMapped: false }))
  const [auraMat] = useState(() =>
    new THREE.MeshBasicMaterial({ transparent: true, toneMapped: false }),
  )

  useFrame(({ clock }) => {
    if (!meshRef.current || !auraRef.current) return
    const t = clock.getElapsedTime()
    const pulse = 1 + Math.sin(t * 1.5 + pulseOffset) * 0.06

    const targetScale = isSelected ? 1.8 : isHovered ? 1.4 : pulse
    const current = meshRef.current.scale.x
    const next = THREE.MathUtils.lerp(current, targetScale, 0.12)
    meshRef.current.scale.setScalar(next)
    auraRef.current.scale.setScalar(next)

    matRef.color = isSelected ? COLOR_SELECTED : isHovered ? COLOR_HOVERED : COLOR_DEFAULT
    auraMat.color = COLOR_AURA
    auraMat.opacity = isSelected ? 0.35 : isHovered ? 0.25 : 0.12
  })

  return (
    <group position={memory.position}>
      {/* Soft glow aura */}
      <mesh ref={auraRef} material={auraMat}>
        <sphereGeometry args={[0.28, 12, 12]} />
      </mesh>
      {/* Main star */}
      <mesh
        ref={meshRef}
        material={matRef}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation()
          setSelected(isSelected ? null : memory.id)
        }}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation()
          setHovered(memory.id)
        }}
        onPointerOut={() => setHovered(null)}
      >
        <sphereGeometry args={[0.12, 16, 16]} />
      </mesh>
    </group>
  )
}
