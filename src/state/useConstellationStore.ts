import { create } from 'zustand'

export type ViewMode = 'map' | 'galaxy'
export type WarpPhase = 'idle' | 'spooling' | 'warping' | 'dropping'

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

  viewMode: ViewMode
  currentGalaxyId: string
  hoveredGalaxyId: string | null
  warpPhase: WarpPhase
  warpTargetGalaxyId: string | null
  setViewMode: (mode: ViewMode) => void
  setCurrentGalaxyId: (id: string) => void
  setHoveredGalaxyId: (id: string | null) => void
  setWarpPhase: (phase: WarpPhase) => void
  startWarp: (targetGalaxyId: string | null) => void
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

  viewMode: 'map',
  currentGalaxyId: 'the-date',
  hoveredGalaxyId: null,
  warpPhase: 'idle',
  warpTargetGalaxyId: null,
  setViewMode: mode => set({ viewMode: mode }),
  setCurrentGalaxyId: id => set({ currentGalaxyId: id }),
  setHoveredGalaxyId: id => set({ hoveredGalaxyId: id }),
  setWarpPhase: phase => set({ warpPhase: phase }),
  startWarp: targetGalaxyId => set({ warpPhase: 'spooling', warpTargetGalaxyId: targetGalaxyId }),
}))
