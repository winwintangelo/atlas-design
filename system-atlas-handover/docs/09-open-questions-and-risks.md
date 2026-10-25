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
