#!/usr/bin/env python3
"""Validate handover fixture integrity and the intended demo behaviors; stdlib only."""
import json
import re
from datetime import datetime, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def check(condition, message):
    if not condition:
        raise AssertionError(message)


def timestamp(value):
    check(isinstance(value, str) and value.endswith('Z'), f'UTC timestamp required: {value!r}')
    return datetime.fromisoformat(value.replace('Z', '+00:00'))


def integer(value):
    return isinstance(value, int) and not isinstance(value, bool)


def hex_id(value, length):
    return isinstance(value, str) and bool(re.fullmatch('[0-9a-f]{' + str(length) + '}', value)) and int(value, 16) != 0


def unique(items, key='id'):
    result = {item[key]: item for item in items}
    check(len(result) == len(items), f'Duplicate {key}')
    return result


def check_meta(meta):
    check(meta['schemaVersion'] == '1.0', 'Unknown schema version')
    check(meta['sourceMode'] == 'demo', 'Fixtures must not claim live/replay data')
    check(meta['sourceLabel'] == 'SIMULATED DATA', 'Missing demo label')
    check(integer(meta['sequence']) and meta['sequence'] > 0, 'Invalid sequence')
    check(timestamp(meta['watermarkUtc']) <= timestamp(meta['observedAtUtc']) <= timestamp(meta['capturedAtUtc']), 'Inconsistent snapshot times')


