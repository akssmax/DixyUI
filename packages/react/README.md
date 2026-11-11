# @dixy-ui/react

Expressive, accessible React components built on [Base UI](https://base-ui.com), with semantic design tokens and a `Theme` provider. Part of [Dixy UI](https://github.com/akssmax/DixyUI).

[![npm](https://img.shields.io/npm/v/%40dixy-ui%2Freact/beta?label=npm&color=7c3aed)](https://www.npmjs.com/package/@dixy-ui/react) [![MIT](https://img.shields.io/badge/license-MIT-7c3aed)](https://github.com/akssmax/DixyUI/blob/main/LICENSE)

> **Public beta.** APIs may change between `0.x` releases. See the [changelog](./CHANGELOG.md) and the [known issues](https://github.com/akssmax/DixyUI#known-issues).

[Documentation](https://dixy-ui-docs.akshaysaini-design.workers.dev) · [Components](https://dixy-ui-docs.akshaysaini-design.workers.dev/docs/components/button) · [Themes](https://dixy-ui-docs.akshaysaini-design.workers.dev/#themes) · [GitHub](https://github.com/akssmax/DixyUI)

## Install

```sh
pnpm add @dixy-ui/react@beta
```

`react` and `react-dom` 19 are peer dependencies. `motion` 14 is optional and only needed for `@dixy-ui/react/motion`.

## Usage

```tsx
import "@dixy-ui/react/styles.css";
import { Theme, Button } from "@dixy-ui/react";

export function App() {
  return (
    <Theme appearance="light" accentColor="violet">
      <Button>Make a start</Button>
    </Theme>
  );
}
```

Import the stylesheet once. React 19 is the initial peer target. The package includes ESM, declarations, CSS tokens and component styles. Consumers do not need Tailwind or a CSS-in-JS runtime.

Use Theme's appearance, accentColor and radius settings, or provide CSS custom properties through its style prop. Nested themes inherit unspecified settings; Dialog portals mirror these settings and inline token overrides. Class- or ancestor-selector overrides outside that contract are not automatically copied across DOM portals.

Buttons preserve Base UI's render/ref/event contracts. To render navigation as an anchor, explicitly use `nativeButton={false}` and `role="link"` alongside `render={<a href="..." />}`. IconButton requires `aria-label`.

Field.Label, TextField, Field.Description and Field.Error share Base UI field context. Dialog exposes compound parts, including its portal, backdrop, viewport, popup, title, description and close action.

The accessibility target is WCAG 2.2 AA; automated axe checks run on every component, and manual screen-reader, forced-colours and zoom testing is still in progress. See the [documentation](https://dixy-ui-docs.akshaysaini-design.workers.dev) for every component's API, keyboard behaviour and examples.

## Reference

## Spacing and density

The stylesheet includes `@dixy-ui/tokens/spacing.css` and component aliases. Use
`<Theme density="compact">` (or `default`, `comfortable`) to vary semantic stack
and inset spacing. Primitive values, control heights and focus indicators remain
fixed. Nested Themes and Dialog portals preserve density.

`Stack` uses `spacing.stack.*` with a default `gap="md"`; `Inline` uses
`spacing.inline.*` with `gap="sm"`, `align="center"` and wrapping enabled. Both
support native attributes, typed refs, `as`, `className` and `style`.

The old `--dixy-space-1` through `-8` names are replaced by `-050`, `-100`,
`-150`, `-200`, `-300`, `-400`, `-600`, and `-800`, respectively. Prefer semantic
spacing in components. Default Button gap is now 4px, TextField inline padding
is 12px, and Dialog padding is 24px (at a 16px root). No compatibility aliases
are generated. See `/docs/foundations/spacing` for the scale and migration.

## Sizing and responsive layout

The public stylesheet includes the sizing and layout foundation. `Container` accepts `size="sm|md|lg|xl"` (default xl), centers itself within its parent, and uses responsive logical inline gutters. It accepts the same `as`, typed refs, native attributes, className and style composition as Stack/Inline.

Button and TextField retain 32/40/48px nominal heights. Icons are independent of their hit areas: IconButton is at least 44 × 44px; large icon buttons remain 48px. On coarse-pointer devices, Button and TextField also use at least 44px actual targets. Density never reduces these sizes. Set `--dixy-interaction-target: var(--dixy-size-target-comfortable)` on a Theme's style or a local scope to opt into larger targets elsewhere. Theme inline custom properties continue through Dialog portals.

Existing `--dixy-height-sm/md/lg` overrides are retained as aliases to the new sizing contract. Container uses generated breakpoint/gutter rules, not a responsive prop engine. See `/docs/foundations/sizing-layout` for a complete configurable example and exact token values.

## Surface geometry and depth

Theme radius now accepts `none`, `sm`, `md`, `lg` and `full`, derived from the public token contract. Button/TextField use the control role; Dialog uses the overlay role. Default control corners stay 10px, with cards at 12px and Dialog at 16px. Full makes controls capsule-shaped while keeping panels usable. None now makes Dialog square; previously its computed corner retained 8px. Default Dialog corners change from 18px to the explicit 16px step.

The stylesheet includes `@dixy-ui/tokens/radius.css`, `border.css` and `shadow.css`, plus locally owned component aliases. Borders preserve the existing semantic colors; focus uses its own 2px width and 3px offset. Dialog uses the overlay shadow, with appearance-specific opacity. Spacing density does not change corners, border widths or depth.

Existing `--dixy-radius` and `--dixy-shadow` overrides continue to customize controls and Dialog shadow. Use `--dixy-card-radius` or `--dixy-dialog-radius` for explicit panel geometry. Put custom properties in Theme's style when they must propagate through its portal contract. See `/docs/foundations/surfaces` for the research, complete token scale and live examples.

## SVG icons

```tsx
import { Icon, IconButton } from "@dixy-ui/react";
import { Search } from "lucide-react";

<Icon render={<Search />} size="sm" color="secondary" />
<IconButton aria-label="Search projects">
  <Icon render={<Search />} />
</IconButton>
```

Dixy bundles no icon pack and performs no icon API fetch. Install the application's chosen pack separately. Lucide is the documentation baseline; Phosphor's individual SSR components are the first tested alternative. Generic SVG composition does not establish tested compatibility with every icon package.

`render` is required and must produce one SVG root, forwarding SVG props, className, style and ref. Put pack-only settings on the element, for example `render={<HeartIcon weight="duotone" />}`. Base UI's render utility merges both refs, events, classes and styles. Dixy preserves viewBox, fill and stroke; currentColor artwork follows semantic colors. Explicit pack colors or hard-coded fills retain their color.

Standalone icons default to md (20px); six named sizes run from xs to 2xl (12–48px). Within Button/IconButton, an unspecified Icon size follows the control's 16/20px icon contract; explicit sizes take precedence. `color` defaults to inherit, preserving button contrast. Explicit primary/secondary/disabled/success/danger/warning/information/discovery values use existing semantic icon colors. A disabled color never disables an action.

Decoration is hidden from assistive technology and has no keyboard stop. Supply a nonempty `label` for a meaningful standalone image. Name an icon-only action on IconButton, leaving its Icon decorative. Native SVG props are forwarded except dimensions and accessibility attributes managed by these contracts. CSS style overrides remain available when deliberately needed. Icons add no motion; animated packs remain the consumer's responsibility.

## Optional Motion integration

The regular entry and stylesheet work without Motion installed. To animate custom React content, install the tested `motion@14.2.0` peer and import the adapter from `@dixy-ui/react/motion`:

```tsx
import { Theme, useMotionPreferences } from "@dixy-ui/react";
import { MotionProvider } from "@dixy-ui/react/motion";
import { springTransition } from "@dixy-ui/tokens";

<Theme motion="system">
  <MotionProvider>{/* Motion components */}</MotionProvider>
</Theme>;

// Inside a component in this scope:
const { reducedMotion } = useMotionPreferences();
const transition = springTransition(
  "standard",
  "spatial",
  "default",
  reducedMotion,
);
```

Place the adapter inside each Theme whose preference it should follow. `motion="reduced"` requests additional reduction; nested themes and Dialog portals inherit it. A child cannot override a reduced ancestor or the OS preference. The hook subscribes to live OS changes and returns reduction during SSR until the client preference is known.

MotionConfig suppresses transform/layout animations, so custom opacity, color, sequencing delays, imperative animations and loops must also use the effective preference. Dixy helpers return immediate transitions when reduced. Keep Base UI's presence/focus lifecycle for Dialog; its CSS uses shared entrance/exit recipes. Do not add a second exit lifecycle without deliberately integrating the primitive's unmount contract.

Legacy duration/ease aliases still resolve; component rules now consume the explicit `--dixy-motion-transition-*` recipes. Override the motion namespace for new timing customizations. Reduced-motion rendering intentionally removes geometry changes and spinner animation.

## Optional charts

`@dixy-ui/react/charts` dresses [Recharts](https://recharts.org) in Dixy, following the shadcn/ui approach: you compose Recharts primitives, and Dixy adds a series config, themed colors, tooltip, legend, loading/empty states and an accessible data table. Install the optional peer `recharts` (3.10+) and load `charts.css` after the core styles:

```tsx
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis } from "recharts";
import { Chart, seriesColor, type ChartConfig } from "@dixy-ui/react/charts";
import "@dixy-ui/react/charts.css";

const config = {
  desktop: { label: "Desktop" }, // --dixy-color-chart-1 (the accent)
  mobile: { label: "Mobile" }, // --dixy-color-chart-2
} satisfies ChartConfig;

<Chart.Root
  config={config}
  label="Visitors by device"
  table={<Chart.DataTable data={data} labelKey="month" />}
>
  <BarChart data={data} accessibilityLayer>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="month" />
    <Tooltip content={<Chart.TooltipContent />} />
    <Legend content={<Chart.LegendContent />} />
    <Bar dataKey="desktop" fill={seriesColor("desktop")} />
    <Bar dataKey="mobile" fill={seriesColor("mobile")} />
  </BarChart>
</Chart.Root>;
```

Series take `--dixy-color-chart-1` … `6` in config order unless `color` sets a palette index, any CSS color or `{ light, dark }`. Series 1 is the theme accent; series 2–6 are picked per accent so none repeats its hue. Every series is at least 3:1 against canvas and surfaces. Root names the Recharts svg from its caption.

Tables are optional. Give every chart a one-sentence `description` with the takeaway; that is the text alternative for a simple chart. Add `table={<Chart.DataTable … />}` only when readers need the values: the default `tableDisplay="disclosure"` puts it behind "View chart data" (reports, public content), and `tableDisplay="toggle"` adds a Chart | Table switch to the header (analytical views; `view`, `defaultView` and `onViewChange` control it). The core `Chart` (a dependency-free bar recipe) is unchanged.

## Base UI coverage

Dixy styles all 37 documented component families in `@base-ui/react@1.9.0`. Import compound families such as `Checkbox`, `Switch`, `Tabs`, `Tooltip`, `Select`, `Combobox`, `Menu`, `Drawer` and `Toast` from `@dixy-ui/react`. Use their Base UI part names (`Root`, `Trigger`, `Popup`, and so on). All public parts and helpers are retained. Input is exposed as `TextField`; `Field.Control` is also available with the input recipe.

```tsx
import { Checkbox, Theme } from "@dixy-ui/react";
import "@dixy-ui/react/styles.css";

<Theme appearance="dark" accentColor="purple" dir="rtl">
  <label>
    <Checkbox.Root name="updates" defaultChecked>
      <Checkbox.Indicator />
    </Checkbox.Root>
    Product updates
  </label>
</Theme>;
```

Dixy adds shared semantic styling while forwarding the primitive's props, generic types, refs, state callbacks and render composition. Overlay portals restore the nearest Dixy theme. Theme coordinates explicit `dir="ltr"`/`dir="rtl"` with Base UI; applications can also use the exported DirectionProvider. CSPProvider, mergeProps and useRender are exported for integrations. Supply CSPProvider's nonce from your server's actual CSP setup; exporting a provider alone does not configure a response policy.

`Checkbox.Root` adds `size="sm" | "md" | "lg"`, `variant="solid" | "soft" | "outline"`, `color="accent" | "neutral" | "danger" | "success"`, and the same inherited `radius` and `material` options as Switch. Colors apply to selected states; unchecked boxes remain neutral. Import `materials.css` for static finishes. Use `Field.Description` and `Field.Error` for descriptions and validation, and `CheckboxGroup` with `allValues` plus a `parent` checkbox for select-all.

`Checkbox.Indicator` provides centered, decorative SVG check and mixed marks when children are omitted. Its `checkedIcon` and `indeterminateIcon` slots accept custom decorative artwork without replacing Base UI state or presence. Custom children (including explicit `null`) remain unchanged. Its `feedback` and `indicator` motion aliases use the shared 120ms feedback recipe; Base UI owns presence, and reduced motion makes changes immediate.

`Switch.Root` adds `size="sm" | "md" | "lg"`, `variant="solid" | "soft" | "outline"`, and `color="accent" | "neutral" | "danger" | "success"`. Accent follows `Theme.accentColor`. `radius="none" | "sm" | "md" | "lg" | "full"` and `material="matte" | "glossy" | "soft" | "metal" | "paper"` inherit Theme when omitted. Import `materials.css` for track finishes; effects reduction removes them. Sizes change visual proportions while preserving the shared minimum interaction target.

```tsx
<label>
  <Switch.Root
    name="notifications"
    size="lg"
    color="success"
    radius="full"
    material="glossy"
  >
    <Switch.Thumb
      checkedIcon={
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor">
          <path d="m3 8 3 3 7-7" />
        </svg>
      }
    />
  </Switch.Root>
  Notifications
</label>
```

Thumb `checkedIcon` and `uncheckedIcon` accept decorative SVG/icon elements; custom `children` (including null) take precedence. Keep a stable visible label or `aria-label`, and associate descriptions with `aria-describedby`. Root forwards controlled/uncontrolled state, `onCheckedChange`, refs/inputRef, form values, `readOnly`, `disabled` and render composition to Base UI. Track feedback, thumb travel and icon crossfade use the shared 120ms feedback recipe. Reduced motion makes transitions immediate and retains the final thumb position, including RTL.

`Tabs.Root` adds `size="sm" | "md" | "lg"`, `variant="line" | "solid" | "soft" | "outline"`, the four semantic colors, inherited radius/material, trigger alignment and `fullWidth` to expand horizontal triggers. Line is the default. Materials decorate the selected surface of filled variants; import `materials.css`. Inactive labels remain neutral. The static selected treatment also works when Indicator is omitted or has not hydrated.

```tsx
<Tabs.Root defaultValue="overview" variant="soft">
  <Tabs.List aria-label="Project sections" activateOnFocus={false}>
    <Tabs.Tab value="overview">Overview</Tabs.Tab>
    <Tabs.Tab value="activity">Activity</Tabs.Tab>
    <Tabs.Indicator />
  </Tabs.List>
  <Tabs.Panel value="overview">Project overview</Tabs.Panel>
  <Tabs.Panel value="activity">Recent activity</Tabs.Panel>
</Tabs.Root>
```

Root owns selection and orientation; List owns the accessible name, `activateOnFocus` and `loopFocus`. Each Tab value matches its Panel. In manual mode arrows move focus and Enter/Space selects. Use automatic activation only for panels that appear without noticeable latency. Base UI intentionally allows disabled tabs to receive arrow-key focus for discovery, while preventing activation. Indicator uses the shared 200ms enter recipe; reduced motion makes geometry immediate. Panels switch immediately. Use `keepMounted` when panel-local state needs to survive selection changes, and preserve Base UI's hidden-panel behavior. Do not nest buttons/links inside a Tab; place them in a panel. WCAG 2.2 AA validation evidence and remaining manual checks are tracked in the repository.

Use component aliases such as `--dixy-choice-size`, `--dixy-switch-thumb-size`, `--dixy-popup-radius` and `--dixy-slider-thumb-size` to customize geometry. Semantic color, font, spacing, focus and motion tokens follow Theme. Put custom properties on Theme when a popup should inherit them. Stable component support does not imply that every advanced composition has been manually audited on every browser; see the repository checklist for release validation gaps.

## Expressive foundations

```tsx
import { Box, Button, Shape, Theme } from "@dixy-ui/react";
import "@dixy-ui/react/styles.css";
import "@dixy-ui/react/materials.css";

<Theme personality="tactile" effects="static">
  <Box as="section" material="paper" style={{ padding: 24 }}>
    <Shape kind="arch" />
    <Button material="glossy" shape="pill">
      Create project
    </Button>
  </Box>
</Theme>;
```

The optional material pack supplies matte, glossy, soft, metal, and paper finishes using static CSS and no image downloads. Button and IconButton apply finishes to solid/soft emphasis; outline, ghost and disabled states retain their existing treatment. Control decoration is confined to 3px edge bands to preserve the label background. Box uses full surface texture; keep readable primary text and padding, and use quiet surfaces for dense content. The paper/metal patterns are CSS approximations.

Shape presets are `rounded`, `pill`, and `square`. Rounded follows contextual radius; pill panels retain 16px corners. The Shape SVG component supplies decorative `flower`, `clover`, `arch`, and `cut` silhouettes without clipping interactive content. Supply `label` only when the artwork has meaning. Box forwards native element semantics, refs, events and styles.

Theme personalities `restrained`, `playful`, and `tactile` coordinate finish, shape, contextual radius, finite press travel and the optional spring scheme. Explicit props override preset defaults. `useMotionPreferences().scheme` can be passed to the existing `springTransition` helper. Semantic accent/status colors remain independent. ThemeScope carries settings and custom properties into overlays without remounting them.

`effects="static"` is the default. `reduced` removes decorative images/shadows and suppresses optional feedback; ancestor reduction wins. Reduced transparency, increased contrast and forced colors remove material decoration in CSS. The separate `backdrop-pilot.css` entry exposes an experimental `.dixy-backdrop-pilot` toolbar recipe under `effects="backdrop"`, with an opaque fallback and opaque label backings. It is not liquid refraction or a validated low-power renderer; see the bounded comparison in the Materials foundation before using it.

Feedback is a separate optional JavaScript entry:

```tsx
import { Button } from "@dixy-ui/react";
import {
  FeedbackProvider,
  useFeedback,
  vibrationAdapter,
} from "@dixy-ui/react/feedback";

function SaveAction() {
  const feedback = useFeedback();
  return <Button onClick={() => feedback("success")}>Try feedback</Button>;
}

// Emit after a meaningful state change. Set enabled from explicit user preference.
<FeedbackProvider enabled={false} adapter={vibrationAdapter}>
  <SaveAction />
</FeedbackProvider>;
```

Selection, toggle, snap, success and warning are semantic events. Missing support, disabled ancestors, reduced motion/effects and adapter failures cannot interrupt the application action. Hosts may supply their own FeedbackAdapter. Browser vibration is best effort and does not emulate native Core Haptics. Neither the static material pack nor the feedback entry requires Motion.

### Expanded Base UI visual contracts

DOM-owning parts now use Dixy's shared shirt sizes, contextual radii and optional static materials where appropriate. Radio, Toggle, Avatar, Slider, Progress and Meter also support accent/neutral/danger/success emphasis. Unselected choice controls remain neutral. Accordion/Collapsible, Toolbar and Fieldset offer plain/outline/soft presentation; input and popup surfaces offer outline/soft. Form adds spacing and Field adds orientation without replacing validation.

Select/Combobox/Autocomplete Roots retain their generic contracts. Style the trigger/input and popup separately because each owns a DOM surface:

```tsx
<Select.Root defaultValue="personal">
  <Select.Trigger size="sm" variant="soft" radius="full" aria-label="Plan">
    <Select.Value />
    <Select.Icon />
  </Select.Trigger>
  <Select.Portal>
    <Select.Positioner sideOffset={8}>
      <Select.Popup size="sm" radius="lg" material="paper">
        <Select.List>
          <Select.Item value="personal">
            <Select.ItemText>Personal</Select.ItemText>
            <Select.ItemIndicator />
          </Select.Item>
        </Select.List>
      </Select.Popup>
    </Select.Positioner>
  </Select.Portal>
</Select.Root>
```

Import `@dixy-ui/react/materials.css` for the optional finish. Default artwork remains decorative; explicit children/null and primitive render callbacks are preserved. Menu/ContextMenu Item and LinkItem accept semantic destructive emphasis. Dialog/AlertDialog add lg widths; Drawer keeps swipe direction on Root. Compound anatomy and exact local props are documented from the public package. See `docs/COMPONENT_REFRESH.md` in the workspace for the full implementation scope and pending release-validation matrix.

## Common component additions

Dixy also provides ButtonGroup, AvatarGroup, Card, Alert, Badge, Chip, Kbd, Textarea, InputGroup, Link, Skeleton, Spinner, Empty, Breadcrumbs, Pagination, Command, ListBox, TagGroup, SearchField, Table, DataTable, Sidebar, Item, AspectRatio, Resizable, Carousel, Chart, ProgressCircle, ScrollShadow, Calendar, RangeCalendar, DateField, TimeField, DatePicker, DateRangePicker, NativeSelect and ColorPicker.

Base UI remains the preferred behavior layer. Unstyled React Aria supplies missing collection, date/time, color, search and link behavior; static/native components keep browser semantics. Dixy owns the visual CSS and composition. No shadcn or HeroUI components are imported. Fallbacks use leaf imports and unused-family checks in the isolated packed consumer.

Use React Aria parts together inside their owning root: DatePicker.Button and DatePicker.Popover participate in that root's slot context. The popup requires an accessible name. LocaleProvider selects a locale; date/time value constructors and parsing helpers are re-exported from Dixy. Match locale direction to the intended Theme direction. Native Textarea and NativeSelect require an explicit native label relationship.

DataTable exposes collection/sort callbacks; the application transforms its data. Resizable currently has two panes per root. Carousel uses manual native scrolling. Chart currently provides nonnegative SVG bars with a native data-table alternative. Full feature/visual/platform parity and WCAG conformance are separate release work; see the repository's docs/COMPONENT_ADDITIONS.md for scope and evidence.
