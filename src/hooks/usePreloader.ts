import { useState, useEffect } from 'react'
import { galaxies } from '../data/galaxies'

function collectImageUrls(): string[] {
  const urls: string[] = []
  for (const galaxy of galaxies) {
    for (const memory of galaxy.memories) {
      for (const url of memory.photos) {
        if (!url.includes('/video/upload/')) {
          urls.push(url)
        }
      }
    }
  }
  return urls
}

export function usePreloader() {
  const [loaded, setLoaded] = useState(0)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const urls = collectImageUrls()
    setTotal(urls.length)
    if (urls.length === 0) return

    for (const url of urls) {
      const img = new window.Image()
      const onDone = () => setLoaded(prev => prev + 1)
      img.onload = onDone
      img.onerror = onDone
      img.src = url
    }
  }, [])

  const progress = total === 0 ? 1 : loaded / total
  const done = total === 0 || loaded >= total

  return { progress, done }
}
