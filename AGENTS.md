# Working on Dixy

Dixy is a React component library and a design engineering learning project.

- Use pnpm workspaces, Turborepo, Base UI, and TanStack Start for the docs app.
- Keep the library independent of the docs and router. Docs consume compiled public package exports.
- Preserve Base UI refs, events, composition, state and accessibility contracts when adding styles.
- Keep playground previews, code, and prop controls aligned. Generate API metadata from local contracts; do not hand-edit generated files.
- Explain meaningful decisions with short summaries and focused snippets as you build. Include what changed, why, and how it was verified.
- Maintain DESIGN_ENGINEERING_CHECKLIST.md and docs/BUILD_LOG.md with evidence. Implementation completion does not establish the user's mastery; leave personal learning items unchecked unless the user confirms them.
- Run pnpm check for implementation changes. Run pnpm package:check when changing public exports, declarations, CSS or packaging.
- Verify relevant desktop, mobile, keyboard, light/dark and reduced-motion behavior. Record untested cases honestly.
- Do not use TinyFish or add a TinyFish integration.
- Use Codex's in-app browser for visual and interaction testing; do not launch a separate Chrome instance.
