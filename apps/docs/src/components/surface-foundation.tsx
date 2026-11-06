import { DocsSelect, DocsSwitch } from "./docs-controls";
import { Button } from "@dixy-ui/react";
import { useState } from "react";
import { Theme } from "@dixy-ui/react";
import {
  borderWidth,
  borderRoles,
  borderWidths,
  radius,
  radiusPrimitives,
  radiusPresets,
  shadow,
  shadowLayers,
  shadowValue,
  type BorderRole,
  type Density,
  type RadiusPreset,
  type ShadowRole,
} from "@dixy-ui/tokens";
import SurfaceExample from "../demos/surface-example";
import source from "../demos/surface-example?raw";
import { configureExample } from "../lib/example-source";
import { useDocsAppearance } from "./docs-shell";
import { CodeBlock } from "./code-block";

const references = [
  {
    name: "Radix Themes",
    url: "https://www.radix-ui.com/themes/docs/theme/radius",
    point:
      "Contextual radius settings let controls become pills while content panels keep usable geometry.",
    choice:
      "Keep a Theme preset and map it to separate control, card and overlay roles.",
  },
  {
    name: "Radix shadows",
    url: "https://www.radix-ui.com/themes/docs/theme/shadows",
    point:
      "A six-step shadow scale distinguishes inset, content panels, small overlays and large overlays.",
    choice:
      "Use five named roles including none, with two restrained layers for elevated surfaces.",
  },
  {
    name: "Material 3 shape",
    url: "https://m3.material.io/styles/shape/corner-radius-scale",
    point:
      "The current ten-style scale ranges from square through fully rounded. It also describes optical roundness for nested shapes.",
    choice:
      "Use a smaller everyday web scale, keeping 10px controls and 12/16px panel defaults rather than adopting the full expressive range.",
  },
  {
    name: "Material elevation",
    url: "https://material-web.dev/components/elevation/",
    point:
      "Six elevation levels make depth an intentional hierarchy rather than arbitrary decoration.",
    choice:
      "Use semantic depth roles; do not imply that box-shadow sets z-index.",
  },
  {
    name: "Apple materials",
    url: "https://developer.apple.com/design/human-interface-guidelines/materials",
    point:
      "Material and depth distinguish functional layers from content while protecting legibility.",
    choice:
      "Keep opaque content surfaces and visible borders; glass and blur are not prerequisites for depth.",
  },
  {
    name: "Apple concentric corners",
    url: "https://developer.apple.com/documentation/swiftui/edge/corner/style/concentric",
    point:
      "Related nested corners share a center; the inner radius accounts for the distance from its container.",
    choice:
      "Use outer radius minus inset, clamp at zero, and account for the outer border.",
  },
] as const;

