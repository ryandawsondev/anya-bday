import { useEffect, useRef } from 'react'
import { useConstellationStore } from '../state/useConstellationStore'

const MIN_Z = 4
const MAX_Z = 28

export function useScrollZoom() {
  const setCameraZ = useConstellationStore(s => s.setCameraZ)
  const pinchDist = useRef<number | null>(null)

  useEffect(() => {
    const clampedZ = (delta: number) => {
      const current = useConstellationStore.getState().cameraZ
      return Math.max(MIN_Z, Math.min(MAX_Z, current + delta))
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const speed = e.deltaMode === 0 ? 0.01 : 0.5
      setCameraZ(clampedZ(e.deltaY * speed))
    }

    const getDist = (e: TouchEvent) => {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      return Math.sqrt(dx * dx + dy * dy)
    }

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) pinchDist.current = getDist(e)
    }
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 2 || pinchDist.current === null) return
      e.preventDefault()
      const newDist = getDist(e)
      const delta = pinchDist.current - newDist
      pinchDist.current = newDist
      setCameraZ(clampedZ(delta * 0.06))
    }
    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) pinchDist.current = null
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [setCameraZ])
}
