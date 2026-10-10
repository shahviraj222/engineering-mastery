#!/usr/bin/env python3
"""Validate the immutable mastery curriculum before Codex builds the app.

Runs with Python standard library; optionally uses jsonschema if installed.
"""
import hashlib
import json
import sys
from collections import Counter
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'data' / 'curriculum.json'
MANIFEST = ROOT / 'data' / 'manifest.json'
SCHEMA = ROOT / 'schemas' / 'curriculum.schema.json'


def fail(msg):
    raise AssertionError(msg)


def load(p):
    return json.loads(p.read_text(encoding='utf-8'))


def main():
    d, manifest = load(DATA), load(MANIFEST)
    assert d['dataset_id'] == manifest['dataset_id'], 'Dataset ID differs'
    sha = hashlib.sha256(DATA.read_bytes()).hexdigest()
    assert sha == manifest['content_sha256'], 'Curriculum modified from canonical handoff. Restore or knowingly refresh manifest.'

    try:
        from jsonschema import Draft202012Validator, FormatChecker
    except ImportError:
        print('NOTE: jsonschema not installed; performing semantic checks without full JSON Schema validation')
    else:
        schema = load(SCHEMA)
        Draft202012Validator(schema, format_checker=FormatChecker()).validate(d)

    ids = []
    kinds = {}
    def register(item_id, kind):
        if item_id in kinds:
            fail(f'ID {item_id!r} reused across {kinds[item_id]} and {kind}')
        kinds[item_id] = kind
        ids.append(item_id)

    units = {}
    tracks = {}
    resources = {}
    for resource in d['resources']:
        register(resource['id'], 'resource')
        url = urlsplit(resource['url'])
        assert url.scheme in ('https','http') and url.netloc, f'Invalid resource URL: {resource["id"]}'
        resources[resource['id']] = resource

    counts = {'disciplines': 0,'tracks':0,'levels':0,'skills':0,'lab_steps':0,'assessments':0,'projects':0,'project_tasks':0,'resources':len(resources),'weekly_sprint_items':0,'python_starter_days':0}
    for discipline in d['curriculum']:
        register(discipline['id'], 'discipline')
        counts['disciplines'] += 1
        assert discipline['priority'] in ('now','later')
        for track in discipline['tracks']:
            register(track['id'], 'track')
            tracks[track['id']] = track
            counts['tracks'] += 1
            assert [u['level'] for u in track['levels']] == ['L1','L2','L3'], f'Missing L1-3 {track["id"]}'
            for u in track['levels']:
                register(u['id'], 'unit')
                units[u['id']] = u
                counts['levels'] += 1
                assert len(u['skills']) >= 5
                for skill in u['skills']:
                    register(skill['id'], 'skill')
                    assert skill['status_default'] == 'not_started'
                    counts['skills'] += 1
                register(u['lab']['id'], 'lab')
                assert u['lab']['steps']
                for step in u['lab']['steps']:
                    register(step['id'], 'lab-step')
                    counts['lab_steps'] += 1
                register(u['assessment']['id'], 'assessment')
                counts['assessments'] += 1
                assert len(u['assessment']['rubric']) >= 1
    projects = {}
    for project in d['projects']:
        register(project['id'], 'project')
        projects[project['id']] = project
        assert project['status_default'] == 'not_started'
        counts['projects'] += 1
        for task in project['tasks']:
            register(task['id'], 'project-task')
            counts['project_tasks'] += 1
    for week in d['study_plan']['weeks']:
        register(week['id'], 'sprint-week')
        counts['weekly_sprint_items'] += 1
    for day in d['python_seven_day_starter']['days']:
        register(day['id'], 'starter-day')
        counts['python_starter_days'] += 1

    for discipline in d['curriculum']:
        for track in discipline['tracks']:
            for rid in track.get('resource_ids', []):
                assert rid in resources, f'Unresolved resource {rid}'
            for prereq in track.get('prerequisite_unit_ids', []):
                assert prereq in units, f'Unresolved track prerequisite {prereq}'
            for u in track['levels']:
                for rid in u['resource_ids']:
                    assert rid in resources, f'Unresolved unit resource {rid}'
                for prereq in u['prerequisite_unit_ids']:
                    assert prereq in units and prereq != u['id'], f'Unresolved/self unit prerequisite {prereq}'
    for project in d['projects']:
        for unit in project['related_unit_ids']:
            assert unit in units, f'Unresolved project unit {unit}'
    for week in d['study_plan']['weeks']:
        for unit in week['suggested_unit_ids']:
            assert unit in units, f'Unresolved week unit {unit}'
        for project in week['project_ids']:
            assert project in projects, f'Unresolved week project {project}'
    for day in d['python_seven_day_starter']['days']:
        for unit in day['related_unit_ids']:
            assert unit in units, f'Unresolved starter unit {unit}'

    # Check cycles in actual unit prerequisite graph.
    processing, finished = set(), set()
    def visit(unit):
        if unit in processing:
            fail(f'Circular prerequisites including {unit}')
        if unit in finished:
            return
        processing.add(unit)
        for p in units[unit]['prerequisite_unit_ids']:
            visit(p)
        processing.remove(unit)
        finished.add(unit)
    for unit in units:
        visit(unit)

    assert counts == manifest['expected_counts'], f'Count mismatch: actual={counts} manifest={manifest["expected_counts"]}'
    expected_disc = manifest['per_discipline']
    assert len(expected_disc) == len(d['curriculum'])
    for r, sub in zip(expected_disc, d['curriculum']):
        assert sub['id'] == r['id']
        assert len(sub['tracks']) == r['tracks']
        assert sum(len(t['levels']) for t in sub['tracks']) == r['levels']
        assert sum(len(u['skills']) for t in sub['tracks'] for u in t['levels']) == r['skills']

    progress = load(ROOT / 'data' / 'progress.empty.example.json')
    try:
        from jsonschema import Draft202012Validator, FormatChecker
    except ImportError:
        pass
    else:
        progress_schema = load(ROOT / 'schemas' / 'progress.schema.json')
        Draft202012Validator(progress_schema, format_checker=FormatChecker()).validate(progress)
    assert progress['version'] == 1
    for key in ('skills','labSteps','assessments','projects','projectTasks','evidence','dayChecks','weekChecks','customReviews'):
        assert progress[key] == {}, f'Initial progress is non-empty in {key}'
    print('PASS: Canonical curriculum SHA256 and semantic references valid')
    print('PASS: IDs unique; prerequisites acyclic; resources valid; empty progress untouched')
    print('PASS:',', '.join(f'{k}={v}' for k, v in counts.items()))


if __name__ == '__main__':
    try:
        main()
    except Exception as exc:
        print(f'FAIL: {exc}', file=sys.stderr)
        sys.exit(1)
