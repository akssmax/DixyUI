# @dixy-ui/themes

## 0.1.0-beta.7

### Minor Changes

- 8be0cdf: New `bevel` material: hard 1px raised edges (light top-left, dark bottom-right) for classic desktop chrome. Pressed buttons, pressed toggles and open popup triggers invert the bevel; fields, lists, calendars, checkbox and radio boxes, number and OTP fields and slider/progress/meter tracks become sunken wells; slider thumbs become raised blocks. Recipes may now declare optional `pressedImage`, `pressedEdge` and `wellEdge`, emitted as `--dixy-material-<name>-pressed-image`, `-pressed-edge` and `-well-edge`. Theme documents accept `bevel` for `material` and `componentFinish`. Reduced effects, high contrast and forced colours remove it like the other finishes.
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

- 8be0cdf: Add an option highlight and an accent surface.

  - `Theme highlight="tint" | "band"`: `band` marks highlighted and selected list options (Menu, Select, Combobox, Autocomplete, ListBox) with a full-ink band. The portal scope carries it, so popups follow. One token pair, `--dixy-highlight-band` / `--dixy-highlight-on-band`, is read before each item's own tint.
  - `Box surface="accent"`: paints the Box with the brand solid and remaps text, border, skin, material, button and highlight tokens so Dixy parts inside stay legible, in light and dark.
  - Themes: new `character.details.highlight` (schema version 7; v6 documents migrate to `tint`, which changes nothing). It compiles to the `highlight` Theme prop, not skin CSS. Swiss Poster, Brutalist Concrete, Tokyo Transit, Riso Zine, Freighter and Signal now use `band`.
  - Themes: Retro OS, Mainframe, Save Point, Arcade Cabinet and ANSI Panes default to the `bevel` material.
  - Themes: catalog `voice.display` adds large-type starter content (a word or numeral in a fluid display role) for 12 serif and numeral starters.

### Patch Changes

- 8be0cdf: Typography: add `display.xl`, `display.2xl` and `display.3xl` (72, 96 and 128px) for words that are the interface: selected values, cities, speeds. They're fluid. Each grows linearly from a phone-safe minimum (36, 44 and 52px) in a 320px container to its full size at 1280px, using container query units (`cqi`) with `clamp()`. With no size container, they follow the small viewport. Their line-height is unitless (`1`), so leading shrinks with the size. Size primitives 72, 96 and 128 are added. `display.lg` and smaller are unchanged. Skins pick up the new roles for heading weight and tracking.
- Updated dependencies [8be0cdf]
- Updated dependencies [f6c380e]
- Updated dependencies [8be0cdf]
- Updated dependencies [8be0cdf]
- Updated dependencies [8be0cdf]
  - @dixy-ui/tokens@0.1.0-beta.5

## 0.1.0-beta.6

### Patch Changes

- cebe805: Fix Candy Clay (and the other No-frame starters, such as Ocean Depths) growing cards and dialogs when an ornament renderer is passed anyway. These starters ship plain cards, so their stylesheet now takes any `.dixy-skin-ornament` out of flow and hides it. Previously `ClayOrnament`'s wrapper and canvas stayed `position: static` and added a canvas below the content, wider than the card on narrow screens (#24).
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
