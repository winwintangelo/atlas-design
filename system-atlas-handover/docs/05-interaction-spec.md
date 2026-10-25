# 05 · Interaction specification

Behaviour of the approved mockup `reference/A2-Explorer.html`, written as a contract. "MUST" items are covered by acceptance criteria in `docs/08`.

## 1. Screen layout (reference 1920×1080)

| Region | Position / size | Notes |
|---|---|---|
| Header | Top, full width, 64 px. Transparent gradient. No pointer capture except its controls | Brand · product · view chip / breadcrumbs (centre) / LIVE clock · intensity toggle |
| Scene | Full bleed behind everything | Receives drag, wheel and click |
| Camera bar | Centred, top 78 px | Zoom stops · orbit ⟲ ⟳ · tilt ▲ ▼ · zoom − % + · RESET. Hint line + AZ/EL readout + layer toggles under it |
| Explorer panel (left) | x 24, y 84, 356 × 808 | Search, filters, results, saved views |
| Inspector panel (right) | right 24, y 84, 372 × 808 | Tabs: TRANSACTION / INTEGRATION |
| Replay bar | Bottom 18, left/right 24, height 156 | Controls (330 px) + timeline track |
| Scene viewport (for framing) | x 410–1510, y 200–880 | Zoom stops fit here; labels hide outside it |
| Floor cutaway | x 404, y 176, 470 wide | Only at the Floor zoom stop |

**Responsive:**
- At 1600–1919 px wide, panels shrink to 320 / 336 px.
- At 1280–1599 px, the explorer collapses to a 56 px icon rail that opens as an overlay drawer; the inspector stays.
- Below 1280 px, both panels become drawers and the replay bar collapses to a single line.
- The scene is always full bleed.

## 2. State model

One store (e.g. Zustand) holds everything below. Mirror the starred `*` fields in the URL query so any view can be shared.

| Field | Type | Default | Notes |
|---|---|---|---|
| `mode` * | `'cinematic' \| 'operational'` | `cinematic` | |
| `camera.az` * / `camera.el` * | degrees | 12 / 29 | el clamped 12–72 |
| `view` * | `{kind:'level', level:0..3}` or `{kind:'free', s, tx, ty}` (or a WebGL camera pose) | level 0 | |
| `query` * | string | `ttft>800` in the reference build (use `''` in production) | |
| `filters.status` * / `filters.route` * | enum | `all` | Route chip values come from data |
| `selectedTx` * | transaction id | first search result | |
| `t` * | ms (float, may be negative during pre-flight) | 290 (reference) / `-3` on a new selection | |
| `playing` | bool | false | |
| `speed` | 0.5 \| 1 \| 2 | 1 | |
| `pinnedCall` | call id \| null | null | Set by a click in the call list or by step; cleared by play or scrub |
| `inspectorTab` * | `'txn' \| 'edge'` | `txn` | |
| `selectedEdge` * | integration id \| null | null | |
| `fnFilter` | function name \| null | null | Live tail filter |
| `selectedSample` | sample id \| null | newest | |
| `payloadDir` | `'req' \| 'res'` | `res` | Shared by both tabs |
| `revealed` | bool | false | Never persisted; resets on transaction change |
| `layers.traffic` / `layers.lineage` * | bool | true / true | |

## 3. Camera

| Input | Action | Details |
|---|---|---|
| Drag (primary button / one finger) | Orbit + tilt | 1 px = 0.25° azimuth, 0.15° elevation. Elevation clamped 12°–72°. Starts after 4 px of movement (so clicks stay clicks) |
| Shift + drag / right-drag / two-finger drag | Pan | 1:1 in screen space |
| Wheel / pinch | Zoom toward the cursor | factor `exp(−deltaY × 0.0015)`. Scale clamped 0.35×–9×. The point under the cursor stays put |
| Zoom ± buttons | Zoom ×1.3 / ÷1.3 about the viewport centre | 300 ms ease |
| ⟲ ⟳ buttons | Orbit ±20° | 240 ms eased |
| ▲ ▼ buttons | Tilt ±7° | 240 ms eased |
| Zoom stops: CITY / DISTRICT / BUILDING / FLOOR | Fly to a framed target | 1.1 s `easeFlight`. CITY = whole system. DISTRICT = district of the selected transaction's main compute (reference: compute + transit hub). BUILDING = the node/component that served the transaction. FLOOR = same node, framed right, cutaway panel left |
| RESET | Az 12°, El 29°, CITY | Flight |
| Readout | `AZ 12° · EL 29°`, zoom % | Live |

- After a free zoom or pan, no zoom stop is highlighted. The breadcrumb depth follows the effective scale (> 2.2 = building, > 1.3 = district).
- Rotation keeps the current zoom stop framed. Zoom stops refit after every orbit.
- Optional inertia: decay 0.92 per frame. It must stop on any new input and is disabled under reduced motion.

## 4. Explorer (search → narrow → select)

**Query grammar.** Whitespace-separated tokens are joined with AND. Matching is case-insensitive.

