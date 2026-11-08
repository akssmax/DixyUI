# @dixy-ui/tokens

Framework-independent design tokens for [Dixy UI](https://github.com/akssmax/DixyUI): OKLCH colour palettes, typography, sizing, spacing and motion, as plain CSS custom properties and typed TypeScript helpers. No React, Base UI, Tailwind or browser runtime dependency.

[![npm](https://img.shields.io/npm/v/%40dixy-ui%2Ftokens/beta?label=npm&color=7c3aed)](https://www.npmjs.com/package/@dixy-ui/tokens) [![MIT](https://img.shields.io/badge/license-MIT-7c3aed)](https://github.com/akssmax/DixyUI/blob/main/LICENSE)

> **Public beta.** APIs may change between `0.x` releases. See the [changelog](./CHANGELOG.md) and the [known issues](https://github.com/akssmax/DixyUI#known-issues).

[Documentation](https://dixy-ui-docs.akshaysaini-design.workers.dev) · [Components](https://dixy-ui-docs.akshaysaini-design.workers.dev/docs/components/button) · [Themes](https://dixy-ui-docs.akshaysaini-design.workers.dev/#themes) · [GitHub](https://github.com/akssmax/DixyUI)

## Install

```sh
pnpm add @dixy-ui/tokens@beta
```

`@dixy-ui/react` already includes these tokens. Install this package on its own to use Dixy's tokens without the components. Optional Tailwind v4 bindings are included.

## Spacing

```css
@import "@dixy-ui/tokens/spacing.css";
.settings {
  padding-inline: var(--dixy-spacing-inset-md);
  gap: var(--dixy-spacing-stack-sm);
}
```

```ts
import { space, spacing, type SpaceToken, type Density } from "@dixy-ui/tokens";
space("200"); // var(--dixy-space-200)
spacing("stack", "md"); // var(--dixy-spacing-stack-md)
```

The canonical source is `src/spacing.ts`. `pnpm tokens:generate` emits CSS; `pnpm tokens:check` rejects drift. The package build emits JavaScript, declarations, and spacing.css. Values use rem with a 16px reference, without setting the consumer's root font size.

`space.100` means 8px. All 16 primitives remain fixed across themes and density. `spacing.inline`, `spacing.stack`, `spacing.section`, and `spacing.inset` express relationships. Use nested `data-dixy-density="compact|default|comfortable"` scopes; stack and inset mappings change explicitly while inline and section remain fixed. Override semantic properties on the density root. The React package owns and rebinds its component aliases at each density boundary. In React, use Theme's density prop to propagate density through Dialog portals.

Spacing is separate from control sizing, hit targets, typography and focus indicators. No negative tokens or global scale multiplier are provided. Use logical properties and wrapping layouts. See `/docs/foundations/spacing` for the complete interactive scale, migration, density comparisons, and optional Tailwind v4 mapping example.

## Typography

```css
@import "@dixy-ui/tokens/typography.css";
.article {
  font: var(--dixy-font-body-md);
  letter-spacing: var(--dixy-font-body-md-letter-spacing);
}
```

```ts
import { font, typography, type TypographyRole } from "@dixy-ui/tokens";
font("body.md"); // var(--dixy-font-body-md)
```

`src/typography.ts` owns primitive families, sizes, leading and weights, plus 18 semantic roles. Source names use `font.role.size`; CSS names use `--dixy-font-role-size`. Each semantic style has family, size, line-height, weight and letter-spacing properties plus a coordinated font shorthand. Tracking is separate because CSS font shorthand excludes it. `scripts/generate-typography.mjs` emits the token stylesheet and React role selectors. Both generators participate in `pnpm tokens:generate` and `pnpm tokens:check`.

Sizes/leading use rem, tracking uses em, and no root font size is imposed. `body.md` is 16/24 at the default root; `body.sm` is 14/20; caption is 12/16. Default UI typography uses Inter Variable; display uses Space Grotesk Variable; code uses JetBrains Mono. This package does not fetch or embed fonts. The docs self-host Latin variable Inter normal/italic with weight and optical-size axes, variable Space Grotesk with a weight axis, and static JetBrains Mono 400. Other scripts use fallback fonts until dedicated subsets are supplied.

Family defaults are declared at the document root. Semantic aliases rebind at each `.dixy-theme` boundary so inline family/primitive overrides resolve locally and can follow React Theme context into portals. Plain HTML consumers can set typography overrides on their root. Use a semantic role for each context; density must not shrink text. See `/docs/foundations/typography` for the comparison of Primer, Radix, Apple, Material 3 and Atlassian, all 18 specimens and the variable-font controls.

## Sizing and layout

`src/sizing.ts` defines control heights (32/40/48px), icon sizes (12/16/20/24/32/48px), and interaction targets (minimum 24px, comfortable 44px). Control and icon values use rem; target values use `max(px, rem)` so smaller root fonts cannot reduce the CSS-pixel floor. None depend on density.

`src/layout.ts` defines container widths (640/768/1024/1280px), viewport breakpoints (640/768/1024/1280/1536px), and responsive gutters referencing the spacing scale (16px base, 24px at sm, 32px at lg). Container maximums include inline padding. Breakpoints use the browser's initial font size through rem media conditions; ordinary rem lengths use the document root.

```css
@import "@dixy-ui/tokens/spacing.css";
@import "@dixy-ui/tokens/sizing.css";
@import "@dixy-ui/tokens/layout.css";

.page {
  box-sizing: border-box;
  inline-size: 100%;
  max-inline-size: var(--dixy-container-xl);
  margin-inline: auto;
  padding-inline: var(--dixy-layout-gutter);
}
```

```ts
import { size, container, minWidth, layoutGutter } from "@dixy-ui/tokens";
size("control", "md"); // var(--dixy-size-control-md)
size("icon", "sm");
container("lg");
minWidth("lg"); // (min-width: 64rem), usable in matchMedia
layoutGutter; // var(--dixy-layout-gutter)
```

CSS custom properties cannot be used in media query conditions. `scripts/generate-sizing-layout.mjs` generates literal conditions from the shared breakpoint contract; do not maintain a second list. See `/docs/foundations/sizing-layout` for the interactive example, accessibility references and Container API.

## Radius, borders and shadows

`src/surfaces.ts` defines fixed radius primitives (0, 2, 4, 6, 8, 10, 12, 16, 24px and full), contextual radius presets, CSS-pixel border widths (0/1/2px), existing semantic border-color references, and five shadow roles: none, inset, raised, floating and overlay. Numeric radii use rem. Full uses a 9999px capsule sentinel that CSS clamps to the box; border/shadow geometry uses CSS pixels.

Default semantic radii are control 10px, card 12px and overlay 16px. Theme presets none/sm/md/lg/full remap the semantic roles without modifying primitives. Full caps cards at 16px and overlays at 24px; none makes every role square. Light/dark shadows share geometry and use appearance-specific opacity. Density does not modify any of these contracts.

```css
@import "@dixy-ui/tokens/color.css";
@import "@dixy-ui/tokens/radius.css";
@import "@dixy-ui/tokens/border.css";
@import "@dixy-ui/tokens/shadow.css";

.panel {
  border: var(--dixy-border-default);
  border-radius: var(--dixy-radius-card);
  box-shadow: var(--dixy-shadow-raised);
}
```

```ts
import {
  radius,
  surfaceRadius,
  border,
  borderWidth,
  shadow,
} from "@dixy-ui/tokens";
radius("12"); // fixed primitive
surfaceRadius("card"); // contextual role
border("strong"); // width, style and semantic color
borderWidth("1");
shadow("floating"); // appearance-aware CSS reference
```

Use `data-radius` and `data-appearance` scopes in plain HTML; use Theme in React to carry the settings through portals. Semantic aliases are rebound at scope boundaries. Put custom primitive overrides on a relevant scope as well so dependent aliases recompute there. Shadows do not establish z-index or replace borders/focus. Forced-colors rules remove shadow tokens; focus remains a separate 2px outline with a 3px offset.

Set `--dixy-stroke-width` on a Theme scope to tune the shared stroke (1px by default). Subtle/default/danger border shorthands and component width aliases follow it; strong borders and keyboard focus remain fixed at 2px. Width does not change contrast: subtle is decorative, while default identifies controls. Radius scopes only rebind geometry, so a component's rounding does not reset inherited elevation or explicit width aliases. Cards use the raised surface and their independent shadow alias, including when optional materials are loaded.

The live `/docs/foundations/surfaces` page records the Radix Themes, Material 3 and Apple references, Dixy's middle-ground decisions, complete scales, nested-corner math, migration notes and a real Dialog example. `scripts/generate-surfaces.mjs` owns the emitted styles and component aliases; `pnpm tokens:check` rejects drift.

## Icon integration

Icon dimensions reuse `size.icon.xs|sm|md|lg|xl|2xl` from sizing (12/16/20/24/32/48px). Foregrounds reuse `color.icon.primary|secondary|disabled|success|danger|warning|information|discovery` from color. These were existing token families; no duplicate `icon.size.*` or `icon.color.*` namespace was introduced. The only scale addition is 2xl at 3rem.

The React Icon component consumes these contracts. Its role selectors are generated by `scripts/generate-icons.mjs` from sizing and semanticColors, so a color or size change cannot silently drift away from the component. The standalone tokens package still has no React or icon-pack dependency. Control dimensions, interaction targets, density and icon artwork are separate contracts.

## Color

Dixy uses 12 stops in every family, numbered 1–12, with independently designed light/dark OKLCH ramps. The palette covers all families shown in the current Tailwind and Radix catalogs: 11 neutrals and 28 chromatic families. These are Dixy ramps, not copies of either library’s values. Black and white overlays provide an additional 12 alpha stops each (5–95%).

The neutral bases are `neutral`, `slate`, `gray`, `zinc`, `stone`, `taupe`, `mauve`, `mist`, `olive`, `sage`, and `sand`. Base neutrals and brand accents are independent.

```ts
import {
  color,
  overlayColor,
  semanticColor,
  createColorPalette,
  colorThemeVariables,
} from "@dixy-ui/tokens";
color("cyan", 9); // var(--dixy-color-cyan-9)
overlayColor("white", 8); // var(--dixy-color-white-a8)
semanticColor("background.action.primary");
const palette = createColorPalette([0.54, 0.18, 260]);
const overrides = colorThemeVariables(palette, "dark");
```

Import `@dixy-ui/tokens/color.css` for plain CSS. Set `data-appearance`, `data-accent`, and `data-neutral` together at each plain-CSS theme boundary. The React Theme supplies these attributes and reapplies them inside portals.

Primitive → semantic → component is the contract. Semantic roles cover canvas, raised/sunken surfaces, readable text, icons, borders/focus, selection/disabled states, primary/secondary/destructive/success actions, and success/danger/warning/information/discovery feedback. Action foregrounds cover all solid, hover and pressed states. Feedback roles remain independent of brand accents. Overlay roles include `background.overlay`, `.subtle`, `.strong`, and `.inverse`.

Earlier `--dixy-accent`, surface and text names remain read aliases. Override canonical semantic variables at the Theme boundary for new customization. Use decorative borders for separators; interactive boundaries use `border.default`. Disabled text is only for unavailable controls. `resolveColor` resolves opaque roles; alpha overlay contrast requires a known underlying surface.

The default pairs are tested at 4.5:1 for normal text and 3:1 for focus/interactive boundaries across all neutral bases and accents. These checks do not establish full accessibility conformance. The custom seed generator reduces chroma at fixed hue/lightness to fit sRGB, preserves achromatic seeds, and rejects palettes without a safe common action foreground.

### Optional Tailwind v4

```css
@import "tailwindcss";
@import "@dixy-ui/tokens/tailwind.css";
```

`bg-dixy-action-primary`, `text-dixy-on-action-primary`, `hover:bg-dixy-action-primary-hover`, and `active:bg-dixy-action-primary-pressed` map to semantic roles with `@theme inline`. Primitive utilities such as `bg-dixy-cyan-9` and `bg-dixy-white-a8` are available for palette exploration and decorative uses. The default entry and React package require no Tailwind compiler; the CLI is only a workspace validation dependency.

Color CSS, component aliases, and Tailwind bindings are generated by `scripts/generate-color.mjs` from `src/color.ts` and the React component-color contract. Run `pnpm tokens:generate` after changing those sources.

References: [Tailwind color families](https://tailwindcss.com/docs/colors), [Radix palette scales](https://www.radix-ui.com/colors/docs/palette-composition/scales), [Atlassian color roles](https://atlassian.design/foundations/color/), and [CSS Color 4](https://www.w3.org/TR/css-color-4/).

## Motion

Import `@dixy-ui/tokens/motion.css` for framework-independent timings and CSS recipes. `motionDurations` stores milliseconds; `tweenTransition(role, reducedMotion)` converts to Motion-compatible seconds, and `springTransition(scheme, kind, speed, reducedMotion)` converts damping ratio to a damping coefficient using `2 * ratio * sqrt(stiffness * mass)`. Neither helper imports Motion or React.

Use `motionDuration`, `motionEasing` and `motionTransition` for CSS references. Spatial springs have fast/default/slow speeds in standard and expressive schemes. Standard and all effects springs are critically damped; expressive spatial springs use ratio 0.8. Physical springs have variable settling time, not a promised duration.

CSS respects `prefers-reduced-motion` and `[data-motion="reduced"]`; effective durations become zero. JavaScript consumers must pass their effective preference to the transition helpers. Ordinary timing recipes stay below 300ms; the `page` recipe is an explicit 400ms exception for occasional context changes. Reduced motion always takes priority.

## Materials shape and personality

`materialRecipes`, `shapePresets`, `shapePaths`, `personalityPresets`, and `feedbackEvents` are framework-independent contracts. `materialImage("paper")` returns a CSS image reference; `shapeRadius("container")` returns a semantic radius reference. Import `@dixy-ui/tokens/materials.css` for image/edge variables and `@dixy-ui/tokens/shapes.css` for semantic geometry. The React package separately owns optional material application recipes, supported components, and feedback adapters.

The generator `scripts/generate-materials.mjs` participates in generation, freshness checking, and package builds. Static recipes use at most two gradient layers and the existing semantic shadow roles. No image assets, procedural SVG filters or backdrop sampling are included in the static pack. The hard budget is 5 KiB gzip for the initial React material CSS. The separate experimental backdrop recipe is not part of that pack. Budgets do not establish device energy behavior.

Personalities compose shared radius, shape, material and spring contracts without recoloring status roles. Decorative silhouettes are independent artwork; semantic control shapes remain rectangular interaction areas. The short `feedbackEvents` vibration patterns are optional web fallbacks, not native haptic specifications.
