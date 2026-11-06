import { DocsSelect, DocsSwitch } from "./docs-controls";
import { Button } from "@dixy-ui/react";
import { useEffect, useRef, useState } from "react";
import { Theme } from "@dixy-ui/react";
import {
  breakpoints,
  containerWidths,
  minWidth,
  responsiveGutters,
  sizing,
  type ContainerSize,
  type ControlSize,
  type Density,
  type TargetSize,
} from "@dixy-ui/tokens";
import SizingLayoutExample from "../demos/sizing-layout-example";
import source from "../demos/sizing-layout-example?raw";
import { configureExample } from "../lib/example-source";
import { CodeBlock } from "./code-block";
import { useDocsAppearance } from "./docs-shell";
import api from "../generated/api.json";

export function SizingLayoutFoundation() {
  const [controlSize, setControlSize] = useState<ControlSize>("md");
  const [targetSize, setTargetSize] = useState<TargetSize>("minimum");
  const [density, setDensity] = useState<Density>("default");
  const [containerSize, setContainerSize] = useState<ContainerSize>("xl");
  const [rtl, setRtl] = useState(false);
  const [metrics, setMetrics] = useState("Measuring the layout…");
  const preview = useRef<HTMLDivElement>(null);
  const appearance = useDocsAppearance();
  const [resetKey, setResetKey] = useState(0);
  useEffect(() => {
    const element = preview.current;
    if (!element) return;
    const measure = () => {
      const container = element.querySelector(".sizing-layout-container");
      if (!container) return;
      const active =
        Object.entries(breakpoints)
          .filter(
            ([name]) =>
              window.matchMedia(minWidth(name as keyof typeof breakpoints))
                .matches,
          )
          .at(-1)?.[0] ?? "base";
      setMetrics(
        `Viewport ${window.innerWidth}px · ${active} range · container ${Math.round(container.getBoundingClientRect().width)}px · gutter ${getComputedStyle(container).paddingInlineStart}`,
      );
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    window.addEventListener("resize", measure);
    measure();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [containerSize, resetKey]);
  function reset() {
    setControlSize("md");
    setTargetSize("minimum");
    setDensity("default");
    setContainerSize("xl");
    setRtl(false);
    setResetKey((value) => value + 1);
  }
  const code = configureExample(
    source,
    { controlSize, targetSize, density, containerSize, rtl },
    { appearance, accentColor: "violet", radius: "md" },
  );
  return (
    <>
      <h2>Six contracts, one foundation</h2>
      <p>
        Spacing describes relationships. Sizing describes the box that holds or
        activates content. Density changes spacing only: it never rewrites
        control heights, icon sizes, interaction targets, viewport breakpoints,
        or gutters. The values below are Dixy’s initial web contracts, chosen to
        extend the existing control scale.
      </p>
      <div
        className="table-scroll"
        tabIndex={0}
        aria-label="Sizing token table"
      >
        <table className="api-table sizing-tokens-table">
          <caption>Sizing tokens at a 16px root</caption>
          <thead>
            <tr>
              <th>Family</th>
              <th>Token</th>
              <th>Reference size</th>
              <th>CSS value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(sizing).flatMap(([family, tokens]) =>
              Object.entries(tokens).map(([token, px]) => (
                <tr key={`${family}-${token}`}>
                  <th scope="row">
                    <code>{family}</code>
                  </th>
                  <td>
                    <code>
                      --dixy-size-{family}-{token}
                    </code>
                  </td>
                  <td>{px}px</td>
                  <td>
                    <code>
                      {family === "target"
                        ? `max(${px}px, ${px / 16}rem)`
                        : `${px / 16}rem`}
                    </code>
                  </td>
                </tr>
              )),
            )}
          </tbody>
        </table>
      </div>
      <p>
        Controls retain sm / md / lg heights of 32 / 40 / 48px. Icons use 12 /
        16 / 20 / 24 / 32 / 48px; an icon’s size does not define its hit area.
        Button icons are 16px, or 20px on large buttons. IconButton’s actual box
        is at least 44 × 44px, even when its size prop is sm. Loading icons use
        the 16px token.
      </p>
      <h2>Try the complete layout</h2>
      <div className="foundation-toolbar sizing-layout-controls">
        <label>
          Control size
          <DocsSelect
            value={controlSize}
            onValueChange={(nextValue) =>
              setControlSize(nextValue as ControlSize)
            }
          >
            {Object.keys(sizing.control).map((value) => (
              <option key={value}>{value}</option>
            ))}
          </DocsSelect>
        </label>
        <label>
          Target policy
          <DocsSelect
            value={targetSize}
            onValueChange={(nextValue) =>
              setTargetSize(nextValue as TargetSize)
            }
          >
            {Object.keys(sizing.target).map((value) => (
              <option key={value}>{value}</option>
            ))}
          </DocsSelect>
        </label>
        <label>
          Density
          <DocsSelect
            value={density}
            onValueChange={(nextValue) => setDensity(nextValue as Density)}
          >
            {["compact", "default", "comfortable"].map((value) => (
              <option key={value}>{value}</option>
            ))}
          </DocsSelect>
        </label>
        <label>
          Container max
          <DocsSelect
            value={containerSize}
            onValueChange={(nextValue) =>
              setContainerSize(nextValue as ContainerSize)
            }
          >
            {Object.keys(containerWidths).map((value) => (
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
        <Button
          variant="ghost"
          color="neutral"
          size="sm"
          type="button"
          className="sizing-reset"
          onClick={reset}
        >
          Reset example
        </Button>
      </div>
      <output
        className="sizing-layout-metrics"
        aria-live="off"
        aria-label="Layout measurements"
      >
        {metrics}
      </output>
      <div ref={preview} className="sizing-layout-preview">
        <Theme appearance={appearance}>
          <SizingLayoutExample
            key={resetKey}
            controlSize={controlSize}
            targetSize={targetSize}
            density={density}
            containerSize={containerSize}
            rtl={rtl}
          />
        </Theme>
      </div>
      <CodeBlock code={code} collapsible filename="sizing-layout-example.tsx" />
      <h2>Interaction targets have their own floor</h2>
      <p>
        The minimum token uses a 24 CSS pixel floor; comfortable uses a 44 CSS
        pixel floor. Both grow with the root font size. These floors survive
        smaller root fonts, and remain independent of density. Buttons and
        inputs use the minimum policy by default; icon buttons always use the
        larger floor. On devices reporting any coarse pointer, buttons and
        inputs also use at least the comfortable target. The policy enlarges the
        actual box, so adjacent targets do not overlap through invisible
        pseudo-elements.
      </p>
      <p>
        The{" "}
        <a
          href="https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum"
          target="_blank"
          rel="noreferrer"
        >
          WCAG 2.2 minimum target criterion
        </a>{" "}
        uses 24 × 24 CSS pixels with exceptions; the{" "}
        <a
          href="https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced"
          target="_blank"
          rel="noreferrer"
        >
          enhanced criterion
        </a>{" "}
        uses 44 × 44. Token adoption alone does not establish conformance:
        content, spacing, focus, labels, and real device use still need review.
        The playground’s comfortable policy can test larger boxes on a
        fine-pointer desktop.
      </p>
      <CodeBlock
        language="css"
        filename="target-policy.css"
        code={
          ".touch-friendly-region {\n  --dixy-interaction-target: var(--dixy-size-target-comfortable);\n}\n/* Apply to a Theme root to carry the override through Dialog portals. */"
        }
      />
      <h2>Containers and responsive gutters</h2>
      <div className="table-scroll">
        <table className="api-table">
          <caption>Container maximums, including gutters</caption>
          <thead>
            <tr>
              <th>Token</th>
              <th>Reference maximum</th>
              <th>REM</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(containerWidths).map(([token, px]) => (
              <tr key={token}>
                <th scope="row">
                  <code>--dixy-container-{token}</code>
                </th>
                <td>{px}px</td>
                <td>{px / 16}rem</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Container defaults to xl, centers with logical margins, and stays within
        its parent. Its maximum includes inline padding. Gutters use the
        existing immutable space scale: base → space.{responsiveGutters.base}{" "}
        (16px), sm → space.{responsiveGutters.sm} (24px), lg → space.
        {responsiveGutters.lg}
        (32px). They follow the viewport, including when a Container sits in a
        narrow parent. These are viewport queries, not container queries.
      </p>
      <CodeBlock
        language="css"
        filename="layout.css"
        code={
          '@import "@dixy-ui/tokens/spacing.css";\n@import "@dixy-ui/tokens/layout.css";\n\n.page {\n  box-sizing: border-box;\n  inline-size: 100%;\n  max-inline-size: var(--dixy-container-xl);\n  margin-inline: auto;\n  padding-inline: var(--dixy-layout-gutter);\n}'
        }
      />
      <h3>Container API</h3>
      <p>
        Generated from Container’s local sizing contract. Native attributes,
        typed refs, className, style, and semantic element composition through
        as are forwarded, as they are for Stack and Inline.
      </p>
      <div className="table-scroll">
        <table className="api-table">
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Default</th>
            </tr>
          </thead>
          <tbody>
            {api.ContainerOwnProps.map((prop) => (
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
      <h2>Breakpoints are shared thresholds</h2>
      <div className="table-scroll">
        <table className="api-table">
          <caption>Viewport min-width queries</caption>
          <thead>
            <tr>
              <th>Name</th>
              <th>Reference pixels</th>
              <th>Generated media condition</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(breakpoints).map(([token, px]) => (
              <tr key={token}>
                <th scope="row">
                  <code>{token}</code>
                </th>
                <td>{px}px</td>
                <td>
                  <code>{minWidth(token as keyof typeof breakpoints)}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        CSS custom properties expose threshold values for inspection, but cannot
        be used in media query conditions. The generator emits literal rem
        conditions from the canonical breakpoints; JavaScript uses minWidth with
        matchMedia. Media-query rem units follow the browser’s initial font
        size, while ordinary rem lengths follow the document root. Choose a
        threshold when content needs a new arrangement, not by device name. xl
        and wide remain available without increasing gutters beyond 32px.
      </p>
      <CodeBlock
        filename="tokens.ts"
        code={
          'import { size, container, layoutGutter, minWidth } from "@dixy-ui/tokens";\n\nconst controlHeight = size("control", "md");\nconst iconSize = size("icon", "sm");\nconst contentMaximum = container("lg");\nconst padding = layoutGutter;\n// Browser code only; the token module itself is safe for SSR.\nconst query = window.matchMedia(minWidth("lg"));'
        }
      />
      <h2>Adapt without clipping content</h2>
      <p>
        Keep inputs fluid, wrap actions, and use min-inline-size: 0 on flex/grid
        children. Avoid fixed-height content panels. Control tokens define
        nominal heights; the target policy can increase the rendered height.
        Keep icons decorative unless they communicate content, name icon-only
        actions, and preserve visible focus indicators. Test long labels, RTL,
        enlarged text, 320px reflow, and real 200%/400% browser zoom. Resizing a
        viewport is not the same as zooming. These foundations add no animation.
      </p>
      <p>
        Existing --dixy-height-sm/md/lg overrides remain available as aliases to
        the new control sizing contract. Override those on Theme roots for
        legacy control-height customization; use --dixy-size-control-* for new
        work. No responsive prop engine, new router, or Tailwind dependency is
        introduced.
      </p>
    </>
  );
}
