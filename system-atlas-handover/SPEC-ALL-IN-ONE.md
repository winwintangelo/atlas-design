# System Atlas: full specification (all-in-one)

This file concatenates `docs/01`–`docs/10` so an agent can load the whole spec at once. Start with `00-START-HERE.md` for the build rules and source-of-truth order. File paths in this text are relative to the package root.

## Contents

1. 01 · Intent and goals
2. 02 · Domain model: one metaphor, any IT system
3. 03 · Design system
4. 04 · Look and feel of the 3D scene
5. 05 · Interaction specification
6. 06 · Data contracts and APIs
7. 07 · Architecture and build guidance
8. 08 · Acceptance criteria and milestones
9. 09 · Open questions and risks
10. 10 · Cinematic references (what we borrow, what it becomes)


---

# 01 · Intent and goals

## The owner's intent, in one paragraph

Build an interface that makes a real, complex IT system feel like stepping inside a computer from a science-fiction film: immersive, beautiful and a little over the top. Every number on it must stay true and checkable. People should be able to see the whole system, fly down to one component, find a specific transaction, replay it visually, and read exactly what was sent and received at every hop. **"Make the presentation cinematic and extravagant; make every operational claim inspectable and grounded in data."** The first system is an AI training and inference platform. The design must carry over to financial platforms, distributed applications and enterprise infrastructure.

## Who uses it, and for what

| User | Job to be done | Where it happens |
|---|---|---|
| On-call / SRE engineer | "Why was this request slow or failed? Show me the hop, the evidence and the payload." | Search → replay → payload |
| Platform / integration engineer | "What runs over this connection, how healthy is it, what do real calls look like right now?" | Click an arc → functions → live tail |
| Architect / tech lead | "What does the system look like and where is the load?" | City and district views |
| Leadership / demo audience | "Show me the system." Cinematic, but honest | Cinematic mode, replay |
| ML / data engineer (AI systems) | "Which data, job and model produced this answer?" | Lineage layer (violet) |

## Goals

1. **Understand the architecture and current activity at a glance.** Districts, buildings, arcs and queues are readable in under 10 seconds.
2. **Move across levels of detail** without losing your place: system → subsystem → component → instance → one execution.
3. **Narrow to one or a few transactions** by search and filters, then replay one visually.
4. **See parallel work, queues, retries, failures and streaming** as distinct, recognisable visual structures.
5. **Find where time went and which evidence explains it.** Every conclusion cites its receipts.
6. **Read the exact request and response** for every call of a transaction, safely (redacted by default).
7. **Inspect any integration (arc):** its functions, health, and a live tail of real sampled calls.
8. **Trace lineage** (data → build/train → artifact → deployment → request) where the domain has it.
9. **Generalise to any IT system** through data, not code changes.

## Non-goals (v1)

- Not a dashboard replacement. Charts stay in the existing tools; the Atlas links out.
- No editing of infrastructure from the Atlas.
- No AI-generated "root cause" claims. Inference text is allowed only when it cites evidence ids, and is labeled as inference.
- No VR/XR in v1. The interaction model is mouse, keyboard and trackpad. Keep gestures portable.

## Non-negotiable principles (the grounding contract)

1. Every lit, moving or colored element maps to exactly one datum: a span, metric, event, log line or config value. Click it, get the receipt.
2. Motion encodes measured rate. If data stops, motion stops.
3. Positions are stable during an investigation. Only the camera moves.
4. Cinematic mode changes rendering only: bloom, particles, haze, beams, camera drift. Never values, positions or what is shown.
5. Conclusions are labeled as inferences and cite the evidence they rest on (`E1`–`E5` style codes).
6. Sensitive content is redacted on the server. Reveal is explicit, role-gated and audited.

## Success measures (proposed; confirm with the owner)

| Measure | Target |
|---|---|
| Time to diagnosis on a replayed incident (5 on-call engineers, vs current tracing UI) | ≥ 40% faster |
| First-time user can find and replay a failed transaction | < 60 s, no help |
| Frame rate, 1080p, reference fixture, mid-range GPU | ≥ 60 fps; ≥ 30 fps at 2,000 buildings |
| New domain onboarded (adapter + fixture, no renderer changes) | ≤ 2 days |

## The reference story every build must be able to tell

Fictional platform **Vesper**, region us-east-2, 14:02:17 UTC. Request `req_7f3a9c21` (streaming chat) took **1,410 ms to first token against an 800 ms target**.

