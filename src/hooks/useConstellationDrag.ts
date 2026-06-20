import { useEffect, useRef } from 'react'
import { useConstellationStore } from '../state/useConstellationStore'

export function useConstellationDrag() {
  const setRotY = useConstellationStore(s => s.setConstellationRotY)
  const rotRef = useRef(0)
  const isDragging = useRef(false)
  const lastX = useRef(0)

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (e.button === 2) {
        isDragging.current = true
        lastX.current = e.clientX
      }
    }
    const onMove = (e: MouseEvent) => {
      if (!isDragging.current) return
      const dx = e.clientX - lastX.current
      lastX.current = e.clientX
      rotRef.current += dx * 0.007
      setRotY(rotRef.current)
    }
    const onUp = (e: MouseEvent) => {
      if (e.button === 2) isDragging.current = false
    }
    const suppressContext = (e: Event) => e.preventDefault()

    window.addEventListener('mousedown', onDown)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('contextmenu', suppressContext)
    return () => {
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('contextmenu', suppressContext)
    }
  }, [setRotY])
}
