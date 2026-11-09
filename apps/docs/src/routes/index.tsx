import { createFileRoute, Link } from "@tanstack/react-router";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  Accessibility,
  ArrowRight,
  ArrowUpRight,
  Blocks,
  Check,
  Copy,
  Layers,
  Moon,
  Shuffle,
  Sparkles,
  Sun,
} from "lucide-react";
import {
  Badge,
  Card,
  Chip,
  Heading,
  IconButton,
  Kbd,
  Select,
  Separator,
  Slider,
  Switch,
  Text,
  TextField,
  Theme,
  Toggle,
  ToggleGroup,
} from "@dixy-ui/react";
import { DixyMark } from "../components/dixy-mark";
import { CodeBlock } from "../components/code-block";
import { ButtonAnchor, ButtonLink } from "../components/button-link";
import { LandingWindow } from "../components/landing-window";
import { useAppAppearance } from "../components/app-appearance-provider";
import {
  PreviewVoiceContext,
  previewVoice,
} from "../components/theme-preview-voice";
import {
  playgroundThemeProps,
  serializeThemePreset,
  skinCatalog,
  skinThemePreset,
  type ThemePreset,
} from "../lib/theme-playground";
import { installedThemeDocuments } from "../lib/theme-authoring";
import {
  deduplicateSkinStyles,
  loadMaterialCSS,
  loadSkinCSS,
  prepareSkin,
} from "../lib/theme-skin-catalogue";
import { componentRegistry } from "../registry/components";
import "../styles/landing.css";

/** The URL carries the starter's slug ("living-forest"); the app keys skins by id. */
function starterIdFromSlug(slug: string | undefined) {
  return skinCatalog.find((skin) => skin.slug === slug)?.id ?? "none";
}
function slugFromStarterId(id: string) {
  return skinCatalog.find((skin) => skin.id === id)?.slug;
}

export const Route = createFileRoute("/")({
  // Unknown slugs are dropped, so a stale or mistyped link falls back to Original Dixy.
  validateSearch: (search: Record<string, unknown>): { starter?: string } => ({
    starter:
      typeof search.starter === "string" &&
      skinCatalog.some((skin) => skin.slug === search.starter)
        ? search.starter
        : undefined,
  }),
  loaderDeps: ({ search }) => ({ id: starterIdFromSlug(search.starter) }),
  // Inline the starter's CSS on the server, like /playground, so a shared
  // link paints in its theme before hydration instead of flashing the default.
  loader: async ({ deps }) => {
    try {
      const preset = skinThemePreset(deps.id);
      return {
        id: deps.id,
        css: await loadSkinCSS(deps.id),
        materialCSS:
          preset.material !== "inherit" ? await loadMaterialCSS() : "",
      };
    } catch {
      // The client retries through prepareSkin; the page still renders.
      return { id: deps.id, css: "", materialCSS: "" };
    }
  },
  head: ({ loaderData }) => ({
    styles: [
      ...(loaderData?.css
        ? [{ "data-dixy-skin-style": loaderData.id, children: loaderData.css }]
        : []),
      ...(loaderData?.materialCSS
        ? [{ children: loaderData.materialCSS }]
        : []),
    ],
  }),
  component: Landing,
});

const installCommand = "pnpm add @dixy-ui/react @dixy-ui/themes";

const original = {
  id: "none",
  name: "Original Dixy",
  description: "Warm and expressive. The default.",
  swatches: ["#7043ce", "#c9b8f0", "#fcfaf7"],
} as const;
const starters = [original, ...skinCatalog];
const starterItems = starters.map((s) => ({ value: s.id, label: s.name }));

type Appearance = "light" | "dark";

/**
 * The page-wide starter. The URL is the source of truth, so a reload or a
 * shared link keeps the theme. Selection loads the starter's CSS through the
 * playground's own loader before committing the URL, so the page never
 * renders a skin whose stylesheet is missing; a counter drops stale loads.
 */
