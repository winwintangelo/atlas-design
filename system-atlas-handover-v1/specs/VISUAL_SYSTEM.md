# Visual and interaction design system

## 1. Reference fidelity

Use [05A](../references/05A_precision_trace.png) and [07](../references/07_topographic_atlas.png). The desired result is recognizably these two interfaces, implemented with live geometry and UI. Preserve their spatial character, visual hierarchy and colors. The owner has selected the directions, not every incidental pixel or arrow in the generated images.

Maintain dark navy/graphite foundations, restrained blue/cyan atmosphere, pale violet lineage and a warm amber selected transaction. Avoid the rejected orbital, organic and mechanical concepts. Do not make giant neon text, aggressive bloom or decorative particle storms the primary experience.

## 2. Visual semantics

| Encoding | Meaning | Constraint |
| --- | --- | --- |
| Territory boundary / contour nesting | Logical containment in the selected grouping | Does not imply latency, altitude, risk or security isolation |
| Glyph / silhouette | Component type | Stable across views, with text fallback |
| Amber route and focus outline | Selected transaction/operation | Selection is not itself a warning |
| Cyan route with directional markers | Observed communication or response according to active legend | Separate response/other traffic by line pattern and labels |
| Pale violet ribbon/edge | Model, dataset, run and deployment lineage | Never blended into request-time execution |
| Dashed gray relationship | Declared dependency or unobserved relationship, as specifically labeled | Do not join a missing trace segment with a fake observed line |
| Warning icon + amber status chip | Measured issue or configured threshold breach | Distinct from selected amber route; explain criterion |
| Error icon + coral status chip | Reported failure/error | Unknown data must not receive an error or success classification automatically |
| Gray hatch / question mark | Missing, stale or unavailable evidence | Remains visible when unrelated activity is dimmed |
| Motion along route | Illustrative execution/event activity | Not a network packet count or literal speed measurement |

The legend changes with the current relationship layer and must disambiguate meaning. Size, relief and brightness are decorative unless a scale is explicitly selected, labeled and documented. Keep data-driven metric encodings optional and avoid overloading existing channels.

## 3. View 07 construction

### Scene geometry

Use shallow stacked contour surfaces with smooth angular boundaries, matte graphite/slate materials and subtle edge highlights. Heights are small relative to the territory’s width. The reference is a stylized system map, not realistic mountainous terrain. Territories can be generated from deterministic grouping and a stable layout seed, with simplified preset shapes acceptable in the first demo.

Place reusable low-profile glyph pedestals on territories: user for client, shield for gateway/auth, branching nodes for orchestration, storage cylinder for databases, stacked bars for queue, chip for compute, cube/bookmark for registry. Use original or appropriately licensed vector glyphs and record dependencies. Preserve actual component labels and identity.

Draw routes above the surface using modest vertical clearance. Route crossing is not a dependency junction unless a node is explicitly present. Use directed arrowheads sparingly and correctly. When children are collapsed, aggregate traffic/paths with a visible count/coverage annotation rather than drawing a false one-hop execution.

### Camera and layout

Default orthographic or low-perspective, near-top-down three-quarter camera. A proposed starting inclination is 25–40 degrees from vertical; tune to resemble the reference while keeping labels readable. Put inference in the foreground and training/model context in a distinct upper/rear territory for the sample only. Real grouping comes from data.

Fit the selected system on initial load, preserve orientation during expansion and cache camera state per view/context. Cluster dense children and progressively disclose labels. New telemetry should change visual activity, not randomly reseed positions.

### Interaction details

Hover raises a subtle outline and shows a summary. Selection strengthens the outline and pins the inspector. Territory expansion gives an obvious breadcrumb and Back action. A selected trace routes through the involved components; Open transaction moves to 05A. Search highlights/frames its result without permanently erasing filters.

## 4. View 05A construction

### Scene geometry

Use thin translucent rectangular service gates, short stacks of planes for queue/state grouping, simple data blocks, and restrained blue/violet edge illumination. Main service stages follow a readable spatial order with side branches. The architecture can reuse one service object while distinguishing multiple operation instances in the inspector/timeline; when duplicate service gates are needed for clarity, label them as the same service with separate span/attempt identity.

Keep one selected amber execution path prominent. Secondary traces are sparse and low opacity. A separate violet lineage strip is smaller and higher in the frame; collapse it if no model context is available. Streaming output uses restrained event marks only when supported by captured data.

### Spatial position and time

The approved 05A image explicitly labels position as architectural layout. Preserve that meaning. A distance between Gateway and Orchestrator is not their latency. A synchronized 2D waterfall provides quantitative time, and hover/inspector gives exact timestamps.