- **840 ms** were spent waiting in the canary model's queue. 37 requests were ahead.
- **Why:** canary replica c-1 was evicted at 14:00:52 after a GPU fault (E1). The queue jumped from 3 to 37 (E2). The router kept sending 10% of traffic to the canary because its weight is fixed and not capacity-aware (E3).
- **Also:** vector shard vs-03 timed out once at 250 ms and the call was retried on a replica (E4), during a compaction (E5).
- **Lineage:** the answering model `vesper-chat-3.2` came from training run `tr-2291` on dataset `support-sft-v14`, deployed as canary `dep-118`.

All numbers live in `fixtures/`. Span ids in the fixtures and the A2 mockup are canonical (s8 = vector attempt 1, s11 = queue wait). Earlier concept boards used different span numbers; ignore those.

## Design history (so you know what was rejected)

Five concepts were explored on the same data: **A** Data Metropolis (city), **B** Orbital Observatory, **C** Exploded Engine, **D** Living Network, **E** Time-Space Room. The owner chose **A**. Iteration **A2** added the camera, search, replay, payloads and arc inspection. Build A2. Ideas from B–E may return later as optional views. Don't build them now.

## Appendix A · Original brief (verbatim, as received; it was cut off at section 4)

> Act as a senior product designer, cinematic interface designer, and interactive 3D visualization expert.
>
> Design a futuristic, interactive 3D environment that represents a real, complex IT system. Use an AI training and inference platform as the initial example, but create a visual language that could also represent financial platforms, distributed applications, or enterprise infrastructure.
>
> The experience should feel like stepping inside a sophisticated computer system from a science-fiction movie: immersive, powerful, beautiful, and a little over the top.
>
> **Make the presentation cinematic and extravagant; make every operational claim inspectable and grounded in data.**
>
> **1. The experience I want**
>
> A user should be able to:
>
> - Understand the overall system’s architecture and current activity.
> - Move through its components at different levels of detail.
> - Select a real request and follow its execution across services.
> - Observe responses, parallel operations, queues, retries, failures, and streaming output.
> - Discover where time was spent and what evidence explains a problem.
> - Explore how training data, training jobs, model versions, deployments, and inference requests connect.
>
> The 3D environment should dominate the screen. Supporting controls, timelines, and inspection panels should help users understand what they are seeing.
>
> **2. Create at least five genuinely different visual concepts**
>
> Produce actual high-fidelity visual mockups for all five directions below. Each must have a distinct spatial organization, geometry, materials, camera behavior, and interaction model. Changing the colors of the same layout does not count.
>
> Use the same underlying architecture and example request in every concept so they can be compared fairly.
>
> **Concept A — The Data Metropolis**
>
> A sprawling digital city:
>
> - Services become buildings; clusters become districts.
> - Data stores become vaults or archives.
> - Queues become visible transit hubs.
> - Requests travel through elevated conduits and illuminated routes.
> - Zoom from the entire city into one service and then one execution.
>
> Inspiration: the exaggerated cyberspace imagination of *Hackers* and the luminous architecture of *TRON: Legacy*.
>
> **Concept B — The Orbital Observatory**
>
> A vast spatial command environment:
>
> - Regions and clusters form distinct orbital systems.
> - Services occupy anchored stations.
> - Requests form trajectories between stations.
> - Selected dependencies assemble into a focused constellation.
> - Nested shells expose infrastructure, services, and individual instances.
>
> Inspiration: the futuristic command-interface atmosphere of *Oblivion* and *Iron Man*. Preserve stable positions during investigation.
>
> **Concept C — The Exploded Computing Engine**
>
> The platform becomes an immense precision machine:
>
> - Functional subsystems appear as interconnected mechanical modules.
> - Transparent housings reveal internal processing stages.
> - GPU workers form dense compute assemblies.
> - Users separate layers, inspect modules, and follow execution through the machine.
>
> Inspiration: Tony Stark’s holographic engineering interfaces. Emphasize tactile inspection, cutaways, and purposeful mechanical motion.
>
> **Concept D — The Living Network**
>
> An elegant, bioluminescent computational ecosystem:
>
> - Services form branching structures.
> - Data moves through luminous channels.
> - Queues accumulate in visible reservoirs.
> - Activity, congestion, and failures alter local motion and appearance.
> - Selecting a request isolates its route through the larger organism.
>
> Draw on *The Matrix*’s computational atmosphere and organic science-fiction imagery. Clearly present this as an architectural metaphor, not a depiction of an AI’s thoughts or consciousness.
>
> **Concept E — The Time-Space Investigation Room**
>
> A spatial environment organized around execution and time:
>
> - Components occupy stable lanes or layers.
> - Requests become branching ribbons through time.
> - Parallel operations separate visibly.
> - Delays, retries, and failures create inspectable structures.
> - Users scrub backward and forward to reconstruct an incident.
>
> Inspiration: *Minority Report*’s spatial investigation interfaces, combined with a futuristic operations room.
>
> You may improve these concepts, but preserve their differences.
>
> **3. Cinematic direction**
>
> Refer explicitly to relevant movie or TV computer, hacking, or holographic interface scenes. Explain which visual qualities you borrow and how they become useful interactions.
>
> Include *TRON: Legacy*’s Encom boardroom hacking sequence as one reference. Other references can inform spatial manipulation, atmosphere, typography, and motion.
>
> Create an original design with:
>
> - Dramatic depth, lighting, scale, and carefully controlled bloom.
> - Translucent surfaces, luminous edges, layered geometry, and flowing data.
> - Strong silhouettes and recognizable component types.
> - Smooth transitions between system, subsystem, service, and instance views.
> - Confident typography and readable labels.
> - Moments of spectacle when a request is isolated, a subsystem opens, or an incident is replayed.
>
> Allow users to adjust visual intensity between **Operational** and **Cinematic** modes without changing the underlying information.
>
> **4. Use a credible example