function useStarter() {
  const { starter } = Route.useSearch();
  const navigate = Route.useNavigate();
  const committed = starterIdFromSlug(starter);
  const preset = useMemo(() => skinThemePreset(committed), [committed]);
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState("");
  const request = useRef(0);
  const { setDocsTheme } = useAppAppearance();
  useEffect(() => {
    // Covers a server load that failed, and removes the duplicate style the
    // route head adds once the client has already injected the same skin.
    void prepareSkin(committed, null)
      .then(() => deduplicateSkinStyles(committed))
      .catch(() =>
        setError("That theme could not load. Choose it again to retry."),
      );
  }, [committed]);
  function select(id: string) {
    const generation = ++request.current;
    const next = skinThemePreset(id);
    // The starter you pick on the landing page carries into the docs.
    setDocsTheme({ skin: id });
    setPending(id);
    setError("");
    void (async () => {
      await prepareSkin(id, null);
      if (next.material !== "inherit")
        await import("@dixy-ui/react/materials.css");
      if (request.current !== generation) return;
      const slug = slugFromStarterId(id);
      // Replace, not push: browsing 33 starters should not fill Back history.
      await navigate({
        search: slug ? { starter: slug } : {},
        replace: true,
        resetScroll: false,
      });
    })()
      .then(() => {
        if (request.current === generation) setPending(null);
      })
      .catch(() => {
        if (request.current !== generation) return;
        setPending(null);
        setError("That theme could not load. Choose it again to retry.");
      });
  }
  return { preset, pending, error, select };
}

function swatchStyle(swatches: readonly string[]) {
  return {
    "--starter-a": swatches[0],
    "--starter-b": swatches[1],
    "--starter-c": swatches[2],
  } as CSSProperties;
}

