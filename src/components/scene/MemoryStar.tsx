import { useRef, useMemo } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import type { Memory } from '../../data/memories'
import { useConstellationStore } from '../../state/useConstellationStore'
import { playStarHover, playStarClick } from '../../audio/soundEffects'

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
const CORE_COLOR    = new THREE.Color(8, 7, 3)
const HOVER_COLOR   = new THREE.Color(10, 8.5, 3.5)
const SEL_COLOR     = new THREE.Color(12, 10, 4)
const HALO_COLOR    = new THREE.Color(5, 4, 1.5)
const VISITED_COLOR = new THREE.Color(3.5, 5.5, 8)
const VISITED_HALO  = new THREE.Color(2, 3.5, 5.5)

const BURST_COUNT = 12
const BURST_DUR   = 0.45

interface Props {
  memory: Memory
  revealDelay?: number
}

export default function MemoryStar({ memory, revealDelay = 0 }: Props) {
  const coreRef = useRef<THREE.Sprite>(null)
  const haloRef = useRef<THREE.Sprite>(null)
  const isSelected = useConstellationStore(s => s.selectedId === memory.id)
  const isHovered  = useConstellationStore(s => s.hoveredId  === memory.id)
  const isVisited  = useConstellationStore(s => s.visitedIds.includes(memory.id))
  const pulseOffset = useMemo(() => Math.random() * Math.PI * 2, [])
  const mountTime   = useRef(performance.now())
  const burstTrigger = useRef(-Infinity)

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

  // Per-instance randomised burst directions
  const burstDirs = useMemo(() => {
    const arr = new Float32Array(BURST_COUNT * 3)
    for (let i = 0; i < BURST_COUNT; i++) {
      const theta = (i / BURST_COUNT) * Math.PI * 2 + Math.random() * 0.4
      const phi   = (Math.random() - 0.5) * 1.0
      const speed = 1.5 + Math.random() * 0.8
      arr[i * 3]     = Math.cos(theta) * Math.cos(phi) * speed
      arr[i * 3 + 1] = Math.sin(phi) * speed
      arr[i * 3 + 2] = Math.sin(theta) * Math.cos(phi) * speed
    }
    return arr
  }, [])

  const burstGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(BURST_COUNT * 3), 3))
    return geo
  }, [])

  const burstMat = useMemo(() => new THREE.PointsMaterial({
    size: 0.07,
    color: '#ffd080',
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  }), [])

  useFrame(({ clock }) => {
    if (!coreRef.current || !haloRef.current) return
    const t = clock.getElapsedTime()
    const pulse = 1 + Math.sin(t * 1.4 + pulseOffset) * 0.07

    // Reveal fade-in
    const revealElapsed = (performance.now() - mountTime.current) / 1000
    const revealFade = Math.min(Math.max((revealElapsed - revealDelay) / 0.6, 0), 1)

    const baseScale = isVisited ? 0.20 : 0.26
    const targetCore = isSelected ? 0.52 : isHovered ? 0.40 : baseScale * pulse
    const targetHalo = isSelected ? 1.40 : isHovered ? 1.05 : (isVisited ? 0.55 : 0.72) * pulse

    const cx = coreRef.current.scale.x
    const hx = haloRef.current.scale.x
    coreRef.current.scale.setScalar(THREE.MathUtils.lerp(cx, targetCore, 0.12) * revealFade)
    haloRef.current.scale.setScalar(THREE.MathUtils.lerp(hx, targetHalo, 0.10) * revealFade)

    const baseCore = isVisited ? VISITED_COLOR : CORE_COLOR
    coreMat.color.copy(isSelected ? SEL_COLOR : isHovered ? HOVER_COLOR : baseCore)
    haloMat.color.copy(isVisited ? VISITED_HALO : HALO_COLOR)
    haloMat.opacity = (isSelected ? 0.9 : isHovered ? 0.75 : (isVisited ? 0.35 : 0.55)) * revealFade

    // Burst animation
    const bElapsed = (performance.now() - burstTrigger.current) / 1000
    if (bElapsed < BURST_DUR) {
      const bt = bElapsed / BURST_DUR
      const ease = 1 - (1 - bt) * (1 - bt)
      const posAttr = burstGeo.attributes.position as THREE.BufferAttribute
      const posArr  = posAttr.array as Float32Array
      for (let i = 0; i < BURST_COUNT; i++) {
        posArr[i * 3]     = burstDirs[i * 3]     * ease
        posArr[i * 3 + 1] = burstDirs[i * 3 + 1] * ease
        posArr[i * 3 + 2] = burstDirs[i * 3 + 2] * ease
      }
      posAttr.needsUpdate = true
      burstMat.opacity = (1 - bt * bt) * 0.9
      burstMat.size    = 0.05 + bt * 0.04
    } else if (bElapsed < BURST_DUR + 0.06) {
      const posAttr = burstGeo.attributes.position as THREE.BufferAttribute
      ;(posAttr.array as Float32Array).fill(0)
      posAttr.needsUpdate = true
      burstMat.opacity = 0
    }
  })

  return (
    <group position={memory.position}>
      {/* Invisible sphere — hitbox for raycasting */}
      <mesh
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation()
          playStarClick()
          burstTrigger.current = performance.now()
          const { markVisited, setSelected, selectedId } = useConstellationStore.getState()
          markVisited(memory.id)
          setSelected(selectedId === memory.id ? null : memory.id)
        }}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation()
          playStarHover()
          useConstellationStore.getState().setHovered(memory.id)
        }}
        onPointerOut={() => useConstellationStore.getState().setHovered(null)}
      >
        <sphereGeometry args={[0.3, 6, 6]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Burst particles */}
      <points geometry={burstGeo} material={burstMat} />

      {/* Soft halo — large, very soft glow */}
      <sprite ref={haloRef} material={haloMat} />

      {/* Core — tight bright point */}
      <sprite ref={coreRef} material={coreMat} />
    </group>
  )
}
