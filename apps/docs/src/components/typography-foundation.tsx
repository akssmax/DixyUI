import { DocsSlider } from "./docs-controls";
import { DocsSelect } from "./docs-controls";
import { TextField } from "@dixy-ui/react";
import { useState, type CSSProperties } from "react";
import {
  fontFamilies,
  fontWeightPrimitives,
  typography,
  variableFontAxes,
} from "@dixy-ui/tokens";
import { Heading, Text } from "@dixy-ui/react";
import { CodeBlock } from "./code-block";

const references = [
  [
    "Primer",
    "Practical UI roles and paired size/leading.",
    "Keep body, title, caption and code distinct.",
    "https://primer.style/product/primitives/typography/",
  ],
  [
    "Radix Themes",
    "A compact numeric scale; semantic HTML stays independent.",
    "Keep as separate from visual variant; use paired styles.",
    "https://www.radix-ui.com/themes/docs/theme/typography",
  ],
  [
    "Apple HIG",
    "Legibility, text styles and layouts that adapt to larger text.",
    "Avoid light small text; test resizing. Native point values are platform specific.",
    "https://developer.apple.com/design/human-interface-guidelines/typography",
  ],
  [
    "Material 3",
    "Display, headline, title, body and label roles, with size variants.",
    "Adopt role families, using heading as our web-oriented name for headline.",
    "https://m3.material.io/styles/typography/overview",
  ],
  [
    "Atlassian",
    "Meaning-based tokens that bundle coordinated font properties.",
    "Use foundation.role.size names and rem values.",
    "https://atlassian.design/foundations/typography",
  ],
] as const;