export function SurfaceFoundation() {
  const [radiusPreset, setRadiusPreset] = useState<RadiusPreset>("md");
  const [borderRole, setBorderRole] = useState<BorderRole>("default");
  const [elevation, setElevation] = useState<ShadowRole>("raised");
  const [density, setDensity] = useState<Density>("default");
  const [rtl, setRtl] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const appearance = useDocsAppearance();
  const code = configureExample(
    source,
    { radiusPreset, borderRole, elevation, density, rtl },
    { appearance, accentColor: "blue", radius: "md" },
  );
  function reset() {
    setRadiusPreset("md");
    setBorderRole("default");
    setElevation("raised");
    setDensity("default");
    setRtl(false);
    setResetKey((value) => value + 1);
  }
  return (
    <>
      <h2>The middle ground</h2>
      <p>
        Use compact controls, gently rounded panels, clear 1px edges, and
        restrained depth. The default control remains 10px; cards use 12px and
        overlays 16px. This is Dixy’s web interpretation of the references
        below, not a copy of any platform’s pixel or dp values.
      </p>
      <div
        className="table-scroll"
        tabIndex={0}
        aria-label="Surface design references"
      >
        <table className="api-table surface-reference-table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Principle</th>
              <th>Dixy decision</th>
            </tr>
          </thead>
          <tbody>
            {references.map((ref) => (
              <tr key={ref.name}>
                <th scope="row">
                  <a href={ref.url} target="_blank" rel="noreferrer">
                    {ref.name} ↗
                  </a>
                </th>
                <td>{ref.point}</td>
                <td>{ref.choice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Radix’s small scale gives us practical restraint; Material’s roles give
        depth a purpose; Apple’s nested geometry keeps corners coherent. The
        flat/default case stays quiet. Border colors continue to come from the
        existing semantic color foundation.
      </p>
      <h2>Try a surface and its overlay</h2>
      <div className="foundation-toolbar surface-controls">
        <label>
          Radius preset
          <DocsSelect
            value={radiusPreset}
            onValueChange={(nextValue) =>
              setRadiusPreset(nextValue as RadiusPreset)
            }
          >
            {Object.keys(radiusPresets).map((value) => (
              <option key={value}>{value}</option>
            ))}
          </DocsSelect>
        </label>
        <label>
          Border role
          <DocsSelect
            value={borderRole}
            onValueChange={(nextValue) =>
              setBorderRole(nextValue as BorderRole)
            }
          >
            {Object.keys(borderRoles).map((value) => (
              <option key={value}>{value}</option>
            ))}
          </DocsSelect>
        </label>
        <label>
          Shadow role
          <DocsSelect
            value={elevation}
            onValueChange={(nextValue) => setElevation(nextValue as ShadowRole)}
          >
            {Object.keys(shadowLayers).map((value) => (
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
          Reset surface
        </Button>
      </div>
      <Theme
        appearance={appearance}
        accentColor="blue"
        className="surface-preview"
      >
        <SurfaceExample
          key={resetKey}
          radiusPreset={radiusPreset}
          borderRole={borderRole}
          elevation={elevation}
          density={density}
          rtl={rtl}
        />
      </Theme>
      <CodeBlock code={code} collapsible filename="surface-example.tsx" />
      <p>
        The selected shadow and border apply to the example card. Inspect
        overlay opens a real Base UI dialog: it always uses the overlay radius
        and shadow roles. Nested Theme settings and inline token overrides are
        preserved through its portal. Reset also restores the input and action
        feedback.
      </p>
      <h2>Radius: values and relationships</h2>
      <div className="surface-radius-scale">
        {Object.entries(radiusPrimitives).map(([token, px]) => (
          <div key={token}>
            <span
              style={{
                borderRadius: radius(token as keyof typeof radiusPrimitives),
              }}
            />
            <code>radius.{token}</code>
            <small>
              {token === "full" ? "Capsule" : `${px}px · ${px / 16}rem`}
            </small>
          </div>
        ))}
      </div>
      <div className="table-scroll">
        <table className="api-table">
          <caption>Theme preset → primitive at a 16px root</caption>
          <thead>
            <tr>
              <th>Preset</th>
              <th>Control</th>
              <th>Card</th>
              <th>Overlay</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(radiusPresets).map(([preset, roles]) => (
              <tr key={preset}>
                <th scope="row">
                  <code>{preset}</code>
                </th>
                {Object.values(roles).map((value, index) => (
                  <td key={index}>
                    <code>{value === "full" ? "full" : `${value}px`}</code>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Numeric primitive values remain fixed across theme presets, appearances
        and density. The full primitive is a large CSS radius sentinel; browsers
        clamp it to the element’s dimensions. The full Theme preset only rounds
        controls fully. Panels cap at 16px and overlays at 24px to avoid
        elliptical text containers. None makes every role square, including
        Dialog.
      </p>
      <h3>Nested corners share a center</h3>
      <div className="concentric-demo">
        <div className="concentric-outer">
          <div className="concentric-inner">
            <strong>24px outer</strong>
            <span>8px padding + 1px border → 15px inner</span>
          </div>
        </div>
      </div>
      <CodeBlock
        language="css"
        filename="nested-corners.css"
        code={
          ".outer {\n  border: var(--dixy-border-default);\n  border-radius: var(--dixy-radius-24);\n  padding: var(--dixy-space-100);\n}\n.inner {\n  border-radius: max(0px, calc(var(--dixy-radius-24) - var(--dixy-space-100) - var(--dixy-border-width-1)));\n}"
        }
      />
      <p>
        This derived 15px inner radius is a geometric relationship, not another
        primitive. Compare border-box edges: padding alone omits the outer
        border’s width. Clamp negative results to zero. Density can change
        padding, so recompute related inner corners from the actual inset rather
        than freezing an optical correction.
      </p>
      <h2>Borders: quiet structure, explicit state</h2>
      <div className="surface-border-scale">
        {Object.entries(borderWidths).map(([token, px]) => (
          <div key={token}>
            <span
              style={{
                borderBlockStart: `var(--dixy-border-width-${token}) solid var(--dixy-color-border-default)`,
              }}
            />
            <code>border.width.{token}</code>
            <small>{px}px</small>
          </div>
        ))}
      </div>
      <div className="table-scroll">
        <table className="api-table">
          <thead>
            <tr>
              <th>Role</th>
              <th>Width</th>
              <th>Style</th>
              <th>Existing color role</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(borderRoles).map(([role, value]) => (
              <tr key={role}>
                <th scope="row">
                  <code>{role}</code>
                </th>
                <td>{value.width}px</td>
                <td>{value.style}</td>
                <td>
                  <code>{value.color}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        className="surface-dashed-example"
        style={{
          borderWidth: borderWidth("1"),
          borderStyle: "var(--dixy-border-style-dashed)",
          borderColor: "var(--dixy-color-border-default)",
        }}
      >
        Dashed: a deliberate placeholder boundary.
      </div>
      <p>
        Use 1px for ordinary edges and dividers, 2px for strong emphasis, and
        zero only when the surrounding context supplies a clear boundary. Solid
        is the default; dashed is available for deliberate placeholders. Danger
        communicates an actual error and needs accompanying text. The spinner’s
        1.5px stroke remains an optical exception, separate from container
        borders.
      </p>
      <p>
        Focus is an independent accessibility contract: a 2px outline with a 3px
        offset. Decorative border or shadow choices never remove it. Border and
        focus widths use CSS pixels, preserving crisp edges when text size
        changes. A border alone does not establish sufficient contrast; keep the
        semantic color and interaction context aligned.
      </p>
      <h2>Shadows: a small depth vocabulary</h2>
      <Theme appearance={appearance} className="surface-shadow-scale">
        {Object.keys(shadowLayers).map((role) => (
          <div key={role} style={{ boxShadow: shadow(role as ShadowRole) }}>
            <strong>{role}</strong>
            <span>
              {
                {
                  none: "Flat content",
                  inset: "Recessed region",
                  raised: "Resting card",
                  floating: "Small floating panel",
                  overlay: "Modal layer",
                }[role]
              }
            </span>
          </div>
        ))}
      </Theme>
      <CodeBlock
        language="css"
        filename={`${appearance}-shadow.css`}
        code={Object.keys(shadowLayers)
          .map(
            (role) =>
              `/* ${role} */\n--dixy-shadow-${role}: ${shadowValue(role as ShadowRole, appearance)};`,
          )
          .join("\n\n")}
      />
      <p>
        Shadow geometry is shared between light and dark appearances; dark mode
        increases the neutral occlusion opacity. Borders and surface colors
        still carry separation when shadows are difficult to see. Shadows do not
        establish DOM stacking order, modality, or keyboard behavior. Forced
        colors maps all shadow tokens to none; keep a visible border and focus
        outline. No radius, border, or shadow animation is added.
      </p>
      <h2>Framework-independent usage</h2>
      <CodeBlock
        language="css"
        filename="surface.css"
        code={
          '@import "@dixy-ui/tokens/color.css";\n@import "@dixy-ui/tokens/radius.css";\n@import "@dixy-ui/tokens/border.css";\n@import "@dixy-ui/tokens/shadow.css";\n\n.panel {\n  border: var(--dixy-border-default);\n  border-radius: var(--dixy-radius-card);\n  box-shadow: var(--dixy-shadow-raised);\n}'
        }
      />
      <CodeBlock
        filename="surface-tokens.ts"
        code={
          'import { radius, surfaceRadius, borderWidth, border, shadow } from "@dixy-ui/tokens";\n\nradius("12"); // var(--dixy-radius-12), fixed primitive\nsurfaceRadius("card"); // contextual Theme role\nborderWidth("1"); // 1 CSS px\nborder("default"); // width + style + semantic color\nshadow("floating"); // appearance-aware CSS reference'
        }
      />
      <h2>Component integration and migration</h2>
      <p>
        Button and TextField use control radius aliases; Dialog uses the overlay
        alias. Components consume generated border widths, and Dialog uses the
        overlay shadow. Existing --dixy-radius and --dixy-shadow overrides
        remain supported for controls and Dialog shadow, respectively. For panel
        geometry, override --dixy-card-radius or --dixy-dialog-radius
        explicitly. Put overrides on Theme’s style when they must cross a
        portal.
      </p>
      <p>
        The default Dialog corner is now 16px instead of the previous computed
        18px; Theme radius="none" now produces a square Dialog instead of
        leaving an 8px corner. Existing sm/md/lg control radii stay 4/10/16px.
        Appearance, focus, refs, events and Base UI composition retain their
        contracts. Live previews and scale tables are generated from local
        definitions; the reference systems inform our decisions rather than
        becoming dependencies.
      </p>
    </>
  );
}
