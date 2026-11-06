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
  Check,
  Code2,
  Copy,
  Moon,
  Pause,
  Play,
  RotateCcw,
  Shuffle,
  SlidersHorizontal,
  Sun,
  Upload,
  X,
} from "lucide-react";
import {
  Button,
  Switch,
  Dialog,
  Heading,
  IconButton,
  Text,
  Textarea,
  Theme,
} from "@dixy-ui/react";
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
  starterPresets,
  themeReactCode,
  themeSeed,
  exportThemeDocument,
  shuffleTheme,
  themeContrast,
  type ThemePreset,
} from "../lib/theme-playground";
import { PreviewVoiceContext, previewVoice } from "./theme-preview-voice";
import "../styles/theme-playground.css";
import "../styles/theme-skins.css";
import { prepareSkin } from "../lib/theme-skin-catalogue";
const PlayerScene = lazy(() => import("./theme-player-scene"));
const StateScene = lazy(() => import("./theme-state-scene"));
const EmailScene = lazy(() => import("./theme-email-scene"));
const DashboardScene = lazy(() => import("./theme-dashboard-scene"));
const CompareScene = lazy(() => import("./theme-compare-scene"));

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
}: {
  preset: ThemePreset;
  onChange: (preset: ThemePreset) => void;
  warning: string;
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
  const [foundationsOpen, setFoundationsOpen] = useState(false);
  const [previewView, setPreviewView] = useState("workspace");
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
    if (!codeOpen || error) return "";
    return codeView === "react"
      ? themeReactCode(preset)
      : codeView === "css"
        ? themeCSSCode(preset)
        : codeView === "document"
          ? exportThemeDocument(preset)
          : serializeThemePreset(preset);
  }, [codeOpen, codeView, preset, error]);
  const selectedStarter = starterPresets.find(
    (starter) =>
      JSON.stringify({ ...starter.theme, appearance: preset.appearance }) ===
      JSON.stringify(preset),
  );
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
                  (() => {
                    const url = new URL(window.location.href);
                    url.searchParams.set(
                      "theme",
                      JSON.stringify(serializeThemePreset(preset)),
                    );
                    return url.href;
                  })(),
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
              <Dialog.Root
                open={foundationsOpen}
                onOpenChange={setFoundationsOpen}
              >
                <Dialog.Portal>
                  <Dialog.Backdrop />
                  <Dialog.Viewport>
                    {" "}
                    <Dialog.Popup
                      id="theme-foundations"
                      tabIndex={-1}
                      className="theme-controls theme-foundations-dialog"
                      aria-label="Theme foundations"
                    >
                      <div className="theme-controls-heading">
                        <SlidersHorizontal size={15} />
                        <Dialog.Title>Advanced foundations</Dialog.Title>
                        <Dialog.Description className="sr-only">
                          Choose a starter, fine tune color, and adjust
                          typography, density and motion.
                        </Dialog.Description>
                        <Dialog.Close
                          render={
                            <IconButton
                              aria-label="Close foundations"
                              variant="ghost"
                              color="neutral"
                            />
                          }
                        >
                          <X size={16} />
                        </Dialog.Close>
                        <Button
                          variant="ghost"
                          color="neutral"
                          size="sm"
                          className="theme-import-button"
                          onClick={() => {
                            setImportError("");
                            setImportOpen(true);
                          }}
                          title="Import a Dixy preset"
                        >
                          <Upload size={14} />
                          Import
                        </Button>
                      </div>
                      <fieldset className="theme-control-section">
                        <legend>Start somewhere</legend>
                        <div className="theme-starter-grid">
                          {starterPresets.map((starter) => (
                            <Button
                              variant="ghost"
                              color="neutral"
                              size="sm"
                              key={starter.name}
                              aria-pressed={
                                selectedStarter?.name === starter.name
                              }
                              className="theme-starter"
                              onClick={() =>
                                onChange({
                                  ...starter.theme,
                                  appearance: preset.appearance,
                                })
                              }
                            >
                              <span
                                className="theme-starter-dot"
                                style={{
                                  background: toOklch(
                                    colorPalettes[starter.theme.accentColor]
                                      .light[9],
                                  ),
                                }}
                              />
                              <span>
                                <strong>{starter.name}</strong>
                                <small>{starter.description}</small>
                              </span>
                              {selectedStarter?.name === starter.name && (
                                <Check size={12} />
                              )}
                            </Button>
                          ))}
                        </div>
                      </fieldset>
                      <fieldset className="theme-control-section">
                        <legend>Accent fine tuning</legend>

                        <div
                          className="theme-quick-colors"
                          aria-label="Quick accent colors"
                        >
                          {[
                            "purple",
                            "blue",
                            "jade",
                            "orange",
                            "rose",
                            "amber",
                            "neutral",
                          ].map((family) => (
                            <Button
                              variant="ghost"
                              color="neutral"
                              size="sm"
                              key={family}
                              aria-label={`Use ${family} accent`}
                              aria-pressed={
                                !preset.customAccent &&
                                preset.accentColor === family
                              }
                              style={
                                {
                                  "--swatch": toOklch(
                                    colorPalettes[
                                      family as ThemePreset["accentColor"]
                                    ].light[9],
                                  ),
                                } as React.CSSProperties
                              }
                              onClick={() =>
                                onChange({
                                  ...preset,
                                  accentColor:
                                    family as ThemePreset["accentColor"],
                                  customAccent: false,
                                })
                              }
                            >
                              {!preset.customAccent &&
                                preset.accentColor === family && (
                                  <Check size={13} />
                                )}
                            </Button>
                          ))}
                        </div>
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
                      </fieldset>
                      <fieldset className="theme-control-section">
                        <legend>Typography</legend>

                        <Control label="Heading font">
                          <DocsSelect
                            value={preset.headingFont}
                            onValueChange={(nextValue) =>
                              update(
                                "headingFont",
                                nextValue as ThemePreset["headingFont"],
                              )
                            }
                          >
                            {Object.entries(playgroundFonts).map(
                              ([key, font]) => (
                                <option key={key} value={key}>
                                  {font.label}
                                </option>
                              ),
                            )}
                          </DocsSelect>
                        </Control>
                      </fieldset>
                      <fieldset className="theme-control-section">
                        <legend>Character</legend>
                        <Control label="Component finish">
                          <DocsSelect
                            value={preset.material}
                            onValueChange={(value) =>
                              update(
                                "material",
                                value as ThemePreset["material"],
                              )
                            }
                          >
                            <option value="inherit">Skin default</option>
                            <option value="matte">Matte</option>
                            <option value="glossy">Enamel</option>
                            <option value="soft">Soft clay</option>
                            <option value="metal">Metal</option>
                            <option value="paper">Paper</option>
                          </DocsSelect>
                        </Control>
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
                        <Control label="Ornament">
                          <DocsSelect
                            value={preset.ornament}
                            onValueChange={(value) =>
                              update(
                                "ornament",
                                value as ThemePreset["ornament"],
                              )
                            }
                          >
                            <option value="quiet">Quiet</option>
                            <option value="balanced">Balanced</option>
                            <option value="expressive">Expressive</option>
                          </DocsSelect>
                        </Control>
                        <Control label="Relief">
                          <DocsSelect
                            value={preset.relief}
                            onValueChange={(value) =>
                              update(
                                "relief",
                                Number(value) as ThemePreset["relief"],
                              )
                            }
                          >
                            <option value="0">Flat</option>
                            <option value="1">Tactile</option>
                            <option value="2">Deep</option>
                          </DocsSelect>
                        </Control>
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
                        <Control label="Direction">
                          <DocsSelect
                            value={preset.dir}
                            onValueChange={(value) =>
                              update("dir", value as ThemePreset["dir"])
                            }
                          >
                            <option value="ltr">Left to right</option>
                            <option value="rtl">Right to left</option>
                          </DocsSelect>
                        </Control>
                      </fieldset>
                      <fieldset className="theme-control-section">
                        <legend>Space & motion</legend>

                        <Control label="Density">
                          <DocsSelect
                            value={preset.density}
                            onValueChange={(nextValue) =>
                              update(
                                "density",
                                nextValue as ThemePreset["density"],
                              )
                            }
                          >
                            {Object.keys(spacingDensity).map((density) => (
                              <option key={density}>{density}</option>
                            ))}
                          </DocsSelect>
                        </Control>

                        <Control label="Motion">
                          <DocsSelect
                            value={preset.motion}
                            onValueChange={(nextValue) =>
                              update(
                                "motion",
                                nextValue as ThemePreset["motion"],
                              )
                            }
                          >
                            <option value="system">Follow system</option>
                            <option value="reduced">Reduced</option>
                          </DocsSelect>
                        </Control>
                      </fieldset>
                      <div className="theme-controls-footer">
                        <Button
                          variant="ghost"
                          color="neutral"
                          size="sm"
                          disabled={!!error}
                          className="theme-copy-preset"
                          onClick={() =>
                            void copy(
                              serializeThemePreset(preset),
                              "Preset copied. Use Import to restore it in the playground.",
                            )
                          }
                        >
                          <Copy size={14} />
                          Copy preset
                        </Button>
                        <span>Yours to keep. Yours to build on.</span>
                      </div>
                    </Dialog.Popup>
                  </Dialog.Viewport>
                </Dialog.Portal>
              </Dialog.Root>
              <section
                id="theme-preview"
                tabIndex={-1}
                className="theme-preview-panel"
                aria-label="Live theme preview"
              >
                <div className="theme-preview-toolbar">
                  <div>
                    <span className="theme-live-dot" />
                    <strong>Live preview</strong>
                    <span>
                      {activeSkin?.name ??
                        selectedStarter?.name ??
                        "Custom theme"}
                    </span>
                    <DocsSelect
                      aria-label="Preview content"
                      value={previewView}
                      onValueChange={(value) =>
                        setPreviewView(value as typeof previewView)
                      }
                    >
                      <option value="workspace">Overview</option>
                      <option value="library">All components</option>
                      <option value="player">Player</option>
                      <option value="email">Email</option>
                      <option value="dashboard">Dashboard</option>
                      <option value="states">States</option>
                      <option value="compare">Compare themes</option>
                      <option value="tokens">Surfaces & borders</option>
                    </DocsSelect>
                  </div>
                  {props?.ornamentRenderer && (
                    <Button
                      size="sm"
                      variant="ghost"
                      color="neutral"
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
                      {preset.animateOrnaments
                        ? "Pause details"
                        : "Animate details · 20s"}
                    </Button>
                  )}
                  <div
                    className="theme-appearance"
                    role="group"
                    aria-label="Preview appearance"
                  >
                    <Button
                      variant="ghost"
                      color="neutral"
                      size="sm"
                      aria-label="Preview light appearance"
                      aria-pressed={preset.appearance === "light"}
                      onClick={() => chooseAppearance("light")}
                    >
                      <Sun size={14} />
                      Light
                    </Button>
                    <Button
                      variant="ghost"
                      color="neutral"
                      size="sm"
                      aria-label="Preview dark appearance"
                      aria-pressed={preset.appearance === "dark"}
                      onClick={() => chooseAppearance("dark")}
                    >
                      <Moon size={14} />
                      Dark
                    </Button>
                  </div>
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
                    {preset.skin === "dixy/prism-glass" && !preset.document && (
                      <div className="dixy-skin-backdrop theme-glass-note">
                        <span>Light, with a little depth.</span>
                        <span>Prism Glass</span>
                      </div>
                    )}
                    {previewView === "compare" ? (
                      <Suspense
                        fallback={<p role="status">Lining up themes…</p>}
                      >
                        <CompareScene current={preset} />
                      </Suspense>
                    ) : previewView === "email" ? (
                      <Suspense
                        fallback={<p role="status">Opening your inbox…</p>}
                      >
                        <EmailScene />
                      </Suspense>
                    ) : previewView === "dashboard" ? (
                      <Suspense
                        fallback={<p role="status">Loading dashboard…</p>}
                      >
                        <DashboardScene />
                      </Suspense>
                    ) : previewView === "player" ? (
                      <Suspense fallback={<p role="status">Loading player…</p>}>
                        <PlayerScene />
                      </Suspense>
                    ) : previewView === "states" ? (
                      <Suspense fallback={<p role="status">Loading states…</p>}>
                        <StateScene />
                      </Suspense>
                    ) : previewView === "workspace" ? (
                      <PreviewVoiceContext.Provider
                        value={previewVoice(
                          preset.document ? "none" : preset.skin,
                        )}
                      >
                        <WorkspaceScene />
                      </PreviewVoiceContext.Provider>
                    ) : previewView === "tokens" ? (
                      <>
                        <SurfacePreview />{" "}
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
                                  style={{
                                    background: toOklch(activeScale![step]),
                                  }}
                                  title={toOklch(activeScale![step])}
                                />
                                <small>{String(step).padStart(2, "0")}</small>
                              </div>
                            ))}
                          </div>
                          <div className="theme-contrast">
                            <Check size={13} />
                            <span>
                              Action text{" "}
                              <strong>{contrast.toFixed(2)}:1</strong> minimum
                              across default, hover & pressed
                            </span>
                          </div>
                        </section>
                      </>
                    ) : (
                      <Suspense
                        fallback={
                          <p role="status">Opening component gallery…</p>
                        }
                      >
                        <ThemeComponentGallery
                          onEditFoundations={() => setFoundationsOpen(true)}
                        />
                      </Suspense>
                    )}
                  </Theme>
                )}
                <div className="theme-preview-footer">
                  <a
                    className="theme-mobile-jump"
                    href="#theme-foundations"
                    onClick={(event) => {
                      event.preventDefault();
                      setFoundationsOpen(true);
                    }}
                  >
                    ↑ Edit foundations
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
              className="theme-customization-panel"
              aria-label="Theme customization"
            >
              <div className="theme-panel-heading">
                <h2>Make it yours</h2>
              </div>
              <section
                className="theme-skin-collection"
                aria-labelledby="theme-skins-heading"
              >
                <h2 id="theme-skins-heading">Starting theme</h2>
                <DocsSelect
                  aria-label="Starting theme"
                  value={preset.document ? "custom" : preset.skin}
                  onValueChange={(id) => {
                    // A removed custom option can produce a transient empty Select value.
                    if (
                      id === "none" ||
                      skinCatalog.some((skin) => skin.id === id)
                    )
                      void selectSkin(id);
                  }}
                >
                  <option value="custom" disabled={!preset.document}>
                    {preset.document
                      ? (activeSkin?.name ?? "Custom theme")
                      : "Custom theme"}
                  </option>
                  <option value="none">Original Dixy</option>
                  {skinCatalog.map((skin) => (
                    <option key={skin.id} value={skin.id}>
                      {skin.name}
                    </option>
                  ))}
                </DocsSelect>
                <ThemeInspectorAccordion>
                  <ThemeInspectorSection
                    title="Browse theme swatches"
                    value="swatches"
                  >
                    <div
                      className="theme-skin-strip"
                      role="group"
                      aria-label="Choose a skin"
                    >
                      {skinCatalog.map((skin) => (
                        <Button
                          key={skin.id}
                          variant="ghost"
                          color="neutral"
                          className="theme-skin-option"
                          aria-pressed={
                            preset.skin === skin.id && !preset.document
                          }
                          onClick={() => void selectSkin(skin.id)}
                          data-skin-preview={skin.slug}
                          style={
                            {
                              "--skin-color": skin.swatches[0],
                              "--skin-base": skin.swatches[2],
                              "--skin-mid": skin.swatches[1],
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
                          <span className="theme-skin-option-name">
                            {skin.name}
                            <span
                              className="theme-skin-selected"
                              aria-hidden="true"
                            >
                              {preset.skin === skin.id && !preset.document
                                ? "✓"
                                : "↗"}
                            </span>
                          </span>
                        </Button>
                      ))}
                    </div>
                  </ThemeInspectorSection>
                </ThemeInspectorAccordion>
                <div className="theme-skin-caption">
                  <span role="status">
                    {skinLoading
                      ? "Preparing your next look…"
                      : activeSkin
                        ? activeSkin.description
                        : "Start with a skin. Make it entirely your own."}
                  </span>
                  {(preset.skin !== "none" || preset.document) && (
                    <Button
                      size="sm"
                      variant="ghost"
                      color="neutral"
                      onClick={() =>
                        onChange({
                          ...skinThemePreset(preset.skin),
                          appearance: preset.appearance,
                          dir: preset.dir,
                          motion: preset.motion,
                          effects: preset.effects,
                        })
                      }
                    >
                      Restore skin defaults
                    </Button>
                  )}
                </div>
                {skinError && (
                  <p role="alert" className="theme-message">
                    {skinError}
                  </p>
                )}
              </section>
              <section
                className="theme-control-dock"
                aria-label="Theme foundations"
              >
                <div className="theme-primary-controls">
                  <Control label="Accent">
                    <DocsSelect
                      value={
                        preset.customAccent ? "custom" : preset.accentColor
                      }
                      onValueChange={(nextValue) =>
                        nextValue === "custom"
                          ? onChange({
                              ...preset,
                              customAccent: true,
                              lightness: Number(
                                Math.max(0.48, Math.min(0.83, seed[0])).toFixed(
                                  3,
                                ),
                              ),
                              chroma: Number(Math.min(0.3, seed[1]).toFixed(3)),
                              hue: Math.round(seed[2]),
                            })
                          : onChange({
                              ...preset,
                              accentColor:
                                nextValue as ThemePreset["accentColor"],
                              customAccent: false,
                            })
                      }
                    >
                      {colorFamilies.map((family) => (
                        <option key={family}>{family}</option>
                      ))}
                      <option value="custom">Custom OKLCH…</option>
                    </DocsSelect>
                  </Control>
                  <Control label="Corners">
                    <DocsSelect
                      value={preset.radius}
                      onValueChange={(nextValue) =>
                        update("radius", nextValue as ThemePreset["radius"])
                      }
                    >
                      {Object.keys(radiusPresets).map((radius) => (
                        <option key={radius} value={radius}>
                          {
                            (
                              {
                                none: "Square",
                                sm: "Small",
                                md: "Medium",
                                lg: "Large",
                                full: "Full",
                              } as Record<string, string>
                            )[radius]
                          }
                        </option>
                      ))}
                    </DocsSelect>
                  </Control>
                </div>
                <ThemeInspectorAccordion>
                  <ThemeInspectorSection
                    title="Base foundations"
                    value="foundations"
                  >
                    <div className="theme-primary-controls">
                      <Control label="Base">
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
                      <Control label="Font family">
                        <DocsSelect
                          value={preset.bodyFont}
                          onValueChange={(nextValue) =>
                            update(
                              "bodyFont",
                              nextValue as ThemePreset["bodyFont"],
                            )
                          }
                        >
                          {Object.entries(playgroundFonts).map(
                            ([key, font]) => (
                              <option key={key} value={key}>
                                {font.label}
                              </option>
                            ),
                          )}
                        </DocsSelect>
                      </Control>
                      <Control label="Elevation">
                        <DocsSelect
                          value={preset.depth}
                          onValueChange={(nextValue) =>
                            update("depth", nextValue as ThemePreset["depth"])
                          }
                        >
                          <option value="none">Flat</option>
                          <option value="raised">Raised</option>
                          <option value="floating">Floating</option>
                        </DocsSelect>
                      </Control>
                      <Control label="Control stroke">
                        <DocsSelect
                          value={preset.border}
                          onValueChange={(nextValue) =>
                            update("border", Number(nextValue) as 1 | 2)
                          }
                        >
                          <option value={1}>1px · Standard</option>
                          <option value={2}>2px · Bold</option>
                        </DocsSelect>
                      </Control>
                    </div>
                    <Button
                      variant="ghost"
                      color="neutral"
                      size="sm"
                      onClick={() => setFoundationsOpen(true)}
                    >
                      <SlidersHorizontal size={15} /> Advanced foundations
                    </Button>
                  </ThemeInspectorSection>
                </ThemeInspectorAccordion>
              </section>
              <ThemeRecipeMixer preset={preset} onChange={onChange} />
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
