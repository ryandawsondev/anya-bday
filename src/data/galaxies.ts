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
  hidden?: boolean
}

function img(url: string): string {
  return url.replace('/image/upload/', '/image/upload/f_auto,q_auto/')
}

// ─── Vienna I — Aug 2024 ─────────────────────────────────────────────────────

const vienna1Positions: [number, number, number][] = [
  [0, 2.2, 0],
  [-2, 0, 0.2],
  [0, -2.2, 0.1],
  [2, 0, -0.2],
]

const vienna1Connections: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
]

const vienna1Memories: Memory[] = [
  {
    id: 'v1-1',
    position: vienna1Positions[0],
    title: 'Our first video',
    date: 'August 24, 2024',
    note: 'Still remember this like it was yesterday',
    photos: [
      'https://res.cloudinary.com/df9cka4lv/video/upload/v1782336402/anya-bday/IMG_0502.mov',
    ],
  },
  {
    id: 'v1-2',
    position: vienna1Positions[1],
    title: 'Our day at the zoo',
    date: 'August 25, 2024',
    note: 'This is the day i remember the most. Sitting down by the Donau river and talking to you was one of my favourite moments',
    photos: [
      img(
        'https://res.cloudinary.com/df9cka4lv/image/upload/v1782336370/anya-bday/IMG_0522.heic',
      ),
      img(
        'https://res.cloudinary.com/df9cka4lv/image/upload/v1782336371/anya-bday/IMG_0551.heic',
      ),
      img(
        'https://res.cloudinary.com/df9cka4lv/image/upload/v1782336372/anya-bday/IMG_0565.heic',
      ),
    ],
  },
  {
    id: 'v1-3',
    position: vienna1Positions[2],
    title: 'My terrible speaking skills',
    date: 'August 27, 2024',
    note: 'At least i was trying!',
    photos: [
      'https://res.cloudinary.com/df9cka4lv/video/upload/v1782336653/anya-bday/IMG_0581.mp4',
      'https://res.cloudinary.com/df9cka4lv/video/upload/v1782336424/anya-bday/IMG_0583.mov',
    ],
  },
  {
    id: 'v1-4',
    position: vienna1Positions[3],
    title: 'A special moment',
    date: 'August 28, 2024',
    note: 'What a cinematic kiss! Also i loved those juices that we got together.',
    photos: [
      img(
        'https://res.cloudinary.com/df9cka4lv/image/upload/v1782336373/anya-bday/IMG_0586.heic',
      ),
      img(
        'https://res.cloudinary.com/df9cka4lv/image/upload/v1782336374/anya-bday/IMG_0625.heic',
      ),
    ],
  },
]

// ─── Vienna & Salzburg — Dec 2024–Jan 2025 ───────────────────────────────────

const viennaSalzburgPositions: [number, number, number][] = [
  [-2.5, 1.5, 0.2],
  [-1.5, 2.5, -0.1],
  [-0.3, 1.5, 0.3],
  [1.0, 2.3, -0.2],
  [2.2, 1.0, 0.1],
  [2.5, -0.5, 0.3],
  [1.2, -2.0, -0.1],
  [-0.5, -2.2, 0.2],
]

const viennaSalzburgConnections: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 7],
]

