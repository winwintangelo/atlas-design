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
