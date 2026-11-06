import { DocsSelect } from "./docs-controls";
import { useState, type CSSProperties } from "react";
import { Button, Heading, Text, Theme } from "@dixy-ui/react";
import {
  colorFamilies,
  neutralColorFamilies,
  accentColorFamilies,
  colorThemePersonalities,
  colorReference,
  semanticColor,
  semanticColors,
  type ColorAppearance,
  type ColorFamily,
  type ColorReference,
  type NeutralColor,
} from "@dixy-ui/tokens";
import { ColorPaletteExplorer } from "./color-palette-explorer";
import { CodeBlock } from "./code-block";
import { usePreviewTheme } from "./app-appearance-provider";

const feedback = [
  ["success", "Saved", "All changes saved."],
  ["danger", "Danger", "Fix the required fields."],
  ["warning", "Warning", "Review before continuing."],
  ["information", "Information", "A little useful context."],
  ["discovery", "Discovery", "Try something new."],
] as const;
type Personality = keyof typeof colorThemePersonalities | "custom";
export function ColorFoundation() {
  const { settings, appearance, setSettings } = usePreviewTheme();
  const {
    neutralColor: neutral,
    accentColor: accent,
    personality,
    radius,
    density,
    motion,
    dir,
  } = settings;
  const [tokenGroup, setTokenGroup] = useState("background");
  const overrides =
    personality === "custom"
      ? {}
      : colorThemePersonalities[personality].overrides;
  const style = Object.fromEntries(
    Object.entries(overrides).map(([role, reference]) => [
      `--dixy-color-${role.replaceAll(".", "-")}`,
      colorReference(reference as ColorReference),
    ]),
  ) as CSSProperties;
  const semanticEntries = Object.entries(semanticColors).filter(([role]) =>
    role.startsWith(`${tokenGroup}.`),
  );
  const hasOverrides = Object.keys(style).length > 0;
  const usageCode = `import "@dixy-ui/react/styles.css";\nimport { Theme, Button } from "@dixy-ui/react";\n${hasOverrides ? `import type { CSSProperties } from "react";\n\nconst themeOverrides = ${JSON.stringify(style, null, 2)} as CSSProperties;\n` : ""}\nexport function App() {\n  return (\n    <Theme appearance="${appearance}" accentColor="${accent}" neutralColor="${neutral}" radius="${radius}" density="${density}" motion="${motion}" dir="${dir}"${hasOverrides ? " style={themeOverrides}" : ""}>\n      <Button>Save changes</Button>\n      <Button color="danger">Delete</Button>\n      <Button color="success">Approve</Button>\n    </Theme>\n  );\n}`;
  return (
    <>
      <div className="color-intro">
        <span className="color-count">12</span>
        <div>
          <h2>Stops with a purpose.</h2>
          <p>
            {colorFamilies.length} palettes: {neutralColorFamilies.length}{" "}
            neutral bases and {accentColorFamilies.length} color families.
            Separate light and dark ramps, plus black and white alpha overlays.
          </p>
        </div>
      </div>
      <div className="foundation-toolbar color-controls">
        <label>
          Appearance
          <DocsSelect
            aria-label="Appearance"
            value={appearance}
            onValueChange={(nextValue) =>
              setSettings({ appearance: nextValue as ColorAppearance })
            }
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </DocsSelect>
        </label>
        <label>
          Brand accent
          <DocsSelect
            aria-label="Brand accent"
            value={accent}
            onValueChange={(nextValue) => {
              setSettings({ accentColor: nextValue as ColorFamily });
            }}
          >
            {colorFamilies.map((family) => (
              <option key={family}>{family}</option>
            ))}
          </DocsSelect>
        </label>
        <label>
          Neutral base
          <DocsSelect
            aria-label="Neutral base"
            value={neutral}
            onValueChange={(nextValue) => {
              setSettings({ neutralColor: nextValue as NeutralColor });
            }}
          >
            {neutralColorFamilies.map((family) => (
              <option key={family}>{family}</option>
            ))}
          </DocsSelect>
        </label>
        <label>
          Theme personality
          <DocsSelect
            aria-label="Theme personality"
            value={personality}
            onValueChange={(nextValue) => {
              const value = nextValue as Personality;
              setSettings(
                value === "custom"
                  ? { personality: value }
                  : {
                      personality: value,
                      accentColor: colorThemePersonalities[value].accentColor,
                      neutralColor: colorThemePersonalities[value].neutralColor,
                    },
              );
            }}
          >
            <option value="minimal">Minimal</option>
            <option value="expressive">Expressive</option>
            <option value="nostalgic">Nostalgic</option>
            <option value="custom">Custom</option>
          </DocsSelect>
        </label>
      </div>
      <Theme
        appearance={appearance}
        accentColor={accent}
        neutralColor={neutral}
        radius={radius}
        density={density}
        motion={motion}
        dir={dir}
        style={style}
        className="color-preview"
      >
        <div className="color-preview-heading">
          <div>
            <span className="eyebrow">A THEME THAT FEELS LIKE YOU</span>
            <Heading size="sm">Workspace settings</Heading>
            <Text tone="muted">Manage your preferences.</Text>
          </div>
          <span className="color-mode-label">
            {appearance} / {accent}
          </span>
        </div>
        <div className="foundation-button-row">
          <Button>Save changes</Button>
          <Button color="neutral" variant="soft">
            Cancel
          </Button>
          <Button color="danger">Delete</Button>
          <Button color="success">Approve</Button>
        </div>
        <div className="color-feedback">
          {feedback.map(([status, label, description]) => (
            <div
              key={status}
              style={{
                background: semanticColor(`background.${status}`),
                color: semanticColor(`text.${status}`),
                borderColor: semanticColor(`border.${status}`),
              }}
            >
              <strong>
                <span
                  aria-hidden="true"
                  style={{ background: semanticColor(`icon.${status}`) }}
                />
                {label}
              </strong>
              <span>{description}</span>
            </div>
          ))}
        </div>
      </Theme>
      <p className="color-note">
        Change the brand accent above: Delete stays destructive, Approve stays
        positive, and feedback retains its own roles. Personalities are
        configurations of the same semantic system.
      </p>
      <h2>Twelve stops. More possibilities.</h2>
      <p>
        Explore cool, warm, and tinted neutrals, the full color family set, and
        transparent black/white overlays. Choose a family and inspect any stop.
      </p>
      <ColorPaletteExplorer
        appearance={appearance}
        accent={accent}
        neutral={neutral}
        radius={radius}
        density={density}
        motion={motion}
        dir={dir}
      />
      <h2>Overlays that blend with the surface.</h2>
      <p>
        Black and white alpha scales have 12 stops from 5% to 95% opacity. Modal
        scrims use <code>color.background.overlay</code>; subtle, strong, and
        inverse roles cover quieter washes and white overlays. Contrast depends
        on the surface underneath.
      </p>
      <h2>Use meaning in your interface.</h2>
      <div className="token-architecture color-architecture">
        <div>
          <span>01</span>
          <strong>Primitive</strong>
          <code>--dixy-color-blue-9</code>
        </div>
        <div>
          <span>02</span>
          <strong>Semantic role</strong>
          <code>--dixy-color-background-action-primary</code>
        </div>
        <div>
          <span>03</span>
          <strong>Component alias</strong>
          <code>--dixy-button-primary-background</code>
        </div>
      </div>
      <p>
        Choose a role for backgrounds, text, icons, borders, and interactions.
        Override semantic variables at the Theme boundary; component aliases and
        portaled dialogs resolve that local theme.
      </p>
      <label className="color-token-filter">
        Token family
        <DocsSelect
          aria-label="Token family"
          value={tokenGroup}
          onValueChange={(nextValue) => setTokenGroup(nextValue)}
        >
          {["background", "text", "icon", "border"].map((group) => (
            <option key={group}>{group}</option>
          ))}
        </DocsSelect>
      </label>
      <div className="table-scroll">
        <table className="api-table">
          <thead>
            <tr>
              <th>Semantic token</th>
              <th>{appearance} mapping</th>
            </tr>
          </thead>
          <tbody>
            {semanticEntries.map(([role, value]) => (
              <tr key={role}>
                <td>
                  <code>color.{role}</code>
                </td>
                <td>
                  <code>{value[appearance]}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2>Pairs, states, and contrast.</h2>
      <p>
        Solid actions use a dedicated foreground shared across default, hover,
        and pressed backgrounds. Amber uses a dark foreground in light mode.
        Validation errors use danger text and border roles, independently of
        destructive actions.
      </p>
      <ul>
        <li>
          Normal text pairs are tested at 4.5:1; focus indicators and
          interactive boundaries at 3:1.
        </li>
        <li>
          Subtle borders are decorative separators, not the sole boundary of a
          control.
        </li>
        <li>
          Tertiary text keeps a readable foreground. Disabled text and icons are
          reserved for unavailable controls.
        </li>
        <li>
          Custom seeds reduce chroma to fit sRGB and reject unsafe action pairs.
          These checks do not establish whole-page accessibility.
        </li>
      </ul>
      <CodeBlock filename="app.tsx" code={usageCode} />
      <h2>Plain CSS or Tailwind v4.</h2>
      <p>
        The token package works without React or Tailwind. The optional Tailwind
        entry maps utilities to the same semantic variables with{" "}
        <code>@theme inline</code>.
      </p>
      <CodeBlock
        language="css"
        filename="app.css"
        code={
          '@import "tailwindcss";\n@import "@dixy-ui/tokens/tailwind.css";\n\n/* Plain CSS: import @dixy-ui/tokens/color.css instead. */\n.workspace {\n  background: var(--dixy-color-background-canvas);\n  color: var(--dixy-color-text-primary);\n}'
        }
      />
      <CodeBlock
        language="html"
        filename="index.html"
        code={
          '<div data-appearance="dark" data-accent="purple" data-neutral="stone">\n  <button class="bg-dixy-action-primary text-dixy-on-action-primary hover:bg-dixy-action-primary-hover active:bg-dixy-action-primary-pressed">\n    Save changes\n  </button>\n</div>'
        }
      />
      <h2>Make a custom brand.</h2>
      <CodeBlock
        filename="custom-theme.tsx"
        code={
          'import { createColorPalette, colorThemeVariables } from "@dixy-ui/tokens";\nimport { Theme } from "@dixy-ui/react";\n\nconst palette = createColorPalette([0.54, 0.18, 260]);\n\nexport function CustomTheme() {\n  return (\n    <Theme appearance="dark" style={colorThemeVariables(palette, "dark")}>\n      Your interface\n    </Theme>\n  );\n}'
        }
      />
      <p>
        Blue is the default library accent. Purple is Dixy’s documentation
        identity. Choose the neutral base independently with{" "}
        <code>neutralColor="stone"</code>, for example. Earlier{" "}
        <code>--dixy-accent</code> and surface variables remain read aliases;
        new customization should target semantic names.
      </p>
      <p className="color-sources">
        Design references:{" "}
        <a
          href="https://tailwindcss.com/docs/colors"
          target="_blank"
          rel="noreferrer"
        >
          Tailwind palette families
        </a>
        ,{" "}
        <a
          href="https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale"
          target="_blank"
          rel="noreferrer"
        >
          Radix scale roles
        </a>
        ,{" "}
        <a
          href="https://atlassian.design/foundations/color/"
          target="_blank"
          rel="noreferrer"
        >
          Atlassian semantics
        </a>
        ,{" "}
        <a
          href="https://tailwindcss.com/docs/theme"
          target="_blank"
          rel="noreferrer"
        >
          Tailwind theme variables
        </a>
        , and{" "}
        <a
          href="https://www.w3.org/TR/css-color-4/"
          target="_blank"
          rel="noreferrer"
        >
          CSS Color 4
        </a>
        .
      </p>
    </>
  );
}
