# Performance Analysis

Issues ordered by impact. Status: `[ ]` open · `[x]` done.

---

## Critical — React re-renders every drag frame

### P1 · `MemoryStar` full store subscription
- [x] **Status: Done**
- **File:** `src/components/scene/MemoryStar.tsx:50`
- **Problem:** `const { selectedId, hoveredId, visitedIds, ... } = useConstellationStore()` — no selector, so subscribes to **all** store state. Every drag event mutates `constellationRotX`/`rotY`, which re-renders **every MemoryStar** in the galaxy. Visual updates are driven by `useFrame` anyway, making these React re-renders pure waste.
- **Fix:** Replace with three targeted selectors:
  ```ts
  const isSelected = useConstellationStore(s => s.selectedId === memory.id)
  const isHovered  = useConstellationStore(s => s.hoveredId  === memory.id)
  const isVisited  = useConstellationStore(s => s.visitedIds.includes(memory.id))
  ```
  Keep `setSelected`, `setHovered`, `markVisited` pulled via `useConstellationStore.getState()` inside handlers (no subscription needed for write-only refs).

---

### P2 · `ConstellationGroup` rotation via store state → JSX
- [x] **Status: Done**
- **File:** `src/components/scene/ConstellationScene.tsx:25–39`
- **Problem:** `rotX` and `rotY` are read from store selectors and passed as `rotation={[rotX, rotY, 0]}` on the group. Every drag mousemove → store update → React re-renders `ConstellationGroup` and all children (N×`MemoryStar` + `ConstellationLines`). The constellation subtree reconciles on every pointer move.
- **Fix:** Hold a `groupRef`, read rotation imperatively in `useFrame` via `getState()`, set `group.rotation.x/y` directly. Zero re-renders during drag:
  ```ts
  const groupRef = useRef<THREE.Group>(null)
  useFrame(() => {
    if (!groupRef.current) return
    const { constellationRotX, constellationRotY } = useConstellationStore.getState()
    groupRef.current.rotation.x = constellationRotX
    groupRef.current.rotation.y = constellationRotY
  })
  // JSX: <group ref={groupRef}>
  ```

---

## High — GPU overhead

### P3 · `antialias: true` with EffectComposer
- [x] **Status: Done**
- **File:** `src/components/scene/ConstellationScene.tsx:48`
- **Problem:** When an `EffectComposer` is active, the renderer never writes directly to the screen — it writes to a render target texture, then composites. The WebGL context's MSAA (`antialias: true`) only applies to the default framebuffer, not render targets. So MSAA is requested, allocates GPU memory, but never contributes to the final image.
- **Fix:** `gl={{ antialias: false }}`. If edge aliasing is visible, add `<SMAA />` from `@react-three/postprocessing` inside `EffectComposer` — it works on render targets and looks better than MSAA at this resolution anyway.

---

### P4 · `dpr={[1, 2]}` — full 2× pixel density
- [x] **Status: Done**
- **File:** `src/components/scene/ConstellationScene.tsx:51`
- **Problem:** On retina screens (DPR 2–3), R3F renders at 2× native pixels — 4× the fill rate of 1×. With Bloom post-processing already softening edges, rendering at 1.5× is visually indistinguishable at typical viewing distance but ~44% cheaper on fill rate.
- **Fix:** `dpr={[1, 1.5]}`

---

### P5 · No Vite code splitting
- [x] **Status: Done**
- **File:** `vite.config.ts`
- **Problem:** Three.js (~580KB gz), `@react-three/fiber` + `@react-three/drei`, `postprocessing`, and `motion` all bundle into one chunk. The browser must download + parse the full bundle before rendering anything. No independent chunk caching between deploys.
- **Fix:** Add `manualChunks` to split vendor libs:
  ```ts
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three:        ['three'],
          'react-three': ['@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
          postprocessing: ['postprocessing'],
          motion:        ['motion'],
        },
      },
    },
  }
  ```

---

## Medium — Unnecessary work per frame / render

### P6 · `GalaxyCluster` Sparkles count=100 × 4 clusters
- [x] **Status: Done**
- **File:** `src/components/scene/GalaxyCluster.tsx:46`
- **Problem:** Each `GalaxyCluster` renders 100 animated Sparkle particles. With 4 clusters on the galaxy map, that's 400 particle instances updating every frame via drei's internal `useFrame`. Visually, 50–60 per cluster achieves the same nebula-cloud impression.
- **Fix:** `<Sparkles count={55} .../>` per cluster. Quick win, ~45% fewer sparkle GPU vertices.

---

