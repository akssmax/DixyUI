import { createFileRoute } from "@tanstack/react-router";
import { useId, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  Box,
  Button,
  FabMenu,
  IconButton,
  Menu,
  Progress as DixyProgress,
  ProgressCircle,
  SplitButton,
  Spinner,
  Shape as DixyShape,
  Switch,
  Text,
  Theme,
  Toggle,
  ToggleGroup,
  Toolbar,
} from "@dixy-ui/react";
import {
  Bookmark,
  ChevronDown,
  Dumbbell,
  Heart,
  Pause,
  Pencil,
  Play,
  Plus,
  Share2,
  Timer,
  X,
} from "lucide-react";
import "@fontsource-variable/bricolage-grotesque/standard.css";
import { useAppAppearance } from "../components/app-appearance-provider";
import {
  expressiveShapes as shapeNames,
  shapePolygon,
  springEasing,
  type ExpressiveShape as ShapeName,
} from "@dixy-ui/tokens";
import "../styles/expressive-lab.css";

/**
 * Material 3 Expressive ideas, mocked with Dixy: a shape library that morphs,
 * shape change on press and selection, connected groups, wavy
 * progress, a morphing loader, split button, floating toolbar, FAB menu and
 * emphasized type on the fluid display roles. Shapes are decorative layers;
 * they never clip content or focus rings.
 */
export const Route = createFileRoute("/lab/expressive")({
  head: () => ({ meta: [{ title: "Expressive lab — Dixy UI" }] }),
  component: ExpressiveLab,
});

function ExpressiveLab() {
  const { appearance, setAppearance } = useAppAppearance();
  const [expressive, setExpressive] = useState(true);
  // CSS-only transitions (clip-path, radius, flex-grow) use the same springs
  // as Motion, simulated into `linear()` easings.
  const motion = useMemo(() => {
    const scheme = expressive ? "expressive" : "standard";
    const main = springEasing(scheme, "spatial", "default");
    const fast = springEasing(scheme, "spatial", "fast");
    const slow = springEasing(scheme, "spatial", "slow");
    return {
      "--xp-spring": main.easing,
      "--xp-spring-ms": `${main.duration}ms`,
      "--xp-spring-fast": fast.easing,
      "--xp-spring-fast-ms": `${fast.duration}ms`,
      "--xp-spring-slow": slow.easing,
      "--xp-spring-slow-ms": `${slow.duration}ms`,
    } as CSSProperties;
  }, [expressive]);

  return (
    <Theme
      appearance={appearance}
      accentColor="indigo"
      shape="pill"
      className="xp-page"
      style={motion}
    >
      <header className="xp-bar">
        <div>
          <h1 className="xp-title">Expressive lab</h1>
          <Text tone="muted" size="sm">
            Material 3 Expressive ideas built from Dixy parts and tokens.
          </Text>
        </div>
        <label className="xp-switch">
          <Text as="span" size="sm">
            Expressive springs
          </Text>
          <Switch.Root checked={expressive} onCheckedChange={setExpressive}>
            <Switch.Thumb />
          </Switch.Root>
        </label>
        <label className="xp-switch">
          <Text as="span" size="sm">
            Dark
          </Text>
          <Switch.Root
            checked={appearance === "dark"}
            onCheckedChange={(on) => setAppearance(on ? "dark" : "light")}
          >
            <Switch.Thumb />
          </Switch.Root>
        </label>
      </header>
      <main className="xp-grid">
        <Hero />
        <ShapeLibrary />
        <MorphButtons />
        <Progress />
        <Actions />
        <EmphasizedType />
      </main>
    </Theme>
  );
}

