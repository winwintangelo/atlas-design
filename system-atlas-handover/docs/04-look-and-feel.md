# 04 · Look and feel of the 3D scene

Reference images: `screenshots/01`–`09` (approved), `screenshots/00` (mood). World units below are the units used in `fixtures/topology.ai-platform.json` (x right, z away from the default camera, y up).

## Camera and framing

| Parameter | Value |
|---|---|
| Projection | Perspective. Mockup focal ≈ 1330 px at 1920×1080, about a 44° vertical FOV |
| Pivot | System centre. Reference: `[-60, 0, 1900]` |
| Distance | 4150 (reference). Zoom changes it, or a screen-space scale (see 05) |
| Default azimuth / elevation | 12° / 29° (a three-quarter view from the front-right, looking down) |
| Elevation range | 12°–72°. Low angles show the horizon (most cinematic). High angles read best |
| Azimuth | Unlimited orbit |
| Framing | Zoom stops fit the target's projected bounds into the scene viewport (x 410–1510, y 200–880 at 1920×1080), leaving room for panels and the camera bar |

## Atmosphere

- **Ground:** near-black (`#02060b`) with a cyan grid every 200 units. Near cells (inside the city) are brighter than far ones. The grid fades with distance.
- **Sky:** vertical gradient `#010307` → `#06121d` → `#0d2a3d` toward the horizon (Cinematic). Darker in Operational.
- **Horizon line:** 1.5 px cyan with a big glow, visible only at low elevation.
- **Haze:** radial `#1b4a66` at 36% around the city centre (Cinematic only).
- **Motes:** about 70 tiny light particles in screen space, slow pulse (Cinematic only, no data meaning, so they live only in Cinematic).
- **Vignette:** radial to 85% black at the corners (Cinematic only).

## Districts

A dashed 1 px rectangle on the ground (6/6 dash). Tone color at 32–45% stroke and 3.5–4.5% fill. The district label floats above its tallest building on a leader line.

## Buildings (components)

Black glass boxes with luminous edges. Each box shows its top face, the visible front face and the visible side face (the renderer decides by camera position).

| Archetype | Footprint (world units) | Height rule | Facade |
|---|---|---|---|
| Tower (service, gateway) | 54–70 square, one per instance | `rate` on a log scale, 105–200 | Window grid 2×3 to 2×6. Lit fraction = utilisation |
| Split beacon (router config) | 26 square | 340 | Single tall white-edged needle: the routing decision |
| Vault (datastore shard) | 36 × 90, paired primary + replica | 128 | Window column 1×5. Degraded shard: amber material, full lit |
| Archive (lake / partitions) | 420 × 46 low bars | 38 | 8×1 windows, violet |
| Monolith (compute node) | 232 × 150 | 430 (300 if cordoned) | **4×2 tall windows = 8 accelerators/cores.** Busy = lit |
| Block (training/batch node) | 70 square | 84–120 (taller when in the running job) | 2×2 windows, violet |
| Needle (telemetry) | 40 square | 380 | 1×10 windows, steel |
| Transit hub (queue) | Inner ring r=160, outer r=245 on the ground, plus 3 slim towers (30 × 190) | — | **Cars:** 30 × 16 amber quads on the outer ring (one per waiting request, spacing 0.152 rad). Inner ring cyan cars for the healthy lane |

**Materials** (`tokens.json → color.material.*`): faces top/front/side in three near-black blues, an edge stroke in the component tone, and a glowing **cap** (top outline) of 1.5 px (2.4 px for the selected/active node).

Side faces carry thin vertical **ribs** (16% opacity), which give a sense of scale without adding data.

**Health on buildings:**
- Healthy: cyan edge.
- Degraded: amber material.
- Down or cordoned: coral material, lower height, dark windows, and a coral ✕ on the roof.
- Selected node: white edge.

## Arcs (integrations)

- **Shape:** a quadratic curve between the caller anchor and the callee anchor (anchor = top centre of the district or component). It lifts above both ends by `clamp(0.2 × ground distance, 110, 520)`. Lineage arcs lift +300.
- **States:**