Playback highlights operations active at the playhead and animates known transitions. Multiple branches can be active together. A focus plane may track the currently inspected component, but is labeled Focus and cannot stand in for a global time slice. When slowed for demonstration, show the speed and do not distort displayed durations. The supplied #7F2A fixture, not the image, defines exact timing.

### Camera and focus

Use a shallow oblique orthographic view with the major path spanning the scene, modest depth separation for branches and room for labels. Keep the visual cadence of 05A without forcing every real trace into a straight chain. Dense traces begin collapsed by service/branch with visible expand affordances and operation counts.

Follow request uses interruptible framing changes rather than continuous flight. Preserve user orbit/pan until Follow is explicitly resumed. In reduced motion, focus changes use immediate or short opacity changes; all information remains available.

## 5. Screen-space UI and typography

Render labels, navigation, inspector and playback primarily as DOM/accessible UI. Perspective-distorted text inside 3D surfaces should be limited to nonessential decoration. Prevent label collisions through priorities, grouping, offsets and hover reveal; never hide the selected item’s identity.

Proposed defaults:

- System sans-serif family; optional project font only when licensed and available locally. Monospace for IDs and timestamps.
- Main interface text 14–16 px, key values 24–32 px, secondary labels at least 12 px at baseline desktop resolution. Browser zoom must work.
- 8 px spacing rhythm; compact 48–56 px top bar; inspector 300–360 px; replay 64–80 px collapsed.
- Dark opaque-enough panels for legibility; subtle 1 px borders. Limit heavy translucent layering behind text.
- 4.5:1 text contrast target for normal text, larger text and non-text controls checked to their appropriate criteria. Tokens are starting values and require validation in context.
- Real buttons, focus rings, tooltips, visible disabled states and concise labels. Decorative icons are not the sole instruction.

## 6. Motion and visual intensity

| Motion | Proposed duration | Behavior |
| --- | --- | --- |
| Hover/selection feedback | 100–160 ms | Fast and subtle; no position jump |
| Inspector open/collapse | 160–220 ms | Keep scene orientation |
| Territory expand/collapse | 250–400 ms | Preserve anchor and breadcrumbs |
| 07 ↔ 05A transition | 450–700 ms | Selected components retain identity/color; can simplify to crossfade initially |
| Camera follow focus | 300–600 ms | Optional and interruptible |
| Reduced motion | 0–100 ms | No camera flight or nonessential moving trails |

These are design suggestions, not enforced timing facts. Replay clock speed is independent of UI transition duration. Do not use arbitrary animation timing to calculate transaction latency.

Offer a restrained Visual intensity control later if needed. The default already balances cinematic depth with daily-use legibility. Muting visual effects must not remove status or relationship meaning.

## 7. Component and state inventory

| Component | States / behavior |
| --- | --- |
| Source badge | Demo, Recorded, Live; never hidden in presentation mode |
| Connection/freshness | Connected, delayed, reconnecting, disconnected, gap, last update |
| Search | Idle, typing, results, empty, error; service and full trace-ID entry |
| Territory/glyph | Default, hover, selected, collapsed, expanded, stale, unknown |
| Relationship | Declared, observed, selected trace, response, lineage, unresolved |
| Span/event | Pending if observable, active at playhead, complete, failed, canceled, unknown, late |
| Inspector | Empty guidance, component, trace, span, permission/availability restriction |
| Timeline | Playing, paused, scrubbing, buffered live updates, end, resume live |
| Scene | Loading, ready, partial, empty, error, WebGL unsupported |
| Breadcrumb/back | Preserved context, direct-link fallback, unavailable prior system |

## 8. Image-specific corrections

Use the pictures for aesthetic fidelity, not as a schema. In 07 the violet deployment line near Vector DB is visually ambiguous: connect it to actual deployment/inference identity in the implemented model. Some generated arrowheads appear bidirectional; use actual observed direction. The visible training/model pipeline is lineage context, not a synchronous request chain. The 05A focus plane must not imply quantitative scene distance. Any screenshot labels that conflict with fixtures/contracts are corrected in the app.

## 9. Fidelity review

Capture both views at the two baseline desktop sizes. Compare silhouette, density, palette, selected-path prominence, typography and panel placement with the references. Verify the same interaction in reduced motion and with the inspector collapsed. Judge faithfulness at the experience level; rebuild practical geometry rather than chasing photoreal reflections that hurt performance.

`design/tokens.json` contains proposed defaults. They are hand-selected to match the direction; they were not extracted pixel-for-pixel from the images.
