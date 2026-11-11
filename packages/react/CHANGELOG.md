# @dixy-ui/react

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
