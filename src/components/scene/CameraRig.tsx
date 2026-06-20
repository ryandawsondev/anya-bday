import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { memories } from '../../data/memories'
import { useConstellationStore } from '../../state/useConstellationStore'

const IDLE_POS = new THREE.Vector3(0, 0, 12)
const _lookTarget = new THREE.Vector3()
const _camTarget = new THREE.Vector3()

export default function CameraRig() {
  const { camera } = useThree()
  const selectedId = useConstellationStore(s => s.selectedId)
  const timeRef = useRef(0)

  useFrame((_, delta) => {
    timeRef.current += delta

    if (selectedId) {
      const memory = memories.find(m => m.id === selectedId)
      if (!memory) return
      _lookTarget.set(...memory.position)
      // Sit 4 units in front of the star (along z)
      _camTarget.set(memory.position[0], memory.position[1], memory.position[2] + 4)
      camera.position.lerp(_camTarget, 0.035)
      camera.lookAt(_lookTarget)
    } else {
      const t = timeRef.current
      IDLE_POS.set(
        Math.sin(t * 0.14) * 0.4,
        Math.cos(t * 0.09) * 0.3,
        12 + Math.sin(t * 0.07) * 0.4,
      )
      camera.position.lerp(IDLE_POS, 0.018)
      camera.lookAt(0, 0, 0)
    }
  })

  return null
}
