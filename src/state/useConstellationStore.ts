import { create } from 'zustand'

interface ConstellationStore {
  selectedId: string | null
  hoveredId: string | null
  setSelected: (id: string | null) => void
  setHovered: (id: string | null) => void
}

export const useConstellationStore = create<ConstellationStore>(set => ({
  selectedId: null,
  hoveredId: null,
  setSelected: id => set({ selectedId: id }),
  setHovered: id => set({ hoveredId: id }),
}))
