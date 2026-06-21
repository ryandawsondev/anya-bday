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
| 18 | Shooting stars — occasional streak particles across background starfield for ambient atmosphere | Done |
| 19 | Star visited state — memory-stars change glow/color after being clicked; tracks which memories have been seen | Done |
| 20 | Cursor sparkle trail — mouse movement leaves fading particle sparkles matching space aesthetic | Done |
| 21 | Galaxy completion glow — when all stars in a galaxy are visited, that galaxy's cluster on the map pulses brighter | Done |
| 22 | Sound effects — subtle sparkle click on star hover/select, small whoosh on warp spool-up | Done |
| 23 | "You are here" label — galaxy name fades in bottom-left when inside a constellation view | Done |
| 24 | Epilogue screen — final scene triggered after all 4 galaxies fully visited; placeholder personal letter/poem content; own distinct visual style | Done |
| 25 | Content population — real photos and written memories added across all galaxies; photos compressed to WebP <200KB each | Not Started |
| 26 | Mobile pass — touch interaction, layout fixes, particle count scaled down if frame rate suffers | Done |
| 27 | Performance pass — image compression verified, asset loading checked, frame rate confirmed across galaxy map and constellation views | Done |
| 28 | Deployment — `vite.config.ts` base path set, `gh-pages` deploy script confirmed, Pages enabled in repo settings, live link tested end to end through galaxy map → warp → constellation → memory panel | Not Started |
| 29 | Constellation draw-on animation — when entering a galaxy, constellation lines draw themselves sequentially and stars fade in one by one via `useFrame` + `drawRange`; cinematic entrance instead of instant appearance | Done |
| 30 | Memory star burst — clicking a memory-star emits a radial particle burst (10–12 particles, ~0.4s lifetime) for a satisfying selection moment | Done |
| 31 | Hidden 5th galaxy — secret galaxy that appears on the map only after all 4 main galaxies are fully visited; shown as "???" until unlocked, then reveals with a special name and unique theme | Done |
| 32 | Galaxy-tinted nebula — each galaxy view tints scene fog and ambient light to match its `themeColor`; currently all galaxy interiors share the same dark void | Done |
| 33 | Epilogue polish — handwritten-style font, slower dramatic typewriter, signature line, seal/stamp reveal animation; elevates the emotional finale | Done |
| 34 | "Days together" counter — intro or epilogue displays exact day count since a meaningful date (first met, etc.); one line of math, high emotional impact | Done |
| 35 | Easter egg — typing "ANYA" on keyboard triggers a special effect (confetti burst, hidden star, secret message); rewarding discovery moment | Done |
| 36 | Photo lightbox — clicking a photo in MemoryPanel opens it full-screen with a close button; removes the 240px height cap | Done |
