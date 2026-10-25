# Data handover

These are renderer-independent **proposed implementation contracts and synthetic fixtures**, not an implemented adapter, API, instrumentation deployment, or live connection. They support the two selected views: **07 Topographic Atlas** for system overview and **05A Precision Trace** for one transaction. The images guide aesthetics; these records guide demo behavior.

## Files and entry point

- `contracts.ts` — types and an adapter interface; deliberately has no rendering-library imports.
- `topology.json` — 25 components, 26 instance resources, configured and observed relationships, and one model lineage record.
- `traces.json` — six fixed scenarios. Open `referenceScenarioId` first.
- `validate_fixtures.py` — dependency-free integrity and scenario validation.

Run from this directory: `python3 validate_fixtures.py`. From the package root: `python3 data/validate_fixtures.py`.

## Identity, time, and evidence

`#7F2A` is only a display label. Route and select by the full 32-character `traceId`. A span is identified by `(traceId, spanId)`; span IDs need not be globally unique. `componentId` groups work by stable logical service; `resourceId` resolves the actual service instance. Switching views preserves these IDs.

The custom JSON contract uses integer millisecond offsets plus `baseTimeUtc`. It is **not OTLP JSON**. Keep original backend precision in a real adapter; do not put nanosecond epoch integers into JavaScript `number`. The trace duration is `endMs - startMs`, not the sum of spans. Work overlaps and enclosing spans include children. Layout coordinates are separate from execution timestamps. `clockUncertaintyMs: null` means uncertainty is unknown, not zero.

`status: UNSET` does not mean success or failure. `outcome` is a separate normalized result that must have evidence. The partial fixture ends but remains `not-observed`. Do not infer a failed dependency merely from slowness, a missing span, or an empty sample. An error on a recovered attempt does not make the whole request a failure.

All supplied evidence is `synthetic`, and all source modes remain `demo`, including the open streaming example. A configured edge has `basis: declared`; an observed relationship has a distinct ID, evidence, time window, and count. Do not draw the entire configured graph as the selected request path. Missing data is null/unknown, never an invented zero. Display observed response events only when present; glowing particles alone do not establish network packets, token counts, or payload content.

## Scenarios

| Scenario ID | Expected behavior |
| --- | --- |
| `normal` | Completed successful request; retrieval and cache work overlap. |
| `reference-queue-delay` | Display `#7F2A`, total **2840 ms**, queue interval **480–1430 ms = 950 ms**, model execution 1430–2110 ms, streaming 2110–2840 ms. |
| `parallel-retry` | Retrieval and tool work overlap. Vector attempt 1 has an explicitly recorded timeout; attempt 2 succeeds. The request succeeds. |
| `async-audit` | A consumer is a separate root trace, linked to the earlier producer. It occurs after the request finishes. |
| `partial-unknown` | Known parent context is missing. Show a broken/unknown boundary and an incomplete-evidence notice, without fabricating the parent operation or outcome. |
| `open-streaming` | Fixed simulated watermark at 1200 ms. Open spans have `endMs: null`; two chunk events exist and no completion event exists. |

The reference case has 20 ms between orchestration start and retrieval start. Do not create a fictional span to explain that interval. Retrieval contains nested embedding and vector work. Its duration overlaps those child operations; do not add all of them to total latency.

## Adapter behavior to implement

Implement the interface with a local fixture adapter first. `getTopology`, `listTraces`, and `getTrace` return the same normalized domain objects regardless of backend. `subscribe` is an asynchronous sequence of updates, cancelled through `AbortSignal`. No polling/SSE/WebSocket implementation is prescribed here.

Bind each adapter instance to an immutable `scope` containing authorized source, system, and environment IDs. Changing scope selects or constructs another adapter and cancels the old subscriptions. Keep query time windows and playback time separate. `capabilities` declares in-progress span, streaming-event, historical-query, topology-history, metric, and live-subscription support, plus known timestamp resolution and export delay. A Demo adapter may simulate incremental delivery but must not advertise a genuine live subscription. `getTopology({atUtc})` is used only when historical topology is supported; otherwise disclose that the current topology is being used to contextualize an older trace.

Track the highest **contiguous applied sequence**, not the highest received sequence, per `streamId`. Ignore duplicates at or below that applied sequence. If sequence 3 arrives before sequence 2, buffer 3 without applying it; apply 2 then 3 when continuity is restored. Bound the buffer and refetch an authoritative snapshot if the gap persists, advancing only to that snapshot's supplied sequence. A new stream ID starts a new sequence namespace; it does not authorize merging unrelated snapshots. Upsert spans by `(traceId, spanId)`; never append duplicates. Apply snapshot metadata and related patches coherently before presenting a frame.

`observedAtUtc` is receipt/observation time; `watermarkUtc` is the latest source time the adapter says it has incorporated. Neither proves all upstream telemetry has arrived. Late spans can amend a finished request. Open spans can appear only if the backend exposes in-progress events; many trace sources export finished spans. If only completed traces are available, show **recent completed requests** and measured delay instead of claiming live execution.

Replay is playback of captured evidence. **Live** is a connected source with current freshness. **Demo** remains visibly simulated even when animated. In 05A, use elapsed display time bounded by the watermark for unfinished spans, keep their end open, and never mark them successful at the playback boundary. Retain user pause/scrub position when new telemetry arrives. Separate the event clock, replay playhead, and animation clock.

Metrics are optional and independent of spans. This package intentionally does not invent service health, aggregate throughput, or GPU utilization. `getMetrics` can supply timestamped samples with units, windows, and evidence. Health coloring requires an explicit, documented rule and valid input. Training lineage describes artifact provenance and deployment identity; it is not a millisecond inference trace.

## OpenTelemetry reference anchors

The domain model follows OpenTelemetry's distinction between traces, spans, events, status, and links. A link can connect spans without making them parent and child. The local schema, scenario naming, visual mappings, and update protocol are handover design proposals.

- [Traces and spans](https://opentelemetry.io/docs/concepts/signals/traces/)
- [Tracing API: identity, links, status, and span lifetime](https://opentelemetry.io/docs/specs/otel/trace/api/)

Checked 2026-10-24. Consult the selected backend's current APIs during implementation; this handover does not pin package versions or claim backend compatibility.
