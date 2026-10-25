/**
 * System Atlas — data contract between the backend adapters and the 3D explorer.
 *
 * Domain-neutral on purpose. Nothing in here is specific to AI platforms:
 * an AI inference stack, a payments switch, an e-commerce mesh, a Kubernetes
 * cluster or a batch data pipeline all map onto the same types.
 * See docs/02-domain-model.md for the mapping table.
 *
 * Conventions
 * - All times inside a transaction are milliseconds from the transaction start (float allowed).
 * - Absolute times are ISO-8601 UTC strings.
 * - Every number the UI shows must come from one of these objects. If a field is null,
 *   the UI shows "—", never a guess.
 */

// ───────────────────────── Semantic enums ─────────────────────────

/** Health drives color everywhere. Never encode health with hue alone: pair with shape or label. */
export type Health = 'healthy' | 'degraded' | 'failing' | 'down' | 'cordoned' | 'unknown';

/** District tone picks the accent family for plates and labels. */
export type Tone = 'cyan' | 'violet' | 'steel' | 'amber' | 'none';

/** What a component is. Drives its 3D shape (see ComponentShape). */
export type ComponentType =
  | 'gateway'      // edge / API gateway / load balancer / ingress
  | 'service'      // stateless service, microservice, function
  | 'datastore'    // database, cache, object store, vector store, ledger
  | 'queue'        // queue, topic, broker, scheduler, batcher
  | 'job'          // batch job, ETL task, cron, pipeline step
  | 'node-pool'    // fleet of machines/GPUs/VMs (compute capacity)
  | 'external';    // client, partner, third-party API

/** Visual archetype. The renderer owns the geometry; the adapter only picks the archetype. */
export type ComponentShape = 'tower' | 'vault' | 'archive' | 'hub-ring' | 'monolith' | 'block' | 'needle' | 'none';

export type InstanceKind = 'pod' | 'container' | 'vm' | 'node' | 'gpu' | 'shard' | 'replica' | 'partition' | 'worker' | 'thread-pool';

/** Kind of hop. Drives how a call animates during replay. */
export type CallKind =
  | 'http' | 'rpc'          // request → response: packet out, callee pulses, packet back
  | 'redis' | 'sql'         // datastore access: same as rpc, lands on a vault
  | 'queue'                 // wait in a queue/scheduler: packet rides the transit ring
  | 'gen'                   // long-running compute on an instance (e.g. model generation, batch step)
  | 'stream'                // continuous flow: dashed stream along the arc, no single packet
  | 'message';              // fire-and-forget publish/consume

export type CallStatus = 'ok' | 'fail' | 'wait' | 'cancel';
export type TransactionStatus = 'ok' | 'slow' | 'error';

// ───────────────────────── Topology ─────────────────────────

export interface Topology {
  system: SystemInfo;
  districts: District[];
  components: Component[];
  instances: Instance[];
  integrations: Integration[];
  /** Optional provenance chain: data → build/train → artifact → deployment. */
  lineage?: LineageNode[];
  /** Evidence currently attached to the system (events, metric anomalies, config, logs). */
  evidence?: Evidence[];
  /** Optional camera preset; renderer has sane defaults. */
  camera?: CameraPreset;
}

export interface SystemInfo {
  id: string;
  name: string;
  /** Free-form label for the system family, e.g. 'ai-platform', 'payments', 'k8s-cluster', 'data-pipeline'. */
  kind: string;
  environment: string;            // 'prod', 'staging'
  region: string;                 // 'us-east-2'
  snapshotAt: string;             // ISO time of the metrics snapshot
  /** Up to 4 headline numbers for the header. Labels come from the adapter. */
  headline?: Record<string, number>;
}

/** District = a subsystem / bounded context / namespace / business domain. */
export interface District {
  id: string;
  label: string;
  tone: Tone;
  /** Ground-plane rectangle in world units. If absent, the layout engine places it. */
  plate?: { x0: number; z0: number; x1: number; z1: number } | null;
}

/** Component = one building. A service, store, queue, job or pool. */
export interface Component {
  id: string;
  label: string;
  districtId: string;
  type: ComponentType;
  shape?: ComponentShape;          // defaults by type: gateway/service→tower, datastore→vault, queue→hub-ring, node-pool→monolith, job→block
  instanceCount: number;
  metrics: {
    ratePerSec: number | null;     // building HEIGHT encodes this (log scale)
    utilization: number | null;    // 0..1, average; per-instance values light windows
    health: Health;
  };
  /** Optional precomputed layout (world units). Positions must be stable across sessions. */
  layout?: unknown[];
  /** Domain-specific extras the inspector can show verbatim (routing weights, capacity, jobs, queues). */
  [extra: string]: unknown;
}

