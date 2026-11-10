import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Moon, Pause, Play, RotateCcw, Sun } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  Heading,
  Radio,
  RadioGroup,
  Slider,
  Switch,
  Text,
  TextField,
  Theme,
  Toggle,
  ToggleGroup,
} from "@dixy-ui/react";
import {
  playgroundThemeProps,
  skinCatalog,
  skinThemePreset,
} from "../lib/theme-playground";
import {
  deduplicateSkinStyles,
  loadMaterialCSS,
  loadSkinCSS,
} from "../lib/theme-skin-catalogue";
import { ShaderBackdrop } from "../lab/shader-backdrop";
import { shaderPairings } from "../lab/shader-pairings";
import { shaderPrograms } from "../lab/shader-programs";
import type { ShaderStatus } from "../lab/shader-runtime";
import "../styles/shader-lab.css";

/** Prototype pairings. A skin gets a shader only after it is reviewed here. */
const labSkins = shaderPairings;
type LabSlug = (typeof labSkins)[number]["slug"];

const scenes = [
  { value: "hero", label: "Hero" },
  { value: "surfaces", label: "Surfaces" },
  { value: "backdrop", label: "Backdrop" },
] as const;
type Scene = (typeof scenes)[number]["value"];

const speedMarks = [0.25, 0.5, 1, 1.5, 2];
const optInKey = "dixy-lab-shader";
/** Mirrors MAX_DPR in the runtime; shown so the numbers add up. */
const maxDpr = 1.5;

export const Route = createFileRoute("/lab/shaders")({
  validateSearch: (search: Record<string, unknown>): { skin?: LabSlug } => ({
    skin: labSkins.some((entry) => entry.slug === search.skin)
      ? (search.skin as LabSlug)
      : undefined,
  }),
  loaderDeps: ({ search }) => ({ slug: search.skin ?? labSkins[0].slug }),
  loader: async ({ deps }) => {
    const id = skinCatalog.find((skin) => skin.slug === deps.slug)!.id;
    try {
      const preset = skinThemePreset(id);
      return {
        id,
        css: await loadSkinCSS(id),
        materialCSS:
          preset.material !== "inherit" ? await loadMaterialCSS() : "",
      };
    } catch {
      return { id, css: "", materialCSS: "" };
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: "Shader lab — Dixy UI" },
      {
        name: "description",
        content:
          "Opt-in WebGL backdrops for Dixy skins, driven by theme tokens.",
      },
    ],
    styles: [
      ...(loaderData?.css
        ? [{ "data-dixy-skin-style": loaderData.id, children: loaderData.css }]
        : []),
      ...(loaderData?.materialCSS
        ? [{ children: loaderData.materialCSS }]
        : []),
    ],
  }),
  component: ShaderLab,
});

type Tone = "live" | "idle" | "warn";

function describe(
  status: ShaderStatus | null,
  enabled: boolean,
): { text: string; tone: Tone } {
  if (!enabled) return { text: "Off · static backdrop", tone: "idle" };
  if (!status) return { text: "Starting…", tone: "idle" };
  switch (status.state) {
    case "running":
      return { text: `Running · ${status.fps} fps`, tone: "live" };
    case "still":
      return status.reason === "paused"
        ? { text: "Paused", tone: "idle" }
        : { text: "Still frame · reduced motion", tone: "idle" };
    case "hidden":
      return { text: "Paused · off screen", tone: "idle" };
    case "unsupported":
      return { text: "WebGL unavailable · static backdrop", tone: "warn" };
    case "lost":
      return { text: "Context lost · waiting to restore", tone: "warn" };
  }
}

function skinName(slug: string) {
  return skinCatalog.find((skin) => skin.slug === slug)!.name;
}

