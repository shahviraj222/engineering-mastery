# Acceptance tests and quality bar

## Dataset checks — executable now
```
python3 scripts/validate_dataset.py
node --test tests/content-contract.test.mjs
```
Source counts must match `data/manifest.json`. All resource IDs, unit prerequisites, project/plan links must resolve. IDs unique within each namespace AND globally among trackable entities.

## Domain unit tests (implement in app)
1. Empty progress yields exactly 0 learned, 0 practiced, 0 mastered, 0 lab steps completed, 0 assessments passed.
2. Updating one skill changes no other IDs; status `learning` affects activity, not mastery.
3. Completion metrics are denominated by correct number of items, not 405 for all metrics.
4. Unit initially not mastered; all skills + lab steps done without assessment/evidence still not mastered.
5. After all skills mastered, lab steps done, assessment passed, and evidence, unit is `self-assessed mastered`.
6. Reverting a mastered skill or lab step makes derived mastery false again.
7. Missing prerequisites produce advisory warnings only.
8. Projects and planning checked states do not automatically mark curricular mastery.
9. Review due dates use local YYYY-MM-DD and show overdue items; completing review does not auto-master.
10. Export/import roundtrip is stable, with notes, links, stages and due dates.
11. Reject schema-incompatible or prototype-pollution import keys. Invalid dates and non-http(s) links rejected or safely stripped with user consent.
12. Reset cancelled leaves state alone; reset confirmed clears user data but not curricular content.
13. Corrupt persisted state fails gracefully, without dropping recovery options.
14. AI discipline correctly marked `later`; Level 3 is visible in browse/search.

## UI integration tests (implement)
- Dashboard counters change immediately when unit skill status changes, and survive browser reload.
- Browser search `transaction` reaches DB unit; `agents` reaches future AI unit; `Python` matches appropriate units.
- All 10 disciplines have links; all 27 tracks and 81 levels reachable from `/learn`.
- Lab checkbox toggle persists and renders correct state after navigation away/back.
- Assessment shows full rubric and lets learner record meaningful evidence; mastery explanation always accurate.
- P3 project tasks can be checked without touching unrelated P2 task status.
- Plan setting start day works around month boundaries; unfinished week visible.
- New learner can get to first Python unit within 2 clicks.
- Export produces downloadable JSON; importing restores identical state after confirmed clear.
- 360px view doesn't overflow; all text and controls usable via keyboard.
- External resources use safe URLs and do not automatically fetch/scrape sites.

## E2E critical journeys
### E2E-01 First session
Open clean browser → home shows 0/405 → click Continue → `python-core-l1` → set first skill learning → finish 1 lab step → save note → reload → exact state restored, mastery 0.

### E2E-02 Mastery gate
Open an untouched unit → ask why not mastered → unmet list describes skills/lab/assessment/evidence → fulfill each → label becomes self-assessed mastered → unmark skill → label disappears.

### E2E-03 Portability
Change 1 skill, 1 lab step, 1 assessment and 1 project task; add evidence and review due; export JSON → clear confirmation → import → verify all exact statuses and notes recovered.

### E2E-04 Future content and search
Search `agents` → AI visible as later; open L3 and verify no accidental blocked navigation; prerequisites link back to existing unit.

## Performance and UI
- Initial display should feel quick on midrange phone; avoid rendering hundreds of offscreen rows by default.
- No console errors / runtime errors during interactions; valid React keys.
- Accessibility: semantic nav/header/main, labels, focus visibility, keyboard interactions, reasonable contrast, screen reader status text.
- Do not report tests as passing unless executed; tell user if browser testing dependencies cannot be installed.
