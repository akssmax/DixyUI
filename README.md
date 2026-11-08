# Dixy UI

Expressive, accessible React components built on [Base UI](https://base-ui.com), with semantic design tokens and optional theme skins.

> **Public beta.** APIs may still change between `0.x` beta releases. Every change is listed in each package's CHANGELOG. See [Known issues](#known-issues).

Dixy is the brand; Dixy UI is the React component library. The logo is a rounded, smiling D: [violet SVG](./apps/docs/public/brand/dixy-mark.svg) · [monochrome SVG](./apps/docs/public/brand/dixy-mark-mono.svg).

## Install

```sh
pnpm add @dixy-ui/react@beta
# optional: extra visual skins
pnpm add @dixy-ui/themes@beta
```

Peer dependencies: `react` and `react-dom` 19. `motion` 14 is optional and only needed for `@dixy-ui/react/motion`.

## Use

Import the stylesheet once at your application root, then wrap your app in `Theme`:

```tsx
import "@dixy-ui/react/styles.css";
import { Theme, Button, Field, TextField } from "@dixy-ui/react";

export function App() {
  return (
    <Theme appearance="light" accentColor="violet" radius="md">
      <Field.Root>
        <Field.Label>Project name</Field.Label>
        <TextField placeholder="Something worth making" />
        <Field.Description>Visible to your team.</Field.Description>
      </Field.Root>
      <Button>Create project</Button>
    </Theme>
  );
}
```

No Tailwind build is required. Styles live in CSS cascade layers, so your own styles override library defaults. Fonts belong to your application; Dixy supplies font stacks and overridable tokens.

## Packages

| Package           | What it is                                                                                   |
| ----------------- | -------------------------------------------------------------------------------------------- |
| `@dixy-ui/react`  | 80+ components on Base UI and React Aria, the `Theme` provider and the stylesheet            |
| `@dixy-ui/tokens` | Framework-independent colour, typography, sizing, spacing and motion tokens (plain CSS + TS) |
| `@dixy-ui/themes` | Optional 2D skins (paper, glass, terminal, festive…) for the same components                 |

## Supported environments

- **React** 19, client or server rendering (tested with TanStack Start and Vite SSR).
- **Browsers:** Chrome/Edge 117+, Safari 16.2+, Firefox 121+. The styles use `oklch()`, `color-mix()`, `:has()`, container queries and subgrid. Some decorative glass blurs need Safari 18+ and degrade to a solid surface before that.
- **Accessibility target:** WCAG 2.2 AA. Components use Base UI and React Aria behaviour, and unit tests run axe. Manual screen-reader, forced-colours and zoom testing is still in progress; see Known issues.

## Known issues

- Screen readers (VoiceOver, NVDA), Windows high-contrast mode, touch devices and 200%/400% zoom have not yet been tested systematically.
- Right-to-left layouts are only partly verified.
- Component and prop names may still change before 1.0; renames will be listed in the changelog.

Report problems on [GitHub issues](https://github.com/akssmax/DixyUI/issues).

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for local setup, checks, changesets and the sign-off requirement. Security reports: [SECURITY.md](./SECURITY.md).

## License

[MIT](./LICENSE) © Akshay Saini

## Color foundations

Dixy now has 39 OKLCH palette families, each with 12 light and 12 dark stops: 11 neutral bases and 28 color families. Separate black/white overlay ramps provide 12 alpha stops each. Components use semantic surface, text, border, action and feedback roles. Choose a base neutral separately from the brand:

```tsx
<Theme appearance="dark" accentColor="cyan" neutralColor="stone">
  <Button>Save changes</Button>
  <Button color="danger">Delete</Button>
  <Button color="success">Approve</Button>
</Theme>
```

Blue is the default library accent; the docs select purple explicitly. Explore the palettes, overlays, personalities and role mappings at `/docs/foundations/color`. See [the token package](./packages/tokens/README.md) for plain CSS, custom OKLCH seeds and optional Tailwind v4 utility bindings.

The motion foundation adds shared CSS timings, easing, semantic transition recipes and spatial/effects spring contracts. Motion for React is an optional integration at `@dixy-ui/react/motion`; the core library and standalone tokens do not require the engine. Live retargeting, presence, finite sequences, easing comparisons and reduced-motion previews are documented at `/docs/foundations/motion`.

Buttons, dialogs (including AlertDialog), drawers, menus and tab indicators consume generated component aliases from the public `componentMotion` map. Feedback uses 120ms, dialogs/menus/indicators 200ms, drawer entrances 280ms and exits 120ms. Reduced motion removes decorative travel and makes transitions immediate; tab positioning, drawer snap offsets and direct swipe tracking remain functional. The same foundation page includes a complete composed example with motion, drawer-edge, orientation and RTL controls. Base UI continues to own presence and focus; these components do not require Motion.

## Expressive foundations

Shape, Materials, Emotion and Haptics now have live foundation pages alongside the existing Motion system. Materials use an optional static CSS pack; feedback has its own optional entry. Theme personalities coordinate finish and geometry while preserving semantic status and preference reduction. The Materials page includes an explicitly started, finite rendering comparison; Motion includes an opt-in connected-press prototype. See [the React package guide](./packages/react/README.md#expressive-foundations) and [the architecture plan](./docs/EXPRESSIVE_FOUNDATIONS_PLAN.md). Glass and group expansion remain experiments pending wider device evidence.
