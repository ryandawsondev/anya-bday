import { useMemo } from 'react'
import { Stars, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

// Procedural radial-gradient texture for soft nebula blobs
function makeNebulaTexture(r: number, g: number, b: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')!
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0, `rgba(${r},${g},${b},1)`)
  grad.addColorStop(0.4, `rgba(${r},${g},${b},0.4)`)
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(canvas)
}

interface NebulaProps {
  r: number; g: number; b: number
  position: [number, number, number]
  rotation: [number, number, number]
  size: number
  opacity: number
}

function NebulaPatch({ r, g, b, position, rotation, size, opacity }: NebulaProps) {
  const tex = useMemo(() => makeNebulaTexture(r, g, b), [r, g, b])
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial
        map={tex}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export default function Starfield() {
  return (
    <>
      {/* Deep background star field */}
      <Stars radius={200} depth={100} count={4000} factor={2.5} saturation={0.3} fade speed={0.2} />
      {/* Mid-field brighter stars */}
      <Stars radius={60} depth={30} count={600} factor={6} saturation={0.5} fade speed={0.5} />

      {/* Foreground dust / glints */}
      <Sparkles count={60} scale={16} size={1.4} speed={0.2} opacity={0.55} color="#b0ccff" />

      {/* Nebula patches — additive blending, soft radial gradient textures */}
      <NebulaPatch
        r={40} g={10} b={140}
        position={[-25, 12, -90]}
        rotation={[0.4, 0.6, 0.2]}
        size={140} opacity={0.10}
      />
      <NebulaPatch
        r={90} g={20} b={160}
        position={[30, -8, -100]}
        rotation={[-0.3, -0.5, 0.4]}
        size={120} opacity={0.08}
      />
      <NebulaPatch
        r={20} g={30} b={120}
        position={[10, 20, -75]}
        rotation={[0.7, 0.2, -0.3]}
        size={100} opacity={0.07}
      />
    </>
  )
}