## Appendix B · Owner feedback on iteration 1 (verbatim)

> the concept a the data metropolis cinematic is very close to what I'm looking for, please keep it, and a few feedback, 1) support zoom in /out, rotate 2) by searching and filtering, I should be able to narrow down to one or a few specific transactions, then I can select a specific transaction and visually replay it, and view the exact requests / response for that transaction. 3) if I select the integration lines (arc) between components, I can view the functions as well as samples of real requests in real time. 4) I really like current design system and look and feels, please keep consistency while adding new features.

## Appendix C · Owner note on scope (verbatim)

> this likely will be expanded to other type of IT systems, not solely for an AI system.


---

# 02 · Domain model: one metaphor, any IT system

The renderer knows only the types in `schema/atlas.types.ts`. Adapters turn a real system into those types. **No domain words in renderer code.**

## The metaphor

| Atlas object | Generic meaning | Visual archetype | Encodings |
|---|---|---|---|
| **System** | One environment in one region | The whole city on a dark grid | Header headline numbers |
| **District** | Subsystem: domain, namespace, bounded context | Dashed ground plate + display-font label | Tone: cyan (runtime), violet (data/lineage/training), steel (telemetry), amber (queues) |
| **Component** | Service, gateway, store, queue, job, compute pool | Building | **Height = req/s** (log scale). Edge color = health |
| **Instance** | Pod, VM, node, GPU, shard, replica, partition | Window (front face) or blade | **Lit = busy.** Utilisation sets the lit fraction. Dark coral = down/cordoned |
| **Data store** | DB, cache, object/vector store, ledger | Vault (narrow deep block) or archive (long low bars) | Shards as paired towers (primary/replica) |
| **Queue / scheduler** | Queue, topic, broker, scheduler | Transit hub: two concentric ground rings + towers | **One car = one waiting request.** Outer ring = lane under watch |
| **Integration** | Directed caller → callee connection | Elevated arc | **Width + dash speed = rate.** Color = state (see 04) |
| **Function** | Operation on an integration: RPC method, route, topic, SQL template, message type | Row in the Integration tab | rate, p50, p99, error % |
| **Transaction** | One end-to-end trace: request, payment, order, job run | Route of white arcs | Status, headline latency, SLO line |
| **Call** | One span on one integration | Packet on an arc | Out (white), back (cyan), failed (coral), queue ride (amber), stream (dashed) |
| **Evidence** | Event, metric, config, span, log | Code chip `E1` + receipt | Cited by every inference |
| **Lineage** | Provenance chain | Violet dashed arc + registry building | Optional per domain |

## Mapping to other IT systems

The same model renders all of these. Adapters only supply data.

