---
name: theme-audit
description: Find and fix bugs in Dixy's built-in themes. Use when asked to audit, review, check or fix themes, theme contrast, focus rings, or "theme bugs". Renders every theme in the docs app, reads the measured report, applies patches with pnpm themes:fix, and re-checks.
---

# Theme audit and fix loop

The audit page measures what the browser renders; `pnpm themes:fix` patches a
theme and rebuilds it. Work in that loop: audit, fix, re-audit, until the
report is clean or the remaining findings need library work.

## 1. Run the audit

1. Start the docs dev server: `preview_start` with `docs-alt` (port 3001) if
   packages are already built, otherwise `docs` (runs `pnpm dev`).
2. Open `http://127.0.0.1:3001/lab/theme-audit` in the in-app browser.
   - `?theme=<slug>` audits one theme (faster while fixing).
   - `?appearance=light|dark` limits to one appearance.
3. Wait for `document.documentElement.dataset.auditStatus === "done"`, then read
   `window.__dixyThemeAudit`. The dev server also writes the same report to
   `.dixy/theme-audit.json` (ignored by Git).

Report shape: `totals`, `themes[]` (id, `defaultAppearance`, fail/warn counts,
current `foundations` and `material` recipe), and `issues[]` (theme,
appearance, check, severity, role, message, measured/required, foreground and
background hex).

## 2. Triage

Checks: `contrast` (text 4.5:1, large text 3:1), `boundary` (a field's border
or fill 3:1 against the surface around it), `focus` (a visible change
when focused, ring 3:1 against what's behind it), `target` (24×24 minimum,
warning only), `overflow` (clipped labels or content past the card).

- Fix failures in a theme's `defaultAppearance` first; that's how people see it.
- Group issues by cause. The same message across many roles in one theme
  usually means one token, not many bugs.
- Contrast messages that say "approximate" sit on a gradient or texture; look
  at the specimen before changing anything.
- If the same failure appears in several themes that share an accent or
  neutral palette, it's a token problem in `packages/tokens`, not a theme
  bug. Report it instead of patching every theme.

## 3. Fix a theme

```bash
pnpm themes:fix <slug> --show                       # starter values, current fix, result
pnpm themes:fix <slug> '{"foundations":{"neutralColor":"slate"}}'
pnpm themes:fix <slug> '{"recipes":{"material":{"parameters":{"surfaceMix":30}}}}'
pnpm themes:fix <slug> --reset                      # drop the fix
pnpm themes:fix --list                              # all saved fixes
```

- Patches merge into the theme's existing fix and are validated by the theme
  schema, so an invalid value fails before anything is written.
- Fixes are stored in `packages/themes/src/theme-fixes.ts` as the smallest
  diff over the starter in `documents.ts`. Never edit the generated files
  (`catalog.ts`, `skins/*.ts`, `generated/*.css`).
- Prefer the smallest change that keeps the theme's character: adjust a
  neutral or material mix before changing the accent colour.
- Only patch document fields (`foundations`, `recipes`, `character`). Ornament
  components and component CSS are code changes; make them directly.

## 4. Re-check and report

1. Reload the audit page (the rebuild takes about two seconds) and confirm the
   issue is gone and nothing new appeared in that theme's other appearance.
2. Look at the specimen screenshot for themes you changed. A passing number
   can still look wrong.
3. Run the full audit once more, then `pnpm check`.
4. Add a changeset (`@dixy-ui/themes` patch) and a BUILD_LOG entry with the
   before and after numbers. List findings left for library work separately.

The audit covers one specimen per theme. It doesn't check ornaments over
text, hover and pressed states, disabled controls or real keyboard focus
order; say so when you report results.
