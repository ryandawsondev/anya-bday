import { Stars, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

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

// Module-level singletons — created once, never recreated on re-mount
const NEBULA_TEX_1 = makeNebulaTexture(40,  10, 140)
const NEBULA_TEX_2 = makeNebulaTexture(90,  20, 160)
const NEBULA_TEX_3 = makeNebulaTexture(20,  30, 120)

interface NebulaProps {
  tex: THREE.CanvasTexture
  position: [number, number, number]
  rotation: [number, number, number]
  size: number
  opacity: number
}

function NebulaPatch({ tex, position, rotation, size, opacity }: NebulaProps) {
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
        tex={NEBULA_TEX_1}
        position={[-25, 12, -90]}
        rotation={[0.4, 0.6, 0.2]}
        size={140} opacity={0.10}
      />
      <NebulaPatch
        tex={NEBULA_TEX_2}
        position={[30, -8, -100]}
        rotation={[-0.3, -0.5, 0.4]}
        size={120} opacity={0.08}
      />
      <NebulaPatch
        tex={NEBULA_TEX_3}
        position={[10, 20, -75]}
        rotation={[0.7, 0.2, -0.3]}
        size={100} opacity={0.07}
      />
    </>
  )
}
