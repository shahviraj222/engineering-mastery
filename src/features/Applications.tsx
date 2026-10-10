import { useState } from "react";
import {
  Plus,
  Search,
  BriefcaseBusiness,
  ArrowUpRight,
  CalendarDays,
  Trash2,
} from "lucide-react";
import { useStore } from "../storage/store";
import type { Application, ApplicationStatus } from "../domain/types";
import { localDate, safeUrl } from "../domain/progress";
import { labels } from "../domain/curriculum";
import {
  PageHeading,
  Badge,
  Modal,
  Empty,
  StatusSelect,
  External,
} from "../components/ui";
const statuses = [
  "saved",
  "applied",
  "screening",
  "interview",
  "offer",
  "rejected",
  "withdrawn",
];
export function Applications() {
  const { state, mutate } = useStore();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("");
  const [editing, setEditing] = useState<Application | null>(null);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const apps = Object.values(state.applications).sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  );
  const list = apps.filter(
    (a) =>
      (!filter || a.status === filter) &&
      `${a.company} ${a.role} ${a.notes}`
        .toLowerCase()
        .includes(q.toLowerCase()),
  );
  const create = () => {
    setError("");
    setEditing({
      id: crypto.randomUUID(),
      company: "",
      role: "",
      status: "saved",
      url: "",
      salary: "",
      contact: "",
      appliedDate: null,
      followUp: null,
      notes: "",
      updatedAt: new Date().toISOString(),
    });
  };
  const update = (k: keyof Application, v: string | null) =>
    setEditing((a) => (a ? { ...a, [k]: v } : a));
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    if (!editing.company.trim() || !editing.role.trim()) {
      setError("Enter a company and role before saving.");
      return;
    }
    if (editing.url && !safeUrl(editing.url)) {
      setError("Use an http or https link for the job posting.");
      return;
    }
    mutate((s) => {
      s.applications[editing.id] = {
        ...editing,
        company: editing.company.trim(),
        role: editing.role.trim(),
        updatedAt: new Date().toISOString(),
      };
    });
    setEditing(null);
  };
  const followups = apps.filter(
    (a) =>
      a.followUp &&
      a.followUp <= localDate() &&
      !["offer", "rejected", "withdrawn"].includes(a.status),
  );
  return (
    <>
      <PageHeading
        eyebrow="TURN THE WORK INTO OPPORTUNITY"
        title="Your next chapter, in motion."
        description="Track the role, the conversation, and the next step. Spend less time organizing."
        action={
          <button className="button" onClick={create}>
            <Plus size={17} />
            Add application
          </button>
        }
      />
      <div className="application-stats">
        {[
          ["Opportunities", apps.length],
          [
            "In conversation",
            apps.filter((a) => ["screening", "interview"].includes(a.status))
              .length,
          ],
          ["Offers", apps.filter((a) => a.status === "offer").length],
          ["Follow-ups due", followups.length],
        ].map(([label, value]) => (
          <div className="panel" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      {followups.length > 0 && (
        <section className="notice followup-notice">
          <CalendarDays size={19} />
          <div>
            <strong>Keep the conversation moving</strong>
            <p>
              {followups.map((a) => (
                <button
                  className="text-button"
                  key={a.id}
                  onClick={() => {
                    setError("");
                    setEditing(a);
                  }}
                >
                  {a.company} · {a.followUp}
                </button>
              ))}
            </p>
          </div>
        </section>
      )}
      <div className="filter-panel">
        <div className="search-field">
          <Search size={18} />
          <input
            aria-label="Search applications"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search company, role, or notes…"
          />
        </div>
        <div className="filter-row">
          <select
            aria-label="Application filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">All stages</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {labels[s]}
              </option>
            ))}
          </select>
          <span className="muted">
            {list.length} opportunities · saved on this browser
          </span>
        </div>
      </div>
      {list.length ? (
        <div className="applications-list">
          {list.map((a) => (
            <article className="panel application-row" key={a.id}>
              <span className="company-icon">
                {a.company.slice(0, 2).toUpperCase()}
              </span>
              <div className="application-main">
                <button
                  className="application-title"
                  onClick={() => {
                    setError("");
                    setEditing(a);
                  }}
                >
                  {a.company}
                  <ArrowUpRight size={15} />
                </button>
                <h3>{a.role}</h3>
                <p>
                  {a.salary ? `${a.salary} LPA · ` : ""}
                  {a.appliedDate
                    ? `Applied ${a.appliedDate}`
                    : "Not yet applied"}
                  {a.contact ? ` · ${a.contact}` : ""}
                </p>
                {a.followUp && (
                  <small
                    className={
                      a.followUp <= localDate() ? "overdue-text" : "muted"
                    }
                  >
                    Follow up · {a.followUp}
                  </small>
                )}
              </div>
              <StatusSelect
                label={`Stage for ${a.company}`}
                values={statuses}
                value={a.status}
                onChange={(v) =>
                  mutate((s) => {
                    s.applications[a.id] = {
                      ...a,
                      status: v as ApplicationStatus,
                      updatedAt: new Date().toISOString(),
                    };
                  })
                }
              />
              <button
                className="button secondary small"
                onClick={() => {
                  setError("");
                  setEditing(a);
                }}
              >
                Details
              </button>
            </article>
          ))}
        </div>
      ) : (
        <Empty
          title={
            apps.length
              ? "No matching applications."
              : "Make room for your next opportunity."
          }
          action={
            <button className="button" onClick={create}>
              <Plus size={16} />
              Add your first application
            </button>
          }
        >
          {apps.length
            ? "Try another search or stage."
            : "Save a role, add a referral, or record an application. Your pipeline starts with one useful step."}
        </Empty>
      )}
      {editing && (
        <Modal
          title={
            state.applications[editing.id]
              ? "Application details"
              : "Add an opportunity"
          }
          onClose={() => setEditing(null)}
        >
          <form onSubmit={save} className="application-form">
            <div className="form-grid">
              <label>
                Company
                <input
                  autoFocus
                  required
                  maxLength={200}
                  value={editing.company}
                  onChange={(e) => update("company", e.target.value)}
                />
              </label>
              <label>
                Role
                <input
                  required
                  maxLength={300}
                  value={editing.role}
                  onChange={(e) => update("role", e.target.value)}
                />
              </label>
              <label>
                Stage
                <StatusSelect
                  label="Application stage"
                  values={statuses}
                  value={editing.status}
                  onChange={(v) => update("status", v)}
                />
              </label>
              <label>
                Compensation · LPA
                <input
                  inputMode="decimal"
                  maxLength={100}
                  value={editing.salary}
                  placeholder="e.g. 35–45"
                  onChange={(e) => update("salary", e.target.value)}
                />
              </label>
              <label>
                Applied on
                <input
                  type="date"
                  value={editing.appliedDate || ""}
                  onChange={(e) =>
                    update("appliedDate", e.target.value || null)
                  }
                />
              </label>
              <label>
                Follow up on
                <input
                  type="date"
                  value={editing.followUp || ""}
                  onChange={(e) => update("followUp", e.target.value || null)}
                />
              </label>
            </div>
            <label>
              Job posting link
              <input
                type="url"
                maxLength={2048}
                placeholder="https://…"
                value={editing.url}
                onChange={(e) => update("url", e.target.value)}
              />
            </label>
            <label>
              Contact or referral
              <input
                maxLength={2048}
                value={editing.contact}
                onChange={(e) => update("contact", e.target.value)}
                placeholder="Name, email, or where you connected"
              />
            </label>
            <label>
              Notes & next action
              <textarea
                maxLength={10000}
                rows={4}
                value={editing.notes}
                onChange={(e) => update("notes", e.target.value)}
                placeholder="Interview details, what to prepare, or your next step…"
              />
            </label>
            {editing.url && safeUrl(editing.url) && (
              <External href={editing.url}>Open job posting</External>
            )}
            {error && (
              <p role="alert" className="error-text">
                {error}
              </p>
            )}
            <div className="modal-actions">
              {state.applications[editing.id] && (
                <button
                  type="button"
                  className="danger text-button"
                  onClick={() => setDeleting(editing.id)}
                >
                  <Trash2 size={15} />
                  Delete
                </button>
              )}
              <button
                type="button"
                className="button secondary"
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
              <button className="button" type="submit">
                Save application
              </button>
            </div>
          </form>
        </Modal>
      )}
      {deleting && (
        <Modal
          title="Delete this application?"
          onClose={() => setDeleting(null)}
        >
          <p>This removes the application and its notes from this browser.</p>
          <div className="modal-actions">
            <button
              className="button secondary"
              onClick={() => setDeleting(null)}
            >
              Keep application
            </button>
            <button
              className="button danger-button"
              onClick={() => {
                mutate((s) => {
                  delete s.applications[deleting];
                });
                setDeleting(null);
                setEditing(null);
              }}
            >
              Delete application
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