const viennaSalzburgMemories: Memory[] = [
  {
    id: 'vs-1',
    position: viennaSalzburgPositions[0],
    title: 'Our journey from the airport',
    date: 'December 26, 2024',
    note: 'I loved laying on you while we continued our journey on the train. You are so special.',
    photos: [
      'https://res.cloudinary.com/df9cka4lv/video/upload/v1782336447/anya-bday/IMG_2692.mov',
    ],
  },
  {
    id: 'vs-2',
    position: viennaSalzburgPositions[1],
    title: 'Spicy',
    date: 'December 27, 2024',
    note: 'Remember that spicy photo we created together?',
    photos: [
      img(
        'https://res.cloudinary.com/df9cka4lv/image/upload/v1782336378/anya-bday/IMG_2698.heic',
      ),
      img(
        'https://res.cloudinary.com/df9cka4lv/image/upload/v1782336379/anya-bday/IMG_2732.heic',
      ),
    ],
  },
  {
    id: 'vs-3',
    position: viennaSalzburgPositions[2],
    title: 'Unfortunate yet special',
    date: 'December 28, 2024',
    note: 'Absolutely loved going here even though we couldnt get in! The malt wine was good though. What an eventful day that was',
    photos: [
      img(
        'https://res.cloudinary.com/df9cka4lv/image/upload/v1782336375/anya-bday/IMG_2141.heic',
      ),
      img(
        'https://res.cloudinary.com/df9cka4lv/image/upload/v1782336376/anya-bday/IMG_2244.heic',
      ),
      'https://res.cloudinary.com/df9cka4lv/video/upload/v1782336451/anya-bday/IMG_2749.mov',
      img(
        'https://res.cloudinary.com/df9cka4lv/image/upload/v1782336380/anya-bday/IMG_2763.heic',
      ),
      'https://res.cloudinary.com/df9cka4lv/video/upload/v1782336456/anya-bday/IMG_2802.mov',
      'https://res.cloudinary.com/df9cka4lv/video/upload/v1782336685/anya-bday/IMG_2111.mp4',
      img(
        'https://res.cloudinary.com/df9cka4lv/image/upload/v1782336381/anya-bday/IMG_2812.heic',
      ),
      img(
        'https://res.cloudinary.com/df9cka4lv/image/upload/v1782336382/anya-bday/IMG_2813.heic',
      ),
      'https://res.cloudinary.com/df9cka4lv/video/upload/v1782336460/anya-bday/IMG_2817.mov',
    ],
  },
  {
    id: 'vs-4',
    position: viennaSalzburgPositions[3],
    title: 'Lustful Kiss & Lego',
    date: 'December 29, 2024',
    note: 'Absolutely love kissing you. So sexy us together! Also that lego set was so fun to make with you.',
    photos: [
      img(
        'https://res.cloudinary.com/df9cka4lv/image/upload/v1782336377/anya-bday/IMG_2291.heic',
      ),
      'https://res.cloudinary.com/df9cka4lv/video/upload/v1782336443/anya-bday/IMG_2292.mov',
      'https://res.cloudinary.com/df9cka4lv/video/upload/v1782336733/anya-bday/IMG_2978.mp4',
    ],
  },
  {
    id: 'vs-5',
    position: viennaSalzburgPositions[4],
    title: 'Playful day in Salzburg',
    date: 'December 30, 2024',
    note: 'I love being playful with you darling',
    photos: [
      'https://res.cloudinary.com/df9cka4lv/video/upload/v1782336478/anya-bday/IMG_2983.mov',
    ],
  },
  {
    id: 'vs-6',
    position: viennaSalzburgPositions[5],
    title: 'Sleepy Ryan',
    date: 'December 31, 2024',
    note: 'Ingore the double chin from me haha',
    photos: [
      'https://res.cloudinary.com/df9cka4lv/video/upload/v1782336763/anya-bday/IMG_3026.mp4',
    ],
  },
  {
    id: 'vs-7',
    position: viennaSalzburgPositions[6],
    title: 'Day before my bday',
    date: 'January 3, 2025',
    note: '"my sexy boy" - anya 2025',
    photos: [
      'https://res.cloudinary.com/df9cka4lv/video/upload/v1782336801/anya-bday/IMG_3055.mp4',
    ],
  },
  {
    id: 'vs-8',
    position: viennaSalzburgPositions[7],
    title: 'My Bday! (Our thermes experience)',
    date: 'January 4, 2025',
    note: 'I loved seeing you in a bikini and for us to spend a lovely time together in the hot water :)',
    photos: [
      'https://res.cloudinary.com/df9cka4lv/video/upload/v1782336510/anya-bday/IMG_3062.mov',
      img(
        'https://res.cloudinary.com/df9cka4lv/image/upload/v1782336383/anya-bday/IMG_3063.heic',
      ),
    ],
  },
]

// ─── Budapest — Jun 2025 ─────────────────────────────────────────────────────

const budapestPositions: [number, number, number][] = [
  [0, 2.2, 0.1],
  [-2, -0.5, -0.2],
  [2, -0.5, 0.3],
  [0, -2.2, 0],
]

const budapestConnections: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
]

