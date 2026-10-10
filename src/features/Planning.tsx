import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  ArrowUpRight,
  Search,
  RotateCcw,
  CheckCircle2,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { data, shortTitle } from "../domain/curriculum";
import {
  currentWeek,
  addDays,
  localDate,
  reviewItems,
} from "../domain/progress";
import { useStore } from "../storage/store";
import {
  PageHeading,
  Badge,
  CheckRow,
  UnitLinks,
  Empty,
  External,
} from "../components/ui";
export function PlanPreferences() {
  const { state, mutate } = useStore();
  return (
    <div className="plan-preferences">
      <label>
        <CalendarDays size={16} />
        Sprint starts
        <input
          aria-label="Sprint start date"
          type="date"
          value={state.profile.sprintStartDate || ""}
          onChange={(e) =>
            mutate((s) => {
              s.profile.sprintStartDate = e.target.value || null;
            })
          }
        />
      </label>
      <label>
        Weekly commitment
        <div className="hours-input">
          <input
            aria-label="Hours per week"
            type="number"
            min={0}
            max={168}
            value={state.profile.preferredHoursPerWeek ?? 30}
            onChange={(e) => {
              const n = Number(e.target.value);
              if (n >= 0 && n <= 168)
                mutate((s) => {
                  s.profile.preferredHoursPerWeek = n;
                });
            }}
          />
          <span>hours / week</span>
        </div>
      </label>
      <p>
        Life happens. Change your start date anytime; unfinished work stays
        visible.
      </p>
    </div>
  );
}
export function Planner() {
  const { state, mutate } = useStore();
  const [tab, setTab] = useState("sprint");
  const cw = currentWeek(state.profile.sprintStartDate);
  return (
    <>
      <PageHeading
        eyebrow="A LITTLE STRUCTURE, A LOT OF ROOM TO GROW"
        title="Your pace. Your plan."
        description="Start with seven days of Python, then build a solid foundation over eight flexible weeks."
      />
      <PlanPreferences />
      <div className="tabs" aria-label="Study plans">
        {[
          ["sprint", "8-week foundation sprint"],
          ["starter", "7-day Python starter"],
        ].map(([id, t]) => (
          <button
            key={id}
            className={id === tab ? "active" : ""}
            onClick={() => setTab(id)}
          >
            {t}
          </button>
        ))}
      </div>
      <p className="notice compact">
        Completing a day or week records activity. Skill mastery still depends
        on your practice and evidence.
      </p>
      {tab === "sprint" ? (
        <div className="week-grid">
          {data.study_plan.weeks.map((w) => {
            const start = state.profile.sprintStartDate
              ? addDays(state.profile.sprintStartDate, (w.index - 1) * 7)
              : null;
            return (
              <section
                key={w.id}
                className={`panel week-card ${w.index === cw ? "current-week" : ""}`}
              >
                <div className="section-title">
                  <span className="eyebrow">
                    WEEK {String(w.index).padStart(2, "0")}
                  </span>
                  <Badge
                    tone={
                      state.weekChecks[w.id]
                        ? "green"
                        : w.index === cw
                          ? "blue"
                          : "neutral"
                    }
                  >
                    {state.weekChecks[w.id]
                      ? "Completed"
                      : w.index === cw
                        ? "This week"
                        : cw && w.index < cw
                          ? "Carry forward"
                          : "Your pace"}
                  </Badge>
                </div>
                <h2>{w.focus}</h2>
                {start && (
                  <p className="date-range">
                    {start} → {addDays(start, 6)}
                  </p>
                )}
                <UnitLinks ids={w.suggested_unit_ids} />
                <div className="evidence-goal">
                  <strong>Finish with something real</strong>
                  <p>{w.evidence_goal}</p>
                </div>
                <div className="project-chips">
                  {w.project_ids.map((id) => (
                    <Link to={`/projects/${id}`} key={id}>
                      {data.projects.find((p) => p.id === id)?.title}
                      <ArrowUpRight size={13} />
                    </Link>
                  ))}
                </div>
                <CheckRow
                  checked={!!state.weekChecks[w.id]}
                  onChange={(done) =>
                    mutate((s) => {
                      s.weekChecks[w.id] = done;
                    })
                  }
                >
                  Week completed
                </CheckRow>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="starter-list">
          {data.python_seven_day_starter.days.map((d) => (
            <section className="panel starter-card" key={d.id}>
              <span className="day-number">
                DAY<strong>{String(d.day).padStart(2, "0")}</strong>
              </span>
              <div>
                <h2>{d.mission}</h2>
                <p>{d.deliverable}</p>
                <UnitLinks ids={d.related_unit_ids} />
                <CheckRow
                  checked={!!state.dayChecks[d.id]}
                  onChange={(v) =>
                    mutate((s) => {
                      s.dayChecks[d.id] = v;
                    })
                  }
                >
                  Day completed
                </CheckRow>
              </div>
            </section>
          ))}
        </div>
      )}
      <section className="panel routine-panel">
        <h2>A rhythm to keep alongside the plan</h2>
        <div className="routine-grid">
          {(
            data.study_plan.parallel_routines as {
              id: string;
              title: string;
              frequency: string;
              minutes_suggested: number;
              focus: string;
            }[]
          ).map((r) => (
            <div key={r.id}>
              <h3>{r.title}</h3>
              <span>
                {r.frequency} · ~{r.minutes_suggested} min
              </span>
              <p>{r.focus}</p>
              {r.id === "routine-job" && (
                <Link to="/applications" className="text-link">
                  Track applications
                  <ArrowRight size={14} />
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
export function Reviews() {
  const { state, mutate } = useStore();
  const [filter, setFilter] = useState("due");
  const all = reviewItems(state);
  const shown = all.filter((r) => filter === "all" || r.bucket === filter);
  return (
    <>
      <PageHeading
        eyebrow="MAKE IT STICK"
        title="Come back a little stronger."
        description="Revisit the skills you’ve practiced. A review changes your record, never your mastery status."
        action={
          <Badge tone="green">
            {all.filter((r) => r.bucket === "due").length} due for review
          </Badge>
        }
      />
      <div className="tabs">
        {[
          ["due", "Due & overdue"],
          ["soon", "Upcoming"],
          ["done", "Reviewed"],
          ["all", "All reviews"],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={filter === id ? "active" : ""}
          >
            {label}{" "}
            <span>
              {all.filter((r) => id === "all" || r.bucket === id).length}
            </span>
          </button>
        ))}
      </div>
      {shown.length ? (
        <div className="review-list">
          {shown.map((r) => (
            <section className="panel review-row" key={r.id}>
              <span className="review-icon">
                <RotateCcw size={20} />
              </span>
              <div className="review-copy">
                <Link to={`/learn/${r.unit.id}`}>
                  <h3>{r.name}</h3>
                </Link>
                <p>
                  {shortTitle(r.unit.discipline.title)} · {r.unit.level}
                </p>
                <span className={r.bucket === "due" ? "overdue-text" : "muted"}>
                  {r.due
                    ? `${r.due < localDate() ? "Overdue · " : r.due === localDate() ? "Due today · " : "Scheduled · "}${r.due}`
                    : `Reviewed ${r.lastReviewed ? new Date(r.lastReviewed).toLocaleDateString() : ""}`}
                </span>
              </div>
              <div className="review-controls">
                <label>
                  Next review
                  <input
                    type="date"
                    aria-label={`Reschedule ${r.name}`}
                    value={r.due || ""}
                    onChange={(e) =>
                      mutate((s) => {
                        delete s.customReviews[r.id];
                        s.skills[r.id] = {
                          ...s.skills[r.id],
                          status: s.skills[r.id]?.status || "not_started",
                          reviewDue: e.target.value || null,
                          updatedAt: new Date().toISOString(),
                        };
                      })
                    }
                  />
                </label>
                <button
                  className="button secondary small"
                  onClick={() =>
                    mutate((s) => {
                      delete s.customReviews[r.id];
                      s.skills[r.id] = {
                        ...s.skills[r.id],
                        status: s.skills[r.id]?.status || "not_started",
                        reviewDue: null,
                        lastReviewedAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                      };
                    })
                  }
                >
                  <CheckCircle2 size={15} />
                  Reviewed
                </button>
                <button
                  className="text-button"
                  onClick={() =>
                    mutate((s) => {
                      delete s.customReviews[r.id];
                      s.skills[r.id] = {
                        ...s.skills[r.id],
                        status: s.skills[r.id]?.status || "not_started",
                        reviewDue: addDays(localDate(), 7),
                        updatedAt: new Date().toISOString(),
                      };
                    })
                  }
                >
                  Schedule in 7 days
                </button>
              </div>
            </section>
          ))}
        </div>
      ) : (
        <Empty
          title={
            filter === "due" ? "You’re all caught up." : "Nothing here yet."
          }
          action={
            <Link className="button secondary" to="/learn">
              Explore your roadmap <ArrowRight size={16} />
            </Link>
          }
        >
          Schedule a review under “Notes & review date” on any skill. Your
          scheduled reviews will appear here.
        </Empty>
      )}
    </>
  );
}
export function Resources() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const list = data.resources.filter(
    (r) =>
      (!type || r.source_type === type) &&
      [r.title, r.purpose, r.source_type]
        .join(" ")
        .toLowerCase()
        .includes(q.toLowerCase()),
  );
  return (
    <>
      <PageHeading
        eyebrow="A SMALL, WELL-CHOSEN LIBRARY"
        title="Go straight to the source."
        description="Official documentation, deep theory, and practical references from your curriculum."
        action={<Badge>{data.resources.length} references</Badge>}
      />
      <div className="filter-panel">
        <div className="search-field">
          <Search size={18} />
          <input
            aria-label="Search resources"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Find a book, guide, or reference…"
          />
        </div>
        <div className="filter-row">
          <select
            aria-label="Resource type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">All resource types</option>
            {[...new Set(data.resources.map((r) => r.source_type))].map((t) => (
              <option key={t} value={t}>
                {t.replaceAll("_", " ")}
              </option>
            ))}
          </select>
          <span className="muted">{list.length} resources</span>
        </div>
      </div>
      {list.length ? (
        <div className="resource-grid">
          {list.map((r) => (
            <article className="panel resource-card" key={r.id}>
              <div className="section-title">
                <span className="resource-book">
                  <BookOpen size={22} />
                </span>
                <Badge>{r.source_type.replaceAll("_", " ")}</Badge>
              </div>
              <h2>
                <External href={r.url}>{r.title}</External>
              </h2>
              <p>{r.purpose}</p>
              <span className="resource-domain">{new URL(r.url).hostname}</span>
            </article>
          ))}
        </div>
      ) : (
        <Empty title="No resources found">
          Try a different keyword or resource type.
        </Empty>
      )}
    </>
  );
}
