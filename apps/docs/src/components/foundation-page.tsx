import { DocsSelect } from "./docs-controls";
import { lazy, Suspense } from "react";
import { Link } from "@tanstack/react-router";
import { Button, Heading, Text, Theme } from "@dixy-ui/react";
import { ArrowUpRight, Palette } from "lucide-react";
import { CodeBlock } from "./code-block";
import api from "../generated/api.json";
import { radiusPresets } from "@dixy-ui/tokens";
import { SurfaceFoundation } from "./surface-foundation";
import { SizingLayoutFoundation } from "./sizing-layout-foundation";
import { SpacingFoundation } from "./spacing-foundation";
import { ColorFoundation } from "./color-foundation";
import { colorFamilies } from "@dixy-ui/tokens";
import { IconFoundation } from "./icon-foundation";
import { TypographyFoundation } from "./typography-foundation";
import { usePreviewTheme } from "./app-appearance-provider";
import type { PreviewThemeSettings } from "../lib/preview-theme";
import { neutralColorFamilies } from "@dixy-ui/tokens";
import { foundationPages, type FoundationSlug } from "../lib/foundation-pages";
export { foundationPages, type FoundationSlug };

const ExpressiveFoundation = lazy(() => import("./expressive-foundation"));

const MotionFoundation = lazy(() => import("./motion-foundation"));

export function FoundationPage({ slug }: { slug: FoundationSlug }) {
  const page = foundationPages[slug];
  const { settings, appearance, setSettings } = usePreviewTheme();
  const {
    accentColor: accent,
    neutralColor: neutral,
    radius,
    density,
    motion,
    dir,
  } = settings;
  return (
    <article className="prose-page foundation-page">
      <div className="page-eyebrow">
        <Palette size={13} />
        <span>Foundations</span>
      </div>
      <header className="page-heading">
        <h1>
          {page.title}
          <span className="heading-period">.</span>
        </h1>
        <p className="page-deck">{page.deck}</p>
        <p className="page-description">{page.description}</p>
      </header>
      {slug === "theming" && (
        <>
          <Link to="/playground" className="theme-foundation-link">
            Build your theme in the playground <ArrowUpRight size={14} />
          </Link>
          <div className="foundation-toolbar">
            <label>
              Appearance
              <DocsSelect
                value={appearance}
                onValueChange={(nextValue) =>
                  setSettings({
                    appearance: nextValue as "light" | "dark",
                  })
                }
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </DocsSelect>
            </label>
            <label>
              Accent
              <DocsSelect
                value={accent}
                onValueChange={(nextValue) =>
                  setSettings({
                    accentColor:
                      nextValue as PreviewThemeSettings["accentColor"],
                  })
                }
              >
                {colorFamilies.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </DocsSelect>
            </label>
            <label>
              Neutral base
              <DocsSelect
                aria-label="Neutral base"
                value={neutral}
                onValueChange={(nextValue) =>
                  setSettings({
                    neutralColor:
                      nextValue as PreviewThemeSettings["neutralColor"],
                  })
                }
              >
                {neutralColorFamilies.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </DocsSelect>
            </label>
            {slug === "theming" && (
              <label>
                Radius
                <DocsSelect
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
            )}
          </div>
          <Theme
            radius={radius}
            appearance={appearance}
            accentColor={accent}
            neutralColor={neutral}
            density={density}
            motion={motion}
            dir={dir}
            className="token-preview"
          >
            <Heading size="sm">A theme is a set of relationships.</Heading>
            <Text tone="muted">
              Surfaces, text, borders, and actions work together.
            </Text>
            <div className="token-swatches">
              {[
                "bg",
                "surface",
                "text",
                "text-muted",
                "border",
                "accent",
                "accent-soft",
                "danger",
              ].map((token) => (
                <div key={token}>
                  <span style={{ background: `var(--dixy-${token})` }} />
                  <code>{token}</code>
                </div>
              ))}
            </div>
            <div className="foundation-button-row">
              <Button>
                Primary action
                <ArrowUpRight size={14} />
              </Button>
              <Button variant="soft">Secondary action</Button>
              <Button variant="outline" color="neutral">
                Quiet action
              </Button>
            </div>
          </Theme>
          <h2>Theme scope</h2>
          <p>
            Nested themes inherit settings unless explicitly overridden. Dialog
            portals reapply the nearest theme’s settings and inline token
            overrides. Keep a Theme around your application so its controls
            share the same contract.
          </p>
          <CodeBlock
            code={`<Theme appearance="${appearance}" accentColor="${accent}" neutralColor="${neutral}" radius="${radius}" density="${density}" motion="${motion}" dir="${dir}">\n  <Button>Start something</Button>\n</Theme>`}
          />
          <h2>Three layers of meaning</h2>
          <div className="token-architecture">
            <div>
              <span>01</span>
              <strong>Palette</strong>
              <code>--dixy-color-purple-9</code>
            </div>
            <div>
              <span>02</span>
              <strong>Semantic role</strong>
              <code>--dixy-color-background-action-primary</code>
            </div>
            <div>
              <span>03</span>
              <strong>Component</strong>
              <code>--dixy-button-primary-background</code>
            </div>
          </div>
          <p>
            A component references a role. A theme maps that role to a palette.
            Change the mapping once and the interface stays coherent.
          </p>
        </>
      )}
      {slug === "color" && <ColorFoundation />}
      {slug === "typography" && <TypographyFoundation />}
      {slug === "icons" && <IconFoundation />}
      {slug === "spacing" && <SpacingFoundation />}
      {slug === "sizing-layout" && <SizingLayoutFoundation />}
      {slug === "surfaces" && <SurfaceFoundation />}
      {(slug === "materials" ||
        slug === "shape" ||
        slug === "emotion" ||
        slug === "haptics") && (
        <Suspense fallback={<p role="status">Loading foundation lab…</p>}>
          <ExpressiveFoundation kind={slug} />
        </Suspense>
      )}
      {slug === "motion" && (
        <Suspense fallback={<p role="status">Loading motion examples…</p>}>
          <MotionFoundation />
        </Suspense>
      )}
      {slug === "theming" && <ThemeReference />}
    </article>
  );
}

function ThemeReference() {
  return (
    <section className="doc-section">
      <h2>Theme API</h2>
      <p className="section-description">
        Generated from the local ThemeProps interface. Native div props and
        inline style overrides are forwarded.
      </p>
      <div className="table-scroll">
        <table className="api-table">
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type / description</th>
              <th>Default</th>
            </tr>
          </thead>
          <tbody>
            {api.ThemeProps.map((prop) => (
              <tr key={prop.name}>
                <td>
                  <code>{prop.name}</code>
                </td>
                <td>
                  <code>{prop.type.replaceAll(" | undefined", "")}</code>
                  <p>{prop.description}</p>
                </td>
                <td>
                  <code>{prop.default}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
