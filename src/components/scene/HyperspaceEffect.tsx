import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useConstellationStore } from '../../state/useConstellationStore'

const STREAK_COUNT = 280
const BASE_FOV     = 75
const MAX_FOV      = 108
const SPOOL_DUR    = 0.65
const WARP_DUR     = 1.0
const DROP_DUR     = 0.5

// HDR blue-white — luminance > 1 so bloom picks up the streaks
const STREAK_COLOR = new THREE.Color(3.2, 3.6, 4.8)

const easeIn2  = (t: number) => t * t
const easeOut2 = (t: number) => 1 - (1 - t) * (1 - t)

export default function HyperspaceEffect() {
  const { camera } = useThree()
  const progressRef  = useRef(0)
  const didSwitchRef = useRef(false)
  const streakRef    = useRef<THREE.LineSegments>(null)
  const flashRef     = useRef<THREE.Mesh>(null)

  // Random streak directions distributed across a sphere
  const dirs = useMemo<readonly [number, number, number][]>(() => {
    const out: [number, number, number][] = []
    for (let i = 0; i < STREAK_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      out.push([
        Math.sin(phi) * Math.cos(theta),
        Math.sin(phi) * Math.sin(theta),
        Math.cos(phi),
      ])
    }
    return out
  }, [])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(STREAK_COUNT * 6), 3))
    return geo
  }, [])

  useFrame((_, delta) => {
    const store = useConstellationStore.getState()
    const phase = store.warpPhase

    if (phase === 'idle') {
      progressRef.current  = 0
      didSwitchRef.current = false
      if (streakRef.current) (streakRef.current.material as THREE.LineBasicMaterial).opacity = 0
      if (flashRef.current)  (flashRef.current.material  as THREE.MeshBasicMaterial).opacity = 0
      return
    }

    progressRef.current += delta
    const t = progressRef.current

    let stretchLen = 0
    let opacity    = 0
    let flashOp    = 0
    let fov        = BASE_FOV

    // ── Spool-up ──────────────────────────────────────────────────────────────
    if (phase === 'spooling') {
      const p = easeIn2(Math.min(t / SPOOL_DUR, 1))
      stretchLen = p * 14
      opacity    = p * 0.9
      fov        = BASE_FOV + p * (MAX_FOV - BASE_FOV) * 0.65

      if (t >= SPOOL_DUR) {
        store.setWarpPhase('warping')
        progressRef.current = 0
        return
      }

    // ── Full warp ─────────────────────────────────────────────────────────────
    } else if (phase === 'warping') {
      const p = Math.min(t / WARP_DUR, 1)
      stretchLen = 14 + p * 30
      opacity    = 0.9 + p * 0.1
      flashOp    = Math.sin(p * Math.PI) * 0.75    // bell: peaks at midpoint
      fov        = MAX_FOV

      // Scene switch buried inside the flash peak
      if (!didSwitchRef.current && t >= WARP_DUR * 0.45) {
        didSwitchRef.current = true
        store.setSelected(null)
        const target = store.warpTargetGalaxyId
        if (target) {
          store.setCurrentGalaxyId(target)
          store.setViewMode('galaxy')
        } else {
          store.setViewMode('map')
        }
      }

      if (t >= WARP_DUR) {
        store.setWarpPhase('dropping')
        progressRef.current = 0
        return
      }

    // ── Drop ──────────────────────────────────────────────────────────────────
    } else if (phase === 'dropping') {
      const p = easeOut2(Math.min(t / DROP_DUR, 1))
      stretchLen = (1 - p) * 14
      opacity    = (1 - p) * 0.9
      fov        = MAX_FOV - p * (MAX_FOV - BASE_FOV)

      if (t >= DROP_DUR) {
        store.setWarpPhase('idle')
        progressRef.current = 0
        if (camera instanceof THREE.PerspectiveCamera) {
          camera.fov = BASE_FOV
          camera.updateProjectionMatrix()
        }
        return
      }
    }

    // ── Camera FOV ────────────────────────────────────────────────────────────
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = fov
      camera.updateProjectionMatrix()
    }

    // ── Streak geometry ───────────────────────────────────────────────────────
    const posAttr = geometry.attributes.position as THREE.BufferAttribute
    const arr     = posAttr.array as Float32Array

    for (let i = 0; i < STREAK_COUNT; i++) {
      const [dx, dy, dz] = dirs[i]
      const base = 4 + (i % 22) * 0.85
      const len  = stretchLen * (0.4 + (i % 13) * 0.05)
      const si   = i * 6
      arr[si]     = dx * base
      arr[si + 1] = dy * base
      arr[si + 2] = dz * base
      arr[si + 3] = dx * (base + len)
      arr[si + 4] = dy * (base + len)
      arr[si + 5] = dz * (base + len)
    }
    posAttr.needsUpdate = true

    // ── Material updates ──────────────────────────────────────────────────────
    if (streakRef.current)
      (streakRef.current.material as THREE.LineBasicMaterial).opacity = opacity
    if (flashRef.current)
      (flashRef.current.material as THREE.MeshBasicMaterial).opacity = flashOp
  })

  return (
    <>
      {/* Speed streaks — additive blending, HDR color so they bloom */}
      <lineSegments ref={streakRef} geometry={geometry} renderOrder={100}>
        <lineBasicMaterial
          color={STREAK_COLOR}
          toneMapped={false}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={false}
        />
      </lineSegments>

      {/* White flash overlay — masks the instant scene switch */}
      <mesh ref={flashRef} renderOrder={200}>
        <planeGeometry args={[500, 500]} />
        <meshBasicMaterial
          color="white"
          transparent
          opacity={0}
          depthTest={false}
          depthWrite={false}
        />
      </mesh>
    </>
  )
}
