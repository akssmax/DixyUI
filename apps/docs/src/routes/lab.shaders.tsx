import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  Field,
  Heading,
  Select,
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
import type { ShaderProgramId } from "../lab/shader-programs";
import type { ShaderStatus } from "../lab/shader-runtime";
import "../styles/shader-lab.css";

/** Prototype pairings. A skin gets a shader only after it is reviewed here. */
const labSkins = [
  { slug: "ocean-depths", program: "caustics", label: "Ocean caustics" },
  { slug: "phosphor-terminal", program: "phosphor", label: "Phosphor CRT" },
  { slug: "neon-night-market", program: "neonRain", label: "Neon rain" },
  {
    slug: "prism-glass",
    program: "iridescence",
    label: "Thin-film iridescence",
  },
  { slug: "diwali-lights", program: "bokeh", label: "Lamp bokeh" },
  { slug: "solar-sail", program: "aurora", label: "Aurora and stars" },
] as const satisfies readonly {
  slug: string;
  program: ShaderProgramId;
  label: string;
}[];
type LabSlug = (typeof labSkins)[number]["slug"];

const optInKey = "dixy-lab-shader";

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
          "Opt-in WebGL backdrops for Ocean Depths and Phosphor Terminal.",
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

function describe(status: ShaderStatus | null, enabled: boolean) {
  if (!enabled) return "Off · static backdrop";
  if (!status) return "Starting…";
  switch (status.state) {
    case "running":
      return `Running · ${status.fps} fps`;
    case "still":
      return "Still frame · reduced motion is on";
    case "hidden":
      return "Paused · off screen";
    case "unsupported":
      return "WebGL unavailable · static backdrop";
    case "lost":
      return "Graphics context lost · waiting to restore";
  }
}

function ShaderLab() {
  const { skin } = Route.useSearch();
  const { id } = Route.useLoaderData();
  const navigate = Route.useNavigate();
  const entry = labSkins.find((item) => item.slug === skin) ?? labSkins[0];
  const meta = skinCatalog.find((item) => item.id === id)!;

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

  const [status, setStatus] = useState<ShaderStatus | null>(null);
  useEffect(() => setStatus(null), [enabled, entry.program]);
  useEffect(() => deduplicateSkinStyles(id), [id]);

  const themeProps = useMemo(
    () => playgroundThemeProps({ ...skinThemePreset(id), appearance }),
    [id, appearance],
  );
  const failed = status?.state === "unsupported";

  return (
    <Theme {...themeProps} className="shader-lab">
      <div
        className="shader-lab-stage"
        data-shader={enabled && !failed ? entry.program : undefined}
      >
        {enabled && !failed ? (
          <ShaderBackdrop
            key={entry.program}
            program={entry.program}
            appearance={appearance}
            tokenKey={id}
            onStatus={setStatus}
          />
        ) : null}

        <header className="shader-lab-bar">
          <Link to="/" className="shader-lab-back">
            <ArrowLeft size={16} aria-hidden="true" /> Dixy
          </Link>
          <Badge variant="soft">Lab · prototype</Badge>
        </header>

        <main className="shader-lab-main">
          <Card.Root className="shader-lab-controls">
            <Card.Content>
              <Heading as="h1" size="sm">
                Shader backdrops
              </Heading>
              <Text size="sm" tone="muted">
                An optional WebGL layer behind a theme. Off by default, it
                follows your theme tokens, and it freezes on one frame when
                reduced motion is on.
              </Text>

              <Field.Root>
                <Field.Label>Skin</Field.Label>
                <Select.Root
                  value={entry.slug}
                  onValueChange={(value) =>
                    value &&
                    navigate({
                      search: { skin: value as LabSlug },
                      replace: true,
                      resetScroll: false,
                    })
                  }
                  items={labSkins.map((item) => ({
                    value: item.slug,
                    label: skinCatalog.find((s) => s.slug === item.slug)!.name,
                  }))}
                >
                  <Select.Trigger size="sm">
                    <Select.Value />
                    <Select.Icon />
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Positioner sideOffset={8}>
                      <Select.Popup size="sm">
                        <Select.List>
                          {labSkins.map((item) => (
                            <Select.Item key={item.slug} value={item.slug}>
                              <Select.ItemText>
                                {
                                  skinCatalog.find((s) => s.slug === item.slug)!
                                    .name
                                }
                              </Select.ItemText>
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.List>
                      </Select.Popup>
                    </Select.Positioner>
                  </Select.Portal>
                </Select.Root>
              </Field.Root>

              <label className="shader-lab-row">
                <span>
                  <Text as="span" className="shader-lab-strong">
                    {entry.label}
                  </Text>
                  <Text as="span" size="sm" tone="muted" aria-live="polite">
                    {describe(status, enabled)}
                  </Text>
                </span>
                <Switch.Root checked={enabled} onCheckedChange={toggle}>
                  <Switch.Thumb />
                </Switch.Root>
              </label>

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
            </Card.Content>
          </Card.Root>

          <section className="shader-lab-hero" aria-labelledby="lab-headline">
            <Text
              as="span"
              size="sm"
              tone="muted"
              className="shader-lab-eyebrow"
            >
              {meta.voice.eyebrow}
            </Text>
            <Heading as="h2" id="lab-headline" className="shader-lab-display">
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

          <Card.Root className="shader-lab-sample">
            <Card.Content>
              <Heading as="h3" size="sm">
                Readability check
              </Heading>
              <Text size="sm" tone="muted">
                Content sits on surfaces, so the shader never sits directly
                under body text.
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
            </Card.Content>
          </Card.Root>
        </main>
      </div>
    </Theme>
  );
}
