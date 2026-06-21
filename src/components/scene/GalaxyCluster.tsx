import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Sparkles } from '@react-three/drei'
import { AnimatePresence, motion } from 'motion/react'
import * as THREE from 'three'
import type { Galaxy } from '../../data/galaxies'
import { useConstellationStore } from '../../state/useConstellationStore'
import { playWarpStart } from '../../audio/soundEffects'

const _scaleTarget = new THREE.Vector3()
const LOCKED_COLOR = new THREE.Color(0.08, 0.09, 0.14)

interface Props {
  galaxy: Galaxy
  isLocked?: boolean
}

export default function GalaxyCluster({ galaxy, isLocked }: Props) {
  const coreRef = useRef<THREE.Mesh>(null)
  const hoveredGalaxyId = useConstellationStore(s => s.hoveredGalaxyId)
  const visitedIds = useConstellationStore(s => s.visitedIds)
  const setHoveredGalaxyId = useConstellationStore(s => s.setHoveredGalaxyId)
  const startWarp = useConstellationStore(s => s.startWarp)

  const isHovered = hoveredGalaxyId === galaxy.id
  const isComplete = galaxy.memories.length > 0 && galaxy.memories.every(m => visitedIds.includes(m.id))

  const hdrColor = useMemo(() => {
    return new THREE.Color(galaxy.themeColor).multiplyScalar(4)
  }, [galaxy.themeColor])

  const hdrColorComplete = useMemo(() => {
    return new THREE.Color(galaxy.themeColor).multiplyScalar(7)
  }, [galaxy.themeColor])

  useFrame(({ clock }, delta) => {
    if (!coreRef.current) return
    if (isLocked) {
      const pulse = 1 + Math.sin(clock.getElapsedTime() * 0.7) * 0.08
      coreRef.current.scale.setScalar(pulse)
      ;(coreRef.current.material as THREE.MeshBasicMaterial).color.copy(LOCKED_COLOR)
      return
    }
    const pulse = isComplete ? 1.0 + Math.sin(clock.getElapsedTime() * 2.2) * 0.18 : 1.0
    const baseScale = isComplete ? 1.15 * pulse : 1.0
    _scaleTarget.setScalar(isHovered ? 1.4 : baseScale)
    coreRef.current.scale.lerp(_scaleTarget, 1 - Math.exp(-8 * delta))
    ;(coreRef.current.material as THREE.MeshBasicMaterial).color.copy(isComplete ? hdrColorComplete : hdrColor)
  })

  if (isLocked) {
    return (
      <group position={galaxy.mapPosition}>
        <Sparkles count={18} scale={3} size={0.7} speed={0.08} color="#334" opacity={0.2} />
        <mesh ref={coreRef}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshBasicMaterial color={LOCKED_COLOR} toneMapped={false} />
        </mesh>
        <group position={[0, 2.0, 0]}>
          <Html center style={{ pointerEvents: 'none' }}>
            <div style={{
              textAlign: 'center',
              color: 'rgba(255,255,255,0.18)',
              fontFamily: 'Georgia, serif',
              userSelect: 'none',
              whiteSpace: 'nowrap',
              letterSpacing: '0.35em',
              fontSize: '20px',
            }}>
              ???
            </div>
          </Html>
        </group>
      </group>
    )
  }

  return (
    <group position={galaxy.mapPosition}>
      <Sparkles count={55} scale={4} size={1.5} speed={0.2} color={galaxy.themeColor} opacity={0.7} />

      <mesh ref={coreRef}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshBasicMaterial color={hdrColor} toneMapped={false} />
      </mesh>

      {/* Invisible hit target */}
      <mesh
        onClick={(e) => { e.stopPropagation(); playWarpStart(); startWarp(galaxy.id) }}
        onPointerEnter={(e) => { e.stopPropagation(); setHoveredGalaxyId(galaxy.id); document.body.style.cursor = 'pointer' }}
        onPointerLeave={() => { setHoveredGalaxyId(null); document.body.style.cursor = '' }}
      >
        <sphereGeometry args={[1.8, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <group position={[0, 2.5, 0]}>
        <Html center style={{ pointerEvents: 'none' }}>
          <AnimatePresence>
            {isHovered && (
              <motion.div
                key="label"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                style={{
                  textAlign: 'center',
                  color: '#fff',
                  textShadow: `0 0 18px ${galaxy.themeColor}, 0 0 50px ${galaxy.themeColor}70`,
                  fontFamily: 'Georgia, serif',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                }}
              >
                <div style={{ fontSize: '26px', letterSpacing: '0.2em', marginBottom: '7px', fontWeight: 400 }}>
                  {galaxy.name}
                </div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.62)', letterSpacing: '0.12em' }}>
                  {galaxy.description}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Html>
      </group>
    </group>
  )
}