const budapestMemories: Memory[] = [
  {
    id: 'bp-1',
    position: budapestPositions[0],
    title: 'Our Journey to Budapest',
    date: 'June 4, 2025',
    note: 'I remember me putting my hand on your thigh. Just love sitting next to you sweetie.',
    photos: [
      img(
        'https://res.cloudinary.com/df9cka4lv/image/upload/v1782336384/anya-bday/IMG_4454.heic',
      ),
      img(
        'https://res.cloudinary.com/df9cka4lv/image/upload/v1782336367/anya-bday/6027d932-de9b-4f36-a23e-ffed0c0dc81b.jpg',
      ),
      'https://res.cloudinary.com/df9cka4lv/video/upload/v1782336512/anya-bday/IMG_4459.mov',
    ],
  },
  {
    id: 'bp-2',
    position: budapestPositions[1],
    title: 'Remember this meal?',
    date: 'June 5, 2025',
    note: 'Sharing like we always do!',
    photos: [
      img(
        'https://res.cloudinary.com/df9cka4lv/image/upload/v1782336385/anya-bday/IMG_4484.heic',
      ),
      img(
        'https://res.cloudinary.com/df9cka4lv/image/upload/v1782336368/anya-bday/80248803-b520-4b5c-9e1b-af153c851272.jpg',
      ),
    ],
  },
  {
    id: 'bp-3',
    position: budapestPositions[2],
    title: 'Kisses on the couch',
    date: 'June 6, 2025',
    note: 'Remember all of the youtube videos we watched!',
    photos: [
      img(
        'https://res.cloudinary.com/df9cka4lv/image/upload/v1782336387/anya-bday/IMG_4500.heic',
      ),
      img(
        'https://res.cloudinary.com/df9cka4lv/image/upload/v1782336369/anya-bday/c72df97a-4b5e-4e2b-acd7-d79e1641b173.jpg',
      ),
      'https://res.cloudinary.com/df9cka4lv/video/upload/v1782336517/anya-bday/IMG_4517.mov',
      'https://res.cloudinary.com/df9cka4lv/video/upload/v1782336393/anya-bday/5c5961e4-16ba-4880-8ac3-9393d25fef98.mp4',
    ],
  },
  {
    id: 'bp-4',
    position: budapestPositions[3],
    title: 'Choir experience',
    date: 'June 13, 2025',
    note: 'Loved listening to all of the cool classical music with you. Especially since it reminds me how much i love you x',
    photos: [
      'https://res.cloudinary.com/df9cka4lv/video/upload/v1782336526/anya-bday/IMG_4735.mov',
      'https://res.cloudinary.com/df9cka4lv/video/upload/v1782336395/anya-bday/6cb17df0-405a-43dc-80f7-03bf87073871.mp4',
    ],
  },
]

// ─── Scotland — Nov 2025 + Feb 2026 ─────────────────────────────────────────

const scotlandPositions: [number, number, number][] = [
  [-2, 1.5, 0.2],
  [-0.5, 2.5, -0.1],
  [1.5, 1.5, 0.3],
  [1, -0.8, -0.2],
  [-1, -1.8, 0.1],
]

const scotlandConnections: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 0],
]

const scotlandMemories: Memory[] = [
  {
    id: 'sc-1',
    position: scotlandPositions[0],
    title: 'Huge kiss!',
    date: 'November 11, 2025',
    note: 'Actually dont remember why we filmed this haha',
    photos: [
      'https://res.cloudinary.com/df9cka4lv/video/upload/v1782336394/anya-bday/61B77EAA-6889-403F-ABBE-7A4DA3B2E051.mp4',
    ],
  },
  {
    id: 'sc-2',
    position: scotlandPositions[1],
    title: 'London Park',
    date: 'February 14, 2026',
    note: 'Remember those huge Pelicans!',
    photos: [
      img(
        'https://res.cloudinary.com/df9cka4lv/image/upload/v1782336390/anya-bday/IMG_7649.heic',
      ),
      img(
        'https://res.cloudinary.com/df9cka4lv/image/upload/v1782336389/anya-bday/IMG_6899.jpg',
      ),
      'https://res.cloudinary.com/df9cka4lv/video/upload/v1782336397/anya-bday/c99197d1-dfb8-4b97-a0d8-6075bff10860.mp4',
    ],
  },
  {
    id: 'sc-3',
    position: scotlandPositions[2],
    title: 'The Couch Experience',
    date: 'February 18, 2026',
    note: 'Love cuddling up next to you. Hopefully we will be able to now and forever!',
    photos: [
      'https://res.cloudinary.com/df9cka4lv/video/upload/v1782336529/anya-bday/IMG_7684.mov',
      img(
        'https://res.cloudinary.com/df9cka4lv/image/upload/v1782336391/anya-bday/IMG_7689.heic',
      ),
    ],
  },
  {
    id: 'sc-4',
    position: scotlandPositions[3],
    title: 'Anyas Sick Pool Shots',
    date: 'February 21, 2026',
    note: 'Remember when i filmed you get one in? You were awesome!',
    photos: [
      'https://res.cloudinary.com/df9cka4lv/video/upload/v1782336532/anya-bday/IMG_7707.mov',
    ],
  },
  {
    id: 'sc-5',
    position: scotlandPositions[4],
    title: 'Favourite Photo',
    date: 'February 28, 2026',
    note: 'This is by far my favourite but also slightly disturbing photo haha',
    photos: [
      img(
        'https://res.cloudinary.com/df9cka4lv/image/upload/v1782336392/anya-bday/IMG_7751.png',
      ),
    ],
  },
]

