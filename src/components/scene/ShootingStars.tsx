import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const POOL_SIZE = 6
const STREAK_COLOR = new THREE.Color(2.5, 3.0, 4.5)

interface Star {
  line: THREE.Line
  active: boolean
  t: number
  speed: number
  start: THREE.Vector3
  dir: THREE.Vector3
  length: number
  travel: number
}

export default function ShootingStars() {
  const groupRef = useRef<THREE.Group>(null)
  const pool = useRef<Star[]>([])
  const spawnTimer = useRef(0)
  const nextSpawn = useRef(1.5 + Math.random() * 2)

  useEffect(() => {
    const group = groupRef.current
    if (!group) return

    for (let i = 0; i < POOL_SIZE; i++) {
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3))
      const mat = new THREE.LineBasicMaterial({
        color: STREAK_COLOR,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      })
      const line = new THREE.Line(geo, mat)
      group.add(line)
      pool.current.push({ line, active: false, t: 0, speed: 0, start: new THREE.Vector3(), dir: new THREE.Vector3(), length: 0, travel: 0 })
    }

    return () => {
      pool.current.forEach(s => {
        s.line.geometry.dispose()
        ;(s.line.material as THREE.Material).dispose()
      })
      pool.current = []
    }
  }, [])

  useFrame((_, delta) => {
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

    pool.current.forEach(star => {
      const mat = star.line.material as THREE.LineBasicMaterial
      if (!star.active) { mat.opacity = 0; return }

      star.t += delta * star.speed
      const progress = star.t / star.travel
      const fade = progress < 0.12 ? progress / 0.12 : progress > 0.82 ? (1 - progress) / 0.18 : 1
      mat.opacity = Math.max(0, fade * 0.55)

      const tx = star.start.x + star.dir.x * star.t
      const ty = star.start.y + star.dir.y * star.t
      const tz = star.start.z
      const hx = tx + star.dir.x * star.length
      const hy = ty + star.dir.y * star.length

      const pos = star.line.geometry.attributes.position.array as Float32Array
      pos[0] = tx; pos[1] = ty; pos[2] = tz
      pos[3] = hx; pos[4] = hy; pos[5] = tz
      star.line.geometry.attributes.position.needsUpdate = true

      if (star.t >= star.travel) {
        star.active = false
        mat.opacity = 0
      }
    })
  })

  return <group ref={groupRef} />
}
