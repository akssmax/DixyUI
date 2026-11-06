# Dixy UI

Expressive React components on Base UI, with a TanStack Start documentation workspace. This is a local alpha and a design engineering learning project. The package name is provisional; nothing is published to npm yet.

Dixy is the brand; Dixy UI is the React component library. The logo is a rounded, smiling D. Its facial details are transparent, and the in-app mark inherits the current theme color. Download the [violet SVG](./apps/docs/public/brand/dixy-mark.svg) or [monochrome SVG](./apps/docs/public/brand/dixy-mark-mono.svg). The same geometry is used in the documentation and favicon.

## Start

Use Node 24+ and pnpm 12.4.2.

```sh
pnpm install
pnpm dev
```

Open http://127.0.0.1:3000. The development command builds the React package once, then watches JavaScript/CSS, declarations, generated API metadata, and the documentation app together.

## Workspace

```text
apps/docs                 TanStack Start routes, MDX, typed demos and playgrounds
packages/react            @dixy-ui/react components, theme, component aliases and CSS
packages/tokens           @dixy-ui/tokens framework-independent foundations
packages/typescript-config Shared strict TypeScript configuration
fixtures/consumer         Independent packed React consumer
fixtures/tokens-consumer  Independent token consumer without React or Tailwind
scripts                   API generation and package validation
docs                      Learning notes and implementation evidence
```

The docs import the **built public package**, never a source alias. React and React DOM are peers and stay external to the library build. Base UI is a runtime dependency and also remains external. Spacing, sizing and layout foundations are exported from @dixy-ui/tokens. React’s stylesheet includes them; standalone consumers can import @dixy-ui/tokens/spacing.css directly.

## The public API

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

Initial exports: Theme, Button, IconButton, Text, Heading, Field, TextField, Dialog, Container, Stack and Inline. Theme supports compact, default and comfortable spacing density. Composition follows Base UI's `render` model. Styled actions use size, variant, and semantic color props; stateful primitive props and refs are forwarded.

Fonts belong to the application. The docs bundle Inter, Space Grotesk and JetBrains Mono locally; the component library supplies font stacks and overridable tokens. There is no Tailwind build requirement for consumers.

## Commands

| Command                               | Purpose                                                                                             |
| ------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `pnpm dev`                            | Run package and documentation watchers                                                              |
| `pnpm tokens:generate`                | Generate foundation CSS from canonical token contracts                                              |
| `pnpm tokens:check`                   | Detect stale generated foundation CSS                                                               |
| `pnpm docs:generate`                  | Generate API metadata from local TypeScript interfaces                                              |
| `pnpm docs:check`                     | Detect stale metadata                                                                               |
| `pnpm examples:check`                 | Typecheck all generated playground configurations, including theme wrappers                         |
| `pnpm typecheck`                      | Check library, routes and complete example modules                                                  |
| `pnpm test`                           | Run behavioral component tests                                                                      |
| `pnpm build`                          | Build the library and production documentation                                                      |
| `pnpm check`                          | Run metadata, type, unit and build checks                                                           |
| `pnpm package:check`                  | Pack and install the library outside the workspace; verify declarations, SSR, browser build and CSS |
| `pnpm --filter @dixy-ui/docs preview` | Serve the production documentation at port 3001                                                     |
| `pnpm format`                         | Format maintained source files                                                                      |
| `pnpm changeset`                      | Prepare a versioning note when release work begins                                                  |

`package:check` uses an isolated temporary directory and the workspace's local pnpm store in offline mode. Run `pnpm install` first. It never publishes anything and removes its temporary consumer afterward.

## Documentation architecture

Navigation and component metadata live in `apps/docs/src/registry/components.ts`. Typed examples live in `apps/docs/src/demos`; preview modules are lazy imports, and copyable code is loaded from the same source files. Playground controls replace the examples' typed default values. Reset remounts the example and clears its interaction output.

The API generator reads local interface members and JSDoc. Native and upstream props are explicitly documented as forwarded, rather than presenting an exhaustive table. Source disclosures load implementation text on demand. Highlighting loads when a code block approaches the viewport, with selected grammars and a bounded cache.

To add a component: implement and export it, add a typed example, register its controls and guidance, include its source in API generation, and add meaningful interaction coverage. Update the checklist with evidence.

## Learning and validation

- [Design engineering checklist](./DESIGN_ENGINEERING_CHECKLIST.md) — shipped implementation and personal mastery are tracked separately.
- [Learning notes](./docs/LEARNING_NOTES.md) — concepts, source pointers, snippets and exercises.
- [Build evidence](./docs/BUILD_LOG.md) — commands and browser observations from this implementation.

WCAG 2.2 AA is the target. Automated checks and Chromium browser evidence do not establish full conformance. VoiceOver/Safari, NVDA, zoom, touch and high-contrast reviews remain explicit release work.

Checkbox, Switch, Tabs, Tooltip, broader compatibility and a public release are later milestones. The package remains private until its name, licensing, compatibility and publishing setup are intentionally finalized.

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
