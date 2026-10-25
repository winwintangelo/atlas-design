# 06 · Data contracts and APIs

Types: `schema/atlas.types.ts`. Examples: `fixtures/`. The front end must also run fully **offline from fixtures** (`?source=fixtures/ai-platform`) for development, demos and visual tests.

## Endpoints (proposed; the backend team owns the final shape)

| Method & path | Returns | Refresh | Notes |
|---|---|---|---|
| `GET /atlas/systems` | `SystemInfo[]` | on load | System switcher (future) |
| `GET /atlas/systems/{sys}/topology?at=` | `Topology` | on load; every 5 min | Includes districts, components, instances, integrations (+ functions + 5-min stats), lineage, evidence |
| `GET /atlas/systems/{sys}/metrics?at=` | partial `Topology` (metrics, health, queue depths, instance util) | every 5 s (SSE preferred) | Drives heights, windows, cars and arc speeds |
| `GET /atlas/systems/{sys}/transactions?q=&status=&route=&from=&to=&limit=50` | `{ total: number, items: TransactionSummary[] }` | on query change (debounced) | `q` uses the grammar in 05 §4. Server-side search |
| `GET /atlas/transactions/{id}` | `TransactionDetail` without payload bodies | on select | Calls sorted by `startMs` |
| `GET /atlas/transactions/{id}/calls/{callId}/payload` | `Payload` (redacted) | on demand | Lazy-load the current call; prefetch ±2 neighbours |
| `POST /atlas/transactions/{id}/calls/{callId}/payload:reveal` body `{reason}` | `Payload` (unredacted, with `revealAudit`) | on demand | Role-gated; writes an audit record; 403 → UI message |
| `GET /atlas/integrations/{id}?window=5m` | `Integration` + `sparkline: number[]` (p99, 40 points) | on select; every 15 s | |
| `GET /atlas/integrations/{id}/tail?fn=` (SSE or WebSocket) | stream of `CallSample` | live | Server-side sampling (default 1:50) and redaction. Max 20 msg/s to the client |
| `GET /atlas/evidence?ids=E1,E2` | `Evidence[]` | on demand | Each has a `source` the UI deep-links to (logs, metrics, config) |

## Sample payloads

### Call with payload (from `fixtures/transactions.ai-platform.json`)
```json
{
  "id": "s8",
  "integrationId": "retr-vec",
  "function": "vector.v1.Shard/Query",
  "callee": "vector-store",
  "startMs": 48, "endMs": 298,
  "status": "fail", "kind": "rpc",
  "note": "DEADLINE_EXCEEDED", "attempt": 1,
  "target": "vector-store/vs-03/primary",
  "payload": {
    "redacted": true,
    "request":  "{\n  \"shard\": \"vs-03\",\n  \"replica\": \"primary\",\n  \"attempt\": 1,\n  \"k\": 8,\n  \"deadline_ms\": 250,\n  \"vector\": \"[1024 floats]\"\n}",
    "response": "{\n  \"error\": {\n    \"code\": \"DEADLINE_EXCEEDED\",\n    \"message\": \"shard vs-03/primary exceeded 250 ms\",\n    \"compaction\": \"running since 13:57:40\"\n  }\n}"
  }
}
```

### Live tail sample
```json
{ "at": "2026-10-24T14:03:04.103Z", "traceId": "042f56", "integrationId": "retr-vec",
  "function": "vector.v1.Shard/Query", "status": "DEADLINE_EXCEEDED", "latencyMs": 250, "sampleRate": "1:50" }
```

## Payload capture, redaction and audit (must-haves)

1. **Capture is opt-in per service and per function.** Default: headers + body shape, with values redacted. Capture policy is configured in the collector, not the UI.
2. **Redaction happens on the server** before storage or transport:
   - Free-text user content → `[redacted · N tokens]`.
   - Secrets and auth headers → `••••` + last 4.
   - Card data → `[redacted · PCI]`.
   - Emails, phones and addresses → pattern masks.
   - Redaction rules are data (per system), not code.
3. **Reveal:**
   - requires a role (e.g. `incident-responder`) and a free-text reason
   - is logged with `who / when / what / reason`
   - returns content for **that one call only**
   - expires on navigation
4. **No payloads in browser storage, logs or analytics.** In-memory cache only, cleared when the transaction changes.
5. **Size limits:** truncate at 256 KB for display, with an audited full download.
6. Mark every UI payload with its state: `user content redacted` or `content revealed · logged`.

## Adapter checklist (per new system type)

- [ ] District rule configured (attribute / namespace / regex)
- [ ] Component type rules (datastore, queue, gateway, job, pool) verified on a sample
- [ ] Headline metric chosen (`ttftMs`, `authMs`, `durationMs`…) with its SLO
- [ ] Route/variant attribute chosen (canary, version, issuer path, region)
- [ ] Function naming normalised (no ids in names, e.g. `/orders/{id}`)
- [ ] Redaction rules for that domain's sensitive fields
- [ ] Evidence sources wired (events, config, logs) with deep links
- [ ] A fixture file generated from a real (scrubbed) incident for visual tests
