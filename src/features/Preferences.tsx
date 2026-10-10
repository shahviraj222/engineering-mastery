import { useState } from "react";
import {
  Download,
  Upload,
  ShieldCheck,
  Sun,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { useStore } from "../storage/store";
import { parseBackup } from "../storage/validation";
import { emptyState, counts } from "../domain/progress";
import type { TrackerState } from "../domain/types";
import { PageHeading, Modal } from "../components/ui";
import { PlanPreferences } from "./Planning";
export function Preferences() {
  const { state, mutate, replace, exportBackup } = useStore();
  const [preview, setPreview] = useState<TrackerState | null>(null);
  const [message, setMessage] = useState("");
  const [reset, setReset] = useState(false);
  const [confirm, setConfirm] = useState("");
  const read = async (file?: File) => {
    if (!file) return;
    setMessage("");
    try {
      if (file.size > 5_000_000)
        throw new Error("Backup must be smaller than 5 MB.");
      setPreview(parseBackup(await file.text()));
    } catch (e) {
      setMessage(
        `Import failed: ${e instanceof Error ? e.message : "Invalid backup"}`,
      );
    }
  };
  const c = preview ? counts(preview) : null;
  return (
    <>
      <PageHeading
        eyebrow="MAKE THIS SPACE YOURS"
        title="A little housekeeping."
        description="Adjust your plan, make a backup, and keep your progress in your own hands."
      />
      <div className="settings-layout">
        <div>
          <section className="panel">
            <h2>Your study rhythm</h2>
            <PlanPreferences />
          </section>
          <section className="panel">
            <h2>Look & feel</h2>
            <p className="muted">
              Choose what feels comfortable for a focused session.
            </p>
            <div className="theme-options">
              {(["light", "dark", "system"] as const).map((t) => (
                <button
                  key={t}
                  className={`theme-option ${(state.profile.theme || "light") === t ? "selected" : ""}`}
                  onClick={() =>
                    mutate((s) => {
                      s.profile.theme = t;
                    })
                  }
                >
                  <span className={`theme-swatch ${t}`}>
                    <i />
                    <i />
                    <i />
                  </span>
                  <span>
                    {t[0].toUpperCase() + t.slice(1)}
                    {(state.profile.theme || "light") === t && (
                      <CheckCircle2 size={15} />
                    )}
                  </span>
                </button>
              ))}
            </div>
          </section>
          <section className="panel">
            <h2>Keep a copy of your progress</h2>
            <p>
              Back up skill states, lab checks, evidence, reviews, plans, and
              applications together.
            </p>
            <div className="backup-actions">
              <button className="button" onClick={exportBackup}>
                <Download size={16} />
                Export backup
              </button>
              <label className="button secondary import-button">
                <Upload size={16} />
                Import backup
                <input
                  aria-label="Import backup file"
                  type="file"
                  accept="application/json,.json"
                  onChange={(e) => {
                    void read(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
            <p className="muted tiny">
              Imports are validated first. You’ll review a preview before
              replacing anything.
            </p>
            {message && (
              <p
                role="status"
                className={
                  message.startsWith("Import failed")
                    ? "error-text"
                    : "success-text"
                }
              >
                {message}
              </p>
            )}
          </section>
          <section className="panel reset-panel">
            <h2>Start with a clean slate</h2>
            <p>
              Remove your personal progress from this browser. The curriculum
              stays intact.
            </p>
            <button
              className="button secondary danger"
              onClick={() => {
                setConfirm("");
                setReset(true);
              }}
            >
              Reset all progress
            </button>
          </section>
        </div>
        <aside className="detail-rail">
          <section className="panel privacy-card">
            <ShieldCheck size={28} />
            <h3>Your work stays yours.</h3>
            <p>
              Progress is stored locally in this browser. It is never sent to a
              server or external service.
            </p>
            <p>
              Another browser, device, or site address has separate storage.
              Export and import a backup to move your progress.
            </p>
            <p>
              Clearing browser data removes your progress. Make a regular
              backup.
            </p>
            <p className="muted tiny">
              An internet connection is needed for the initial page load.
              Offline page loading is not enabled.
            </p>
          </section>
          <section className="panel">
            <h3>About your roadmap</h3>
            <p>
              Python-first engineering mastery, based on your supplied
              curriculum.
            </p>
            <p className="muted">
              ₹40 LPA is your aspiration. Offers depend on experience,
              demonstrated skills, the company, and the market.
            </p>
            <small>Curriculum reviewed: 10 October 2026</small>
          </section>
        </aside>
      </div>
      {preview && c && (
        <Modal title="Review your backup" onClose={() => setPreview(null)}>
          <p>
            This will replace your current progress. Export a copy first if you
            want to keep it.
          </p>
          <div className="import-summary">
            <div>
              <strong>{Object.keys(preview.skills).length}</strong>skill records
            </div>
            <div>
              <strong>
                {Object.values(preview.labSteps).filter((x) => x.done).length}
              </strong>
              lab steps done
            </div>
            <div>
              <strong>{Object.keys(preview.evidence).length}</strong>evidence
              entries
            </div>
            <div>
              <strong>{Object.keys(preview.applications).length}</strong>
              applications
            </div>
          </div>
          <p className="muted">
            Current → imported: {counts(state).mastered} → {c.mastered} mastered
            skills; {Object.keys(state.applications).length} →{" "}
            {Object.keys(preview.applications).length} applications. Notes,
            assessments, projects, plan checks, and reviews are restored too.
          </p>
          <div className="modal-actions">
            <button
              className="button secondary"
              onClick={() => setPreview(null)}
            >
              Cancel
            </button>
            <button
              className="button"
              onClick={() => {
                if (replace(preview)) {
                  setPreview(null);
                  setMessage("Backup restored successfully.");
                }
              }}
            >
              Replace with this backup
            </button>
          </div>
        </Modal>
      )}
      {reset && (
        <Modal title="Reset your workspace?" onClose={() => setReset(false)}>
          <p>
            All learning progress, notes, reviews, and job applications will be
            removed from this browser.
          </p>
          <button className="text-button" onClick={exportBackup}>
            <Download size={15} />
            Export a backup first
          </button>
          <label className="reset-confirm">
            Type RESET to confirm
            <input
              aria-label="Type RESET to confirm"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="off"
            />
          </label>
          <div className="modal-actions">
            <button
              className="button secondary"
              onClick={() => setReset(false)}
            >
              Keep my progress
            </button>
            <button
              disabled={confirm !== "RESET"}
              className="button danger-button"
              onClick={() => {
                if (replace(emptyState())) {
                  setReset(false);
                  setMessage("Your progress has been reset.");
                }
              }}
            >
              Reset everything
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
