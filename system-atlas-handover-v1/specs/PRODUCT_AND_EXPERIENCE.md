# Product and experience specification

## 1. Intent and objectives

System Atlas is a working title for an interactive 3D representation of a real, complex IT system. The owner wants the compelling, slightly extravagant feeling of cinematic computing interfaces, while being able to inspect real system behavior. The experience should support both investigation and an engaging live demonstration.

Initial domain: AI training and inference. Generalize component types and relationships so payment, identity, data-processing or other distributed systems can use the same product. The visual surface is an observability and explanation layer over existing systems; it does not replace their execution engines.

| Objective | User outcome | Evidence of success |
| --- | --- | --- |
| Understand architecture | Locate a component, its system boundary and dependencies | A new viewer can follow territory → service → instance without losing orientation |
| Understand execution | Follow a selected real transaction from entry to result | Every highlighted hop is inspectable against trace evidence |
| Explain delay or failure | Separate processing, waiting, retries and missing data | Queue wait and relevant spans are visible in both scene and timeline |
| Demonstrate live activity | Present one transaction while it progresses | Arrival, completion, late data and connection state are honestly represented |
| Navigate scale | Move from whole-system context to one operation and back | Stable grouping, filtering, isolation and preserved return context |
| Preserve trust | Distinguish facts, inference and simulation | Source badges, evidence quality and unknown states are always accessible |

## 2. Decisions and assumptions

**Owner-approved:** 07 is the whole-system view; 05A is the specific-transaction introspection/live-demo view. Interactive 3D, cinematic presentation, and real request/response tracing are central requirements. Final selection supersedes all earlier concepts.

**Recommended defaults:** desktop-first, browser-based, read-only; keyboard/mouse navigation; dark theme; use the supplied synthetic AI-system fixtures for the first build. These are practical implementation proposals, not statements that the owner selected a framework, provider, hosting platform, telemetry backend or deployment environment.

**Out of scope for the first build:** modifying infrastructure, issuing production requests, training models, executing deployments, root-cause certainty from correlations, autonomous remediation, and visualization of internal AI thoughts. No authentication bypass or arbitrary payload harvesting is implied.

The brand name, exact icons, component spacing and proposed tokens are adjustable. Preserve the two visual identities, not accidental text errors or telemetry inventions in the generated references.

## 3. Shared product frame

Use one app shell with a clear view switch: **System** (07) and **Transaction** (05A). Top controls identify system, environment, source and time context. A transaction cannot silently change the environment or time range selected in System view.

Proposed screen regions at 1440 × 900 and 1920 × 1080:

- Top strip: product name, System/Transaction view switch, environment, search, source badge and connection/freshness.
- Primary scene: approximately 70–80% of the workspace while a compact inspector is open; more when collapsed.
- Context tools: small, view-specific controls near the scene edge; no floating menu cloud.
- Inspector: a collapsible 300–360 px right panel. Service overview in 07; selected transaction/span evidence in 05A.
- Bottom: replay/live-time controls and an expandable exact 2D trace waterfall in 05A. System time range and aggregate context in 07.
- Orientation/breadcrumbs: system → territory → component → instance as appropriate, with Overview/reset and Back to system.

Source mode is independent of view: **Demo**, **Recorded**, or **Live**. Playback and connection status are also independent; “Live paused” is meaningful. Source labels must remain visible in screenshot/presentation mode.

## 4. View 07 — whole-system Topographic Atlas

### Purpose and content

Give a bird’s-eye understanding of the entire selected system. Contour territories represent nested ownership, domain, region or deployment boundaries. Choose one primary grouping at a time and label it. Nesting is not an automatic claim about security isolation. Relief/contours encode containment, not latency, health, cost or geographical altitude.

The AI example contains Client/Edge, Inference & Orchestration, Retrieval & Data, Compute & Queues, and Training & Model Lifecycle territories. These labels are examples; load grouping from topology. Show component types using recognizable glyphs rather than identical anonymous balls.

Display these relationship classes separately:

1. Declared architecture dependencies, subdued and optionally hidden.
2. Observed communication in the selected time window, with source and coverage available.
3. The selected transaction, highlighted in amber and never synthesized from dependency edges.
4. Captured response/stream activity, cyan with direction markers.
5. Training/model/deployment lineage, violet and separately labeled.

A declaration that A can call B does not prove that the selected transaction called B. Aggregated traffic and sampled traces are also different evidence sources. Show counts/rates only when supplied or when a documented calculation is valid; do not turn a sampled trace count into an estimated system-wide throughput without disclosure.

### Interactions

- Hover gives concise type, identity, status freshness and key metrics when available.
- Select a component to open its inspector and highlight its known neighborhood.
- Expand a territory to reveal children, or collapse it while preserving a stable aggregate identity.
- Search locates systems, services, instances, model versions and transaction IDs.
- Choose a service and time window to list relevant observed transactions. Selecting a specific transaction enables Open transaction.
- Pin/isolate a path and toggle relationship classes; never hide the evidence-gap indicator.
- Orbit is bounded; pan/zoom are available. Near-top-down is the default. Reset and keyboard navigation are always available.
- Freeze/review a time window without silently changing the chosen trace. If live topology changes, indicate additions/removals and apply stable layout updates; do not reshuffle everything on every event.

## 5. View 05A — transaction introspection and demonstration

### Purpose and composition

Use the approved glass-gate architecture and amber trace to explain one transaction. The scene is a spatial arrangement of involved components. It is not a literal packet path or a scaled time axis. Keep exact timing in the synchronized timeline and inspector.

A compact training/model strip can remain above the execution scene to explain model identity. It is lineage context, not another branch of the transaction’s millisecond trace. It can collapse when irrelevant. Refer to dataset, training-run, checkpoint, model version and deployment identity only when known.