// ─── Secret — Always ─────────────────────────────────────────────────────────

const secretPositions: [number, number, number][] = [
  [0, 2.2, 0],
  [2.1, 0.7, 0.2],
  [1.3, -1.8, -0.1],
  [-1.3, -1.8, 0.3],
]

const secretConnections: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
]

const secretMemories: Memory[] = [
  {
    id: 'secret-blessings',
    position: secretPositions[0],
    title: 'The video you have been waiting for',
    date: 'June 21, 2026',
    note: 'Yes I did remember!',
    photos: [
      img(
        'https://res.cloudinary.com/df9cka4lv/image/upload/v1782337299/anya-bday/Blessings236895.jpg',
      ),
      'https://res.cloudinary.com/df9cka4lv/video/upload/v1782337301/anya-bday/Blessings236895.mp4',
    ],
  },
  {
    id: 'secret-flowers',
    position: secretPositions[1],
    title: 'Watch out for 9am!',
    date: 'June 25, 2026',
    note: 'I made sure to get you ones that fitted your preferences!',
    photos: [
      img(
        'https://res.cloudinary.com/df9cka4lv/image/upload/v1782347121/anya-bday/flowers.jpg',
      ),
    ],
  },
  {
    id: 'secret-gift-1',
    position: secretPositions[2],
    title: 'F1 Car!',
    date: 'June 25, 2026',
    note: 'Well, i know you love this!',
    photos: [
      img(
        'https://res.cloudinary.com/df9cka4lv/image/upload/v1782347120/anya-bday/f1-car.png',
      ),
    ],
  },
  {
    id: 'secret-gift-2',
    position: secretPositions[3],
    title: 'The Way Forward',
    date: 'June 25, 2026',
    note: "You've been asking for this book for a while now. Thought it was about time!",
    photos: [
      img(
        'https://res.cloudinary.com/df9cka4lv/image/upload/v1782347123/anya-bday/way-forward.jpg',
      ),
    ],
  },
]

export const galaxies: Galaxy[] = [
  {
    id: 'vienna-1',
    name: 'Vienna I',
    description: 'Our first of many visits',
    themeColor: '#f5a623',
    mapPosition: [-6, 3, 0],
    memories: vienna1Memories,
    connections: vienna1Connections,
  },
  {
    id: 'vienna-salzburg',
    name: 'Vienna & Salzburg',
    description: 'Romantic Vacation',
    themeColor: '#60a5fa',
    mapPosition: [7, 4, -2],
    memories: viennaSalzburgMemories,
    connections: viennaSalzburgConnections,
  },
  {
    id: 'budapest',
    name: 'Budapest',
    description: 'Our first vacation in Europe',
    themeColor: '#fb7185',
    mapPosition: [-5, -5, 1],
    memories: budapestMemories,
    connections: budapestConnections,
  },
  {
    id: 'scotland',
    name: 'Scotland & UK',
    description: 'Anya joins the family',
    themeColor: '#34d399',
    mapPosition: [6, -4, -1],
    memories: scotlandMemories,
    connections: scotlandConnections,
  },
  {
    id: 'secret',
    name: 'Always',
    description: 'A little extra love',
    themeColor: '#ff9de2',
    mapPosition: [0, 0, 3],
    memories: secretMemories,
    connections: secretConnections,
    hidden: true,
  },
]
