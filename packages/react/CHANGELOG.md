# @dixy-ui/react

## 0.1.0-beta.7

### Minor Changes

- 8be0cdf: New `bevel` material: hard 1px raised edges (light top-left, dark bottom-right) for classic desktop chrome. Pressed buttons, pressed toggles and open popup triggers invert the bevel; fields, lists, calendars, checkbox and radio boxes, number and OTP fields and slider/progress/meter tracks become sunken wells; slider thumbs become raised blocks. Recipes may now declare optional `pressedImage`, `pressedEdge` and `wellEdge`, emitted as `--dixy-material-<name>-pressed-image`, `-pressed-edge` and `-well-edge`. Theme documents accept `bevel` for `material` and `componentFinish`. Reduced effects, high contrast and forced colours remove it like the other finishes.
- f6c380e: Charts: add `Chart.Gradient` for theme-aware gradient fills. `Chart.LegendContent` `nameKey` now reads any row field (for radial bar legends). `charts.css` adds styles for label lists, inside labels, donut center text, leader lines and radial tracks. Tokens add `chart.track` for radial and gauge backgrounds.
- 8be0cdf: Add an expressive shape library and shape morphing.

  - Tokens: 35 shapes (`expressiveShapes`: circle, square, slanted, dome, semicircle, fan, oval, pill, triangle, arrow, diamond, clam-shell, pentagon, gem, sunny, very-sunny, cookie-4/6/7/9/12, clover-4/8, burst, soft-burst, boom, soft-boom, bloom, puffy, puffy-diamond, pixel-circle, pixel-triangle, bun, ghostish, heart). Each is a rounded polygon with true circular fillets, resampled to 120 evenly spaced points from the top centre, clockwise, so any two morph point-for-point. `shapeOutline()`, `shapeSvgPath()` and `shapePolygon()` return points, SVG path data and a CSS `polygon()`.
  - Tokens: `springEasing(scheme, kind, speed)` turns a Dixy spring into a CSS `linear()` easing and settle time for CSS-only transitions.
  - React: `Shape` accepts the new kinds (`ShapeKind`). Changing `kind` between two of them morphs the path on the Theme's spatial spring; reduced motion switches instantly. Browsers without CSS `d` switch without morphing. The four hand-drawn kinds are unchanged.

- 8be0cdf: Add `size="xl"` to list-like parts: `ListBox.Root`, `Select.Trigger`/`Select.Popup`, `Menu.Popup`/`Menu.Item`/`Menu.LinkItem` and `Combobox.Input`/`Combobox.InputGroup`/`Combobox.Popup`. It sets options and inputs in the fluid `display.xl` role (36–72px), with row height `size + 2 × space-150`. Tracking is declared on each descendant, so `em` resolves at each element's own size. A grouped Combobox input takes the display font from its group. Menu items without their own size still inherit the popup's. Buttons, fields and other controls stay sm/md/lg.
- 8be0cdf: Expressive controls and three expressive starter themes.

  - React: `morph` on Button, IconButton and Toggle. Corners are fully round at rest and square off while pressed (and while a Toggle is selected), on the Theme's fast spatial spring. Attached and segmented groups keep their joined corners. Reduced motion switches corners instantly.
  - React: `wave` on `Progress.Root`. The indicator becomes a travelling wave, with a gap before a tonal remaining track. It is still under reduced motion and keeps Base UI's progressbar semantics.
  - React: `Theme morph="press"` and `Theme progress="wave"` set those defaults for everything inside. Each component can still opt out. Theme also exposes `--dixy-motion-spring-press` and `--dixy-motion-spring-press-duration`.
  - Tokens: every font role has a `--dixy-font-<role>-stretch` part (default `normal`) inside its shorthand, so themes can set condensed or expanded headings.
  - Themes: schema v8 adds `character.details.morph`, `character.details.progress` and `character.type.axes` (none, condensed, wide, soft). v7 documents migrate to off, line and none, so they look unchanged.
  - Themes: the new `tonal-surface` material tints surfaces from the theme's own accent.
  - Themes: three new starters, Bloom (soft wonky Fraunces, violet), Pulse (condensed Bricolage, lime on dark) and Sorbet (wide Fredoka, tangerine). All three ship press morph and wavy progress.

  Expressive themes now use the expressive components, like the `/lab/expressive` mock:

  - Under `Theme progress="wave"`, Spinner and Button's loading indicator become a loader that morphs through library shapes as it turns. It holds one shape under reduced motion. ProgressCircle draws a wavy ring.
  - Under `Theme morph="press"`, attached and segmented ToggleGroups become connected button groups: 2px gaps, round ends, and the pressed choice grows and goes fully round.
  - New `Theme avatarShape` (and `character.details.avatar`) clips Avatars to a library shape.
  - New `"shapes"` backdrop pattern: a tile of library shapes as an inline SVG mask.
  - Bloom (cookie-9 avatars, shapes backdrop), Pulse (soft-burst avatars) and Sorbet (clover-4 avatars) turn these on.

  M3 Expressive rules and components:

  - Tokens: `control.xs` (28px) and `control.xl` (72px).
  - React: Button, IconButton and Toggle take `size="xs" | "xl"`. `Toggle shapes={[off, on]}` draws a shape-backed icon toggle that morphs when selected.
  - React: connected button groups change shape only. They span their container in equal segments; the selected segment no longer grows. Separate ToggleGroups and `ButtonGroup attached={false}` under `morph="press"` behave as M3 standard groups.
  - React: wave progress has a stop indicator, a dot at low values and an indeterminate wave. Spinner adds `contained` and `delay`; ProgressCircle adds `showValue`.
  - React: new `SplitButton` and `FabMenu` (both on Base UI Menu), and Toolbar `variant="floating" | "vibrant"`.
  - Themes: expressive themes keep titles on the body font (`titleFont()`, `themeFoundationStyle(..., { titles })`).

