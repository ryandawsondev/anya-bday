import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const POOL_SIZE = 6
// HDR values — brightness encodes opacity with additive blending (black = invisible)
const STREAK_R = 2.5
const STREAK_G = 3.0
const STREAK_B = 4.5

interface Star {
  active: boolean
  t: number
  speed: number
  start: THREE.Vector3
  dir: THREE.Vector3
  length: number
  travel: number
}

export default function ShootingStars() {
  const linesRef = useRef<THREE.LineSegments>(null)
  const pool = useRef<Star[]>([])
  const spawnTimer = useRef(0)
  const nextSpawn = useRef(1.5 + Math.random() * 2)

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(POOL_SIZE * 6), 3))
    geo.setAttribute('color',    new THREE.BufferAttribute(new Float32Array(POOL_SIZE * 6), 3))
    return geo
  }, [])

  useEffect(() => {
    pool.current = Array.from({ length: POOL_SIZE }, () => ({
      active: false, t: 0, speed: 0,
      start: new THREE.Vector3(), dir: new THREE.Vector3(),
      length: 0, travel: 0,
    }))
    return () => { geometry.dispose() }
  }, [geometry])

  useFrame((_, delta) => {
    const lines = linesRef.current
    if (!lines) return

    const posAttr = lines.geometry.attributes.position as THREE.BufferAttribute
    const colAttr = lines.geometry.attributes.color   as THREE.BufferAttribute
    const pos = posAttr.array as Float32Array
    const col = colAttr.array as Float32Array

    spawnTimer.current += delta
    if (spawnTimer.current >= nextSpawn.current) {
      spawnTimer.current = 0
      nextSpawn.current = 2.0 + Math.random() * 3.5
      const star = pool.current.find(s => !s.active)
      if (star) {
        star.active = true
        star.t = 0
        star.speed = 10 + Math.random() * 8
        star.start.set(
          (Math.random() - 0.5) * 60,
          5 + Math.random() * 18,
          -25 - Math.random() * 15,
        )
        const flip = Math.random() > 0.5 ? 1 : -1
        const angle = 0.2 + Math.random() * 0.25
        star.dir.set(flip * Math.cos(angle), -Math.sin(angle), 0).normalize()
        star.length = 1.5 + Math.random() * 2.0
        star.travel = 18 + Math.random() * 10
      }
    }

    pool.current.forEach((star, i) => {
      const vi = i * 6

      if (!star.active) {
        col[vi] = col[vi+1] = col[vi+2] = 0
        col[vi+3] = col[vi+4] = col[vi+5] = 0
        return
      }

      star.t += delta * star.speed
      const progress = star.t / star.travel
      const fade = progress < 0.12 ? progress / 0.12 : progress > 0.82 ? (1 - progress) / 0.18 : 1
      const brightness = Math.max(0, fade * 0.55)

      const tx = star.start.x + star.dir.x * star.t
      const ty = star.start.y + star.dir.y * star.t
      const tz = star.start.z
      pos[vi]   = tx;                        pos[vi+1] = ty;                        pos[vi+2] = tz
      pos[vi+3] = tx + star.dir.x * star.length; pos[vi+4] = ty + star.dir.y * star.length; pos[vi+5] = tz

      const r = STREAK_R * brightness
      const g = STREAK_G * brightness
      const b = STREAK_B * brightness
      col[vi]   = r; col[vi+1] = g; col[vi+2] = b
      col[vi+3] = r; col[vi+4] = g; col[vi+5] = b

      if (star.t >= star.travel) { star.active = false }
    })

    posAttr.needsUpdate = true
    colAttr.needsUpdate = true
  })

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial
        vertexColors
        toneMapped={false}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  )
}
