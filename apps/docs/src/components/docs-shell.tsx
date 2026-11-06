import { Kbd } from "@dixy-ui/react";
import { DocsDisclosure } from "./docs-controls";
import { TextField, Button } from "@dixy-ui/react";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Boxes,
  ChevronRight,
  Command,
  Layers,
  Moon,
  PanelLeft,
  Palette,
  Search,
  Sun,
  X,
} from "lucide-react";
import { Dialog, Theme } from "@dixy-ui/react";
import { componentRegistry } from "../registry/components";
import { DixyMark } from "./dixy-mark";
import { useAppAppearance } from "./app-appearance-provider";

const AppearanceContext = createContext<"light" | "dark">("light");
export const useDocsAppearance = () => useContext(AppearanceContext);

export const navigation = [
  {
    title: "Start here",
    items: [
      { label: "Introduction", path: "/" },
      { label: "Installation", path: "/docs/installation" },
      { label: "Learning the system", path: "/docs/learning" },
    ],
  },
  {
    title: "Foundations",
    items: [
      { label: "Theming", path: "/docs/foundations/theming" },
      { label: "Color", path: "/docs/foundations/color" },
      { label: "Typography", path: "/docs/foundations/typography" },
      { label: "Icons", path: "/docs/foundations/icons" },
      { label: "Spacing", path: "/docs/foundations/spacing" },
      { label: "Sizing & layout", path: "/docs/foundations/sizing-layout" },
      { label: "Radius, border & shadow", path: "/docs/foundations/surfaces" },
      { label: "Shape", path: "/docs/foundations/shape" },
      { label: "Materials", path: "/docs/foundations/materials" },
      { label: "Emotion", path: "/docs/foundations/emotion" },
      { label: "Haptics", path: "/docs/foundations/haptics" },
      { label: "Motion", path: "/docs/foundations/motion" },
    ],
  },
  {
    title: "Components",
    items: Object.entries(componentRegistry).map(([slug, entry]) => ({
      label: entry.title,
      path: `/docs/components/${slug}`,
    })),
  },
  {
    title: "Resources",
    items: [{ label: "Accessibility", path: "/docs/accessibility" }],
  },
];

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useLocation({ select: (location) => location.pathname });
  return (
    <>
      <div className="sidebar-heading">
        <Link
          to="/"
          onClick={onNavigate}
          className="wordmark"
          aria-label="Dixy UI home"
        >
          dixy<span>UI</span>
        </Link>
        <span className="version-label">0.1 alpha</span>
      </div>
      <nav aria-label="Documentation">
        {navigation.map((group) => (
          <DocsDisclosure
            key={group.title}
            defaultOpen
            className="nav-group"
            summary={
              <>
                {group.title}
                <ChevronRight size={12} />
              </>
            }
          >
            <div>
              {group.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onNavigate}
                  className={`nav-link ${pathname === item.path ? "is-active" : ""}`}
                  aria-current={pathname === item.path ? "page" : undefined}
                >
                  <span>{item.label}</span>
                  {group.title === "Components" && <span className="nav-dot" />}
                </Link>
              ))}
            </div>
          </DocsDisclosure>
        ))}
      </nav>
      <Link to="/docs/learning" onClick={onNavigate} className="sidebar-note">
        <div>
          <BookOpen size={15} />
          <span>Built to be understood.</span>
        </div>
        <p>Learn the thinking behind the details.</p>
        <ArrowUpRight size={15} />
      </Link>
      <a
        className="base-credit"
        href="https://base-ui.com/react/overview/quick-start"
        target="_blank"
        rel="noreferrer"
      >
        <span className="status-dot" />
        Built on Base UI
        <ArrowUpRight size={12} />
      </a>
    </>
  );
}

