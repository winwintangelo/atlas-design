# 08 · Acceptance criteria and milestones

`[auto]` = must have an automated test (unit or Playwright). `[review]` = checked by design review against the screenshots. Fixture = `fixtures/*.ai-platform.json` unless stated.

## A. Scene and look

| ID | Criterion | Check |
|---|---|---|
| A-1 | With the fixture, the city shows all 13 districts with dashed plates and labels at CITY level, with no label overlapping another at default az/el | [auto] bbox overlap test |
| A-2 | Building height increases monotonically with `ratePerSec` within each archetype | [auto] |
| A-3 | Lit windows per building = round(utilisation × window count) ± 1; down/cordoned instances show no lit windows and a coral ✕ | [auto] |
| A-4 | The transit hub shows exactly `queue depth` cars on the watched ring (37 for canary in the fixture) | [auto] |
| A-5 | All colors resolve from `tokens.json`; no hard-coded hex outside the token loader | [auto] lint rule |
| A-6 | Renders at presets 01–09 match the screenshots in composition, hierarchy and color meaning | [review] + [auto] perceptual diff |
| A-7 | Operational vs Cinematic changes only the rendering parameters in 03 §Intensity; a DOM/scene snapshot of data (labels, counts, positions) is identical in both | [auto] |

## B. Camera

| ID | Criterion | Check |
|---|---|---|
| B-1 | Dragging 100 px horizontally changes azimuth by 25° ± 1° | [auto] |
| B-2 | Elevation never leaves 12°–72° by drag, buttons or keys | [auto] |
| B-3 | Wheel zoom keeps the world point under the cursor fixed (≤ 2 px drift) | [auto] |
| B-4 | Shift-drag pans; a drag of > 4 px never triggers a click selection | [auto] |
| B-5 | Each zoom stop frames its target inside the scene viewport (05 §1) after a 1.1 s eased flight; labels follow without lag | [auto] + [review] |
| B-6 | After any orbit, the active zoom stop's target stays fully framed | [auto] |
| B-7 | RESET returns to az 12°, el 29°, CITY | [auto] |

## C. Explorer

| ID | Criterion | Check |
|---|---|---|
| C-1 | Each grammar row in 05 §4 filters correctly (unit table test with the 7 fixture transactions) | [auto] |
| C-2 | `ttft>800` → exactly `req_7f3a9c21`, `req_2c91be07`; `status:error` → `req_9e7710b4`, `req_d07c55a9`, `req_6b2e4f18` | [auto] |
| C-3 | Chips AND with the query; saved views set query and chips together | [auto] |
| C-4 | Sort: errors first, then headline latency descending | [auto] |
| C-5 | Clicking a result selects it, sets t = −3, starts playing, opens the TRANSACTION tab, leaves the camera alone | [auto] |
| C-6 | The empty state shows when nothing matches; the selected transaction stays selected | [auto] |

## D. Replay

| ID | Criterion | Check |
|---|---|---|
| D-1 | `d(t)` and its inverse match 05 §5 (round trip ±0.01 ms at 20 sample points) | [auto] |
| D-2 | At 1×, the full track plays in 16 s ± 0.3 s | [auto] |
| D-3 | For the hero transaction at t = 290 ms: the current call is s8 `vector.v1.Shard/Query` attempt 1; the bubble reads `… 242 / 250 ms deadline`; the vs-03 primary roof pulses | [auto] |
| D-4 | At t = 760 ms: the packet is on the outer ring; the bubble shows `waiting · 418 / 840 ms · ~19 ahead` (± rounding) | [auto] |
| D-5 | After t = 298 ms: the spark appears for 3% of the track, then the ✕ scar persists at vs-03 primary | [auto] |
| D-6 | Request packets move caller → callee before the callee span; response packets move back after it; failed returns are coral | [auto] (sampled positions) |
| D-7 | Step forward/back lands exactly on call starts, pauses and pins; scrub clears the pin | [auto] |
| D-8 | Under `prefers-reduced-motion`, replay advances call to call with no tweening | [auto] |
| D-9 | Error transactions end with a coral return to the client and the right status phase text (`complete · 503 returned to client`) | [auto] |

## E. Payloads

| ID | Criterion | Check |
|---|---|---|
| E-1 | The payload viewer shows the current (or pinned) call; the REQUEST/RESPONSE toggle persists across calls | [auto] |
| E-2 | Payloads arrive redacted; redacted strings render in `code.redacted`, error tokens in `code.error` | [auto] |
| E-3 | Reveal requires a reason, calls the reveal API, shows `content revealed · logged`, and resets on transaction change | [auto] |
| E-4 | A 403 on reveal shows `Reveal needs role …` and keeps content redacted | [auto] |
| E-5 | No payload text is ever written to local/session storage, IndexedDB, console or analytics | [auto] |

## F. Integrations (arcs)

| ID | Criterion | Check |
|---|---|---|
| F-1 | Clicking within 9 px of an arc, or its handle, selects it and opens the INTEGRATION tab; `Esc` clears | [auto] |
| F-2 | The tab shows protocol, 3 tiles, the p99 sparkline, functions with rate/p50/p99/err | [auto] |
| F-3 | Clicking a function filters the live tail; clicking again clears | [auto] |
| F-4 | The live tail adds new samples at least every 1 s while connected; failures are coral | [auto] |
| F-5 | Calls of the selected transaction on this arc appear as pinned rows; clicking one jumps to that call in the TRANSACTION tab | [auto] |
| F-6 | Selecting an arc never changes the selected transaction or `t` | [auto] |

## G. Generality, accessibility, performance

| ID | Criterion | Check |
|---|---|---|
| G-1 | `fixtures/example.payments.json` loads, lays out automatically, and replays `pay_5d21c0a9` (issuer timeout → stand-in) with **no code changes** | [auto] |
| G-2 | No domain words (`gpu`, `token`, `model`, `prompt`, `payment`) in `scene/`, `overlay/`, `panels/` source | [auto] grep |
| G-3 | axe-core: zero serious/critical issues in panels, both modes | [auto] |
| G-4 | The main flow (search → select → step → read payload → select arc via handle) completes with keyboard only | [auto] |
| G-5 | Performance budgets in 07 met on the reference machine | [auto] perf trace |
| G-6 | URL round-trip: copy the URL, open in a new tab → same view, selection, `t` and tab | [auto] |

## Milestones

| # | Scope | Exit criteria |
|---|---|---|
| **M0** | Repo, tokens, types, fixture loader, domain pure functions (query parser, time lens, replay phases) | C-1, C-2, C-4, D-1 green |
| **M1** | Static city from topology: layout engine, archetypes, windows, plates, labels, Operational mode | A-1…A-5, G-2 green; review against screenshot 08 |
| **M2** | Camera (orbit, tilt, pan, zoom, stops, reset) + Cinematic mode (bloom, haze, vignette, motes, beam) | B-1…B-7, A-7 green; review against 01, 05, 06 |
| **M3** | Explorer + TRANSACTION tab + replay (packets, queue ride, sparks, streams, bubble, replay bar) | C-*, D-* green; review against 01, 03, 04, 09 |
| **M4** | Payload viewer, redaction states, reveal flow (stub API), floor cutaway | E-* green; review against 07, 09 |
| **M5** | Arcs: hit testing, handles, INTEGRATION tab, live tail over SSE (fixture-driven simulator first) | F-* green; review against 02 |
| **M6** | Generality + hardening: payments fixture, auto layout, a11y, keyboard, URL state, performance | G-* green |

Deliver each milestone as a PR with: what changed, screenshots at the relevant presets, test results, and known gaps.
