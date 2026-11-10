# Dixy public beta plan

Goal: publish `@dixy-ui/tokens`, `@dixy-ui/react` and `@dixy-ui/themes` as `0.1.0-beta.0` on npm, with the docs hosted on **Cloudflare Workers**. A future Pro version will be a separate, commercially licensed package (for example `@dixy-ui/pro`) in a private repository. No Pro code goes into this MIT repository.

Owner key: **You** = needs your accounts or a decision. **Repo** = a change in this repository.

## Done in the repository (2026-11-08)

- [x] **MIT license.** `LICENSE` at the root and in each published package (npm only packs files inside the package directory); `"license": "MIT"` everywhere.
- [x] **Package metadata.** `author`, `repository` (with `directory`), `homepage` and `bugs` on the three published packages.
- [x] **Cloudflare Workers build.** `@cloudflare/vite-plugin` runs the docs' SSR environment as a Worker (`apps/docs/wrangler.jsonc`, Worker `dixy-ui-docs`, `nodejs_compat`). `pnpm dev` and `vite preview` both run in `workerd` locally. A `wrangler deploy --dry-run` uploads 9.2 MiB (1.6 MiB gzipped), under the free plan's 3 MiB limit. The cookie-reading server function (no theme flash) works on the Worker.
- [x] **Docs deploy job** `deploy-docs` in `.github/workflows/ci.yml`. It runs after the quality checks pass, on pushes to `main` and on PRs. With Cloudflare secrets present, it deploys `main` to production and uploads each same-repo PR as a preview version (`pr-<number>` alias). Without the secrets, the deploy steps are skipped with a notice.
- [x] **Release workflow** `.github/workflows/release.yml`. On `main` it runs every check, then `changesets/action`, which opens a "Version packages" PR; merging that PR runs `pnpm release` (`changeset publish`) with provenance. Packages marked `private` are never published, so this is safe to merge now.
- [x] **Changesets beta mode.** `pre.json` sets the `beta` tag. Package versions were reset to `0.0.0` (never published), so the first "Version packages" PR produces exactly `0.1.0-beta.0`, verified with a dry run. `privatePackages.version` is on, so private packages are versioned but not published.
- [x] **README for users.** Install, usage, packages, supported environments, known issues, license. The maintainer material moved to `CONTRIBUTING.md`.
- [x] **Supported browsers stated** in the README and on the docs installation page: Chrome/Edge 117+, Safari 16.2+, Firefox 121+ (measured from the shipped CSS: `oklch()`, `color-mix()`, `:has()`, container queries, subgrid). Decorative glass blur needs Safari 18+.
- [x] **Docs say beta.** The version label, landing hero, component status chip and installation page.
- [x] **Project files.** `CONTRIBUTING.md` (DCO sign-off), `SECURITY.md` (GitHub private reporting), `CODE_OF_CONDUCT.md` (Contributor Covenant 2.1), bug/feature issue forms, PR template.
- [x] **Tree-shaking and size budgets** `scripts/check-tree-shaking.mjs`, part of `pnpm package:check`. It fails if a core import pulls in React Aria, `@internationalized/date` or Motion, or exceeds its minified-size budget. It found and fixed a real leak: `Field` and `Dialog` were not pure, so every app kept Base UI's dialog code. **`Button` alone dropped from 128.8 KiB to 17.1 KiB minified.**

## 1. Connect the accounts (You)

| Step                                      | How                                                                                                                                                                                                                                                                                                                                           |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Cloudflare API token**                  | Cloudflare dashboard → My Profile → API Tokens → Create token → template "Edit Cloudflare Workers". Scope it to your account.                                                                                                                                                                                                                 |
| **Cloudflare account ID**                 | Dashboard → Workers & Pages → right-hand sidebar.                                                                                                                                                                                                                                                                                             |
| **Add GitHub secrets**                    | GitHub → `akssmax/DixyUI` → Settings → Secrets and variables → Actions: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`. The next push to `main` deploys the docs.                                                                                                                                                                            |
| Optional: custom domain                   | In Cloudflare, add the domain, then a `routes` entry with `custom_domain: true` in `wrangler.jsonc`. Otherwise the docs live at `dixy-ui-docs.<your-subdomain>.workers.dev`.                                                                                                                                                                  |
| ~~Create the `dixy-ui` npm organisation~~ | **Done 2026-11-08** (free plan, owner `akssmax`).                                                                                                                                                                                                                                                                                             |
| ~~npm token for the first publish~~       | **Done 2026-11-08.** Granular token "DixyUI GitHub release v2": read and write to `@dixy-ui` only, no org access, expires 2026-12-08. Saved as the `NPM_TOKEN` GitHub secret. After the first publish, switch each package to trusted publishing (OIDC) and delete the token; npm removes direct publishing with such tokens in January 2027. |

Alternative to GitHub secrets: Cloudflare's **Workers Builds** (dashboard → Workers → Import a repository) can build and deploy from this repo directly. Use a build command of `pnpm build`, a deploy command of `pnpm --filter @dixy-ui/docs exec wrangler deploy`, and the repository root as the root directory. If you choose it, delete the `deploy-docs` job from `ci.yml` so the site isn't deployed twice.

## 2. Remaining repository work (Repo)

1. **API naming pass before the freeze** (needs your decisions):
   - `Navbar.Toggle` vs `Sidebar.Trigger` vs `Collapsible.Trigger`: one word for "the button that opens this".
   - `PreviewCard` (Base UI's name) vs HoverCard (shadcn/Radix): keep it, and mention HoverCard in the docs so people can find it.
   - `backdrop-pilot.css` and other pilot exports: mark them experimental or remove them.
   - Mark anything not ready as **Experimental** on its docs page.
2. **Accessibility bar for beta:** a contrast script (every state × light/dark × built-in themes), a keyboard-only pass, forced colours, 320px at 200%/400% zoom, and a Known issues docs page.
3. **Once the docs URL exists:** set it as `homepage` in the three packages and on the GitHub repo, and link it from the README.
4. ~~**Make the packages publishable (last).**~~ **Done 2026-11-08.** `"private": true` removed from `@dixy-ui/tokens`, `@dixy-ui/react` and `@dixy-ui/themes`; each has `"publishConfig": { "access": "public", "provenance": true }`. Merging this to `main` makes the Release workflow open the "Version packages" PR.

## 3. Release

1. Merge step 4 above. The Release workflow opens "Version packages" (`0.1.0-beta.0`, CHANGELOGs).
2. Merge that PR to publish under the npm `beta` dist-tag.
3. Smoke-test from the real registry in a fresh Vite app and a fresh Next.js app: install, CSS import, `<Theme>`, SSR, and one overlay (portals).
4. Publish a StackBlitz starter, link it from the README, and announce with the Known issues linked.

Docs note: once Cloudflare is connected, the docs deploy on every merge to `main`. The installation page already shows `pnpm add @dixy-ui/react@beta`, so publish to npm soon after connecting Cloudflare, or the install command will 404 in the meantime.

## Beta → 1.0 exit criteria

- No breaking changes for at least two beta releases.
- VoiceOver + Safari and NVDA + Chrome/Firefox tested on the core components (Button, Field, Dialog, Menu, Select, Tabs, Combobox), with results recorded.
- Known issues has nothing above minor severity.
- At least one real application screen built with Dixy, with the API friction it exposed fixed.
- Performance budgets for the docs and a reference app measured and enforced in CI (the package size budgets above are the start).