| Atlas object | AI platform (reference) | Payments / financial | E-commerce microservices | Kubernetes / infrastructure | Data pipeline / ETL | Enterprise integration / mainframe |
|---|---|---|---|---|---|---|
| District | Edge, identity, routing, retrieval, compute, training | Edge, tokens, risk, orchestration, schemes, ledger, settlement | Catalog, cart, checkout, payments, fulfilment | Namespaces, node pools | Ingest, transform, warehouse, serve | Business domains, ESB, mainframe |
| Building | router, model-server, vector-store | payment-orchestrator, fraud-scoring, scheme-adapter | cart-svc, checkout-svc | Deployments, StatefulSets, DaemonSets | DAG tasks, Spark jobs | Adapters, CICS programs, batch jobs |
| Window | Pod, GPU node | Pod, JVM, thread pool | Pod | Pod / container | Executor / worker | CICS region, MQ channel |
| Vault | Vector store, data lake | Ledger DB, token vault (HSM) | Product DB, cache | PV, etcd | Warehouse tables, lake partitions | DB2, VSAM |
| Transit hub | GPU scheduler queue | Kafka topic, settlement queue | Order queue | Pending-pod queue, HPA backlog | Kafka / Airflow queue | MQ queue |
| Transaction | Inference request | Card authorization | Checkout order | Rollout or request | Pipeline run | Business transaction |
| Typical incident | Canary lost a replica → queue | Issuer timeout → stand-in | Payment provider 5xx | Node pressure eviction | Late partition, backfill | MQ backlog |
| Lineage | Data → training → model → deploy | Source → report (regulatory data lineage) | Build → release | Image → rollout | Dataset lineage | Interface version |
| Payload redaction | Prompts, outputs | **PAN, CVV (PCI DSS)**, account ids | Addresses, emails | Secrets, env vars | Row samples (PII) | Customer records |

A worked second domain is in `fixtures/example.payments.json`. It must render with zero renderer changes (milestone M6).

## Rules for adapters

1. **Districts are chosen by data, not code.** Source order: an explicit `atlas.district` attribute, then the namespace / service.namespace, then a configurable regex on the service name, then `misc`.
2. **Component type comes from evidence.** `db.system` spans → datastore. `messaging.*` → queue. Ingress or gateway → gateway. Batch or cron → job. GPU or node fleets → node-pool. Otherwise service.
3. **Integrations are aggregated** from client/server span pairs, messaging producer/consumer pairs and DB client spans, over a sliding 5-minute window. Direction is caller → callee.
4. **Functions are the operation names:** `rpc.method`, `http.route`, `messaging.destination.name`, normalised SQL, ISO message type.
5. **Units belong to the adapter.** Pre-format `p50`/`p99` with units ('18 ms', 'lag 6 s'). Headline metric names are data (`ttftMs`, `authMs`, `durationMs`).
6. **Evidence ids** are short and stable per investigation (`E1`…), and each carries a `source` the UI can link to.
7. **Never fabricate.** If a metric is missing, send `null`. The UI shows `—`.

## OpenTelemetry mapping (default adapter)

| OTel source | Atlas field |
|---|---|
| `service.name` | Component id / label |
| `service.namespace`, `k8s.namespace.name`, or attribute `atlas.district` | District |
| `k8s.pod.name`, `host.name`, `k8s.node.name`, GPU index attrs | Instance |
| Span pair CLIENT (caller) ↔ SERVER (callee) | One Call on Integration(caller → callee) |
| PRODUCER / CONSUMER spans + `messaging.destination.name` | Integration via the queue component; consumer lag → queue depth |
| `db.system`, `db.name` on CLIENT spans | Integration to a datastore component |
| `rpc.method` / `http.route` / `db.statement` (normalised) | Function name |
| Span status ERROR / `http.status_code` ≥ 500 / `rpc.grpc.status_code` ≠ 0 | Call status `fail`, note = status text |
| Span links with `retry` semantic or same parent + same callee | `attempt` numbering |
| Span events `atlas.payload.request|response` (opt-in, redacted by a collector processor) | `Payload` |
| Resource + metric `*_queue_depth` | Transit hub car count |
| Service-graph connector metrics (calls, failures, latency) | Integration rate / health / functions |

## Reference data

| File | Content |
|---|---|
| `fixtures/topology.ai-platform.json` | 13 districts, 20 components, 78 instances, 5 evidence items, lineage chain, camera preset, reference layout in world units |
| `fixtures/integrations.ai-platform.json` | 16 integrations with functions and 5-minute stats |
| `fixtures/transactions.ai-platform.json` | 7 transactions (slow ×2, healthy ×2, errors 503/400/429), 78 calls with redacted payloads |
| `fixtures/example.payments.json` | A complete second domain: topology, 11 integrations, 1 transaction (issuer timeout → stand-in) |


