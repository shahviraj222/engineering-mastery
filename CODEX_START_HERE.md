# Start here — one message for Codex

This repository contains a **fully structured course dataset and strict software specification**. Your task is to implement the actual website (it is not yet built).

## Paste into Codex

> Build the complete **Engineering Mastery** local-first tracker website in this repository. First read `AGENTS.md`, `docs/PRODUCT_SPEC.md`, `docs/PROGRESS_AND_MASTERY.md`, `docs/UX_AND_DESIGN.md`, `docs/BUILD_PLAN.md`, and `docs/TEST_PLAN.md`. Treat `data/curriculum.json` as the unmodified source of all curriculum content and `data/manifest.json` as the content-integrity reference. Implement all routes and interactions; do not simplify the 10 disciplines / 27 tracks / 81 level units / 405 skills. Follow the staged build plan, write meaningful tests, run the app and verify it. Use React + TypeScript + Vite, responsive, accessible, visually polished, with local progress, reliable import/export, evidence-based mastery, planner, review queue and projects. No backend/login/API keys. Return the runnable code, executed test results, and any known limitations. Make decisions autonomously where requirements are not safety-critical.

## If using Codex CLI

Unzip this package, open the folder in VS Code or a terminal, then launch Codex from the repository root so it can see `AGENTS.md`. Paste the prompt above. Let Codex make the files rather than requesting snippets to copy by hand.

## What success looks like

1. `npm install` / `npm run dev` starts a working site with no personal data setup.
2. Overview says **0/405 mastered** on a fresh browser.
3. Python > Language and Standard Library > L1 shows 5 exact skills, lab steps, assessment, links and working status changes.
4. Navigation reaches all 81 units and search finds `transactions`, `retry`, `Python`.
5. Projects, planner, review queue, resources, and settings really work; no decorative fake features.
6. Export → clear with confirmation → import restores identical progress and notes.
7. Marking skills `learning` never implies mastery; unit mastery is derived from evidence and prerequisites only warn.
8. Runs on desktop and mobile, accessible via keyboard.

## Files you must preserve

- `data/curriculum.json`: canonical curriculum data (do not rewrite).
- `data/manifest.json`: record of original content counts and checksum.
- `schemas/curriculum.schema.json`: data shape.
- `data/progress.empty.example.json`: initial progress model illustration.
- `scripts/validate_dataset.py`, `tests/content-contract.test.mjs`: data tests that should keep passing.

The educational goal is **Python backend and software engineering now; production AI/agents later**. A high salary or job offer is not a feature or promised result.
