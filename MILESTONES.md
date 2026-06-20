# Milestones

Work through in order. Update status column immediately after each milestone is complete.

| # | Feature | Status |
|---|---------|--------|
| 1 | Scaffold project — Vite + React + TypeScript + pnpm, dependencies installed, dev server running | Done |
| 2 | Countdown gate — config constant for target date, full-screen countdown UI styled to match space theme, gate logic skipping through once date has passed | Done |
| 3 | Base 3D scene — full-screen R3F canvas mounted, camera and lighting in place | Done |
| 4 | Background starfield — `<Stars>` + `<Sparkles>` tuned to look like a real night sky | Done |
| 5 | Bloom pipeline — `@react-three/postprocessing` wired up, memory-stars visually distinct from background stars | Done |
| 6 | Memory data model — `Memory` type and `memories.ts` created with placeholder entries | Done |
| 7 | Constellation layout — memory-star positions plotted to form a heart shape | Done |
| 8 | Connecting lines (stretch) — constellation lines between memory-stars, subtle opacity | Done |
| 9 | Idle camera motion — slow drift/rotation when nothing is selected | Done |
| 10 | Star interactivity — hover and click/tap detection on memory-stars | Done |
| 11 | Fly-to-star camera animation — smooth camera transition on star selection | Done |
| 12 | Memory reveal panel — photo/title/note UI component, animated in with `motion` | Done |
| 13 | Intro screen — title/entry screen before the main scene | Done |
| 14 | Galaxy data model — `Galaxy` type + `galaxies.ts` with 3–5 themed galaxies; each galaxy owns its memory array, constellation positions/connections, and a display name | Done |
| 15 | Galaxy map scene — `GalaxyMap` and `GalaxyCluster` components; floating glowing galaxy clusters in the void; hover label (`GalaxyLabel`); click triggers transition | Done |
| 16 | Hyperspace warp animation — `HyperspaceEffect` component; streak particles + FOV punch via `useFrame`; `MotionBlur` postprocessing effect active only during warp phase; 3-phase: spool-up → warp → drop | Done |
| 17 | Scene transition system — `viewMode: 'map' \| 'galaxy'` + `currentGalaxyId` in zustand store; wire galaxy click → warp → constellation view; `BackButton` UI returns to galaxy map via reverse warp | Done |
| 18 | Content population — real photos and written memories added across all galaxies; photos compressed to WebP <200KB each | Not Started |
| 19 | Mobile pass — touch interaction, layout fixes, particle count scaled down if frame rate suffers | Not Started |
| 20 | Performance pass — image compression verified, asset loading checked, frame rate confirmed across galaxy map and constellation views | Not Started |
| 21 | Deployment — `vite.config.ts` base path set, `gh-pages` deploy script confirmed, Pages enabled in repo settings, live link tested end to end through galaxy map → warp → constellation → memory panel | Not Started |
