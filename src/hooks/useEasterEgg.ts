import { useEffect, useState } from 'react'

const TARGET = 'anya'

export function useEasterEgg() {
  const [triggered, setTriggered] = useState(false)

  useEffect(() => {
    let buffer = ''
    const onKey = (e: KeyboardEvent) => {
      buffer = (buffer + e.key.toLowerCase()).slice(-TARGET.length)
      if (buffer === TARGET) {
        setTriggered(true)
        buffer = ''
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return { triggered, dismiss: () => setTriggered(false) }
}
