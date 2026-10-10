import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Search,
  BookOpen,
  FlaskConical,
  CheckCircle2,
  Target,
  Info,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import {
  data,
  units,
  unitById,
  resourceById,
  shortTitle,
  disciplineLabels,
  labels,
} from "../domain/curriculum";
import { diagnoseUnitMastery } from "../domain/progress";
import type { SkillStatus, AssessmentStatus } from "../domain/types";
import { useStore } from "../storage/store";
import {
  PageHeading,
  Progress,
  Badge,
  Empty,
  UnitLinks,
  StatusSelect,
  CheckRow,
  External,
  SectionTitle,
} from "../components/ui";
import Evidence from "../components/Evidence";
export function CurriculumBrowser() {
  const { state } = useStore();
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "",
    subject = params.get("subject") || "",
    level = params.get("level") || "",
    status = params.get("status") || "",
    priority = params.get("priority") || "";
  const filter = (key: string, value: string) => {
    const n = new URLSearchParams(params);
    value ? n.set(key, value) : n.delete(key);
    setParams(n, { replace: true });
  };
  const matches = units.filter(
    (u) =>
      (!subject || u.discipline.id === subject) &&
      (!level || u.level === level) &&
      (!priority || u.discipline.priority === priority) &&
      (!q ||
        [
          u.track.title,
          u.discipline.title,
          u.outcome,
          ...u.skills.map((s) => s.name),
          u.lab.title,
          u.assessment.challenge,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q.toLowerCase())) &&
      (!status ||
        (status === "mastered"
          ? diagnoseUnitMastery(u, state).ready
          : status === "not_started"
            ? u.skills.every(
                (s) =>
                  !state.skills[s.id] ||
                  state.skills[s.id].status === "not_started",
              )
            : u.skills.some((s) => state.skills[s.id]?.status === status))),
  );
  return (
    <>
      <PageHeading
        eyebrow="THE FULL PICTURE"
        title="A roadmap built for depth."
        description="Explore the fundamentals. Build the proof. Grow into what comes next."
        action={
          <Badge tone="green">
            {units.length} units · {data.curriculum.length} disciplines
          </Badge>
        }
      />
      <div className="filter-panel">
        <div className="search-field">
          <Search size={18} />
          <input
            aria-label="Search curriculum"
            placeholder="Search skills, topics, or outcomes…"
            value={q}
            onChange={(e) => filter("q", e.target.value)}
          />
        </div>
        <div className="filter-row">
          <select
            aria-label="Discipline filter"
            value={subject}
            onChange={(e) => filter("subject", e.target.value)}
          >
            <option value="">All disciplines</option>
            {data.curriculum.map((d) => (
              <option key={d.id} value={d.id}>
                {shortTitle(d.title)}
              </option>
            ))}
          </select>
          <select
            aria-label="Level filter"
            value={level}
            onChange={(e) => filter("level", e.target.value)}
          >
            <option value="">All levels</option>
            {["L1", "L2", "L3"].map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
          <select
            aria-label="Status filter"
            value={status}
            onChange={(e) => filter("status", e.target.value)}
          >
            <option value="">Any progress</option>
            {["not_started", "learning", "practiced", "mastered"].map((s) => (
              <option key={s} value={s}>
                {labels[s]}
              </option>
            ))}
          </select>
          <select
            aria-label="Priority filter"
            value={priority}
            onChange={(e) => filter("priority", e.target.value)}
          >
            <option value="">Now & later</option>
            <option value="now">Core roadmap</option>
            <option value="later">Later specialization</option>
          </select>
          {params.size > 0 && (
            <button className="text-button" onClick={() => setParams({})}>
              Clear filters
            </button>
          )}
          <span className="muted result-count">{matches.length} units</span>
        </div>
      </div>
      {matches.length === 0 ? (
        <Empty title="No matching units">
          Try a broader topic such as Python, transactions, or agents. You can
          also clear your filters.
        </Empty>
      ) : (
        data.curriculum.map((d) => {
          const matched = matches.filter((u) => u.discipline.id === d.id);
          if (!matched.length) return null;
          return (
            <details
              key={`${d.id}-${!!params.size}`}
              className="discipline-group"
              open={params.size > 0 || d.id === "python"}
            >
              <summary>
                <span className={`subject-number subject-${d.id}`}>
                  {d.title.slice(0, 2)}
                </span>
                <div>
                  <h2>{shortTitle(d.title)}</h2>
                  <p>
                    {matched.length} units · {d.tracks.length} tracks
                  </p>
                </div>
                {d.priority === "later" && <Badge>Later specialization</Badge>}
                <ChevronDown size={19} />
              </summary>
              <div className="discipline-body">
                <p className="muted">{d.goal}</p>
                {d.tracks.map((t) => {
                  const list = matched.filter((u) => u.track.id === t.id);
                  return list.length ? (
                    <section className="track-section" key={t.id}>
                      <h3>{t.title}</h3>
                      <p>{t.why_it_matters}</p>
                      <div className="unit-grid">
                        {list.map((u) => {
                          const n = u.skills.filter(
                            (s) => state.skills[s.id]?.status === "mastered",
                          ).length;
                          const ready = diagnoseUnitMastery(u, state).ready;
                          const matchingSkill = q
                            ? u.skills.find((s) =>
                                s.name.toLowerCase().includes(q.toLowerCase()),
                              )
                            : null;
                          return (
                            <Link
                              key={u.id}
                              className="unit-card"
                              to={`/learn/${u.id}`}
                            >
                              <div>
                                <Badge tone={ready ? "green" : "neutral"}>
                                  {u.level} ·{" "}
                                  {u.level === "L1"
                                    ? "Foundation"
                                    : u.level === "L2"
                                      ? "Professional"
                                      : "Advanced"}
                                </Badge>
                                <ArrowRight size={16} />
                              </div>
                              <h4>{u.outcome}</h4>
                              {matchingSkill && (
                                <p className="search-match">
                                  Skill: {matchingSkill.name}
                                </p>
                              )}
                              <span className="unit-caption">
                                {ready
                                  ? "Self-assessed mastered"
                                  : `${n}/${u.skills.length} skills mastered`}
                              </span>
                              <Progress
                                value={n}
                                total={u.skills.length}
                                label="Skills mastered"
                              />
                            </Link>
                          );
                        })}
                      </div>
                    </section>
                  ) : null;
                })}
              </div>
            </details>
          );
        })
      )}
    </>
  );
}
export function UnitDetail() {
  const { unitId } = useParams();
  const u = unitById[unitId || ""];
  return u ? (
    <UnitView key={u.id} id={u.id} />
  ) : (
    <Empty
      title="Unit not found"
      action={<Link to="/learn">Browse roadmap</Link>}
    >
      This unit ID isn’t part of your curriculum.
    </Empty>
  );
}
function UnitView({ id }: { id: string }) {
  const u = unitById[id];
  const { state, mutate } = useStore();
  const diagnostic = diagnoseUnitMastery(u, state);
  const [showGate, setShowGate] = useState(false);
  const [proof, setProof] = useState(
    state.assessments[u.assessment.id]?.evidence || "",
  );
  const [proofSaved, setProofSaved] = useState(false);
  const mastered = u.skills.filter(
    (s) => state.skills[s.id]?.status === "mastered",
  ).length;
  const prerequisites = u.prerequisite_unit_ids.filter(
    (id) => !diagnoseUnitMastery(unitById[id], state).ready,
  );
  const at = u.track.levels.findIndex((x) => x.id === id);
  return (
    <>
      <Link to={`/learn?subject=${u.discipline.id}`} className="back-link">
        <ArrowLeft size={16} />
        {disciplineLabels[u.discipline.id]}
      </Link>
      <PageHeading
        eyebrow={`${u.level} · ${u.level === "L1" ? "FOUNDATION" : u.level === "L2" ? "PROFESSIONAL" : "ADVANCED"}`}
        title={u.track.title}
        description={u.outcome}
        action={
          <button
            className="button secondary"
            onClick={() =>
              mutate((s) => {
                s.profile.currentUnitId = id;
              })
            }
          >
            <Target size={16} />
            {state.profile.currentUnitId === id
              ? "Current focus"
              : "Set as my focus"}
          </button>
        }
      />
      {u.discipline.priority === "later" && (
        <div className="notice">
          <Info size={17} />
          Later specialization · Available whenever you want to explore; your
          starter sprint stays focused on fundamentals.
        </div>
      )}
      <div className={`mastery-banner ${diagnostic.ready ? "earned" : ""}`}>
        <div>
          <CheckCircle2 size={22} />
          <span>
            <strong>
              {diagnostic.ready
                ? "Self-assessed mastered"
                : "Mastery is earned through practice."}
            </strong>
            <small>
              {mastered}/{u.skills.length} skills mastered ·{" "}
              {u.lab.steps.filter((s) => state.labSteps[s.id]?.done).length}/
              {u.lab.steps.length} lab steps ·{" "}
              {
                labels[
                  state.assessments[u.assessment.id]?.status || "not_started"
                ]
              }{" "}
              assessment
            </small>
          </span>
        </div>
        <button
          className="button secondary small"
          onClick={() => setShowGate(!showGate)}
        >
          {showGate ? "Hide requirements" : "Verify level"}
          <ChevronDown size={15} />
        </button>
      </div>
      {showGate && (
        <section className="panel requirements">
          <h3>
            {diagnostic.ready
              ? "All requirements recorded"
              : "What’s left to demonstrate"}
          </h3>
          {diagnostic.ready ? (
            <p>
              Your evidence meets the tracker’s requirements. This is your own
              assessment of competence.
            </p>
          ) : (
            <ul>
              {diagnostic.missingSkillIds.map((id) => (
                <li key={id}>
                  Master skill: {u.skills.find((s) => s.id === id)?.name}
                </li>
              ))}
              {diagnostic.missingLabStepIds.map((id) => (
                <li key={id}>
                  Complete lab:{" "}
                  {u.lab.steps.find((s) => s.id === id)?.instruction}
                </li>
              ))}
              {diagnostic.missingAssessmentPass && (
                <li>Pass the assessment using the rubric below.</li>
              )}
              {diagnostic.missingEvidence && (
                <li>Add an evidence note or a safe link.</li>
              )}
            </ul>
          )}
        </section>
      )}
      <div className="detail-layout">
        <div>
          <section className="panel">
            <SectionTitle
              title="01 / Build your understanding"
              extra={<Badge>{u.skills.length} skills</Badge>}
            />
            <p className="muted">
              Learning → practiced → mastered. Choose the status that reflects
              what you can demonstrate.
            </p>
            <div className="skills-list">
              {u.skills.map((skill, i) => {
                const p = state.skills[skill.id];
                return (
                  <div className="skill-row" key={skill.id}>
                    <div className="skill-number">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="skill-main">
                      <div className="skill-primary">
                        <strong>{skill.name}</strong>
                        <StatusSelect
                          label={`Status for ${skill.name}`}
                          value={p?.status || "not_started"}
                          values={[
                            "not_started",
                            "learning",
                            "practiced",
                            "mastered",
                          ]}
                          onChange={(v) =>
                            mutate((s) => {
                              s.skills[skill.id] = {
                                ...s.skills[skill.id],
                                status: v as SkillStatus,
                                updatedAt: new Date().toISOString(),
                              };
                            })
                          }
                        />
                      </div>
                      <details className="skill-more">
                        <summary>Notes & review date</summary>
                        <label>
                          Skill notes
                          <textarea
                            aria-label={`Notes for ${skill.name}`}
                            value={p?.notes || ""}
                            maxLength={10000}
                            onChange={(e) =>
                              mutate((s) => {
                                s.skills[skill.id] = {
                                  ...s.skills[skill.id],
                                  status: p?.status || "not_started",
                                  notes: e.target.value,
                                  updatedAt: new Date().toISOString(),
                                };
                              })
                            }
                          />
                        </label>
                        <label>
                          Review on
                          <input
                            type="date"
                            aria-label={`Review date for ${skill.name}`}
                            value={
                              state.customReviews[skill.id] ||
                              p?.reviewDue ||
                              ""
                            }
                            onChange={(e) =>
                              mutate((s) => {
                                delete s.customReviews[skill.id];
                                s.skills[skill.id] = {
                                  ...s.skills[skill.id],
                                  status: p?.status || "not_started",
                                  reviewDue: e.target.value || null,
                                  updatedAt: new Date().toISOString(),
                                };
                              })
                            }
                          />
                        </label>
                        <small className="muted">
                          Saved automatically · reviews don’t change mastery.
                        </small>
                      </details>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
          <section className="panel lab-panel">
            <div className="section-title">
              <h2>02 / Put it into practice</h2>
              <FlaskConical size={20} />
            </div>
            <h3>{u.lab.title}</h3>
            <div className="checks">
              {u.lab.steps.map((step) => (
                <CheckRow
                  key={step.id}
                  checked={!!state.labSteps[step.id]?.done}
                  onChange={(done) =>
                    mutate((s) => {
                      s.labSteps[step.id] = {
                        done,
                        updatedAt: new Date().toISOString(),
                      };
                    })
                  }
                  detail={
                    state.labSteps[step.id]?.done
                      ? "Completed · " +
                        new Date(
                          state.labSteps[step.id].updatedAt,
                        ).toLocaleDateString()
                      : undefined
                  }
                >
                  {step.instruction}
                </CheckRow>
              ))}
            </div>
            <div className="evidence-goal">
              <strong>What to keep as proof</strong>
              <p>{u.lab.expected_evidence}</p>
            </div>
          </section>
          <section className="panel assessment-panel">
            <SectionTitle
              title="03 / Test your independence"
              extra={<BookOpen size={20} />}
            />
            <h3>{u.assessment.challenge}</h3>
            <p className="muted">
              Use documentation, then demonstrate an unfamiliar variation
              without a step-by-step tutorial.
            </p>
            <ul className="rubric">
              {u.assessment.rubric.map((r) => (
                <li key={r}>
                  <CheckCircle2 size={15} />
                  {r}
                </li>
              ))}
            </ul>
            <div className="evidence-goal">
              <strong>Required evidence</strong>
              {u.assessment.required_evidence.map((r) => (
                <p key={r}>{r.replaceAll("_", " ")}</p>
              ))}
            </div>
            <label>
              Assessment reasoning & verification
              <textarea
                maxLength={10000}
                aria-label="Assessment evidence"
                placeholder="Explain your approach, your test results, and an alternative…"
                value={proof}
                onChange={(e) => {
                  setProof(e.target.value);
                  setProofSaved(false);
                }}
                onBlur={() => {
                  mutate((s) => {
                    s.assessments[u.assessment.id] = {
                      ...s.assessments[u.assessment.id],
                      status:
                        s.assessments[u.assessment.id]?.status || "not_started",
                      evidence: proof,
                      updatedAt: new Date().toISOString(),
                    };
                  });
                  setProofSaved(true);
                }}
              />
            </label>
            <div className="assessment-footer">
              <span className="muted">
                {proofSaved ? "Evidence saved · " : ""}Passing is self-reported.
                Confirm only after using the rubric.
              </span>
              <StatusSelect
                label="Assessment status"
                value={
                  state.assessments[u.assessment.id]?.status || "not_started"
                }
                values={["not_started", "attempted", "passed", "needs_review"]}
                onChange={(v) =>
                  mutate((s) => {
                    s.assessments[u.assessment.id] = {
                      ...s.assessments[u.assessment.id],
                      evidence: proof,
                      status: v as AssessmentStatus,
                      updatedAt: new Date().toISOString(),
                    };
                  })
                }
              />
            </div>
          </section>
          <Evidence id={u.id} />
        </div>
        <aside className="detail-rail">
          <section className="panel">
            <h3>Your learning path</h3>
            <p className="muted">{u.track.why_it_matters}</p>
            <div className="level-nav">
              {u.track.levels.map((level) => (
                <Link
                  key={level.id}
                  className={level.id === id ? "selected" : ""}
                  to={`/learn/${level.id}`}
                >
                  <span>{level.level}</span>
                  {level.level === "L1"
                    ? "Foundation"
                    : level.level === "L2"
                      ? "Professional"
                      : "Advanced"}
                  <ArrowRight size={14} />
                </Link>
              ))}
            </div>
            <p className="muted">{u.learning_mode.replaceAll("_", " ")}</p>
          </section>
          <section className="panel">
            <h3>Helpful foundations</h3>
            <p className="muted">
              {prerequisites.length
                ? "These foundations are still in progress. Explore freely; nothing is locked."
                : u.prerequisite_unit_ids.length
                  ? "You have recorded these foundations."
                  : "No prerequisites. A good place to start."}
            </p>
            <UnitLinks ids={u.prerequisite_unit_ids} />
          </section>
          <section className="panel">
            <h3>Read, then build</h3>
            <div className="resource-links">
              {u.resource_ids
                .map((id) => resourceById[id])
                .map((r) => (
                  <External href={r.url} key={r.id}>
                    <span>
                      {r.title}
                      <small>{r.purpose}</small>
                    </span>
                  </External>
                ))}
            </div>
            <p className="muted tiny">Resources open in a new tab.</p>
          </section>
        </aside>
      </div>
      <div className="bottom-navigation">
        {at > 0 ? (
          <Link
            to={`/learn/${u.track.levels[at - 1].id}`}
            className="button secondary"
          >
            <ArrowLeft size={16} />
            Previous level
          </Link>
        ) : (
          <Link className="button secondary" to="/learn">
            Back to roadmap
          </Link>
        )}
        {at < 2 && (
          <Link className="button" to={`/learn/${u.track.levels[at + 1].id}`}>
            Explore {u.track.levels[at + 1].level}
            <ArrowRight size={16} />
          </Link>
        )}
      </div>
    </>
  );
}