function DocSearch({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();
  const results = navigation
    .flatMap((group) =>
      group.items.map((item) => ({ ...item, group: group.title })),
    )
    .filter((item) =>
      `${item.label} ${item.group}`.toLowerCase().includes(query.toLowerCase()),
    );
  function go(path: string) {
    setOpen(false);
    void navigate({ to: path });
  }
  useEffect(() => {
    if (!open) {
      setQuery("");
      setSelected(0);
    }
  }, [open]);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Viewport>
          <Dialog.Popup className="search-popup">
            <Dialog.Title className="sr-only">
              Search documentation
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Search foundations, components, and guides. Use arrow keys to
              choose a result and Enter to open it.
            </Dialog.Description>
            <div className="search-input-wrap">
              <Search size={19} />
              <TextField
                aria-label="Search documentation"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded="true"
                aria-controls="search-results"
                aria-activedescendant={
                  results[selected] ? `search-result-${selected}` : undefined
                }
                placeholder="What are you looking for?"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSelected(0);
                }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                    event.preventDefault();
                    setSelected(
                      (value) =>
                        (value +
                          (event.key === "ArrowDown" ? 1 : -1) +
                          results.length) %
                        Math.max(1, results.length),
                    );
                  }
                  if (event.key === "Enter" && results[selected]) {
                    event.preventDefault();
                    go(results[selected]!.path);
                  }
                }}
              />
              <Dialog.Close className="chrome-button" aria-label="Close search">
                <X size={16} />
              </Dialog.Close>
            </div>
            <div
              id="search-results"
              role="listbox"
              aria-label="Search results"
              className="search-results"
            >
              {results.map((item, index) => (
                <div
                  key={item.path}
                  id={`search-result-${index}`}
                  role="option"
                  aria-selected={selected === index}
                  className={selected === index ? "selected" : ""}
                  onMouseMove={() => setSelected(index)}
                  onClick={() => go(item.path)}
                >
                  <span>
                    {item.label}
                    <small>{item.group}</small>
                  </span>
                  <ArrowUpRight size={16} />
                </div>
              ))}
              {results.length === 0 && (
                <p className="search-empty" role="status">
                  No pages found. Try “button” or “color”.
                </p>
              )}
            </div>
            <div className="search-hint">
              <span>↑ ↓ to explore</span>
              <span>↵ to open</span>
              <span>esc to close</span>
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function DocsShell({ children }: { children: ReactNode }) {
  const { appearance, setAppearance } = useAppAppearance();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobile, setMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const pathname = useLocation({ select: (location) => location.pathname });
  const current = navigation
    .flatMap((group) =>
      group.items.map((item) => ({ ...item, group: group.title })),
    )
    .find((item) => item.path === pathname);
  const category =
    current?.group === "Foundations"
      ? "foundations"
      : current?.group === "Components"
        ? "components"
        : "overview";
  useEffect(() => {
    const media = matchMedia("(max-width: 760px)");
    const update = () => {
      setMobile(media.matches);
      if (!media.matches) setMobileOpen(false);
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);
  function toggleSidebar() {
    if (mobile) {
      setMobileOpen(true);
      return;
    }
    if (sidebarOpen && sidebarRef.current?.contains(document.activeElement))
      toggleRef.current?.focus();
    setSidebarOpen(!sidebarOpen);
  }
  return (
    <AppearanceContext.Provider value={appearance}>
      <Theme
        appearance={appearance}
        accentColor="purple"
        className="docs-app"
        data-sidebar={sidebarOpen ? "open" : "closed"}
      >
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <aside className="icon-rail" aria-label="Sections">
          <Link to="/" className="brand-mark" aria-label="Dixy UI home">
            <DixyMark size={30} />
          </Link>
          <div className="rail-links">
            <Link
              to="/"
              aria-label="Overview"
              className={category === "overview" ? "selected" : ""}
              aria-current={category === "overview" ? "location" : undefined}
            >
              <BookOpen size={20} />
            </Link>
            <Link
              to="/docs/components/$component"
              params={{ component: "button" }}
              aria-label="Components"
              className={category === "components" ? "selected" : ""}
              aria-current={category === "components" ? "location" : undefined}
            >
              <Boxes size={20} />
            </Link>
            <Link
              to="/docs/foundations/$foundation"
              params={{ foundation: "color" }}
              aria-label="Foundations"
              className={category === "foundations" ? "selected" : ""}
              aria-current={category === "foundations" ? "location" : undefined}
            >
              <Palette size={20} />
            </Link>
          </div>
          <div className="rail-bottom">
            <span className="rail-line" />
            <Button
              variant="ghost"
              color="neutral"
              size="sm"
              aria-label={`Switch to ${appearance === "light" ? "dark" : "light"} theme`}
              title="Toggle appearance"
              onClick={() =>
                setAppearance(appearance === "light" ? "dark" : "light")
              }
            >
              {appearance === "light" ? <Moon size={19} /> : <Sun size={19} />}
            </Button>
            <span className="rail-monogram" aria-hidden="true">
              d.
            </span>
          </div>
        </aside>
        <header className="topbar">
          <div className="toolbar-leading">
            <Link
              to="/"
              className="chrome-button"
              aria-label="Back to overview"
            >
              <ArrowLeft size={16} />
            </Link>
            <Button
              variant="ghost"
              color="neutral"
              size="sm"
              ref={toggleRef}
              className="chrome-button"
              onClick={toggleSidebar}
              aria-label={
                mobile
                  ? "Open navigation"
                  : sidebarOpen
                    ? "Collapse navigation"
                    : "Expand navigation"
              }
              aria-expanded={mobile ? mobileOpen : sidebarOpen}
              aria-controls={mobile ? "mobile-navigation" : "docs-navigation"}
            >
              <PanelLeft size={17} />
            </Button>
            <span className="toolbar-divider" />
          </div>
          <div className="breadcrumbs">
            <span>Documentation</span>
            <ChevronRight size={12} />
            <span className="breadcrumb-current">
              {current?.label ?? "Page"}
            </span>
          </div>
          <Button
            variant="ghost"
            color="neutral"
            size="sm"
            className="search-trigger"
            aria-label="Search documentation"
            onClick={() => setSearchOpen(true)}
          >
            <Search size={14} />
            <span>Search documentation</span>
            <Kbd>
              <Command size={10} />K
            </Kbd>
          </Button>
          <span className="header-built">
            <Layers size={13} /> Made with care
          </span>
        </header>
        <div className="workspace">
          <aside
            id="docs-navigation"
            ref={sidebarRef}
            className="sidebar"
            inert={mobile || !sidebarOpen}
            aria-hidden={mobile || !sidebarOpen}
          >
            <div className="sidebar-inner">
              <Navigation />
            </div>
          </aside>
          <main id="main-content" ref={mainRef} tabIndex={-1}>
            {children}
            <footer className="site-footer">
              <span>
                <DixyMark size={13} /> Dixy UI
              </span>
              <span>Considered details. Open possibilities.</span>
              <span>Built in the open · 2026</span>
            </footer>
          </main>
        </div>
        <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
          <Dialog.Portal>
            <Dialog.Backdrop />
            <Dialog.Viewport className="mobile-nav-viewport">
              <Dialog.Popup
                id="mobile-navigation"
                className="mobile-nav"
                finalFocus={toggleRef}
              >
                <Dialog.Title className="sr-only">
                  Documentation navigation
                </Dialog.Title>
                <Dialog.Description className="sr-only">
                  Browse Dixy documentation.
                </Dialog.Description>
                <Dialog.Close
                  className="mobile-nav-close chrome-button"
                  aria-label="Close navigation"
                >
                  <X size={18} />
                </Dialog.Close>
                <Navigation onNavigate={() => setMobileOpen(false)} />
              </Dialog.Popup>
            </Dialog.Viewport>
          </Dialog.Portal>
        </Dialog.Root>
        <DocSearch open={searchOpen} setOpen={setSearchOpen} />
      </Theme>
    </AppearanceContext.Provider>
  );
}
