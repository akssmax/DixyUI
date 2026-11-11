# @dixy-ui/tokens

## 0.1.0-beta.5

### Patch Changes

- f6c380e: Charts: add `Chart.Gradient` for theme-aware gradient fills. `Chart.LegendContent` `nameKey` now reads any row field (for radial bar legends). `charts.css` adds styles for label lists, inside labels, donut center text, leader lines and radial tracks. Tokens add `chart.track` for radial and gauge backgrounds.

## 0.1.0-beta.4

### Minor Changes

- cb2cb59: New optional `@dixy-ui/react/charts` entry: Recharts, dressed in Dixy. `Chart.Root` maps a series config (labels, icons, colors) to `--dixy-series-<key>` variables and adds a caption, loading and empty states, and an optional data table shown behind a disclosure or through a Chart | Table toggle (`tableDisplay`); `Chart.TooltipContent`, `Chart.LegendContent` and `Chart.DataTable` read the same config. Import `@dixy-ui/react/charts.css` after the core styles and install the optional peer `recharts` (3.10+). Tokens add `chart.1`–`chart.6` series colors (series 1 follows the accent; 2–6 are rebound per accent so none repeats its hue) and `chartSeriesFamilies()`, with `chart.grid`, `chart.axis` and `chart.cursor`, each series at least 3:1 against canvas, surface and raised surfaces in every accent and neutral. The core entry and its existing `Chart` are unchanged.

## 0.1.0-beta.3

### Patch Changes

- 43f6caa: Soft, metal and paper finishes are now clearly visible. Buttons show the whole finish instead of a 3px strip (glossy keeps its enamel bands). Soft clay has a pillowy top light and thick inset rim. Metal multiplies a cool steel band into the base colour under an irregular brushed grain and bevel rim. Paper multiplies a warm stock under hairline fibres. Each recipe gains a `blend` value, published as `--dixy-material-<name>-blend`. Metal and paper also have dark-mode variants (gunmetal and kraft) that lighten with `screen` instead of multiplying.
- 7ca04a0: Make themed controls easier to see:

  - Text fields now have a border colour of their own, which reaches at least 3:1 in every built-in theme (WCAG 1.4.11). They no longer reuse the decorative material edge, which was nearly invisible on Glass UI, Prism Glass and Ocean Depths.
  - Menus, popovers, dialogs and other floating panels are now close to opaque (94%, or 72% where the material blurs what's behind it). Glass materials no longer let the content behind them show through.
  - Focus rings use a new derived step, `focus`, on every colour family (`--dixy-color-<family>-focus` and `--dixy-color-brand-focus`, exported as `focusColor()`). In light mode it is step 8 mixed 30% toward step 11, so rings stay above 3:1 on grey light surfaces. Dark mode still uses step 8. `colorThemeVariables()` now returns `--dixy-color-brand-focus` too.
  - Notched corners use `corner-shape: bevel` where the browser supports it, so the border follows the bevel. Other browsers keep the clip-path and draw the diagonal edges back in.
  - Materials can set a separate shadow for dark mode (`darkShadow`, `darkInset`). Candy Clay uses this to replace its pink halo with a dark drop shadow.
  - Holi Colours no longer draws blurred powder clouds in the corners, which were cut off in hard squares. It keeps the speckle dust.
  - Skin paint now wins over `materials.css` on themed cards, panels and fields. Before, when both were loaded, the material image replaced the skin's paint but kept the skin's 4px grain size, so glossy themes showed horizontal stripes. This affected 11 built-in themes.
  - Three new themes, each with its own ornament (`/react`) entry:
    - **Sunset Drive** (`@dixy-ui/themes/sunset-drive`): pastel neon, a striped sun and a horizon grid.
    - **Save Point** (`@dixy-ui/themes/save-point`): a 16-bit menu window with a blinking cursor and pixel stars.
    - **Arcade Cabinet** (`@dixy-ui/themes/arcade-cabinet`): a cabinet frame with chasing marquee bulbs and an "INSERT COIN" credit line.
  - Selected tabs and toggles in a segmented group are now one flat colour, raised by their edge and shadow only. In light mode a pressed toggle used the theme's switch-thumb artwork (a two-colour split in ANSI Panes, hazard stripes in Freighter), and filled tab indicators used the material sheen, so the label sat across two colours.
  - Three themes for data-heavy apps. None has an ornament, so each ships only `@dixy-ui/themes/<slug>` and `<slug>.css`:
    - **Ledger** (`ledger`): hairline rules, tabular figures, a jade accent and faint ledger columns.
    - **Mainframe** (`mainframe`): square corners, flat grey layers instead of shadows, one blue, IBM Plex Sans.
    - **Dispatch** (`dispatch`): black and white with bold Inter, pill controls, and colour kept for status.
  - New font option `plexSans` (IBM Plex Sans, loaded from `@fontsource-variable/ibm-plex-sans`).
  - Materials can set `monoAccent`. With the neutral accent, solid actions then use ink (step 12) instead of mid-grey step 9: black buttons in light mode, white in dark. Focus stays blue. Any other accent ignores it.
  - **Signal** (`@dixy-ui/themes/signal`), an accessibility-first theme with no ornament: Atkinson Hyperlegible, 2px black or white edges, no shadows, 44px buttons and 48px fields, and a yellow focus halo. Text reaches at least 7:1 in both appearances (WCAG AAA 1.4.6).
  - New font option `atkinson` (Atkinson Hyperlegible, loaded from `@fontsource/atkinson-hyperlegible`).
  - New focus style `halo`: a solid 3px ring with an 8px yellow halo outside it. The halo's `box-shadow` is `!important`, so skin and material shadows can't hide it.
  - Materials can set `deepSolid`, which uses brand steps 11 and 12 for solid actions in light mode, and `controlHeights`, which sets the small, medium and large control sizes.

## 0.1.0-beta.2

### Patch Changes

- 1bf2941: Published from GitHub Actions through npm Trusted Publishing, with provenance.

## 0.1.0-beta.1

### Patch Changes

- 76dd130: Package READMEs now describe the public beta, with install steps, a quick start and documentation links. Releases are published with npm provenance.

## 0.1.0-beta.0

### Minor Changes

- 0cb30c1: First public beta. Dixy's tokens, React components built on Base UI and React Aria, and the optional themes package are now MIT licensed and published to npm. APIs may still change between beta releases; every change is listed in the changelog.