function InstallCommand() {
  const [copied, setCopied] = useState<"idle" | "done" | "failed">("idle");
  useEffect(() => {
    if (copied === "idle") return;
    const timer = window.setTimeout(() => setCopied("idle"), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);
  return (
    <div className="landing-install">
      <TextField
        readOnly
        value={installCommand}
        aria-label="Install command"
        onFocus={(event) => event.currentTarget.select()}
      />
      <IconButton
        variant="outline"
        color="neutral"
        aria-label="Copy install command"
        onClick={() =>
          navigator.clipboard
            .writeText(installCommand)
            .then(() => setCopied("done"))
            .catch(() => setCopied("failed"))
        }
      >
        {copied === "done" ? <Check size={16} /> : <Copy size={16} />}
      </IconButton>
      <span className="sr-only" role="status">
        {copied === "done"
          ? "Install command copied."
          : copied === "failed"
            ? "Copy failed. Select the command to copy it."
            : ""}
      </span>
    </div>
  );
}

/** Short consumer snippet for the chosen starter; the playground owns the full export. */
function starterSnippet(id: string, appearance: Appearance) {
  const meta = skinCatalog.find((skin) => skin.id === id);
  if (!meta)
    return [
      'import "@dixy-ui/react/styles.css";',
      'import { Theme } from "@dixy-ui/react";',
      "",
      `<Theme appearance="${appearance}" accentColor="purple">`,
      "  <App />",
      "</Theme>",
    ].join("\n");
  return [
    'import "@dixy-ui/react/styles.css";',
    `import "@dixy-ui/themes/${meta.slug}.css";`,
    'import { Theme } from "@dixy-ui/react";',
    `import { ${meta.symbol} } from "@dixy-ui/themes/${meta.slug}";`,
    "",
    `<Theme skin={${meta.symbol}} appearance="${appearance}">`,
    "  <App />",
    "</Theme>",
  ].join("\n");
}

interface StudioProps {
  preset: ThemePreset;
  pending: string | null;
  error: string;
  appearance: Appearance;
  onSelect: (id: string) => void;
  onAppearance: (appearance: Appearance) => void;
}

/** Floating toolbar over the app window: the quickest way to restyle the page. */
function ThemeDock({
  preset,
  pending,
  error,
  appearance,
  onSelect,
  onAppearance,
}: StudioProps) {
  const current = pending ?? preset.skin;
  const active = starters.find((s) => s.id === current) ?? original;
  function shuffle() {
    const others = starters.filter((s) => s.id !== current);
    onSelect(others[Math.floor(Math.random() * others.length)]!.id);
  }
  return (
    <div className="landing-dock" role="toolbar" aria-label="Theme">
      <span
        className="landing-dock-swatch"
        style={swatchStyle(active.swatches)}
        aria-hidden="true"
      />
      <Select.Root
        value={current}
        items={starterItems}
        onValueChange={(value) => value && onSelect(String(value))}
      >
        <Select.Trigger size="sm" aria-label="Starter theme">
          <Select.Value />
          <Select.Icon />
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner sideOffset={8}>
            <Select.Popup size="sm">
              <Select.List>
                {starters.map((s) => (
                  <Select.Item key={s.id} value={s.id}>
                    <span
                      className="landing-dock-swatch is-small"
                      style={swatchStyle(s.swatches)}
                      aria-hidden="true"
                    />
                    <Select.ItemText>{s.name}</Select.ItemText>
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
      <IconButton
        size="sm"
        variant="ghost"
        color="neutral"
        aria-label="Shuffle starter theme"
        onClick={shuffle}
      >
        <Shuffle size={15} />
      </IconButton>
      <Separator orientation="vertical" className="landing-dock-rule" />
      <ToggleGroup
        aria-label="Appearance"
        attached
        value={[appearance]}
        onValueChange={(value) =>
          value[0] && onAppearance(value[0] as Appearance)
        }
      >
        <Toggle value="light" size="sm" variant="soft" color="neutral">
          <Sun size={14} aria-hidden="true" />
          <span className="landing-dock-label">Light</span>
        </Toggle>
        <Toggle value="dark" size="sm" variant="soft" color="neutral">
          <Moon size={14} aria-hidden="true" />
          <span className="landing-dock-label">Dark</span>
        </Toggle>
      </ToggleGroup>
      <ButtonLink
        to="/playground"
        search={{ theme: serializeThemePreset({ ...preset, appearance }) }}
        size="sm"
        className="landing-dock-cta"
      >
        Customise <ArrowUpRight size={14} />
      </ButtonLink>
      <span className="sr-only" role="status">
        {pending ? "Loading theme…" : error || `${active.name} applied.`}
      </span>
    </div>
  );
}

function StarterGallery({ preset, pending, onSelect }: StudioProps) {
  return (
    <section
      id="themes"
      className="landing-section"
      aria-labelledby="themes-heading"
    >
      <div className="landing-section-head landing-section-head-row">
        <div>
          <Text as="span" className="landing-kicker" tone="muted">
            STARTER THEMES
          </Text>
          <Heading as="h2" id="themes-heading" className="landing-title">
            {skinCatalog.length} personalities.
            <br />
            One component API.
          </Heading>
        </div>
        <Text tone="muted" className="landing-section-aside">
          Every starter is data: a material, a frame, a character and a chrome,
          composed over the same accessible components. Pick one and the whole
          page changes with it, down to the focus rings.
        </Text>
      </div>
      <ToggleGroup
        className="landing-gallery"
        aria-label="Starter theme"
        value={[pending ?? preset.skin]}
        onValueChange={(value) => value[0] && onSelect(value[0])}
      >
        {starters.map((skin) => (
          <Toggle
            key={skin.id}
            value={skin.id}
            variant="outline"
            color="neutral"
            className="landing-gallery-item"
            style={swatchStyle(skin.swatches)}
          >
            <span className="landing-gallery-swatch" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="landing-gallery-name">{skin.name}</span>
            <span className="landing-gallery-note">{skin.description}</span>
          </Toggle>
        ))}
      </ToggleGroup>
    </section>
  );
}

function Bento({ preset }: { preset: ThemePreset }) {
  const document = installedThemeDocuments[preset.skin];
  const parts = document
    ? [
        ["Material", document.recipes.material.id],
        ["Frame", document.recipes.frame.id],
        ["Body", preset.bodyFont],
        ["Heading", preset.headingFont],
      ]
    : [
        ["Material", "matte"],
        ["Frame", "none"],
        ["Body", preset.bodyFont],
        ["Heading", preset.headingFont],
      ];
  const [haptics, setHaptics] = useState(true);
  return (
    <section className="landing-section" aria-labelledby="why-heading">
      <div className="landing-section-head">
        <Text as="span" className="landing-kicker" tone="muted">
          WHY DIXY
        </Text>
        <Heading as="h2" id="why-heading" className="landing-title">
          Character without compromise.
        </Heading>
      </div>
      <div className="landing-bento">
        <Card.Root className="landing-bento-card landing-bento-wide">
          <Card.Header>
            <Accessibility size={18} aria-hidden="true" />
            <Card.Title>Accessible by construction</Card.Title>
          </Card.Header>
          <Card.Content>
            <Card.Description>
              Built on Base UI, so focus, keyboard, ARIA and state come from a
              tested foundation. Themes change paint, never behaviour.
            </Card.Description>
            <div className="landing-keys" aria-hidden="true">
              <Kbd>Tab</Kbd>
              <Kbd>←</Kbd>
              <Kbd>→</Kbd>
              <Kbd>Space</Kbd>
              <Kbd>Esc</Kbd>
            </div>
            <label className="landing-setting">
              <Text size="sm">Keyboard-first toggle, try Space</Text>
              <Switch.Root checked={haptics} onCheckedChange={setHaptics}>
                <Switch.Thumb />
              </Switch.Root>
            </label>
          </Card.Content>
        </Card.Root>

        <Card.Root className="landing-bento-card">
          <Card.Header>
            <Layers size={18} aria-hidden="true" />
            <Card.Title>Themes are data</Card.Title>
          </Card.Header>
          <Card.Content>
            <Card.Description>
              The parts of the theme you are looking at right now:
            </Card.Description>
            <dl className="landing-parts">
              {parts.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>
                    <Chip variant="soft" color="neutral">
                      {value}
                    </Chip>
                  </dd>
                </div>
              ))}
            </dl>
          </Card.Content>
        </Card.Root>

        <Card.Root className="landing-bento-card">
          <Card.Header>
            <Blocks size={18} aria-hidden="true" />
            <Card.Title>Plain CSS, layered</Card.Title>
          </Card.Header>
          <Card.Content>
            <Card.Description>
              One stylesheet of variables in cascade layers. No Tailwind
              compiler, and your own styles always win.
            </Card.Description>
            <div className="landing-layers" aria-hidden="true">
              <Badge variant="outline" color="neutral">
                @layer dixy.tokens
              </Badge>
              <Badge variant="outline" color="neutral">
                @layer dixy.components
              </Badge>
              <Badge variant="soft">your-app.css</Badge>
            </div>
          </Card.Content>
        </Card.Root>

        <Card.Root className="landing-bento-card landing-bento-wide">
          <Card.Header>
            <Sparkles size={18} aria-hidden="true" />
            <Card.Title>Tuned, not hard-coded</Card.Title>
          </Card.Header>
          <Card.Content>
            <Card.Description>
              Density, radius and motion are theme settings with sensible
              defaults. Reduced motion always wins over decoration.
            </Card.Description>
            <Slider.Root defaultValue={[64]} min={0} max={100}>
              <div className="landing-progress-label">
                <Slider.Label>Character</Slider.Label>
                <Slider.Value />
              </div>
              <Slider.Control>
                <Slider.Track>
                  <Slider.Indicator />
                </Slider.Track>
                <Slider.Thumb aria-label="Character" />
              </Slider.Control>
            </Slider.Root>
          </Card.Content>
        </Card.Root>
      </div>
    </section>
  );
}

const featuredComponents = [
  "button",
  "dialog",
  "select",
  "tabs",
  "menu",
  "toast",
  "table",
  "command",
];

function Landing() {
  const { appearance, setAppearance } = useAppAppearance();
  const starter = useStarter();
  // The whole page wears the chosen starter. The header, dock and gallery all
  // drive the same state, and light/dark is the site-wide appearance.
  const themeProps = useMemo(
    () => playgroundThemeProps({ ...starter.preset, appearance }),
    [starter.preset, appearance],
  );
  const voice = previewVoice(starter.preset.skin);
  const componentCount = Object.keys(componentRegistry).length;
  const featured = featuredComponents.filter((slug) =>
    Object.hasOwn(componentRegistry, slug),
  ) as (keyof typeof componentRegistry)[];
  const studio: StudioProps = {
    preset: starter.preset,
    pending: starter.pending,
    error: starter.error,
    appearance,
    onSelect: starter.select,
    onAppearance: setAppearance,
  };
  const playgroundSearch = {
    theme: serializeThemePreset({ ...starter.preset, appearance }),
  };

  return (
    <Theme {...themeProps} className="landing">
      <PreviewVoiceContext.Provider value={voice}>
        <a href="#landing-main" className="skip-link">
          Skip to content
        </a>
        <header className="landing-header">
          <Link to="/" className="landing-brand" aria-label="Dixy UI home">
            <DixyMark size={24} />
            <strong>
              dixy<span>UI</span>
            </strong>
          </Link>
          <nav aria-label="Primary">
            <ButtonLink
              to="/docs/installation"
              variant="ghost"
              color="neutral"
              size="sm"
            >
              Docs
            </ButtonLink>
            <ButtonLink
              to="/docs/components/$component"
              params={{ component: "button" }}
              variant="ghost"
              color="neutral"
              size="sm"
              className="landing-nav-wide"
            >
              Components
            </ButtonLink>
            <ButtonAnchor
              href="#themes"
              variant="ghost"
              color="neutral"
              size="sm"
              className="landing-nav-wide"
            >
              Themes
            </ButtonAnchor>
            <ButtonLink
              to="/playground"
              variant="ghost"
              color="neutral"
              size="sm"
            >
              Playground
            </ButtonLink>
          </nav>
          <IconButton
            variant="ghost"
            color="neutral"
            size="sm"
            aria-label={`Switch to ${appearance === "light" ? "dark" : "light"} appearance`}
            onClick={() =>
              setAppearance(appearance === "light" ? "dark" : "light")
            }
          >
            {appearance === "light" ? <Moon size={17} /> : <Sun size={17} />}
          </IconButton>
        </header>

        <main id="landing-main" tabIndex={-1}>
          <section className="landing-hero" aria-labelledby="hero-heading">
            <Badge variant="soft" className="landing-pill">
              0.1 alpha · Built on Base UI
            </Badge>
            <Heading as="h1" id="hero-heading" className="landing-display">
              Components with <em>character.</em>
            </Heading>
            <Text size="lg" tone="muted" className="landing-lede">
              Accessible React components with {skinCatalog.length} starter
              themes that change the whole feel of your product. Try one on this
              page.
            </Text>
            <div className="landing-ctas">
              <ButtonLink to="/docs/installation" size="lg">
                Get started <ArrowRight size={16} />
              </ButtonLink>
              <ButtonAnchor
                href="#themes"
                size="lg"
                variant="outline"
                color="neutral"
              >
                Browse themes
              </ButtonAnchor>
            </div>
            <InstallCommand />
            <Text size="sm" tone="muted">
              Provisional package names. Not yet published to npm.
            </Text>
          </section>

          <LandingWindow dock={<ThemeDock {...studio} />} />

          <StarterGallery {...studio} />

          <Bento preset={starter.preset} />

          <section className="landing-section" aria-labelledby="ship-heading">
            <div className="landing-snippet">
              <div>
                <Text as="span" className="landing-kicker" tone="muted">
                  SHIP IT
                </Text>
                <Heading as="h2" id="ship-heading" className="landing-title">
                  Same theme, in your app.
                </Heading>
                <Text tone="muted">
                  Starters are separate packages and stylesheets, so you only
                  pay for the one you import. The playground exports a full
                  preset with your own changes.
                </Text>
              </div>
              <CodeBlock
                code={starterSnippet(starter.preset.skin, appearance)}
                filename="app.tsx"
              />
            </div>
          </section>

          <section
            className="landing-section"
            aria-labelledby="components-heading"
          >
            <Card.Root className="landing-components">
              <Card.Content>
                <div>
                  <Heading as="h2" size="sm" id="components-heading">
                    {componentCount} components, documented
                  </Heading>
                  <Text size="sm" tone="muted">
                    Every one has a live playground, props table and
                    accessibility notes.
                  </Text>
                </div>
                <ul className="landing-component-chips">
                  {featured.map((slug) => (
                    <li key={slug}>
                      <ButtonLink
                        to="/docs/components/$component"
                        params={{ component: slug }}
                        size="sm"
                        variant="soft"
                        color="neutral"
                      >
                        {componentRegistry[slug].title}
                      </ButtonLink>
                    </li>
                  ))}
                </ul>
                <ButtonLink
                  to="/docs/components/$component"
                  params={{ component: "button" }}
                  size="sm"
                  variant="outline"
                  color="neutral"
                >
                  Browse all <ArrowRight size={14} />
                </ButtonLink>
              </Card.Content>
            </Card.Root>
          </section>

          <section className="landing-section" aria-labelledby="final-heading">
            <Card.Root className="landing-final">
              <Card.Content>
                <Heading as="h2" id="final-heading" className="landing-title">
                  Make one that feels like you.
                </Heading>
                <Text tone="muted">
                  Start from a starter, change the material, the frame and the
                  type, then export it.
                </Text>
                <div className="landing-ctas">
                  <ButtonLink
                    to="/playground"
                    search={playgroundSearch}
                    size="lg"
                  >
                    Open the theme playground <ArrowUpRight size={16} />
                  </ButtonLink>
                  <ButtonLink
                    to="/docs/installation"
                    size="lg"
                    variant="outline"
                    color="neutral"
                  >
                    Read the docs
                  </ButtonLink>
                </div>
              </Card.Content>
            </Card.Root>
          </section>
        </main>

        <footer className="landing-footer">
          <Separator />
          <div>
            <Text as="span" size="sm" tone="muted">
              <DixyMark size={13} /> Dixy UI
            </Text>
            <Text as="span" size="sm" tone="muted">
              Considered details. Open possibilities.
            </Text>
            <Text as="span" size="sm" tone="muted">
              Built in the open · 2026
            </Text>
          </div>
        </footer>
      </PreviewVoiceContext.Provider>
    </Theme>
  );
}
