export interface Memory {
  id: string
  position: [number, number, number]
  title: string
  date?: string
  note: string
  photoSrc: string
}

// ─── digit builder ───────────────────────────────────────────────────────────

type PtName = 'TL' | 'TR' | 'ML' | 'MR' | 'BL' | 'BR'

const HW = 0.8  // half cell width
const HH = 1.4  // half cell height

function corner(name: PtName, cx: number): [number, number] {
  switch (name) {
    case 'TL': return [cx - HW,  HH]
    case 'TR': return [cx + HW,  HH]
    case 'ML': return [cx - HW,   0]
    case 'MR': return [cx + HW,   0]
    case 'BL': return [cx - HW, -HH]
    default:   return [cx + HW, -HH]  // BR
  }
}

// Each digit: points in emission order, segments as name-pairs
const DIGITS: Record<string, { pts: PtName[]; segs: [PtName, PtName][] }> = {
  '0': {
    pts:  ['TL', 'TR', 'BL', 'BR'],
    segs: [['TL','TR'], ['TR','BR'], ['BR','BL'], ['BL','TL']],
  },
  '2': {
    pts:  ['TL', 'TR', 'MR', 'ML', 'BL', 'BR'],
    segs: [['TL','TR'], ['TR','MR'], ['MR','ML'], ['ML','BL'], ['BL','BR']],
  },
  '3': {
    pts:  ['TL', 'TR', 'MR', 'ML', 'BR', 'BL'],
    segs: [['TL','TR'], ['TR','MR'], ['MR','ML'], ['MR','BR'], ['BR','BL']],
  },
  '4': {
    pts:  ['TL', 'ML', 'TR', 'MR', 'BR'],
    segs: [['TL','ML'], ['ML','MR'], ['TR','MR'], ['MR','BR']],
  },
  '6': {
    pts:  ['TL', 'TR', 'ML', 'MR', 'BL', 'BR'],
    segs: [['TL','TR'], ['TL','ML'], ['ML','MR'], ['ML','BL'], ['BL','BR'], ['BR','MR']],
  },
}

// Character centres for "30 06 24"
// Within-group step: 2*HW + 0.9 = 2.5; Between-group step: 2*HW + 3.0 = 4.6
// Symmetric layout → edges at ±9.15, camera fov=75 at z=12 sees ±9.21 (fits)
const LAYOUT: Array<[string, number]> = [
  ['3', -8.35], ['0', -5.85],
  ['0', -1.25], ['6',  1.25],
  ['2',  5.85], ['4',  8.35],
]

// z-depths (one per star, 31 total) — varied for 3D interest when rotating
const STAR_Z = [
   0.5, -0.6,  0.8, -0.4,  0.6, -0.8,   // "3"
   0.4, -0.7,  0.7, -0.5,                // first "0"
  -0.4,  0.7, -0.6,  0.5,               // second "0"
   0.3, -0.8, -0.5,  0.6,  0.7, -0.4,   // "6"
  -0.6,  0.4, -0.7,  0.5, -0.3,  0.8,   // "2"
   0.7, -0.5, -0.6,  0.4,  0.3,         // "4"
]

function buildConst() {
  const positions: [number, number, number][] = []
  const connections: [number, number][] = []

  for (const [digit, cx] of LAYOUT) {
    const { pts, segs } = DIGITS[digit]
    const base = positions.length
    const idx = new Map<PtName, number>()

    pts.forEach((name, i) => {
      idx.set(name, base + i)
      const [x, y] = corner(name, cx)
      positions.push([x, y, STAR_Z[base + i]])
    })

    for (const [a, b] of segs) {
      connections.push([idx.get(a)!, idx.get(b)!])
    }
  }

  return { positions, connections }
}

const { positions, connections } = buildConst()

export const memories: Memory[] = positions.map(([x, y, z], i) => ({
  id: String(i + 1),
  position: [x, y, z] as [number, number, number],
  title: 'Memory',
  date: '',
  note: '',
  photoSrc: '',
}))

export const CONSTELLATION_CONNECTIONS: [number, number][] = connections