### P7 · `CustomCursor` spark state update every 35ms
- [x] **Status: Done**
- **File:** `src/components/ui/CustomCursor.tsx:34–41`
- **Problem:** On mousemove, `setSparks(prev => [...prev.slice(-16), spark])` creates a new array and re-renders `CustomCursor` every 35ms. With up to 16 live `motion.div` sparks — each running a spring animation — every re-render reconciles 16 animated children. `setTimeout` per-spark cleanup also piles up callbacks.
- **Fix:** Switch to a fixed-size pre-allocated spark pool using `useRef` and update DOM nodes imperatively (or use a `<canvas>` for the trail). Alternatively, replace the per-spark `motion.div` pattern with a single `requestAnimationFrame` loop that updates element styles directly — removes React from the hot path entirely.

---

### P8 · `ConstellationLines` geometry uses `Vector3` allocation
- [x] **Status: Done**
- **File:** `src/components/scene/ConstellationLines.tsx:12–17`
- **Problem:** The `useMemo` builds geometry by pushing `new THREE.Vector3(...)` per connection then calling `setFromPoints`, which internally converts to Float32Array. Creates `connections.length × 2` temporary `Vector3` objects on every mount.
- **Fix:** Build `Float32Array` directly and use `setAttribute('position', new THREE.BufferAttribute(arr, 3))`. Eliminates all intermediate object allocation. Minor, but cleaner.

---

## Low — Cleanup / minor leaks

### P9 · `NebulaPatch` `CanvasTexture` never disposed
- [x] **Status: Done** (resolved by P10 — module-level singletons live for page lifetime, no disposal needed)
- **File:** `src/components/scene/Starfield.tsx:28–43`
- **Problem:** Each `NebulaPatch` creates a `THREE.CanvasTexture` in `useMemo`. These textures upload to GPU and are never explicitly disposed when the component unmounts (e.g., on scene transition). Three.js won't garbage-collect GPU memory until the context is lost.
- **Fix:** Return a cleanup function from `useMemo` via a `useEffect` that calls `tex.dispose()`:
  ```ts
  useEffect(() => () => tex.dispose(), [tex])
  ```

---

### P10 · `makeNebulaTexture` called inside component — could be module constant
- [x] **Status: Done**
- **File:** `src/components/scene/Starfield.tsx:6–17`
- **Problem:** The three nebula patches have hardcoded `r,g,b` values that never change. `useMemo` with `[r, g, b]` deps works, but the function still runs once per mount. Since the values are compile-time constants, these textures can be module-level singletons, created exactly once for the lifetime of the app.
- **Fix:** Hoist the three `makeNebulaTexture(...)` calls to module scope as `const` vars. Remove the `useMemo` inside `NebulaPatch`. Eliminates canvas element creation on every mount.

---

### P11 · `ShootingStars` — 6 separate `Line` + geometry objects
- [x] **Status: Done**
- **File:** `src/components/scene/ShootingStars.tsx:29–43`
- **Problem:** The pool creates 6 individual `THREE.Line` objects, each with its own `BufferGeometry` and `LineBasicMaterial`. Each active star triggers a separate `needsUpdate = true` and a separate GPU buffer upload per frame. Could be consolidated into one `LineSegments` with a single 36-vertex buffer (6 stars × 2 points × 3 coords).
- **Fix:** Replace individual `Line` pool with a single `THREE.LineSegments` where each star occupies a segment slot. One geometry upload per frame instead of up to 6.

---

## Summary table

| ID  | Area                           | Impact   | File                                      |
|-----|--------------------------------|----------|-------------------------------------------|
| P1  | MemoryStar full store sub      | Critical | `scene/MemoryStar.tsx:50`                 |
| P2  | ConstellationGroup rot via JSX | Critical | `scene/ConstellationScene.tsx:25`         |
| P3  | antialias with EffectComposer  | High     | `scene/ConstellationScene.tsx:48`         |
| P4  | dpr max 2× retina              | High     | `scene/ConstellationScene.tsx:51`         |
| P5  | No Vite code splitting         | High     | `vite.config.ts`                          |
| P6  | GalaxyCluster Sparkles count   | Medium   | `scene/GalaxyCluster.tsx:46`              |
| P7  | CustomCursor spark state 35ms  | Medium   | `ui/CustomCursor.tsx:34`                  |
| P8  | ConstellationLines Vector3 alloc | Medium | `scene/ConstellationLines.tsx:12`         |
| P9  | NebulaPatch texture not disposed | Low    | `scene/Starfield.tsx:28`                  |
| P10 | makeNebulaTexture per mount    | Low      | `scene/Starfield.tsx:6`                   |
| P11 | ShootingStars 6 separate Lines | Low      | `scene/ShootingStars.tsx:29`              |
