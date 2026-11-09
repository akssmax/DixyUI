import { Link } from "@tanstack/react-router";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  Eye,
  Keyboard,
  Moon,
  Sun,
  Type,
  Waves,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Container,
  Field,
  Heading,
  IconButton,
  Kbd,
  Text,
  Toggle,
  ToggleGroup,
} from "@dixy-ui/react";
import { DixyMark } from "./dixy-mark";
import { ButtonLink } from "./button-link";
// Imported here, not in routes/index.tsx: a bare import in a route file stays
// in the unsplit route module, which put the landing CSS on every docs page.
import "../styles/landing.css";

/** Published on npm under the beta dist-tag. */
export const installCommand =
  "pnpm add @dixy-ui/react@beta @dixy-ui/themes@beta";
export const npmUrl = "https://www.npmjs.com/package/@dixy-ui/react";
export const repoUrl = "https://github.com/akssmax/DixyUI";

type Swatches = readonly string[];
function swatchStyle(swatches: Swatches) {
  return {
    "--starter-a": swatches[0],
    "--starter-b": swatches[1],
    "--starter-c": swatches[2],
  } as CSSProperties;
}

/* ------------------------------------------------------------------ */
/* Accessibility                                                       */
/* ------------------------------------------------------------------ */

const keyNames: Record<string, string> = {
  Tab: "Tab",
  " ": "Space",
  Enter: "Enter",
  Escape: "Esc",
  ArrowLeft: "←",
  ArrowRight: "→",
  ArrowUp: "↑",
  ArrowDown: "↓",
  Shift: "⇧",
  Home: "Home",
  End: "End",
};

/** Reads any CSS colour back as sRGB through a 1px canvas, so oklch and color-mix work too. */
function toRGB(color: string, probe: CanvasRenderingContext2D) {
  probe.clearRect(0, 0, 1, 1);
  probe.fillStyle = "#000";
  probe.fillStyle = color;
  probe.fillRect(0, 0, 1, 1);
  const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
  return [r!, g!, b!];
}
function luminance([r, g, b]: number[]) {
  const [R, G, B] = [r!, g!, b!].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * R! + 0.7152 * G! + 0.0722 * B!;
}

/** What a screen reader would roughly say for the focused control. */
function describe(el: HTMLElement) {
  const role =
    el.getAttribute("role") ??
    (el.tagName === "BUTTON"
      ? "button"
      : el.tagName === "INPUT"
        ? (el as HTMLInputElement).type === "checkbox"
          ? "checkbox"
          : "textbox"
        : el.tagName.toLowerCase());
  const byId = el
    .getAttribute("aria-labelledby")
    ?.split(" ")
    .map((id) => document.getElementById(id)?.textContent ?? "")
    .join(" ");
  const label =
    el.getAttribute("aria-label") ??
    (byId ||
      (el as HTMLInputElement).labels?.[0]?.textContent ||
      el.closest("label")?.textContent ||
      el.textContent ||
      "");
  const checked = el.getAttribute("aria-checked");
  const pressed = el.getAttribute("aria-pressed");
  const state =
    checked != null
      ? checked === "true"
        ? ", checked"
        : ", not checked"
      : pressed != null
        ? pressed === "true"
          ? ", pressed"
          : ", not pressed"
        : "";
  return `${role} "${label.trim()}"${state}`;
}