function Section({
  title,
  note,
  wide,
  children,
}: {
  title: string;
  note: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  const id = useId();
  return (
    <section
      className={`xp-section${wide ? " xp-wide" : ""}`}
      aria-labelledby={id}
    >
      <header className="xp-section-head">
        <h2 id={id} className="xp-section-title">
          {title}
        </h2>
        <Text tone="muted" size="sm">
          {note}
        </Text>
      </header>
      {children}
    </section>
  );
}

/** A decorative shape layer: the library Shape (SVG path, morphs on change). */
function Shape({
  name,
  className,
  style,
}: {
  name: ShapeName;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <DixyShape
      kind={name}
      className={`xp-shape${className ? " " + className : ""}`}
      style={style}
    />
  );
}

/* ------------------------------------------------------------------ */

const intensities = ["Easy", "Steady", "Hard"] as const;

function Hero() {
  const [level, setLevel] = useState<string[]>(["Steady"]);
  const minutes = { Easy: 28, Steady: 42, Hard: 55 }[
    level[0] as (typeof intensities)[number]
  ];
  return (
    <Section
      title="Today, as a hero"
      note="Accent surface, display.3xl numeral at heavy weight and narrow width, cookie badge, wavy progress, a connected group whose choice changes shape, not width."
      wide
    >
      <Box surface="accent" className="xp-hero">
        <div className="xp-hero-top">
          <p className="xp-eyebrow">Tuesday · week 6</p>
          <span className="xp-badge">
            <Shape name="cookie-9" className="xp-badge-shape" />
            <span className="xp-badge-text">
              <b>12</b>
              <span>day streak</span>
            </span>
          </span>
        </div>
        <p className="xp-hero-figure" aria-live="polite">
          <span className="xp-numeral">{minutes}</span>
          <span className="xp-unit">min</span>
        </p>
        <p className="xp-hero-sub">Lower body, three blocks and a stretch.</p>
        <WavyBar value={0.6} label="3 of 5 blocks done" onFill />
        <ToggleGroup
          aria-label="Intensity"
          value={level}
          onValueChange={(next) => next.length && setLevel(next)}
          className="xp-connected"
        >
          {intensities.map((name) => (
            <Toggle key={name} value={name} className="xp-connected-item">
              <span className="xp-check" aria-hidden="true">
                ✓
              </span>
              {name}
            </Toggle>
          ))}
        </ToggleGroup>
        <Button size="lg" className="xp-hero-cta">
          <Play size={20} aria-hidden="true" />
          Start session
        </Button>
      </Box>
    </Section>
  );
}

/* ------------------------------------------------------------------ */

function ShapeLibrary() {
  const [current, setCurrent] = useState<ShapeName>("cookie-9");
  return (
    <Section
      title="Shape library"
      note={`${shapeNames.length} shapes on one 96-point outline, so any two morph with a CSS transition. Pick one.`}
      wide
    >
      <div className="xp-library">
        <div className="xp-stage" aria-live="polite">
          <Shape name={current} className="xp-stage-shape" />
          <span className="xp-stage-label">{current}</span>
        </div>
        <div className="xp-swatches" role="group" aria-label="Shapes">
          {shapeNames.map((name) => (
            <button
              key={name}
              type="button"
              className="xp-swatch"
              aria-pressed={current === name}
              aria-label={name}
              title={name}
              onClick={() => setCurrent(name)}
            >
              <Shape name={name} />
            </button>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */

const sizes = [
  { id: "xs", label: "XS", px: 32 },
  { id: "sm", label: "S", px: 40 },
  { id: "md", label: "M", px: 56 },
  { id: "lg", label: "L", px: 96 },
  { id: "xl", label: "XL", px: 136 },
] as const;

function MorphButtons() {
  return (
    <Section
      title="Shape on press and selection"
      note="Five sizes from the library (xs–xl). Round buttons square off while pressed; shaped toggles morph their container when selected. Springs drive the corners."
    >
      <div className="xp-sizes">
        {sizes.map((s) => (
          <IconButton
            key={s.id}
            aria-label={`Play, ${s.label}`}
            morph
            size={s.id}
          >
            <Play aria-hidden="true" />
          </IconButton>
        ))}
      </div>
      <div className="xp-toggles">
        <Toggle
          aria-label="Like"
          size="lg"
          shapes={["circle", "cookie-9"]}
          className="xp-shape-toggle"
        >
          <Heart aria-hidden="true" />
        </Toggle>
        <Toggle
          aria-label="Save"
          size="lg"
          defaultPressed
          shapes={["square", "clover-4"]}
          className="xp-shape-toggle"
        >
          <Bookmark aria-hidden="true" />
        </Toggle>
        <Toggle morph variant="solid" aria-label="Rest day">
          Rest day
        </Toggle>
        <Button morph size="lg">
          <Dumbbell size={20} aria-hidden="true" />
          Log a set
        </Button>
      </div>
      <div className="xp-toggles">
        <Theme morph="press">
          <ToggleGroup aria-label="Standard group" defaultValue={["week"]}>
            <Toggle value="day" variant="solid">
              Day
            </Toggle>
            <Toggle value="week" variant="solid">
              Week
            </Toggle>
            <Toggle value="month" variant="solid">
              Month
            </Toggle>
          </ToggleGroup>
        </Theme>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */

function Progress() {
  const [value, setValue] = useState(0.35);
  return (
    <Section
      title="Loading and progress"
      note="Library parts under Theme progress=&quot;wave&quot;: a contained shape loader, a wavy ring with its numeral, and a wavy bar with its stop indicator. Reduced motion holds them still."
    >
      <Theme progress="wave">
        <div className="xp-progress-row">
          <Spinner contained size="lg" label="Loading plan" />
          <ProgressCircle
            aria-label="Weekly goal"
            value={Math.round(value * 100)}
            showValue
            className="xp-ring-lib"
          />
          <div className="xp-progress-actions">
            <Button
              variant="soft"
              onClick={() =>
                setValue((v) => (v >= 1 ? 0.02 : Math.min(1, v + 0.15)))
              }
            >
              <Plus size={16} aria-hidden="true" />
              15%
            </Button>
          </div>
        </div>
        <div className="xp-progress-stack">
          <WavyBar value={value} label="Weekly goal" />
          <DixyProgress.Root value={null} aria-label="Syncing">
            <DixyProgress.Track>
              <DixyProgress.Indicator />
            </DixyProgress.Track>
          </DixyProgress.Root>
        </div>
      </Theme>
    </Section>
  );
}

function WavyBar({
  value,
  label,
  onFill,
}: {
  value: number;
  label: string;
  onFill?: boolean;
}) {
  return (
    <DixyProgress.Root
      wave
      value={Math.round(value * 100)}
      aria-label={label}
      className={onFill ? "xp-wave-on-fill" : undefined}
    >
      <DixyProgress.Track>
        <DixyProgress.Indicator />
      </DixyProgress.Track>
    </DixyProgress.Root>
  );
}

/* ------------------------------------------------------------------ */

function Actions() {
  return (
    <Section
      title="Split button, floating toolbar, FAB menu"
      note="All three from the library. The split trigger turns round while its menu is open. The FAB morphs into a close button and fans out labelled actions."
    >
      <SplitButton.Root size="lg" aria-label="Timer">
        <SplitButton.Action>
          <Timer size={18} aria-hidden="true" />
          Start timer
        </SplitButton.Action>
        <SplitButton.Menu aria-label="Timer options">
          <Menu.Item>Intervals, 40 / 20</Menu.Item>
          <Menu.Item>EMOM, 12 minutes</Menu.Item>
          <Menu.Item>Rest only</Menu.Item>
        </SplitButton.Menu>
      </SplitButton.Root>

      <div className="xp-dock">
        <Toolbar.Root aria-label="Set actions" variant="floating">
          <Toolbar.Button
            render={<IconButton aria-label="Edit set" variant="ghost" />}
          >
            <Pencil aria-hidden="true" />
          </Toolbar.Button>
          <Toolbar.Button
            render={<IconButton aria-label="Share" variant="ghost" />}
          >
            <Share2 aria-hidden="true" />
          </Toolbar.Button>
          <Toolbar.Button
            render={<IconButton aria-label="Save" variant="ghost" />}
          >
            <Bookmark aria-hidden="true" />
          </Toolbar.Button>
        </Toolbar.Root>
        <FabMenu.Root aria-label="Add">
          <FabMenu.Item icon={<Dumbbell />}>Add exercise</FabMenu.Item>
          <FabMenu.Item icon={<Timer />}>Add rest</FabMenu.Item>
          <FabMenu.Item icon={<Pencil />}>Add note</FabMenu.Item>
        </FabMenu.Root>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */

function EmphasizedType() {
  return (
    <Section
      title="Emphasized type on the fluid roles"
      note="The display.xl–3xl roles from the UI SDK work, with a variable font's weight and width axes for an emphasized style per role."
      wide
    >
      <div className="xp-type">
        <div className="xp-type-pair">
          <span className="xp-type-tag">display.3xl · emphasized</span>
          <p className="xp-type-3xl">1:42</p>
        </div>
        <div className="xp-type-pair">
          <span className="xp-type-tag">display.2xl · regular</span>
          <p className="xp-type-2xl">Rest</p>
        </div>
        <div className="xp-type-pair">
          <span className="xp-type-tag">display.xl · emphasized, narrow</span>
          <p className="xp-type-xl">Bulgarian split squat</p>
        </div>
        <div className="xp-type-row">
          <span className="xp-type-tag">headline · regular → emphasized</span>
          <p className="xp-type-headline">
            Next up <b>Glute bridge</b>
          </p>
        </div>
      </div>
    </Section>
  );
}
