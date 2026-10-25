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
