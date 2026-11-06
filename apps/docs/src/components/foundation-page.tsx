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

const ExpressiveFoundation = lazy(() => import("./expressive-foundation"));

const MotionFoundation = lazy(() => import("./motion-foundation"));

export const foundationPages = {
  theming: {
    title: "Theming",
    deck: "One foundation. Your own character.",
    description:
      "Appearance, accent, and radius belong to the theme. Components consume semantic tokens so the whole interface changes together.",
  },
  color: {
    title: "Color",
    deck: "A little color. A clear purpose.",
    description:
      "Semantic color names describe a role, not a particular shade. A border stays a border when the appearance changes.",
  },
  icons: {
    title: "Icons",
    deck: "Different shapes. A shared language.",
    description:
      "Bring your own SVG icons, keep their personality, and share Dixy’s sizing, semantic colors and accessibility contract.",
  },
  typography: {
    title: "Typography",
    deck: "A system with something to say.",
    description:
      "Semantic roles give every word a purpose. Inter Variable keeps reading comfortable; Space Grotesk Variable gives display text its character.",
  },
  spacing: {
    title: "Spacing",
    deck: "Give the details room to breathe.",
    description:
      "Numeric primitives set the rhythm. Semantic relationships and density give each layout the room it needs.",
  },
  "sizing-layout": {
    title: "Sizing & layout",
    deck: "Fit the content. Reach the controls.",
    description:
      "Independent size contracts keep controls predictable while containers, viewport thresholds, and gutters make layouts adapt.",
  },
  surfaces: {
    title: "Radius, borders & shadows",
    deck: "Quiet structure. Clear depth.",
    description:
      "Contextual corners, semantic edges and restrained depth connect the controls to the surfaces around them.",
  },
  materials: {
    title: "Materials",
    deck: "A finish with a purpose.",
    description:
      "Static finishes bring tactile character to controls and surfaces, with optional styles and explicit effects reduction.",
  },
  shape: {
    title: "Shape",
    deck: "Give geometry a role.",
    description:
      "Semantic silhouettes connect controls and containers. Decorative artwork keeps clear of content and focus.",
  },
  emotion: {
    title: "Emotion",
    deck: "A consistent character.",
    description:
      "Coordinated personality presets connect finish, geometry, and response without changing what an action means.",
  },
  haptics: {
    title: "Haptics",
    deck: "Feedback you can choose.",
    description:
      "Meaningful events, optional device adapters, and visual feedback that always stands on its own.",
  },
  motion: {
    title: "Motion",
    deck: "Enough movement to make sense.",
    description:
      "Fast feedback for controls. A measured transition for overlays. Motion explains a change, then gets out of the way.",
  },
};
export type FoundationSlug = keyof typeof foundationPages;

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
