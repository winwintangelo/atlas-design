# Implementation prompt — System Atlas

You are implementing an interactive 3D observability product from an approved design handover. Read this whole package, inspect both reference images, then implement. The goal is a real working interface with a cinematic visual language and traceable data.

## Owner intent

Represent a real, complex IT system as an explorable 3D environment, with enough futuristic visual impact to make a live demonstration memorable. Make architecture, request flow, response flow, latency, dependencies and failures understandable. AI training and inference are the starting example, not the only supported domain.

## Locked design decisions

1. **07 Topographic Atlas is the whole-system bird’s-eye view.** Use nested low-relief territories, clear component glyphs, restrained contour boundaries, amber selected request and cyan observed activity/response, with a distinct violet training/model lineage region.
2. **05A Precision Trace is the specific-transaction introspection and live-demo view.** Use its dark, precise, translucent blue/violet geometry, readable service gates, continuous amber selected execution, screen-space labels, right-hand inspector and bottom replay strip.
3. These share data, selection, environment, time context and navigation history. A selected trace moves from 07 to 05A; returning restores the previous system view.
4. Do not switch to another explored concept, introduce an orbital/organic/machine metaphor, or replace the 3D experience with a generic dashboard. The 2D timeline and accessible table are companions and fallbacks.

## First work

- Read `specs/PRODUCT_AND_EXPERIENCE.md`, `specs/VISUAL_SYSTEM.md`, `specs/IMPLEMENTATION_PLAN.md`, and `specs/ACCEPTANCE_CRITERIA.md`.
- Inspect `references/05A_precision_trace.png` and `references/07_topographic_atlas.png` as images, not just filenames.
- Inspect `data/contracts.ts`, the data guide and fixtures. Run their validator.
- If extending an existing repository, inspect its architecture and reuse its framework. If starting fresh, React + TypeScript + Three.js with React Three Fiber is a recommended default, not a fixed requirement. Check compatible stable versions when implementing.
- State a concise implementation plan and begin with a vertical slice containing both views. Do not stop after writing another plan or rendering one static image.

## Required working behavior

Start in 07 with a labeled synthetic example. Navigate system → territory → service, search/select a transaction, open that transaction in 05A, inspect a service/span, scrub or replay its execution, then return to the exact previous atlas context. Both views must read the same normalized topology and trace objects.

In 05A, show the selected request’s observed components and branches, queue wait, retries, parallel activity and streaming events when supplied. Provide a synchronized 2D span timeline with exact timestamps. The main 3D layout represents architecture; object spacing is not a duration scale. Represent simultaneous active operations together. A focus plane is a navigation cue, not proof that every operation at one scene coordinate occurred at one time.

Support demo, recorded replay and real live sources as distinct modes. A demo can simulate arriving spans but stays labeled Demo. For genuine live mode, show source identity, connection state, freshness and coverage. If the backend exports spans only after completion, show that limitation rather than inventing pending work. Pause freezes the inspected time while new updates are buffered; resume-to-live is explicit.

Use the supplied fixture scenarios to exercise a successful request, the reference slow request, branching/retry, missing telemetry and unfinished streaming. Do not hard-code the reference path into rendering logic.

## Data integrity

The reference request display ID is `#7F2A`; it is not the full trace ID. Its sample duration is 2840 ms and observed queue wait is 950 ms. Use the fixture for all exact timings and relationships. Do not copy extra numbers, incorrect arrows or inferred causal relationships from the PNGs.

Keep topology dependencies, observed communication, trace parent/child relationships, span links, model lineage, metrics and layout coordinates as distinct concepts. Link training to inference through model/deployment identity. Never force an asynchronous linked job into a synchronous request/response chain. Unknown or missing information stays unknown. Do not infer health from the absence of errors in sampled traces.

## Implementation shape

Separate adapters, normalized domain state, view state, layout and rendering. Use procedural reusable geometry and data-driven edges, not the PNG as the scene. Use DOM-based text/panels for readability. Keep topology positions stable during telemetry updates, aggregate dense systems, bound effects/particles and update visible data incrementally.

Keep the product read-only. Never embed credentials in the frontend. Redact sensitive attributes and payloads before they reach the browser. No payload preview is preferable to fabricated or unauthorized content.

## Delivery sequence

1. Working fixture-driven visual foundation for 07 and 05A.
2. Full selected-trace journey, playback, state preservation and evidence panels.
3. Partial/error/streaming states, accessible fallback and scale checks.
4. Real telemetry adapter behind the same contracts when a source is supplied; disclose anything still simulated.

Complete acceptance checks for the delivered stage. Produce desktop screenshots and a short interaction recording if supported. Report what works, how to run it, what was checked, and remaining limitations. Do not claim production integration, performance results, accessibility compliance or exact visual fidelity without evidence.

## Decision policy

Use reasonable reversible defaults for routine implementation details. Record deviations from proposed tokens or technology choices. Preserve the two approved visual directions. Ask only when a decision materially changes scope, semantics or an external integration requirement; absent a backend, finish the fully labeled demo and adapter boundary first.

Success means a user can understand the system in 07, select a transaction, investigate or demonstrate its actual execution in 05A, and inspect the evidence behind every operational claim.
