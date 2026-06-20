export interface Memory {
  id: string
  position: [number, number, number]
  title: string
  date?: string
  note: string
  photoSrc: string
}

// Heart shape — 8 stars going clockwise from top-center-dip.
// Scaled to fit mobile portrait (≈5 units wide, ≈4.5 units tall).
// z-variation adds depth so it doesn't look flat.
export const memories: Memory[] = [
  {
    id: '1',
    position: [0, 2.0, 1.2],
    title: 'Memory Title',
    date: 'Date',
    note: 'A note about this memory goes here.',
    photoSrc: '',
  },
  {
    id: '2',
    position: [1.3, 2.8, -1.5],
    title: 'Memory Title',
    date: 'Date',
    note: 'A note about this memory goes here.',
    photoSrc: '',
  },
  {
    id: '3',
    position: [2.5, 1.2, 1.8],
    title: 'Memory Title',
    date: 'Date',
    note: 'A note about this memory goes here.',
    photoSrc: '',
  },
  {
    id: '4',
    position: [1.7, 0, -1.2],
    title: 'Memory Title',
    date: 'Date',
    note: 'A note about this memory goes here.',
    photoSrc: '',
  },
  {
    id: '5',
    position: [0, -1.6, 1.0],
    title: 'Memory Title',
    date: 'Date',
    note: 'A note about this memory goes here.',
    photoSrc: '',
  },
  {
    id: '6',
    position: [-1.7, 0, -1.8],
    title: 'Memory Title',
    date: 'Date',
    note: 'A note about this memory goes here.',
    photoSrc: '',
  },
  {
    id: '7',
    position: [-2.5, 1.2, 0.9],
    title: 'Memory Title',
    date: 'Date',
    note: 'A note about this memory goes here.',
    photoSrc: '',
  },
  {
    id: '8',
    position: [-1.3, 2.8, -1.4],
    title: 'Memory Title',
    date: 'Date',
    note: 'A note about this memory goes here.',
    photoSrc: '',
  },
]

// Indices into memories[] — connected in order to draw the constellation shape.
export const CONSTELLATION_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0],
]
