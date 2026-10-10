# Product requirements — Engineering Mastery Tracker

## Product in one sentence
A calm, fast, trustworthy **solo learning-progress tracker** that helps a returning programmer work from Python basics through software engineering and later AI, with **proof-based Level 1/2/3 mastery**.

## Personas, jobs to be done
- Primary: one learner, currently comfortable with Python for DSA but rebuilding practical development fluency after an approximately two-year project gap.
- Daily: “Tell me the next useful thing to learn, let me do practical work, mark my evidence, and resume quickly tomorrow.”
- Weekly: “Show meaningful progress against practical milestones, not fake scores.”
- Monthly: “Let me review forgotten skills and export an accurate backup.”

## Source-of-truth hierarchy
1. Curriculum content in `data/curriculum.json` (never substitute generated lessons).
2. Rules in `docs/PROGRESS_AND_MASTERY.md` and `docs/TEST_PLAN.md`.
3. Layout/interaction details in `docs/UX_AND_DESIGN.md`.
4. Implementation flexibility under `docs/BUILD_PLAN.md`.

## IA / navigation: implement ALL eight routes

| Route | Page | Required features |
|---|---|---|
| `/` | Overview | 0/405 on fresh state, active focus, next actionable unit/lab, status counters, progress by all 10 disciplines, resume CTA, short roadmap principles |
| `/learn` | Curriculum browser | 10 discipline cards, drill into 27 tracks / 81 levels; search all titles/outcomes/skill texts; filter by subject/L1-L3/status/now-vs-later; collapse/expand; deep links |
| `/learn/:unitId` | Unit details | Full exact 5+ skills; 3+ practical lab steps; assessment with rubric and evidence; status editor, notes, prerequisites, linked resources, next-level navigation, mastery explanation |
| `/projects` and `/projects/:projectId` | Project lab | 7 progressive projects, 28 task checkboxes, project notes/evidence, stage badges, linked units, independent project status, one next action |
| `/plan` | Study planner | Seven-day Python starter, eight-week sprint, default 30h/week editable, user-selected start date, day/week completion distinct from mastered status, weekly units, flexible rescheduling |
| `/reviews` | Review queue | Upcoming/overdue reviews, user-selectable review due date, mark review performed, spaced intervals optional, filter due/soon/done |
| `/resources` | Library | All 37 resources with title/type/context and safe external URL; search/filter; no fetching third-party webpages |
| `/settings` | Preferences and data | Preferred weekly hours, theme, optional study start, export JSON, import preview with validation and error states, reset with typed/explicit confirmation, privacy explanation |

### Required top-level UX actions
- “Continue learning” prioritizes an active current unit (user selection), then pending Python L1/sprint recommendations; never selects AI L3 as the default.
- All unit, resource, project and weekly references are clickable and navigable. Prerequisites only warn.
- Header/sidebar links are real and current page highlighted; browser back/forward works.
- Search returns explicit results with context (discipline → track → unit → skill); no results state is helpful.
- User can record text evidence plus http(s) links; displayed text is escaped. No file attachments necessary in MVP (avoid storage bloat).

## Data and navigation relationships
- `curriculum[]` → `tracks[]` → `levels[]` → `skills[]`, `lab.steps[]`, `assessment`.
- Cross-links: `prerequisite_unit_ids`, `resource_ids`, `related_unit_ids`, `suggested_unit_ids`.
- All dashboard counts dynamically derived from the full JSON; no hardcoded sample totals in UI components.
- Manifest counts are used in checks, not artificial progress.
- `progress.empty.example.json` denotes default state and should result in 0 learned/0 mastered/0 tests passed.

## Functional acceptance journeys

**Journey 1 / First-day learning**: Home → “Continue” → Python discipline → `python-core-l1` → mark one skill `learning` → check first lab step → save note → reload → exact changes preserved and overall mastered remains 0.

**Journey 2 / Mastery gate**: In a selected unit, mark skills mastered. Attempt “Verify Level” early: shows exactly which remaining skills, lab steps, assessment and evidence are missing. After completing all and saving proof, derived level reads “self-assessed mastered.” The site cannot automatically confirm expert competence; the mark must remain clearly self-reported.

**Journey 3 / Find content**: Search `transaction` → meaningful database topics appear → open result → prerequisites (if any) work. Search `agents` → deferred AI results visible but labeled “Later specialization.”

**Journey 4 / Project build**: Open p3 → check a task → add test evidence URL or note → navigate to linked `db-sql-l1` → return → p3 remains updated, independent of skills.

**Journey 5 / Planner and review**: Select sprint start date; current week derived with local date. Mark a week done: its associated units are not auto-mastered. Mark skill practiced with review date: it appears on `/reviews` when due.

**Journey 6 / Portability**: Make changes including notes and one assessment; export → clear after confirmation → import backup via preview; all states restored, no generated achievements.

## Out of scope for MVP
Auth, cloud sync, multiuser workspace, social feed, certification badges, model-graded assessments, AI assistant integration, reminders/push notifications, browser extensions, online course scraping, mobile app. Do not introduce unnecessary infrastructure.

## User trust / correctness
- Fresh state must be real zero progress, never demo data.
- Evidence and mastery must remain conceptually separate. A skill state `mastered` is *the learner's assertion*, not a verified qualification.
- Unfinished plan items remain visible even when their suggested dates are past.
- No false “job-ready percentage,” “₹40 LPA probability,” or promised timeline.
- Offline behavior: local persistence always works; for true offline page loading, implement/test service-worker/PWA caching or state transparently that first load needs the web. Don't claim offline functionality without a real test.