- 8be0cdf: Typography: add `display.xl`, `display.2xl` and `display.3xl` (72, 96 and 128px) for words that are the interface: selected values, cities, speeds. They're fluid. Each grows linearly from a phone-safe minimum (36, 44 and 52px) in a 320px container to its full size at 1280px, using container query units (`cqi`) with `clamp()`. With no size container, they follow the small viewport. Their line-height is unitless (`1`), so leading shrinks with the size. Size primitives 72, 96 and 128 are added. `display.lg` and smaller are unchanged. Skins pick up the new roles for heading weight and tracking.
- 8be0cdf: Add an option highlight and an accent surface.

  - `Theme highlight="tint" | "band"`: `band` marks highlighted and selected list options (Menu, Select, Combobox, Autocomplete, ListBox) with a full-ink band. The portal scope carries it, so popups follow. One token pair, `--dixy-highlight-band` / `--dixy-highlight-on-band`, is read before each item's own tint.
  - `Box surface="accent"`: paints the Box with the brand solid and remaps text, border, skin, material, button and highlight tokens so Dixy parts inside stay legible, in light and dark.
  - Themes: new `character.details.highlight` (schema version 7; v6 documents migrate to `tint`, which changes nothing). It compiles to the `highlight` Theme prop, not skin CSS. Swiss Poster, Brutalist Concrete, Tokyo Transit, Riso Zine, Freighter and Signal now use `band`.
  - Themes: Retro OS, Mainframe, Save Point, Arcade Cabinet and ANSI Panes default to the `bevel` material.
  - Themes: catalog `voice.display` adds large-type starter content (a word or numeral in a fluid display role) for 12 serif and numeral starters.

### Patch Changes

- 8be0cdf: Accessibility: `Dialog.Popup` now sets `aria-modal="true"` unless `Dialog.Root` has `modal={false}`, and `AlertDialog.Popup` always does. Base UI makes the page inert but omits the attribute. `Toolbar.Root` now handles Home and End (first or last focusable item), as the WAI-ARIA toolbar pattern describes; text inputs inside the toolbar keep their caret behavior.
- Updated dependencies [8be0cdf]
- Updated dependencies [f6c380e]
- Updated dependencies [8be0cdf]
- Updated dependencies [8be0cdf]
- Updated dependencies [8be0cdf]
  - @dixy-ui/tokens@0.1.0-beta.5

## 0.1.0-beta.6

### Minor Changes

- cb2cb59: New optional `@dixy-ui/react/charts` entry: Recharts, dressed in Dixy. `Chart.Root` maps a series config (labels, icons, colors) to `--dixy-series-<key>` variables and adds a caption, loading and empty states, and an optional data table shown behind a disclosure or through a Chart | Table toggle (`tableDisplay`); `Chart.TooltipContent`, `Chart.LegendContent` and `Chart.DataTable` read the same config. Import `@dixy-ui/react/charts.css` after the core styles and install the optional peer `recharts` (3.10+). Tokens add `chart.1`–`chart.6` series colors (series 1 follows the accent; 2–6 are rebound per accent so none repeats its hue) and `chartSeriesFamilies()`, with `chart.grid`, `chart.axis` and `chart.cursor`, each series at least 3:1 against canvas, surface and raised surfaces in every accent and neutral. The core entry and its existing `Chart` are unchanged.

