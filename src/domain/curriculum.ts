import raw from "../../data/curriculum.json";
import type { Curriculum, LearningUnit, Track, Discipline } from "./types";
export const data = raw as unknown as Curriculum;
export type IndexedUnit = LearningUnit & {
  track: Track;
  discipline: Discipline;
};
export const units: IndexedUnit[] = data.curriculum.flatMap((d) =>
  d.tracks.flatMap((t) =>
    t.levels.map((u) => ({ ...u, track: t, discipline: d })),
  ),
);
export const unitById = Object.fromEntries(units.map((u) => [u.id, u]));
export const skills = units.flatMap((u) =>
  u.skills.map((s) => ({ ...s, unit: u })),
);
export const resourceById = Object.fromEntries(
  data.resources.map((r) => [r.id, r]),
);
export const shortTitle = (s: string) =>
  s.replace(/^\d+\s*·\s*/, "").replace(" (Later Specialization)", "");
export const unitTitle = (id: string) =>
  unitById[id] ? `${unitById[id].track.title} · ${unitById[id].level}` : id;
export const labels: Record<string, string> = {
  not_started: "Not started",
  learning: "Learning",
  practiced: "Practiced",
  mastered: "Mastered",
  active: "In progress",
  blocked: "Blocked",
  completed: "Completed",
  attempted: "Attempted",
  passed: "Passed",
  needs_review: "Needs review",
  saved: "Saved",
  applied: "Applied",
  screening: "Screening",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};
export const disciplineLabels: Record<string, string> = {
  cs: "Computer science",
  python: "Python programming",
  dsa: "Data structures & algorithms",
  db: "Databases & correctness",
  software: "Software development",
  design: "System design",
  security: "Security engineering",
  prod: "Production & cloud",
  ai: "AI engineering",
  practice: "Engineering & interviews",
};