export function TypographyFoundation() {
  const [face, setFace] = useState<"inter" | "spaceGrotesk">("inter");
  const [weight, setWeight] = useState(550);
  const [optical, setOptical] = useState<"auto" | "none">("auto");
  const [sample, setSample] = useState("Good interfaces have a clear voice.");
  const axes = variableFontAxes[face];
  const family = face === "inter" ? fontFamilies.sans : fontFamilies.display;
  const effectiveWeight = Math.max(
    axes.wght.min,
    Math.min(axes.wght.max, weight),
  );
  return (
    <>
      <div className="type-specimen">
        <span className="eyebrow">SPACE GROTESK / DISPLAY</span>
        <Heading as="h2" variant="display.md">
          A clear voice.
          <br />
          At every scale.
        </Heading>
        <span className="eyebrow">INTER / INTERFACE</span>
        <Text variant="body.lg">
          Expressive when it matters. Comfortable everywhere.
        </Text>
        <Text>
          These docs use the same type contracts as the components: 16px body
          text, 14px compact text, and 12px supporting captions at a default
          16px root.
        </Text>
      </div>

      <h2>Our recommendation</h2>
      <p>
        Use a semantic system with 18 roles across display, heading, title,
        body, label, caption and code. Inter Variable is the default interface
        face. Space Grotesk Variable brings character to short display
        statements. JetBrains Mono is a static code face; code does not need a
        variation axis to stay part of the same system.
      </p>
      <p>
        Sizes and line heights use rem; tracking uses em. The root font size
        stays under the reader’s control. Display tokens are fixed contracts:
        layouts explicitly choose a smaller role at narrow widths. Density
        changes spacing, never text size.
      </p>
      <div className="table-scroll">
        <table className="api-table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Useful principle</th>
              <th>Our decision</th>
            </tr>
          </thead>
          <tbody>
            {references.map(([name, principle, decision, url]) => (
              <tr key={name}>
                <th scope="row">
                  <a href={url} target="_blank" rel="noreferrer">
                    {name} ↗
                  </a>
                </th>
                <td>{principle}</td>
                <td>{decision}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Names describe purpose</h2>
      <p>
        Three layers keep raw values out of components. A primitive supplies a
        value; a semantic style pairs the values; a component chooses the
        appropriate style. This follows{" "}
        <a
          href="https://atlassian.design/foundations/tokens/design-tokens"
          target="_blank"
          rel="noreferrer"
        >
          Atlassian’s meaning-based naming guidance
        </a>
        , adapted to Dixy.
      </p>
      <div className="token-architecture">
        <div>
          <span>01 / PRIMITIVE</span>
          <strong>font.size.16</strong>
          <code>1rem</code>
        </div>
        <div>
          <span>02 / SEMANTIC</span>
          <strong>font.body.md</strong>
          <code>400 · 16 / 24</code>
        </div>
        <div>
          <span>03 / COMPONENT</span>
          <strong>Text default</strong>
          <code>body.md</code>
        </div>
      </div>
      <CodeBlock
        language="css"
        filename="article.css"
        code={
          ".article-copy {\n  font: var(--dixy-font-body-md);\n  letter-spacing: var(--dixy-font-body-md-letter-spacing);\n}\n\n/* Individual properties remain available for composition. */\n.article-copy strong {\n  font-weight: var(--dixy-font-weight-semibold);\n}"
        }
      />
      <p>
        The CSS font shorthand includes family, size, leading and weight. Letter
        spacing is a separate token because CSS does not include it in font. Use
        complete styles by default; split properties only for a deliberate
        variation.
      </p>

      <h2>The type scale</h2>
      <p>
        Every specimen below reads its values from the published token package.
        Pixel references describe the default root, while the rendered values
        remain relative.
      </p>
      <div className="typography-scale">
        {Object.entries(typography).map(([role, token]) => (
          <div className="typography-row" key={role}>
            <div className="typography-row-meta">
              <code>font.{role}</code>
              <span>
                {token.size} / {token.lineHeight} ·{" "}
                {fontWeightPrimitives[token.weight]} · {token.family}
              </span>
            </div>
            <p data-typography={role}>
              {role.startsWith("code")
                ? 'const clarity = "considered";'
                : "Clarity has character."}
            </p>
            <p className="typography-row-description">{token.description}</p>
          </div>
        ))}
      </div>

      <h2>Explore variable fonts</h2>
      <p>
        Inter supports weight 100–900 and optical size 14–32 in the bundled
        file. Space Grotesk supports weight 300–700. Optical sizing adapts
        Inter’s outlines to the rendered size; it does not change the selected
        token’s font size.
      </p>
      <div className="type-lab">
        <div className="foundation-toolbar">
          <label>
            Typeface
            <DocsSelect
              value={face}
              onValueChange={(nextValue) => setFace(nextValue as typeof face)}
            >
              <option value="inter">Inter Variable</option>
              <option value="spaceGrotesk">Space Grotesk Variable</option>
            </DocsSelect>
          </label>
          <label>
            Weight · {effectiveWeight}
            <DocsSlider
              aria-label="Font weight"
              min={axes.wght.min}
              max={axes.wght.max}
              step={1}
              value={effectiveWeight}
              onValueChange={(nextValue) => setWeight(Number(nextValue))}
            />
          </label>
          {face === "inter" && (
            <label>
              Optical sizing
              <DocsSelect
                value={optical}
                onValueChange={(nextValue) =>
                  setOptical(nextValue as typeof optical)
                }
              >
                <option value="auto">Auto</option>
                <option value="none">None</option>
              </DocsSelect>
            </label>
          )}
        </div>
        <label className="type-lab-input">
          Specimen text
          <TextField
            value={sample}
            onValueChange={(nextValue) => setSample(nextValue)}
          />
        </label>
        <p
          className="type-lab-preview"
          style={
            {
              fontFamily: family,
              fontWeight: effectiveWeight,
              fontOpticalSizing: face === "inter" ? optical : "none",
            } as CSSProperties
          }
        >
          {sample || "Type something to explore."}
        </p>
      </div>
      <CodeBlock
        language="css"
        filename="variable-type.css"
        code={`.specimen {\n  font-family: ${family};\n  font-size: var(--dixy-font-heading-lg-size);\n  line-height: var(--dixy-font-heading-lg-line-height);\n  font-weight: ${effectiveWeight};\n${face === "inter" ? `  font-optical-sizing: ${optical};\n` : ""}}`}
      />
      <p>
        Use font-weight and font-optical-sizing before low-level
        font-variation-settings. Do not expose width, grade or slant controls
        for files that do not have those axes. The docs self-host normal and
        italic Inter faces with font-display: swap; the library itself downloads
        no fonts. Our current subsets cover Latin text, with system fallback for
        other scripts.
      </p>

      <h2>Meaning and visual hierarchy</h2>
      <p>
        Choose the heading level from the document outline, then choose its
        visual role. Title styles can still be semantic headings. A caption
        style does not make content a caption element, and a code style does not
        turn a paragraph into code.
      </p>
      <CodeBlock
        code={
          '<Heading as="h2" variant="title.lg">Project details</Heading>\n<Text variant="body.md">A comfortable reading default.</Text>\n<Text as="span" variant="caption">Updated just now</Text>'
        }
      />
      <h2>Reading and accessibility</h2>
      <p>
        Keep long text around 60–70 characters per line. Use 400 or heavier for
        small text and reserve 12px styles for supporting content. Inputs stay
        at 16px across densities. Allow wrapping and avoid fixed text container
        heights. Test 200% zoom, text spacing overrides and narrow reflow;
        native Dynamic Type values are not a direct web pixel scale.
      </p>
    </>
  );
}