### Request, execution and response

Selection is by full trace ID internally; short human labels such as #7F2A are display-only. Show operations at the actual participating service/instance. A service can appear repeatedly in a transaction; preserve distinct spans and attempts instead of merging their durations.

Represent parent/child operations, parallel branches and explicit links without conflating them with topology edges. Retries are separate attempts with their own statuses. Queue delay is an instrumented waiting interval; otherwise label it unknown or an explicitly described estimate. Use reported status and captured events; lack of an error record does not establish success.

If response/stream events exist, animate their observed direction and order. If they do not, show completion at the operation/service with the known result metadata. Do not invent token-level emission or payload values. Distinguish time to first response/token from time to complete only when the corresponding timestamps exist.

### Playback and inspection

- Hover/select components, spans, events and links. Scene and timeline selections synchronize in both directions.
- Play/pause, seek, step to previous/next event, and change speed. Default replay 1×; presentation slowdown must show the changed speed.
- At a playhead timestamp, highlight every span active then; parallel work stays parallel. Render queue/process/event semantics distinctly.
- The vertical glass focus plane is an optional visual cue at the focused component. Label it Focus when space is architectural. It must not imply that a single scene plane is a globally accurate time slice.
- Display inclusive duration; show self-time only if computed from the union of applicable child intervals. Never sum overlapping children as wall-clock duration. Do not advertise a critical path before a correct algorithm and coverage conditions exist.
- Follow request is opt-in. Camera changes are gentle, immediately interruptible, and do not suppress a user’s manual camera choice.
- Expand the 2D span waterfall for accurate start/end/duration comparison. An accessible list/table exposes the same evidence.
- Pin an inspection point. New live events must not overwrite the selected span or erase the user’s position.

### Inspector fields

Identity: trace, span, service, instance, environment, operation and model/deployment IDs when relevant. Timing: start/end, duration or elapsed-so-far, queue wait when observed, and playback time. Evidence: status, event details, links, telemetry source, capture/ingestion times, coverage and permitted correlated logs. Attributes/payload summaries are permission-aware and redacted. No raw secrets or fabricated response content.

## 6. Main user journeys

| Journey | Sequence | Required preservation |
| --- | --- | --- |
| Explore to investigate | 07 → territory/service → observed transaction list → select trace → 05A | System, environment, source and time window |
| Demonstrate one transaction | Select supplied demo or live trace → 05A → follow/replay → inspect delay → finish | Honest source label, trace identity and exact timing |
| Return to context | 05A → Back to system | Prior 07 camera, expansion, filters and selection; selected trace remains highlighted |
| Direct transaction link | Open explicit trace context → 05A | Resolve permissions/source, show useful loading/not-found states; no invented context |
| Model explanation | Select inference deployment → inspect known model lineage | Distinguish lineage evidence and run times from request times |

A possible URL shape is `/system?system=…&env=…&from=…&to=…` and `/transaction/<traceId>?system=…&env=…`. This is illustrative, not a prescribed router. Shareable state must avoid secrets, payloads and private search text. Camera bookmarks may be stored separately.

## 7. Live data and truth states

| State | Required behavior |
| --- | --- |
| Demo | Deterministic synthetic fixtures; arriving-demo events still say Demo |
| Recorded | Replay captured data; show recorded time window and source |
| Live connected | Show freshness and stream/watermark; update visible objects incrementally |
| Live paused | Freeze inspected time; buffer bounded updates; count pending changes and offer Resume live |
| Span in progress | End absent; show elapsed-so-far only to the reliable observation watermark, not inferred completion |
| Backend exports completed spans only | Explain delayed visibility; do not fabricate in-progress work |
| Partial/sampled | Mark unknown/unobserved hops and coverage; no seamless fabricated connections |
| Late/out-of-order data | Merge by stable identity/revision; preserve event time separately from ingestion time |
| Reconnecting or gap detected | Keep last view, flag stale/gap state, resync snapshot before claiming continuity |
| Trace unavailable | Show not-found/permission/expired distinctions when known; keep navigation usable |
| Empty/error/WebGL unavailable | Offer useful retry and the same evidence in an accessible 2D view |

The initial implementation must provide these state designs, while real live integration depends on an actual backend. Do not put a green Live badge on fixture playback.

## 8. Nonfunctional objectives

Readable labels and stable navigation take priority over ornamental particles. Keep bloom subtle and motion optional. Avoid color-only status: add icons, line patterns and text. Keyboard users must be able to select a component, open its trace, inspect spans and return. Provide reduced-motion behavior and a meaningful 2D fallback for small screens or unsupported GPUs.

Use bounded scene complexity and hierarchical aggregation. Initial scale and frame-rate budgets are proposed targets to benchmark, not measured results; see the acceptance specification. Define environment/ownership and permissions in the integration layer. The client never retrieves unauthorized fields and then merely hides them.

## 9. Deferred questions and defaults

| Unknown | Proceed now with | Resolve for real integration |
| --- | --- | --- |
| Telemetry backend | Fixture adapter plus documented adapter boundary | Backend API, auth, retention, sampling, live export behavior |
| Actual architecture | Supplied AI-system topology | Inventory source, service naming, deployment/instance mapping |
| Host/framework | Existing repo conventions, otherwise proposed web stack | Supported browsers, security controls and hosting |
| Scale and hardware | Benchmark fixtures and record actual hardware | Representative production topology, rates and target machines |
| Payload policy | Metadata-only with redacted example attributes | Server-enforced allowed fields, access rules and audit needs |

These unknowns do not block the first working demo. They do block claims of production connectivity or production-level correctness at untested scale.
