import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, FolderGit2, ArrowRight } from "lucide-react";
import { data, labels } from "../domain/curriculum";
import type { WorkStatus } from "../domain/types";
import { useStore } from "../storage/store";
import {
  PageHeading,
  Badge,
  Progress,
  Empty,
  CheckRow,
  StatusSelect,
  UnitLinks,
} from "../components/ui";
import Evidence from "../components/Evidence";
const stage = (s: string) =>
  s === "ai_later"
    ? "Later · AI"
    : s === "advanced_optional"
      ? "Advanced · optional"
      : s === "core"
        ? "Core engineering"
        : "Foundation";
export function Projects() {
  const { state } = useStore();
  return (
    <>
      <PageHeading
        eyebrow="LEARNING, MADE TANGIBLE"
        title="Build things you can explain."
        description="Seven progressive projects. Real decisions, working code, and proof of your craft."
      />
      <div className="project-grid">
        {data.projects.map((p, i) => {
          const done = p.tasks.filter(
            (t) => state.projectTasks[t.id]?.done,
          ).length;
          return (
            <Link className="project-card" to={`/projects/${p.id}`} key={p.id}>
              <div className={`project-art project-art-${i % 3}`}>
                <span className="project-art-id">
                  PROJECT / {String(i + 1).padStart(2, "0")}
                </span>
                <FolderGit2 size={48} strokeWidth={1} />
                <span className="project-art-code">
                  {
                    [
                      "$ python app.py",
                      "GET /api/v1/",
                      "SELECT * FROM",
                      "docker compose up",
                      "p95 < 200ms",
                      "queue → worker",
                      "context → answer",
                    ][i]
                  }
                </span>
              </div>
              <div className="project-body">
                <div className="section-title">
                  <Badge>{stage(p.stage)}</Badge>
                  <ArrowUpRight size={18} />
                </div>
                <h2>{p.title}</h2>
                <p>{p.description}</p>
                <div className="project-progress">
                  <span>
                    {labels[state.projects[p.id]?.status || "not_started"]}
                  </span>
                  <span>
                    {done}/{p.tasks.length} tasks
                  </span>
                </div>
                <Progress
                  value={done}
                  total={p.tasks.length}
                  label={`${p.title} tasks`}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
export function ProjectDetail() {
  const { projectId } = useParams();
  const p = data.projects.find((p) => p.id === projectId);
  const { state, mutate } = useStore();
  if (!p)
    return (
      <Empty
        title="Project not found"
        action={<Link to="/projects">All projects</Link>}
      >
        Choose a project from the lab.
      </Empty>
    );
  const next = p.tasks.find((t) => !state.projectTasks[t.id]?.done);
  return (
    <>
      <Link to="/projects" className="back-link">
        <ArrowLeft size={16} />
        Project lab
      </Link>
      <PageHeading
        eyebrow={stage(p.stage).toUpperCase()}
        title={p.title}
        description={p.description}
        action={
          <StatusSelect
            label="Project status"
            values={["not_started", "active", "blocked", "completed"]}
            value={state.projects[p.id]?.status || "not_started"}
            onChange={(v) =>
              mutate((s) => {
                s.projects[p.id] = {
                  ...s.projects[p.id],
                  status: v as WorkStatus,
                  updatedAt: new Date().toISOString(),
                };
              })
            }
          />
        }
      />
      <div className="detail-layout">
        <div>
          <div className="notice">
            <ArrowRight size={18} />
            {next
              ? `Next step: ${next.title}`
              : "Tasks complete. Review your evidence and explain the trade-offs before marking the project complete."}
          </div>
          <section className="panel">
            <h2>The build checklist</h2>
            <div className="checks">
              {p.tasks.map((t) => (
                <CheckRow
                  key={t.id}
                  checked={!!state.projectTasks[t.id]?.done}
                  onChange={(done) =>
                    mutate((s) => {
                      s.projectTasks[t.id] = {
                        done,
                        updatedAt: new Date().toISOString(),
                      };
                    })
                  }
                >
                  {t.title}
                </CheckRow>
              ))}
            </div>
            <p className="muted">
              Task checks and project status are independent of skill mastery.
            </p>
          </section>
          <Evidence key={p.id} id={p.id} title="Project notes & evidence" />
          {state.projects[p.id]?.notes && (
            <section className="panel">
              <h3>Imported project notes</h3>
              <p className="preserve-lines">{state.projects[p.id].notes}</p>
            </section>
          )}
        </div>
        <aside className="detail-rail">
          <section className="panel">
            <h3>Definition of done</h3>
            <p>{p.completion_rule}</p>
            <ul className="simple-list">
              {p.required_evidence.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </section>
          <section className="panel">
            <h3>Connect the learning</h3>
            <UnitLinks ids={p.related_unit_ids} />
          </section>
        </aside>
      </div>
    </>
  );
}
