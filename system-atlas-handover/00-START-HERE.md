# System Atlas: design handover for an AI coding agent

**Read this file first.** It tells you what to build, in what order, what counts as done, and which file wins when two disagree.

## 1. What you are building

**System Atlas** is a cinematic 3D explorer for complex IT systems. It shows a running system as a night city:

| In the city | In the system |
|---|---|
| District | Subsystem: a domain, namespace or bounded context |
| Building | Component: a service, gateway, store, queue, job or compute pool |
| Window / floor | Instance: a pod, VM, GPU, shard or replica |
| Vault / archive | Data store |
| Transit hub (ring) | Queue, topic or scheduler. Cars on the ring are waiting requests |
| Arc | Integration between two components |
| Packet | One call inside one transaction |

Users can:
- orbit, tilt, pan and zoom the city
- search and filter down to a few transactions
- replay one transaction as packets flying along the arcs
- read the exact request and response of every call
- click any arc to see the functions it carries, with a live tail of real calls

The first dataset is an AI inference platform. **The product is domain-neutral.** Payments, e-commerce, Kubernetes, data pipelines and enterprise integration must all render from the same code (see `docs/02-domain-model.md`).

## 2. Reading order

1. `docs/01-intent-and-goals.md`: why it exists and the non-negotiable principles.
2. `screenshots/`: look at all 10 before reading further. `00-north-star-concept-A.png` is the mood. `01`–`09` are the approved product (A2).
3. `reference/A2-Explorer.html`: open it in Chrome. It is the approved interactive mockup. Play with every control.
4. `docs/05-interaction-spec.md`: the behaviour contract.
5. `docs/03-design-system.md` + `tokens/`: the visual contract.
6. `docs/04-look-and-feel.md`: how the 3D scene must look.
7. `docs/02-domain-model.md` + `schema/atlas.types.ts` + `fixtures/`: the data contract.
8. `docs/06-data-contracts.md`, `docs/07-architecture.md`: how to wire and build it.
9. `docs/08-acceptance-and-milestones.md`: what done means, milestone by milestone.
10. `docs/09-open-questions-and-risks.md`: what is not decided. Don't invent answers; stub and flag.

`SPEC-ALL-IN-ONE.md` concatenates `docs/01`–`docs/10` into one file, so you can load them in a single read.

## 3. Source-of-truth precedence

When two sources disagree, the higher one wins:

1. `docs/08-acceptance-and-milestones.md` (testable requirements)
2. `docs/05-interaction-spec.md` and `docs/03-design-system.md`
3. `tokens/tokens.json` (exact values)
4. `schema/atlas.types.ts` (data shapes)
5. `screenshots/01`–`09` and `reference/A2-Explorer.html` (behaviour and look as approved)
6. `screenshots/00` and `reference/A-Metropolis-north-star.html` (mood only)

The reference HTML is a **2.5D SVG mockup** running on a tiny template stub (`reference/support.js`). It is **not** production code. Don't port it line by line. Port its behaviour, layout, numbers and look into the architecture in `docs/07`.

## 4. Rules for the build

- **Every lit, moving or colored thing maps to one datum.** No decorative data, no invented numbers. A missing value renders as `—`.
- **Positions are stable.** The layout engine is deterministic. During an investigation only the camera moves.
- **Operational ↔ Cinematic changes rendering only.** It never changes values, positions, what is visible or what a color means.
- **The color meanings are fixed everywhere.** White = selected transaction. Cyan = healthy flow. Amber = queue, degraded or waiting. Coral = failure. Violet = lineage or control plane. Never signal by hue alone: pair it with a shape, label or icon.
- **Payloads are redacted on the server by default.** Reveal is role-gated, needs a reason and is audit-logged. Never cache payloads in browser storage.
- **Domain-neutral code.** No string like "GPU", "token" or "model" in renderer or UI code. Domain words come from data (labels, metric names, units).
- **Accessible.** Every scene action also has a panel or keyboard path. WCAG 2.2 AA in panels. Honour `prefers-reduced-motion`.
- **No AI-slop styling.** No rounded cards, no gradient washes, no emoji, no left-border-accent cards with rounded corners. Corners are square. See `docs/03`.

## 5. Definition of done (whole product)

- All acceptance criteria in `docs/08` pass. Each has an automated test where marked.
- Visual regression: renders of the fixture at the 9 camera/state presets match `screenshots/01`–`09` in composition, color and hierarchy. Pixel-perfect matching is not required, because the production renderer is WebGL.
- `fixtures/example.payments.json` renders and replays with **zero code changes** (milestone M6).
- 60 fps at 1080p with the fixture on a mid-range GPU. Performance budgets are in `docs/07`.
- No console errors. No network calls other than the backend APIs and fonts.

## 6. What is in this package

```
00-START-HERE.md            ← you are here
SPEC-ALL-IN-ONE.md          ← docs 01–10 in one file
docs/                       ← the spec, split by topic
schema/atlas.types.ts       ← TypeScript data contract
tokens/tokens.json|css      ← design tokens (exact values)
fixtures/                   ← reference data: AI platform (topology, integrations, 7 transactions) + payments example
reference/                  ← approved interactive mockup (open A2-Explorer.html) + north-star concept
screenshots/                ← 10 reference states at 1920×1080
```