---

# 03 · Design system

Exact values live in `tokens/tokens.json` and `tokens/tokens.css`. This page explains how to use them. The owner said: *"I really like current design system and look and feels, please keep consistency."* Treat this page as locked.

## Personality

Night city, black glass, light at the edges. Precise and engineered, never playful. The drama comes from **light, depth and motion**, not decoration. Text is small, crisp and dense. Numbers are monospaced.

## Color

### Surfaces
| Token | Value | Use |
|---|---|---|
| `bg.void` | `#02050a` | App root and 3D scene |
| `panel.fill` | `rgba(2,7,13,.70)` Cinematic / `.90` Operational | All floating panels (backdrop blur 6 px allowed) |
| `panel.borderCyan` | `rgba(86,214,255,.22)` | Explorer, camera bar, replay bar |
| `panel.borderWhite` | `rgba(242,251,255,.30)` | Inspector: the "evidence" surface is white-edged |
| `bg.code` | `rgba(1,4,9,.85)` | Payload viewer well |

### Ink
| Token | Value | Contrast on `bg.void` | Use |
|---|---|---|---|
| `ink.strong` | `#f2fbff` | 19.5:1 | Selected ids, big numbers |
| `ink.primary` | `#e9f2fb` | 18:1 | Default text |
| `ink.body` | `#d3e1ee` | 15.3:1 | Dense body text |
| `ink.secondary` | `#a9bccd` | 10.5:1 | Secondary lines |
| `ink.tertiary` | `#7d93a8` | 6.4:1 | Section labels, captions |
| `ink.muted` | `#6f859b` | 5.4:1 | Punctuation, placeholders only |
| `ink.disabled` | `#4c5f72` | 3.1:1 | Not-yet-reached rows. Never the only cue |

### Semantic colors (fixed meaning across the whole product)
| Meaning | Token | Value | Always paired with |
|---|---|---|---|
| The selected transaction / request | `semantic.request` | `#f2fbff` | Glow + thicker stroke |
| Healthy flow, primary accent, focus | `semantic.flow` | `#56d6ff` | Moving dashes |
| Response / return | `semantic.response` | `#7fe1ff` | Direction (moves back to caller) |
| Queue, waiting, degraded, SLO breach | `semantic.degraded` | `#ffb340` | Hatching on bars, "SLOW" badge, ring cars |
| Failure, timeout, evicted | `semantic.failure` | `#ff6b7d` | Spark burst, ✕ scar, status code text |
| Lineage, provenance, control plane | `semantic.lineage` | `#b69bff` | Dashed line |
| Telemetry components | `semantic.telemetry` | `#8fb3d1` | — |

Amber and coral differ in lightness as well as hue, so they stay distinguishable for color-vision deficiencies. Every state also has a shape or text cue.

## Typography

| Role | Family | Size / weight | Case / tracking | Use |
|---|---|---|---|---|
| Display | Michroma | 10–15 px, 400 | UPPERCASE, 0.12–0.24em | Brand, district names, panel titles, zoom-stop buttons on docs boards |
| UI | Saira | 12–15 px, 300–600 | Sentence case | Descriptions, buttons with words, list metadata |
| Data | JetBrains Mono | 10.5–26 px, 400–700 | — | **Every** id, number, time, function name, payload, axis label, section label |
| Section label | JetBrains Mono | 11 px | UPPERCASE, 0.16em, `ink.tertiary` | `TRANSACTIONS`, `CALLS · CLICK TO JUMP`, `PAYLOAD` |

Load from Google Fonts (URL in tokens). Fallbacks: `system-ui` / `ui-monospace`. Use tabular numbers for all metrics.

## Shape, line and space

- **Radius 0 everywhere.** Exceptions: status dots, pulse rings.
- **Hairlines:** 1 px borders. Selected rows get a white 60% border. Status rows get a 3 px left accent in the status color.
- **Spacing scale:** 2, 4, 6, 8, 10, 12, 14, 18, 24 px. Panel padding 16. Screen gutter 24.
- **Control heights:** 36 px (camera bar, segmented controls), 44 px (play, search), 30 px (chips), 26 px (call rows).
- **Icons:** inline SVG, stroke 1.4 px, `ink.body` color, 16–18 px. No icon fonts, no emoji.

## Components (as in the A2 mockup)

