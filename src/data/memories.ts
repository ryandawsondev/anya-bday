export interface Memory {
  id: string
  position: [number, number, number]
  title: string
  date?: string
  note: string
  photoSrc: string
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
  title: 'Memory',
  date: '',
  note: '',
  photoSrc: '',
}))

export const CONSTELLATION_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
]
