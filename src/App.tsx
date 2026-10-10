import { useEffect, useState, useRef } from "react";
import {
  NavLink,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  LayoutDashboard,
  Network,
  FlaskConical,
  CalendarDays,
  RotateCcw,
  Library,
  Settings,
  BriefcaseBusiness,
  Search,
  Menu,
  X,
  ArrowUpRight,
  ShieldCheck,
  Command,
  ChevronRight,
  Download,
} from "lucide-react";
import { useStore } from "./storage/store";
import { reviewItems } from "./domain/progress";
import { Overview } from "./features/Overview";
import { CurriculumBrowser, UnitDetail } from "./features/Learning";
import { Projects, ProjectDetail } from "./features/Projects";
import { Planner, Reviews, Resources } from "./features/Planning";
import { Preferences } from "./features/Preferences";
import { Applications } from "./features/Applications";
import { Empty } from "./components/ui";
const nav = [
  { to: "/", name: "Overview", icon: LayoutDashboard },
  { to: "/learn", name: "My roadmap", icon: Network },
  { to: "/projects", name: "Project lab", icon: FlaskConical },
  { to: "/plan", name: "Study planner", icon: CalendarDays },
  { to: "/reviews", name: "Review queue", icon: RotateCcw },
  { to: "/resources", name: "Resource library", icon: Library },
];
export default function App() {
  const { state, error, locked, recover, exportBackup, retry } = useStore();
  const [menu, setMenu] = useState(false);
  const [q, setQ] = useState("");
  const [mobile, setMobile] = useState(
    () => window.matchMedia("(max-width: 760px)").matches,
  );
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const due = reviewItems(state).filter((r) => r.bucket === "due").length;
  useEffect(() => {
    setMenu(false);
    window.scrollTo(0, 0);
    const title =
      [
        ...nav,
        { to: "/applications", name: "Applications" },
        { to: "/settings", name: "Settings" },
      ].find((n) =>
        n.to === "/"
          ? location.pathname === "/"
          : location.pathname.startsWith(n.to),
      )?.name || "Engineering Mastery";
    document.title = `${title} · Engineering Mastery`;
  }, [location.pathname]);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 760px)");
    const change = () => setMobile(media.matches);
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    if (!menu || !mobile) return;
    const previous = document.activeElement as HTMLElement;
    const nav = navRef.current;
    const candidates = () =>
      Array.from(nav?.querySelectorAll<HTMLElement>("a,button") || []).filter(
        (x) => x.offsetParent !== null,
      );
    candidates()[0]?.focus();
    const trap = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        menuRef.current?.focus();
      }
      if (e.key === "Tab") {
        const list = candidates();
        if (e.shiftKey && document.activeElement === list[0]) {
          e.preventDefault();
          list.at(-1)?.focus();
        } else if (!e.shiftKey && document.activeElement === list.at(-1)) {
          e.preventDefault();
          list[0]?.focus();
        }
      }
    };
    document.addEventListener("keydown", trap);
    return () => {
      document.removeEventListener("keydown", trap);
      if (previous?.isConnected) previous.focus();
    };
  }, [menu, mobile]);
  return (
    <div className="app-shell">
      <a
        href="#main"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main")?.focus();
        }}
      >
        Skip to content
      </a>
      {menu && (
        <button
          className="drawer-backdrop"
          onClick={() => setMenu(false)}
          aria-label="Close navigation"
        />
      )}
      <aside
        ref={navRef}
        inert={mobile && !menu}
        className={`sidebar ${menu ? "open" : ""}`}
      >
        <Link to="/" className="brand">
          <span className="brand-symbol">
            m<span>.</span>
          </span>
          <span>
            engineering
            <strong>
              mastery<span className="brand-dot">.</span>
            </strong>
          </span>
        </Link>
        <button
          className="mobile-close icon-button"
          onClick={() => setMenu(false)}
          aria-label="Close navigation"
        >
          <X size={20} />
        </button>
        <div className="workspace-label">PERSONAL WORKSPACE</div>
        <nav aria-label="Main navigation">
          {nav.map((n) => (
            <NavLink to={n.to} end={n.to === "/"} key={n.to}>
              <n.icon size={18} />
              <span>{n.name}</span>
              {n.to === "/reviews" && due > 0 && (
                <span className="nav-count">{due}</span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="workspace-label career-label">THE NEXT CHAPTER</div>
        <nav aria-label="Career">
          <NavLink to="/applications">
            <BriefcaseBusiness size={18} />
            <span>Applications</span>
          </NavLink>
        </nav>
        <div className="sidebar-bottom">
          <div className="goal-card">
            <span className="goal-kicker">
              THE BIG PICTURE <ArrowUpRight size={15} />
            </span>
            <strong>
              ₹40 LPA<span> & beyond</span>
            </strong>
            <p>
              Build the skills.
              <br />
              Let your work speak.
            </p>
            <div className="goal-line" />
          </div>
          <NavLink className="settings-link" to="/settings">
            <Settings size={18} /> Settings & backups
          </NavLink>
          <div className="profile">
            <span className="avatar">VS</span>
            <span>
              <strong>Viraj’s workspace</strong>
              <small>
                <i />
                Stored on this device
              </small>
            </span>
            <ShieldCheck size={16} />
          </div>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              ref={menuRef}
              className="icon-button mobile-menu"
              aria-label="Open navigation"
              onClick={() => setMenu(true)}
            >
              <Menu size={21} />
            </button>
            <span>My workspace</span>
            <ChevronRight size={13} />
            <strong>
              {location.pathname.startsWith("/learn")
                ? "My roadmap"
                : location.pathname.startsWith("/projects")
                  ? "Project lab"
                  : [
                      ...nav,
                      { to: "/applications", name: "Applications" },
                      { to: "/settings", name: "Settings" },
                    ].find((n) => n.to === location.pathname)?.name ||
                    "Overview"}
            </strong>
          </div>
          <form
            className="global-search"
            onSubmit={(e) => {
              e.preventDefault();
              navigate(`/learn?q=${encodeURIComponent(q)}`);
            }}
          >
            <Search size={16} />
            <input
              aria-label="Search the roadmap"
              placeholder="Find a skill, topic, or unit…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button type="submit" aria-label="Search">
              <Command size={13} />
            </button>
          </form>
          <Link
            to="/settings"
            className="top-avatar"
            aria-label="Open settings"
          >
            VS
          </Link>
        </header>
        <main id="main" tabIndex={-1}>
          {error && (
            <div role="alert" className="storage-warning">
              <p>{error}</p>
              <button onClick={locked ? recover : exportBackup}>
                <Download size={15} />
                {locked ? "Download recovery copy" : "Export unsaved progress"}
              </button>
              {!locked && <button onClick={retry}>Retry saving</button>}
              <Link to="/settings">Restore or reset</Link>
            </div>
          )}
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/learn" element={<CurriculumBrowser />} />
            <Route path="/learn/:unitId" element={<UnitDetail />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:projectId" element={<ProjectDetail />} />
            <Route path="/plan" element={<Planner />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/settings" element={<Preferences />} />
            <Route
              path="*"
              element={
                <Empty
                  title="This page isn’t in your roadmap."
                  action={
                    <Link to="/" className="button">
                      Back to overview
                    </Link>
                  }
                >
                  Your progress is safe. Return to your workspace to continue.
                </Empty>
              }
            />
          </Routes>
          <footer className="page-footer">
            <span>Small steps. Real understanding. Lasting progress.</span>
            <span>
              <ShieldCheck size={13} />
              Private by design
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}
