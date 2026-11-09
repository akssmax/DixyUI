import { Table, Kbd } from "@dixy-ui/react";
import { DocsDisclosure } from "./docs-controls";
import { DocsSelect, DocsSwitch } from "./docs-controls";
import {
  Component,
  Suspense,
  lazy,
  useEffect,
  useMemo,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Code2,
  Eye,
  Fingerprint,
  Lightbulb,
  Moon,
  RotateCcw,
  Sun,
} from "lucide-react";
import { Button, IconButton, Theme, Tabs } from "@dixy-ui/react";
import {
  componentRegistry,
  type ComponentSlug,
  type Control,
  type DemoState,
} from "../registry/components";
import api from "../generated/api.json";
import {
  colorFamilies,
  neutralColorFamilies,
  radiusPresets,
} from "@dixy-ui/tokens";
import { CodeBlock } from "./code-block";
import { configureExample } from "../lib/example-source";
import { PrimitiveApi } from "./primitive-api";
import { usePreviewTheme } from "./app-appearance-provider";
import { previewThemeProps, useDocsTheme } from "./use-docs-theme";
import type { PreviewThemeSettings } from "../lib/preview-theme";

const sourceFiles = import.meta.glob(
  [
    "../../../../packages/react/src/components/*.tsx",
    "!../../../../packages/react/src/components/*.test.tsx",
  ],
  { query: "?raw", import: "default" },
);
const SwitchComparisons = lazy(() => import("./switch-comparisons"));
const CheckboxComparisons = lazy(() => import("./checkbox-comparisons"));
const TabsComparisons = lazy(() => import("./tabs-comparisons"));
const FamilyComparisons = lazy(() => import("./family-comparisons"));

class PreviewBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <p className="preview-error">
        This example hit an error. Reset the playground to try again.
      </p>
    ) : (
      this.props.children
    );
  }
}

function initialState(controls: readonly Control[]): DemoState {
  return Object.fromEntries(
    controls.map((control) => [control.name, control.initial]),
  );
}

function SourceDisclosure({ path }: { path: string }) {
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState("");
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!open) return;
    let active = true;
    setFailed(false);
    const load = sourceFiles[`../../../../packages/react/src/${path}`];
    if (!load) {
      setFailed(true);
      return;
    }
    load()
      .then((text) => {
        if (active) setSource(String(text));
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, [open, path, attempt]);
  return (
    <DocsDisclosure
      className="source-disclosure"
      onOpenChange={(nextOpen) => setOpen(nextOpen)}
      summary={
        <>
          <Code2 size={16} />
          <span>Read the implementation</span>
          <span className="source-path">{path}</span>
        </>
      }
    >
      {open &&
        (failed ? (
          <div className="source-loading">
            Source couldn’t load.{" "}
            <Button
              variant="ghost"
              color="neutral"
              size="sm"
              onClick={() => setAttempt(attempt + 1)}
            >
              Try again
            </Button>
          </div>
        ) : source ? (
          <CodeBlock code={source} filename={path} collapsible />
        ) : (
          <p className="source-loading">Loading source…</p>
        ))}
    </DocsDisclosure>
  );
}

