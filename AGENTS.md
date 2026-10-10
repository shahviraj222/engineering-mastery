# Codex instructions — Engineering Mastery Tracker

## Mission
Build a finished, responsive, local-first website for an individual Python-first software engineering mastery roadmap. This repository is a specification + validated curriculum handoff, NOT an already-built app. Work autonomously, implement in the repository, run tests, and report results honestly.

## Read in this order
1. `CODEX_START_HERE.md`
2. `docs/PRODUCT_SPEC.md`
3. `docs/PROGRESS_AND_MASTERY.md`
4. `docs/UX_AND_DESIGN.md`
5. `docs/BUILD_PLAN.md`
6. `docs/TEST_PLAN.md`
7. `data/manifest.json`, `data/curriculum.json`, `schemas/curriculum.schema.json`

## Nonnegotiable contracts
- `data/curriculum.json` is immutable canonical content: 10 disciplines, 27 tracks, 81 L1–L3 units, 405 skills, 243 lab steps, 81 assessments, 7 projects, 28 project tasks, 37 references. Never replace it with generated/demo content. Preserve all IDs and text.
- Render all subjects/levels/skills and lab steps; do not hide future AI or advanced topics. Group AI as `Later`, never force it into the initial sprint.
- Separate **learning activity** (`learning`, `practiced`, checked lab steps) from **earned mastery** (all skill requirements, lab steps, passed assessment, evidence). Do NOT use a single unchecked completion percent for both.
- All personal progress starts EMPTY and stays private in the browser; never send it to external services. Provide safe JSON backup export/import and explicit confirmation before reset. The curriculum dataset is not editable through the progress UI.
- Prerequisites are advisory warnings and links, not page locks. Use accessible mobile-first UX, functioning navigation and search, real button actions, no empty/placeholder screens.
- No AI APIs, user accounts, hosted database, telemetry or paid services in the MVP. React/TypeScript/Vite are for the TRACKER app; the LEARNING curriculum itself is Python-first.
- Test the actual app, including reload persistence and import/export. Never claim tests passed unless run. No fake achievements, metrics, example completion or job readiness scores.
- When requirements conflict, favor curriculum integrity, data safety, reliable state transitions and accessibility over visual flourish. Document any deviation and its reason.

## Preferred stack and developer experience
React + TypeScript + Vite, Tailwind CSS or a small CSS design system, React Router, Lucide; Vitest + Testing Library; Playwright for a few E2E flows. Use current compatible stable versions and commit a lockfile after installation. Use `npm` scripts: `dev`, `build`, `test`, `test:e2e`, `validate:data`, `lint` (if lint tooling installed). Use feature folders and test business logic separately from view components. Dependencies should be minimal.

## Start by validating content
Run `python3 scripts/validate_dataset.py` and `node --test tests/content-contract.test.mjs`. If either fails, investigate before writing UI. Do not alter canonical IDs to make tests pass.

## Implementation guidance
Follow `docs/BUILD_PLAN.md` in phases. When modifying state schema, update validation/migration and tests. Do not overwrite local user progress after app updates. Normalize IDs only in the view layer, never in persistence keys.

## Definition of done
- All 8 core routes functional as specified in `docs/PRODUCT_SPEC.md`.
- Unit mastery gate correct, all content indexed, review and planner functional, backups round-trip.
- `npm run build` and tests pass; data scripts pass.
- Verify mobile and desktop interactions; note limitations in README rather than making unsupported claims.
