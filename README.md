# Engineering Mastery

A complete, local-first workspace built from the supplied Python-first curriculum, plus a personal job application tracker. Starts with real zero progress. React, TypeScript, Vite, React Router, Lucide, and a small CSS design system.

## Start locally

Use Node.js 22.12+ (or 24/26) and npm.

```sh
npm ci
npm run dev
```

Open the printed localhost URL. For a production build: `npm run build`, then `npm run preview`.

## Your daily workflow

1. **Overview → Continue learning** opens your selected focus or the next foundation unit.
2. Update a skill as learning, practiced, or mastered. Check lab steps and record your reasoning, evidence links, and assessment result.
3. Set review dates on individual skills. Adjust your seven-day starter or eight-week plan whenever needed.
4. Use **Applications** to save roles, update stages, and keep interview notes and follow-up dates.
5. Export a backup regularly from **Settings & backups**.

## Pages

Hash routes work on any static host, including direct links and refreshes.

| Route | Purpose |
| --- | --- |
| `/#/` | Overview, progress by discipline, next step, sprint and follow-ups |
| `/#/learn` | Full searchable/filterable curriculum; expandable disciplines |
| `/#/learn/:unitId` | Exact skills, labs, assessment rubric, evidence, prerequisites, resources |
| `/#/projects` and `/#/projects/:projectId` | Seven projects, task checklists, independent status and evidence |
| `/#/plan` | Seven-day starter, eight-week sprint, dates, weekly hours and routines |
| `/#/reviews` | Due, overdue, upcoming and completed reviews; rescheduling |
| `/#/resources` | All 37 resource links with search and type filters |
| `/#/applications` | Create/edit/delete opportunities, stages, contacts, salary notes and follow-ups |
| `/#/settings` | Theme, study preferences, validated JSON backup/restore, confirmed reset |

## Content and progress integrity

`data/curriculum.json` is unchanged. Its SHA-256 remains `23b40c45581d68b190368adf8c0fe7862a836dbb7db00c4857d870679b23308b`.

The full source contains 10 disciplines, 27 tracks, 81 units, 405 skills, 243 lab steps, 81 assessments, 7 projects, 28 project tasks, 37 resources, 8 sprint weeks, and 7 starter days. AI remains available as a later specialization.

A unit becomes **self-assessed mastered** only when all its skills are mastered, all lab steps are done, the assessment is passed, and evidence is recorded. Reversing a requirement removes that derived status. Study-plan checks, project completion, and review actions do not award skill mastery. Prerequisites provide guidance, never route locks. The salary goal is an aspiration, not a predicted outcome.

## Local storage and backups

- Progress is stored under `engineering-mastery:v1:progress` in this browser. No backend, analytics, AI APIs, accounts, or cloud progress sync are implemented.
- A private Sites deployment can provide an owner-only entry point; its platform sign-in is separate from local application storage.
- Different devices, browsers, and site origins have separate records. Transfer with Export → Import.
- Browser clearing/private browsing can remove data. Keep downloaded backups somewhere safe.
- Imports are schema-validated, bounded to 5 MB, previewed, and explicitly confirmed before replacement. Invalid IDs, status values, dates, unknown fields, unsafe URL schemes, and prototype-pollution keys are rejected.
- A corrupt stored record is preserved for recovery instead of silently overwritten. Storage failures display an export/retry warning.
- Version-one backups from the supplied starter remain supported. `applications` is an optional, backward-compatible schema extension, defaulting to an empty map; all existing fields are retained.
- Text evidence and links only; no file uploads. Initial page loading requires a connection; offline/PWA loading is not implemented. Review and application follow-ups appear in the site; there are no push notifications.

## Verification

```sh
npm test
npm run validate:data
npm run test:e2e
npm run build
```

The browser suite uses installed Google Chrome in isolated temporary profiles. Install Chrome or change `channel` in `playwright.config.ts` to use a Playwright browser. The test server uses port 5173.

Executed successfully during implementation:

- 26 Vitest domain/UI tests: mastery gates and reversal, zero initial state, date boundaries, review semantics, schema validation, malicious imports, storage recovery, persistence and project isolation.
- 7 Playwright browser journeys: first session, reloads, earned mastery, exact backup/reset/restore round-trip, application editing/filtering, planner/reviews, mobile navigation, keyboard focus, dark theme, corrupt storage recovery.
- Python checksum/semantic validation and 5 Node content-contract checks. Python's optional `jsonschema` package was unavailable; the entire curriculum was separately checked with Ajv against the provided JSON Schema in Vitest.
- Responsive layout checked at 360px and 1440px; screenshots visually inspected. All primary routes fit the 360px viewport without horizontal overflow.
- npm dependency audit: 0 known vulnerabilities after updating the build/test packages.

On the Codex desktop host, its bundled Node runtime rejects third-party native build modules. Using the system Node and PATH resolves that host-specific tooling issue; ordinary Terminal Node installations can use the npm commands above unchanged.

```sh
PATH=/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin npm run build
```

## Source structure

`src/domain` holds curriculum indexes and pure progress rules; `src/storage` holds validation and persistence; `src/features` contains the pages; `src/components` contains shared controls; `src/styles/app.css` contains the responsive light/dark design. Source and tests are formatted for maintenance. The supplied specification, schemas, curriculum, and reference documents remain in this project.