export function ComponentPage({ slug }: { slug: ComponentSlug }) {
  const entry = componentRegistry[slug];
  const { settings, appearance, setSettings, resetSettings } =
    usePreviewTheme();
  const {
    accentColor,
    neutralColor,
    radius,
    density,
    motion,
    dir: direction,
  } = settings;
  const { skinProps } = useDocsTheme();
  const previewTheme = previewThemeProps(settings, appearance, skinProps);
  const [state, setState] = useState(() => initialState(entry.controls));
  const [revision, setRevision] = useState(0);
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [raw, setRaw] = useState("");
  const [codeError, setCodeError] = useState(false);
  const [codeAttempt, setCodeAttempt] = useState(0);
  const [event, setEvent] = useState("");
  const [activeSection, setActiveSection] = useState("playground");
  const Preview = useMemo(
    () =>
      lazy(
        entry.load as unknown as () => Promise<{
          default: ComponentType<DemoState>;
        }>,
      ),
    [entry],
  );
  useEffect(() => {
    let active = true;
    setCodeError(false);
    entry
      .code()
      .then((module) => {
        if (active) setRaw(module.default);
      })
      .catch(() => {
        if (active) setCodeError(true);
      });
    return () => {
      active = false;
    };
  }, [entry, codeAttempt]);
  const code = raw
    ? configureExample(raw, state, {
        appearance,
        accentColor: accentColor ?? "purple",
        neutralColor: neutralColor ?? "neutral",
        radius: radius ?? "md",
        density,
        motion,
        dir: direction,
      })
    : "";
  function update(name: string, value: string | boolean) {
    setState({ ...state, [name]: value });
    setEvent(`${name} changed to ${String(value)}`);
  }
  function reset() {
    setState(initialState(entry.controls));
    setRevision(revision + 1);
    setEvent("");
    resetSettings();
  }
  const sections = [
    "Playground",
    ...("composition" in entry ? ["Composition"] : []),
    "Usage",
    "Examples",
    "API reference",
    "Styling tokens",
    "Accessibility",
    "Design notes",
    "Source",
  ];
  useEffect(() => {
    const scrollRoot = document.getElementById("main-content");
    if (!scrollRoot) return;
    let frame = 0;
    const updateSection = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const threshold = scrollRoot.getBoundingClientRect().top + 140;
        const ids = [
          "playground",
          ...("composition" in entry ? ["composition"] : []),
          "usage",
          "examples",
          "api-reference",
          "styling-tokens",
          "accessibility",
          "design-notes",
          "source",
        ];
        const current = ids
          .filter(
            (id) =>
              (document.getElementById(id)?.getBoundingClientRect().top ??
                Infinity) <= threshold,
          )
          .at(-1);
        setActiveSection(current ?? "playground");
      });
    };
    updateSection();
    scrollRoot.addEventListener("scroll", updateSection, { passive: true });
    return () => {
      scrollRoot.removeEventListener("scroll", updateSection);
      cancelAnimationFrame(frame);
    };
  }, [slug]);
  const slugs = Object.keys(componentRegistry) as ComponentSlug[];
  const nextSlug = slugs[(slugs.indexOf(slug) + 1) % slugs.length]!;
  const primitiveSlug = entry.primitive
    ?.replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
  return (
    <div className="document-grid">
      <article className="component-document">
        <div className="page-eyebrow">
          <span>{entry.category}</span>
          <span className="eyebrow-divider" />
          <span>Component</span>
          <span className="component-state">
            <span />
            Beta
          </span>
        </div>
        <header className="page-heading">
          <h1>
            {entry.title}
            <span className="heading-period">.</span>
          </h1>
          <p className="page-deck">{entry.description}</p>
          <p className="page-description">{entry.detail}</p>
        </header>
        <div className="page-meta">
          <span>
            <Fingerprint size={13} />{" "}
            {"engine" in entry
              ? entry.engine
              : entry.primitive
                ? "Built on Base UI"
                : "Native HTML"}
          </span>
          <a href="#accessibility">
            Keyboard considered
            <ArrowDown size={11} />
          </a>
          <a href="#source">
            View source
            <ArrowUpRight size={12} />
          </a>
        </div>
        <section id="playground" className="doc-section playground-section">
          <div className="section-heading">
            <h2>Make it yours</h2>
          </div>
          <Tabs.Root
            className="playground docs-playground"
            value={tab}
            onValueChange={(value) => setTab(value as "preview" | "code")}
            size="sm"
            variant="outline"
            color="neutral"
            radius="sm"
          >
            <div className="playground-toolbar">
              <Tabs.List
                aria-label="Playground view"
                className="preview-tabs"
                activateOnFocus
              >
                <Tabs.Tab value="preview">
                  <Eye size={13} aria-hidden="true" />
                  Preview
                </Tabs.Tab>
                <Tabs.Tab value="code">
                  <Code2 size={13} aria-hidden="true" />
                  Code
                </Tabs.Tab>
                <Tabs.Indicator />
              </Tabs.List>
              <div className="playground-tools">
                <Button
                  variant="ghost"
                  color="neutral"
                  size="sm"
                  className="chrome-button"
                  onClick={() =>
                    setSettings({
                      appearance: appearance === "light" ? "dark" : "light",
                    })
                  }
                  aria-label={`Preview in ${appearance === "light" ? "dark" : "light"} mode`}
                >
                  {appearance === "light" ? (
                    <Sun size={14} />
                  ) : (
                    <Moon size={14} />
                  )}
                </Button>
                <span className="tool-divider" />
                <Button
                  variant="ghost"
                  color="neutral"
                  size="sm"
                  onClick={reset}
                  className="reset-button"
                  title="Reset this example and shared preview theme"
                >
                  <RotateCcw size={12} />
                  Reset
                </Button>
              </div>
            </div>
            <div className="playground-body">
              <div className="playground-stage">
                <Tabs.Panel value="preview" className="preview-panel">
                  <Theme {...previewTheme} className="preview-theme">
                    <span
                      className="preview-corner top-left"
                      aria-hidden="true"
                    />
                    <span
                      className="preview-corner bottom-right"
                      aria-hidden="true"
                    />
                    <PreviewBoundary key={revision}>
                      <Suspense
                        fallback={
                          <p className="demo-loading">Preparing the example…</p>
                        }
                      >
                        <Preview {...state} />
                      </Suspense>
                    </PreviewBoundary>
                  </Theme>
                </Tabs.Panel>
                <Tabs.Panel value="code" className="playground-code">
                  {code ? (
                    <CodeBlock code={code} filename={`${slug}-example.tsx`} />
                  ) : codeError ? (
                    <p className="source-loading">
                      Example couldn’t load.{" "}
                      <Button
                        variant="ghost"
                        color="neutral"
                        size="sm"
                        onClick={() => setCodeAttempt(codeAttempt + 1)}
                      >
                        Retry
                      </Button>
                    </p>
                  ) : (
                    <p className="source-loading">Loading example…</p>
                  )}
                </Tabs.Panel>
              </div>
              <div className="prop-panel">
                <div className="prop-panel-heading">
                  PROPERTIES<span>{entry.controls.length}</span>
                </div>
                {entry.controls.map((control) => (
                  <label
                    key={control.name}
                    className={
                      "options" in control ? "prop-control" : "boolean-control"
                    }
                  >
                    <span>{control.label}</span>
                    {"options" in control ? (
                      <DocsSelect
                        aria-label={control.label}
                        value={String(state[control.name])}
                        onValueChange={(nextValue) =>
                          update(control.name, nextValue)
                        }
                      >
                        {control.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </DocsSelect>
                    ) : (
                      <DocsSwitch
                        checked={Boolean(state[control.name])}
                        onCheckedChange={(nextChecked) =>
                          update(control.name, nextChecked)
                        }
                      />
                    )}
                  </label>
                ))}
                <DocsDisclosure
                  className="theme-controls"
                  summary={<>Theme settings</>}
                >
                  <label className="prop-control">
                    <span>Density</span>
                    <DocsSelect
                      aria-label="Density"
                      value={density}
                      onValueChange={(nextValue) =>
                        setSettings({
                          density: nextValue as PreviewThemeSettings["density"],
                        })
                      }
                    >
                      {["compact", "default", "comfortable"].map((value) => (
                        <option key={value}>{value}</option>
                      ))}
                    </DocsSelect>
                  </label>
                  <label className="prop-control">
                    <span>Motion</span>
                    <DocsSelect
                      aria-label="Motion"
                      value={motion}
                      onValueChange={(nextValue) =>
                        setSettings({
                          motion: nextValue as PreviewThemeSettings["motion"],
                        })
                      }
                    >
                      <option value="system">system</option>
                      <option value="reduced">reduced</option>
                    </DocsSelect>
                  </label>
                  <label className="prop-control">
                    <span>Direction</span>
                    <DocsSelect
                      aria-label="Direction"
                      value={direction}
                      onValueChange={(nextValue) =>
                        setSettings({
                          dir: nextValue as "ltr" | "rtl",
                        })
                      }
                    >
                      <option value="ltr">ltr</option>
                      <option value="rtl">rtl</option>
                    </DocsSelect>
                  </label>
                  <label className="prop-control">
                    <span>Accent</span>
                    <DocsSelect
                      aria-label="Accent"
                      value={accentColor}
                      onValueChange={(nextValue) =>
                        setSettings({
                          accentColor:
                            nextValue as PreviewThemeSettings["accentColor"],
                        })
                      }
                    >
                      {colorFamilies.map((family) => (
                        <option key={family} value={family}>
                          {family}
                        </option>
                      ))}
                    </DocsSelect>
                  </label>
                  <label className="prop-control">
                    <span>Neutral base</span>
                    <DocsSelect
                      aria-label="Neutral base"
                      value={neutralColor}
                      onValueChange={(nextValue) =>
                        setSettings({
                          neutralColor:
                            nextValue as PreviewThemeSettings["neutralColor"],
                        })
                      }
                    >
                      {neutralColorFamilies.map((family) => (
                        <option key={family}>{family}</option>
                      ))}
                    </DocsSelect>
                  </label>
                  <label className="prop-control">
                    <span>Radius</span>
                    <DocsSelect
                      aria-label="Radius"
                      value={radius}
                      onValueChange={(nextValue) =>
                        setSettings({
                          radius: nextValue as PreviewThemeSettings["radius"],
                        })
                      }
                    >
                      {Object.keys(radiusPresets).map((value) => (
                        <option key={value}>{value}</option>
                      ))}
                    </DocsSelect>
                  </label>
                  <p className="prop-panel-note">
                    Theme settings are saved across docs. Reset restores
                    defaults.
                  </p>
                </DocsDisclosure>
                {/* Announces prop changes to screen readers; nothing to show sighted users. */}
                <span className="sr-only" role="status">
                  {event}
                </span>
              </div>
            </div>
          </Tabs.Root>
        </section>
        {"composition" in entry && (
          <section
            id="composition"
            className="doc-section"
            aria-labelledby="composition-heading"
          >
            <div className="section-heading">
              <h2 id="composition-heading">Composition</h2>
              <span className="section-caption">Anatomy</span>
            </div>
            <p className="section-description">{entry.composition.detail}</p>
            <CodeBlock
              code={entry.composition.tree}
              language="text"
              filename="Component structure"
            />
          </section>
        )}
        <section id="usage" className="doc-section">
          <div className="section-heading">
            <h2>A place to start</h2>
            <span className="section-caption">Usage</span>
          </div>
          <p className="section-description">
            Import the stylesheet once at your application root. This complete
            example reflects the properties selected above.
          </p>
          {code ? (
            <CodeBlock
              code={code}
              filename={`${slug}-example.tsx`}
              collapsible
            />
          ) : (
            <p className="source-loading">
              {codeError
                ? "Example unavailable. Retry from the Code tab."
                : "Loading example…"}
            </p>
          )}
        </section>
        <section id="examples" className="doc-section">
          <div className="section-heading">
            <h2>
              {slug === "button"
                ? "A spectrum of emphasis"
                : "Details that make a difference"}
            </h2>
            <span className="section-caption">Examples & states</span>
          </div>
          {slug === "button" ? (
            <>
              <p className="section-description">
                Use one solid action to lead. Let the quieter variants support
                it.
              </p>
              <div className="variant-gallery">
                {(["solid", "soft", "outline", "ghost"] as const).map(
                  (variant) => (
                    <div key={variant}>
                      <Button variant={variant}>
                        Continue
                        <ArrowRight size={14} />
                      </Button>
                      <span>{variant}</span>
                    </div>
                  ),
                )}
              </div>
              <div className="state-gallery">
                <div>
                  <Button size="sm">Small</Button>
                  <Button>Default</Button>
                  <Button size="lg">Large</Button>
                </div>
                <div>
                  <Button disabled>Disabled</Button>
                  <Button loading>Saving</Button>
                  <IconButton aria-label="Confirm" variant="soft">
                    <Check size={16} />
                  </IconButton>
                </div>
              </div>
            </>
          ) : slug === "switch" ? (
            <Suspense fallback={<p>Loading switch comparisons…</p>}>
              <SwitchComparisons />
            </Suspense>
          ) : slug === "checkbox" ? (
            <Suspense fallback={<p>Loading checkbox comparisons…</p>}>
              <CheckboxComparisons />
            </Suspense>
          ) : slug === "tabs" ? (
            <Suspense fallback={<p>Loading tab comparisons…</p>}>
              <TabsComparisons />
            </Suspense>
          ) : "composition" in entry ? (
            <Suspense fallback={<p>Loading component comparisons…</p>}>
              <FamilyComparisons
                slug={slug}
                controls={entry.controls}
                Preview={Preview}
                source={raw}
              />
            </Suspense>
          ) : (
            <div className="callout">
              <Check size={17} />
              <div>
                <strong>
                  {slug === "dialog"
                    ? "The theme travels with the task."
                    : slug === "icon"
                      ? "The icon is not the action."
                      : slug === "text-field"
                        ? "Context makes the control."
                        : slug === "typography"
                          ? "Meaning comes before size."
                          : "Try the behavior as well as the appearance."}
                </strong>
                <p>
                  {slug === "dialog"
                    ? "Switch the preview to dark, open the dialog, and check that its surface and controls follow. Press Escape to return to the trigger."
                    : slug === "icon"
                      ? "Change packs without changing size or color roles. Named image gives the SVG an accessible name; leave decoration unnamed inside a labeled button. Explore the Icons foundation for composition and supported-pack examples."
                      : slug === "text-field"
                        ? "Turn on Invalid to see the recovery message. Try the disabled state, then reset to restore the input and its value."
                        : slug === "typography"
                          ? "Change the visual scale without skipping heading levels. The example stays an h3 at every size."
                          : entry.lesson}
                </p>
              </div>
            </div>
          )}
        </section>
        <section id="api-reference" className="doc-section">
          <div className="section-heading">
            <h2>The finer details</h2>
            <span className="section-caption">API reference</span>
          </div>
          <p className="section-description">
            Generated from Dixy’s local TypeScript interfaces.{" "}
            {"engine" in entry && entry.engine === "React Aria"
              ? "React Aria props, refs and render callbacks are forwarded; this table covers Dixy’s added visual options."
              : entry.primitive
                ? `Native and Base UI ${entry.primitive} props are forwarded; this table covers the options Dixy adds.`
                : "Native HTML attributes and refs are forwarded. The table covers Dixy’s own options."}
          </p>
          {entry.api.map((key) => (
            <div className="api-group" key={key}>
              <h3>{key.replace("Props", "")}</h3>
              <div className="table-scroll">
                <Table.Root className="api-table">
                  <Table.Header>
                    <Table.Row>
                      <Table.Head>Prop</Table.Head>
                      <Table.Head>Type / description</Table.Head>
                      <Table.Head>Default</Table.Head>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {api[key].map((prop) => (
                      <Table.Row key={prop.name}>
                        <Table.Cell>
                          <code>{prop.name}</code>
                          {prop.required && (
                            <span className="required-mark">*</span>
                          )}
                        </Table.Cell>
                        <Table.Cell>
                          <code>
                            {prop.type.replaceAll(" | undefined", "")}
                          </code>
                          <p>{prop.description}</p>
                        </Table.Cell>
                        <Table.Cell>
                          <code>{prop.default}</code>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </div>
            </div>
          ))}
          {primitiveSlug && <PrimitiveApi slug={primitiveSlug} />}
          {"engine" in entry && entry.engine === "React Aria" && (
            <PrimitiveApi slug={`aria-${slug}`} />
          )}
          {primitiveSlug === "radio-group" && <PrimitiveApi slug="radio" />}
          {entry.primitive && (
            <a
              className="inline-link"
              href={`https://base-ui.com/react/components/${primitiveSlug}`}
              target="_blank"
              rel="noreferrer"
            >
              Explore the full Base UI API
              <ArrowUpRight size={13} />
            </a>
          )}
        </section>
        <section id="styling-tokens" className="doc-section">
          <div className="section-heading">
            <h2>Built from the same foundations</h2>
            <span className="section-caption">Styling tokens</span>
          </div>
          <p className="section-description">
            Change Theme settings above to compare appearance, accent, neutral,
            radius, spacing density, motion and direction. Override component
            aliases on a Theme root so custom properties follow portaled content
            too. The wrapper merges className, style, refs and render
            composition with its owning primitive.
          </p>
          <div className="table-scroll">
            <Table.Root className="api-table">
              <Table.Header>
                <Table.Row>
                  <Table.Head>Token</Table.Head>
                  <Table.Head>Purpose</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {[
                  [entry.token, "The component-specific starting point."],
                  [
                    "--dixy-font-label-md",
                    "Control label font and line height; body roles remain readable in text inputs.",
                  ],
                  [
                    "--dixy-color-background-selected",
                    "Selected surfaces use semantic color across appearances.",
                  ],
                  [
                    "--dixy-color-border-focus",
                    "Focus indication remains visible independently of shadows.",
                  ],
                  [
                    "--dixy-spacing-inset-sm",
                    "Density-aware component padding.",
                  ],
                  [
                    "--dixy-motion-transition-feedback",
                    "Short state feedback, reduced by the inherited motion setting.",
                  ],
                ].map(([token, purpose]) => (
                  <Table.Row key={token}>
                    <Table.Cell>
                      <code>{token}</code>
                    </Table.Cell>
                    <Table.Cell>{purpose}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </div>
          <Link
            className="inline-link"
            to="/docs/foundations/$foundation"
            params={{ foundation: "theming" }}
          >
            Explore theme customization <ArrowRight size={13} />
          </Link>
        </section>
        <section id="accessibility" className="doc-section">
          <div className="section-heading">
            <h2>Consider everyone</h2>
            <span className="section-caption">Accessibility</span>
          </div>
          <p className="section-description">{entry.accessibility}</p>
          {entry.keyboard.length > 0 && (
            <div className="keyboard-table">
              {entry.keyboard.map(([key, description]) => (
                <div key={key}>
                  <Kbd>{key}</Kbd>
                  <span>{description}</span>
                </div>
              ))}
            </div>
          )}
          <p className="coverage-note">
            Target: WCAG 2.2 AA. Automated tests cover selected behavior; manual
            screen-reader, contrast, and zoom validation remain part of the
            release checklist.
          </p>
        </section>
        <section id="design-notes" className="doc-section">
          <div className="learning-callout">
            <div className="learning-label">
              <Lightbulb size={15} />
              THE THINKING BEHIND IT
            </div>
            <h2>Build it. Then understand it.</h2>
            <p>{entry.lesson}</p>
            <div className="token-reference">
              A token to follow<code>{entry.token}</code>
            </div>
          </div>
        </section>
        <section id="source" className="doc-section">
          <div className="section-heading">
            <h2>Nothing up our sleeves</h2>
            <span className="section-caption">Source</span>
          </div>
          <SourceDisclosure path={entry.source} />
        </section>
        <Link
          to="/docs/components/$component"
          params={{ component: nextSlug }}
          className="next-page"
        >
          <span>
            <small>UP NEXT</small>
            <strong>{componentRegistry[nextSlug].title}</strong>
          </span>
          <ArrowRight size={22} />
        </Link>
      </article>
      <aside className="page-toc" aria-label="On this page">
        <span>ON THIS PAGE</span>
        {sections.map((section) => (
          <a
            key={section}
            href={`#${section.toLowerCase().replaceAll(" ", "-")}`}
            className={
              activeSection === section.toLowerCase().replaceAll(" ", "-")
                ? "toc-first"
                : ""
            }
            aria-current={
              activeSection === section.toLowerCase().replaceAll(" ", "-")
                ? "location"
                : undefined
            }
          >
            {section}
          </a>
        ))}
        <div className="toc-note">
          <AsteriskDecoration />
          <p>
            A little structure.
            <br />A lot of possibility.
          </p>
        </div>
      </aside>
    </div>
  );
}

function AsteriskDecoration() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20 2v36M2 20h36M7 7l26 26M7 33 33 7"
        stroke="currentColor"
        strokeWidth="3"
      />
    </svg>
  );
}