| Component | Anatomy | States |
|---|---|---|
| **Panel** | Fill + 1 px border, 16 px padding, section labels in mono caps | Cinematic 70% / Operational 90% opacity |
| **Segmented control** | Joined 36 px buttons in a 1 px frame | On: `flow` border + 16% `flow` fill + `ink.strong` text |
| **Chip** | 30 px, mono 11.5 px | Same as segmented |
| **Result row** (transaction) | Id + headline latency / meta + status badge / 5 px mini critical-path strip | Selected: white border, 7% white fill. 3 px left edge in status color |
| **Status badge** | Mono 10.5 px, 1 px border in status color: `SLOW`, `OK`, `503`… | — |
| **Stat tile** | Mono value 15–16 px + 11.5 px caption | Breach: amber border + `rgba(40,26,8,.45)` fill. Error: coral border |
| **Call row** | Index · function (ellipsis) · duration | Current: white 2 px left edge + 10% white fill. Not reached: muted text |
| **Payload viewer** | Mono 11.5/17 px, `white-space: pre`, scroll, syntax tokens (`code.*`) | Redacted strings in amber; error tokens in coral |
| **Tabs** | Two 38 px text tabs, 2 px underline | Active underline: white (Transaction), cyan (Integration) |
| **Scene label** | Display caps title (10 px) + mono line (11.5 px) in a dark box with a 1 px tone border; 1 px leader line down to the anchor | Fades by zoom level and viewport |
| **Arc handle** | 10 px rotated square (diamond) in a 28 px hit target, at the arc midpoint | Selected: `flow` fill + white border |
| **Call bubble** | Dark box, 3 px left edge in state color: `→ function` / state line | Flips left when near the inspector |
| **Pulse ring** | 46 px circle, 2 px border, scale 0.6 → 1.9, fade out over 1.3 s | White ok / coral fail |

## Motion

| Token | Value | Use |
|---|---|---|
| `motion.flight` + `easeFlight` | 1100 ms, `cubic-bezier(.7,0,.2,1)` | Zoom-stop flights; labels follow with the same curve |
| `motion.quick` | 300 ms | Zoom ± buttons |
| `motion.orbitStep` | 240 ms | Orbit/tilt buttons (eased) |
| `motion.pulse` | 1.2 s | Active building glow |
| `motion.ring` | 1.3 s ease-out | Callee pulse ring |
| `motion.replayTrack` | 16 s at 1× | Full replay timeline |
| `motion.flowDash` | `clamp(1.6, 9 − 1.6·log10(rate), 9)` s | Idle arc dash cycle: busier = faster |

`prefers-reduced-motion`: no flights (cut), no dash flow, no pulses, no motes. Replay steps call-to-call instead of animating.

## Intensity modes

| Parameter | Operational | Cinematic |
|---|---|---|
| Bloom | Low (edges only) | High (halos on edges, arcs, packets) |
| Haze, vignette, motes, light beam over active node | Off | On |
| Horizon glow | 0.35 | 0.9 |
| Grid opacity near / far | 0.12 / 0.04 | 0.20 / 0.07 |
| Panel opacity | 90% | 70% |
| Window brightness | 0.8× | 1.0× |
| Idle camera drift | Off | Optional, ≤ 0.5°/s, stops on any input |

**Never changes:** values, positions, which items are visible, color meanings, labels.

## Don'ts

No rounded corners, gradient washes, emoji, glassmorphism blobs, drop-shadow cards, rainbow palettes, decorative numbers, fake status bars, or film UI, logos or typefaces copied from the referenced films.


---

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


---

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


---

# 06 · Data contracts and APIs

Types: `schema/atlas.types.ts`. Examples: `fixtures/`. The front end must also run fully **offline from fixtures** (`?source=fixtures/ai-platform`) for development, demos and visual tests.

## Endpoints (proposed; the backend team owns the final shape)

