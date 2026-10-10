import { useState } from "react";
import { Save, Link2, Check } from "lucide-react";
import { useStore } from "../storage/store";
import { safeUrl } from "../domain/progress";
import { External } from "./ui";
export default function Evidence({
  id,
  title = "Your notes & evidence",
}: {
  id: string;
  title?: string;
}) {
  const { state, mutate } = useStore();
  const evidence = state.evidence[id];
  const [notes, setNotes] = useState(evidence?.notes || "");
  const [links, setLinks] = useState(evidence?.links?.join("\n") || "");
  const [message, setMessage] = useState("");
  const save = () => {
    const list = links
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    if (list.length > 20 || list.some((x) => !safeUrl(x) || x.length > 2048)) {
      setMessage(
        "Use up to 20 valid http(s) links, one per line (2,048 characters each).",
      );
      return;
    }
    mutate((s) => {
      s.evidence[id] = {
        notes,
        links: list,
        updatedAt: new Date().toISOString(),
      };
    });
    setMessage("Saved");
  };
  return (
    <section className="panel evidence">
      <h2>{title}</h2>
      <p className="muted">
        Capture what you built, tested, and can explain. A short note or a link
        is enough to record evidence.
      </p>
      <label>
        Technical notes
        <textarea
          aria-label={`${title} notes`}
          maxLength={10000}
          value={notes}
          placeholder="What did you learn? What worked, broke, or needs another look?"
          onChange={(e) => {
            setNotes(e.target.value);
            setMessage("Unsaved changes");
          }}
          onBlur={save}
          rows={5}
        />
      </label>
      <label>
        <span className="inline">
          <Link2 size={15} /> Evidence links · one per line
        </span>
        <textarea
          value={links}
          aria-label="Evidence links"
          maxLength={41000}
          placeholder="https://github.com/you/your-project"
          onChange={(e) => {
            setLinks(e.target.value);
            setMessage("Unsaved changes");
          }}
          onBlur={save}
          rows={2}
        />
      </label>
      <div className="evidence-footer">
        <span role="status" className="muted inline">
          {message === "Saved" && <Check size={14} />}{" "}
          {message || "Saved on this browser when you leave a field."}
        </span>
        <button className="button secondary small" onClick={save}>
          <Save size={15} />
          Save notes
        </button>
      </div>
      {evidence?.links?.length ? (
        <div className="saved-links">
          {evidence.links.map((l) => (
            <External key={l} href={l}>
              {new URL(l).hostname}
            </External>
          ))}
        </div>
      ) : null}
    </section>
  );
}
