/** System Atlas handover contract v1. Renderer-agnostic; not an OTLP wire format.
 * Integer millisecond offsets are relative to each trace's baseTimeUtc.
 * In a production adapter, preserve raw nanosecond timestamps separately.
 */
export type SourceMode = 'demo' | 'replay' | 'live';
export type Attributes = Record<string, string | number | boolean | null>;
export type TraceId = string; // 32 lowercase hex characters, nonzero
export type SpanId = string;  // 16 lowercase hex characters, nonzero
export interface Evidence {
  quality: 'synthetic' | 'observed' | 'declared' | 'inferred' | 'missing';
  source: string;
  note?: string;
}
export interface SnapshotMeta {
  schemaVersion: '1.0';
  sourceMode: SourceMode;
  sourceLabel: string;
  capturedAtUtc: string;
  observedAtUtc: string;
  watermarkUtc: string;
  streamId: string;
  sequence: number;
  completeness: 'complete' | 'partial';
}
export interface SystemGroup {
  id: string;
  label: string;
  parentId: string | null;
  kind: 'system' | 'domain' | 'cluster';
}
export interface Component {
  id: string;
  label: string;
  serviceName: string;
  groupId: string;
  kind: 'client' | 'service' | 'store' | 'queue' | 'compute' | 'artifact' | 'deployment';
  environment: string;
  evidence: Evidence;
  /** These are layout anchors, never physical position, latency, or health. */
  atlasLayout: { x: number; y: number; level: number };
}
export interface Resource {
  id: string;
  componentId: string;
  serviceName: string;
  instanceId: string;
  region: string;
  cluster: string;
  attributes: Attributes;
}
export interface TopologyEdge {
  id: string;
  sourceId: string;
  targetId: string;
  kind: 'dependency' | 'model-lineage' | 'deployment' | 'async';
  basis: 'declared' | 'observed';
  evidence: Evidence;
  observedWindowUtc?: { from: string; to: string };
  /** Missing/null means no measurement, not zero traffic. */
  observedRequestCount: number | null;
}
export interface ModelLineage {
  datasetVersionId: string;
  trainingRunId: string;
  checkpointId: string;
  modelVersionId: string;
  deploymentId: string;
  inferenceComponentId: string;
  evidence: Evidence;
}
export interface TopologySnapshot {
  meta: SnapshotMeta;
  groups: SystemGroup[];
  components: Component[];
  resources: Resource[];
  edges: TopologyEdge[];
  modelLineage: ModelLineage[];
}
export interface SpanLink {
  traceId: TraceId;
  spanId: SpanId;
  relation: 'async-caused-by' | 'retry-of' | 'related';
  evidence: Evidence;
}
export interface SpanEvent {
  name: string;
  atMs: number;
  attributes: Attributes;
  evidence: Evidence;
}
export interface Span {
  traceId: TraceId;
  spanId: SpanId;
  parentSpanId: SpanId | null;
  resourceId: string;
  componentId: string;
  name: string;
  kind: 'INTERNAL' | 'SERVER' | 'CLIENT' | 'PRODUCER' | 'CONSUMER';
  startMs: number;
  endMs: number | null;
  status: 'UNSET' | 'OK' | 'ERROR';
  statusMessage?: string;
  outcome: 'success' | 'error' | 'cancelled' | 'not-observed';
  evidence: Evidence;
  attributes: Attributes;
  events: SpanEvent[];
  links: SpanLink[];
}
export interface CoverageGap {
  kind: 'missing-span' | 'uninstrumented-boundary' | 'sampling' | 'clock-uncertainty';
  missingSpanId?: SpanId;
  componentId?: string;
  note: string;
}
export interface TraceRecord {
  meta: SnapshotMeta;
  traceId: TraceId;
  displayId: string;
  scenarioId: string;
  label: string;
  baseTimeUtc: string;
  startMs: number;
  endMs: number | null;
  watermarkOffsetMs: number;
  clockUncertaintyMs: number | null;
  lifecycle: 'finished' | 'open';
  outcome: 'success' | 'error' | 'cancelled' | 'not-observed';
  modelVersionId: string | null;
  missingSpanIds: SpanId[];
  gaps: CoverageGap[];
  payload: { availability: 'not-captured' | 'redacted' | 'permitted'; preview: string | null };
  spans: Span[];
}
export interface TraceFixtures {
  schemaVersion: '1.0';
  referenceScenarioId: string;
  traces: TraceRecord[];
}
export interface TraceQuery {
  componentId?: string;
  fromUtc?: string;
  toUtc?: string;
  cursor?: string;
  limit?: number;
}
export type TraceSummary = Pick<TraceRecord,
  'traceId' | 'displayId' | 'label' | 'baseTimeUtc' | 'startMs' | 'endMs' | 'lifecycle' | 'outcome'>;
export interface MetricSample {
  componentId: string;
  name: string;
  unit: string;
  value: number | null;
  sampledAtUtc: string;
  windowMs: number;
  evidence: Evidence;
}
export type AdapterUpdate = {
  streamId: string;
  sequence: number;
  observedAtUtc: string;
  watermarkUtc: string;
} & (
  | { kind: 'topology-replace'; topology: TopologySnapshot }
  | { kind: 'trace-upsert'; trace: TraceRecord }
  | { kind: 'span-upsert'; traceId: TraceId; span: Span }
  | { kind: 'trace-meta'; traceId: TraceId; endMs: number | null;
      lifecycle: TraceRecord['lifecycle']; outcome: TraceRecord['outcome'];
      completeness: SnapshotMeta['completeness']; watermarkOffsetMs: number }
  | { kind: 'gap'; traceId: TraceId; gap: CoverageGap }
  | { kind: 'metrics'; samples: MetricSample[] }
  | { kind: 'connection'; state: 'connected' | 'stale' | 'disconnected'; note?: string }
);
/** Bind one adapter instance to an immutable authorized source/system/environment.
 * Changing scope creates or selects another adapter and cancels prior subscriptions.
 * Query time windows are separate from source scope and scene/playback state.
 */
export interface AdapterScope {
  sourceId: string;
  systemId: string;
  environment: string;
}
export interface AdapterCapabilities {
  supportsInProgressSpans: boolean;
  supportsStreamingEvents: boolean;
  supportsLiveSubscription: boolean;
  supportsHistoricalQueries: boolean;
  supportsTopologyHistory: boolean;
  supportsMetrics: boolean;
  timestampResolutionMs: number | null;
  expectedExportDelayMs: number | null;
}
/** Interface only. No live data source or mock backend is implemented here. */
export interface AtlasDataAdapter {
  readonly mode: SourceMode;
  readonly scope: AdapterScope;
  readonly capabilities: AdapterCapabilities;
  /** atUtc requires topology-history capability; absence requests latest topology. */
  getTopology(options: { signal: AbortSignal; atUtc?: string }): Promise<TopologySnapshot>;
  getTrace(traceId: TraceId, options: { signal: AbortSignal }): Promise<TraceRecord>;
  listTraces(query: TraceQuery, options: { signal: AbortSignal }): Promise<{
    items: TraceSummary[]; nextCursor: string | null;
  }>;
  subscribe(query: { traceId?: TraceId; afterSequence?: number; streamId?: string },
    options: { signal: AbortSignal }): AsyncIterable<AdapterUpdate>;
  getMetrics?(query: { componentIds: string[]; fromUtc: string; toUtc: string },
    options: { signal: AbortSignal }): Promise<MetricSample[]>;
}
