import {
  ThemeInspectorAccordion,
  ThemeInspectorSection,
} from "./theme-inspector-accordion";
import { ThemeRecipeMixer } from "./theme-recipe-mixer";
import { WorkspaceScene } from "./theme-workspace-scene";
import { DocsSlider } from "./docs-controls";
import { DocsSelect } from "./docs-controls";
import {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Brush,
  Check,
  Code2,
  Columns2,
  Copy,
  Download,
  Layers,
  LayoutDashboard,
  LayoutGrid,
  Link2,
  Mail,
  Moon,
  Music2,
  Palette,
  Pause,
  Play,
  RotateCcw,
  Shuffle,
  Sparkles,
  Sun,
  ToggleRight,
  Upload,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  Badge,
  Button,
  Dialog,
  Heading,
  IconButton,
  Tabs,
  Text,
  Textarea,
  TextField,
  Theme,
  Toggle,
  ToggleGroup,
} from "@dixy-ui/react";
import {
  InspectorField,
  InspectorGroup,
  Segmented,
} from "./theme-inspector-parts";
import {
  actionColors,
  colorFamilies,
  colorPalettes,
  colorSteps,
  contrastRatio,
  neutralColorFamilies,
  radiusPresets,
  spacingDensity,
  toOklch,
} from "@dixy-ui/tokens";
import { CodeBlock } from "./code-block";
import { DixyMark } from "./dixy-mark";
const ThemeComponentGallery = lazy(() =>
  import("./theme-component-gallery").then((m) => ({
    default: m.ThemeComponentGallery,
  })),
);
import {
  defaultThemePreset,
  skinCatalog,
  skinThemePreset,
  themeCSSCode,
  parseThemePreset,
  playgroundFonts,
  playgroundThemeProps,
  presetPalette,
  serializeThemePreset,
  themeReactCode,
  themeSeed,
  exportThemeDocument,
  editableThemeDocument,
  shuffleTheme,
  themeContrast,
  type ThemePreset,
} from "../lib/theme-playground";
import { PreviewVoiceContext, previewVoice } from "./theme-preview-voice";
import "../styles/theme-playground.css";
import "../styles/theme-skins.css";
import "../styles/theme-inspector.css";
import { prepareSkin } from "../lib/theme-skin-catalogue";
const PlayerScene = lazy(() => import("./theme-player-scene"));
const StateScene = lazy(() => import("./theme-state-scene"));
const EmailScene = lazy(() => import("./theme-email-scene"));
const DashboardScene = lazy(() => import("./theme-dashboard-scene"));
const CompareScene = lazy(() => import("./theme-compare-scene"));

