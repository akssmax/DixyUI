---
"@dixy-ui/tokens": minor
"@dixy-ui/react": minor
"@dixy-ui/themes": minor
---

Expressive controls and three expressive starter themes.

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
