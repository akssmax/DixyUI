# Contributing to Dixy UI

Thanks for helping. This guide covers setup, the checks every change must pass, release notes and sign-off.

## Local setup

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
| `pnpm changeset`                      | Add a release note for a change to a published package                                              |

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

See [docs/BETA_PLAN.md](./docs/BETA_PLAN.md) for the release plan.

## Every change

1. `pnpm check` must pass. Also run `pnpm package:check` when you change public exports, declarations, CSS or packaging (add `--online` if your local store is missing packages).
2. Do not hand-edit generated files (`api.json`, generated token/skin CSS). Run the matching `pnpm …:generate` command.
3. Keep a component's preview, code sample and playground controls aligned; its demo's default parameters drive the code view.
4. Add a changeset for anything that affects a published package: `pnpm changeset`. Choose `patch` for fixes, `minor` for new features, and describe breaking changes explicitly (during `0.x` they are released as `minor`).

## Releases

The repository is in changesets **pre-release mode** (`beta` tag). On `main`, the Release workflow opens a "Version packages" PR; merging it publishes to npm under the `beta` dist-tag with provenance. Leave pre-release mode with `pnpm changeset pre exit` when preparing 1.0.

## Sign-off (DCO)

Dixy uses the [Developer Certificate of Origin](https://developercertificate.org). Sign every commit to certify that you wrote it, or otherwise have the right to submit it, under the project's MIT license:

```sh
git commit -s -m "Fix Select focus ring in dark mode"
```

This adds a `Signed-off-by: Your Name <you@example.com>` line. Pull requests with unsigned commits cannot be merged.

## Conduct

Be kind and constructive. See [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).
