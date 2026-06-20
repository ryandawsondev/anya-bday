export interface Memory {
  id: string
  position: [number, number, number]
  title: string
  date?: string
  note: string
  photos: string[]
}

const positions: [number, number, number][] = [
  [-2.5,  0.4, -0.3],
  [-1.2, -0.8,  0.4],
  [ 0.0,  0.9,  0.1],
  [ 1.2, -0.8, -0.2],
  [ 2.5,  0.4,  0.3],
]

export const memories: Memory[] = positions.map(([x, y, z], i) => ({
  id: String(i + 1),
  position: [x, y, z],
  title: i === 0 ? 'Test Memory' : 'Memory',
  date: i === 0 ? 'June 30, 2024' : '',
  note: i === 0 ? 'This is a test note so you can see the typewriter effect working. Each character types out one by one when you open a memory.' : '',
  photos: i === 0 ? ['https://picsum.photos/seed/anya/460/260'] : [],
}))

export const CONSTELLATION_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
]
