# Constellation — Birthday Gift Web App

A personal gift: a 3D space with multiple galaxies to explore. Each galaxy contains a themed constellation of memory-stars. From the galaxy map, clicking a galaxy triggers a Star Wars-style hyperspace warp animation, then drops you into that galaxy's constellation. Clicking a memory-star flies the camera to it and reveals a photo + note. Built for a specific person (Anya), ships June 25, 2026.

**No backend. All content is static, bundled at build time. Deploy target: GitHub Pages.**

## Tech Stack

- **Package manager**: pnpm (keep `pnpm-lock.yaml` as lockfile — never use npm/yarn)
- **Build**: Vite + React + TypeScript (strict mode)
- **3D**: `three`, `@react-three/fiber`, `@react-three/drei`
- **Post-processing**: `@react-three/postprocessing` + `postprocessing` — bloom is required
- **DOM animation**: `motion` (import from `motion/react`) — UI chrome only, not in-canvas
- **In-canvas animation**: R3F `useFrame` hook — never drive 3D objects with `motion`
- **State**: `zustand` — shared between canvas components and DOM components
- **Styling**: Tailwind v4 (via `@tailwindcss/vite`, no config file needed), inline styles for scene-specific UI

## Key Commands

```bash
pnpm install         # install deps
pnpm dev             # dev server (port 3000)
pnpm build           # production build
pnpm preview         # preview build locally
pnpm run deploy      # build + push to gh-pages branch (GitHub Pages deploy)
```

## File Structure

```
src/
  components/
    scene/        # R3F components: ConstellationScene, Starfield, MemoryStar, CameraRig,
                  #   ConstellationLines, GalaxyMap, GalaxyCluster, HyperspaceEffect
    ui/           # DOM components: CountdownGate, IntroScreen, MemoryPanel, GalaxyLabel, BackButton
  data/
    galaxies.ts   # Galaxy type + array — each galaxy has id, name, theme color, map position,
                  #   constellation connections, and memories array
    memories.ts   # Memory type — imported by galaxies.ts; no longer a top-level array
  state/
    useConstellationStore.ts   # zustand store: viewMode ('map'|'galaxy'), currentGalaxyId,
                               #   selectedId, hoveredId, warpPhase ('idle'|'spooling'|'warping'|'dropping')
  assets/
    memories/     # photo files — compress before adding (WebP preferred, <200KB each)
  config.ts       # BIRTHDAY_DATE constant — single source of truth for countdown gate
  App.tsx
  main.tsx
  styles.css
```

## Scene Architecture

Two top-level views, both rendered inside the same R3F `<Canvas>`:

- **Galaxy map** (`viewMode === 'map'`): floating `GalaxyCluster` meshes in the void; idle camera drift active; clicking a cluster fires `startWarp(galaxyId)`
- **Galaxy interior** (`viewMode === 'galaxy'`): existing constellation + memory-star mechanic, scoped to `currentGalaxyId`; `BackButton` fires `startWarp(null)` to return

### Hyperspace warp (`HyperspaceEffect`)

Three-phase `useFrame` animation, total ~2 seconds:

1. **Spool-up** (0–0.5s): background stars elongate into streaks; camera FOV widens from 60 → 90
2. **Warp** (0.5–1.5s): streak particles fill screen; `MotionBlur` postprocessing effect active; FOV at 90
3. **Drop** (1.5–2s): streaks shrink back; scene crossfades to destination; FOV returns to 60

`warpPhase` in the store drives which postprocessing effects are active. `MotionBlur` is mounted/unmounted based on phase to avoid cost when idle.

## Code Conventions

- TypeScript strict mode — all types explicit, no `any`
- Functional components only, `const` exports
- Prefer readability over compactness; encapsulate complexity in hooks, not in JSX
- `import type` for type-only imports (verbatimModuleSyntax is on)
- No comments unless the WHY is non-obvious
- In-canvas animation via `useFrame` only — never `motion` inside Canvas
- DOM-layer animation via `motion/react` only — never `useFrame` outside Canvas

## Deployment Notes

- `vite.config.ts` has `base: '/anya-bday/'` — must match exact GitHub repo name (case-sensitive)
- Deploy with `pnpm run deploy` (uses `gh-pages` package, pushes to `gh-pages` branch)
- Enable Pages in repo settings → serve from `gh-pages` branch after first deploy
- The link is public (GitHub Pages default) — treat as unlisted, not secured

## Milestones

See `MILESTONES.md` — update status immediately after completing each milestone.
