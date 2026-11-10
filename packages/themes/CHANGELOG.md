# @dixy-ui/themes

## 0.1.0-beta.5

### Patch Changes

- 464c58a: Fixes from the first outside beta test:

  - Popups (Popover, Menu and other overlays using the absolute positioning strategy) no longer open a page height away from their trigger under a starter theme. Each starter positioned and isolated `.dixy-theme`, which also matched the zero-height `.dixy-portal-scope` wrapper at the end of `<body>`, making it the popups' containing block. The rule now skips the portal scope.
  - `Tabs.Panel` stretches to the full width of `Tabs.Root`, even when an app turns the root into a flex column.
  - The `@dixy-ui/themes` README now gives the correct starter count (38) and links to dixyui.com.

## 0.1.0-beta.4

### Patch Changes

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

- Updated dependencies [43f6caa]
- Updated dependencies [7ca04a0]
  - @dixy-ui/tokens@0.1.0-beta.3

## 0.1.0-beta.3

### Patch Changes

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

- Updated dependencies [0cb30c1]
  - @dixy-ui/tokens@0.1.0-beta.0
