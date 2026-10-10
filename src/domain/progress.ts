import type {
  LearningUnit,
  TrackerState,
  EvidenceProgress,
  SkillStatus,
} from "./types";
import { data, units, skills, unitById } from "./curriculum";
import empty from "../../data/progress.empty.example.json";
export const emptyState = (): TrackerState => ({
  ...structuredClone(empty),
  version: 1,
  applications: {},
});
export const safeUrl = (s: string) => {
  try {
    const u = new URL(s);
    return (u.protocol === "https:" || u.protocol === "http:") && !!u.hostname;
  } catch {
    return false;
  }
};
export const hasEvidence = (e?: EvidenceProgress) =>
  Boolean(e && (e.notes?.trim() || e.links?.some(safeUrl)));
export function diagnoseUnitMastery(u: LearningUnit, s: TrackerState) {
  const missingSkillIds = u.skills
    .filter((x) => s.skills[x.id]?.status !== "mastered")
    .map((x) => x.id);
  const missingLabStepIds = u.lab.steps
    .filter((x) => !s.labSteps[x.id]?.done)
    .map((x) => x.id);
  const missingAssessmentPass =
    s.assessments[u.assessment.id]?.status !== "passed";
  const missingEvidence = !(
    hasEvidence(s.evidence[u.id]) ||
    s.assessments[u.assessment.id]?.evidence?.trim()
  );
  return {
    ready:
      !missingSkillIds.length &&
      !missingLabStepIds.length &&
      !missingAssessmentPass &&
      !missingEvidence,
    missingSkillIds,
    missingLabStepIds,
    missingAssessmentPass,
    missingEvidence,
  };
}
export function counts(s: TrackerState) {
  const status = (k: SkillStatus) =>
    skills.filter((x) => s.skills[x.id]?.status === k).length;
  return {
    total: skills.length,
    learning: status("learning"),
    practiced: status("practiced"),
    mastered: status("mastered"),
    active: status("learning") + status("practiced"),
    labs: units.filter((u) => u.lab.steps.every((x) => s.labSteps[x.id]?.done))
      .length,
    assessments: units.filter(
      (u) => s.assessments[u.assessment.id]?.status === "passed",
    ).length,
    projects: data.projects.filter(
      (p) => s.projects[p.id]?.status === "completed",
    ).length,
    units: units.filter((u) => diagnoseUnitMastery(u, s).ready).length,
  };
}
export function recommend(s: TrackerState) {
  if (
    s.profile.currentUnitId &&
    unitById[s.profile.currentUnitId] &&
    !diagnoseUnitMastery(unitById[s.profile.currentUnitId], s).ready
  )
    return unitById[s.profile.currentUnitId];
  const ordered = [
    ...new Set(data.study_plan.weeks.flatMap((w) => w.suggested_unit_ids)),
  ];
  return (
    ordered
      .map((id) => unitById[id])
      .find((u) => !diagnoseUnitMastery(u, s).ready) ||
    units.find(
      (u) =>
        u.discipline.priority === "now" && !diagnoseUnitMastery(u, s).ready,
    ) ||
    unitById["python-core-l1"]
  );
}
export function localDate(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function addDays(day: string, n: number) {
  const [y, m, d] = day.split("-").map(Number);
  return localDate(new Date(y, m - 1, d + n, 12));
}
export function dayDifference(a: string, b: string) {
  const utc = (s: string) => {
    const [y, m, d] = s.split("-").map(Number);
    return Date.UTC(y, m - 1, d);
  };
  return Math.floor((utc(a) - utc(b)) / 86400000);
}
export function currentWeek(start?: string | null, today = localDate()) {
  return start ? Math.floor(dayDifference(today, start) / 7) + 1 : null;
}
export function reviewItems(s: TrackerState, today = localDate()) {
  return skills
    .filter(
      (k) =>
        s.customReviews[k.id] ||
        s.skills[k.id]?.reviewDue ||
        s.skills[k.id]?.lastReviewedAt,
    )
    .map((k) => {
      const p = s.skills[k.id];
      const due = s.customReviews[k.id] || p?.reviewDue;
      return {
        ...k,
        due,
        lastReviewed: p?.lastReviewedAt,
        bucket: due ? (due <= today ? "due" : "soon") : "done",
      };
    })
    .sort((a, b) => (a.due || "9999").localeCompare(b.due || "9999"));
}
