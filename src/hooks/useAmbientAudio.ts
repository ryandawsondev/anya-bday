import { useRef, useState, useCallback, useEffect } from 'react'

export function useAmbientAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const targetVolRef = useRef(0.35)
  const isMutedRef = useRef(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolState] = useState(0.35)

  useEffect(() => {
    return () => {
      audioRef.current?.pause()
    }
  }, [])

  const play = useCallback(() => {
    // Defer Audio creation until first play — avoids 44MB network request on page load
    if (!audioRef.current) {
      const audio = new Audio(
        import.meta.env.BASE_URL + 'audio/Anya%20Audio.mp4',
      )
      audio.loop = true
      audio.volume = 0
      audioRef.current = audio
    }
    audioRef.current.play().catch(() => {})
    const tick = () => {
      if (!audioRef.current || isMutedRef.current) return
      const next = Math.min(
        audioRef.current.volume + 0.008,
        targetVolRef.current,
      )
      audioRef.current.volume = next
      if (next < targetVolRef.current) setTimeout(tick, 80)
    }
    tick()
  }, [])

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    isMutedRef.current = !isMutedRef.current
    setIsMuted(isMutedRef.current)
    audio.volume = isMutedRef.current ? 0 : targetVolRef.current
  }, [])

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v))
    targetVolRef.current = clamped
    setVolState(clamped)
    if (audioRef.current && !isMutedRef.current) {
      audioRef.current.volume = clamped
    }
  }, [])

  return { play, toggle, isMuted, volume, setVolume }
}
