# Implementation plan and engineering handoff

## Delivery boundary

This package is a design and data handoff. It includes approved static reference images, specifications, tokens and fixtures, not a runnable app, backend integration or editable 3D source. Build the first local demo before claiming live connectivity. Keep the data adapter contract stable enough that real telemetry can replace fixtures without replacing the scenes.

## Proposed stack

For a fresh browser project, React + TypeScript + Three.js with React Three Fiber is a reasonable default. React Three Fiber is a React renderer for Three.js; it supports declarative scene components. Use DOM UI for legible panels, labels and accessible controls. This is a recommendation, not a user-mandated stack. In an existing project, reuse its framework and conventions where practical.

Choose mutually compatible stable React/renderer/Three versions at implementation time and commit a lockfile. Do not assume a preview renderer or a GPU backend is supported on all target devices. Prefer a broadly supported rendering path first; add more advanced graphics after measuring target browsers. Exact dependency versions are deliberately not pinned in a design handover.

## Suggested boundaries

| Module | Responsibility | Must not do |
| --- | --- | --- |
| Data adapters | Fetch/subscribe, authenticate server-side where needed, normalize, redact, report source/coverage | Manipulate camera or bake scene geometry |
| Domain store | Stable component/resource/trace identity, snapshots, events, revisions, relationships | Treat layout coordinates as telemetry |
| Playback controller | Source clock, playhead, speed, pause/buffer/resume, active spans | Invent events or complete open spans |
| Selection/navigation | Shared trace/span/component selection, environment, time range, history | Lose atlas state when entering 05A |
| Layout engines | Stable territory layout and trace architectural layout | Infer communication from proximity |
| Scene renderers | 07 terrain/glyphs/routes and 05A glass stages/paths | Fetch production data directly |
| Evidence UI | Inspector, timeline, accessible tables, freshness and errors | Hide uncertainty or secrets with CSS only |

State can be held in a small typed store; choose a library only if the project needs it. Topology state and selected-trace state are shared. Camera/expansion state is view-specific. A transaction view should not require a different copy of the truth.

## Proposed scene graph

- App shell and shared controls.
- 07 scene: territory group → contour meshes → component glyph instances → declared/observed/selected relationship layers → screen-space labels and inspector.
- 05A scene: involved component groups → translucent gates/data blocks → operation/branch markers → selected execution layer → optional lineage context → DOM labels, inspector and synchronized timeline.
- Both: bounded camera controller, selection/picking, legend, source state, graceful fallback.

Build terrain contours and glass gates procedurally. Reuse geometry/materials, instance repeated objects, and pool transient visual effects. Do not ship unique high-poly models for every service. The PNGs are references, not runtime scene assets.

## Data integration

Use `data/contracts.ts` as the starting normalized interface; its names and JSON fixtures are the authoritative sample implementation vocabulary. It is a proposed application contract, not the native OpenTelemetry/OTLP wire format. A backend adapter must map real trace IDs, span IDs, resources, links, timestamps and status semantics, retaining provenance and data quality.

OpenTelemetry traces model operations as spans and allow links to related spans. That model is a useful input foundation, but it does not automatically provide an infrastructure inventory, correct architectural grouping, payload content, response events, exact queue-wait measurements or an in-progress event feed. Supply these through suitable instrumentation/inventory sources or explicitly mark them unavailable.

Do not send collector/admin credentials to the browser. Normalize and filter payloads upstream. Connection details and transport (polling, server-sent events or WebSocket) depend on the selected source. The adapter must advertise supported capabilities rather than claiming a native live feed exists.

Use complete snapshots plus revision/sequence-aware patches. Deduplicate updates, handle out-of-order arrival, cap replay buffers and resync on gaps. Keep event time, observed/ingested time and playback time distinct. Dispose subscriptions on context changes and use cancellation. Stable IDs must survive a view switch.

## Delivery stages

| Stage | Deliver | Exit evidence |
| --- | --- | --- |
| A — visual vertical slice | Real 3D 07 and 05A, shared fixture data, reusable geometry, panels, basic selection and view switch | Screenshots at 1440×900 and 1920×1080; both views recognizable |
| B — transaction behavior | Search/select trace, active spans, exact timeline, queue delay, branches, evidence, preserved Back context | Repeatable walkthrough of #7F2A and all fixture scenarios |
| C — resilient demo | Partial/open traces, streaming simulation, pause/buffer, keyboard/reduced motion, fallback, bounded scene | Relevant P0 acceptance checks with recorded outcomes |
| D — real telemetry | Read-only adapter for a supplied backend, source capabilities, freshness, coverage, reconnect/resync | Evidence using a genuine captured/live transaction; no fixture presented as live |
| E — production hardening | Representative scale, permission policy, deployment controls and broader diagnostics | Real target-device benchmarks and integration-specific checks |

The owner’s live-transaction goal remains part of the product. Stage D is required to call the product live-connected; it is deferred until a real source is available, not silently dropped. Stages A–C can be completed independently without inventing integration details.

## First walkthrough

1. Launch 07 in Demo mode and locate the Inference & Orchestration area.
2. Select the relevant service and reference transaction #7F2A.
3. Open 05A; confirm identity, 2840 ms total and 950 ms observed queue wait from the fixture.
4. Replay at 1×, pause in the waiting interval, select its span and verify start/end/duration.
5. Scrub to model execution, then captured streaming events and completion.
6. Return to the same atlas camera, filters and expanded territory with the transaction still selected.
7. Repeat with parallel/retry, missing evidence and unfinished-stream fixtures; unknown must stay unknown.

## Scale and quality

Do not render every infrastructure instance, edge, label and request simultaneously. Group by the selected hierarchy, render only useful detail, cap animated traffic and reveal specific traces on demand. Preserve evidence counts/coverage when aggregating. Limit rerenders; update per-frame motion outside unnecessarily expensive full UI state updates.

Use the provisional benchmark and acceptance targets in `ACCEPTANCE_CRITERIA.md`. Record actual browser, GPU, device pixel ratio, machine, scene size and fixture variant. A frame-rate target in a document is not proof that the app meets it. Avoid indefinite optimization before the first faithful vertical slice.

## Handoff evidence required from the coder

- Run/install commands, supported environment and locked dependencies.
- Screenshots for both approved views and a short walkthrough recording if available.
- Completed acceptance matrix, scenario results and measured performance with hardware context.
- Clear inventory of real, replayed, simulated, unsupported and deferred capabilities.
- Integration configuration guide with no secrets, adapter mapping and known telemetry limitations.
- A short deviation log explaining any departure from approved appearance or proposed behavior.

## Primary technical references

Checked 24 October 2026; consult current documentation when implementing:

- [OpenTelemetry traces](https://opentelemetry.io/docs/concepts/signals/traces/) — span and trace concepts; use alongside source-specific API documentation.
- [React Three Fiber introduction](https://r3f.docs.pmnd.rs/getting-started/introduction) — renderer purpose and compatibility guidance.

The original film references informed exploration. The approved local PNGs now govern visual direction; there is no requirement to copy a film interface or use third-party film assets.
