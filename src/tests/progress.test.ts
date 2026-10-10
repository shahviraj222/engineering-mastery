import Ajv2020 from "ajv/dist/2020";
import addFormats from "ajv-formats";
import curriculumSchema from "../../schemas/curriculum.schema.json";
import { describe, it, expect } from "vitest";
import { data, units, skills, unitById } from "../domain/curriculum";
import {
  emptyState,
  counts,
  diagnoseUnitMastery,
  localDate,
  addDays,
  currentWeek,
  reviewItems,
  recommend,
} from "../domain/progress";
import { parseBackup, makeBackup, validateState } from "../storage/validation";
import { readStorage } from "../storage/store";
const now = "2026-10-10T10:00:00.000Z";
function completed() {
  const s = emptyState(),
    u = unitById["python-core-l1"];
  u.skills.forEach((k) => {
    s.skills[k.id] = { status: "mastered", updatedAt: now };
  });
  u.lab.steps.forEach((k) => {
    s.labSteps[k.id] = { done: true, updatedAt: now };
  });
  s.assessments[u.assessment.id] = { status: "passed", updatedAt: now };
  s.evidence[u.id] = {
    notes: "Built an independent CLI with tests.",
    links: ["https://example.com/project"],
    updatedAt: now,
  };
  return s;
}
describe("curriculum and mastery", () => {
  it("validates the entire supplied curriculum JSON Schema", () => {
    const ajv = new Ajv2020({ strict: false });
    addFormats(ajv);
    expect(ajv.compile(curriculumSchema)(data)).toBe(true);
  });
  it("starts with true zeroes across every metric", () => {
    expect(counts(emptyState())).toEqual({
      total: 405,
      learning: 0,
      practiced: 0,
      mastered: 0,
      active: 0,
      labs: 0,
      assessments: 0,
      projects: 0,
      units: 0,
    });
    expect(units).toHaveLength(81);
    expect(skills).toHaveLength(405);
  });
  it("learning and practice never earn mastery", () => {
    const s = emptyState();
    s.skills[skills[0].id] = { status: "learning", updatedAt: now };
    s.skills[skills[1].id] = { status: "practiced", updatedAt: now };
    expect(counts(s).active).toBe(2);
    expect(counts(s).mastered).toBe(0);
  });
  it("requires every independent gate and revokes mastery when a gate is reversed", () => {
    const u = unitById["python-core-l1"],
      s = completed();
    expect(diagnoseUnitMastery(u, s).ready).toBe(true);
    expect(counts(s).units).toBe(1);
    expect(counts(s).labs).toBe(1);
    for (const part of ["skill", "lab", "assessment", "evidence"]) {
      const d = structuredClone(s);
      if (part === "skill") d.skills[u.skills[0].id].status = "practiced";
      if (part === "lab") d.labSteps[u.lab.steps[0].id].done = false;
      if (part === "assessment")
        d.assessments[u.assessment.id].status = "attempted";
      if (part === "evidence") delete d.evidence[u.id];
      expect(diagnoseUnitMastery(u, d).ready).toBe(false);
    }
  });
  it("accepts assessment evidence and ignores whitespace-only evidence", () => {
    const s = completed(),
      u = unitById["python-core-l1"];
    s.evidence[u.id] = { notes: "   ", updatedAt: now };
    expect(diagnoseUnitMastery(u, s).missingEvidence).toBe(true);
    s.assessments[u.assessment.id].evidence =
      "Tested independent variation with edge cases.";
    expect(diagnoseUnitMastery(u, s).ready).toBe(true);
  });
  it("keeps plan, project, and skill completion independent", () => {
    const s = emptyState();
    s.weekChecks.w01 = true;
    s.dayChecks.d01 = true;
    s.projectTasks["p3-task01"] = { done: true, updatedAt: now };
    s.projects.p3 = { status: "completed", updatedAt: now };
    expect(counts(s).mastered).toBe(0);
    expect(counts(s).units).toBe(0);
    expect(s.projectTasks["p2-task01"]).toBeUndefined();
  });
  it("recommends Python first and resumes an explicit focus", () => {
    const s = emptyState();
    expect(recommend(s).id).toBe("python-core-l1");
    s.profile.currentUnitId = "db-sql-l1";
    expect(recommend(s).id).toBe("db-sql-l1");
  });
  it("keeps all future content available with advisory prerequisites", () => {
    expect(units.filter((u) => u.discipline.id === "ai")).toHaveLength(9);
    expect(unitById["ai-agents-l3"].discipline.priority).toBe("later");
    expect(
      unitById["ai-agents-l3"].prerequisite_unit_ids.length,
    ).toBeGreaterThan(0);
  });
});
describe("calendar and reviews", () => {
  it("uses local calendar fields, including month/year/leap boundaries", () => {
    expect(localDate(new Date(2026, 9, 10, 0, 5))).toBe("2026-10-10");
    expect(addDays("2026-01-30", 3)).toBe("2026-02-02");
    expect(addDays("2024-02-28", 1)).toBe("2024-02-29");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(currentWeek("2026-09-30", "2026-10-07")).toBe(2);
    expect(currentWeek("2026-10-20", "2026-10-10")).toBeLessThan(1);
  });
  it("retains overdue reviews and handles custom reviews without mastery changes", () => {
    const s = emptyState(),
      id = skills[0].id;
    s.skills[id] = {
      status: "practiced",
      updatedAt: now,
      reviewDue: "2026-10-01",
    };
    expect(reviewItems(s, "2026-10-10")[0].bucket).toBe("due");
    s.customReviews[id] = "2026-10-20";
    expect(reviewItems(s, "2026-10-10")[0].bucket).toBe("soon");
    delete s.customReviews[id];
    s.skills[id].reviewDue = null;
    s.skills[id].lastReviewedAt = now;
    expect(reviewItems(s, "2026-10-10")[0].bucket).toBe("done");
    expect(counts(s).mastered).toBe(0);
  });
});
describe("safe persistence and backups", () => {
  it("round-trips all records, including applications and legacy project notes", () => {
    const s = completed();
    s.skills[skills[0].id] = {
      status: "practiced",
      notes: "<script>alert(1)</script>",
      reviewDue: "2026-10-11",
      updatedAt: now,
    };
    s.projects.p3 = {
      status: "active",
      notes: "Database design rationale",
      updatedAt: now,
    };
    s.projectTasks["p3-task01"] = { done: true, updatedAt: now };
    s.dayChecks.d01 = true;
    s.weekChecks.w01 = true;
    s.applications.app1 = {
      id: "app1",
      company: "Company",
      role: "Backend",
      status: "applied",
      url: "https://example.com",
      salary: "40",
      contact: "Recruiter",
      appliedDate: "2026-10-10",
      followUp: "2026-10-17",
      notes: "Follow up",
      updatedAt: now,
    };
    expect(parseBackup(JSON.stringify(makeBackup(s)))).toEqual(s);
  });
  it("migrates original version-one progress without deleting fields", () => {
    const original = { ...emptyState() } as Record<string, unknown>;
    delete original.applications;
    expect(validateState(original).applications).toEqual({});
  });
  it.each(["javascript:alert(1)", "data:text/html,hi", "file:///etc/passwd"])(
    "rejects unsafe evidence URL %s",
    (url) => {
      const s = completed();
      s.evidence["python-core-l1"].links = [url];
      expect(() => parseBackup(JSON.stringify(makeBackup(s)))).toThrow();
    },
  );
  it.each(["2026-02-30", "2026-13-01", "yesterday"])(
    "rejects invalid dates %s",
    (date) => {
      const s = emptyState();
      s.profile.sprintStartDate = date;
      expect(() => validateState(s)).toThrow();
    },
  );
  it("rejects unknown IDs, fields, statuses, versions and dataset mismatches", () => {
    const cases = [
      () => {
        const s = emptyState();
        s.skills.fake = { status: "learning", updatedAt: now };
        return makeBackup(s);
      },
      () => ({ ...makeBackup(emptyState()), version: 99 }),
      () => ({ ...makeBackup(emptyState()), curriculumDatasetId: "other" }),
      () => ({ ...makeBackup(emptyState()), extra: "unexpected" }),
      () => {
        const s = emptyState();
        s.skills[skills[0].id] = { status: "done" as never, updatedAt: now };
        return makeBackup(s);
      },
    ];
    for (const c of cases)
      expect(() => parseBackup(JSON.stringify(c()))).toThrow();
  });
  it("rejects prototype pollution keys recursively", () => {
    const raw = JSON.stringify(makeBackup(emptyState())).replace(
      '"skills":{}',
      '"skills":{"__proto__":{"polluted":true}}',
    );
    expect(() => parseBackup(raw)).toThrow("Unsafe object key");
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });
  it("bounds notes and backup payloads", () => {
    const s = completed();
    s.evidence["python-core-l1"].notes = "a".repeat(10001);
    expect(() => validateState(s)).toThrow();
    expect(() => parseBackup(" ".repeat(5000001))).toThrow("too large");
  });
  it("keeps corrupt persisted state untouched and blocks overwrites", () => {
    const storage = { getItem: () => "{broken" };
    const result = readStorage(storage);
    expect(result.locked).toBe(true);
    expect(result.error).toContain("untouched");
    expect(counts(result.state).mastered).toBe(0);
  });
  it("loads valid persisted state without resetting it", () => {
    const s = completed();
    expect(readStorage({ getItem: () => JSON.stringify(s) }).state).toEqual(s);
  });
});
