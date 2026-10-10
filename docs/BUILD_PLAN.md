# Engineering implementation plan for Codex

## Technology decisions
- Default: **React + TypeScript + Vite** static SPA. The tracker uses JS/TS because this is a WEB app; the learner's software-engineering curriculum remains Python-first.
- Styling: Tailwind CSS or a simple organized design-token CSS; responsive/accessibility tests matter more than framework choice.
- Routing: React Router or equivalent with real deep links. For static deployment, choose a hosting strategy supporting SPA fallback or use HashRouter with explained URLs.
- Browser persistence: localStorage for MVP state (mostly short notes and statuses), robust serialization/validation. Never use a server/API to save personal progress.
- Tests: Vitest + React Testing Library + a few Playwright flows. `npm run build` and `npm run test` are required before calling implementation done.
- External resources open securely in new tabs with `rel="noopener noreferrer"`.
- Use stable versions available in the execution environment, commit `package-lock.json` after install. Do not fabricate successful installations.

## Recommended component structure (adjust with justification)
```
src/
  app/                  # router, layouts, startup
  components/           # nav, cards, progress labels, forms, dialogs
  features/
    overview/
    curriculum/
    unit/
    projects/
    planner/
    reviews/
    resources/
    settings/
  data/                 # imports/re-exports canonical JSON
  domain/               # IDs/types/indexes, progress selectors, derived mastery
  storage/              # validation, migration, import/export, persistence
  styles/
  tests/
```
No REST API or database is necessary for tracker MVP. Don't add Express/Python server to the tracker unless user explicitly asks.

## Phase 0 — Validate foundation
- Run Python/Node source-data tests.
- Read JSON roots, 10 disciplines, 27 tracks, 81 units, 405 skills, 243 lab steps, 81 assessments, 7 projects, 37 resources.
- Build indexes by ID for units, skills, steps, assessments and projects.
- Derive counts from data, not hardcoded numbers.

## Phase 1 — Functional foundation
- Scaffold app, route layout/navigation and design tokens.
- Strongly typed curriculum selectors and state actions; default from `progress.empty.example.json`.
- Versioned localStorage adapter, safe load and corrupted-data fallback, unit tests.
- Pages: Overview, Curriculum Browser, Unit Detail (full content).
- Check statuses, lab steps, assessment status and unit evidence with aggregate display.
**Gate:** From dashboard to `python-core-l1`, mark one skill `learning`, add evidence, reload: same state, 0 mastered overall.

## Phase 2 — Complete core tracking
- Project list + details, all 28 project task IDs.
- Resources library, robust search, prerequisites links, L1/L2/L3 navigation and now/later filter.
- Study Planner with 7 days, 8 weeks, adjustable local start date, checkboxes not conflated with mastery.
- Review Queue with user-controlled due dates and rescheduling.
**Gate:** All 8 navigation routes functional, real empty states, counts match manifest.

## Phase 3 — Data safety and mastery
- Derived unit mastery with explicit unmet requirements, display “self-assessed” for passed units.
- Settings: JSON export/import validation + replace confirmation; resilience to invalid imports, storage quotas and malicious notes/URLs.
- Ensure no status collision; verify deep links and day boundary correctness.
**Gate:** export → reset → import reproduces notes, assessments, steps and progress.

## Phase 4 — Fit and finish
- Accessibility and responsiveness, meaningful loading/empty/error states, theme if time.
- Unit tests for progress logic and import validation, component tests for interactions, browser E2E for critical paths.
- Performance at all 405 skills, minimal DOM rendering until needed, no pointless auto-executed animations.
- Production build, installation/run instructions, deployment note (SPA fallback or hash routing).
**Gate:** `npm run build` passes, automated tests pass, and manual smoke tests verified. Report any missing functionality honestly.

## Commit strategy
Use one commit per phase when git is initialized; keep curricular data changes separate (ideally no content changes). If a product need suggests content edits, document proposal instead of silently editing data.

## Final report expected from Codex
Provide (1) what was built and route map, (2) how to run it, (3) exact commands run and pass/fail status, (4) data count check, (5) storage/backup behavior, (6) known limitations and next steps. No claims of official accreditation, guaranteed salary or backend/cloud sync.