| Token | Meaning | Example |
|---|---|---|
| `<metric>>N`, `<metric><N` (also `>=` `<=`) | Numeric compare on a headline metric. Missing value = no match | `ttft>800`, `total<2000`, `authMs>1500` |
| `status:` | `ok`, `slow`, `error` (prefix match) | `status:error` |
| `route:` | Variant / version / path | `route:canary` |
| `tenant:` `node:` `code:` | Prefix match | `tenant:t-0428`, `code:5` |
| `service:` `function:` `region:` `attr.<key>:` | **Production additions:** match any call in the trace | `service:vector-store function:Query` |
| free text | Substring over id, tenant, route, entrypoint, node, code, status | `9e77` |

**Behaviour:**
- Results update as you type (debounce 150 ms in production; the server query runs on the trace store).
- Status chips (All / Slow / Errors / OK) and route chips (values from data) AND with the query.
- Saved views set query + chips in one click. Reference set: *Canary TTFT breaches*, *Errors*, *Tenant t-0428*, *All*.
- The count line reads `N matches · M traces retained`. In production: `N matches in <window> · showing top K`.
- **Sort:** errors first, then headline latency descending.
- **Result row:** id, headline latency (amber above SLO, coral for errors where total time is shown), `time · tenant · route node`, status badge, critical-path mini strip using the replay bar's piecewise scale.
- **Click a row:** select it, reset `t` to −3 (pre-flight), start playing, clear the pin, switch the inspector to TRANSACTION, and keep the camera.
- **Empty state:** "No traces match. Try removing a filter."
- The selected transaction stays selected even if a later query filters it out of the list.

## 5. Replay

### Time lens (the honest, non-linear timeline)
Real time is mapped to track percentage `d(t)` so that short early hops stay visible:

| Real time | Track % | Label |
|---|---|---|
| −3 … 0 ms (pre-flight: client → edge) | 0 → 3 | `client` |
| 0 … 60 ms | 3 → 25 | lens, shaded band |
| 60 … 1,500 ms | 25 → 80 | |
| 1,500 … 6,000 ms | 80 → 100 | |

```
d(t) = t<0 ? 3+t : t≤60 ? 3+t·22/60 : t≤1500 ? 25+(t−60)·55/1440 : min(100, 80+(t−1500)·20/4500)
```
The inverse is used for scrubbing. **Times shown are always real.** The track shows the scale breaks and the caption "replay paced by the lens · times are real". In production, derive the breakpoints from the transaction (lens = first 1% of total or 60 ms, whichever is larger), but keep the 3 / 25 / 80 % anchors.

### Controls
- **Play / pause** (44 px). Play at the end restarts from −3.
- **Restart.**
- **Step back / forward:** jump to the previous / next call start, pause, and pin that call.
- **Speed:** cycles 1× → 2× → 0.5×. At 1× the full track takes 16 s (track advances 0.625% per 100 ms tick).
- **Scrub:** drag anywhere on the track (an accessible range input, 0–1000) to set `t`. Pauses and clears the pin.
- **Readout:** `t = 290 ms` (or `pre-flight`), then a phase line: current call function + state (e.g. `Shard/Query · 242 / 250 ms deadline`), colored by state.

### What moves (per call, in track %, TR = 0.9)
| Phase | Window | Visual |
|---|---|---|
| Request out | `[d(start) − TR, d(start))` (pre-flight call: `[0, 3)`) | White packet along the arc caller → callee, comet trail |
| Working | `[d(start), d(end))` | Callee roof pulses, pulse ring at its anchor, call bubble |
| Queue | `[d(start), d(end))` for `kind = queue` | Packet rides the outer ring; the amber ride arc grows; bubble `waiting · elapsed / total · ~N ahead (est.)` |
| Stream | while open | Dashed flowing stream on the arc, no single packet |
| Response back | `[d(end), d(end) + TR)` (not for queue/gen/stream/top-level) | Cyan packet (ok) or coral packet (fail) back to the caller |
| Failure | from `d(end)` | Spark for 3% of track, then a permanent ✕ scar on the target instance |

- **Current call** = the pinned call, else the latest-started active call (ignoring the top-level client call), else the first call.
- **Arcs on the route** brighten when their first call's request phase begins. They turn coral after a failure on them.
- **Ticks under the track:** one per call start. Coral for failed calls, white for the current one.
- **Markers:** SLO (dashed white) and first token / headline metric (solid amber, labeled).

## 6. Inspector, TRANSACTION tab

1. Id (mono 18) and a meta line (`entrypoint · tenant · route · node · start time`).
2. Three tiles:
   - headline latency vs SLO (amber breach tile when over)
   - total
   - status code (cyan if 2xx, coral otherwise), with output size
3. **Calls** list (scrolls, max 214 px):
   - Each row: index · function (namespace stripped) · duration.
   - The current row has a white edge. Not-yet-reached rows are muted.
   - Click a row: set `t` inside the call (start + min(½ duration, 1 ms or 20 ms)), pause, pin it.
