import { useRef, useMemo } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import type { Memory } from '../../data/memories'
import { useConstellationStore } from '../../state/useConstellationStore'

// Shared textures — created once for all stars
const CORE_TEX = (() => {
  const c = document.createElement('canvas')
  c.width = 64; c.height = 64
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  g.addColorStop(0,    'rgba(255,252,230,1)')
  g.addColorStop(0.18, 'rgba(255,240,190,0.75)')
  g.addColorStop(0.45, 'rgba(255,220,140,0.15)')
  g.addColorStop(1,    'rgba(255,200,100,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(c)
})()

const HALO_TEX = (() => {
  const c = document.createElement('canvas')
  c.width = 128; c.height = 128
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  g.addColorStop(0,    'rgba(255,230,150,0.5)')
  g.addColorStop(0.35, 'rgba(255,210,110,0.15)')
  g.addColorStop(0.7,  'rgba(255,190,80,0.04)')
  g.addColorStop(1,    'rgba(255,170,60,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(c)
})()

// HDR colors for bloom (toneMapped=false lets values exceed 1.0)
const CORE_COLOR  = new THREE.Color(8, 7, 3)
const HOVER_COLOR = new THREE.Color(10, 8.5, 3.5)
const SEL_COLOR   = new THREE.Color(12, 10, 4)
const HALO_COLOR  = new THREE.Color(5, 4, 1.5)

interface Props { memory: Memory }

export default function MemoryStar({ memory }: Props) {
  const coreRef = useRef<THREE.Sprite>(null)
  const haloRef = useRef<THREE.Sprite>(null)
  const { selectedId, hoveredId, setSelected, setHovered } = useConstellationStore()
  const isSelected = selectedId === memory.id
  const isHovered  = hoveredId  === memory.id
  const pulseOffset = useMemo(() => Math.random() * Math.PI * 2, [])

  const [coreMat] = useMemo(() => [
    new THREE.SpriteMaterial({
      map: CORE_TEX, transparent: true,
      blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
    }),
  ], [])
  const [haloMat] = useMemo(() => [
    new THREE.SpriteMaterial({
      map: HALO_TEX, transparent: true,
      blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
    }),
  ], [])

  useFrame(({ clock }) => {
    if (!coreRef.current || !haloRef.current) return
    const t = clock.getElapsedTime()
    const pulse = 1 + Math.sin(t * 1.4 + pulseOffset) * 0.07

    const targetCore = isSelected ? 0.52 : isHovered ? 0.40 : 0.26 * pulse
    const targetHalo = isSelected ? 1.40 : isHovered ? 1.05 : 0.72 * pulse

    const cx = coreRef.current.scale.x
    const hx = haloRef.current.scale.x
    coreRef.current.scale.setScalar(THREE.MathUtils.lerp(cx, targetCore, 0.12))
    haloRef.current.scale.setScalar(THREE.MathUtils.lerp(hx, targetHalo, 0.10))

    coreMat.color.copy(isSelected ? SEL_COLOR : isHovered ? HOVER_COLOR : CORE_COLOR)
    haloMat.color.copy(HALO_COLOR)
    haloMat.opacity = isSelected ? 0.9 : isHovered ? 0.75 : 0.55
  })

  return (
    <group position={memory.position}>
      {/* Invisible sphere — hitbox for raycasting */}
      <mesh
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
        <sphereGeometry args={[0.3, 6, 6]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Soft halo — large, very soft glow */}
      <sprite ref={haloRef} material={haloMat} />

      {/* Core — tight bright point */}
      <sprite ref={coreRef} material={coreMat} />
    </group>
  )
}