/** Instance = one window/floor: pod, VM, GPU node, shard replica, partition. */
export interface Instance {
  id: string;                      // '<componentId>/<name>'
  label: string;
  componentId: string;
  kind: InstanceKind;
  health: Health;
  utilization: number | null;      // 0..1 — window lit if busy
  host?: string;
  note?: string;                   // short human text, may cite evidence ids ("· E1")
  [extra: string]: unknown;
}

/** Integration = one arc between two components. Directed: caller → callee. */
export interface Integration {
  id: string;
  fromComponent: string;
  toComponent: string;
  fromLabel?: string;
  toLabel?: string;
  /** Human protocol line, e.g. 'gRPC · mTLS · vector.v1', 'ISO 8583 over TCP', 'Kafka topic orders.v2'. */
  protocol: string;
  kind: 'data' | 'control';        // control = deploys/config/lineage (drawn violet, dashed)
  ratePerSec: number;              // arc WIDTH and dash SPEED encode this
  health: 'healthy' | 'degraded' | 'failing';
  functions: IntegrationFunction[];
}

/** Function = an operation carried by an integration: RPC method, HTTP route, topic, SQL template, ISO message type. */
export interface IntegrationFunction {
  name: string;
  ratePerSec: number;
  p50: string;                     // pre-formatted with unit ('18 ms', '1.6 s wait'); adapters own the unit
  p99: string;
  errorPct: number;
}

export interface LineageNode {
  id: string;
  kind: 'data' | 'pipeline' | 'dataset' | 'training' | 'build' | 'evaluation' | 'artifact' | 'deployment' | string;
  label: string;
  /** id of the next node, or a component id where the chain lands. */
  next: string;
}

export interface Evidence {
  id: string;                      // short code shown in the UI: 'E1'
  kind: 'event' | 'metric' | 'config' | 'span' | 'log';
  at: string;
  subject: string;                 // component or instance id
  text: string;                    // one plain sentence
  source: string;                  // where the receipt lives (query, log stream, span id)
}

export interface CameraPreset {
  pivot: [number, number, number];
  distance: number;
  defaultAzimuthDeg: number;
  defaultElevationDeg: number;
  elevationRangeDeg: [number, number];
  focalPx?: number;
}

// ───────────────────────── Transactions (traces) ─────────────────────────

/** Row in the explorer list. */
export interface TransactionSummary {
  id: string;
  startedAt: string;
  tenant?: string;
  entrypoint: string;              // 'POST /v1/chat/completions', 'payment.authorize', 'dag:daily_orders'
  route?: string | null;           // variant / version / path taken ('canary', 'stable', 'issuer-B')
  instance?: string | null;        // where the heavy work ran
  status: TransactionStatus;
  code: number | string;           // 200, 503, 'ISO 05', 'FAILED'
  /** Headline latency used for sorting and SLO lines. Name is domain specific (ttftMs, authMs, durationMs). */
  metrics: Record<string, number | null>;
  /** Compact strip for the list and the replay bar. */
  timeline: { criticalPath: Segment[]; parallel: Segment[] };
}

export interface TransactionDetail extends TransactionSummary {
  calls: Call[];
}

export interface Segment {
  startMs: number;
  endMs: number;
  kind: 'ok' | 'fail' | 'wait' | 'gpu' | 'stream';   // 'gpu' = primary compute, rendered white-hot
}

/** Call = one span on one integration. The replay animates calls, not services. */
export interface Call {
  id: string;                      // span id shown in the UI ('s8')
  integrationId: string;
  function: string;
  callee: string;                  // component id (mockup used short anchor keys)
  startMs: number;
  endMs: number;
  status: CallStatus;
  kind: CallKind;
  note?: string;                   // failure code or reason ('DEADLINE_EXCEEDED', 'queue_timeout')
  attempt?: number;                // retries share an integration; attempt numbers them
  /** Specific instance hit by the call when it matters (shard/replica/node). */
  target?: string;
  payload?: Payload;
}

/** Exact request/response captured for a call. Redacted by default, server side. */
export interface Payload {
  request: string;                 // raw text: HTTP head + body, pretty JSON, Redis command, ISO 8583 dump…
  response: string;
  redacted: boolean;
  /** Present only when the viewer revealed content; the server logged the reveal. */
  revealAudit?: { by: string; at: string; reason: string };
}

// ───────────────────────── Live tail ─────────────────────────

/** One sampled call on an integration, streamed to the Integration tab. */
export interface CallSample {
  at: string;                      // ISO with milliseconds
  traceId: string;                 // short or full
  integrationId: string;
  function: string;
  status: 'OK' | string;           // protocol status text ('DEADLINE_EXCEEDED', '503', 'ISO 91')
  latencyMs: number;
  sampleRate: string;              // '1:50'
  payload?: Payload;
}
