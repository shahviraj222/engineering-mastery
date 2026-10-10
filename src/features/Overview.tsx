import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Code2,
  Terminal,
  GitBranch,
  Database,
  Layers,
  Shield,
  Cloud,
  BrainCircuit,
  MessageSquare,
  Network,
  BookOpen,
  CheckCircle2,
  FlaskConical,
  FolderGit2,
  Target,
  Clock3,
  ChevronRight,
  CalendarDays,
} from "lucide-react";
import { useStore } from "../storage/store";
import {
  data,
  units,
  skills,
  disciplineLabels,
  unitTitle,
} from "../domain/curriculum";
import {
  counts,
  recommend,
  reviewItems,
  localDate,
  currentWeek,
} from "../domain/progress";
import { Progress, Badge, SectionTitle, ArrowLink } from "../components/ui";
const icons: Record<string, typeof Code2> = {
  cs: Terminal,
  python: Code2,
  dsa: GitBranch,
  db: Database,
  software: Layers,
  design: Network,
  security: Shield,
  prod: Cloud,
  ai: BrainCircuit,
  practice: MessageSquare,
};
export function Overview() {
  const { state } = useStore();
  const c = counts(state);
  const next = recommend(state);
  const due = reviewItems(state).filter((r) => r.bucket === "due");
  const weekNum = currentWeek(state.profile.sprintStartDate);
  const week =
    data.study_plan.weeks.find((w) => w.index === weekNum) ||
    data.study_plan.weeks.find((w) => !state.weekChecks[w.id]) ||
    data.study_plan.weeks[0];
  const labNext = next.lab.steps.find((s) => !state.labSteps[s.id]?.done);
  const followups = Object.values(state.applications).filter(
    (a) =>
      a.followUp &&
      a.followUp <= localDate() &&
      !["offer", "rejected", "withdrawn"].includes(a.status),
  );
  const stats = [
    {
      label: "Skills mastered",
      value: c.mastered,
      total: c.total,
      icon: CheckCircle2,
      caption: "Evidence over checkboxes",
      color: "green",
    },
    {
      label: "Actively learning",
      value: c.active,
      icon: BookOpen,
      caption: `${c.learning} learning · ${c.practiced} practiced`,
      color: "blue",
    },
    {
      label: "Labs completed",
      value: c.labs,
      total: units.length,
      icon: FlaskConical,
      caption: `${c.assessments} assessments passed`,
      color: "orange",
    },
    {
      label: "Projects completed",
      value: c.projects,
      total: data.projects.length,
      icon: FolderGit2,
      caption: "Build a portfolio you can explain",
      color: "purple",
    },
  ];
  return (
    <>
      <div className="welcome-row">
        <div className="eyebrow">
          <i className="green-dot" />
          YOUR NEXT CHAPTER STARTS HERE
        </div>
        <span className="date-label">
          {new Intl.DateTimeFormat("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "long",
          }).format(new Date())}
        </span>
      </div>
      <div className="dashboard-heading">
        <h1>
          Good to see you, Viraj<span>.</span>
        </h1>
        <p>
          A little more capable, every day. Let’s build something that matters.
        </p>
      </div>
      <section className="hero">
        <div className="hero-copy">
          <Badge tone="hero-badge">
            <span className="tiny-dot" /> PYTHON FIRST. ENGINEERING ALWAYS.
          </Badge>
          <h2>
            Learn. Build.
            <br />
            Test. <span>Explain.</span>
          </h2>
          <p>
            Your path from knowing the syntax to owning the system.
            <br className="desktop-break" /> One practical skill at a time.
          </p>
          <Link className="button hero-button" to={`/learn/${next.id}`}>
            Continue learning <ArrowRight size={17} />
          </Link>
          <span className="hero-footnote">
            {data.curriculum.length} disciplines <b>·</b> {units.length}{" "}
            learning units <b>·</b> Your pace
          </span>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <span className="orbit-point p-one" />
          <span className="orbit-point p-two" />
          <div className="code-card">
            <div className="code-card-top">
              <span />
              <span />
              <span />
              <i>your_next_chapter.py</i>
            </div>
            <div className="code-lines">
              <span>
                <em>01</em>
                <b>class</b> <strong>BetterEngineer</strong>:
              </span>
              <span>
                <em>02</em> <b>def</b> grow(self):
              </span>
              <span>
                <em>03</em> self.<mark>build</mark>()
              </span>
              <span>
                <em>04</em> self.<mark>understand</mark>()
              </span>
              <span>
                <em>05</em> self.<mark>improve</mark>()
              </span>
              <span>
                <em>06</em> <b>return</b> self
              </span>
            </div>
            <div className="code-card-bottom">
              <span className="tiny-dot" />
              Growth is a practice, not a deadline.
            </div>
          </div>
          <div className="floating-tag">
            <span>
              <CheckCircle2 size={18} />
            </span>{" "}
            Built, not just watched.
          </div>
        </div>
      </section>
      <div className="stats-grid">
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-top">
              <span>{s.label}</span>
              <s.icon size={18} className={`ink-${s.color}`} />
            </div>
            <div className="stat-number">
              {s.value}
              {s.total && <span>/ {s.total}</span>}
            </div>
            <small>{s.caption}</small>
          </div>
        ))}
      </div>
      <div className="dashboard-columns">
        <section>
          <SectionTitle
            title="Your next best step"
            extra={<Badge tone="green">START SMALL, BUILD WELL</Badge>}
          />
          <Link to={`/learn/${next.id}`} className="next-card">
            <div className="next-icon">
              <Code2 size={25} />
            </div>
            <div className="next-content">
              <div className="eyebrow">
                {disciplineLabels[next.discipline.id]} <span> / </span>{" "}
                {next.level} ·{" "}
                {next.level === "L1"
                  ? "Foundation"
                  : next.level === "L2"
                    ? "Professional"
                    : "Advanced"}
              </div>
              <h3>{next.track.title}</h3>
              <p>{next.outcome}</p>
              <div className="next-meta">
                <span>
                  <FlaskConical size={14} />
                  {labNext
                    ? "Next: " + labNext.instruction
                    : "Finish your assessment & evidence"}
                </span>
              </div>
            </div>
            <span className="round-arrow">
              <ArrowUpRight size={21} />
            </span>
          </Link>
          <div className="path-section">
            <SectionTitle
              title="The bigger picture"
              extra={<ArrowLink to="/learn">Explore roadmap</ArrowLink>}
            />
            <div className="discipline-grid">
              {data.curriculum.map((d) => {
                const list = skills.filter(
                  (s) => s.unit.discipline.id === d.id,
                );
                const n = list.filter(
                  (s) => state.skills[s.id]?.status === "mastered",
                ).length;
                const Icon = icons[d.id] || Code2;
                return (
                  <Link
                    className="discipline-card"
                    to={`/learn?subject=${d.id}`}
                    key={d.id}
                  >
                    <div className="discipline-top">
                      <span className={`subject-icon subject-${d.id}`}>
                        <Icon size={18} />
                      </span>
                      <span>
                        {d.priority === "later" ? (
                          <Badge>Later</Badge>
                        ) : (
                          <ChevronRight size={15} />
                        )}
                      </span>
                    </div>
                    <h3>{disciplineLabels[d.id]}</h3>
                    <div className="discipline-caption">
                      <span>{d.tracks.length} tracks · L1–L3</span>
                      <span>
                        {n}/{list.length}
                      </span>
                    </div>
                    <Progress
                      value={n}
                      total={list.length}
                      label={`${d.title} skills mastered`}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
        <aside className="dashboard-rail">
          <section className="panel sprint-card">
            <div className="rail-icon">
              <CalendarDays size={18} />
              <span>YOUR FOUNDATION SPRINT</span>
            </div>
            <div className="sprint-heading">
              <h3>
                Week {week.index}
                <span> / 8</span>
              </h3>
              <Badge tone="green">
                {state.profile.sprintStartDate
                  ? "Your plan"
                  : "Ready when you are"}
              </Badge>
            </div>
            <h4>{week.focus}</h4>
            <p>{week.evidence_goal}</p>
            <div className="sprint-progress">
              <span>
                {Object.values(state.weekChecks).filter(Boolean).length} of 8
                weeks completed
              </span>
              <span>{state.profile.preferredHoursPerWeek ?? 30}h / week</span>
            </div>
            <Progress
              value={Object.values(state.weekChecks).filter(Boolean).length}
              total={data.study_plan.weeks.length}
              label="Sprint weeks completed"
            />
            <Link to="/plan" className="button secondary full">
              Open study planner <ArrowRight size={15} />
            </Link>
          </section>
          <section className="panel review-card">
            <SectionTitle title="Keep it fresh" extra={<RotateIcon />} />
            {due.length ? (
              <>
                <h3>{due.length} skills to revisit</h3>
                <p>{due[0].name}</p>
                <ArrowLink to="/reviews">Review your skills</ArrowLink>
              </>
            ) : (
              <>
                <div className="calm-check">
                  <CheckCircle2 size={24} />
                </div>
                <h3>A clean slate.</h3>
                <p>
                  As you practice, schedule reviews to make your learning stick.
                </p>
                <ArrowLink to="/reviews">View review queue</ArrowLink>
              </>
            )}
          </section>
          <Link className="career-card" to="/applications">
            <div>
              <Target size={20} />
              <ArrowUpRight size={17} />
            </div>
            <h3>Your next opportunity</h3>
            <p>
              {followups.length
                ? `${followups.length} follow-ups need your attention.`
                : "Keep applications, interviews, and follow-ups in one place."}
            </p>
            <span>
              Open application tracker <ArrowRight size={15} />
            </span>
          </Link>
          <div className="quiet-note">
            <Clock3 size={16} />
            <p>
              Consistency beats intensity.
              <br />
              The plan adapts to your life.
            </p>
          </div>
        </aside>
      </div>
      <section className="principles">
        <span>THE WAY WE LEARN</span>
        <p>Build → understand → break → measure → improve.</p>
        <small>
          Progress comes from what you can demonstrate. Mastery is
          self-assessed.
        </small>
        <details>
          <summary>Read the roadmap principles</summary>
          {(data.principles as string[]).map((p) => (
            <p key={p}>{p}</p>
          ))}
          <p>
            {String((data.metadata as Record<string, unknown>).target_outcome)}
          </p>
        </details>
      </section>
    </>
  );
}
function RotateIcon() {
  return <Network size={18} className="muted" />;
}
