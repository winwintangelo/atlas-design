# System Atlas — AI coder handover

Version 1.0 · 24 October 2026 · Design direction approved; implementation not yet built.

Build one interactive 3D representation of a real, complex IT system with two connected views:

| Approved view | Product purpose | Reference |
| --- | --- | --- |
| **07 · Topographic Atlas** | Bird’s-eye view of the whole system: boundaries, components, relationships and activity | [07_topographic_atlas.png](references/07_topographic_atlas.png) |
| **05A · Precision Trace** | Introspection and live demonstration of one specific transaction: execution, request/response, timing and evidence | [05A_precision_trace.png](references/05A_precision_trace.png) |

The owner’s latest instruction is authoritative: “keep 05a for introspect or live demo a specific transaction and keep 07 for birds eye view of the whole system.” These are complementary modes of the same product, not competing concepts. Other earlier concepts are outside this handover.

## Start here

1. Open **[OPEN_ME.html](OPEN_ME.html)** for the visual overview. It works locally without a server or internet.
2. Give the coding agent **[AI_CODER_START_HERE.md](AI_CODER_START_HERE.md)** and this entire folder.
3. Read **[product and interaction requirements](specs/PRODUCT_AND_EXPERIENCE.md)** and **[visual specifications](specs/VISUAL_SYSTEM.md)**.
4. Use **[data/](data/DATA_GUIDE.md)** for renderer-independent types and synthetic fixtures.
5. Follow **[implementation stages](specs/IMPLEMENTATION_PLAN.md)** and verify **[acceptance criteria](specs/ACCEPTANCE_CRITERIA.md)**.

## Authority and scope

- **Locked by the owner:** two selected directions and their roles; interactive 3D; real-system representation; real request/response tracing; futuristic cinematic presentation with useful inspection.
- **Proposed implementation defaults:** component architecture, technology choices, color tokens, shortcuts, data contracts, scale targets and delivery stages. The coder may refine these with a recorded rationale while preserving the locked direction.
- **Visual references:** static AI-generated PNGs, 1672 × 941 pixels. They are not working UIs, telemetry captures, editable 3D models or validated diagrams. The package does not include a working application or real backend connection.
- **Initial example domain:** an AI training and inference platform. The renderer and data model must remain usable for other distributed IT systems.
- **First deliverable:** a working, visually faithful local demo with both views and honest deterministic fixture replay. Then add real read-only telemetry integration through an adapter. Do not call simulated activity live production data.

## Files

| File or folder | Use |
| --- | --- |
| `AI_CODER_START_HERE.md` | Copyable implementation brief and definition of done |
| `specs/PRODUCT_AND_EXPERIENCE.md` | Intent, objectives, view behavior, interaction flows, state, source truth |
| `specs/VISUAL_SYSTEM.md` | Geometry, layout, semantics, motion, labels, image corrections |
| `specs/IMPLEMENTATION_PLAN.md` | Architecture, stages, integration boundaries and technical references |
| `specs/ACCEPTANCE_CRITERIA.md` | Prioritized functional, fidelity and quality checks |
| `design/tokens.json` | Proposed semantic color, typography, spacing and motion defaults |
| `data/contracts.ts` | Renderer-independent data and adapter interfaces |
| `data/topology.json`, `data/traces.json` | Synthetic fixtures; see their guide for exact scenario inventory |
| `data/validate_fixtures.py` | Runnable fixture integrity checks using Python standard library |
| `references/` | Both approved PNGs, use notes and SHA-256 provenance manifest |
| `OPEN_ME.html` | Human-readable visual summary with local links |
| `VALIDATION.md` | Checks completed on this package and explicit validation limits |
| `PACKAGE_MANIFEST.json` | File inventory and SHA-256 checksums, excluding the manifest itself |

Validate the sample data after extraction:

```bash
python3 data/validate_fixtures.py
```

Do not use the reference image as a background with clickable hotspots. Rebuild the terrain, components, connections, panels and trace behaviors as real interactive scene/UI objects. Keep explicit data gaps visible and preserve evidence when changing views.