| State | Base stroke | Flow dashes | Glow |
|---|---|---|---|
| Idle, healthy | Cyan 38%, width `1 + 0.55·log10(rate)` (max +2.2) | `2 18` dashes, cycle per `motion.flowDash` | — |
| Idle, degraded | Amber 38% | Pale amber dashes | — |
| On the selected transaction, not yet reached in replay | White 30%, 1.6 px | none | — |
| On the selected transaction, reached | White 95%, 2.4 px | White `4 26` dashes, 3 s cycle | White 6 px glow |
| Reached, and a call on it failed | Coral 95% | White dashes | Coral glow |
| Selected (inspected) | Pale cyan 100%, 3 px | White `3 12`, 2 s | Cyan 12 px glow |
| Lineage / control | Violet 75%, dashed `10 8` | — | Violet 3 px glow; hidden when the Lineage layer is off |

- **Handle:** a diamond at the arc midpoint (u = 0.5). It is focusable and clickable. Its color matches the arc state.
- **Selected chip:** `INTEGRATION / caller → callee`, floating above the midpoint.

## Replay visuals (one transaction)

| Element | Look | When |
|---|---|---|
| **Request packet** | White 6 px dot, big glow, 22%-of-arc comet trail | Travels caller → callee just before the callee span starts |
| **Response packet** | Cyan 5 px dot + trail | Travels callee → caller just after the span ends (ok) |
| **Failure packet** | Coral 6 px dot + trail | Returns after a failed span |
| **Spark** | 8 coral rays, 7–25 px, pulsing 0.9 s | At the failed target, for 3% of the replay track after failure |
| **Scar** | Coral ✕, 12 px | Stays on the failed target for the rest of the replay |
| **Active roof** | White 2.2 px outline + 12% white fill, pulsing 1.2 s | On every building currently serving a call |
| **Pulse ring** | See 03 | At each active callee anchor |
| **Queue ride** | Amber 3 px arc along the outer ring, growing with wait progress; packet rides the ring | During a queue call |
| **Dispatch link** | White dashed line from the compute district anchor down to the exact node | After the request is dispatched |
| **Beam** | Vertical light column over the active node (22 px wide at 7%, plus a 1.2 px core) | Cinematic only, while the node is working |
| **Stream** | Cyan 2.6 px arc + white dotted `1.5 7` flowing dashes | While a streaming call is open |
| **Call bubble** | See 03. Text: `→ function` / `attempt · target · elapsed / deadline` or `waiting · 821 ms · 24 ahead (est.)` | Follows the current call |

## Labels

- **City level:** one label per district (display-caps title + mono summary line). Leader lines are 16–78 px; tune per district to avoid collisions.
- **District/building levels:** node labels (`c-0 · CANARY 3.2`, `c-1 · EVICTED`).
- A label hides when its anchor leaves the scene viewport.
- **Production must add collision avoidance** (greedy by priority: selected > failing > degraded > others), so labels never overlap at any camera angle.

## Painter order and depth

The mockup sorts buildings back-to-front by distance. Production uses a real depth buffer. Keep these overlays on top of the city with depth testing off:
- arcs (they're elevated)
- packets, sparks and scars
- labels and bubbles (HTML or a screen-space layer)

## Level of detail (production)

| Zoom level | Show |
|---|---|
| City | Districts, buildings, windows as a texture, aggregated arcs (district ↔ district) when there are more than 60 arcs |
| District | Component-level arcs, node labels |
| Building | Instance labels, per-instance windows |
| Floor (execution) | Cutaway panel: instances (e.g. 8 GPUs), batch lanes with the selected request highlighted, cache/memory bar, queue wait, compute time, throughput |

## Screenshot index

| File | Shows |
|---|---|
| `00-north-star-concept-A.png` | Mood, iteration 1 (keep this feeling) |
| `01-replay-retry-moment.png` | Default A2: replay paused at 290 ms, vs-03 about to time out, payload shows DEADLINE_EXCEEDED |
| `02-integration-arc-selected.png` | retrieval → vector-store arc selected, functions, live tail |
| `03-search-errors-503-in-queue.png` | `status:error` search, 503 transaction waiting in the queue ring |
| `04-replay-queue-ring.png` | Hero transaction riding the queue |
| `05-orbited-and-tilted.png` | Camera orbited 78°, tilted down to 22° |
| `06-district-level.png` | Compute district zoom stop |
| `07-floor-level-execution.png` | Floor cutaway with batch lanes |
| `08-operational-mode.png` | Same as 01 in Operational mode |
| `09-streaming-payload-revealed.png` | Decode/stream phase, SSE response revealed (audited) |