### Patch Changes

- Updated dependencies [cb2cb59]
  - @dixy-ui/tokens@0.1.0-beta.4

## 0.1.0-beta.5

### Patch Changes

- 464c58a: Fixes from the first outside beta test:

  - Popups (Popover, Menu and other overlays using the absolute positioning strategy) no longer open a page height away from their trigger under a starter theme. Each starter positioned and isolated `.dixy-theme`, which also matched the zero-height `.dixy-portal-scope` wrapper at the end of `<body>`, making it the popups' containing block. The rule now skips the portal scope.
  - `Tabs.Panel` stretches to the full width of `Tabs.Root`, even when an app turns the root into a flex column.
  - The `@dixy-ui/themes` README now gives the correct starter count (38) and links to dixyui.com.

## 0.1.0-beta.4

### Patch Changes

- 43f6caa: Soft, metal and paper finishes are now clearly visible. Buttons show the whole finish instead of a 3px strip (glossy keeps its enamel bands). Soft clay has a pillowy top light and thick inset rim. Metal multiplies a cool steel band into the base colour under an irregular brushed grain and bevel rim. Paper multiplies a warm stock under hairline fibres. Each recipe gains a `blend` value, published as `--dixy-material-<name>-blend`. Metal and paper also have dark-mode variants (gunmetal and kraft) that lighten with `screen` instead of multiplying.
- Updated dependencies [43f6caa]
- Updated dependencies [7ca04a0]
  - @dixy-ui/tokens@0.1.0-beta.3

## 0.1.0-beta.3

### Minor Changes

- 6e03dbd: New optional `@dixy-ui/react/ai` entry with chat and agent interface parts: `Conversation`, `Message`, `Response` (streaming-safe markdown), `CodeBlock`, `PromptInput`, `Suggestions`, `Reasoning`, `Tool`, `Sources`, `Shimmer` and `Loader`. Import `@dixy-ui/react/ai.css` after the core styles. `Response` needs the optional peers `react-markdown` and `remark-gfm`; the core entry and stylesheet are unchanged.

### Patch Changes

- d87ef39: Ship one ES module per component instead of a single flat `dist/dixy.js`. The entry and public exports are unchanged; app bundlers can now split chunks per component, so a page loads only the components it renders.
- d0fea70: `PromptInput.Textarea` re-measures its height when its width changes, so a resize or a layout change no longer leaves it too tall or too short. Markdown tables in `Response` wrap only between words and scroll sideways on narrow screens, instead of breaking words letter by letter.

  `Conversation.Content` is now a positioning context, so visually hidden labels inside messages no longer stretch the page and let it scroll beneath the conversation.

- c9f171c: Textarea no longer turns into an ellipse under `radius="full"`: multi-line fields take `min(control radius, card radius)`, so they cap at the card radius in full mode and are unchanged in every other radius mode. Skin CSS applies the same cap before its corner scale.

## 0.1.0-beta.2

### Patch Changes

- 1bf2941: Published from GitHub Actions through npm Trusted Publishing, with provenance.
- Updated dependencies [1bf2941]
  - @dixy-ui/tokens@0.1.0-beta.2

## 0.1.0-beta.1

### Patch Changes

- 76dd130: Package READMEs now describe the public beta, with install steps, a quick start and documentation links. Releases are published with npm provenance.
- Updated dependencies [76dd130]
  - @dixy-ui/tokens@0.1.0-beta.1

## 0.1.0-beta.0

### Minor Changes

- 0cb30c1: First public beta. Dixy's tokens, React components built on Base UI and React Aria, and the optional themes package are now MIT licensed and published to npm. APIs may still change between beta releases; every change is listed in the changelog.

### Patch Changes

- 0cb30c1: `Field` and `Dialog` are now tree-shakeable. An app that imports only `Button` drops from about 129 KiB to 17 KiB minified (React excluded), because unused Base UI dialog and field code is no longer retained.
- Updated dependencies [0cb30c1]
  - @dixy-ui/tokens@0.1.0-beta.0