/* Scenes in the preview tab bar; null draws a quiet divider between groups. */
const previewScenes: readonly ({
  value: string;
  label: string;
  icon: LucideIcon;
} | null)[] = [
  { value: "workspace", label: "Overview", icon: LayoutGrid },
  { value: "library", label: "Components", icon: Boxes },
  null,
  { value: "email", label: "Email", icon: Mail },
  { value: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { value: "player", label: "Player", icon: Music2 },
  null,
  { value: "states", label: "States", icon: ToggleRight },
  { value: "compare", label: "Compare", icon: Columns2 },
  { value: "tokens", label: "Surfaces", icon: Layers },
];

/** Scene and inspector tab ids the route accepts in the URL. */
export const previewSceneIds = previewScenes.flatMap((scene) =>
  scene ? [scene.value] : [],
);
export const defaultPreviewScene = "workspace";

/* One question per tab: which theme, how it looks, how it behaves, how to take it. */
const inspectorTabs = [
  { value: "theme", label: "Theme", icon: Palette },
  { value: "style", label: "Style", icon: Brush },
  { value: "character", label: "Character", icon: Sparkles },
  { value: "export", label: "Export", icon: Code2 },
] as const;
export const inspectorTabIds: readonly string[] = inspectorTabs.map(
  (tab) => tab.value,
);
export const defaultInspectorTab = "theme";

const radiusLabels: Record<ThemePreset["radius"], string> = {
  none: "None",
  sm: "S",
  md: "M",
  lg: "L",
  full: "Full",
};

const finishOptions = [
  ["inherit", "Skin"],
  ["matte", "Matte"],
  ["glossy", "Enamel"],
  ["soft", "Clay"],
  ["metal", "Metal"],
  ["paper", "Paper"],
] as const;

/* Preset keys each inspector tab owns, used for the "edited" dots and count. */
const tabKeys = {
  theme: ["radius", "neutralColor"],
  style: [
    "material",
    "bodyFont",
    "headingFont",
    "depth",
    "relief",
    "border",
    "density",
    "shape",
  ],
  // dir, motion and effects are viewer preferences: they survive starter
  // switches and Reset all, so they never count as edits to the theme.
  character: ["ornament"],
} as const satisfies Record<string, readonly (keyof ThemePreset)[]>;

function countChanges(preset: ThemePreset) {
  const result = { theme: 0, style: 0, character: 0, total: 0 };
  let base: ThemePreset;
  try {
    base = skinThemePreset(preset.skin);
  } catch {
    return result;
  }
  for (const tab of ["theme", "style", "character"] as const)
    for (const key of tabKeys[tab])
      if (preset[key] !== base[key]) result[tab]++;
  // The accent is one decision, whether it is a named family or an OKLCH seed.
  if (
    preset.customAccent !== base.customAccent ||
    (preset.customAccent
      ? (["hue", "chroma", "lightness"] as const).some(
          (key) => preset[key] !== base[key],
        )
      : preset.accentColor !== base.accentColor)
  )
    result.theme++;
  if (preset.document) {
    const now = editableThemeDocument(preset);
    const was = editableThemeDocument(base);
    const same = (a: unknown, b: unknown) =>
      JSON.stringify(a) === JSON.stringify(b);
    for (const recipe of ["material", "frame"] as const)
      if (!same(now.recipes[recipe], was.recipes[recipe])) result.style++;
    for (const key of Object.keys(
      now.character,
    ) as (keyof typeof now.character)[])
      if (!same(now.character[key], was.character[key])) result.character++;
  }
  result.total = result.theme + result.style + result.character;
  return result;
}

function swatchStyle(colors: readonly string[]) {
  return {
    "--swatch-a": colors[0],
    "--swatch-b": colors[1] ?? colors[0],
    "--swatch-c": colors[2] ?? colors[0],
  } as CSSProperties;
}

function Control({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="theme-control">
      <span>{label}</span>
      {children}
    </label>
  );
}

function jumpToFoundationSection(id: string) {
  const section = document.getElementById(id);
  section?.scrollIntoView({ behavior: "auto", block: "start" });
  section?.focus({ preventScroll: true });
}

function SurfacePreview() {
  return (
    <section
      className="theme-token-preview"
      aria-labelledby="theme-token-heading"
    >
      <div>
        <Heading as="h2" variant="title.md" id="theme-token-heading">
          Surfaces and borders
        </Heading>
        <Text size="sm" tone="muted">
          Surface hierarchy and stroke contrast are separate decisions.
        </Text>
      </div>
      <div className="theme-surface-specimens">
        {(
          [
            ["canvas", "Canvas", "The page behind your content"],
            ["surface-sunken", "Sunken", "Recessed areas and wells"],
            ["surface", "Surface", "Grouped content"],
            ["surface-raised", "Raised", "Cards and floating content"],
          ] as const
        ).map(([token, name, detail]) => (
          <div
            key={token}
            className="theme-surface-specimen"
            style={{ background: `var(--dixy-color-background-${token})` }}
          >
            <strong>{name}</strong>
            <Text size="sm" tone="muted">
              {detail}
            </Text>
            <code>background.{token.replaceAll("-", ".")}</code>
          </div>
        ))}
      </div>
      <div className="theme-border-specimens">
        {[
          ["subtle", "Decorative dividers and panel edges"],
          ["default", "Identifiable control boundaries"],
          ["strong", "Extra emphasis · fixed 2px"],
        ].map(([role, detail]) => (
          <div key={role}>
            <span style={{ borderTop: `var(--dixy-border-${role})` }} />
            <strong>{role}</strong>
            <Text size="sm" tone="muted">
              {detail}
            </Text>
          </div>
        ))}
      </div>
      <Text size="sm" tone="muted">
        Subtle borders are decorative. Default borders retain the tested 3:1
        contrast for controls. Stroke width does not change the color role or
        the focus ring.
      </Text>
    </section>
  );
}

export function ThemePlayground({
  preset,
  onChange: onCommit,
  warning,
  view: previewView,
  onViewChange: setPreviewView,
  panel: panelTab,
  onPanelChange: setPanelTab,
}: {
  preset: ThemePreset;
  onChange: (preset: ThemePreset) => void;
  warning: string;
  /** Preview scene; the route keeps it in `?view=`. */
  view: string;
  onViewChange: (view: string) => void;
  /** Inspector tab; the route keeps it in `?panel=`. */
  panel: string;
  onPanelChange: (panel: string) => void;
}) {
  const [skinLoading, setSkinLoading] = useState(false);
  const [skinError, setSkinError] = useState("");
  const request = useRef(0);
  const past = useRef<ThemePreset[]>([]);
  const future = useRef<ThemePreset[]>([]);
  const drafts = useRef(new Map<string, ThemePreset>());
  const lastHistory = useRef(0);
  const [, refreshHistory] = useState(0);
  const starterSkin = skinCatalog.find((s) => s.id === preset.skin);
  const activeSkin = preset.document
    ? {
        ...(starterSkin ?? { swatches: ["#777", "#aaa", "#eee"] }),
        name: preset.document.name,
        description: "Your own material and frame composition.",
      }
    : starterSkin;
  useEffect(
    () => () => {
      request.current++;
    },
    [],
  );
  function onChange(next: ThemePreset, record = true) {
    const generation = ++request.current;
    setSkinError("");
    async function apply() {
      if (next.skin !== preset.skin || next.document !== preset.document) {
        setSkinLoading(true);
        await prepareSkin(next.skin, next.document);
      }
      if (next.material !== "inherit")
        await import("@dixy-ui/react/materials.css");
      if (request.current !== generation) return;
      if (
        record &&
        serializeThemePreset(next) !== serializeThemePreset(preset)
      ) {
        if (
          next.skin !== preset.skin ||
          Date.now() - lastHistory.current > 350
        ) {
          past.current = [...past.current.slice(-29), preset];
          lastHistory.current = Date.now();
        }
        future.current = [];
      }
      drafts.current.set(preset.document?.id ?? preset.skin, preset);
      drafts.current.set(next.document?.id ?? next.skin, next);
      onCommit(next);
      setSkinLoading(false);
      refreshHistory((n) => n + 1);
    }
    void apply().catch((error) => {
      if (request.current === generation) {
        setSkinLoading(false);
        setSkinError(
          error instanceof Error
            ? error.message
            : "This skin could not load. Try again.",
        );
      }
    });
  }
  // A theme's recommended appearance applies until the person picks light or dark themselves.
  const appearanceChosen = useRef(false);
  function chooseAppearance(appearance: ThemePreset["appearance"]) {
    appearanceChosen.current = true;
    onChange({ ...preset, appearance });
  }
  function selectSkin(id: string) {
    const next = drafts.current.get(id) ?? skinThemePreset(id);
    onChange({
      ...next,
      dir: preset.dir,
      motion: preset.motion,
      effects: preset.effects,
      ...(appearanceChosen.current ? { appearance: preset.appearance } : {}),
    });
  }
  function travel(direction: "undo" | "redo") {
    const from = direction === "undo" ? past : future;
    const to = direction === "undo" ? future : past;
    const next = from.current.pop();
    if (!next) return;
    to.current = [...to.current.slice(-29), preset];
    onChange(next, false);
  }
  const motionPreviewPreset = useRef(preset);
  motionPreviewPreset.current = preset;
  const finishMotionPreview = useRef(() => {});
  finishMotionPreview.current = () =>
    onChange(
      { ...motionPreviewPreset.current, animateOrnaments: false },
      false,
    );
  useEffect(() => {
    if (!preset.animateOrnaments) return;
    const timer = window.setTimeout(() => finishMotionPreview.current(), 20000);
    return () => window.clearTimeout(timer);
  }, [preset.animateOrnaments]);
  function downloadPreset() {
    const url = URL.createObjectURL(
      new Blob([serializeThemePreset(preset)], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "dixy-theme.json";
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const [codeOpen, setCodeOpen] = useState(false);
  const [starterQuery, setStarterQuery] = useState("");
  const [showAllStarters, setShowAllStarters] = useState(false);
  const [codeView, setCodeView] = useState<
    "react" | "preset" | "css" | "document"
  >("react");
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState("");
  const [notice, setNotice] = useState("");
  const [previewKey, setPreviewKey] = useState(0);
  const { error, props, palette } = useMemo(() => {
    try {
      return {
        props: playgroundThemeProps(preset),
        palette: presetPalette(preset),
        error: "",
      };
    } catch (cause) {
      return {
        props: undefined,
        palette: undefined,
        error:
          cause instanceof Error
            ? cause.message
            : "This seed needs adjustment.",
      };
    }
  }, [preset]);
  const exportCode = useMemo(() => {
    if ((!codeOpen && panelTab !== "export") || error) return "";
    return codeView === "react"
      ? themeReactCode(preset)
      : codeView === "css"
        ? themeCSSCode(preset)
        : codeView === "document"
          ? exportThemeDocument(preset)
          : serializeThemePreset(preset);
  }, [codeOpen, panelTab, codeView, preset, error]);
  const codeLanguage =
    codeView === "react" ? "tsx" : codeView === "css" ? "css" : "json";
  const codeFilename =
    codeView === "react"
      ? "dixy-theme.tsx"
      : codeView === "css"
        ? "dixy-theme.css"
        : "dixy-theme.json";
  const changes = useMemo(() => countChanges(preset), [preset]);
  const baselineName =
    skinCatalog.find((skin) => skin.id === preset.skin)?.name ??
    "Original Dixy";
  const accentSwatches = [9, 6, 2].map((step) =>
    toOklch(
      colorPalettes[preset.accentColor].light[
        step as keyof (typeof colorPalettes)["purple"]["light"]
      ],
    ),
  );
  const currentSwatches =
    activeSkin && preset.skin !== "none" ? activeSkin.swatches : accentSwatches;
  const starterOptions = [
    {
      id: "none",
      slug: undefined as string | undefined,
      name: "Original Dixy",
      description: "Dixy’s own neutral starting point.",
      swatches: accentSwatches,
    },
    ...skinCatalog,
  ];
  const query = starterQuery.trim().toLowerCase();
  const visibleStarters = query
    ? starterOptions.filter((skin) =>
        `${skin.name} ${skin.description}`.toLowerCase().includes(query),
      )
    : showAllStarters
      ? starterOptions
      : starterOptions.slice(0, 6);
  const fontOptions = Object.entries(playgroundFonts).map(([key, font]) => (
    <option key={key} value={key}>
      {font.label}
    </option>
  ));
  function chooseAccent(value: string) {
    if (value === "custom")
      onChange({
        ...preset,
        customAccent: true,
        lightness: Number(Math.max(0.48, Math.min(0.83, seed[0])).toFixed(3)),
        chroma: Number(Math.min(0.3, seed[1]).toFixed(3)),
        hue: Math.round(seed[2]),
      });
    else
      onChange({
        ...preset,
        accentColor: value as ThemePreset["accentColor"],
        customAccent: false,
      });
  }
  function restoreSkinDefaults() {
    onChange({
      ...skinThemePreset(preset.skin),
      appearance: preset.appearance,
      dir: preset.dir,
      motion: preset.motion,
      effects: preset.effects,
    });
  }
  function openInspector(tab: string) {
    setPanelTab(tab);
    requestAnimationFrame(() => jumpToFoundationSection("theme-inspector"));
  }
  function shareLink() {
    const url = new URL(window.location.href);
    url.searchParams.set("theme", JSON.stringify(serializeThemePreset(preset)));
    return url.href;
  }
  function renderScene(view: string) {
    switch (view) {
      case "compare":
        return (
          <Suspense fallback={<p role="status">Lining up themes…</p>}>
            <CompareScene current={preset} />
          </Suspense>
        );
      case "email":
        return (
          <Suspense fallback={<p role="status">Opening your inbox…</p>}>
            <EmailScene />
          </Suspense>
        );
      case "dashboard":
        return (
          <Suspense fallback={<p role="status">Loading dashboard…</p>}>
            <DashboardScene />
          </Suspense>
        );
      case "player":
        return (
          <Suspense fallback={<p role="status">Loading player…</p>}>
            <PlayerScene />
          </Suspense>
        );
      case "states":
        return (
          <Suspense fallback={<p role="status">Loading states…</p>}>
            <StateScene />
          </Suspense>
        );
      case "workspace":
        return (
          <PreviewVoiceContext.Provider
            value={previewVoice(preset.document ? "none" : preset.skin)}
          >
            <WorkspaceScene />
          </PreviewVoiceContext.Provider>
        );
      case "tokens":
        return (
          <>
            <SurfacePreview />
            <section
              className="theme-palette-card"
              aria-label="Generated accent palette"
            >
              <div>
                <Text variant="label.md">
                  One accent. Twelve relationships.
                </Text>
                <Text variant="caption" tone="muted">
                  Surfaces → borders → actions → text
                </Text>
              </div>
              <div className="theme-palette-ramp">
                {colorSteps.map((step) => (
                  <div key={step}>
                    <span
                      style={{ background: toOklch(activeScale![step]) }}
                      title={toOklch(activeScale![step])}
                    />
                    <small>{String(step).padStart(2, "0")}</small>
                  </div>
                ))}
              </div>
              <div className="theme-contrast">
                <Check size={13} />
                <span>
                  Action text <strong>{contrast.toFixed(2)}:1</strong> minimum
                  across default, hover & pressed
                </span>
              </div>
            </section>
          </>
        );
      default:
        return (
          <Suspense fallback={<p role="status">Opening component gallery…</p>}>
            <ThemeComponentGallery
              onEditFoundations={() => openInspector("theme")}
            />
          </Suspense>
        );
    }
  }
  const seed = themeSeed(preset);
  const activeScale = palette?.[preset.appearance];
  const action = activeScale
    ? actionColors(activeScale, preset.appearance)
    : undefined;
  const contrast = action
    ? Math.min(
        ...[action.background, action.hover, action.pressed].map((background) =>
          contrastRatio(action.foreground, background),
        ),
      )
    : 0;
  // A message queued by an action (e.g. Shuffle) appears once its preset lands; other changes clear notices.
  const pendingNotice = useRef("");
  useEffect(() => {
    setNotice(pendingNotice.current);
    pendingNotice.current = "";
  }, [preset]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 3500);
    return () => clearTimeout(timer);
  }, [notice]);
  function update<Key extends keyof ThemePreset>(
    key: Key,
    value: ThemePreset[Key],
  ) {
    const next = { ...preset, [key]: value };
    onChange(next);
  }
  async function copy(text: string, message: string) {
    try {
      await navigator.clipboard.writeText(text);
      setNotice(message);
    } catch {
      setNotice(
        "Clipboard unavailable. Open Get code, select the text, and copy it manually.",
      );
    }
  }
  function reset() {
    appearanceChosen.current = false;
    onChange(defaultThemePreset);
    setPreviewKey((value) => value + 1);
    setImportText("");
    setImportError("");
  }
  return (
    <Theme
      appearance={preset.appearance}
      accentColor={preset.accentColor}
      neutralColor={preset.neutralColor}
      className="theme-standalone"
    >
      <a href="#theme-main-content" className="skip-link">
        Skip to theme editor
      </a>
      <header className="theme-site-header">
        <Link to="/" className="theme-site-brand" aria-label="Dixy UI home">
          <DixyMark size={26} />
          <strong>
            dixy<span>UI</span>
          </strong>
        </Link>
        <span className="theme-site-divider" />
        <span className="theme-site-title">Theme playground</span>
        <nav aria-label="Playground navigation">
          <Link
            to="/docs/foundations/$foundation"
            params={{ foundation: "theming" }}
          >
            Documentation <ArrowUpRight size={13} />
          </Link>
          <div className="theme-page-actions">
            <div className="theme-history-actions">
              <Button
                size="sm"
                variant="ghost"
                color="neutral"
                disabled={!past.current.length}
                onClick={() => travel("undo")}
              >
                Undo
              </Button>
              <Button
                size="sm"
                variant="ghost"
                color="neutral"
                disabled={!future.current.length}
                onClick={() => travel("redo")}
              >
                Redo
              </Button>
            </div>

            <Button
              variant="ghost"
              color="neutral"
              size="sm"
              className="theme-tool-button"
              title="Random material, frame, accent and character"
              onClick={() => {
                const next = {
                  ...shuffleTheme(preset, Date.now()),
                  appearance: preset.appearance,
                };
                const { text, action } = themeContrast(next);
                pendingNotice.current = `Shuffled a readable theme · text ${text.toFixed(1)}:1 · buttons ${action.toFixed(1)}:1 in light and dark`;
                onChange(next);
              }}
            >
              <Shuffle size={14} />
              <span className="theme-tool-label">Shuffle</span>
            </Button>
            <Button
              variant="ghost"
              color="neutral"
              size="sm"
              className="theme-tool-button"
              onClick={reset}
              title="Reset theme and preview"
            >
              <RotateCcw size={14} />
              <span className="theme-tool-label">Reset</span>
            </Button>
            <Button
              variant="ghost"
              color="neutral"
              size="sm"
              className="theme-tool-button"
              disabled={!!error || !!warning}
              onClick={() =>
                void copy(
                  shareLink(),
                  "Theme link copied. Open it to restore these foundations.",
                )
              }
            >
              <Copy size={14} />
              <span className="theme-tool-label">Copy link</span>
            </Button>
            <Button
              size="sm"
              onClick={() => setCodeOpen(true)}
              disabled={!!error}
            >
              <Code2 size={15} />
              <span className="theme-code-label">Get code</span>
            </Button>
          </div>{" "}
          <Button
            variant="ghost"
            color="neutral"
            size="sm"
            aria-label={`Switch to ${preset.appearance === "light" ? "dark" : "light"} theme`}
            onClick={() =>
              chooseAppearance(preset.appearance === "light" ? "dark" : "light")
            }
          >
            {preset.appearance === "light" ? (
              <Moon size={17} />
            ) : (
              <Sun size={17} />
            )}
          </Button>
        </nav>
      </header>
      <main
        id="theme-main-content"
        className="theme-standalone-main"
        tabIndex={-1}
      >
        <article className="theme-playground-page">
          <header className="theme-page-header sr-only">
            <div>
              <span>Theme playground</span>
              <p>Your components. Your foundations.</p>
            </div>{" "}
          </header>
          {warning && (
            <p className="theme-message" role="status">
              {warning}
            </p>
          )}
          <a
            className="theme-mobile-jump"
            href="#theme-preview"
            onClick={(event) => {
              event.preventDefault();
              jumpToFoundationSection("theme-preview");
            }}
          >
            Jump to live preview ↓
          </a>
          <h1 id="theme-playground-heading" className="sr-only">
            Theme playground
          </h1>
          <div className="theme-editor-layout">
            <div className="theme-workbench">
              <section
                id="theme-preview"
                tabIndex={-1}
                className="theme-preview-panel"
                aria-label="Live theme preview"
              >
                <Tabs.Root
                  value={previewView}
                  onValueChange={(value) => setPreviewView(String(value))}
                  size="sm"
                  variant="segmented"
                  className="theme-scene-tabs-root"
                >
                  <div className="theme-preview-toolbar">
                    <Tabs.List
                      aria-label="Preview scene"
                      className="theme-scene-tabs"
                    >
                      {previewScenes.map((scene, index) =>
                        scene ? (
                          <Tabs.Tab key={scene.value} value={scene.value}>
                            <scene.icon size={14} aria-hidden="true" />
                            {scene.label}
                          </Tabs.Tab>
                        ) : (
                          <span
                            key={`rule-${index}`}
                            className="theme-scene-rule"
                            aria-hidden="true"
                          />
                        ),
                      )}
                      <Tabs.Indicator />
                    </Tabs.List>
                    {props?.ornamentRenderer && (
                      <Button
                        size="sm"
                        variant="ghost"
                        color="neutral"
                        className="theme-animate-toggle"
                        title="Animate the frame details for 20 seconds"
                        onClick={() =>
                          update("animateOrnaments", !preset.animateOrnaments)
                        }
                        aria-pressed={preset.animateOrnaments}
                      >
                        {preset.animateOrnaments ? (
                          <Pause size={13} />
                        ) : (
                          <Play size={13} />
                        )}
                        {preset.animateOrnaments ? "Pause" : "Animate"}
                      </Button>
                    )}
                    <ToggleGroup
                      segmented
                      className="theme-appearance"
                      aria-label="Preview appearance"
                      value={[preset.appearance]}
                      onValueChange={(value) =>
                        value[0] &&
                        chooseAppearance(value[0] as ThemePreset["appearance"])
                      }
                    >
                      <Toggle value="light" size="sm" color="neutral">
                        <Sun size={14} aria-hidden="true" />
                        Light
                      </Toggle>
                      <Toggle value="dark" size="sm" color="neutral">
                        <Moon size={14} aria-hidden="true" />
                        Dark
                      </Toggle>
                    </ToggleGroup>
                  </div>
                  {error ? (
                    <div className="theme-seed-error" role="alert">
                      <Heading size="sm">
                        This seed needs a small adjustment.
                      </Heading>
                      <p>{error}</p>
                      <p>
                        Move lightness toward 0.54, or choose a named accent to
                        continue.
                      </p>
                    </div>
                  ) : (
                    <Theme
                      {...props}
                      className="theme-preview-canvas"
                      key={previewKey}
                    >
                      {activeSkin && (
                        <div className="theme-scene-brand">
                          <strong>DIXY</strong>
                          <span>{activeSkin.name}</span>
                          <div aria-hidden="true">
                            {activeSkin.swatches.map((color) => (
                              <i key={color} style={{ background: color }} />
                            ))}
                          </div>
                        </div>
                      )}
                      {preset.skin === "dixy/prism-glass" &&
                        !preset.document && (
                          <div className="dixy-skin-backdrop theme-glass-note">
                            <span>Light, with a little depth.</span>
                            <span>Prism Glass</span>
                          </div>
                        )}
                      {previewScenes.map(
                        (scene) =>
                          scene && (
                            <Tabs.Panel
                              key={scene.value}
                              value={scene.value}
                              className="theme-scene-panel"
                            >
                              {renderScene(scene.value)}
                            </Tabs.Panel>
                          ),
                      )}
                    </Theme>
                  )}
                </Tabs.Root>
                <div className="theme-preview-footer">
                  <a
                    className="theme-mobile-jump"
                    href="#theme-inspector"
                    onClick={(event) => {
                      event.preventDefault();
                      openInspector("theme");
                    }}
                  >
                    ↑ Edit theme
                  </a>
                  <span>Real Dixy components. Your foundations.</span>
                  <Link
                    to="/docs/foundations/$foundation"
                    params={{ foundation: "theming" }}
                  >
                    How theming works <ArrowUpRight size={12} />
                  </Link>
                </div>
              </section>
            </div>
            <aside
              id="theme-inspector"
              tabIndex={-1}
              className="theme-customization-panel theme-inspector"
              aria-label="Theme editor"
            >
              <div className="theme-inspector-head">
                <span
                  className="theme-inspector-swatch"
                  aria-hidden="true"
                  style={swatchStyle(currentSwatches)}
                />
                <div>
                  <h2>{activeSkin?.name ?? "Original Dixy"}</h2>
                  <p>
                    {skinLoading
                      ? "Preparing your next look…"
                      : (activeSkin?.description ??
                        "Dixy’s own neutral starting point.")}
                  </p>
                </div>
                {changes.total > 0 && (
                  <Badge size="sm" variant="soft">
                    {changes.total} {changes.total === 1 ? "edit" : "edits"}
                  </Badge>
                )}
              </div>
              {skinError && (
                <p role="alert" className="theme-message">
                  {skinError}
                </p>
              )}
              <Tabs.Root
                value={panelTab}
                onValueChange={(value) => setPanelTab(String(value))}
                size="sm"
                fullWidth
                className="theme-inspector-tabs"
              >
                <Tabs.List
                  aria-label="Editor sections"
                  className="theme-inspector-tablist"
                >
                  {inspectorTabs.map(({ value, label, icon: Icon }) => {
                    const edited =
                      value !== "export" &&
                      changes[value as keyof typeof changes] > 0;
                    return (
                      <Tabs.Tab key={value} value={value}>
                        <span className="theme-inspector-tab-icon">
                          <Icon size={17} aria-hidden="true" />
                          {edited && (
                            <i
                              className="theme-inspector-dot"
                              aria-hidden="true"
                            />
                          )}
                        </span>
                        {label}
                        {edited && <span className="sr-only">, edited</span>}
                      </Tabs.Tab>
                    );
                  })}
                  <Tabs.Indicator />
                </Tabs.List>
                <div className="theme-inspector-body">
                  <Tabs.Panel value="theme" className="theme-inspector-panel">
                    <p className="theme-inspector-intro">
                      Start from a personality, then set the brand basics.
                    </p>
                    <InspectorGroup
                      title="Starter"
                      aside={
                        <span className="theme-inspector-hint">
                          {starterOptions.length} themes
                        </span>
                      }
                    >
                      <TextField
                        size="sm"
                        type="search"
                        aria-label="Search starters"
                        placeholder="Search starters…"
                        value={starterQuery}
                        onChange={(event) =>
                          setStarterQuery(event.target.value)
                        }
                      />
                      {visibleStarters.length ? (
                        <div
                          className="theme-skin-strip theme-inspector-starters"
                          role="group"
                          aria-label="Choose a starter"
                        >
                          {visibleStarters.map((skin) => {
                            const selected =
                              preset.skin === skin.id && !preset.document;
                            return (
                              <Button
                                key={skin.id}
                                variant="ghost"
                                color="neutral"
                                className="theme-skin-option"
                                aria-pressed={selected}
                                onClick={() => void selectSkin(skin.id)}
                                data-skin-preview={skin.slug}
                                style={
                                  {
                                    "--skin-color": skin.swatches[0],
                                    "--skin-mid": skin.swatches[1],
                                    "--skin-base": skin.swatches[2],
                                  } as CSSProperties
                                }
                              >
                                <span
                                  className="theme-skin-miniature"
                                  aria-hidden="true"
                                >
                                  <span className="theme-mini-title">Aa</span>
                                  <span className="theme-mini-line" />
                                  <span className="theme-mini-button" />
                                  <span className="theme-mini-switch" />
                                </span>
                                {selected && (
                                  <span
                                    className="theme-skin-check"
                                    aria-hidden="true"
                                  >
                                    <Check size={10} strokeWidth={3} />
                                  </span>
                                )}
                                <span className="theme-skin-option-name">
                                  {skin.name}
                                </span>
                              </Button>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="theme-inspector-empty" role="status">
                          No starter matches “{starterQuery}”.
                        </p>
                      )}
                      {!starterQuery && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="theme-inspector-more"
                          aria-expanded={showAllStarters}
                          onClick={() => setShowAllStarters((value) => !value)}
                        >
                          {showAllStarters
                            ? "Show fewer"
                            : `Show all ${starterOptions.length} starters`}
                        </Button>
                      )}
                    </InspectorGroup>
                    <InspectorGroup title="Accent">
                      <ToggleGroup
                        aria-label="Accent colour"
                        className="theme-accent-swatches"
                        value={[
                          preset.customAccent ? "custom" : preset.accentColor,
                        ]}
                        onValueChange={(value) =>
                          value[0] && chooseAccent(value[0])
                        }
                      >
                        {colorFamilies.map((family) => (
                          <Toggle
                            key={family}
                            value={family}
                            aria-label={family}
                            title={family}
                            className="theme-accent-swatch"
                            style={
                              {
                                "--swatch": toOklch(
                                  colorPalettes[family].light[9],
                                ),
                              } as CSSProperties
                            }
                          />
                        ))}
                        <Toggle
                          value="custom"
                          aria-label="Custom OKLCH colour"
                          title="Custom OKLCH colour"
                          className="theme-accent-swatch theme-accent-custom"
                        />
                      </ToggleGroup>
                      {preset.customAccent && (
                        <div className="theme-custom-color">
                          {(
                            [
                              {
                                key: "hue",
                                label: "Hue",
                                min: 0,
                                max: 360,
                                step: 1,
                              },
                              {
                                key: "chroma",
                                label: "Chroma",
                                min: 0,
                                max: 0.3,
                                step: 0.001,
                              },
                              {
                                key: "lightness",
                                label: "Lightness",
                                min: 0.48,
                                max: 0.83,
                                step: 0.001,
                              },
                            ] as const
                          ).map((control) => (
                            <label
                              key={control.key}
                              htmlFor={`theme-accent-${control.key}`}
                            >
                              <span>
                                {control.label}
                                <output aria-hidden="true">
                                  {preset[control.key]}
                                </output>
                              </span>
                              <DocsSlider
                                id={`theme-accent-${control.key}`}
                                aria-label={control.label}
                                min={control.min}
                                max={control.max}
                                step={control.step}
                                value={preset[control.key]}
                                onValueChange={(nextValue) =>
                                  update(control.key, Number(nextValue))
                                }
                              />
                            </label>
                          ))}
                          <small>
                            Gamut mapped to sRGB. Seeds must support 4.5:1
                            action text in both appearances.
                          </small>
                        </div>
                      )}
                    </InspectorGroup>
                    <InspectorGroup title="Shape">
                      <Segmented
                        label="Corners"
                        value={preset.radius}
                        onChange={(value) => update("radius", value)}
                        options={(
                          Object.keys(radiusPresets) as ThemePreset["radius"][]
                        ).map((radius) => [radius, radiusLabels[radius]])}
                      />
                      <Control label="Neutral base">
                        <DocsSelect
                          value={preset.neutralColor}
                          onValueChange={(nextValue) =>
                            update(
                              "neutralColor",
                              nextValue as ThemePreset["neutralColor"],
                            )
                          }
                        >
                          {neutralColorFamilies.map((family) => (
                            <option key={family}>{family}</option>
                          ))}
                        </DocsSelect>
                      </Control>
                    </InspectorGroup>
                  </Tabs.Panel>

                  <Tabs.Panel value="style" className="theme-inspector-panel">
                    <p className="theme-inspector-intro">
                      How surfaces feel, how type reads, how much depth.
                    </p>
                    <InspectorGroup title="Surface">
                      <ThemeRecipeMixer
                        part="material"
                        preset={preset}
                        onChange={onChange}
                      />
                      <InspectorField label="Component finish">
                        <ToggleGroup
                          aria-label="Component finish"
                          className="theme-finish-grid"
                          value={[preset.material]}
                          onValueChange={(value) =>
                            value[0] &&
                            update(
                              "material",
                              value[0] as ThemePreset["material"],
                            )
                          }
                        >
                          {finishOptions.map(([value, label]) => (
                            <Toggle
                              key={value}
                              value={value}
                              size="sm"
                              variant="outline"
                              color="neutral"
                              className="theme-finish-option"
                            >
                              <i data-finish={value} aria-hidden="true" />
                              {label}
                            </Toggle>
                          ))}
                        </ToggleGroup>
                      </InspectorField>
                    </InspectorGroup>
                    <InspectorGroup title="Type">
                      <div className="theme-inspector-pair">
                        <Control label="Body">
                          <DocsSelect
                            value={preset.bodyFont}
                            onValueChange={(nextValue) =>
                              update(
                                "bodyFont",
                                nextValue as ThemePreset["bodyFont"],
                              )
                            }
                          >
                            {fontOptions}
                          </DocsSelect>
                        </Control>
                        <Control label="Headings">
                          <DocsSelect
                            value={preset.headingFont}
                            onValueChange={(nextValue) =>
                              update(
                                "headingFont",
                                nextValue as ThemePreset["headingFont"],
                              )
                            }
                          >
                            {fontOptions}
                          </DocsSelect>
                        </Control>
                      </div>
                    </InspectorGroup>
                    <InspectorGroup title="Depth">
                      <Segmented
                        label="Elevation"
                        value={preset.depth}
                        onChange={(value) => update("depth", value)}
                        options={[
                          ["none", "Flat"],
                          ["raised", "Raised"],
                          ["floating", "Floating"],
                        ]}
                      />
                      <Segmented
                        label="Relief"
                        value={String(preset.relief) as "0" | "1" | "2"}
                        onChange={(value) =>
                          update(
                            "relief",
                            Number(value) as ThemePreset["relief"],
                          )
                        }
                        options={[
                          ["0", "Flat"],
                          ["1", "Tactile"],
                          ["2", "Deep"],
                        ]}
                      />
                      <Segmented
                        label="Control stroke"
                        value={String(preset.border) as "1" | "2"}
                        onChange={(value) =>
                          update("border", Number(value) as 1 | 2)
                        }
                        options={[
                          ["1", "1px"],
                          ["2", "2px · Bold"],
                        ]}
                      />
                      <Control label="Effects">
                        <DocsSelect
                          value={preset.effects}
                          onValueChange={(value) =>
                            update("effects", value as ThemePreset["effects"])
                          }
                        >
                          <option value="static">Static</option>
                          <option value="backdrop">Frosted toolbar</option>
                          <option value="reduced">Reduced effects</option>
                        </DocsSelect>
                      </Control>
                    </InspectorGroup>
                    <InspectorGroup title="Layout">
                      <Segmented
                        label="Density"
                        value={preset.density}
                        onChange={(value) => update("density", value)}
                        options={(
                          Object.keys(
                            spacingDensity,
                          ) as ThemePreset["density"][]
                        ).map((density) => [
                          density,
                          density[0]!.toUpperCase() + density.slice(1),
                        ])}
                      />
                      <Control label="Geometry">
                        <DocsSelect
                          value={preset.shape}
                          onValueChange={(value) =>
                            update("shape", value as ThemePreset["shape"])
                          }
                        >
                          <option value="inherit">Skin default</option>
                          <option value="rounded">Rounded</option>
                          <option value="pill">Pill</option>
                          <option value="square">Square</option>
                        </DocsSelect>
                      </Control>
                      <ThemeRecipeMixer
                        part="frame"
                        preset={preset}
                        onChange={onChange}
                      />
                      <Segmented
                        label="Direction"
                        value={preset.dir}
                        onChange={(value) => update("dir", value)}
                        options={[
                          ["ltr", "Left to right"],
                          ["rtl", "Right to left"],
                        ]}
                      />
                    </InspectorGroup>
                    <ThemeInspectorAccordion>
                      <ThemeInspectorSection
                        title="Advanced surface"
                        value="surface"
                      >
                        <ThemeRecipeMixer
                          part="advanced"
                          preset={preset}
                          onChange={onChange}
                        />
                      </ThemeInspectorSection>
                    </ThemeInspectorAccordion>
                  </Tabs.Panel>

                  <Tabs.Panel
                    value="character"
                    className="theme-inspector-panel"
                  >
                    <p className="theme-inspector-intro">
                      How controls behave and how the interface speaks.
                    </p>
                    <ThemeRecipeMixer
                      part="character"
                      preset={preset}
                      onChange={onChange}
                      motionExtra={
                        <Segmented
                          label="Reduce motion"
                          value={preset.motion}
                          onChange={(value) => update("motion", value)}
                          options={[
                            ["system", "Follow system"],
                            ["reduced", "Always"],
                          ]}
                        />
                      }
                    />
                    <InspectorGroup title="Ornament">
                      <Segmented
                        label="Amount"
                        value={preset.ornament}
                        onChange={(value) => update("ornament", value)}
                        options={[
                          ["quiet", "Quiet"],
                          ["balanced", "Balanced"],
                          ["expressive", "Expressive"],
                        ]}
                      />
                    </InspectorGroup>
                    <InspectorGroup
                      title="Borrow a character"
                      aside={
                        <span className="theme-inspector-hint">
                          keeps your colours
                        </span>
                      }
                    >
                      <ThemeRecipeMixer
                        part="borrow"
                        preset={preset}
                        onChange={onChange}
                      />
                    </InspectorGroup>
                  </Tabs.Panel>

                  <Tabs.Panel value="export" className="theme-inspector-panel">
                    <p className="theme-inspector-intro">
                      Take this theme into your app, or keep it for later.
                    </p>
                    <InspectorGroup
                      title="Code"
                      aside={
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={!!error}
                          onClick={() => setCodeOpen(true)}
                        >
                          Expand <ArrowUpRight size={13} />
                        </Button>
                      }
                    >
                      <Segmented
                        label="Format"
                        value={codeView}
                        onChange={setCodeView}
                        options={[
                          ["react", "React"],
                          ["css", "CSS"],
                          ["preset", "Preset"],
                          ["document", "Document"],
                        ]}
                      />
                      {!codeOpen && exportCode && (
                        <div className="theme-inspector-code">
                          <CodeBlock
                            key={codeView}
                            code={exportCode}
                            language={codeLanguage}
                            filename={codeFilename}
                          />
                        </div>
                      )}
                    </InspectorGroup>
                    <InspectorGroup title="Share">
                      <div className="theme-inspector-actions">
                        <Button
                          size="sm"
                          variant="outline"
                          color="neutral"
                          disabled={!!error || !!warning}
                          onClick={() =>
                            void copy(
                              shareLink(),
                              "Theme link copied. Open it to restore these foundations.",
                            )
                          }
                        >
                          <Link2 size={14} /> Copy share link
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          color="neutral"
                          disabled={!!error}
                          onClick={() =>
                            void copy(
                              serializeThemePreset(preset),
                              "Preset copied. Use Import to restore it in the playground.",
                            )
                          }
                        >
                          <Copy size={14} /> Copy preset
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          color="neutral"
                          disabled={!!error}
                          onClick={downloadPreset}
                        >
                          <Download size={14} /> Download preset
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          color="neutral"
                          onClick={() => {
                            setImportError("");
                            setImportOpen(true);
                          }}
                        >
                          <Upload size={14} /> Import a preset
                        </Button>
                      </div>
                    </InspectorGroup>
                    <InspectorGroup title="Save in this browser">
                      <ThemeRecipeMixer
                        part="save"
                        preset={preset}
                        onChange={onChange}
                      />
                    </InspectorGroup>
                  </Tabs.Panel>
                </div>
              </Tabs.Root>
              <div className="theme-inspector-foot">
                <span>
                  {changes.total
                    ? `${changes.total} ${changes.total === 1 ? "change" : "changes"} from ${baselineName}`
                    : `Matches ${baselineName}`}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  color="neutral"
                  disabled={!changes.total}
                  onClick={restoreSkinDefaults}
                >
                  Reset all
                </Button>
              </div>
            </aside>
          </div>
          <p className="theme-copy-notice" role="status">
            {notice}
          </p>
          <Dialog.Root open={codeOpen} onOpenChange={setCodeOpen}>
            <Dialog.Portal>
              <Dialog.Backdrop />
              <Dialog.Viewport>
                <Dialog.Popup className="theme-export-dialog">
                  <div className="theme-export-heading">
                    <div>
                      <Dialog.Title>Take your theme with you.</Dialog.Title>
                      <Dialog.Description>
                        React code includes the selected skin and both
                        appearances. A preset restores your work here.
                      </Dialog.Description>
                    </div>
                    <Dialog.Close
                      render={
                        <IconButton
                          variant="ghost"
                          color="neutral"
                          aria-label="Close code"
                        />
                      }
                    >
                      <X size={18} />
                    </Dialog.Close>
                  </div>
                  <div
                    className="theme-export-tabs"
                    role="group"
                    aria-label="Export format"
                  >
                    <Button
                      size="sm"
                      variant={codeView === "react" ? "soft" : "ghost"}
                      aria-pressed={codeView === "react"}
                      onClick={() => setCodeView("react")}
                    >
                      React
                    </Button>
                    <Button
                      size="sm"
                      variant={codeView === "preset" ? "soft" : "ghost"}
                      aria-pressed={codeView === "preset"}
                      onClick={() => setCodeView("preset")}
                    >
                      Preset JSON
                    </Button>
                  </div>
                  <div className="theme-export-extra">
                    <Button
                      size="sm"
                      variant={codeView === "document" ? "soft" : "ghost"}
                      onClick={() => setCodeView("document")}
                    >
                      Theme document
                    </Button>
                    <Button
                      size="sm"
                      variant={codeView === "css" ? "soft" : "ghost"}
                      onClick={() => setCodeView("css")}
                    >
                      {preset.document ? "Full theme CSS" : "CSS overrides"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={downloadPreset}
                    >
                      Download preset
                    </Button>
                  </div>
                  {codeOpen && !error && (
                    <CodeBlock
                      key={codeView}
                      code={exportCode}
                      language={
                        codeView === "react"
                          ? "tsx"
                          : codeView === "css"
                            ? "css"
                            : "json"
                      }
                      filename={
                        codeView === "react"
                          ? "dixy-theme.tsx"
                          : codeView === "css"
                            ? "dixy-theme.css"
                            : "dixy-theme.json"
                      }
                    />
                  )}
                  <p className="theme-export-help">
                    {codeView === "react"
                      ? preset.document
                        ? "Save Full theme CSS as dixy-theme.css beside the exported wrapper. This output renders without the authoring compiler."
                        : "Use the public Dixy packages and only the selected skin stylesheet. Install the optional fonts shown in the imports, then wrap your app with DixyTheme."
                      : codeView === "css"
                        ? preset.document
                          ? "Save this stylesheet as dixy-theme.css beside the React wrapper. Import both in your app."
                          : "Add these overrides after the selected skin stylesheet in your app."
                        : "Copy this JSON and choose Import in the playground to keep editing. Use the React and CSS exports in your app."}
                  </p>
                </Dialog.Popup>
              </Dialog.Viewport>
            </Dialog.Portal>
          </Dialog.Root>
          <Dialog.Root open={importOpen} onOpenChange={setImportOpen}>
            <Dialog.Portal>
              <Dialog.Backdrop />
              <Dialog.Viewport>
                <Dialog.Popup className="theme-import-dialog">
                  <Dialog.Title>Pick up where you left off.</Dialog.Title>
                  <Dialog.Description>
                    Paste a theme document or a preset copied from the Dixy
                    playground.
                  </Dialog.Description>
                  <label className="theme-import-label">
                    Preset JSON
                    <Textarea
                      value={importText}
                      onChange={(event) => {
                        setImportText(event.target.value);
                        setImportError("");
                      }}
                      spellCheck={false}
                      placeholder={'{ "version": 1, … }'}
                      aria-invalid={!!importError}
                      aria-describedby={
                        importError ? "theme-import-error" : undefined
                      }
                    />
                  </label>
                  {importError && (
                    <p
                      id="theme-import-error"
                      className="theme-import-error"
                      role="alert"
                    >
                      {importError}
                    </p>
                  )}
                  <div className="theme-dialog-actions">
                    <Dialog.Close
                      render={<Button variant="outline" color="neutral" />}
                    >
                      Cancel
                    </Dialog.Close>
                    <Button
                      onClick={() => {
                        try {
                          const next = parseThemePreset(importText);
                          playgroundThemeProps(next);
                          onChange(next);
                          setImportOpen(false);
                        } catch (cause) {
                          setImportError(
                            cause instanceof SyntaxError
                              ? "That isn’t valid JSON. Copy the complete preset and try again."
                              : cause instanceof Error
                                ? cause.message
                                : "Could not import this preset.",
                          );
                        }
                      }}
                    >
                      Apply preset <ArrowRight size={14} />
                    </Button>
                  </div>
                </Dialog.Popup>
              </Dialog.Viewport>
            </Dialog.Portal>
          </Dialog.Root>
        </article>
      </main>
    </Theme>
  );
}