| Method & path | Returns | Refresh | Notes |
|---|---|---|---|
| `GET /atlas/systems` | `SystemInfo[]` | on load | System switcher (future) |
| `GET /atlas/systems/{sys}/topology?at=` | `Topology` | on load; every 5 min | Includes districts, components, instances, integrations (+ functions + 5-min stats), lineage, evidence |
| `GET /atlas/systems/{sys}/metrics?at=` | partial `Topology` (metrics, health, queue depths, instance util) | every 5 s (SSE preferred) | Drives heights, windows, cars and arc speeds |
| `GET /atlas/systems/{sys}/transactions?q=&status=&route=&from=&to=&limit=50` | `{ total: number, items: TransactionSummary[] }` | on query change (debounced) | `q` uses the grammar in 05 §4. Server-side search |
| `GET /atlas/transactions/{id}` | `TransactionDetail` without payload bodies | on select | Calls sorted by `startMs` |
| `GET /atlas/transactions/{id}/calls/{callId}/payload` | `Payload` (redacted) | on demand | Lazy-load the current call; prefetch ±2 neighbours |
| `POST /atlas/transactions/{id}/calls/{callId}/payload:reveal` body `{reason}` | `Payload` (unredacted, with `revealAudit`) | on demand | Role-gated; writes an audit record; 403 → UI message |
| `GET /atlas/integrations/{id}?window=5m` | `Integration` + `sparkline: number[]` (p99, 40 points) | on select; every 15 s | |
| `GET /atlas/integrations/{id}/tail?fn=` (SSE or WebSocket) | stream of `CallSample` | live | Server-side sampling (default 1:50) and redaction. Max 20 msg/s to the client |
| `GET /atlas/evidence?ids=E1,E2` | `Evidence[]` | on demand | Each has a `source` the UI deep-links to (logs, metrics, config) |

## Sample payloads

### Call with payload (from `fixtures/transactions.ai-platform.json`)
```json
{
  "id": "s8",
  "integrationId": "retr-vec",
  "function": "vector.v1.Shard/Query",
  "callee": "vector-store",
  "startMs": 48, "endMs": 298,
  "status": "fail", "kind": "rpc",
  "note": "DEADLINE_EXCEEDED", "attempt": 1,
  "target": "vector-store/vs-03/primary",
  "payload": {
    "redacted": true,
    "request":  "{\n  \"shard\": \"vs-03\",\n  \"replica\": \"primary\",\n  \"attempt\": 1,\n  \"k\": 8,\n  \"deadline_ms\": 250,\n  \"vector\": \"[1024 floats]\"\n}",
    "response": "{\n  \"error\": {\n    \"code\": \"DEADLINE_EXCEEDED\",\n    \"message\": \"shard vs-03/primary exceeded 250 ms\",\n    \"compaction\": \"running since 13:57:40\"\n  }\n}"
  }
}
```

### Live tail sample
```json
{ "at": "2026-10-24T14:03:04.103Z", "traceId": "042f56", "integrationId": "retr-vec",
  "function": "vector.v1.Shard/Query", "status": "DEADLINE_EXCEEDED", "latencyMs": 250, "sampleRate": "1:50" }
```

## Payload capture, redaction and audit (must-haves)

1. **Capture is opt-in per service and per function.** Default: headers + body shape, with values redacted. Capture policy is configured in the collector, not the UI.
2. **Redaction happens on the server** before storage or transport:
   - Free-text user content → `[redacted · N tokens]`.
   - Secrets and auth headers → `••••` + last 4.
   - Card data → `[redacted · PCI]`.
   - Emails, phones and addresses → pattern masks.
   - Redaction rules are data (per system), not code.
3. **Reveal:**
   - requires a role (e.g. `incident-responder`) and a free-text reason
   - is logged with `who / when / what / reason`
   - returns content for **that one call only**
   - expires on navigation
4. **No payloads in browser storage, logs or analytics.** In-memory cache only, cleared when the transaction changes.
5. **Size limits:** truncate at 256 KB for display, with an audited full download.
6. Mark every UI payload with its state: `user content redacted` or `content revealed · logged`.

## Adapter checklist (per new system type)

- [ ] District rule configured (attribute / namespace / regex)
- [ ] Component type rules (datastore, queue, gateway, job, pool) verified on a sample
- [ ] Headline metric chosen (`ttftMs`, `authMs`, `durationMs`…) with its SLO
- [ ] Route/variant attribute chosen (canary, version, issuer path, region)
- [ ] Function naming normalised (no ids in names, e.g. `/orders/{id}`)
- [ ] Redaction rules for that domain's sensitive fields
- [ ] Evidence sources wired (events, config, logs) with deep links
- [ ] A fixture file generated from a real (scrubbed) incident for visual tests


---

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


---

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


---

# 09 · Open questions and risks

Don't invent answers to open questions. Build behind an interface, stub it, and list the stub in the PR.

## Open questions (owner to decide)