export function AccessibilitySection({ themeKey }: { themeKey: string }) {
  const [keys, setKeys] = useState<{ id: number; label: string }[]>([]);
  const [focused, setFocused] = useState("Nothing yet");
  const [prefs, setPrefs] = useState<string[]>([]);
  const [digest, setDigest] = useState(true);
  const [drops, setDrops] = useState(false);
  const [status, setStatus] = useState("");
  const [ratio, setRatio] = useState<number | null>(null);
  const lab = useRef<HTMLDivElement>(null);
  const counter = useRef(0);

  // Measure the real text and surface colours of the current starter.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const node = lab.current;
      if (!node) return;
      const probe = document
        .createElement("canvas")
        .getContext("2d", { willReadFrequently: true });
      if (!probe) return;
      const style = getComputedStyle(node);
      const text = luminance(toRGB(style.color, probe));
      const surface = luminance(toRGB(style.backgroundColor, probe));
      const [hi, lo] = text > surface ? [text, surface] : [surface, text];
      setRatio((hi + 0.05) / (lo + 0.05));
    });
    return () => cancelAnimationFrame(frame);
  }, [themeKey, prefs]);

  // State such as aria-checked changes after the key or click, so re-read it.
  function refreshFocus() {
    requestAnimationFrame(() => {
      const active = document.activeElement;
      if (active instanceof HTMLElement && lab.current?.contains(active))
        setFocused(describe(active));
    });
  }

  function onKeyDown(event: KeyboardEvent) {
    refreshFocus();
    const label = keyNames[event.key];
    if (!label) return;
    const id = ++counter.current;
    setKeys((list) => [...list.slice(-7), { id, label }]);
  }

  const level =
    ratio == null ? "" : ratio >= 7 ? "AAA" : ratio >= 4.5 ? "AA" : "Below AA";

  return (
    <Container
      as="section"
      className="landing-section"
      aria-labelledby="a11y-heading"
    >
      <div className="landing-section-head-row">
        <div>
          <Text as="span" className="landing-kicker" tone="muted">
            ACCESSIBILITY
          </Text>
          <Heading as="h2" id="a11y-heading" className="landing-title">
            Character on the surface. <em>Access underneath.</em>
          </Heading>
        </div>
        <ButtonLink to="/docs/accessibility" variant="ghost" size="sm">
          Read the accessibility notes <ArrowRight size={14} />
        </ButtonLink>
      </div>

      <div className="landing-a11y">
        <div>
          <ul className="landing-pillars">
            {[
              [
                Keyboard,
                "Keyboard on every component",
                "Focus order, arrow keys, Escape and typeahead come from Base UI. Themes only change paint.",
              ],
              [
                Eye,
                "Focus you can always see",
                `A focus ring that never relies on shadow alone, in every starter.`,
              ],
              [
                Type,
                "Contrast checked per theme",
                "Text and controls are tested against their real surfaces, in light and dark.",
              ],
              [
                Waves,
                "Respects your settings",
                "Reduced motion, larger text, right-to-left and forced colours.",
              ],
            ].map(([Icon, title, body]) => {
              const I = Icon as typeof Keyboard;
              return (
                <li key={title as string}>
                  <span className="landing-pillar-icon" aria-hidden="true">
                    <I size={18} />
                  </span>
                  <div>
                    <strong className="landing-pillar-title">
                      {title as string}
                    </strong>
                    <Text size="sm" tone="muted">
                      {body as string}
                    </Text>
                  </div>
                </li>
              );
            })}
          </ul>
          <Text size="sm" tone="muted" className="landing-a11y-note">
            Target: WCAG 2.2 AA. Automated checks cover selected behaviour;
            manual screen-reader review is part of each release.
          </Text>
        </div>

        <Card.Root className="landing-lab">
          <div
            ref={lab}
            className="landing-lab-inner"
            data-reduce-motion={prefs.includes("motion") || undefined}
            data-contrast={prefs.includes("contrast") || undefined}
            data-large={prefs.includes("large") || undefined}
            onKeyDown={onKeyDown}
            onKeyUp={refreshFocus}
            onClick={refreshFocus}
            onFocus={(event) => {
              if (event.target instanceof HTMLElement)
                setFocused(describe(event.target));
            }}
          >
            <div className="landing-lab-bar">
              <Text as="span" className="landing-pillar-title">
                Try it with your keyboard
              </Text>
              <ToggleGroup
                multiple
                value={prefs}
                onValueChange={(value) => setPrefs(value as string[])}
                aria-label="Simulated preferences"
                className="landing-lab-prefs"
              >
                <Toggle value="motion" size="sm" variant="outline">
                  Reduce motion
                </Toggle>
                <Toggle value="contrast" size="sm" variant="outline">
                  More contrast
                </Toggle>
                <Toggle value="large" size="sm" variant="outline">
                  Larger text
                </Toggle>
              </ToggleGroup>
            </div>
            <div className="landing-lab-body">
              <form
                className="landing-lab-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  setStatus(
                    "Saved. This message is announced with role=status.",
                  );
                }}
              >
                <Field.Root>
                  <Field.Label>Email</Field.Label>
                  <Field.Control type="email" placeholder="you@studio.com" />
                  <Field.Description>
                    A demo form. Nothing is sent.
                  </Field.Description>
                </Field.Root>
                <Field.Root>
                  <Field.Label className="landing-check">
                    <Checkbox.Root checked={digest} onCheckedChange={setDigest}>
                      <Checkbox.Indicator />
                    </Checkbox.Root>
                    Weekly digest
                  </Field.Label>
                </Field.Root>
                <Field.Root>
                  <Field.Label className="landing-check">
                    <Checkbox.Root checked={drops} onCheckedChange={setDrops}>
                      <Checkbox.Indicator />
                    </Checkbox.Root>
                    Theme drops
                  </Field.Label>
                </Field.Root>
                <Button type="submit" className="landing-lab-submit">
                  Save preferences
                </Button>
                <Text size="sm" role="status" className="landing-lab-status">
                  {status}
                </Text>
              </form>
              <aside className="landing-inspector" aria-label="Live inspector">
                <Text as="span" className="landing-kicker" tone="muted">
                  KEYS PRESSED
                </Text>
                <div className="landing-inspector-keys" aria-hidden="true">
                  {keys.length ? (
                    keys.map((key) => <Kbd key={key.id}>{key.label}</Kbd>)
                  ) : (
                    <Text size="sm" tone="muted">
                      Press Tab…
                    </Text>
                  )}
                </div>
                <Text as="span" className="landing-kicker" tone="muted">
                  FOCUSED
                </Text>
                <code className="landing-inspector-focus">{focused}</code>
                <Text as="span" className="landing-kicker" tone="muted">
                  TEXT CONTRAST
                </Text>
                <div className="landing-inspector-ratio">
                  <code>{ratio ? `${ratio.toFixed(1)} : 1` : "—"}</code>
                  {level && (
                    <Badge
                      variant="soft"
                      color={level === "Below AA" ? "danger" : "success"}
                    >
                      {level}
                    </Badge>
                  )}
                </div>
                <Text size="sm" tone="muted">
                  Measured live from this starter.
                </Text>
              </aside>
            </div>
          </div>
        </Card.Root>
      </div>
    </Container>
  );
}

