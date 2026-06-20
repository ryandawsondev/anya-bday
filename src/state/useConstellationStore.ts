import { create } from 'zustand'

interface ConstellationStore {
  selectedId: string | null
  hoveredId: string | null
  constellationRotX: number
  constellationRotY: number
  cameraZ: number
  setSelected: (id: string | null) => void
  setHovered: (id: string | null) => void
  setConstellationRotX: (x: number) => void
  setConstellationRotY: (y: number) => void
  setCameraZ: (z: number) => void
}

export const useConstellationStore = create<ConstellationStore>(set => ({
  selectedId: null,
  hoveredId: null,
  constellationRotX: 0,
  constellationRotY: 0,
  cameraZ: 12,
  setSelected: id => set({ selectedId: id }),
  setHovered: id => set({ hoveredId: id }),
  setConstellationRotX: x => set({ constellationRotX: x }),
  setConstellationRotY: y => set({ constellationRotY: y }),
  setCameraZ: z => set({ cameraZ: z }),
}))