| # | Question | Default until decided |
|---|---|---|
| Q1 | Which tracing backend feeds the Atlas (OTel Collector → Tempo / Jaeger / vendor)? | Fixture source + an OTel adapter interface |
| Q2 | Payload capture policy: which services and functions, retention, storage location | Capture off; fixtures only |
| Q3 | Roles: who can reveal content, and is a second approver needed? | Single role `incident-responder`, reason required |
| Q4 | Multi-region and multi-system: one city per region, or regions as islands in one scene? | One system + region per view, with a switcher |
| Q5 | Scale ceiling for v1 (components, instances, arcs) | 2,000 buildings, 400 arcs |
| Q6 | Is the headline metric configurable per system (TTFT, auth latency, job duration)? | Yes, from data (`metrics` key + SLO) |
| Q7 | Should Concept E's time wall return as an optional "investigation" mode? | Not in v1 |
| Q8 | Auth / SSO and tenancy (who sees which systems and tenants) | Behind a `useSession()` stub |
| Q9 | Branding: product name ("System Atlas") and whether the "VESPER" sample brand appears anywhere | "System Atlas"; sample data names stay in fixtures only |
| Q10 | Success targets in 01 are proposals | Treat as proposals |

## Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Payload capture leaks sensitive data | Severe (compliance) | Server-side redaction, opt-in capture, audited reveal, no client persistence (06) |
| Perspective makes heights and widths hard to compare | Misreading load | Exact numbers on labels and in panels; Operational mode; elevation presets; consider an orthographic toggle |
| Label and arc clutter at scale | Unreadable city | Priority-based label collision, arc aggregation at CITY level, LOD (04) |
| WebGL performance on weak laptops | Choppy replay | Instancing, shader windows, packet pool, budgets and a perf CI gate (07) |
| Auto-layout for unknown systems looks worse than the hand-tuned fixture | First impression | Deterministic treemap + flow ordering; persisted, hand-adjustable layouts |
| Cinematic effects mistaken for data | Trust | The grounding contract, motes and haze only in Cinematic, inference labeled with evidence ids |
| "Live" samples are simulated in the mockup | Misplaced expectations | The mockup labels sampling; production needs the real tail endpoint (06) |
| Domain words creeping into code | Blocks other system types | G-2 grep test |


---

# 10 · Cinematic references (what we borrow, what it becomes)

Borrow **qualities**, never artifacts: no film UI, logos, typefaces or characters. Every borrowed effect must encode data, or live only in Cinematic mode.

| Film / scene | Borrowed quality | Becomes in the Atlas |
|---|---|---|
| **TRON: Legacy (2010), the Encom boardroom hack.** Sam's clip of his dog Marvin takes over the OS-12 launch projection, and Edward Dillinger Jr. works the glass light table to shut the hack down. Graphics by Digital Domain: Bradley G. Munkowitz, Jake Sargeant, David Lewandowski; Josh Nimoy coded the light table | Grid-built layouts on black glass; a wall display and a tabletop working as one instrument; fine luminous line work | The scene is the wall, the panels are the table. Selecting a transaction is a trace: one bright route through a dimmed city. From the same film's Grid: edge-lit volumes, and edges carry status |
| **Hackers (1995).** Flights through the Gibson's towers | City-scale data architecture, swooping camera | Continuous flights between zoom stops; never a cut |
| **Jurassic Park (1993).** "It's a UNIX system": the 3D file-system browser | Blocks on a plane, height as quantity, readable by a child | Height = rate, lit windows = utilisation |
| **Oblivion (2013).** Vika's light table; screen graphics directed by GMUNK | Restraint, thin lines, one palette, small precise type | Typography and panel discipline; stable positions |
| **Iron Man 2 (2010).** Tony pulls apart the holographic Expo model | Grab, spread, cutaway | Floor cutaway; future "explode a component" interaction |
| **Minority Report (2002).** Scrubbing precog footage on a glass wall | Time you can grab and scrub | Replay bar scrubbing, evidence pinned to moments |

Sources: [GMUNK, TRON Board Room](https://gmunk.com/TRON-Board-Room) · [Motionographer, Oblivion screen graphics](https://motionographer.com/2013/04/19/bradley-g-munkowitz-oblivion-screen-graphics)

## Spectacle budget

Spectacle is earned only at three moments, and each must still show real data:
1. **A transaction is selected:** the route ignites and the packet launches from the client.
2. **A zoom stop is reached:** the flight lands, and the floor cutaway slides in at FLOOR.
3. **A failure happens during replay:** spark, coral return, scar.