/* ------------------------------------------------------------------ */
/* Proof strip: the facts, right under the hero                        */
/* ------------------------------------------------------------------ */

export function ProofStrip({
  componentCount,
  starterCount,
}: {
  componentCount: number;
  starterCount: number;
}) {
  const facts = [
    [String(componentCount), "components, each with a live playground"],
    [String(starterCount), "starter themes over one component API"],
    ["Base UI", "focus, keyboard and ARIA underneath"],
    ["0 KB", "of Tailwind: plain CSS in cascade layers"],
  ] as const;
  return (
    <Container
      as="section"
      className="landing-proof"
      aria-label="Dixy at a glance"
    >
      <dl>
        {facts.map(([value, label]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </Container>
  );
}

/* ------------------------------------------------------------------ */
/* Built with Dixy                                                     */
/* ------------------------------------------------------------------ */

export function BuiltWithSection({
  starterSlug,
  starterName,
  componentCount,
  starters,
  playgroundSearch,
}: {
  starterSlug: string | undefined;
  starterName: string;
  componentCount: number;
  starters: readonly { id: string; swatches: Swatches }[];
  playgroundSearch: { theme: string };
}) {
  return (
    <Container
      as="section"
      id="showcase"
      className="landing-section"
      aria-labelledby="built-heading"
    >
      <div className="landing-section-head">
        <Text as="span" className="landing-kicker" tone="muted">
          BUILT WITH DIXY
        </Text>
        <Heading as="h2" id="built-heading" className="landing-title">
          Real products, <em>not just buttons.</em>
        </Heading>
        <Text tone="muted" size="lg">
          Complete screens made only from Dixy's public components. They open in
          the starter you picked.
        </Text>
      </div>

      <ul className="landing-showcase">
        <li className="landing-show landing-show-big">
          <div className="landing-show-art" aria-hidden="true">
            <div className="landing-fp">
              <div className="landing-fp-nav">
                <b>fernpay</b>
                <span data-on>Overview</span>
                <span>Activity</span>
                <span>Cards</span>
                <span>Budgets</span>
                <span>Settings</span>
              </div>
              <div className="landing-fp-main">
                <div className="landing-fp-tile">
                  Balance<strong>£12,480.20</strong>
                  <i className="landing-fp-bar" />
                </div>
                <div className="landing-fp-tile">
                  Saved this month<strong>£840</strong>
                </div>
                <div className="landing-fp-tile landing-fp-chart">
                  {[40, 62, 48, 80, 55, 70, 35, 90, 60, 76].map((h, i) => (
                    <i key={i} style={{ blockSize: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="landing-show-foot">
            <div>
              <Heading as="h3" size="sm">
                <Link
                  to="/dixy-example"
                  search={starterSlug ? { skin: starterSlug } : {}}
                  className="landing-show-link"
                >
                  Fernpay
                </Link>
              </Heading>
              <Text size="sm" tone="muted">
                A personal finance app with cash flow, cards, budgets and
                settings. Opens in {starterName}.
              </Text>
              <div className="landing-show-tags">
                {["Table", "Chart", "Dialog", "Tabs"].map((tag) => (
                  <Badge key={tag} variant="outline" color="neutral">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <span className="landing-show-arrow" aria-hidden="true">
              <ArrowUpRight size={16} />
            </span>
          </div>
        </li>

        <li className="landing-show landing-show-tall">
          <div className="landing-show-art landing-shader" aria-hidden="true">
            <span className="landing-shader-chip">fragment shader · live</span>
          </div>
          <div className="landing-show-foot">
            <div>
              <Heading as="h3" size="sm">
                <Link to="/lab/shaders" className="landing-show-link">
                  Shader lab
                </Link>
              </Heading>
              <Text size="sm" tone="muted">
                Live backdrops paired with each starter.
              </Text>
            </div>
            <span className="landing-show-arrow" aria-hidden="true">
              <ArrowUpRight size={16} />
            </span>
          </div>
        </li>

        <li className="landing-show">
          <div className="landing-show-art" aria-hidden="true">
            <div className="landing-wren">
              <span className="landing-wren-user">
                Plan a rainy-day weekend in Lisbon
              </span>
              <div className="landing-wren-reply">
                <span className="landing-wren-chip">Thought for 2 seconds</span>
                <span className="landing-wren-tool">
                  <b>get_forecast</b>
                  <i>Completed</i>
                </span>
              </div>
              <span className="landing-wren-composer">
                Ask Wren anything
                <i />
              </span>
            </div>
          </div>
          <div className="landing-show-foot">
            <div>
              <Heading as="h3" size="sm">
                <Link
                  to="/ai-example"
                  search={starterSlug ? { skin: starterSlug } : {}}
                  className="landing-show-link"
                >
                  Wren
                </Link>
              </Heading>
              <Text size="sm" tone="muted">
                An AI chat app built from the Dixy AI parts.
              </Text>
            </div>
            <span className="landing-show-arrow" aria-hidden="true">
              <ArrowUpRight size={16} />
            </span>
          </div>
        </li>

        <li className="landing-show">
          <div className="landing-show-art" aria-hidden="true">
            <div className="landing-sink">
              {[
                "Button",
                "Switch",
                "Tabs",
                "Slider",
                "Select",
                "Toast",
                "Menu",
                "Chip",
                "Badge",
                "Table",
                "Dialog",
                "Card",
              ].map((name) => (
                <span key={name}>{name}</span>
              ))}
            </div>
          </div>
          <div className="landing-show-foot">
            <div>
              <Heading as="h3" size="sm">
                <Link to="/lab/kitchen-sink" className="landing-show-link">
                  Kitchen sink
                </Link>
              </Heading>
              <Text size="sm" tone="muted">
                All {componentCount} components on one page.
              </Text>
            </div>
            <span className="landing-show-arrow" aria-hidden="true">
              <ArrowUpRight size={16} />
            </span>
          </div>
        </li>

        <li className="landing-show">
          <div className="landing-show-art" aria-hidden="true">
            <div className="landing-swirl">
              {starters.slice(0, 8).map((s) => (
                <i key={s.id} style={swatchStyle(s.swatches)} />
              ))}
            </div>
          </div>
          <div className="landing-show-foot">
            <div>
              <Heading as="h3" size="sm">
                <Link
                  to="/playground"
                  search={playgroundSearch}
                  className="landing-show-link"
                >
                  Theme playground
                </Link>
              </Heading>
              <Text size="sm" tone="muted">
                Mix a starter, then export the code.
              </Text>
            </div>
            <span className="landing-show-arrow" aria-hidden="true">
              <ArrowUpRight size={16} />
            </span>
          </div>
        </li>
      </ul>
    </Container>
  );
}

/* ------------------------------------------------------------------ */
/* Call to action                                                      */
/* ------------------------------------------------------------------ */

function useCopy() {
  const [copied, setCopied] = useState<"idle" | "done" | "failed">("idle");
  useEffect(() => {
    if (copied === "idle") return;
    const timer = window.setTimeout(() => setCopied("idle"), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);
  const copy = (text: string) =>
    navigator.clipboard
      .writeText(text)
      .then(() => setCopied("done"))
      .catch(() => setCopied("failed"));
  return [copied, copy] as const;
}

export function CtaSection({
  starters,
  starterCount,
  skinName,
  playgroundSearch,
}: {
  starters: readonly { id: string; swatches: Swatches }[];
  starterCount: number;
  skinName: string;
  playgroundSearch: { theme: string };
}) {
  const [copied, copy] = useCopy();
  return (
    <Container
      as="section"
      className="landing-section"
      aria-labelledby="cta-heading"
    >
      <div className="landing-cta">
        <div className="landing-cta-copy">
          <Text as="span" className="landing-kicker">
            START BUILDING
          </Text>
          <Heading as="h2" id="cta-heading" className="landing-cta-title">
            Make one that <em>feels like you.</em>
          </Heading>
          <Text size="lg" className="landing-cta-lede">
            Install the beta, pick a starter, then change the material, the
            frame and the type until it's yours.
          </Text>
          <div className="landing-ctas">
            <ButtonLink
              to="/docs/installation"
              size="lg"
              className="landing-cta-primary"
            >
              Get started <ArrowRight size={16} />
            </ButtonLink>
            <ButtonLink
              to="/playground"
              search={playgroundSearch}
              size="lg"
              variant="outline"
              color="neutral"
              className="landing-cta-ghost"
            >
              Open the playground <ArrowUpRight size={16} />
            </ButtonLink>
          </div>
        </div>
        <div className="landing-cta-stack">
          <div className="landing-term">
            <div className="landing-term-head">
              <span className="landing-term-dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span>terminal</span>
              <IconButton
                size="sm"
                variant="ghost"
                color="neutral"
                aria-label="Copy install command"
                className="landing-term-copy"
                onClick={() => copy(installCommand)}
              >
                {copied === "done" ? <Check size={14} /> : <Copy size={14} />}
              </IconButton>
              <span className="sr-only" role="status">
                {copied === "done"
                  ? "Install command copied."
                  : copied === "failed"
                    ? "Copy failed. Select the command to copy it."
                    : ""}
              </span>
            </div>
            <pre>
              <code>
                <span className="landing-term-dim">$ </span>
                {installCommand}
                {"\n"}
                <span className="landing-term-ok">✓ 2 packages added</span>
                {"\n\n"}
                <span className="landing-term-dim">// app.tsx</span>
                {"\n"}
                <span className="landing-term-acc">import</span>
                {" { Theme } "}
                <span className="landing-term-acc">from</span>
                {' "@dixy-ui/react";'}
              </code>
            </pre>
          </div>
          <div className="landing-cta-swatches">
            <span aria-hidden="true">
              {starters.slice(0, 6).map((s) => (
                <i key={s.id} style={swatchStyle(s.swatches)} />
              ))}
            </span>
            <Text as="span" size="sm">
              {starterCount} starters · now wearing {skinName}
            </Text>
          </div>
        </div>
      </div>
    </Container>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

export function LandingFooter({
  appearance,
  onAppearance,
}: {
  appearance: "light" | "dark";
  onAppearance: (value: "light" | "dark") => void;
}) {
  return (
    <footer className="landing-footer">
      <Container className="landing-footer-inner">
        <div className="landing-footer-top">
          <div className="landing-footer-about">
            <Link to="/" className="landing-brand" aria-label="Dixy UI home">
              <DixyMark size={24} />
              <strong>
                dixy<span>UI</span>
              </strong>
            </Link>
            <Text size="sm" tone="muted">
              Accessible React components with character. Built on Base UI,
              styled with plain CSS.
            </Text>
            <a className="landing-footer-npm" href={npmUrl}>
              <code>@dixy-ui/react@beta</code>
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
          <nav aria-label="Product" className="landing-footer-col">
            <h2 className="landing-footer-heading">PRODUCT</h2>
            <ul>
              <li>
                <Link to="/docs/installation">Docs</Link>
              </li>
              <li>
                <Link
                  to="/docs/components/$component"
                  params={{ component: "button" }}
                >
                  Components
                </Link>
              </li>
              <li>
                <a href="#showcase">Showcase</a>
              </li>
              <li>
                <Link to="/playground">Playground</Link>
              </li>
            </ul>
          </nav>
          <nav aria-label="Learn" className="landing-footer-col">
            <h2 className="landing-footer-heading">LEARN</h2>
            <ul>
              <li>
                <Link to="/docs/installation">Installation</Link>
              </li>
              <li>
                <Link to="/docs/accessibility">Accessibility</Link>
              </li>
              <li>
                <Link
                  to="/docs/foundations/$foundation"
                  params={{ foundation: "color" }}
                >
                  Foundations
                </Link>
              </li>
            </ul>
          </nav>
          <nav aria-label="Demos" className="landing-footer-col">
            <h2 className="landing-footer-heading">DEMOS</h2>
            <ul>
              <li>
                <Link to="/dixy-example">
                  Fernpay{" "}
                  <Badge size="sm" variant="soft">
                    new
                  </Badge>
                </Link>
              </li>
              <li>
                <Link to="/ai-example">
                  Wren AI chat{" "}
                  <Badge size="sm" variant="soft">
                    new
                  </Badge>
                </Link>
              </li>
              <li>
                <Link to="/lab/shaders">Shader lab</Link>
              </li>
              <li>
                <Link to="/lab/kitchen-sink">Kitchen sink</Link>
              </li>
            </ul>
          </nav>
          <nav aria-label="Project" className="landing-footer-col">
            <h2 className="landing-footer-heading">PROJECT</h2>
            <ul>
              <li>
                <a href={repoUrl}>
                  GitHub <ArrowUpRight size={13} aria-hidden="true" />
                </a>
              </li>
              <li>
                <a href={npmUrl}>
                  npm <ArrowUpRight size={13} aria-hidden="true" />
                </a>
              </li>
              <li>
                <a href="https://base-ui.com">
                  Base UI <ArrowUpRight size={13} aria-hidden="true" />
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="landing-footer-bottom">
          <Text
            as="span"
            size="sm"
            tone="muted"
            className="landing-footer-status"
          >
            <i aria-hidden="true" />
            0.1 beta · on npm
          </Text>
          <Text as="span" size="sm" tone="muted">
            © 2026 Dixy UI · Built in the open
          </Text>
          <ToggleGroup
            value={[appearance]}
            onValueChange={(value) => {
              const next = (value as string[])[0];
              if (next === "light" || next === "dark") onAppearance(next);
            }}
            aria-label="Appearance"
            segmented
          >
            <Toggle value="light" size="sm" aria-label="Light">
              <Sun size={14} />
            </Toggle>
            <Toggle value="dark" size="sm" aria-label="Dark">
              <Moon size={14} />
            </Toggle>
          </ToggleGroup>
        </div>
      </Container>
      <div className="landing-wordmark" aria-hidden="true">
        dixy
      </div>
    </footer>
  );
}
