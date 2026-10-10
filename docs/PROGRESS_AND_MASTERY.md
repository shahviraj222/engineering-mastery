# Progress contract, derived mastery, and backup safety

## Fundamental separation
`curriculum.json` is read-only reference content. `TrackerState` is a separate local, versioned store. Never persist dynamic status inside canonical curriculum JSON or rekey IDs. Store only changed entries (default is not started).

## State types and reference implementation
See `reference/tracker-contract.ts` for strongly typed definitions and pure function signatures. Initial empty state is `data/progress.empty.example.json`. The contract is conceptual; the UI implementation may add fields with migrations but MUST preserve these semantics.

### Skills
- `not_started`: untouched. `learning`: studying/reading. `practiced`: attempted practical demonstration. `mastered`: user reports independent competence.
- The overview MUST distinguish progress/activity from mastered skills. `practiced` should not count as mastered.
- Preserve optional notes and review due dates when status changes.

### Lab and assessments
- Every lab step has an independent boolean keyed by **its exact `lab.steps[].id`**, not by index.
- Assessment keyed by `assessment.id` with `not_started | attempted | passed | needs_review`.
- Evidence can be recorded at unit, project and/or assessment ID with a note and safe links. Keep a time stamp for updates.
- Assessment `passed` is self-reported. Explain the rubric and prompt before user confirms it.

### Derived unit mastery
For unit `u`, calculate:
```
allSkillsMastered = u.skills.every(skill => state.skills[skill.id]?.status === 'mastered')
allLabStepsDone = u.lab.steps.every(step => state.labSteps[step.id]?.done === true)
assessmentPassed = state.assessments[u.assessment.id]?.status === 'passed'
hasEvidence = meaningfulNoteOrSafeURL(state.evidence[u.id]) || meaningfulAssessmentEvidence(state.assessments[u.assessment.id])
readyForMastery = allSkillsMastered && allLabStepsDone && assessmentPassed && hasEvidence
```
- The level UI shows **self-assessed mastered** when `readyForMastery` is true; otherwise show what is missing.
- Do not silently allow `mastered` on a unit if its requirements are unmet.
- If manual override is implemented, require reason + proof, store `unitOverrides[unitId]`, visibly mark `Self-assessed override`; don't falsify skill/lab/assessment metrics. If this introduces complexity, omit overrides in MVP and add later; all standard gates must work.
- Lab/assessment evidence is learner-entered; never claim instructor verification.

### Progress percentages
- Mastered skill ratio: mastered skill count / total 405 (or derive total from JSON).
- Activity ratio: number of skills at least `learning` / total; do NOT replace mastery percent with activity percent.
- Unit: `mastered` count of its skills / unit's total skills, plus separate lab and assessment indicators.
- Discipline: derived from all its units/skills. Avoid averaging percentages across unequal groups.
- Project completion: explicit status and independently checked tasks. Do not infer it from discipline completion.
- Time spent, lessons opened and week checks are not mastery.

## Versioned local storage
- Suggested key: `engineering-mastery:v1:progress`.
- Save on meaningful state changes, catch quota/storage errors and show a non-blocking warning with export option.
- Parse and validate stored payload before rendering. If invalid, do not corrupt the record; offer recovery/import.
- Keep app migration code for state version increments. Do not auto-clear old user records on app redeploy.
- Store local calendar dates as `YYYY-MM-DD` (not UTC timestamps) for due dates and sprint start; store audit timestamps in ISO 8601 UTC. Date tests should cover timezone boundaries.

## Import/export
- Export a structured JSON object `{ format: 'engineering-mastery-progress', version: 1, curriculumDatasetId, exportedAt, progress }`. Include user notes and project evidence. No curriculum content needed in backups.
- On import: validate envelope, version, correct field shapes, allowed status values, expected known IDs, safe date formats, and bounded note/link sizes. Unknown keys should be reported; safe strategies are reject or ignore with explicit user consent. Never silently merge incompatible versions.
- `__proto__`, `constructor`, `prototype` keys must be rejected or processed using safe plain maps (prototype pollution defense).
- Preview counts of imported skill states and what would change; require confirmation for replacing existing progress. Support full **replace** and optionally carefully tested merge.
- Sanitize/escape user notes on output; links limited to `http:` / `https:` URLs. Avoid dangerouslySetInnerHTML.
- Verify export/import roundtrip with notes, statuses, reviews, projects and plan checks.
- Clearing progress requires explicit confirmation; cancel leaves data unchanged.

## Review semantics
- Scheduling is user-directed, not an empirical mastery prediction. Default suggestions at 1, 3, 7, 14, 30 days are optional.
- Due date should be chosen after a practice event; overdue stays visible until reviewed or rescheduled.
- Marking reviewed updates `lastReviewedAt` and optional `reviewDue`, but does not auto-upgrade skill to mastered.

## Advice vs enforcement
- Missing prerequisites produce warnings/links, not route locks.
- Later AI and L3 content always accessible. Neither should auto-appear in near-term required milestones.
- Dates are flexible; uncompleted scheduled items carry forward rather than disappearing.

## Machine-readable schemas for Codex
- `schemas/progress.schema.json`: version-one browser-state shape; validate against it on import. Additional semantic membership checks must verify keys against actual skill/step/etc IDs in curriculum.
- `schemas/backup.schema.json`: envelope around progress; its `progress.schema.json` reference is relative to this schema directory.
- `data/progress.empty.example.json`: a valid clean initial object. This is intentionally sparse; absent entries mean not started.
