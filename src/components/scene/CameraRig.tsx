import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { galaxies } from '../../data/galaxies'
import { useConstellationStore } from '../../state/useConstellationStore'

const _camTarget   = new THREE.Vector3()
const _lookTarget  = new THREE.Vector3()
const _currentLook = new THREE.Vector3(0, 0, 0)
const _euler       = new THREE.Euler(0, 0, 0, 'XYZ')

const damp = (lambda: number, delta: number) => 1 - Math.exp(-lambda * delta)

export default function CameraRig() {
  const { camera } = useThree()
  const selectedId        = useConstellationStore(s => s.selectedId)
  const currentGalaxyId   = useConstellationStore(s => s.currentGalaxyId)
  const constellationRotX = useConstellationStore(s => s.constellationRotX)
  const constellationRotY = useConstellationStore(s => s.constellationRotY)
  const cameraZ           = useConstellationStore(s => s.cameraZ)
  const timeRef = useRef(0)

  useFrame((_, delta) => {
    timeRef.current += delta

    if (selectedId) {
      const galaxy = galaxies.find(g => g.id === currentGalaxyId)
      const memory = galaxy?.memories.find(m => m.id === selectedId)
      if (!memory) return

      _euler.set(constellationRotX, constellationRotY, 0)
      _lookTarget.set(...memory.position).applyEuler(_euler)
      _camTarget.copy(_lookTarget)
      _camTarget.z += 5

      camera.position.lerp(_camTarget, damp(3.5, delta))
      _currentLook.lerp(_lookTarget, damp(4, delta))
    } else {
      const t = timeRef.current
      _camTarget.set(
        Math.sin(t * 0.14) * 0.4,
        Math.cos(t * 0.09) * 0.3,
        cameraZ + Math.sin(t * 0.07) * 0.4,
      )
      camera.position.lerp(_camTarget, damp(1.5, delta))

      _lookTarget.set(0, 0, 0)
      _currentLook.lerp(_lookTarget, damp(2, delta))
    }

    camera.lookAt(_currentLook)
  })

  return null
}
