import { useEffect, useRef } from 'react'
import { useConstellationStore } from '../state/useConstellationStore'

const X_CLAMP = Math.PI * 0.45
const DRAG_THRESHOLD = 4

export function useConstellationDrag() {
  const setRotY = useConstellationStore(s => s.setConstellationRotY)
  const setRotX = useConstellationStore(s => s.setConstellationRotX)
  const rotXRef = useRef(0)
  const rotYRef = useRef(0)
  const isDown = useRef(false)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const startY = useRef(0)
  const lastX = useRef(0)
  const lastY = useRef(0)

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (e.button !== 0) return
      isDown.current = true
      isDragging.current = false
      startX.current = e.clientX
      startY.current = e.clientY
      lastX.current = e.clientX
      lastY.current = e.clientY
    }
    const onMove = (e: MouseEvent) => {
      if (!isDown.current) return
      if (!isDragging.current) {
        const dx = Math.abs(e.clientX - startX.current)
        const dy = Math.abs(e.clientY - startY.current)
        if (dx < DRAG_THRESHOLD && dy < DRAG_THRESHOLD) return
        isDragging.current = true
      }
      const dx = e.clientX - lastX.current
      const dy = e.clientY - lastY.current
      lastX.current = e.clientX
      lastY.current = e.clientY
      rotYRef.current += dx * 0.007
      rotXRef.current = Math.max(-X_CLAMP, Math.min(X_CLAMP, rotXRef.current + dy * 0.007))
      setRotY(rotYRef.current)
      setRotX(rotXRef.current)
    }
    const onUp = (e: MouseEvent) => {
      if (e.button !== 0) return
      isDown.current = false
      isDragging.current = false
    }

    window.addEventListener('mousedown', onDown)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [setRotX, setRotY])
}
