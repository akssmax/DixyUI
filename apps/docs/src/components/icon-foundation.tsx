import { useState, type ComponentProps } from "react";
import { Heart, Search, ArrowRight, Check, CircleCheck } from "lucide-react";
import { HeartIcon } from "@phosphor-icons/react/dist/ssr/Heart";
import {
  Button,
  Heading,
  Icon,
  IconButton,
  Text,
  type IconColor,
} from "@dixy-ui/react";
import { sizing, semanticColors, type IconSize } from "@dixy-ui/tokens";
import { Link } from "@tanstack/react-router";
import { CodeBlock } from "./code-block";

function CustomDiamond(props: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      {...props}
    >
      <path d="M16 3 29 16 16 29 3 16Z" />
      <path d="m10 16 4 4 8-8" />
    </svg>
  );
}

const iconRoles = Object.keys(semanticColors).filter((role) =>
  role.startsWith("icon."),
);
const weights = [
  "thin",
  "light",
  "regular",
  "bold",
  "fill",
  "duotone",
] as const;

export function IconFoundation() {
  const [saved, setSaved] = useState(false);
  const [favorite, setFavorite] = useState(false);
  return (
    <>
      <div className="icon-intro">
        <div className="icon-intro-art" aria-hidden="true">
          <Icon render={<Heart />} size="2xl" color="discovery" />
          <Icon
            render={<HeartIcon weight="duotone" />}
            size="2xl"
            color="discovery"
          />
          <Icon render={<CustomDiamond />} size="2xl" color="discovery" />
        </div>
        <Heading as="h2" variant="title.lg">
          Your icons. A shared foundation.
        </Heading>
        <Text tone="muted">
          Lucide for the baseline. Phosphor for another personality. Your own
          SVGs whenever the product needs them.
        </Text>
        <Link
          className="inline-link"
          to="/docs/components/$component"
          params={{ component: "icon" }}
        >
          Open the Icon playground <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>

      <h2>Reuse the tokens we already have</h2>
      <p>
        Icon sizing lives in the sizing foundation, and icon foregrounds live in
        the color foundation. We keep those names: size.icon.sm and
        color.icon.secondary. The new 2xl step extends the existing size scale
        to 48px; it does not create a second icon-size namespace.
      </p>
      <div className="icon-size-grid">
        {Object.entries(sizing.icon).map(([token, px]) => (
          <div className="icon-size-cell" key={token}>
            <div>
              <Icon
                render={<Heart />}
                size={token as IconSize}
                color="primary"
              />
            </div>
            <code>{token}</code>
            <span>
              {px}px / {px / 16}rem
            </span>
          </div>
        ))}
      </div>
      <CodeBlock
        language="css"
        filename="icon-tokens.css"
        code={
          "/* Existing canonical token names */\n--dixy-size-icon-sm: 1rem;\n--dixy-size-icon-md: 1.25rem;\n--dixy-size-icon-2xl: 3rem;\n\n/* Foregrounds follow appearance and the semantic color system. */\ncolor: var(--dixy-color-icon-secondary);"
        }
      />
      <div className="icon-color-grid">
        {iconRoles.map((role) => (
          <div key={role}>
            <Icon
              render={<CircleCheck />}
              size="lg"
              color={role.slice(5) as IconColor}
            />
            <code>color.{role}</code>
          </div>
        ))}
      </div>
      <p>
        Standalone icons default to 20px and inherit currentColor. Set
        color="primary" or another explicit role for a standalone foreground.
        Inside a Button, inheritance preserves the control’s contrasting
        foreground; the default icon size follows its control size. An explicit
        Icon size always wins. The disabled color role is visual; disabling an
        action belongs to its Button.
      </p>

      <h2>Composition keeps each pack honest</h2>
      <p>
        The render element receives common SVG props, merged
        classes/styles/events, and SVG refs. Pack-specific settings stay on the
        actual pack component. Dixy keeps the original viewBox and never imposes
        a global stroke width or fill.
      </p>
      <CodeBlock
        code={
          'import { Icon } from "@dixy-ui/react";\nimport { Search } from "lucide-react";\nimport { HeartIcon } from "@phosphor-icons/react/dist/ssr/Heart";\n\n<Icon render={<Search />} size="sm" color="secondary" />\n<Icon render={<HeartIcon weight="duotone" />} size="lg" color="danger" />'
        }
      />
      <p>
        Use a component that renders one SVG root and forwards className, style,
        SVG attributes and ref. A local adapter can translate those common props
        for a pack with a different API. Use currentColor artwork for semantic
        colors; hard-coded fills or an explicit pack color intentionally keep
        their own color. A component returning a span, image or font glyph needs
        a separate adapter; this SVG contract does not cover it automatically.
      </p>
      <div className="icon-weight-grid">
        {weights.map((weight) => (
          <div key={weight}>
            <Icon
              render={<HeartIcon weight={weight} />}
              size="xl"
              color="discovery"
            />
            <span>{weight}</span>
          </div>
        ))}
      </div>
      <p>
        These are Phosphor’s six actual artwork variants. They are not
        fabricated with stroke-width overrides. Small thin icons can be
        difficult to perceive; choose regular or heavier for functional
        controls.
      </p>

      <h2>Give the action the accessible name</h2>
      <div className="icon-action-examples">
        <Button onClick={() => setSaved(true)}>
          <Icon render={<Check />} />
          {saved ? "Changes saved" : "Save changes"}
        </Button>
        <IconButton
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={favorite}
          variant="soft"
          onClick={() => setFavorite(!favorite)}
        >
          <Icon render={<HeartIcon weight={favorite ? "fill" : "regular"} />} />
        </IconButton>
        <Button variant="outline">
          <Search aria-hidden="true" />
          Search projects
        </Button>
        <span className="icon-status">
          <Icon render={<CircleCheck />} color="success" />
          <span>Ready to publish</span>
        </span>
      </div>
      <CodeBlock
        code={
          '<Button>\n  <Icon render={<Search />} />\n  Search projects\n</Button>\n\n<IconButton aria-label="Add to favorites">\n  <Icon render={<HeartIcon />} />\n</IconButton>\n\n{/* Meaningful standalone image; otherwise omit label. */}\n<Icon render={<Check />} label="Changes saved" color="success" />'
        }
      />
      <p>
        Icon defaults to aria-hidden and has no keyboard stop. A nonempty label
        exposes a role="img" with that accessible name. The wrapper normalizes
        these attributes after composition so a pack’s defaults cannot hide a
        named image or duplicate decorative announcements. Keep label off icons
        that accompany visible text. An icon’s 16px artwork and its button’s
        interaction target are different sizes.
      </p>

      <h2>A default pack without a mandatory dependency</h2>
      <div className="table-scroll">
        <table className="api-table">
          <thead>
            <tr>
              <th>Integration</th>
              <th>Current evidence</th>
              <th>Install ownership</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">
                <a href="https://lucide.dev/guide/react/">Lucide ↗</a>
              </th>
              <td>
                Docs baseline; inline SVG composition exercised in the
                playground.
              </td>
              <td>App dependency, static imports.</td>
            </tr>
            <tr>
              <th scope="row">
                <a href="https://github.com/phosphor-icons/react">Phosphor ↗</a>
              </th>
              <td>
                SSR entry, six weights and interactive rendering exercised here.
              </td>
              <td>App dependency; individual SSR imports.</td>
            </tr>
            <tr>
              <th scope="row">Custom SVG</th>
              <td>
                ViewBox, refs, events, naming and fill/stroke preservation
                covered by tests.
              </td>
              <td>Your own component.</td>
            </tr>
            <tr>
              <th scope="row">
                <a href="https://iconify.design/docs/icon-components/react/">
                  Iconify ↗
                </a>
              </th>
              <td>
                Optional integration guidance; the catalog explorer and adapter
                are future work.
              </td>
              <td>App chooses a renderer and icon data; core imports none.</td>
            </tr>
            <tr>
              <th scope="row">Heroicons, Tabler, Hugeicons</th>
              <td>
                Potential adapters through the SVG contract; not yet tested or
                claimed as official integrations.
              </td>
              <td>Install and verify each selected package.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Lucide and Phosphor are installed in the documentation app, not the Dixy
        package. Use direct icon imports so bundlers can remove unused artwork.
        The core has no global name registry, icon catalog or icon API request.
        Iconify name-based rendering can load data at runtime; its docs
        recommend supplied icon data when immediate server rendering is
        required. Treat a future explorer separately from essential application
        icons.
      </p>
      <p>
        <a href="https://primer.style/octicons/usage-guidelines/">
          Primer’s icon guidance
        </a>{" "}
        reinforces consistent sizes, recognizable meaning, functional
        foregrounds and text alongside icons. An arbitrary pack may have
        specially drawn optical sizes; choose those variants deliberately rather
        than stretching every glyph to every size. Check the selected pack’s
        license before distribution.
      </p>
    </>
  );
}