def main():
    topology = json.loads((ROOT / 'topology.json').read_text())
    fixture = json.loads((ROOT / 'traces.json').read_text())
    check_meta(topology['meta'])
    groups = unique(topology['groups'])
    components = unique(topology['components'])
    resources = unique(topology['resources'])
    edges = unique(topology['edges'])
    for group in groups.values():
        check(group['parentId'] is None or group['parentId'] in groups, 'Missing group parent')
    for component in components.values():
        check(component['groupId'] in groups, 'Missing component group')
        check(component['evidence']['quality'] == 'synthetic', 'Non-synthetic fixture evidence')
        check(all(isinstance(component['atlasLayout'][k], (int, float)) for k in ('x', 'y', 'level')), 'Invalid layout anchor')
    for resource in resources.values():
        check(resource['componentId'] in components, 'Missing resource component')
        check(resource['serviceName'] == components[resource['componentId']]['serviceName'], 'Service identity mismatch')
    for edge in edges.values():
        check(edge['sourceId'] in components and edge['targetId'] in components, 'Missing edge endpoint')
        check(edge['basis'] in ('declared', 'observed'), 'Missing relationship basis')
        check(edge['evidence']['quality'] == 'synthetic', 'Non-synthetic fixture edge')
        if edge['basis'] == 'declared':
            check(edge['observedRequestCount'] is None, 'Declared edge invents a measured traffic count')
        else:
            check(integer(edge['observedRequestCount']) and edge['observedRequestCount'] >= 0, 'Observed count invalid')
            window = edge['observedWindowUtc']
            check(timestamp(window['from']) <= timestamp(window['to']), 'Reversed observation window')
    for lineage in topology['modelLineage']:
        check(lineage['inferenceComponentId'] in components, 'Missing deployed inference component')
        check(all(lineage[k] for k in ('datasetVersionId', 'trainingRunId', 'checkpointId', 'modelVersionId', 'deploymentId')), 'Incomplete model lineage identity')

    traces = unique(fixture['traces'], 'traceId')
    scenarios = unique(fixture['traces'], 'scenarioId')
    all_spans = {(t['traceId'], s['spanId']): s for t in traces.values() for s in t['spans']}
    total_spans = sum(len(t['spans']) for t in traces.values())
    check(len(all_spans) == total_spans, 'Duplicate span within trace')
    for trace in traces.values():
        check_meta(trace['meta'])
        check(hex_id(trace['traceId'], 32), 'Invalid trace ID')
        check(trace['payload'] == {'availability': 'not-captured', 'preview': None}, 'Unexpected payload capture')
        check(integer(trace['startMs']) and integer(trace['watermarkOffsetMs']), 'Noninteger trace time')
        check(trace['startMs'] <= trace['watermarkOffsetMs'], 'Trace starts after watermark')
        check(timestamp(trace['meta']['watermarkUtc']) == timestamp(trace['baseTimeUtc']) + timedelta(milliseconds=trace['watermarkOffsetMs']), 'Watermark offset mismatch')
        if trace['endMs'] is None:
            check(trace['lifecycle'] == 'open' and trace['outcome'] == 'not-observed', 'Open trace has fabricated terminal result')
        else:
            check(integer(trace['endMs']) and trace['startMs'] <= trace['endMs'] <= trace['watermarkOffsetMs'], 'Invalid trace interval')
            check(trace['lifecycle'] == 'finished', 'Ended trace has wrong lifecycle')
        missing = set(trace['missingSpanIds'])
        check(all(hex_id(v, 16) for v in missing), 'Invalid missing-parent context')
        by_id = unique(trace['spans'], 'spanId')
        check(not missing.intersection(by_id), 'Missing span also present')
        check(any(s['parentSpanId'] is None for s in by_id.values()), 'Trace has no captured root')
        for s in by_id.values():
            check(s['traceId'] == trace['traceId'] and hex_id(s['spanId'], 16), 'Span identity invalid')
            check(s['componentId'] in components and s['resourceId'] in resources, 'Missing span resource')
            check(resources[s['resourceId']]['componentId'] == s['componentId'], 'Span resource identity mismatch')
            check(s['evidence']['quality'] == 'synthetic', 'Non-synthetic span')
            check(integer(s['startMs']) and s['startMs'] >= trace['startMs'], 'Invalid span start')
            bound = s['endMs'] if s['endMs'] is not None else trace['watermarkOffsetMs']
            check(integer(bound) and s['startMs'] <= bound <= trace['watermarkOffsetMs'], 'Invalid span interval')
            if trace['endMs'] is not None:
                check(bound <= trace['endMs'], 'Span exceeds completed trace envelope')
            if s['endMs'] is None:
                check(trace['lifecycle'] == 'open' and s['status'] == 'UNSET' and s['outcome'] == 'not-observed', 'Open span invents terminal status')
            if s['status'] == 'ERROR':
                check(s['outcome'] == 'error' and s.get('statusMessage') and any(e['name'] == 'exception' for e in s['events']), 'Error status lacks explicit fixture evidence')
            if s['status'] == 'UNSET':
                check(s['outcome'] == 'not-observed', 'Unset fixture status was guessed')
            parent = s['parentSpanId']
            check(parent is None or parent in by_id or parent in missing, 'Unacknowledged missing parent')
            visited = {s['spanId']}
            while parent in by_id:
                check(parent not in visited, 'Parent cycle')
                visited.add(parent)
                parent = by_id[parent]['parentSpanId']
            for event in s['events']:
                check(integer(event['atMs']) and s['startMs'] <= event['atMs'] <= bound, 'Event outside span')
                check(event['evidence']['quality'] == 'synthetic', 'Event lacks captured demo evidence')
            for link in s['links']:
                check(hex_id(link['traceId'], 32) and hex_id(link['spanId'], 16), 'Invalid link identity')
                check((link['traceId'], link['spanId']) in all_spans, 'Unresolved fixture link')
                check(link['evidence']['quality'] == 'synthetic', 'Link lacks explicit evidence')
        for span_id in missing:
            check(any(g.get('missingSpanId') == span_id for g in trace['gaps']), 'Missing span lacks coverage explanation')

    reference = scenarios[fixture['referenceScenarioId']]
    check(reference['displayId'] == '#7F2A', 'Wrong reference display ID')
    check(reference['endMs'] - reference['startMs'] == 2840, 'Reference total must be 2840 ms')
    queue = [s for s in reference['spans'] if s['attributes'].get('operation.phase') == 'queue.wait']
    check(len(queue) == 1 and queue[0]['startMs'] == 480 and queue[0]['endMs'] == 1430, 'Reference queue must be 480–1430 ms')
    check(queue[0]['endMs'] - queue[0]['startMs'] == 950, 'Reference queue must be 950 ms')
    parallel = scenarios['parallel-retry']
    retrieve = next(s for s in parallel['spans'] if s['componentId'] == 'retrieval')
    tool = next(s for s in parallel['spans'] if s['componentId'] == 'tool-service')
    check(max(retrieve['startMs'], tool['startMs']) < min(retrieve['endMs'], tool['endMs']), 'Missing parallel overlap')
    retry = [s for s in parallel['spans'] if s['componentId'] == 'vector-db']
    check([s['status'] for s in retry] == ['ERROR', 'OK'] and parallel['outcome'] == 'success', 'Recovered retry semantics lost')
    consumer = scenarios['async-audit']['spans'][0]
    link = consumer['links'][0]
    producer = all_spans[(link['traceId'], link['spanId'])]
    check(consumer['parentSpanId'] is None and link['traceId'] != consumer['traceId'], 'Async link was converted into parentage')
    check(consumer['kind'] == 'CONSUMER' and producer['kind'] == 'PRODUCER', 'Wrong async roles')
    check(scenarios['async-audit']['startMs'] > parallel['endMs'], 'Async example must outlive originating request')
    partial = scenarios['partial-unknown']
    check(partial['meta']['completeness'] == 'partial' and partial['outcome'] == 'not-observed' and partial['gaps'], 'Partial trace invents certainty')
    streaming = scenarios['open-streaming']
    check(streaming['endMs'] is None and streaming['watermarkOffsetMs'] == 1200, 'Invalid streaming fixture')
    check(not any(e['name'] == 'response.completed' for s in streaming['spans'] for e in s['events']), 'Open stream invents completion')
    print(f'PASS: {len(components)} components, {len(resources)} resources, {len(edges)} edges, {len(traces)} traces, {total_spans} spans; all reference and uncertainty scenarios validated.')


if __name__ == '__main__':
    main()
