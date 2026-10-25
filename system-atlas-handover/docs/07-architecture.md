# 07 · Architecture and build guidance

Recommendations, not mandates. Deviate only with a written reason in the PR.

## Stack

| Concern | Choice | Why |
|---|---|---|
| App | React 18 + TypeScript (strict) + Vite | Panels are ordinary UI |
| 3D | three.js via **@react-three/fiber** + **@react-three/drei** | Declarative scene, controls, HTML labels |
| Post-processing | **@react-three/postprocessing**: selective Bloom, Vignette, optional Noise | Cinematic look. Parameters from `tokens.json → glow.webglBloom`, per intensity mode |
| Lines | `Line2` / `LineMaterial` (fat lines), or tube geometry for arcs | Constant pixel width, dash animation in the shader |
| State | Zustand (+ URL sync middleware) | Small, fast, easy to test |
| Data | TanStack Query (REST) + `EventSource` for SSE | Caching, retries, stale indicators |
| Styling | CSS modules + `tokens/tokens.css` | No component library styling may leak |
| Tests | Vitest (logic), Playwright (interaction + screenshots), axe-core (a11y) | |

## Rendering plan

- **Buildings:**
  - one `InstancedMesh` per archetype (tower, vault, archive, monolith, block, needle)
  - per-instance attributes: position, size, material index, health
  - edges from an `EdgesGeometry` instanced pass, or a shader using face-edge distance (cheaper)
- **Windows:** draw them in the facade shader, not as meshes.
  - Inputs per instance: `lit` bitmask (up to 32 windows) and the grid size.
  - Busy windows emit, which the selective bloom picks up.
- **Caps / roof glow:** a separate thin instanced quad per building in emissive material. The active roof pulse is a uniform.
- **Ground grid:** a shader on one large plane (distance fade, near/far tint) instead of line meshes.
- **District plates:** one instanced dashed-outline mesh plus a translucent fill.
- **Transit hub:**
  - rings as thin tori or line loops
  - cars as an instanced mesh on the ring, count = queue depth (capped at 200, with a "+N" label)
- **Arcs:**
  - a quadratic Bezier with lift `clamp(0.2·d, 110, 520)` (world units), sampled to 32 points
  - fat line plus a dash shader where `uTime·speed` moves the dashes (speed from rate)
  - hit testing with a thicker invisible tube, or by screen-space distance to the polyline (cheaper, more reliable)
- **Packets and trails:** instanced sprites in a small pool (≤ 64), positioned in JS each frame from the replay clock. Trails are short polyline segments of the same arc.
- **Labels:**
  - an HTML overlay (drei `<Html>` or a custom projected layer) with priority-based collision avoidance
  - hide when occluded (raycast every 4th frame) or outside the viewport
  - ≤ 40 visible at once
- **Bubbles, chips, pulse rings:** HTML overlay, projected per frame.

## Layout engine (deterministic, domain-neutral)

Input: a `Topology` without `layout`. Output: world positions that stay stable across sessions.

1. **District placement:**
   - Run a squarified treemap on the ground plane, weighted by `Σ instances` (min 1).
   - Order districts by call-graph distance from the entry point (the external component), so traffic flows from the front (near the camera) to the back.
   - Pull tones apart: violet (data, training) to the far left, steel (telemetry) to the far right.
2. **Components within a district:** a grid, sorted by type (gateways first, stores last). One building per instance for towers; shards as primary/replica pairs; pools as monolith grids.
3. **Queues:** a transit hub on the district boundary that faces the component the queue feeds.
4. **Height:** `h = clamp(80 + 60·log10(1 + ratePerSec), 60, 260)` for towers. Monoliths use fixed capacity height. Down/cordoned components drop to 70%.
5. **Stability:**
   - Seed by system id.
   - Persist computed positions (`layout` field) server-side.
   - New components take free cells; removed ones leave a ghost slot for 24 h.
   - **Never reflow during a session.**
6. **Reference:** `fixtures/topology.ai-platform.json` carries the hand-tuned layout. The engine's output for that file should look similar (same district order and relative sizes), not identical.

## Camera

- `OrbitControls` (or a custom controller) clamped to the elevation range.
- Zoom = dolly distance 0.35×–9× of the default, or a screen-space scale as in the mockup, whichever keeps labels crisp.
- Zoom stops: compute the target's bounding box, then fit with the viewport insets from 05 §1, then animate with `easeFlight` over 1.1 s.

## Replay clock

- One `requestAnimationFrame` loop owns `t`. Advance `d(t)` by `0.625% × speed × (dt/100ms)`.
- The store updates `t` at ≤ 20 Hz. Packets read `t` directly in the render loop, so React doesn't re-render at 60 Hz.
- Derive everything visual from `(transaction, t)` with pure functions. This makes it testable and gives scrubbing for free.

## Performance budgets

| Metric | Budget |
|---|---|
| Frame time, reference fixture, 1080p, mid-range GPU (RTX 3060 / M2) | ≤ 16.6 ms (60 fps) |
| Scale target | 2,000 buildings, 400 arcs, 64 packets at ≥ 30 fps |
| Draw calls | ≤ 150 at city level |
| Main-thread work per frame during replay | ≤ 4 ms |
| Initial load to first city frame (topology ≤ 2 MB) | ≤ 3 s on broadband |
| Payload open after click | ≤ 300 ms (prefetched neighbours: instant) |
| Memory | ≤ 500 MB tab at 2,000 buildings |

## Project structure (suggested)

```
src/
  app/            routes, URL sync, providers
  store/          zustand slices: camera, selection, replay, explorer, inspector, settings
  data/           api clients, SSE, fixture loader, adapters/
  domain/         pure functions: query parser, time lens, replay phases, layout engine
  scene/          r3f components: City, District, Building*, TransitHub, Arcs, Packets, Ground, Sky, Effects
  overlay/        projected labels, handles, bubbles, pulses, floor cutaway
  panels/         Explorer, Inspector (TransactionTab, IntegrationTab, PayloadViewer), ReplayBar, CameraBar, Header
  styles/         tokens.css + module css
tests/            unit (domain/), e2e (playwright), visual (screenshots at presets)
```

## Testing

- **Unit:** query parser (every grammar row in 05 §4), time lens and inverse (round-trip ±0.01 ms), current-call selection, replay phase per call, layout determinism (same input → same output), redaction display states.
- **E2E (Playwright):** every acceptance criterion marked [auto] in 08.
- **Visual:** 9 presets matching `screenshots/01`–`09`. Assert on composition (bounding boxes of key elements) plus perceptual diff with a tolerance; WebGL output won't be pixel-identical to the SVG mockup.
- **Accessibility:** axe-core on all panels in both modes; keyboard-only run of the main flow.
