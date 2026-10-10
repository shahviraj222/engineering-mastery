import Ajv2020 from "ajv/dist/2020";
import addFormats from "ajv-formats";
import schema from "../../schemas/progress.schema.json";
import backupSchema from "../../schemas/backup.schema.json";
import { data, units, skills } from "../domain/curriculum";
import { safeUrl } from "../domain/progress";
import type { TrackerState } from "../domain/types";
const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
ajv.addSchema(schema, "progress.schema.json");
const checkState = ajv.compile(schema),
  checkBackup = ajv.compile(backupSchema);
function rejectDangerous(value: unknown) {
  if (value && typeof value === "object")
    for (const [k, v] of Object.entries(value)) {
      if (["__proto__", "constructor", "prototype"].includes(k))
        throw new Error("Unsafe object key in backup.");
      rejectDangerous(v);
    }
}
const ids: Record<string, Set<string>> = {
  skills: new Set(skills.map((s) => s.id)),
  labSteps: new Set(units.flatMap((u) => u.lab.steps.map((s) => s.id))),
  assessments: new Set(units.map((u) => u.assessment.id)),
  projects: new Set(data.projects.map((p) => p.id)),
  projectTasks: new Set(data.projects.flatMap((p) => p.tasks.map((t) => t.id))),
  evidence: new Set([
    ...units.map((u) => u.id),
    ...units.map((u) => u.assessment.id),
    ...data.projects.map((p) => p.id),
  ]),
  dayChecks: new Set(data.python_seven_day_starter.days.map((d) => d.id)),
  weekChecks: new Set(data.study_plan.weeks.map((w) => w.id)),
  customReviews: new Set(skills.map((s) => s.id)),
};
function semantic(s: TrackerState) {
  for (const [section, known] of Object.entries(ids))
    for (const id of Object.keys(s[section as keyof TrackerState] || {}))
      if (!known.has(id)) throw new Error(`Unknown ${section} ID: ${id}`);
  if (
    s.profile.currentUnitId &&
    !units.some((u) => u.id === s.profile.currentUnitId)
  )
    throw new Error("Unknown current unit.");
  for (const e of Object.values(s.evidence))
    if (e.links?.some((u) => !safeUrl(u)))
      throw new Error("Evidence links must use http or https.");
  for (const [id, a] of Object.entries(s.applications || {})) {
    if (a.id !== id || !a.company.trim() || !a.role.trim())
      throw new Error(
        "An application is missing its company, role, or matching ID.",
      );
    if (a.url && !safeUrl(a.url))
      throw new Error("Application links must use http or https.");
  }
  return { ...s, applications: s.applications || {} };
}
export function validateState(value: unknown): TrackerState {
  rejectDangerous(value);
  if (!checkState(value))
    throw new Error(ajv.errorsText(checkState.errors, { separator: "; " }));
  return semantic(value as unknown as TrackerState);
}
export function parseBackup(text: string): TrackerState {
  if (text.length > 5_000_000)
    throw new Error("Backup is too large (maximum 5 MB).");
  const b = JSON.parse(text);
  rejectDangerous(b);
  if (!checkBackup(b))
    throw new Error(ajv.errorsText(checkBackup.errors, { separator: "; " }));
  if (b.curriculumDatasetId !== data.dataset_id)
    throw new Error("This backup belongs to a different curriculum.");
  return validateState(b.progress);
}
export function makeBackup(progress: TrackerState) {
  return {
    format: "engineering-mastery-progress",
    version: 1,
    curriculumDatasetId: data.dataset_id,
    exportedAt: new Date().toISOString(),
    progress,
  };
}
export function download(name: string, text: string) {
  const url = URL.createObjectURL(
    new Blob([text], { type: "application/json" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
