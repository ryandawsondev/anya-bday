import { useEffect } from 'react'
import { useConstellationStore } from '../state/useConstellationStore'

const MIN_Z = 4
const MAX_Z = 28

export function useScrollZoom() {
  const setCameraZ = useConstellationStore(s => s.setCameraZ)

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const speed = e.deltaMode === 0 ? 0.01 : 0.5
      const current = useConstellationStore.getState().cameraZ
      setCameraZ(Math.max(MIN_Z, Math.min(MAX_Z, current + e.deltaY * speed)))
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [setCameraZ])
}
