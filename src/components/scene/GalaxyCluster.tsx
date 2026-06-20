import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Sparkles } from '@react-three/drei'
import { AnimatePresence, motion } from 'motion/react'
import * as THREE from 'three'
import type { Galaxy } from '../../data/galaxies'
import { useConstellationStore } from '../../state/useConstellationStore'

const _scaleTarget = new THREE.Vector3()

interface Props {
  galaxy: Galaxy
}

export default function GalaxyCluster({ galaxy }: Props) {
  const coreRef = useRef<THREE.Mesh>(null)
  const hoveredGalaxyId = useConstellationStore(s => s.hoveredGalaxyId)
  const setHoveredGalaxyId = useConstellationStore(s => s.setHoveredGalaxyId)
  const startWarp = useConstellationStore(s => s.startWarp)

  const isHovered = hoveredGalaxyId === galaxy.id

  const hdrColor = useMemo(() => {
    return new THREE.Color(galaxy.themeColor).multiplyScalar(4)
  }, [galaxy.themeColor])

  useFrame((_, delta) => {
    if (!coreRef.current) return
    _scaleTarget.setScalar(isHovered ? 1.4 : 1.0)
    coreRef.current.scale.lerp(_scaleTarget, 1 - Math.exp(-8 * delta))
  })

  return (
    <group position={galaxy.mapPosition}>
      <Sparkles count={100} scale={4} size={1.5} speed={0.2} color={galaxy.themeColor} opacity={0.7} />

      <mesh ref={coreRef}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshBasicMaterial color={hdrColor} toneMapped={false} />
      </mesh>

      {/* Invisible hit target */}
      <mesh
        onClick={(e) => { e.stopPropagation(); startWarp(galaxy.id) }}
        onPointerEnter={(e) => { e.stopPropagation(); setHoveredGalaxyId(galaxy.id); document.body.style.cursor = 'pointer' }}
        onPointerLeave={() => { setHoveredGalaxyId(null); document.body.style.cursor = '' }}
      >
        <sphereGeometry args={[1.8, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Label anchored 2.5 units above cluster centre — no distanceFactor so pixel size is consistent */}
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
