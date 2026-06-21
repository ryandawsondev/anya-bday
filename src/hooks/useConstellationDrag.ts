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
    const startDrag = (x: number, y: number) => {
      if (useConstellationStore.getState().viewMode !== 'galaxy') return
      isDown.current = true
      isDragging.current = false
      startX.current = x
      startY.current = y
      lastX.current = x
      lastY.current = y
      const state = useConstellationStore.getState()
      rotXRef.current = state.constellationRotX
      rotYRef.current = state.constellationRotY
    }

    // Returns true when an actual drag move was applied
    const moveDrag = (x: number, y: number): boolean => {
      if (!isDown.current) return false
      if (!isDragging.current) {
        const dx = Math.abs(x - startX.current)
        const dy = Math.abs(y - startY.current)
        if (dx < DRAG_THRESHOLD && dy < DRAG_THRESHOLD) return false
        isDragging.current = true
      }
      const dx = x - lastX.current
      const dy = y - lastY.current
      lastX.current = x
      lastY.current = y
      rotYRef.current += dx * 0.007
      rotXRef.current = Math.max(-X_CLAMP, Math.min(X_CLAMP, rotXRef.current + dy * 0.007))
      setRotY(rotYRef.current)
      setRotX(rotXRef.current)
      return true
    }

    const endDrag = () => {
      isDown.current = false
      isDragging.current = false
    }

    const onDown = (e: MouseEvent) => { if (e.button !== 0) return; startDrag(e.clientX, e.clientY) }
    const onMove = (e: MouseEvent) => { moveDrag(e.clientX, e.clientY) }
    const onUp   = (e: MouseEvent) => { if (e.button !== 0) return; endDrag() }

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return
      startDrag(e.touches[0].clientX, e.touches[0].clientY)
    }
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return
      const moved = moveDrag(e.touches[0].clientX, e.touches[0].clientY)
      if (moved) e.preventDefault()
    }
    const onTouchEnd = () => endDrag()

    window.addEventListener('mousedown', onDown)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd)
    return () => {
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [setRotX, setRotY])
}
