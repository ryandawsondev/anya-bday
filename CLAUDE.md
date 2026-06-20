# Constellation — Birthday Gift Web App

A personal gift: a 3D space scene where stars form a heart shape, each representing a memory. Clicking a star flies the camera toward it and reveals a photo + note. Built for a specific person (Anya), ships June 25, 2026.

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
    scene/        # R3F components: ConstellationScene, Starfield, MemoryStar, CameraRig, ConstellationLines
    ui/           # DOM components: CountdownGate, IntroScreen, MemoryPanel
  data/
    memories.ts   # Memory type + static data array — edit this to add real content
  state/
    useConstellationStore.ts   # zustand store: selectedId, hoveredId
  assets/
    memories/     # photo files — compress before adding (WebP preferred, <200KB each)
  config.ts       # BIRTHDAY_DATE constant — single source of truth for countdown gate
  App.tsx
  main.tsx
  styles.css
```

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
