/** No npm dependencies. Verify source content before scaffolding the UI. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(readFileSync(resolve(root,'data/curriculum.json'),'utf8'));
const manifest = JSON.parse(readFileSync(resolve(root,'data/manifest.json'),'utf8'));
const empty = JSON.parse(readFileSync(resolve(root,'data/progress.empty.example.json'),'utf8'));
const units = data.curriculum.flatMap(d => d.tracks.flatMap(t => t.levels));
const skills = units.flatMap(u => u.skills);
const labSteps = units.flatMap(u => u.lab.steps);
const ids = [
 ...data.curriculum.map(d => d.id),
 ...data.curriculum.flatMap(d => d.tracks.map(t => t.id)),
 ...units.map(u => u.id), ...skills.map(s => s.id),
 ...units.map(u => u.lab.id), ...labSteps.map(s => s.id),
 ...units.map(u => u.assessment.id),
 ...data.projects.map(p => p.id), ...data.projects.flatMap(p => p.tasks.map(t => t.id)),
 ...data.resources.map(r => r.id),
 ...data.study_plan.weeks.map(w => w.id),
 ...data.python_seven_day_starter.days.map(d => d.id),
];

test('complete source matches manifest counts', () => {
 assert.equal(data.curriculum.length,manifest.expected_counts.disciplines);
 assert.equal(data.curriculum.reduce((n,d)=>n+d.tracks.length,0),manifest.expected_counts.tracks);
 assert.equal(units.length,manifest.expected_counts.levels);
 assert.equal(skills.length,manifest.expected_counts.skills);
 assert.equal(labSteps.length,manifest.expected_counts.lab_steps);
 assert.equal(data.projects.length,manifest.expected_counts.projects);
 assert.equal(data.projects.flatMap(p=>p.tasks).length,manifest.expected_counts.project_tasks);
 assert.equal(data.resources.length,manifest.expected_counts.resources);
});

test('all progress IDs are unique and all tracks have exactly L1 L2 L3', () => {
 assert.equal(new Set(ids).size,ids.length);
 for (const subject of data.curriculum) for(const track of subject.tracks) {
   assert.deepEqual(track.levels.map(u=>u.level),['L1','L2','L3']);
 }
});

test('all curriculum cross references resolve',()=>{
 const unitSet = new Set(units.map(u=>u.id));
 const resourceSet = new Set(data.resources.map(r=>r.id));
 const projectSet = new Set(data.projects.map(p=>p.id));
 for(const d of data.curriculum) for(const t of d.tracks) {
  for(const p of t.prerequisite_unit_ids) assert.ok(unitSet.has(p));
  for(const r of t.resource_ids) assert.ok(resourceSet.has(r));
  for(const u of t.levels) {
   for(const p of u.prerequisite_unit_ids) assert.ok(unitSet.has(p));
   for(const r of u.resource_ids) assert.ok(resourceSet.has(r));
  }
 }
 for(const p of data.projects) for(const unit of p.related_unit_ids) assert.ok(unitSet.has(unit));
 for(const w of data.study_plan.weeks){
   for(const unit of w.suggested_unit_ids) assert.ok(unitSet.has(unit));
   for(const p of w.project_ids) assert.ok(projectSet.has(p));
 }
});

test('empty progress never fabricates achievements',()=>{
 assert.equal(empty.version,1);
 for(const field of ['skills','labSteps','assessments','projects','projectTasks','evidence','dayChecks','weekChecks','customReviews']) {
   assert.deepEqual(empty[field],{});
 }
});

test('future AI remains in source and Python L1 is navigable',()=>{
 assert.ok(data.curriculum.some(d=>d.id==='ai'&&d.priority==='later'));
 assert.ok(units.some(u=>u.id==='python-core-l1'));
 assert.ok(data.curriculum.every(d=>d.tracks.every(t=>t.levels.length===3)));
});