function ShaderLab() {
  const { skin } = Route.useSearch();
  const { id } = Route.useLoaderData();
  const navigate = Route.useNavigate();
  const entry = labSkins.find((item) => item.slug === skin) ?? labSkins[0];
  const meta = skinCatalog.find((item) => item.id === id)!;
  const program = shaderPrograms[entry.program];

  const [appearance, setAppearance] = useState<"light" | "dark">(
    meta.appearance,
  );
  useEffect(() => setAppearance(meta.appearance), [meta.appearance]);

  // Opt-in is a per-viewer convenience, so browser storage is enough. It can
  // throw in private windows, and the page must work without it.
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    try {
      setEnabled(localStorage.getItem(optInKey) === "on");
    } catch {}
  }, []);
  function toggle(next: boolean) {
    setEnabled(next);
    try {
      localStorage.setItem(optInKey, next ? "on" : "off");
    } catch {}
  }

  const [scene, setScene] = useState<Scene>("hero");
  const [speed, setSpeed] = useState(1);
  const [paused, setPaused] = useState(false);
  const [restartKey, setRestartKey] = useState(0);
  const [status, setStatus] = useState<ShaderStatus | null>(null);
  useEffect(() => setStatus(null), [enabled, entry.program]);
  useEffect(() => deduplicateSkinStyles(id), [id]);

  const themeProps = useMemo(
    () => playgroundThemeProps({ ...skinThemePreset(id), appearance }),
    [id, appearance],
  );
  const failed = status?.state === "unsupported";
  const live = enabled && !failed;
  const reducedMotion =
    status?.state === "still" && status.reason === "reduced-motion";
  const summary = describe(status, enabled);
  const size =
    status && (status.state === "running" || status.state === "still")
      ? status
      : null;
  const tokens = program.colors[appearance];

  function selectSkin(value: unknown) {
    if (typeof value !== "string") return;
    navigate({
      search: { skin: value as LabSlug },
      replace: true,
      resetScroll: false,
    });
  }

  return (
    <Theme {...themeProps} className="shader-lab">
      <header className="shader-lab-bar">
        <div className="shader-lab-title">
          <Link to="/" className="shader-lab-back">
            <ArrowLeft size={16} aria-hidden="true" />
            <span className="shader-lab-back-text">Dixy</span>
          </Link>
          <span className="shader-lab-divider" aria-hidden="true" />
          <Heading as="h1" size="sm">
            Shader lab
          </Heading>
          <Badge variant="soft">Prototype</Badge>
        </div>
        <ToggleGroup
          aria-label="Appearance"
          attached
          value={[appearance]}
          onValueChange={(value) =>
            value[0] && setAppearance(value[0] as "light" | "dark")
          }
        >
          <Toggle value="light" size="sm" variant="soft" color="neutral">
            <Sun size={14} aria-hidden="true" /> Light
          </Toggle>
          <Toggle value="dark" size="sm" variant="soft" color="neutral">
            <Moon size={14} aria-hidden="true" /> Dark
          </Toggle>
        </ToggleGroup>
      </header>

      <div className="shader-lab-workbench">
        <section
          className="shader-lab-stage"
          aria-label="Preview"
          data-shader={live ? entry.program : undefined}
          data-scene={scene}
        >
          {live ? (
            <ShaderBackdrop
              key={entry.program}
              program={entry.program}
              appearance={appearance}
              tokenKey={id}
              speed={speed}
              paused={paused}
              restartKey={restartKey}
              onStatus={setStatus}
            />
          ) : null}

          <div className="shader-lab-stage-bar">
            <ToggleGroup
              aria-label="Preview content"
              attached
              value={[scene]}
              onValueChange={(value) => value[0] && setScene(value[0] as Scene)}
            >
              {scenes.map((item) => (
                <Toggle
                  key={item.value}
                  value={item.value}
                  size="sm"
                  variant="soft"
                  color="neutral"
                >
                  {item.label}
                </Toggle>
              ))}
            </ToggleGroup>
          </div>

          {scene === "backdrop" ? null : (
            <div className="shader-lab-scene">
              {scene === "hero" ? (
                <section
                  className="shader-lab-hero"
                  aria-labelledby="lab-headline"
                >
                  <Text
                    as="span"
                    size="sm"
                    tone="muted"
                    className="shader-lab-eyebrow"
                  >
                    {meta.voice.eyebrow}
                  </Text>
                  <Heading
                    as="h2"
                    id="lab-headline"
                    className="shader-lab-display"
                  >
                    {meta.voice.headline}
                  </Heading>
                  <Text size="lg">{meta.voice.body}</Text>
                  <div className="shader-lab-actions">
                    <Button size="lg">{meta.voice.primary}</Button>
                    <Button size="lg" variant="outline" color="neutral">
                      {meta.voice.secondary}
                    </Button>
                  </div>
                </section>
              ) : (
                <Card.Root className="shader-lab-sample">
                  <Card.Content>
                    <Heading as="h2" size="sm">
                      Readability check
                    </Heading>
                    <Text size="sm" tone="muted">
                      Content sits on surfaces, so the shader never sits
                      directly under body text.
                    </Text>
                    <label className="shader-lab-field">
                      <Text as="span" size="sm">
                        Callsign
                      </Text>
                      <TextField placeholder="Type something" />
                    </label>
                    <Slider.Root defaultValue={40}>
                      <Slider.Control>
                        <Slider.Track>
                          <Slider.Indicator />
                        </Slider.Track>
                        <Slider.Thumb aria-label="Depth" />
                      </Slider.Control>
                    </Slider.Root>
                    <div className="shader-lab-actions">
                      <Button size="sm">{meta.voice.primary}</Button>
                      <Button size="sm" variant="ghost" color="neutral">
                        Cancel
                      </Button>
                    </div>
                  </Card.Content>
                </Card.Root>
              )}
            </div>
          )}

          <div className="shader-lab-hud" data-tone={summary.tone}>
            <span className="shader-lab-dot" aria-hidden="true" />
            <span>{summary.text}</span>
            {size ? (
              <span className="shader-lab-hud-meta">
                {size.width}×{size.height}
              </span>
            ) : null}
          </div>
        </section>

        <aside className="shader-lab-inspector" aria-label="Shader controls">
          <section className="shader-lab-panel">
            <label className="shader-lab-row">
              <span className="shader-lab-row-text">
                <Text as="span" className="shader-lab-strong">
                  WebGL backdrop
                </Text>
                <Text as="span" size="sm" tone="muted" aria-live="polite">
                  {summary.text}
                </Text>
              </span>
              <Switch.Root checked={enabled} onCheckedChange={toggle}>
                <Switch.Thumb />
              </Switch.Root>
            </label>
            <Text size="sm" tone="muted">
              Off by default. It reads its colours from theme tokens and holds
              one frame when reduced motion is on.
            </Text>
          </section>

          <section className="shader-lab-panel" aria-labelledby="lab-shader">
            <h2 id="lab-shader" className="shader-lab-section">
              Shader
            </h2>
            <RadioGroup
              aria-labelledby="lab-shader"
              value={entry.slug}
              onValueChange={selectSkin}
              className="shader-lab-options"
            >
              {labSkins.map((item) => (
                <label
                  key={item.slug}
                  className="shader-lab-option"
                  data-selected={item.slug === entry.slug || undefined}
                >
                  <Radio.Root value={item.slug} size="sm">
                    <Radio.Indicator />
                  </Radio.Root>
                  <span className="shader-lab-option-text">
                    <span className="shader-lab-strong">{item.label}</span>
                    <Text as="span" size="sm" tone="muted">
                      {skinName(item.slug)}
                    </Text>
                  </span>
                  <code className="shader-lab-code">{item.program}</code>
                </label>
              ))}
            </RadioGroup>
          </section>

          <section className="shader-lab-panel" aria-labelledby="lab-playback">
            <h2 id="lab-playback" className="shader-lab-section">
              Playback
            </h2>
            <div className="shader-lab-buttons">
              <Button
                size="sm"
                variant="soft"
                color="neutral"
                onClick={() => setPaused((value) => !value)}
                disabled={!live || reducedMotion}
                aria-pressed={paused}
              >
                {paused ? (
                  <Play size={14} aria-hidden="true" />
                ) : (
                  <Pause size={14} aria-hidden="true" />
                )}
                {paused ? "Play" : "Pause"}
              </Button>
              <Button
                size="sm"
                variant="soft"
                color="neutral"
                onClick={() => setRestartKey((value) => value + 1)}
                disabled={!live || reducedMotion}
              >
                <RotateCcw size={14} aria-hidden="true" /> Restart
              </Button>
            </div>
            <Slider.Root
              value={speedMarks.indexOf(speed)}
              min={0}
              max={speedMarks.length - 1}
              step={1}
              disabled={!live || reducedMotion}
              onValueChange={(value) =>
                setSpeed(speedMarks[value as number] ?? 1)
              }
              className="shader-lab-speed"
            >
              <div className="shader-lab-speed-head">
                <Slider.Label>Speed</Slider.Label>
                <output className="shader-lab-code">{speed}×</output>
              </div>
              <Slider.Control>
                <Slider.Track>
                  <Slider.Indicator />
                </Slider.Track>
                <Slider.Thumb
                  aria-label="Speed"
                  getAriaValueText={(_, value) => `${speedMarks[value]}×`}
                />
              </Slider.Control>
            </Slider.Root>
            {reducedMotion ? (
              <Text size="sm" tone="muted">
                Your system asks for reduced motion, so playback controls are
                off.
              </Text>
            ) : null}
          </section>

          <section className="shader-lab-panel" aria-labelledby="lab-tokens">
            <h2 id="lab-tokens" className="shader-lab-section">
              Token inputs · {appearance}
            </h2>
            <dl className="shader-lab-tokens">
              {(
                [
                  ["deep", "uDeep", tokens.deep],
                  ["mid", "uMid", tokens.mid],
                  ["light", "uLight", tokens.light],
                ] as const
              ).map(([role, uniform, token]) => (
                <div key={role} className="shader-lab-token">
                  <span
                    className="shader-lab-swatch"
                    style={{ background: `var(${token})` }}
                    aria-hidden="true"
                  />
                  <dt className="shader-lab-code">{uniform}</dt>
                  <dd className="shader-lab-code shader-lab-muted">
                    {token.replace("--dixy-color-", "")}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="shader-lab-panel" aria-labelledby="lab-render">
            <h2 id="lab-render" className="shader-lab-section">
              Render
            </h2>
            <dl className="shader-lab-stats">
              <div>
                <dt>Canvas</dt>
                <dd>{size ? `${size.width}×${size.height}` : "—"}</dd>
              </div>
              <div>
                <dt>Frame rate</dt>
                <dd>{status?.state === "running" ? `${status.fps}` : "—"}</dd>
              </div>
              <div>
                <dt>Base resolution</dt>
                <dd>{Math.round(program.resolution * 100)}%</dd>
              </div>
              <div>
                <dt>Adaptive quality</dt>
                <dd>{size ? `${Math.round(size.quality * 100)}%` : "—"}</dd>
              </div>
              <div>
                <dt>Pixel ratio cap</dt>
                <dd>{maxDpr}×</dd>
              </div>
              <div>
                <dt>Context</dt>
                <dd>WebGL 1</dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </Theme>
  );
}