4. **Payload** viewer for the current call:
   - Title = full function (+ attempt).
   - REQUEST / RESPONSE toggle.
   - Syntax-tinted mono text, `white-space: pre`, scrolls in both directions.
   - Meta: `sent|received at X ms · span sN · user content redacted`.
5. **Reveal content · audited** button:
   - In production it opens a dialog asking for a reason (required), then calls the reveal API.
   - While revealed: the button reads HIDE CONTENT (amber) and the meta reads `content revealed · logged`.
   - Reveal resets on transaction change.
   - The mockup toggles locally.

## 7. Inspector, INTEGRATION tab

- **Empty state** (no arc selected): "Click any arc in the city, or a diamond at its midpoint, to see the functions on that integration and a live tail of real calls."
- **Header:** `caller → callee` (mono 15), then a protocol line plus the function count.
- **Tiles:**
  - calls/s
  - p99 of the top function (amber if degraded)
  - error % over 5 min (coral if ≥ 0.5%)
- **Sparkline:** 340 × 40 px, p99 over the last 5 minutes, amber when degraded. It has an aria-label describing the trend.
- **Functions:** one row each (name, err %, `rate · p50 · p99`). Click to filter the live tail; click again to clear.
- **Selected transaction on this arc:** pinned rows for each call of the selected transaction on this integration (`try 1 · DEADLINE_EXCEEDED · 250 ms ↗`). Click: switch to TRANSACTION, pin that call, set `t`.
- **Live tail:**
  - 6 newest samples, newest first, refreshed every 1 s. Each row: `hh:mm:ss.mmm · trace · function · status · latency`.
  - Failures in coral; latency amber above 200 ms.
  - "sampled 1:50" with a pulsing dot.
  - Click a row to select it. The payload viewer below shows its REQ / RES, using the same direction toggle and redaction rules as the TRANSACTION tab.
- Selecting an arc never changes the selected transaction or the replay time.

## 8. Arcs, handles and layers

- **Clicking an arc** (hit width 18 px along the curve) or its **diamond handle** selects it:
  - the INTEGRATION tab opens
  - the arc turns to the selected style
  - the chip appears at the arc midpoint
- `Esc` clears the arc selection.
- Handles are visible at CITY and DISTRICT levels, or when selected. They are real buttons with `aria-label="Inspect integration <caller> to <callee>"`.
- A click that ends a drag (more than 4 px of movement) must not select.
- **Layer toggles:**
  - TRAFFIC dims idle arcs to 12% and stops their dashes.
  - LINEAGE hides the violet control/lineage arcs and their handles.

## 9. Keyboard (production; the mockup used buttons only)

| Key | Action |
|---|---|
| `/` | Focus search |
| `Esc` | Clear arc selection → clear pin → blur search (in that order) |
| `Space` | Play / pause |
| `,` / `.` | Step to previous / next call |
| `Shift + ← / →` | Scrub ±1% of the track |
| `← → ↑ ↓` | Orbit ±5° / tilt ±3° (scene focused) |
| `+` / `−` | Zoom |
| `1`–`4` | Zoom stops |
| `0` | Reset camera |
| `[` / `]` | Previous / next search result (selects and replays) |
| `R` | Toggle REQUEST / RESPONSE |
| `M` | Toggle Operational / Cinematic |

## 10. Accessibility

- All panel content meets WCAG 2.2 AA: contrast (see 03), visible focus (2 px cyan outline), and real `button` / `input` / `label` elements.
- The scene is `role="application"` with a label explaining the controls.
- **Everything doable in the scene is also doable from panels:** arcs via handles and an "Integrations" list (production: add a list view toggle), buildings via a "Components" list, transactions via the explorer.
- The replay bar is an accessible range input. The phase line is a polite live region (announce only on call change, not every tick).
- `prefers-reduced-motion`: no flights (instant cuts), no dashes, pulses or motes; replay advances call-to-call every 1.5 s instead of animating.
- No information is carried by color alone: failures also get ✕ / spark / status text, queues get hatching and car counts, breaches get the SLOW badge.

## 11. Loading, error and live states

| Situation | Behaviour |
|---|---|
| Topology loading | City grid and district plates fade in; buildings rise 0 → height over 600 ms (Cinematic), or appear instantly (Operational or reduced motion) |
| Metrics stale (> 30 s) | LIVE dot turns amber and reads `STALE · last 14:02:17`. Motion pauses ("if data stops, motion stops") |
| Trace search error | Inline row in the explorer: `Search failed · retry` (button). Keep the previous results dimmed |
| Payload unavailable (not captured) | Viewer reads `// payload not captured for this span (capture policy: <policy>)` |
| Reveal denied | Inline coral line: `Reveal needs role incident-responder` |
| Live tail disconnected | Dot stops pulsing, label `paused · reconnecting`, exponential backoff |
| Very long payload (> 256 KB) | Show the first 2,000 lines + `Download full payload (audited)` |
