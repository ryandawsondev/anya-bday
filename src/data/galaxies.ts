import { memories as dateMemories, CONSTELLATION_CONNECTIONS as dateConnections } from './memories'
import type { Memory } from './memories'

export type { Memory }

export interface Galaxy {
  id: string
  name: string
  description: string
  themeColor: string
  mapPosition: [number, number, number]
  memories: Memory[]
  connections: [number, number][]
}

function placeholder(id: string, position: [number, number, number]): Memory {
  return { id, position, title: 'Memory', date: '', note: '', photos: [] }
}

// Adventures — compass rose
const adventurePositions: [number, number, number][] = [
  [ 0,    2.5,  0.2],
  [ 1.8,  1.8, -0.3],
  [ 2.5,  0,    0.4],
  [ 1.8, -1.8,  0.1],
  [ 0,   -2.5, -0.2],
  [-1.8, -1.8,  0.3],
  [-2.5,  0,   -0.1],
  [-1.8,  1.8,  0.2],
]
const adventureConnections: [number, number][] = [
  [0, 4], [2, 6], [1, 5], [3, 7],
]

// Everyday Magic — flowing wave
const everydayPositions: [number, number, number][] = [
  [-2.5,  0.5,  0.3],
  [-1.2,  1.8, -0.2],
  [ 0,    0.2,  0.4],
  [ 1.2,  1.8, -0.3],
  [ 2.5,  0.5,  0.2],
  [ 0,   -1.5,  0],
]
const everydayConnections: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [2, 5],
]

// Just Us — heart
const heartPositions: [number, number, number][] = [
  [ 0,    1.5,  0   ],
  [ 1.0,  2.3,  0.3 ],
  [ 2.0,  1.2, -0.2 ],
  [ 1.5, -0.5,  0.4 ],
  [ 0,   -2.2,  0   ],
  [-1.5, -0.5, -0.3 ],
  [-2.0,  1.2,  0.2 ],
  [-1.0,  2.3, -0.3 ],
]
const heartConnections: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [4, 5], [5, 6], [6, 7], [7, 0],
]

export const galaxies: Galaxy[] = [
  {
    id: 'the-date',
    name: '30 · 06 · 24',
    description: 'The day everything changed',
    themeColor: '#f5c842',
    mapPosition: [-6, 3, 0],
    memories: dateMemories,
    connections: dateConnections,
  },
  {
    id: 'adventures',
    name: 'Adventures',
    description: 'Every place we explored together',
    themeColor: '#a855f7',
    mapPosition: [7, 4, -2],
    memories: adventurePositions.map((pos, i) => placeholder(`adv-${i + 1}`, pos)),
    connections: adventureConnections,
  },
  {
    id: 'everyday-magic',
    name: 'Everyday Magic',
    description: 'The small moments that meant everything',
    themeColor: '#22d3ee',
    mapPosition: [-5, -5, 1],
    memories: everydayPositions.map((pos, i) => placeholder(`day-${i + 1}`, pos)),
    connections: everydayConnections,
  },
  {
    id: 'just-us',
    name: 'Just Us',
    description: 'You and me',
    themeColor: '#f472b6',
    mapPosition: [6, -4, -1],
    memories: heartPositions.map((pos, i) => placeholder(`us-${i + 1}`, pos)),
    connections: heartConnections,
  },
]
