import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import type { TrackerState } from "../domain/types";
import { emptyState, localDate } from "../domain/progress";
import { validateState, download, makeBackup } from "./validation";
export const STORAGE_KEY = "engineering-mastery:v1:progress";
export function readStorage(storage: Pick<Storage, "getItem">) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    return {
      state: raw ? validateState(JSON.parse(raw)) : emptyState(),
      error: "",
      locked: false,
    };
  } catch {
    return {
      state: emptyState(),
      error:
        "Your saved progress could not be read. It has been kept untouched. Download a recovery copy, then restore a valid backup or reset.",
      locked: true,
    };
  }
}
interface Store {
  state: TrackerState;
  mutate: (f: (draft: TrackerState) => void) => void;
  replace: (s: TrackerState) => boolean;
  error: string;
  locked: boolean;
  exportBackup: () => void;
  recover: () => void;
  retry: () => void;
}
const Context = createContext<Store | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
  const [loaded] = useState(() => {
    try {
      return readStorage(localStorage);
    } catch {
      return {
        state: emptyState(),
        error:
          "Your browser is blocking local storage. Enable storage access, or use backups to keep your work.",
        locked: false,
      };
    }
  });
  const [state, setState] = useState(loaded.state);
  const ref = useRef(state);
  const [error, setError] = useState(loaded.error);
  const [locked, setLocked] = useState(loaded.locked);
  const commit = (next: TrackerState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setError("");
      setLocked(false);
      ref.current = next;
      setState(next);
      return true;
    } catch {
      setError(
        "Changes are held in this tab, but browser storage could not save them. Export a backup before closing.",
      );
      if (!locked) {
        ref.current = next;
        setState(next);
      }
      return false;
    }
  };
  const mutate = (f: (s: TrackerState) => void) => {
    if (locked) return;
    const next = structuredClone(ref.current);
    f(next);
    next.updatedAt = new Date().toISOString();
    commit(next);
  };
  useEffect(() => {
    const sync = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      const x = readStorage(localStorage);
      ref.current = x.state;
      setState(x.state);
      setError(x.error);
      setLocked(x.locked);
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () =>
      (document.documentElement.dataset.theme =
        state.profile.theme === "dark" ||
        (state.profile.theme === "system" && media.matches)
          ? "dark"
          : "light");
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [state.profile.theme]);
  return (
    <Context.Provider
      value={{
        state,
        mutate,
        replace: commit,
        error,
        locked,
        retry: () => commit(ref.current),
        exportBackup: () =>
          download(
            `engineering-mastery-${localDate()}.json`,
            JSON.stringify(makeBackup(ref.current), null, 2),
          ),
        recover: () => {
          try {
            download(
              "engineering-mastery-recovery.json",
              localStorage.getItem(STORAGE_KEY) || "{}",
            );
          } catch {
            setError(
              "Your browser is blocking access to local storage. Enable storage access to recover the original record.",
            );
          }
        },
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useStore() {
  const value = useContext(Context);
  if (!value) throw new Error("Missing StoreProvider");
  return value;
}
