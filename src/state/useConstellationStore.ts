import { create } from 'zustand'

interface ConstellationStore {
  selectedId: string | null
  hoveredId: string | null
  constellationRotY: number
  setSelected: (id: string | null) => void
  setHovered: (id: string | null) => void
  setConstellationRotY: (y: number) => void
}

export const useConstellationStore = create<ConstellationStore>(set => ({
  selectedId: null,
  hoveredId: null,
  constellationRotY: 0,
  setSelected: id => set({ selectedId: id }),
  setHovered: id => set({ hoveredId: id }),
  setConstellationRotY: y => set({ constellationRotY: y }),
}))
