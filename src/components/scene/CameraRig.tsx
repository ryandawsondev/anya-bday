import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { memories } from '../../data/memories'
import { useConstellationStore } from '../../state/useConstellationStore'

// Reusable vectors — avoid per-frame allocations
const _camTarget = new THREE.Vector3()
const _lookTarget = new THREE.Vector3()
// Smoothed look-at point so direction never snaps
const _currentLook = new THREE.Vector3(0, 0, 0)

// Frame-rate independent exponential decay
const damp = (alpha: number, delta: number) => 1 - Math.exp(-alpha * delta)

export default function CameraRig() {
  const { camera } = useThree()
  const selectedId = useConstellationStore(s => s.selectedId)
  const timeRef = useRef(0)

  useFrame((_, delta) => {
    timeRef.current += delta
    const t = timeRef.current

    if (selectedId) {
      const memory = memories.find(m => m.id === selectedId)
      if (!memory) return

      _lookTarget.set(...memory.position)
      // Stay 5 units in front of the star
      _camTarget.set(memory.position[0], memory.position[1], memory.position[2] + 5)

      camera.position.lerp(_camTarget, damp(3.5, delta))
      _currentLook.lerp(_lookTarget, damp(4, delta))
    } else {
      // Idle gentle drift
      _camTarget.set(
        Math.sin(t * 0.14) * 0.4,
        Math.cos(t * 0.09) * 0.3,
        12 + Math.sin(t * 0.07) * 0.4,
      )
      camera.position.lerp(_camTarget, damp(1.5, delta))

      // Smooth look-at return to origin
      _lookTarget.set(0, 0, 0)
      _currentLook.lerp(_lookTarget, damp(2, delta))
    }

    camera.lookAt(_currentLook)
  })

  return null
}
