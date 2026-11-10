import {
  Button,
  Dialog,
  Kbd,
  Popover,
  TextField,
  Theme,
  Toggle,
  ToggleGroup,
} from "@dixy-ui/react";
import { DocsDisclosure } from "./docs-controls";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  Command,
  Moon,
  PanelLeft,
  Search,
  Sun,
  X,
} from "lucide-react";
import { skinCatalog } from "@dixy-ui/themes/catalog";
import { componentRegistry } from "../registry/components";
import { DixyMark } from "./dixy-mark";
import { useAppAppearance } from "./app-appearance-provider";
import { useDocsTheme } from "./use-docs-theme";

const AppearanceContext = createContext<"light" | "dark">("light");
export const useDocsAppearance = () => useContext(AppearanceContext);

interface NavItem {
  label: string;
  path: string;
  category?: string;
}

const componentItems: NavItem[] = Object.entries(componentRegistry).map(
  ([slug, entry]) => ({
    label: entry.title,
    path: `/docs/components/${slug}`,
    category: entry.category,
  }),
);

export const navigation: { title: string; items: NavItem[] }[] = [
  {
    title: "Start here",
    items: [
      { label: "Introduction", path: "/" },
      { label: "Installation", path: "/docs/installation" },
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
  { title: "Components", items: componentItems },
  {
    title: "Resources",
    items: [
      { label: "Accessibility", path: "/docs/accessibility" },
      { label: "Theme playground", path: "/playground" },
    ],
  },
];

const original = {
  id: "none",
  name: "Original Dixy",
  description: "Warm and expressive. The default.",
  swatches: ["#7043ce", "#c9b8f0", "#fcfaf7"],
} as const;
const docsThemes = [original, ...skinCatalog];
const themeName = (id: string) =>
  docsThemes.find((theme) => theme.id === id)?.name ?? original.name;

function swatchStyle(swatches: readonly string[]) {
  return {
    "--swatch-a": swatches[0],
    "--swatch-b": swatches[1],
    "--swatch-c": swatches[2],
  } as CSSProperties;
}
function Swatch({ id }: { id: string }) {
  const theme = docsThemes.find((item) => item.id === id) ?? original;
  return (
    <span
      className="theme-swatch"
      aria-hidden="true"
      style={swatchStyle(theme.swatches)}
    >
      <i />
      <i />
      <i />
    </span>
  );
}

function NavLinks({
  items,
  pathname,
  onNavigate,
}: {
  items: NavItem[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return items.map((item) => (
    <Link
      key={item.path}
      to={item.path}
      onClick={onNavigate}
      className={`nav-link ${pathname === item.path ? "is-active" : ""}`}
      aria-current={pathname === item.path ? "page" : undefined}
    >
      <span>{item.label}</span>
    </Link>
  ));
}

function Navigation({
  onNavigate,
  onOpenTheme,
}: {
  onNavigate?: () => void;
  onOpenTheme?: () => void;
}) {
  const pathname = useLocation({ select: (location) => location.pathname });
  const { docsTheme } = useAppAppearance();
  const [query, setQuery] = useState("");
  const match = (item: NavItem) =>
    item.label.toLowerCase().includes(query.trim().toLowerCase());
  const groups = navigation
    .map((group) => ({ ...group, visible: group.items.filter(match) }))
    .filter((group) => group.visible.length > 0);
  return (
    <>
      <label className="nav-filter">
        <Search size={14} aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter pages"
          aria-label="Filter pages"
          aria-controls="docs-nav-list"
        />
      </label>
      <nav aria-label="Documentation" id="docs-nav-list">
        {groups.map((group) => (
          <DocsDisclosure
            key={group.title}
            defaultOpen
            className="nav-group"
            summary={
              <>
                {group.title}
                <span className="nav-count">{group.items.length}</span>
                <ChevronRight size={12} />
              </>
            }
          >
            <div>
              {group.title === "Components" ? (
                [...new Set(group.visible.map((item) => item.category))].map(
                  (category) => (
                    <div key={category} className="nav-subgroup">
                      <span className="nav-subheading">{category}</span>
                      <NavLinks
                        items={group.visible.filter(
                          (item) => item.category === category,
                        )}
                        pathname={pathname}
                        onNavigate={onNavigate}
                      />
                    </div>
                  ),
                )
              ) : (
                <NavLinks
                  items={group.visible}
                  pathname={pathname}
                  onNavigate={onNavigate}
                />
              )}
            </div>
          </DocsDisclosure>
        ))}
        {groups.length === 0 && (
          <p className="nav-empty" role="status">
            No pages match “{query}”.
          </p>
        )}
      </nav>
      {onOpenTheme && (
        <button type="button" className="nav-theme-card" onClick={onOpenTheme}>
          <Swatch id={docsTheme.skin} />
          <span>
            <strong>{themeName(docsTheme.skin)}</strong>
            {docsTheme.scope === "all"
              ? "Applied to docs and previews"
              : "Applied to previews only"}
          </span>
        </button>
      )}
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

function ThemeMenu({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { appearancePreference, setAppearancePreference } = useAppAppearance();
  const { docsTheme, setDocsTheme, error } = useDocsTheme();
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        className="theme-trigger"
        aria-label={`Docs theme: ${themeName(docsTheme.skin)}`}
      >
        <Swatch id={docsTheme.skin} />
        <span className="theme-trigger-name">{themeName(docsTheme.skin)}</span>
        <ChevronDown size={13} aria-hidden="true" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner side="bottom" align="end" sideOffset={8}>
          <Popover.Popup className="theme-menu">
            <Popover.Title className="theme-menu-label">Theme</Popover.Title>
            <ToggleGroup
              className="theme-menu-list"
              aria-label="Docs theme"
              value={[docsTheme.skin]}
              onValueChange={(value) =>
                value[0] && setDocsTheme({ skin: value[0] })
              }
            >
              {docsThemes.map((theme) => (
                <Toggle
                  key={theme.id}
                  value={theme.id}
                  variant="ghost"
                  color="neutral"
                  className="theme-menu-option"
                >
                  <Swatch id={theme.id} />
                  <span>
                    {theme.name}
                    <small>{theme.description}</small>
                  </span>
                </Toggle>
              ))}
            </ToggleGroup>
            {error && (
              <p className="theme-menu-error" role="alert">
                {error}
              </p>
            )}
            <span className="theme-menu-label">Appearance</span>
            <ToggleGroup
              segmented
              aria-label="Appearance"
              value={[appearancePreference]}
              onValueChange={(value) =>
                value[0] &&
                setAppearancePreference(value[0] as "system" | "light" | "dark")
              }
            >
              <Toggle value="system">System</Toggle>
              <Toggle value="light">Light</Toggle>
              <Toggle value="dark">Dark</Toggle>
            </ToggleGroup>
            <span className="theme-menu-label">Apply to</span>
            <ToggleGroup
              segmented
              aria-label="Apply theme to"
              value={[docsTheme.scope]}
              onValueChange={(value) =>
                value[0] &&
                setDocsTheme({ scope: value[0] as "all" | "previews" })
              }
            >
              <Toggle value="all">Whole docs</Toggle>
              <Toggle value="previews">Previews only</Toggle>
            </ToggleGroup>
            <Popover.Description className="theme-menu-note">
              Remembered on this device, so pages open in your theme.
            </Popover.Description>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
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
  const { shellProps } = useDocsTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobile, setMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const pathname = useLocation({ select: (location) => location.pathname });
  const current = navigation
    .flatMap((group) =>
      group.items.map((item) => ({ ...item, group: group.title })),
    )
    .find((item) => item.path === pathname);
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
        {...shellProps}
        className="docs-app"
        data-sidebar={sidebarOpen ? "open" : "closed"}
      >
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <header className="topbar">
          <div className="toolbar-leading">
            <Link to="/" className="topbar-brand" aria-label="Dixy UI home">
              <DixyMark size={26} />
              <span className="wordmark">
                dixy<span>UI</span>
              </span>
              <span className="version-label">0.1 beta</span>
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
            <span>{current?.group ?? "Documentation"}</span>
            <ChevronRight size={12} />
            <span className="breadcrumb-current">
              {current?.label ?? "Page"}
            </span>
          </div>
          <div className="topbar-tools">
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
            <ThemeMenu open={themeOpen} setOpen={setThemeOpen} />
            <Button
              variant="ghost"
              color="neutral"
              size="sm"
              className="chrome-button appearance-button"
              aria-label={`Switch to ${appearance === "light" ? "dark" : "light"} appearance`}
              onClick={() =>
                setAppearance(appearance === "light" ? "dark" : "light")
              }
            >
              {appearance === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </Button>
          </div>
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
              <Navigation onOpenTheme={() => setThemeOpen(true)} />
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
