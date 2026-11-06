import { DocsSelect, DocsSwitch } from "./docs-controls";
import { useState } from "react";
import { Button, Heading, Inline, Stack, Text, Theme } from "@dixy-ui/react";
import {
  space,
  spacingPrimitives,
  spacingDensity,
  semanticSpacing,
  type Density,
  type SpaceToken,
} from "@dixy-ui/tokens";
import { CodeBlock } from "./code-block";
import { spacingExample } from "../lib/spacing-example";
import { useDocsAppearance } from "./docs-shell";

const primitives = Object.entries(spacingPrimitives).sort(
  (a, b) => a[1] - b[1],
);
const densities = Object.keys(spacingDensity) as Density[];

export function SpacingFoundation() {
  const [density, setDensity] = useState<Density>("default");
  const [gap, setGap] = useState<"sm" | "md" | "lg">("md");
  const [rtl, setRtl] = useState(false);
  const [selected, setSelected] = useState<SpaceToken>("200");
  const appearance = useDocsAppearance();
  return (
    <>
      <h2>The primitive scale</h2>
      <p>
        The suffix is a percentage of an 8px base unit: space.100 is 8px and
        space.200 is 16px. The 16 steps include zero, fine 2px adjustments, and
        96px / 160px layout extensions. Values use rem; pixel labels assume a
        16px root. Appearance and density never rewrite these primitives.
      </p>
      <div className="spacing-scale" aria-label="Primitive spacing scale">
        {primitives.map(([id, px]) => (
          <Button
            variant="ghost"
            color="neutral"
            size="sm"
            key={id}
            type="button"
            aria-pressed={selected === id}
            onClick={() => setSelected(id as SpaceToken)}
          >
            <code>space.{id}</code>
            <span className="spacing-bar-track" aria-hidden="true">
              <span style={{ inlineSize: space(id as SpaceToken) }} />
            </span>
            <small>
              {px}px · {px / 16}rem
            </small>
          </Button>
        ))}
      </div>
      <CodeBlock
        language="css"
        filename="selected-token.css"
        code={`.example {\n  padding-inline: var(--dixy-space-${selected});\n}`}
      />
      <h2>Meaning between the numbers</h2>
      <p>
        Primitives describe a value. Semantic tokens describe a relationship.
        Component aliases describe a local decision, such as --dixy-card-padding
        → --dixy-spacing-inset-md → --dixy-space-200. Change semantic mappings
        on a density scope to customize relationships.
      </p>
      <div className="table-scroll">
        <table className="api-table">
          <caption>Default semantic mappings</caption>
          <thead>
            <tr>
              <th>Family</th>
              <th>Use</th>
              <th>Size → primitive</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(semanticSpacing).map(([family, sizes]) => (
              <tr key={family}>
                <td>
                  <code>spacing.{family}.*</code>
                </td>
                <td>
                  {
                    {
                      inline: "Related items in a row",
                      stack: "Related items in a column",
                      section: "Major content sections",
                      inset: "Internal container padding",
                    }[family]
                  }
                </td>
                <td>
                  {Object.entries(sizes).map(([size, token]) => (
                    <div key={size}>
                      <code>
                        {size} → space.{token}
                      </code>
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Use inline xs–sm for icon/label relationships, stack sm–md for fields
        and groups, and section sm–xl for major regions. Section and inline
        mappings stay fixed across the initial density modes. Inset and stack
        use explicit adjacent scale steps, with no global multiplier.
      </p>
      <h2>Try density and layout</h2>
      <div className="foundation-toolbar spacing-controls">
        <label>
          Density
          <DocsSelect
            value={density}
            onValueChange={(nextValue) => setDensity(nextValue as Density)}
          >
            {densities.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </DocsSelect>
        </label>
        <label>
          Stack gap
          <DocsSelect
            value={gap}
            onValueChange={(nextValue) => setGap(nextValue as typeof gap)}
          >
            {["sm", "md", "lg"].map((value) => (
              <option key={value}>{value}</option>
            ))}
          </DocsSelect>
        </label>
        <label>
          <DocsSwitch
            checked={rtl}
            onCheckedChange={(nextChecked) => setRtl(nextChecked)}
          />
          Right to left
        </label>
      </div>
      <Theme
        density={density}
        appearance={appearance}
        dir={rtl ? "rtl" : "ltr"}
        className="spacing-live-preview"
      >
        <Stack gap={gap} style={{ padding: "var(--dixy-card-padding)" }}>
          <Heading as="h2" size="sm">
            Your workspace
          </Heading>
          <Text>Spacing follows density. Controls keep their height.</Text>
          <Inline gap="sm" align="center">
            <Button>Save changes</Button>
            <Button variant="outline">Cancel</Button>
          </Inline>
        </Stack>
      </Theme>
      <CodeBlock code={spacingExample(density, gap, rtl)} collapsible />
      <h3>Compare all three</h3>
      <div className="density-comparison">
        {densities.map((mode) => (
          <Theme
            key={mode}
            density={mode}
            appearance={appearance}
            className="density-specimen"
          >
            <Stack gap="sm" style={{ padding: "var(--dixy-card-padding)" }}>
              <strong>{mode}</strong>
              <Text size="sm">A shared 40px control height.</Text>
              <Button variant="outline">Continue</Button>
            </Stack>
          </Theme>
        ))}
      </div>
      <h3>Nested scopes</h3>
      <Theme
        density="compact"
        appearance={appearance}
        className="spacing-nested-preview"
      >
        <Stack gap="md" style={{ padding: "var(--dixy-card-padding)" }}>
          <Text size="sm">Compact parent · 12px inset</Text>
          <Theme density="comfortable" className="spacing-nested-child">
            <Stack gap="md" style={{ padding: "var(--dixy-card-padding)" }}>
              <Text size="sm">Comfortable child · 20px inset</Text>
              <Button>Nested action</Button>
            </Stack>
          </Theme>
        </Stack>
      </Theme>
      <CodeBlock
        code={
          '<Theme density="compact">\n  <Theme density="comfortable">\n    <Stack gap="md">Comfortable spacing inside a compact layout.</Stack>\n  </Theme>\n</Theme>'
        }
      />
      <p>
        Plain HTML can use data-dixy-density="compact", "default", or
        "comfortable" at any nested boundary. Use Theme’s density prop in React
        so Dialog portals receive the same density. CSS ancestor selectors alone
        do not propagate across portals. A nested default scope resets all
        semantic mappings. Component aliases are rebound at each boundary.
      </p>
      <h2>CSS and TypeScript</h2>
      <p>
        The token package has no React or Tailwind dependency. React’s
        stylesheet already includes the spacing foundation; standalone consumers
        import it directly. Helpers return CSS references, so density continues
        to work at runtime. Put custom semantic mappings on the density root.
      </p>
      <CodeBlock
        language="css"
        filename="app.css"
        code={
          '@import "@dixy-ui/tokens/spacing.css";\n\n.settings[data-dixy-density] {\n  --dixy-spacing-inset-md: var(--dixy-space-250);\n}\n.settings {\n  padding-inline: var(--dixy-spacing-inset-md);\n  padding-block: var(--dixy-spacing-inset-sm);\n  gap: var(--dixy-spacing-stack-md);\n}'
        }
      />
      <CodeBlock
        filename="spacing.ts"
        code={
          'import { space, spacing, spacingPrimitives, type SpaceToken, type Density } from "@dixy-ui/tokens";\n\nconst token: SpaceToken = "200";\nconst density: Density = "compact";\nconst padding = space(token); // "var(--dixy-space-200)"\nconst gap = spacing("stack", "md"); // semantic, density-aware\nconst referencePixels = spacingPrimitives[token]; // 16'
        }
      />
      <h3>Stack and Inline contracts</h3>
      <p>
        Stack defaults to gap="md" from spacing.stack; Inline defaults to
        gap="sm", align="center", and wrap=true from spacing.inline. Both accept
        xs, sm, md, lg, xl, native attributes, refs, className and style. Choose
        a semantic HTML element with as, such as section, nav, ul, or form. Each
        primitive renders one element. Inline wraps by default and follows the
        element’s writing direction. Style overrides take precedence over the
        generated gap rules.
      </p>
      <h2>Tailwind integration</h2>
      <p>
        This project uses plain CSS. Tailwind is optional and is not installed.
        In a Tailwind v4 consumer, add only the tokens you use to its theme;
        leave the default spacing scale intact. This example is provided for
        integration and has not been compiled against Tailwind in this
        repository.
      </p>
      <CodeBlock
        language="css"
        filename="tailwind.css"
        code={
          '@import "tailwindcss";\n@import "@dixy-ui/tokens/spacing.css";\n\n@theme inline {\n  --spacing-dixy-100: var(--dixy-space-100);\n  --spacing-dixy-200: var(--dixy-space-200);\n}\n/* <div class="p-dixy-200 gap-dixy-100"></div> */'
        }
      />
      <h2>Spacing, sizing, and optical adjustments</h2>
      <p>
        Spacing defines relationships around content. Control heights, icon
        sizes, focus rings and minimum interaction targets are separate sizing
        decisions. Compact density must not shrink those targets or typography.
        Prefer logical padding and margin properties for RTL, wrapping layouts
        on narrow screens, and rem values that follow the reader’s root font
        size. Test reflow and browser zoom at 200% and 400% with real content.
      </p>
      <p>
        Use a 2px or 6px primitive for a deliberate optical adjustment and
        explain the exception locally. Avoid arbitrary values when a token fits.
        Negative gaps and padding are invalid; no negative token variants are
        provided. An explicit Bleed primitive and negative-margin use cases
        remain future work. Radius stays an independent Theme setting documented
        under Theming.
      </p>
      <h3>Migrating the alpha scale</h3>
      <p>
        Replace --dixy-space-1…8 with --dixy-space-050, -100, -150, -200, -300,
        -400, -600, and -800 respectively. Prefer semantic aliases in
        components. The old names are removed to keep one numeric vocabulary.
        Button gap now follows inline.sm (4px), input padding follows inset.sm
        (12px), and dialog padding follows inset.lg (24px) at the default
        density.
      </p>
    </>
  );
}
