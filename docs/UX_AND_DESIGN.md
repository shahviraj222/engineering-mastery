# UX and visual design brief

## Brand personality
Calm, serious, clear, crafted: a developer's private engineering notebook, not an online course marketplace, gaming dashboard, or corporate analytics screen. Main interaction should answer “What should I do next?” within five seconds.

## Visual style
- Light theme default: warm-neutral near-white background, ink text, muted blue/teal action color, quiet borders, restrained shadows. Dark theme if feasible: deep slate with high contrast.
- Typography: readable modern system/inter font; sizes roughly 28–36px for one hero, 20–24px page headings, 14–16px body, 12–13px helper text; generous line-height.
- Layout: 240–260px desktop sidebar, comfortable 1040–1200px content max width, 12-column grid or responsive cards. Mobile single-column with top navigation/drawer.
- Spacing: consistent 4/8/12/16/24/32px scale; minimum 44×44px interactive hit targets on touch.
- Colors communicate status only when necessary; status must also be named in text. Don't rely on color alone.
- Icons: Lucide, used sparingly and consistently; no loud gradients, emoji streaks, confetti or aggressive achievement badges.

## Dashboard order
1. Slim header: `Engineering Mastery`, current focus breadcrumb, search and profile/settings.
2. Hero: `Learn. Build. Test. Explain.` with small descriptive subtitle and working Continue button.
3. Today/Next action: a **single** recommended next unit with why, plus optional lab/DSA action.
4. Statistics: mastered `0 / 405`, active-learning count, labs finished, assessments passed, projects completed. Explain activity vs mastery.
5. Disciplines: readable 10-item progress list / cards with L1/2/3 and `Now` / `Later` indicators.
6. Recent activity/review items only if real; appropriate empty state otherwise.

## Curriculum browser
- Two-step browsing: discipline cards -> tracks -> L1/L2/L3 cards, with direct `Open unit` link.
- Search all content with highlighted matching text; show subject/track contextual breadcrumbs for skill matches.
- Expose future AI with lighter `Later specialization` label; never hide it from search.
- Unit detail: header (level/outcome) -> assessment readiness indicator -> skill status controls -> ordered lab steps -> assessment/rubric/evidence -> resources/prereqs.
- Make next/previous unit navigation predictable; allow copyable deep links.

## Interaction specifics
- Skill status: segmented choices or accessible dropdown; direct checkbox alone cannot model 4 statuses.
- Lab step: checkbox + minimal timestamp info.
- Evidence: textarea autosave on blur/debounced + explicitly visible saved state; multiple safe links optional.
- Locked mastery? Show descriptive unmet requirements, never a mysterious disabled button. Since status is derived, ideally don't have a separate mastery toggle at all.
- Project tasks: checkbox with next-task hint, evidence section, status selector.
- Planner: week cards, optional start date, relevant units and project links. Avoid hour-by-hour micromanagement.
- Settings: export/import backups clearly, warning about browser-local-only storage.

## Design states
For every major view, handle: loading (if any), empty, filtered-empty, normal, errors, and persistence failure. No 'coming soon' dead ends for MVP functionality.

## Accessibility checklist
- Semantic `<main>`, `<nav>`, `<header>`, headings in order, labeled controls, native buttons/inputs where possible.
- Visible focus indicators and full keyboard usability, modal focus management and Escape handling.
- Contrast WCAG AA for normal text, no hover-only essential actions, `aria-current=page` in nav, descriptive progress labels.
- Support narrow 360px mobile width, 768px tablet, 1280px desktop; no horizontal scrolling for normal pages.
- Reduced motion support; avoid animation that obscures status.

## Design acceptance
Users should reach their current unit in at most 2 clicks, update a skill in 1 interaction, and find its corresponding lab/assessment without switching tools. Beautiful is good; understandable and truthful is mandatory.
