# Build evidence

## 2026-10-15 — First implementation

Scope: monorepo, theme foundations, Button/IconButton, Text/Heading, Field/TextField, Dialog and TanStack Start documentation. The docs include foundations, MDX guides, typed playgrounds, generated local API tables, lazy source, search, and a learning route.

### Evidence collected

- Strict workspace TypeScript check passed, including complete demo modules.
- 11 behavioral unit tests passed: activation/ref forwarding, loading, composition, icon names, field relationships, controlled and uncontrolled Dialog focus, portal theme inheritance, heading semantics and deterministic server markup.
- Production client and server bundles built with normal Node settings.
- An independent temporary consumer installed a packed tarball, typechecked with dependency declarations checked, rendered public ESM exports on the server, and built a browser application with the public stylesheet. CSS output contained theme tokens, TextField and Dialog styles.
- Browser playground check passed for activation output, prop controls, loading disablement, preview/code synchronization, complete reset and stationary toolbar placement across sidebar collapse.

### Useful failures

- A composition test found an incorrect assumption: rendering Button as an anchor does not automatically give it link semantics. The navigation example now uses an explicit link role.
- Browser review found an unlayered docs reset overriding the component's contrasting button text. The reset was narrowed to docs controls.
- Vite's production transform required MDX compilation to run before its built-in parser. The MDX plugin now explicitly runs in the pre-transform phase.
- Declaration generation originally retained a CSS import path that was not part of the published output. A build-only entry now extracts CSS while keeping the public declaration entry clean.

### Additional verification

- `pnpm dev` starts the library JS/CSS watcher, declaration watcher, API metadata watcher and documentation server together at http://127.0.0.1:3000. Declaration output remains intact during development rebuilds.
- All 23 generated playground configurations typecheck, including their selected Theme wrapper. Packed declarations also enforce the IconButton name and Text element/ref contracts.
- All 13 production routes returned 200 with server-rendered stylesheet links; emitted CSS returned 200; an unknown component returned 404.
- Chromium checks passed for Dialog focus entry, Escape, restoration, nested appearance and local form submission; TextField controlled input, invalid state and reset; mobile drawer navigation and keyboard search; full code copying, deferred source loading and reduced-motion transition durations.
- The overview's main pane had equal client/scroll widths at 320px (272/272) and 390px (342/342).
- Selected axe scans returned zero violations for Button in light desktop and dark mobile modes, highlighted code in both appearances, code scrolling on mobile, the overview on desktop/mobile, and the settled light Dialog inside dark docs. These are selected cases, not a claim of whole-system conformance.
- Screenshots are in `output/playwright/`: overview-desktop.png, overview-mobile.png, button-desktop.png, button-mobile.png and dialog-desktop.png. This output directory is ignored by Git.

### Further lessons from validation

- Navigation targets were too small and muted chrome text fell short of its actual surface's contrast requirement. Hit areas and the semantic muted color were adjusted.
- Horizontally scrollable code needs a keyboard focus target. Both fallback and highlighted pre elements are focusable.
- The stock light syntax palette had low-contrast colors on the docs' warm code surface. Its token colors now receive a contrast adjustment before highlighting.
- A contrast scan during an entrance transition measured intermediate translucent colors. The final dialog check waits for its resting opacity before auditing; its final theme and contrast pass the selected scan.
- Theme propagation copies custom-property overrides, not root layout styles. A regression assertion verifies that a Theme's margin does not leak into its portal wrapper.

### Open validation

Manual VoiceOver/Safari and NVDA testing, broad touch/browser coverage, zoom/high-contrast review, durable visual regression baselines, hosting and npm publishing remain pending. The validation above applies to the current alpha slice.

## 2026-10-15 — Dixy naming and logo

Dixy is the ecosystem brand and Dixy UI is the React component library. The workspace package names, imports, build filename, CSS layers/classes/variables, metadata, examples, fixture, release configuration, and documentation now use Dixy. Packages remain private local alphas.

The new mark is a rounded D with a smiling face cut out of a single filled SVG path. It inherits the theme color in the app, remains static, and is hidden from assistive technology when decorative; home links retain explicit names. The identical geometry is available in violet and monochrome SVG downloads and the favicon. A lowercase wordmark and the new mark replace the previous identity throughout the docs shell and overview.

Validation:

- `pnpm check` passed for the shared workspace at the time of branding validation: generated contracts, strict TypeScript, behavioral tests, complete generated examples, and production builds. Other foundation work was arriving concurrently in this checkout.
- `pnpm package:check` passed after populating missing cached dependencies: isolated packed-package installation, declarations, SSR, browser builds, and renamed CSS exports.
- Verified the overview and installation guide in Codex's in-app browser, including the renamed page titles, imports, accessible home links, and light/dark mark colors.
- The in-app browser at 390 × 844 had no horizontal overflow. The mobile drawer showed Dixy UI; Escape closed it and returned focus to Open navigation. Command-K search followed by Enter opened the Installation guide.
- The logo adds no animation. OS-level reduced-motion and manual screen-reader reviews were not repeated for this branding change.

Artifacts: `output/playwright/dixy-logo-preview.jpg`, `dixy-overview-iab-desktop.jpg`, `dixy-overview-iab-dark.jpg`, `dixy-overview-iab-mobile.jpg`, `dixy-overview-iab-mobile-dark.jpg`, and `dixy-navigation-iab-mobile.jpg`. The initial Chrome verification session was closed when testing switched to the in-app browser.

## 2026-10-15 — Spacing foundation

Implemented the supplied spacing brief in the existing Dixy namespace. The former eight-step scale is replaced by 16 immutable numeric primitives: 0, 025, 050, 075, 100, 150, 200, 250, 300, 400, 500, 600, 800, 1000, 1200 and 2000 (0–160px at a 16px root). `packages/tokens/src/spacing.ts` is the canonical framework-independent contract; `scripts/generate-spacing.mjs` emits its rem stylesheet, React component aliases, and Stack/Inline gap rules. The generator writes only changed output, and freshness checks reject drift. Default rules precede density rules so compact density on the html element overrides :root correctly.

Semantic inline/stack/section/inset mappings separate relationships from numeric values. Explicit compact/default/comfortable mappings change stack and inset while preserving inline, section, primitive spacing, control heights and focus indicators. Component aliases are owned by the React package and rebound at each density boundary, because inherited CSS aliases otherwise resolve in the parent scope. Theme density inherits through nested Themes and Dialog portals. Plain HTML scopes work through `data-dixy-density`.

Stack and Inline each render one configurable semantic element, preserve typed refs/native props, and allow class/style overrides. Inline wraps by default and follows writing direction. Button, input, Field and Dialog now consume semantic/component spacing. Default Button gap is 4px, input inline padding is 12px, and Dialog padding is 24px. These are deliberate visual changes; control heights are unchanged. Old primitive CSS names are removed, with migration mappings documented in the package README and `/docs/foundations/spacing`.

### Executed checks

- `pnpm check` passed: generated token/API freshness, workspace TypeScript, unit tests and production client/server builds. The spacing work adds six token checks and three layout tests. The final shared-workspace run passed 15 React tests and eight token tests, including concurrent typography coverage. The shared workspace's final example check typechecked 55 complete configurations, including all 18 density/gap/direction spacing configurations.
- `pnpm package:check` passed using packed tarballs in isolated consumers: React declarations, ESM/SSR, browser build, compiled CSS, typed Stack/Inline, and a separate token-only app with no React or Tailwind installed. The token consumer also checks invalid primitive/semantic identifiers with expected TypeScript errors.
- All browser interaction used **Codex's in-app browser** following the user's request. No Chrome instance was opened. Development and production spacing routes were exercised; the production preview ran at `http://127.0.0.1:3003`.
- Production computed styles confirmed all 16 primitives remain identical across three density scopes. Card insets are 12/16/20px, stack.sm gaps are 6/8/12px, and button heights remain 40px. Nested compact → comfortable scopes resolve to 12px → 20px inset/gap. A standalone plain-HTML fixture also verified compact on the document root, nested comfortable, and nested default reset (12/20/16px) with fixed primitives.
- Density, gap and RTL controls stay aligned with displayed example code. RTL puts the first action on the right. Keyboard Tab moves from density to gap; keyboard-focused actions retain a 2px outline. Copy displays its success feedback, but the in-app browser's clipboard reader returned an empty string, so clipboard bytes were not independently confirmed.
- Light and dark previews checked. At 320px and 390px, main-pane client/scroll widths matched (272/272 and 342/342); controls wrap without page overflow. Production desktop checked at 1280px. Temporary viewport overrides were reset afterward.
- Evidence: `output/playwright/spacing-density-desktop.png`, `spacing-mobile-dark.png`, `spacing-browser-evidence.json`, and the standalone HTML/evidence fixtures. These are local ignored artifacts, not durable visual regression baselines.

A final check briefly encountered missing declarations while concurrent typography work rebuilt the shared package. After rebuilding, the complete `pnpm check` passed again. Independent package validation also passed. No unrelated typography work was reverted.

### Remaining review

Native 200%/400% browser zoom remains unverified: the in-app browser zoom shortcut did not change its CSS viewport. Reduced-motion emulation is unavailable in the current browser controls; spacing introduces no transitions or looping animation, and the existing reduced-motion stylesheet is retained. Manual screen-reader, touch, high-contrast, cross-browser review and durable screenshot baselines remain pending. Tailwind is not used in this repository; the documented optional v4 theme mapping was not compiled against Tailwind. No negative variants, Bleed primitive, responsive-prop engine, sizing foundation or npm publication was added. Personal learning checklist items remain unchecked.

## 2026-10-15 — Typography foundation

Reviewed the user's typography brief against Primer, Radix Themes, Apple HIG, Material 3, and Atlassian. The adopted system uses semantic role names inspired by Atlassian, role families from Material, practical paired styles from Primer, visual/HTML independence from Radix, and legibility/resizing principles from Apple. Native Apple point values and platform Dynamic Type are not presented as web CSS defaults. The foundation page links the original sources and explains each decision.

`packages/tokens/src/typography.ts` is canonical for 18 styles: three each of display, heading, title, body and label, plus caption and two code styles. Source names use font.role.size; CSS uses --dixy-font-role-size. Complete shorthand styles and individual properties are generated; tracking stays separate because the CSS font shorthand cannot express it. Sizes and leading use rem; tracking uses em. Semantic aliases rebind at Theme boundaries for local family/primitive overrides.

Inter Variable is the interface and heading face; Space Grotesk Variable is reserved for display. The docs switch from Inter's weight-only file to its standard variable file with weight and optical size, including a separate italic face. Inter supports weight 100–900 and optical size 14–32 in bundled metadata; Space Grotesk supports weight 300–700. The variable-font lab exposes supported controls only and uses font-weight/font-optical-sizing. JetBrains Mono remains a static code face. Font loading stays with the docs consumer, not the component package; current subsets cover Latin with system fallback for other scripts.

Text and Heading accept typed semantic variants while preserving native props and refs. Heading level stays independent of its visual role. Their size props remain conveniences for body and heading families, with an explicit variant taking precedence. Library buttons, inputs, labels, descriptions and dialogs now consume paired type styles. Inputs remain 16px across sizes/densities. Documentation chrome, reading text, code samples, examples and overview consume the same tokens; the former 6–11px labels are removed. Default reading is 16/24; compact UI is 14/20; supporting metadata starts at 12px. Layouts explicitly choose smaller display roles on narrow screens.

### Validation and fixes

- `pnpm check` passed: token/API freshness, strict workspace types, 15 React behavioral tests and eight token tests, 55 complete generated example configurations, and production client/server builds. The final scroll-position CSS correction was followed by another successful production docs build.
- `pnpm package:check` passed with separate packed React/token tarballs: declarations, expected invalid-role type errors, SSR, browser bundles, typography CSS in React and token-only consumers, and no React/Tailwind requirement for standalone tokens.
- `pnpm format:check` passed. Canonical typography generation formats its output before comparison so formatting cannot invalidate freshness checks.
- Browser testing used Codex's in-app browser exclusively. Desktop computed styles matched all 18 role contracts. Main-pane widths matched at 320px (272/272), 390px (342/342), and 1440px (1136/1136). A 56px display heading now wraps within the 224px mobile component preview instead of clipping its longest word.
- Changed heading/text role controls; the preview retained its h3 and the complete generated code reflected both choices. Reset restored defaults. Keyboard weight changes updated the variable-font specimen and CSS; optical sizing toggled auto/none. Space Grotesk restricts weight to 300–700 and hides the optical-size control.
- The long foundation page exposed absolutely positioned screen-reader live regions escaping their scrolling main pane. This could make the hidden outer app scroll and move its stationary header. Positioning main and CodeBlock relatively contains those regions. The production page now keeps app client/scroll height at 844/844, app scrollTop at zero, and header top at zero after deep-control interaction.
- Verified production typography and server-rendered stylesheet references at `http://127.0.0.1:3004/docs/foundations/typography`, including light/dark and mobile views. Production keyboard weight changed to 551 and computed weight matched.
- Screenshots: `output/in-app-browser/typography-desktop.jpg` and `typography-mobile-dark.jpg`. Check logs are in output/typography-check.log and output/typography-package-check.log. These are ignored local evidence, not a durable visual regression baseline.

Actual 200%/400% zoom, custom text-spacing overrides, screen-reader/high-contrast/touch review and broad browser coverage remain unverified for this updated scale. Prior selected axe results are not a fresh audit of this typography change. Reduced-motion rules are retained; this change introduces no animated font interpolation. Learning exercises remain unchecked until the user can perform and explain them independently.

Final shared-workspace note: another sizing/layout slice began landing while typography validation finished. A later `pnpm check` stopped at `TS2307` because `foundation-page.tsx` imported the not-yet-created `./sizing-layout-foundation` module. Typography's earlier successful check and production validation precede that unrelated incomplete import. The later failure is preserved in `output/typography-check-concurrent-layout.log`; the new layout work was not removed or replaced. Formatting passed again after that work arrived.

The pending sizing/layout page subsequently arrived. The final `pnpm check` rerun passed across the shared workspace: 15 React tests, eight token tests, 55 complete generated examples, freshness/type checks and production builds. The transient missing-module failure remains saved separately as a record of concurrent work, not a current blocker.

## 2026-10-15 — Sizing and layout foundation

Added canonical, framework-independent `packages/tokens/src/sizing.ts` and `layout.ts`. `scripts/generate-sizing-layout.mjs` emits public `sizing.css` / `layout.css` exports and the React Container width rules. Values, literal media conditions and typed helpers share these contracts; generated files are never edited by hand. Existing spacing primitives and density mappings are unchanged.

### Decisions and integration

- Nominal controls keep sm/md/lg = 32/40/48px. Icons use xs/sm/md/lg/xl = 12/16/20/24/32px. Button icons use 16px or 20px for large controls; loading icons use 16px.
- Minimum and comfortable interaction targets use `max(24px, 1.5rem)` and `max(44px, 2.75rem)`. The CSS-pixel floors survive a smaller document root, and larger roots scale them up. IconButton uses at least the comfortable target, so small/medium icon buttons render at 44px; large remains 48px at a 16px root. Button/TextField use the minimum policy, with a comfortable override on coarse-pointer devices or through `--dixy-interaction-target`. Actual boxes grow; no overlapping pseudo-element hit areas are added. Density does not shrink sizing or focus indicators.
- Container maximums are 640/768/1024/1280px, including gutters. Viewport thresholds are sm 640, md 768, lg 1024, xl 1280, wide 1536px, emitted as 40/48/64/80/96rem. Gutters reference existing space.200/300/400: 16px base, 24px at sm, 32px at lg. Media-query rem units follow the browser's initial font size; ordinary rem lengths follow the document root.
- `Container` renders one semantic element, forwards native events, typed refs and style/class overrides, centers using logical margins and stays within its parent. The existing height override contract is retained through generated `--dixy-height-sm/md/lg` aliases. Public helpers include `size`, `container`, `minWidth`, `layoutGutter` and derived token types.
- `/docs/foundations/sizing-layout` renders the actual complete demo source. All size/policy/density/container/direction settings configure that same source for copying. Reset clears controls, input content and action feedback. API rows are generated from the local Container contract. Accessibility guidance links the W3C minimum/enhanced target criteria and makes no conformance claim from token values alone.

### Executed checks

- `pnpm check` passed: token/API freshness, strict workspace TypeScript, 13 token tests, 16 React tests and production client/server builds. New coverage includes five sizing/layout contract/generator checks and Container composition/ref/event/style behavior. All 200 complete examples typecheck, including every one of the 144 sizing/layout control combinations.
- `pnpm package:check` passed: packed React declarations and browser/SSR consumption; independent token-only installation without React/Tailwind; public CSS and ESM helpers; expected type errors for invalid control, container and breakpoint identifiers.
- All UI testing used **Codex's in-app browser**. No Chrome instance was opened. Tested development docs, built docs at port 3004, and an isolated static fixture at port 3010. The active dev process was restarted because its old API watcher predated the new source list and removed Container metadata. Concurrent color foundation edits were preserved; after their module appeared, invalidating the parent route cleared Vite's cached missing-module error.
- Standalone boundary measurements at 320, 390, 639/640, 767/768, 1023/1024, 1279/1280 and 1535/1536px showed the expected media-query transitions. Gutters were 16px below 640, 24px through 1023, and 32px from 1024. The xl container capped at 1280px and the sm container at 640px; no page overflow occurred at any measured width.
- Root-font checks at 12/16/20px verified minimum-policy controls at 24/30/36, 32/40/48 and 40/50/60px respectively. Comfortable targets were at least 44px at small/default roots and 55px at a 20px root. At a 16px root, icon buttons were 44/44/48px and glyphs 16/16/20px. Gutters scaled with rem independently of viewport thresholds.
- Compact density left small controls at 32px. Selecting comfortable raised the actual button/input boxes to 44px. RTL reversed action order; generated example defaults matched the selected controls. Input editing, button/icon action callbacks, keyboard activation and complete reset worked. Keyboard-focused icon actions retained a 2px outline in standalone and documentation checks.
- Light/dark docs checked at mobile and desktop sizes. At 320px, main client/scroll widths were 272/272 and preview widths 224/224; at 390px these were 342/342 and 294/294. Actions wrapped at narrow widths without clipping. Desktop checked at 1280px. Container transitions compute to 0s. Temporary viewport overrides were reset.

### Artifacts and limits

Evidence is saved under ignored `output/playwright/`: `sizing-layout-desktop.png`, `sizing-layout-mobile-dark.png`, `sizing-layout-standalone.html`, `sizing-layout-boundaries.json` and `sizing-layout-targets.json`. These are review evidence, not automated screenshot baselines.

Actual 200%/400% browser zoom, coarse-pointer device input, manual touch/screen-reader/high-contrast review and reduced-motion preference emulation remain unverified. The in-app browser reported a fine pointer, so the explicit comfortable policy was exercised; the coarse-pointer media condition still needs real-device review. New layout styles add no animation; existing reduced-motion behavior is retained. No new responsive-prop engine, framework, dependencies or publishing was introduced. Personal learning items remain unchecked.

## 2026-10-15 — Radius, border and shadow foundation

Added `packages/tokens/src/surfaces.ts` as the canonical framework-independent contract, with generated public `radius.css`, `border.css`, `shadow.css` and React-owned component aliases. Definitions, helpers, CSS exports and source-derived live tables share the contract. No new styling library or runtime dependency was introduced.

### Reference comparison and decisions

- Radix Themes: contextual Theme radius settings and a six-step shadow vocabulary. Sources: https://www.radix-ui.com/themes/docs/theme/radius and https://www.radix-ui.com/themes/docs/theme/shadows.
- Material 3: size-based corner roles, optical roundness for nested shapes, and a deliberately limited elevation hierarchy. Read the JavaScript-rendered current shape guide in Codex's in-app browser; it documents ten styles through full, including 20/28/32/48dp expressive extensions. Sources: https://m3.material.io/styles/shape/corner-radius-scale and https://material-web.dev/components/elevation/.
- Apple: materials establish a functional layer while preserving legibility; related nested corners share a center. Sources: https://developer.apple.com/design/human-interface-guidelines/materials and https://developer.apple.com/documentation/swiftui/edge/corner/style/concentric. These were treated as geometry/hierarchy guidance, not an invented universal Apple web radius scale.

Dixy's middle ground keeps compact controls and restrained rectangular content panels. Fixed radius primitives are 0/2/4/6/8/10/12/16/24px plus a full sentinel. Default control/card/overlay roles are 10/12/16px. Five Theme presets remap roles; full caps card/overlay at 16/24px, while none makes all roles square. Border widths are 0/1/2 CSS pixels, with solid/dashed styles and subtle/default/strong/danger semantics using existing color roles. Focus remains independently 2px wide with a 3px offset. The spinner's 1.5px stroke remains an optical exception.

Shadows use none/inset/raised/floating/overlay roles. Elevated surfaces have two restrained neutral layers. Dark mode increases occlusion opacity while preserving geometry. Forced colors removes shadows; visible borders and focus remain necessary. No new geometry or shadow animation was added. Density changes padding without changing these surface contracts.

### Integration

Button and TextField now consume control-radius/component-border aliases. Dialog uses the overlay radius and shadow, preserving portal inheritance and inline custom-property overrides. Existing control radii remain 4/10/16px for sm/md/lg. The default Dialog radius normalizes from the old computed 18px to 16px, and the none preset fixes the old residual 8px Dialog corner. Existing --dixy-radius (controls) and --dixy-shadow (Dialog shadow) overrides remain supported; explicit panel overrides use --dixy-card-radius/--dixy-dialog-radius.

The `/docs/foundations/surfaces` page includes linked reference comparisons, source-derived scales, copyable code, optical nesting math and a real Base UI Dialog playground. Its controls edit the same complete source used by the code block. Reset restores state, input and feedback. Theming/component page radius controls now derive their choices from the canonical presets. Browser review found an unlayered documentation focus rule overriding previews; it is now scoped to documentation controls so library previews retain their real 3px focus offset.

## 2026-10-15 — SVG icon support

Read the multi-pack brief and audited the recent sizing/color foundations before implementation. Existing size.icon.xs/sm/md/lg/xl tokens were 12/16/20/24/32px, and semantic foregrounds already included primary, secondary, disabled, success, danger, warning, information and discovery. The implementation reuses --dixy-size-icon-* and --dixy-color-icon-* without introducing a parallel icon.size/icon.color namespace. The only new size is 2xl at 48px/3rem. `scripts/generate-icons.mjs` derives component selectors from the canonical sizing and semantic color contracts and participates in freshness checks.

Added public Icon/IconProps/IconColor. Icon requires a render element, consistent with the existing Base UI composition model. It renders one SVG without a DOM wrapper; Base UI useRender merges both refs, classes, styles and event handlers. Pack-specific props remain on the render element. Original viewBox, stroke and fill are preserved. Standalone size defaults to 20px, while an unspecified size inside a Button inherits its 16/20px icon contract. Explicit sizes win. Color inherits by default so button foreground contrast is retained; named semantic foregrounds are available for standalone contexts. Raw SVG children still receive the Button sizing contract.

Decoration is hidden and nonfocusable. A nonempty label creates a named image. Managed attributes normalize aria-hidden, role, aria-label, aria-labelledby, focusable and tabIndex after composition so pack defaults cannot override the accessible-name contract. IconButton retains the action name; its child icon stays decorative. A regression test covers a valid conflicting aria-labelledby target as well as a pack's default aria-hidden.

Lucide remains the docs baseline. Added pinned @phosphor-icons/react 2.1.10 to the docs app only; individual SSR imports avoid the broad development barrel. Both packs and a custom SVG are rendered in the Icons foundation. The component playground controls pack, six sizes, semantic foreground and decorative/named state, with synchronized complete source and generated local API. Foundation examples cover all six actual Phosphor weights, existing tokens, arbitrary SVG composition, raw SVG children in Button, keyboard actions and installation ownership. Iconify exploration, system registries, Material Symbols axes and other adapters remain explicit future phases, not claimed tested integrations.

### Executed validation

- `pnpm check` passed: token/API freshness, strict workspace types, 22 React behavioral tests (including five new Icon tests), 25 token tests, 246 complete generated example configurations, and production client/server builds.
- `pnpm package:check` passed using independent packed React/token consumers: declarations, SVG refs, required render and invalid-role/size type errors, named-image SSR, browser bundles, CSS exports and compiled Tailwind utilities. The consumer installed no Lucide, Phosphor or Iconify; the validator asserts both the core dependency list and absence of those installed packages.
- `pnpm format:check` passed. Generated API formatting now preserves the public source spelling for complex imported types, avoiding absolute local node_modules paths in the reference table.
- Frozen dependency installation initially caught an unresolved allowBuilds placeholder for @parcel/watcher. Changed that existing setting to false, retaining the documented prebuilt/no-native-build policy. `pnpm install --frozen-lockfile` then passed; no watcher build script was enabled.
- All browser testing used Codex's in-app browser. Computed dimensions matched 12/16/20/24/32/48px. Lucide retained its 24-unit viewBox and stroke 2, Phosphor its 256-unit viewBox with no forced stroke, and the custom icon its 32-unit viewBox; all rendered at the selected 48px CSS size.
- Verified Phosphor duotone, 48px size, danger color and role=img with label Favorite. All four selected values appeared in the expanded example code. Reset restored Lucide/lg/primary/decorative defaults. The dark preview changed semantic danger from lightness .415 to .825 without changing artwork.
- Keyboard Space activated the favorite action, changed aria-pressed and the action name, and retained a visible focus outline; child SVGs stayed decorative. Default Button and raw SVG icon colors matched their control foregrounds, and their icons measured 16px. Icons had no animation and 0s transitions; no new motion was introduced.
- Main-pane client/scroll widths matched at 320px (272/272), 390px (342/342), and desktop. The 320px size grid also matched 224/224. The outer app stayed at scrollTop 0 with client/scroll heights 844/844 and stationary header.
- Production routes `/docs/foundations/icons` and `/docs/components/icon` returned 200 and referenced a stylesheet returning 200 with icon rules and the 48px token. The foundation's raw server HTML contained 26 Icon SVGs, including eight Phosphor SVGs, with decorative semantics. The default component example also emitted its Lucide SVG before hydration. Production Phosphor switching and named-image behavior were exercised in the browser.
- Evidence is in `output/icons-check.log`, `icons-package-check.log`, `icons-format-check.log`, `icons-ssr-evidence.json`, and `output/in-app-browser/icons-desktop.jpg` / `icons-mobile-dark.jpg`. These remain ignored local evidence.

Concurrent color/surface edits arrived in this shared checkout during the work. Kept those changes; corrected an obvious duplicate neutralColor type member, a missing neutralColorFamilies import, and a stale violet-to-purple assertion whose test already described preserving violet. Restarted the development runners so the metadata watcher picked up its updated source list and generator. The final shared-workspace validation passed after integration.

Manual screen-reader, high-contrast, actual zoom/text-spacing and touch checks remain pending for the new examples. No whole-system accessibility or universal pack compatibility claim is made. Personal exercises in the checklist remain unchecked.

## 2026-10-15 — Radius, border and shadow validation

- `pnpm check` passed token/API freshness, strict workspace types, 25 token tests, 22 React behavioral tests, 246 complete generated examples and production client/server builds. Five token tests cover the new surface contracts; generated examples include 30 surface configurations across light/dark appearances. Portal contract coverage also checks an explicit dialog-radius override and the legacy shadow override.
- `pnpm package:check` passed independent packed React and framework-independent token consumers: declarations, negative type checks, ESM/SSR, browser builds and all three new CSS exports. Existing Tailwind utility validation also passed. `pnpm format:check` passed.
- A fresh production preview rendered the new route in Codex’s in-app browser. Selecting full opened a 342px Dialog inside a 390px viewport with 24px corners, a 1px border and the compiled two-layer overlay shadow; Escape closed it. The browser reported no warnings or errors during this smoke test.
- All interactive browser review used Codex’s in-app browser. Every radius preset was measured on Button, TextField, card and the real Dialog portal: none 0/0/0/0px, sm 4/4/8/12px, md 10/10/12/16px, lg 16/16/16/24px, full capsule/capsule/16/24px. Full panels stay bounded and none makes Dialog square.
- Verified all four semantic border roles, all five shadow roles in both appearances, three densities, RTL action order, keyboard Space activation, Escape dismissal and restored trigger focus. The library focus outline computes to 2px with a 3px offset even with shadow none. Density changes padding to 12/16/20px without changing control height, corner roles, borders or shadow geometry. Reset restores selectors, the input and feedback; selected values appear in the expanded example source.
- Verified desktop and 320/390px mobile reflow. The 320px main pane measured 272/272px client/scroll width; its full-radius comfortable Dialog fit inside the viewport with 24px corners. The 390px main pane measured 342/342px. The reference table intentionally scrolls within its labelled keyboard-focusable region on narrow viewports; its desktop columns now wrap into balanced widths.
- The nested-corner specimen computes 24px outer minus 8px padding and 1px border to a 15px inner radius. A standalone raw-HTML page using compiled public CSS verifies square root, nested full/sm presets, the legacy 6px radius override, independent light/dark resets and semantic border rebinding on a nested neutral-color scope, without React or Tailwind.
- Evidence is saved locally in `output/playwright/surfaces-browser-evidence.json`, `surfaces-standalone-evidence.json`, `surfaces-desktop.png`, `surfaces-card-dark-mobile.png` and `surfaces-dialog-dark-mobile.png`. Check logs are `/tmp/dixy-surface-check.log`, `/tmp/dixy-surface-package.log` and `/tmp/dixy-surface-format.log`. These are review evidence, not durable visual regression baselines.

Shared color/icon development rebuilt package declarations during the longer example validator. The validator now snapshots built public declarations and their package manifests once, including workspace symlink resolution, so one run uses a consistent compiled contract. Docs still consume public package exports. Preserved concurrent work and resolved small overlapping typing/import/old-violet-assertion integration issues. No extra runtime dependency was added for surface tokens.

No surface animation was introduced; the card reports 0s transitions. Actual reduced-motion preference emulation, forced-colors rendering, native 200%/400% zoom, screen-reader and touch review remain untested in this browser pass. Forced-colors token fallback is covered by the generated CSS test. Personal mastery remains unchecked.

## 2026-10-15 — Base UI coverage audit and expansion plan

Compared the installed `@base-ui/react@1.9.0` public exports and [official catalog](https://base-ui.com/react/overview/quick-start) with Dixy's public exports and component implementations. Four of 37 documented families are integrated: Button, Input as TextField, Field and Dialog. Radio and RadioGroup are separate imports within one family. Field.Control/Item and Dialog handle helpers remain missing from our existing wrappers; the docs' Dialog-based mobile drawer is not Base UI Drawer coverage.

Added all 33 remaining families to `DESIGN_ENGINEERING_CHECKLIST.md` in five batches, with per-component token/behavior requirements, existing-contract gaps, utility integration, a shared documentation/validation gate and separate unchecked learning exercises. Reused current typography, color, spacing, sizing, surface, icon and motion foundations; identified new component geometry/alias work rather than assuming it already exists. Checkbox, Switch, Tabs and Tooltip remain the immediate M4 slice.

This change records an audit and plan only; no new component wrappers or runtime exports were added. Validation checks the roadmap against the installed package catalog and formats the two edited Markdown files. Implementation tests and browser interaction checks are reserved for the component changes.

## 2026-10-15 — Color palettes, semantic roles and overlays

The color foundation now covers 39 OKLCH families, each with 12 independently designed light and dark stops: 11 neutral bases and 28 chromatic families. Family coverage follows the current Tailwind and Radix catalogs, including Taupe and Mist. Dixy uses its own role-oriented ramps rather than importing either library's raw values. Separate black/white alpha scales provide 12 stops each, from 5% to 95% opacity.

### Architecture and integration

- `packages/tokens/src/color.ts` is the canonical source for palette families, mode ramps, semantic roles, alpha overlays, custom seeds, helpers and configuration presets. Color roles cover surfaces, text, icons, boundaries/focus, action states, independent feedback and overlay emphasis.
- `scripts/generate-color.mjs` generates palette/semantic CSS, React component aliases and an optional Tailwind v4 `@theme inline` entry. Mode, accent and neutral-boundary aliases resolve locally. Native control color-scheme follows the appearance.
- Theme defaults to blue and exposes `neutralColor` independently of `accentColor`; nested themes and portals carry both. Purple remains the docs identity. Buttons use separate primary/secondary/destructive/success foreground pairs; fields and dialogs consume component aliases of semantic roles. Earlier public CSS names remain read aliases.
- Custom OKLCH seeds reduce chroma at fixed lightness/hue to fit sRGB, round serialized chroma inward, preserve achromatic seeds and reject unsafe common action foregrounds. This policy is deterministic and is not an implementation of CSS's perceptual gamut-mapping algorithm.
- The color page provides appearance/accent/neutral/personality controls, a categorized family browser, 12-stop inspection, alpha previews over a colored checkerboard, semantic mapping tables, and complete CSS/React/Tailwind examples. Theme settings stay aligned with generated playground code.

### Validation

- Seven color-contract tests cover all 936 opaque palette values, serialization/gamut, default/hover/pressed action pairs, readable text, selection, feedback, focus and interactive boundaries across all 39 accents × 11 neutral bases × two modes, seed rejection, achromatic seeds, and 24 alpha stops.
- The workspace check passed, including generated-token/API freshness, strict types, behavioral tests, complete generated examples and production output. The shared checkout also received other foundation/component work during validation.
- The packed-package check passed with a custom brand and neutral base: declarations, ESM/SSR, browser builds, standalone tokens without React, and actual Tailwind v4.3.3 compilation of semantic, primitive and white-overlay utilities.
- In Codex's in-app browser, Blue → Amber with Neutral → Stone changed the primary action and canvas, while destructive and feedback colors stayed equal. Amber uses a dark action foreground; destructive text retains its own foreground. The same invariants passed in dark mode with Mint and Mauve.
- White overlay stops rendered with 5–95% opacity over the checkerboard; keyboard Enter selected the 60% stop. Keyboard selection also inspected a dark Stone stop. Desktop and mobile layouts were reviewed; manual screen-reader, real-device touch, high-contrast and OS reduced-motion reviews were not repeated. The new explorer is static; existing component motion preferences remain in force.

Browser artifacts: `output/playwright/dixy-colors-desktop.jpg`, `dixy-overlays-desktop.jpg`, `dixy-colors-dark.jpg`, and `dixy-neutrals-mobile-dark.jpg`. Validation uses the in-app browser, with no Chrome instance opened for this work.

## 2026-10-15 — Motion contracts, physics and live recipes

Reviewed the rendered Material 3 Expressive [motion physics overview](https://m3.material.io/styles/motion/overview/how-it-works) and [web conversion specs](https://m3.material.io/styles/motion/overview/specs), [Material's Android token definitions](https://raw.githubusercontent.com/material-components/material-components-android/master/lib/java/com/google/android/material/motion/res/values/tokens.xml), [Radix animation lifecycle guidance](https://www.radix-ui.com/primitives/docs/guides/animation), [Apple motion guidance](https://developer.apple.com/design/human-interface-guidelines/motion), and Motion's [transitions](https://motion.dev/docs/react-transitions), [accessibility](https://motion.dev/docs/react-accessibility) and [bundle guidance](https://motion.dev/docs/react-reduce-bundle-size).

M3 Expressive separates spatial and effects springs at three speeds and supports interruption/retargeting. The new foundation adopts that model with Dixy tuning: standard spatial springs use damping ratio 1; expressive spatial springs use 0.8; effects remain at 1. Stiffness is 800/500/280 for spatial motion and 1600/900/400 for effects, with mass 1. Material's fast expressive spatial reference is 800/0.6; the default reference is 380/0.8. Dixy's higher damping on fast motion and firmer default response are deliberate web choices, not claims of native-platform equivalence.

Added the framework-independent `packages/tokens/src/motion.ts` contract, generated public `motion.css`, CSS-reference helpers and Motion-compatible spring/tween helpers. Durations are 0/120/200/280/400ms; JS tweens convert milliseconds to seconds. Spring conversion uses `c = 2ζ√(km)` and leaves velocity to the engine. No duration/bounce is mixed with stiffness/damping/mass. Four bounded easing curves and six semantic transition recipes avoid `transition: all`.

Installed pinned `motion@14.2.0` for docs and development of an optional `@dixy-ui/react/motion` adapter. Motion remains an optional peer and external engine; the root component entry and standalone tokens work without it installed. The adapter places MotionConfig inside the Theme whose preference it follows. The shared hook uses a live matchMedia subscription, removes its listener, and returns reduction during SSR before the client preference is known. `Theme motion="reduced"` is inherited through nested scopes and Dialog portals; children cannot override a reduced ancestor or the OS preference.

CSS feedback, Dialog entrance/exit and the docs sidebar consume shared recipes. Base UI retains ownership of Dialog presence, events, trapping, dismissal and focus restoration; there is no second exit lifecycle around it. Reduced mode zeroes effective CSS timings, removes control/Dialog transforms and stops the spinner. Motion recipes explicitly zero effects and sequencing delays as well. MotionConfig alone is not represented as a universal animation kill switch. Existing duration/ease aliases still resolve; components now consume the explicit motion recipe namespace for customization.

The Motion foundation loads lazily and uses `m` with LazyMotion/domAnimation. Live recipes cover spring retargeting, presence, a three-item finite sequence, four easing comparisons, the actual Dialog and an opt-in loading preview that stops after four seconds and cleans up its timer. Preference changes remount only animation visuals to cancel active motion at the current target; controls stay mounted. Reset also resets comparison/loading state. The rendered preview and copyable complete source share the same demo and selected props.

Added the user's screenshot rules as Dixy guidance: micro-interactions 100–150ms; standard UI 150–250ms; modals/drawers 200–300ms; occasional page transitions 300–400ms. Ordinary UI recipes remain under 300ms, while the explicit `page` recipe is 400ms. Short exits may be faster than the entrance range. Physical settling time is distinguished from fixed timing. The frequency principle recommends no or substantially reduced animation at 100+ encounters/day, standard motion for occasional use and restrained delight for rare/first-time moments. This is a review heuristic, not a universal measured cutoff or an analytics requirement.

### Executed motion validation

- `pnpm check` passed token/API freshness, strict workspace types, 28 token tests, 25 React behavioral tests, 268 complete generated examples (including 22 Motion configurations) and normal-memory production client/server builds. New tests verify unit conversion, spring damping/overshoot constraints, immediate reduction, live OS preference changes, listener cleanup, nested/portal inheritance and static SSR.
- `pnpm package:check` passed independent packed core, token-only and optional-Motion consumers. Core explicitly installs no Motion; optional integration checks declarations, a negative preference type, SSR and a browser build. New CSS export and reduced-motion media rules are asserted. A one-time `node scripts/verify-package.mjs --online` populated the fixed isolated-consumer cache; the required check then passed offline. Vendor Base UI module-directive warnings remain in isolated Vite builds and do not fail the builds.
- All visual/interaction testing used Codex’s in-app browser. Standard motion reached a 120px target without overshooting; expressive slow spatial motion peaked at 121.812px and settled at 120px. Retargeting remained usable without restarting from the initial point. Effects opacity stayed at or below 1. The stagger originally applied a common delay because value-specific transitions replaced it; putting delays on both y/opacity transitions produced visibly distinct progress for all three items.
- Forced reduction snapped the marker to the selected 120px endpoint, then keyboard Space returned it immediately to zero. The Button retained a 2px focus outline and 3px offset. Reduced presence removes its panel immediately; reduced sequence visuals have opacity 1 and no transform. Easing comparisons use the same 400ms duration and show distinct normal progress, while all four become immediate in reduced mode.
- The actual Dialog computed a 200ms entrance, 120ms exit, trapped Tab focus, closed with Escape and restored its trigger. A reduced Dialog computed zero durations and no transform; its portal retained the preference. An opt-in spinner computed `dixy-spin` normally and `none` under reduction while aria-busy stayed true; it subsequently stopped and re-enabled its trigger.
- Desktop main client/scroll widths matched 976/976px. At 320px they matched 272/272px, and the preview matched 224/224px. At 390px they matched 342/342px, with preview 294/294px. RTL movement stayed within the track. The 320px dark reduced Dialog fit between x=24 and x=296. Tables scroll only inside their labelled keyboard-focusable containers where needed.
- Selected sequence/expressive/slow/reduced values appeared in the expanded full example. Copy reported Code copied; the browser-tool clipboard returned an empty string, so clipboard byte equivalence is not claimed. Reset restores the main target, controls and timing-comparison state; loading reset clears its timer. Native preference emulation limitations are recorded below.
- A fresh production preview hydrated the optional Motion integration, rendered the guidance, showed/hid content and applied reduction to the panel. No production-origin browser warnings/errors were reported in that smoke test. Development Motion emits its expected reduced-motion diagnostic when reduction is active, including the conservative hydration phase; it is not an application failure.
- Local evidence is in `output/playwright/motion-*-evidence.json`, desktop/mobile screenshots, and `/tmp/dixy-motion-{check,package,dev,preview}.log`. The Motion foundation client chunk, including engine and source text, measured 116.00kB raw / 39.50kB gzip in this build and is deferred from the initial documentation shell. This is a build measurement, not a network or frame-rate benchmark.

Actual OS media-preference emulation is unavailable through this in-app browser API; the UI reduction preview and live matchMedia unit tests cover the implemented policy. Manual screen-reader, forced-colors, native 200%/400% zoom and physical touch review remain pending. No durable visual regression or frame-rate guarantee is claimed. Personal mastery items remain unchecked.

Concurrent component/theme-playground work arrived in the shared checkout during this pass and was preserved. The full repository formatter reported 46 unformatted files, predominantly that new work; the motion-owned files were formatted and checked separately. Required implementation and package validation passed. No unrelated component implementation was reformatted as part of this task.

Color verification completion: the final workspace check passed 25 React behavioral tests and 268 complete generated examples, alongside the token contracts and production builds. The color explorer had no body or main-pane horizontal overflow at 1440 × 1000, 390 × 844, or 320 × 800. The temporary browser viewport override was reset to the normal in-app pane. The custom-brand packed consumer and semantic/primitive/overlay Tailwind utility checks passed. Additional narrow-screen evidence: `output/playwright/dixy-colors-mobile-320.jpg`.

## 2026-10-15 — Standalone theme playground

Added `/playground` as a top-level TanStack route with its own Dixy header and full-width editing workspace. The root selects the standalone route before mounting DocsShell, so it has no documentation rail, sidebar, breadcrumb or search toolbar. Documentation remains reachable through a header link; Theming links out to the playground. The editor chrome and preview have independent appearances.

The interaction references were [HeroUI Themes](https://heroui.com/en/themes), [Radix Themes Playground](https://www.radix-ui.com/themes/playground) and [shadcn Create](https://ui.shadcn.com/create). The implementation uses the local compiled `@dixy-ui/react` and `@dixy-ui/tokens` exports, without adding a UI stack or router dependency to the library.

### Decisions and behavior

- A versioned, validated preset holds the foundation settings. Four starting points (Dixy, Studio, Grove and Ember) cover different visual personalities. Controls edit named/custom OKLCH accent, neutral family, body/heading fonts, contextual radius, semantic spacing density, card shadow, component border width and motion policy.
- `playgroundThemeProps` is the shared mapping for the real component preview and both appearances of the exported React component. Font and surface overrides live on Theme's style so portaled Dialog content receives the same variables. Controls retain Dixy's established heights and focus treatment.
- JSON presets can be copied and imported. Import validates the complete versioned contract, normalizes to known fields and rejects malformed/out-of-range settings. No arbitrary code or styles are accepted. The copied link records all foundation settings in the URL and restores them after reload.
- Get code exports a complete typed `DixyTheme` wrapper, public imports, selected font imports and both light/dark token maps. Preset JSON is also inspectable and copyable there. The UI explains font dependencies and distinguishes the playground preset format from consumer React code.
- Custom colors use Dixy's canonical sRGB gamut mapping, palette generator and action foreground selection. Unsafe seeds display an explanation and disable copying/export until corrected. The displayed ratio is the minimum for action text across default, hover and pressed states in the selected appearance; it is not a whole-theme accessibility claim.
- Mobile controls reflow into two columns with circular swatches. Jump links move both scroll and keyboard focus between foundations and preview. This route uses immediate scrolling after testing found the shared docs smooth scrolling interfered with jumps. Dark portaled syntax highlighting uses the portal's appearance, and JSON uses an explicit, deferred Shiki grammar.

The important relationship is small:

```tsx
const props = playgroundThemeProps(preset);
<Theme {...props}>{/* real Dixy components */}</Theme>;
// themeReactCode(preset) uses the same mapping for light and dark.
```

### Verification evidence

Five focused tests cover preset/link round trips, malformed and unsupported input, exclusion of arbitrary styles, both custom-color appearances and their action states, independent foundation overrides, and complete React exports typechecked against the built public packages (all four starters plus a custom configuration). The docs test task runs as part of `pnpm check`.

Codex in-app browser evidence:

- Standalone desktop route at 1440 × 1000: no DocsShell/sidebar/rail and matching 1440px main client/scroll widths. Both preview appearances and editor chrome appearances exercised.
- At 320px: body, header and main client/scroll widths all 320/320px; the preview was 286/286px. At 390px: main client/scroll widths 390/390px. Mobile export dialog width 358px, with horizontal scrolling confined to code.
- Grove + full radius + comfortable density + 2px border + flat card depth computed to a capsule control, 16px card corners, 32px card padding, 2px control border and no card shadow. Heading text used the selected serif family.
- Forced reduction computed zero Button transition durations. The portaled Dialog retained dark appearance, reduced motion, serif title and 24px overlay corners. Shift+Tab wrapped inside; Escape closed it and restored Quick look focus.
- Keyboard Enter submitted the sample project form locally. Reset restored the foundation settings and sample input. A Hue arrow-key step updated the persisted value from 155 to 156; sliders have explicit accessible names.
- Copy link matched the current URL. Clipboard preset JSON matched the selected dark/Grove/comfortable/full/reduced/2px/flat values. Imported JSON restored those values, and a reload restored them again. Unsupported version import showed an error. Copied React code contained both appearances and the matching radius, motion and shadow overrides.
- An unsafe custom seed (0.59, 0.14, 155) showed the contrast error and disabled Get code / Copy preset / Copy link. Dark export token text computed to rgb(225, 228, 232) on the dark code surface after correcting portal appearance selection.

Screenshots are saved under ignored `output/playwright/theme-playground-*.jpg`. Actual OS reduced-motion emulation, physical touch, native 200%/400% zoom, forced colors and screen-reader testing remain unverified. Personal learning items remain unchecked. No publishing or package release is included.

Final validation: `pnpm check` passed token/API freshness, workspace types, 28 token tests, 51 React tests, all five playground tests, 345 complete generated examples and production builds. `pnpm package:check` passed independent tarball installation, declarations, SSR, consumer browser builds, CSS exports, standalone tokens, optional Motion and Tailwind utilities. A newly added consumer fixture had its expected-error comment above a multiline JSX declaration instead of the failing callback property; moved the directive directly into the callback so the intended negative typing check still runs. No component behavior was changed by that fixture correction.

Production smoke test at localhost:3015 verified standalone layout, preset switching, copying, the real Dialog and the header link back to the unchanged documentation shell. No production browser errors or warnings were reported. Focused formatting checks passed. Temporary viewport overrides were reset after capturing the final evidence.

## Component preview appearance fix — 2026-10-15

The component playground initialized and reset its nested Theme to light even when DocsShell was dark. It now initializes from `useDocsAppearance`, follows subsequent docs appearance changes, and resets to the current docs appearance. The local preview toggle still supports comparisons; the caption and complete copied example use the same appearance state.

Codex in-app browser checks covered Tooltip light/dark switching, local appearance overrides, reset in dark docs, keyboard theme/reset controls, dark navigation to Button and back, and matching `appearance="dark"` in the code panel. At 390px, the dark preview remained dark and main client/scroll widths matched at 342px. Temporary viewport overrides were reset. Evidence is saved in `output/playwright/dixy-preview-theme-evidence.json`, `dixy-preview-dark-fixed.jpg` and `dixy-preview-dark-mobile.jpg`. No browser errors or warnings were reported after reloading the rebuilt development packages. This docs-only change does not alter library theme contracts; screen-reader and OS reduced-motion testing were not repeated.

Validation: focused Prettier check and `pnpm check` passed, including token/API freshness, workspace types, existing behavior tests, complete generated examples and production builds.

## Foundation preview appearance sync — 2026-10-15

Color and Theming no longer initialize their preview appearance to light. They initialize from the docs appearance context and follow subsequent app theme changes, matching the component playground behavior. Only appearance is synchronized: the selected brand, neutral, personality and radius remain intact. Local appearance controls still support comparisons, and an app appearance change restores the preview to the app setting. Color's semantic preview, palette explorer, mapping table and usage code share the same appearance state.

Codex in-app browser verification covered initial light rendering, dark app changes, dark entry after navigation, local light comparisons followed by app theme changes, preserved Amber/lg theming settings and Mint/Stone/custom color settings, and matching dark code examples. At 390px, both foundation pages rendered dark previews with main client/scroll widths of 342/342px; app theme changes also worked with keyboard Enter. Browser logs reported no errors or warnings. Temporary viewport overrides were reset. Evidence: `output/playwright/dixy-foundation-theme-evidence.json`, `dixy-theming-follows-dark.jpg`, `dixy-color-follows-dark.jpg` and `dixy-color-follows-dark-mobile.jpg`.

Validation: `pnpm check` passed freshness checks, workspace types, 28 token tests, 52 React tests, five playground tests, 345 complete generated examples and production builds. Focused formatting passed. No public library or CSS contract changed. Screen-reader and actual OS reduced-motion checks were not repeated for this state synchronization change.

## Remember app appearance — 2026-10-15

The app appearance now lives in a provider above routed content. Explicit app theme changes save a one-year `dixy-appearance` cookie scoped to `/` with SameSite=Lax and Secure on HTTPS. The root loader reads and validates that cookie through a TanStack Start server function, then supplies the same initial value to SSR and hydration. Missing or unsupported values retain the light default. Cookie write failures leave appearance switching usable for the current visit. The loader remains fresh for client navigation; the provider retains the current choice across docs and the standalone editor.

DocsShell and the standalone playground chrome share this app setting. Local docs preview comparisons do not save an app preference. The standalone preview still uses its versioned URL preset independently. The SSR approach follows [TanStack's guidance for consistent preference hydration](https://tanstack.com/start/latest/docs/framework/react/guide/hydration-errors).

Verification: direct HTTP responses returned matching app/preview appearances before hydration for absent, dark, light and invalid cookies. Codex in-app browser verified dark Theming refreshes, local comparison followed by refresh, dark Color and Tooltip refreshes, standalone chrome preference/return navigation, and keyboard light/dark choices followed by refresh at 390px. Mobile main client/scroll widths were 342/342px, with a dark component preview after reload. No browser errors or hydration warnings were reported. Viewport overrides were reset. Evidence is in `output/playwright/dixy-theme-server-evidence.json`, `dixy-theme-persistence-evidence.json` and `dixy-theme-persisted-dark.jpg`.

`pnpm check` passed workspace types, token/API freshness, 28 token tests, 52 React tests, seven docs tests, 348 complete generated examples and production builds. Focused formatting and a final docs typecheck passed. No public library/CSS contract changed. Actual blocked-cookie environments, physical touch, screen readers and OS reduced motion were not exercised for this preference change.

## Remember shared preview themes — 2026-10-15

Component, Color and Theming pages now read one saved preview theme from the root preference provider. Accent, neutral, radius, density, motion, direction, explicit preview appearance and Color personality are stored in a separate versioned `dixy-preview-theme` cookie. The root server function restores both app and preview preferences before rendering, with the same values supplied to hydration. The bounded parser accepts known public token choices, rejects unsupported versions and ignores unknown fields; malformed values fall back safely. Individual color-axis changes mark a named personality custom when its preset no longer matches.

Preview appearance follows the app by default. An explicit local comparison now survives navigation and refresh; changing the app appearance restores following the app while retaining the other preview settings. Component-specific props, interaction state and event output remain local to each example. The existing Reset action clears the example and saves shared theme defaults; its tooltip and Theme settings note explain that scope. Theming exposes the saved neutral base, and all three pages keep rendered themes and copied code aligned. The palette explorer receives the same appearance, accent, neutral, radius, density, motion and direction. The standalone editor retains its separate versioned URL preset.

Verification:

- Three model tests cover complete saved-setting round trips, malformed/oversized/unsupported cookies, unknown-field exclusion and named-personality coherence.
- Direct HTTP checks confirm all seven rendered Theme attributes for saved settings, explicit light comparison with a dark app, unsupported versions and invalid individual fields before hydration.
- Codex in-app browser: Cyan/Stone/full/compact/reduced/RTL chosen on Switch persisted on Button navigation and refresh; Theming and Color shared those settings. Copied component code matched all six controls. Color personality and local appearance survived refresh; app appearance changes retained other settings and restored app following. Reset saved defaults and cleared the disabled example prop.
- At 390px, saved Mint/Stone preferences survived component refresh. Main client/scroll widths matched at 342/342px; Theming's four-control toolbar matched at 296/296px. Keyboard Enter opened the theme disclosure. Native select arrow-key attempts did not change the committed radius through this automation path, so that selection path remains unverified; select-option changes and their persistence were verified. A subsequent Theming refresh retained Mint/Stone/lg. Temporary viewport overrides were reset, and test-only theme choices were restored to defaults afterward.
- Final `pnpm check` passed token/API freshness, workspace types, 28 token tests, 58 React tests, ten docs tests (including the three new preference tests), 380 complete generated examples and production builds. Focused formatting passed. No browser errors or warnings were reported.

Evidence: `output/playwright/dixy-preview-settings-evidence.json`, `dixy-preview-settings-server-evidence.json` and `dixy-preview-settings-persisted.jpg`; command log `/private/tmp/dixy-preview-settings-final-check.log`. No public library/CSS contracts changed. Cookie-blocked environments, physical touch, screen readers, actual OS reduction and cross-browser selection behavior were not exercised for this docs preference change. Personal mastery remains unchecked.

## 2026-10-15 — Complete Base UI family expansion

Added all 33 remaining documented component families from the installed `@base-ui/react@1.9.0`. Together with Button, Input as TextField, Field and Dialog, Dixy now exposes all 37 families (38 component modules because Radio/RadioGroup are separate). Preserved complete compound namespaces and helpers instead of exporting just the demo parts. Added Field.Control/Item with input/item styles and the existing Dialog handle helpers. Stable DirectionProvider, CSPProvider, mergeProps and useRender utilities are public; unstable/internal modules remain excluded.

### Decisions and implementation

- New wrappers preserve the exact upstream type, including generic values. The shared styledPrimitive utility merges state-based className callbacks and forwards every other prop, including React 19 refs, render composition and events. It adds no DOM node. Explicit namespace types keep packed declarations small and retain helper signatures.
- Popup Portal wrappers restore ThemeScope. Theme coordinates explicit ltr/rtl with Base UI's direction provider and reapplies DOM direction inside portals. Color, font, spacing, density, radius, custom properties and inherited motion follow the same boundary.
- Shared CSS recipes consume Dixy's semantic color, typography, spacing, control/icon/target sizing, radius, border, focus, shadow and motion tokens. New aliases cover marks, switch tracks/thumbs, sliders, avatars, scrollbars, popup surfaces and overlay layers. Visible marks and activation targets are separate. Disabled choices use semantic disabled colors. Base UI retains positioning, presence, validation and gesture state; its dynamic CSS variables remain intact.
- Added 33 lazy complete demo modules plus a dedicated Field page, bringing the component documentation to 39 pages including Icon/Typography. Each page includes a focused playground, relevant example controls, copied source, API/accessibility notes, token guidance and lazy implementation source. Theme controls now cover density, motion and direction as well as appearance/accent/neutral/radius, and reset/code stay synchronized.
- Generated per-family part/prop metadata comes from the local public TypeScript types and installed primitive declarations, including required flags, descriptions and defaults. Native HTML props are described as forwarded. References load per page; RadioGroup also documents Radio's separate parts.
- Controlled Checkbox/Switch examples expose state. Tabs and Tooltip demonstrate their real compound contracts. Autocomplete, Combobox and Select remain distinct; Progress and Meter retain different semantics. OTP Field uses a real first-input label. Base UI 1.9 Tooltip follows its current visual-hint guidance, with an independently named trigger.
- Production review found that the checkmark text could enter a nested checkbox label's accessible name. Marked the decorative indicators aria-hidden in examples and added a regression test for a stable accessible name after selection.

### Distribution and bundle lesson

The first packed consumer retained unused family namespaces. Marking individual style-factory calls pure was insufficient: object spreads could still retain namespaces. Each compound family's pure construction now wraps the whole namespace object; the function only constructs wrappers and has no external effect. The same independent consumer decreased from 706.79kB to 308.76kB JavaScript (227.11kB to 98.45kB gzip). The package verifier now asserts that unused Combobox, Drawer, OTP Field and Toast class strings do not survive in that consumer's JS, while their styles remain available in the shared stylesheet.

Explicit object generics are tested against packed declarations. Select's label catalog requires label/value entries; an arbitrary array of application objects is not that catalog. The consumer verifies positive generic callbacks and expected type failures without weakening the public types.

### Verification and limits

- The React suite now contains 52 tests, including 27 new coverage/behavior tests for public-family parity, controlled/mixed/disabled choices, refs/composition, form values, stable names, Switch, Tabs/RTL, tooltip theme propagation/dismissal, group selection, disclosures, number bounds, Slider keyboard steps, Progress/Meter, Form validation, OTP paste, Avatar/ScrollArea, popup lifecycle/focus restoration, Menu, Select, filtered inputs, Toast and deterministic SSR.
- jsdom lacks Web Animations; the test environment supplies the no-animation getAnimations path. Existing motion focus-restoration assertions now wait for completion rather than assuming synchronous unmount. Browser tests exercise actual styled behavior.
- `pnpm package:check` passed independent installs, all family/utility exports, declarations and negative cases, ESM/SSR, browser builds, standalone tokens, optional Motion, no core icon-pack/Motion requirement, CSS and compiled Tailwind utilities. The verifier includes the new tree-shaking guard.
- Codex in-app browser smoke-tested every new default playground at 1280px desktop and 390px mobile: no preview errors, no document or preview horizontal overflow. Main client/scroll width was 976/976px on desktop and 342/342px on mobile; mobile preview width was 294/294px.
- Browser interaction checks covered Checkbox keyboard/mixed state, Switch keyboard/dark appearance, Tabs selection/RTL/reduced-motion settings, Tooltip focus/Escape, Drawer bounds/dismissal, Combobox filtering, Menubar keyboard action and mobile Toast lifecycle. At 390px the Toast was 326px wide at x=32 and stayed within the viewport.
- Built production route checks returned 200 with correct titles for all 39 component pages and 404 for an unknown family. Final post-fix production browser verification and full command results are recorded below.
- Evidence lives in `output/in-app-browser/components-desktop-evidence.json`, `components-mobile-evidence.json`, `components-checkbox-desktop.jpg`, `components-switch-mobile-dark.jpg`, `output/components-production-evidence.json` and `/tmp/dixy-all-components-{check,package,format}.log`. These are local review artifacts, not durable visual baselines.

The docs build still reports a shared component chunk above Vite's 500kB warning threshold; consumers can tree-shake unused families, but the docs shared-chunk strategy remains a performance follow-up. Advanced chips/submenus/detached triggers, nested/snap-point drawers, all-direction gesture physics, toast stacking/anchoring, native touch, screen readers, forced colors, actual zoom and complete appearance/density/radius/motion matrices need further review. Public family/part coverage is complete; this is an alpha implementation, not universal accessibility certification. Personal mastery remains unchecked. Learning explanations and snippets are in `docs/LEARNING_NOTES.md` section 11.

Final results for this expansion: `pnpm check` passed generated-token/API freshness, strict workspace types, 28 token tests, 52 React tests, five documentation tests, 345 complete generated examples and production client/server builds. `pnpm package:check` and `pnpm format:check` passed. The final production server returned all 39 component routes and the compiled stylesheet successfully, with 404 for an unknown component.

Post-fix production browser review confirmed Checkbox's exact accessible name remains Product updates in mixed state. The copied complete example contained `indeterminate = true`; Reset restored false in both source and preview. RadioGroup loads both its own and Radio's part references. Field's invalid control exposes its recovery message. No console warnings/errors appeared in that production interaction check. A 320px development Checkbox view measured main 272/272px and preview 224/224px. All browser work used Codex's in-app browser.

## 2026-10-15 — Preview the whole Dixy library

Expanded the standalone theme playground with a library gallery beneath the application preview and accent scale. It contains 41 live previews: all 39 registered documentation examples plus dedicated IconButton and Container/Stack/Inline examples. Theme provides the shared scope; nonvisual providers and utilities do not need separate visual cards.

The catalogue derives its loaders and initial example props from the existing component registry, so new documented families enter the gallery automatically. It reuses the actual examples rather than maintaining a second set of component compositions. No raw example source or generated API files are loaded for this gallery, and no dependency or public library API was added.

- Search accepts component names and compound member names; category filtering and an empty-result recovery action keep the full catalogue usable. All components are included by default.
- Foundation controls and the preview appearance toolbar remain visible while browsing on desktop. The toolbar's library link returns to the gallery search. Mobile provides explicit links between foundations and the gallery, moving focus with the scroll.
- Examples load near the viewport in the intentional main scroll region, with a keyboard-operable load fallback. Visible newly filtered cards also check their initial geometry, avoiding an empty card while an observer waits after a large reflow. Independent Suspense/error boundaries keep an individual example failure from replacing the editor. Retry creates a fresh lazy wrapper.
- Every example sits inside the same preview Theme, including custom-property overrides. Popup, drawer and toast portals use the library's existing scope propagation. Example interactions are preserved when foundation settings change; Reset remounts the entire preview, clearing gallery filters and local example state together.
- The search label is explicit and remains stable when its clear button appears. Group headings, individual preview headings, result counts and documentation links have accessible names. The shared foundation editor remains the only theme control surface.

The architectural relationship is:

```tsx
<Theme {...playgroundThemeProps(preset)}>
  <PreviewContents />
  <ThemeComponentGallery onEditFoundations={returnToFoundations} />
</Theme>
```

Two new tests guard against omitting any public visual export or documented family, and verify combined search/category filtering and compound member searches. They run alongside the five existing preset/export tests. The two supplementary demo files are included in the docs' strict typecheck against compiled package exports.

Codex in-app browser checks rendered all 41 previews on desktop and at 390px without error boundaries or horizontal overflow in any card. After loading every example, resizing to 320px also produced no overflowing cards: main client/scroll widths were 320/320px; the 390px main was 390/390px. The desktop main was 1440/1440px. Loading progressed through the whole catalogue during normal PageDown browsing, ending with 41 loaded cards and no placeholders.

Interaction checks covered Checkbox with keyboard Space; category filtering (four Navigation previews); Tabs via ArrowRight and Enter with Activity selected; Select's team option; IconButton's favorite pressed state; the empty search and Show all recovery; mobile focus restoration to foundations; and full Reset restoring all 41 entries, empty search, All components and the light starter. Select's popup and Toast retained dark appearance, jade accent, reduced motion and 24px overlay corners under Grove. The notification was rendered in its real portal. Existing snapshot/clipboard/export tests remain in place for the unchanged theme mapping.

A concurrent app appearance-provider change arrived during browser review and was preserved; the development HMR context error cleared on a full reload. Fresh production verification is recorded below. Physical touch, native zoom, forced colors, screen readers, OS preference emulation, all permutations of every component's states and advanced nested popup/drawer combinations remain unverified. This work establishes gallery coverage, not universal accessibility compliance or personal mastery.

Final gallery validation: a fresh `pnpm check` passed token/API freshness, strict workspace types, 28 token tests, 58 React tests, seven docs tests, complete example typechecks and production builds. `pnpm package:check` and focused Prettier checks passed. The build's existing shared-chunk size warning remains a separate docs performance follow-up.

The built application at localhost:3015 rendered all 41 gallery cards with its sticky toolbar, filtered Select correctly and opened its real popup. The 390px dark/reduced Select popup was 286px wide, and the main remained 390/390px. A focused search input remained visible below the sticky toolbar. Evidence: `output/playwright/theme-gallery-desktop.jpg`, `theme-gallery-mobile-dark.jpg` and `theme-gallery-evidence.json`. Temporary viewport overrides were reset after review. The standalone route and existing theme export format are retained; the library still has no dependency on the docs or router.

## Applied component motion — 2026-10-15

Buttons, Dialog/AlertDialog, Drawer, Menu (including ContextMenu, Menubar and NavigationMenu parts) and Tabs now consume generated component motion aliases. The public `componentMotion` map assigns shared semantic recipes: 120ms feedback; 200ms dialog/menu entrance and tab indicator; 280ms drawer entrance; 120ms exit. The motion generator writes both foundation and component aliases, and freshness checks cover both. Progress has a separate public 700ms `motionLoops.progress` cadence, keeping functional loading separate from finite UI-duration guidance.

A dedicated stylesheet owns the five families' explicit property transitions. Reduced motion sets timings and decorative spatial amplitude to zero; it removes press travel, popup scale and entrance travel while retaining final tab-indicator coordinates, signed drawer snap offsets and pointer movement. Drawer release timing follows Base UI's swipe-strength variable and pointer tracking has no interpolation lag. Left/right edges use physical alignment, matching Base UI's swipeDirection in RTL. Tab lists stay on one line with local overflow so their indicator cannot detach from wrapped rows; the indicator uses Base UI's physical left/top coordinates in RTL. Panel content changes immediately.

Base UI retains refs, events, keyboard navigation, focus and presence ownership. CSS uses its starting/ending/swiping attributes rather than adding a competing AnimatePresence wrapper. Existing controls remain independent of the optional Motion engine; custom spring compositions still use the established Motion integration. The implementation was checked against the installed Base UI 1.9.0 contracts and its [animation handbook](https://base-ui.com/react/handbook/animation), [Drawer](https://base-ui.com/react/components/drawer) and [Tabs](https://base-ui.com/react/components/tabs) references.

The Motion foundation includes a new complete composed example at `/docs/foundations/motion#component-motion`, with system/reduced motion, four drawer edges, horizontal/vertical tabs, RTL and reset controls. Preview, exported source and source-derived recipe table stay aligned. The ordinary Tabs example now renders an Indicator; the Drawer component playground exposes all four edges. No component wrapper event contract changed.

Verification:

- `pnpm check` passed freshness, workspace types, 28 token tests, 58 React tests, seven docs tests, 380 complete generated examples and production builds. This change adds six behavioral tests: changing motion on an open Dialog/Drawer retains the input, ref, value and focus; Menu keyboard action/disabled-item behavior and vertical RTL Tabs activation hold in both modes. Base UI deliberately permits focus on disabled tabs while preventing activation, which the tests preserve.
- Thirty-two additional complete composed examples cover every drawer edge, both motion modes, both orientations, light/dark and representative RTL. Packed ESM assertions validate public component assignments against bounded foundation recipes, while independent CSS checks cover all five alias families and the spatial/progress tokens.
- `pnpm package:check` passed isolated tarball installation, declarations, ESM/SSR, browser builds, standalone tokens, optional Motion and Tailwind utilities. Core consumers still do not require Motion. Focused Prettier checks passed. Existing Vite shared-chunk and Motion module-directive warnings remain informational.
- Codex's in-app browser verified normal computed durations (button 120ms; dialog/menu/indicator 200ms; drawer 280ms), 120ms dialog/drawer/settled-menu exits, and zero-duration reduced transitions. Reduction removes decorative transforms; the tab indicator retains its selected target transform.
- All four physical drawer edges fit at 1280px in both modes, Escape restores trigger focus, and left/right edges stay physical under RTL. Native pointer drag dismissed the right drawer in normal and reduced RTL modes. A reduced bottom drawer fit at 390px (x=0, width=390px, y=664px, height=180px in an 844px viewport).
- Keyboard review covered button Space activation, Dialog focus wrapping/Escape/restoration, Menu selection/Escape/restoration, and horizontal/vertical Tabs in LTR/RTL in both modes. The loading button exposes aria-busy and disables activation; its spinner computes to 0.7s normally and animation-name none with reduction. Clearing disabled/loading restores Space activation.
- Dark mobile 390px and 320px checks exercised buttons, dialogs, menus and tab selection in both modes. Main client/scroll widths matched at 342/342px and 272/272px; preview widths matched at 294/294px and 224/224px. Light 320px also fit. The recipe table scrolls within its own focusable region. Complete copied source reflected dark, reduced, vertical and RTL controls; keyboard reset restored defaults and example state.
- A separate production preview verified all five families in both modes, plus AlertDialog (200ms/0ms) and Menubar's shared menu recipe. No production browser warnings/errors were reported. Temporary tabs/server and viewport overrides were cleaned up; development port 3000 remains available.

Evidence: `output/playwright/dixy-component-motion-evidence.json`, `dixy-component-motion-desktop.jpg`, `dixy-component-motion-mobile.jpg`; command logs at `/tmp/dixy-applied-motion-{check,package,format}.log`. These are local review artifacts, not durable visual regression baselines.

Actual OS reduced-motion media switching was unavailable in the browser capabilities; explicit inherited Theme reduction was tested in-browser and the live media subscription remains unit-tested. Physical touch, every swipe direction/velocity, nested and snap-point drawer gestures, every advanced submenu/navigation composition, screen readers, forced colors, zoom and cross-browser review remain unverified. Snap-offset variables are preserved by implementation but were not exercised in a snap-point browser fixture. Personal mastery remains unchecked.

## Expressive foundations research and architecture plan — 2026-10-15

The user selected research, recommendation and a concrete architecture plan before implementation. `docs/EXPRESSIVE_FOUNDATIONS_PLAN.md` compares Open Props, pattern.css, Hero Patterns, css-doodle, Textures.js, liquid-glass-react and liquidGL using their primary documentation and repositories. It links Apple's public design/API/performance guidance, distinguishes native Liquid Glass from CSS frosted glass, and proposes extending Dixy's existing surface and motion contracts.

The recommended first slice is optional static CSS materials with no material runtime loop, followed by semantic shapes/personality presets, a measured backdrop pilot and optional feedback adapters. The plan specifies package ownership, separate CSS emission, Theme/portal propagation, fallback and contrast rules, proposed byte/layer budgets and a repeatable performance/device validation procedure. Proposed limits are targets, not benchmark results.

Only this plan, the checklist and this log changed. No dependency, generated metadata, public export, component implementation or CSS changed. Implementation checks and in-app visual/device testing are not applicable to this documentation-only pass. The new foundation implementation and personal learning items remain unchecked. `pnpm exec prettier --check docs/EXPRESSIVE_FOUNDATIONS_PLAN.md DESIGN_ENGINEERING_CHECKLIST.md docs/BUILD_LOG.md` passed; seven referenced existing source/document paths were verified on disk.

## Expressive foundations implementation — 2026-10-15

Implemented the architecture plan with original Dixy CSS recipes and no new rendering dependency or third-party texture assets. `packages/tokens/src/materials.ts`, `shapes.ts`, `personalities.ts` and `feedback.ts` are the canonical contracts. `scripts/generate-materials.mjs` generates semantic shape CSS and optional material/backdrop recipes, participates in freshness checking and emits standalone token CSS. The React build emits `materials.css` and `backdrop-pilot.css` as independent assets and watches their generated sources. Core `styles.css` does not import them.

The five static finishes are matte, glossy enamel, soft clay, brushed metal and paper. Paper and metal use small CSS patterns, so texture transfer is zero. The React material pack is 3,560 bytes raw / 801 bytes gzip; the separate backdrop pilot is 1,403 / 473 bytes. Solid/soft button finishes use 3px edge bands so the semantic label background stays stable. Outline, ghost and disabled controls keep their existing treatment. Box uses the full material surface with semantic foreground/border and shared depth. The contrast test covers primary text against the recipe shade extremes in both appearances and all 11 neutral families; the lowest observed ratio was approximately 7.53:1. Custom colors, arbitrary foreground overrides and every possible nested text treatment are outside that assertion.

Box was proposed but absent from the existing library, so it is a new native/ref-preserving layout surface. Shape is separate decorative SVG artwork; a label makes it meaningful, otherwise it is hidden from assistive technology. Interactive content is never clipped to an expressive path. Rounded/pill/square geometry reuses contextual radius tokens, keeping pill panels rectangular. Theme personalities coordinate material, geometry, radius, finite press distance and the optional spring scheme without changing status colors. Explicit settings override the relevant defaults; reduced effects/motion remain inherited. Tests change a personality/effects policy on an open portal and verify that the existing input, value and focus survive.

`@dixy-ui/react/feedback` emits a separate optional adapter API. Default output is no-op, enabling requires an explicit preference, missing adapters do nothing, and disabled ancestors or reduced motion/effects suppress output. Synchronous exceptions and rejected adapter promises do not interrupt actions. The short vibration adapter is a best-effort browser fallback, not native Core Haptics. Core consumers still need no Motion or feedback import.

Shape, Materials, Emotion and Haptics have lazy foundation routes with local API metadata and complete source-derived examples. The Button playground adds material and shape controls; the whole-library layout example now includes Box and Shape. Reset remounts example state. Mobile review caught an overflowing controls row and a select synchronization issue; controls now wrap and capture event values before deferred state updates. In-app clipboard acknowledgement and readback verified that a changed paper finish appeared in the complete copied source with the optional stylesheet import.

The Materials comparison loads the backdrop CSS only on explicit selection or sampling. It uses one small 8px frosted toolbar with opaque label backings, an opaque fallback and preference overrides. Sampling runs three two-second phases, cancels animation frames/listeners on stop/unmount/reduction, and returns to flat mode. It is not liquid refraction. The Motion foundation includes a separate docs-only three-control press experiment. Persistent Base UI toggle selection is independent of `:active`; a 15% flex-grow change redistributes width only at container widths of at least 352px. This does layout work and is not applied to default library controls. Its copied source includes its CSS.

Verification completed before the final production smoke pass:

- `pnpm check` passed token/API freshness, workspace types, 31 token tests, 66 React tests, 10 docs tests, 462 complete source-derived examples and production builds. Eight added React tests cover contracts, SSR, portal preference changes and optional feedback; three token tests cover valid preset references, CSS budget/isolation and contrast extremes.
- Isolated package verification passed core, token-only, optional Motion and new expressive consumers: declarations (including negative material/shape/personality cases), packed ESM/SSR, browser builds and CSS export boundaries. Core consumer CSS excludes material variables and the backdrop pilot. The new expressive consumer does not install Motion. The core consumer output is 310.00 kB JS / 98.91 kB gzip; this is a fixture measurement, not a whole-docs performance score.
- The first offline package check lacked a cached `rolldown@1.2.14` tarball. Running the existing verifier with `--online` populated the cache and passed; no workspace dependency was added. Subsequent final command results are recorded below.
- In-app browser main/preview client and scroll widths matched at 342/342px and 294/294px for all four pages at 390px; at 320px they matched 272/272px and 224/224px. Light desktop pages also fit. Geometry computed to 10px / 9999px / 0px, with independently labelled clover artwork. All five materials, disabled/loading guards, keyboard Space, portal Escape/focus restoration, dark/reduced portal settings and opaque glass reduction were exercised.
- A held desktop group press changed equal ~257.33px controls to ~246.31 / 279.37 / 246.32px. Reduction restored equal widths, flex-grow 1 and zero-duration transitions. The narrow 320px case fit without expansion. Selection continued to use Base UI keyboard behavior.
- Development in-app frame samples at 1280×720 reported p95 intervals of 10.2 / 10.3 / 10.3ms for flat/static/backdrop, with no interval over 20ms. A 390×844 browser viewport reported 9.3 / 9.2 / 9.3ms, also with none over 20ms. The backdrop sample computed `blur(8px)` and other modes `none`. These are finite browser-session frame intervals, not isolated GPU traces or physical mobile/energy results. The desktop toolbar occupied about 1.7% of the tested viewport.

A development package rebuild invalidated the existing app-appearance Fast Refresh context; a full reload restored the page. Final production review uses a fresh preview without HMR. Browser evidence is saved under `output/in-app-browser/expressive/`; command logs use `/tmp/dixy-expressive-*.log`.

Safari/iOS, Firefox, physical touch/Android hardware, native media preference switching, actual forced colors, native zoom, screen readers, texture failure on an image-based pack, GPU memory and real-device energy/thermal behavior remain unverified. There are no image assets in this pack. Glass and connected-group expansion remain explicitly experimental; the wider-device profiling checklist item and all personal learning items remain unchecked. Existing docs shared-chunk size and Motion directive warnings remain separate follow-ups.

Final verification after the control fixes and formatting:

- `pnpm check`, `pnpm package:check` (offline after populating the missing tarball), and `pnpm format:check` all passed. Final totals remain 31 token tests, 66 React tests, 10 docs tests and 462 complete generated examples.
- A fresh production preview at `http://127.0.0.1:3016` rendered all four new routes without browser warnings/errors. Paper/square controls and keyboard activation produced matching rendered attributes and status feedback. The production comparison reported p95 intervals of 10.1 / 10.1 / 10.3ms for flat/static/backdrop, with no interval over 20ms and `blur(8px)` only in the backdrop phase.
- The production 390px dark dialog was 342px wide and inherited reduced effects and motion. Escape closed it; Reset restored the specimen. Temporary viewport overrides were removed and app appearance restored to light. The verified production Materials tab remains available for review.
- Evidence: `output/in-app-browser/expressive/evidence.json`, `materials-production-desktop.png`, `materials-production-mobile-dark.png` and the earlier mobile screenshot. Command logs: `/tmp/dixy-expressive-final-{check,package,format}.log`. These are local evidence artifacts; wider browser/hardware and energy validation remains outstanding as listed above.

## Checkbox alignment and feedback motion — 2026-10-15

The checked and indeterminate marks previously used font glyphs inside a 16px indicator with a 20px line height. The indicator box was centered, but glyph metrics made its visible artwork unreliable. `Checkbox.Indicator` now supplies decorative SVG check/mixed paths in a shared 16×16 viewBox when children are omitted. Both paths' bounding centers match the control center. Custom children, explicit null, refs, state class callbacks, render composition and keepMounted retain the Base UI contract. The indicator line height is normalized for custom content; no positional pixel offset is needed.

The public componentMotion map assigns checkbox feedback and indicator phases to the shared 120ms feedback recipe with standard easing. Color/border feedback, finite indicator opacity/scale, and checked/mixed crossfades use generated aliases. Base UI owns mount/unmount and starting/ending attributes; unchecked keepMounted indicators become invisible. Theme and OS reduction use the existing zero-duration/spatial-factor policy. No dependency, imperative animation, recurring timer, spring overshoot or rendering loop was added. Checkbox and Checkbox Group demos, copied examples, README and the packed consumer use the default artwork.

Verification:

- `pnpm check` passed token/API freshness, workspace types, 31 token tests, 68 React tests, 10 docs tests, 462 complete generated examples and production builds. New regressions cover Indicator ref/render/custom children/null/keepMounted and preservation of selection, focus and indicator identity across motion preference changes. Existing keyboard, form value, disabled and accessible-name tests now exercise the default marks.
- `pnpm package:check` passed isolated tarball installation, declarations, ESM/SSR and browser/CSS consumers. Packed SSR renders the decorative SVG, and packed CSS includes the generated checkbox motion aliases. Core consumers still do not require Motion. `pnpm format:check` passed before this evidence entry; focused formatting was repeated for the two updated evidence files.
- Codex's in-app browser measured matching root, SVG and visible-path centers in checked/mixed states, including fractional coordinates and an entering 0.8 scale. Normal indicator/background transitions compute to 0.12s with cubic-bezier(0.2, 0.8, 0.2, 1); Theme reduction computes to 0s and removes spatial scaling. Unchecking removes the indicator after Base UI presence completes; Space preserves focus and updates state.
- Light/dark, LTR/RTL, desktop, 390px and 320px were reviewed. At 390px the main/preview widths were 342/294px, each matching its scroll width; at 320px they were 272/224px. The checkbox and marks fit. The existing compact property row can clip its Indeterminate control at 320px; this docs layout limitation is separate from indicator alignment. Disabled/mixed semantics remained intact; disabled activation remains covered by the component test.
- A restarted production preview at port 3016 verified checked/mixed artwork, 120ms and reduced motion, plus synchronized complete copied code. No production-origin warnings/errors were reported. The existing development Fast Refresh app-appearance context error recurred when rebuilding the package; a full reload restored development, and production review was unaffected. Saved preview preferences were restored and temporary viewport overrides reset.

Evidence: `output/in-app-browser/checkbox/geometry.json`, `desktop-light-checked.png`, `desktop-light-mixed.png`, `mobile-dark-mixed.png` and `checkbox-playground.png`. Command logs: `/tmp/dixy-checkbox-{check,package,format}.log`. Screenshots and DOM measurements are local review evidence, not durable visual regression baselines. Native OS preference switching, Safari/Firefox, physical touch, forced colors, zoom and screen-reader review were not performed in this pass. Personal learning remains unchecked.

## Switch variants, comparison examples and API padding — 2026-10-15

Switch now adds a typed visual API to the existing Base UI compound parts. Root supports sm/md/lg, solid/soft/outline, accent/neutral/danger/success, five radius presets and all five static materials. Radius and material inherit Theme unless overridden. Thumb accepts decorative checkedIcon and uncheckedIcon elements; custom children, including null, take precedence. Refs, inputRef, render composition, state classes, controlled/uncontrolled values, form submission, readOnly and disabled behavior remain with Base UI. No icon pack or animation dependency was added.

Track dimensions are 32×20, 40×24 and 48×28px, with 16/20/24px thumbs and a 2px inset at the standard root size. The density-aware interaction target can exceed the visual track. Semantic foregrounds keep the thumb and artwork distinct from the track. Track feedback, thumb movement and icon opacity use generated 120ms feedback aliases; reduced motion changes immediately while retaining the selected position. Materials style the track pseudo-element from the optional pack, which measures 896 bytes gzip and requests no texture assets. Disabled, reduced-effects and system contrast/transparency fallbacks remove decorative finishes.

The in-app browser was used to inspect [HeroUI's switch](https://heroui.com/en/docs/react/components/switch) and compare its live size and icon examples; [Radix's reference](https://www.radix-ui.com/themes/docs/components/switch) informed independent variant/color/radius controls. Dixy retains its own primitives, shirt sizes, tokens and contracts. The primary playground has nine aligned controls, a linked description and icon choices. Its desktop property panel is bounded; mobile uses a two-column control grid and wraps the toolbar at narrow widths. API table cells now have 14px inline padding on desktop and 10px on mobile, including primitive disclosures.

Six lazy comparison sections follow the primary playground: Sizes, Variants, Colors, With icons, Corner radii and Materials. Their 23 real switches operate independently. Each card has a complete source example with the same shared Theme settings, a five-line collapsed excerpt, expansion and copy. Theme applies to the preview surface, keeping documentation headings readable when a dark preview sits in light documentation. Complete comparison exports are checked in both appearances and motion modes. Local prop metadata is regenerated from the added interfaces; generated files were not edited by hand.

Production review caught an existing RTL selector hazard: CSS optimization rewrote :dir(rtl) into language selectors, which failed on an English document with a runtime RTL theme. Switch travel now inherits a direction token from the nearest explicit dir scope. The minified build retains the attribute-based token scopes. In the fresh production browser, all three checked variants compute to +16px in LTR and −16px in RTL, with thumbs inside their tracks.

Verification:

- `pnpm check` passed token/API freshness, workspace types, 31 token tests, 72 React tests, 10 docs tests, 506 complete generated examples and production builds. Four new Switch tests cover root/thumb/input refs, render composition, callbacks, submitted values, decorative icons, custom children/null, inherited/overridden settings, focus and readOnly/disabled guards in both motion modes. A final docs typecheck also passed after gallery refinements.
- `pnpm package:check` passed isolated tarball declarations, ESM/SSR, browser and CSS consumers, including the new visual props, artwork, motion aliases, direction token and optional switch material rules. Core consumers still do not require Motion. `pnpm format:check` passed; the two evidence files received a final focused formatting check.
- Browser review measured all 15 size/radius combinations with centered icon boxes, all 12 color/variant combinations, all five finishes and disabled styling for every variant. Keyboard Space toggles independently, readOnly preserves selection, and normal/reduced timings compute to 120ms/0ms. Production copied source includes the correct comparison and selected appearance, palette, radius, density, motion and direction.
- Desktop, light/dark and 320/390px were reviewed in Codex's in-app browser. At 320px main and comparison preview client/scroll widths match at 272/272px and 224/224px; controls also fit. The 390px comparison row fits its three sizes. Fresh production review verified both direction signs, mobile bounds and all comparison sections; no production-origin warnings/errors were reported. The temporary viewport override was reset.

Evidence: `output/in-app-browser/switch/evidence.json`, `comparison-sections.png`, `production-desktop.png`, `production-mobile-dark.png`, `api-padding.png` and the intermediate mobile captures. Final command logs: `/tmp/dixy-switch-verified-{check,package,format}.log`; docs typecheck: `/tmp/dixy-switch-complete-types.log`. These are local review artifacts. The known development Fast Refresh appearance-context issue required reloads after package rebuilds; fresh production was unaffected. Existing shared-chunk build warnings remain separate. Physical touch, Safari/Firefox, screen readers, native OS preference switching, forced-colors rendering, zoom and hardware energy profiling remain unverified. Personal mastery remains unchecked.

Switch state/motion review: an unchecked danger switch computed to the neutral track and thumb colors, while checked comparison switches use their selected colors in either direction. In System mode a real keyboard toggle produced intermediate thumb translations (11.387px, 4.858px, 3.062px and subsequent values down to zero) during the shared 120ms transition. Reduced previews computed to zero duration as intended. The normal-motion trace and observed preview preferences are included in the evidence JSON. No color or timing change was required by this review.

## Checkbox variants and comparison documentation — 2026-10-15

Reviewed [HeroUI’s checkbox documentation](https://heroui.com/en/docs/react/components/checkbox) in the in-app browser and its official page content. Expanded Dixy’s existing Base UI wrapper with the same visual vocabulary as Switch: `sm`/`md`/`lg`, solid/soft/outline, accent/neutral/danger/success, five contextual radii and five inherited static materials. Unchecked boxes remain neutral; Field validation can signal an error independently. Sizes preserve the shared minimum interaction target rather than tying the target to density. The optional material pack is now 932 bytes gzip, uses static gradients and requests no texture assets. No required Motion dependency or rendering loop was added.

Indicator adds decorative `checkedIcon` and `indeterminateIcon` slots. Centered SVG defaults, explicit children/null, refs, render composition, state class callbacks and keepMounted remain intact. Overlaid symbol slots support finite opacity/scale feedback for custom artwork as well as the default check/dash. The existing generated 120ms motion aliases and Base UI presence ownership remain in place; reduced motion computes to zero duration and unit spatial scale. Root retains native/Base UI state, input refs, controlled/uncontrolled changes, readOnly, disabled, validation and form contracts.

The primary playground has eleven aligned controls, a Field-owned description/error and complete configured source. Nine lazy comparison sections follow it: Sizes, Variants, Colors, Custom indicators, Corner radii, Materials, States, Select all and Form validation. These contain 31 real checkboxes and complete expandable/copyable source. Select-all uses `CheckboxGroup.allValues` and the primitive `parent` contract. Required validation uses Field/Form rather than a new invalid prop on Checkbox. Switch and Checkbox share the comparison-card presentation and source loader. Generated API metadata comes from the local Root/Indicator interfaces; no generated files were edited by hand.

Verification:

- Final `pnpm check` passed token/API freshness, workspace types, 31 token tests, 76 React tests, 10 docs tests, 562 complete generated examples and production builds. Four new regression cases cover inherited/overridden visual settings, root/input/indicator identity, decorative artwork, focus and readOnly/disabled guards in both motion modes, parent group state and required Field/Form submission. Existing composition fixtures now use the correct nativeButton contract and controlled state during rerenders, removing their avoidable Base UI warnings.
- `pnpm package:check` passed isolated tarball installation, declarations, ESM/SSR and browser/CSS consumers. The packed consumer uses the new visual props/artwork; SSR and optional CSS checks include the checkbox finish selectors. Core consumers still do not require Motion. Repository formatting passed before these evidence entries, followed by a final formatting check.
- In-app browser: all 15 size/radius combinations had centered mixed artwork (zero measured x/y center delta); settled default marks measured 12/16/20px inside 16/20/24px boxes. Selected palettes differ by semantic role; all four unchecked palettes compute to the same neutral background/border. Solid/soft/outline and all five material images/edges were inspected. Disabled styling removes the finish and skips focus. Custom checked/mixed artwork visibility and readOnly state were verified.
- Keyboard select-all went mixed → all → none; required submission showed its error before selection and saved after selection. Primary and comparison copies included complete examples, the selected visual props and matching Theme settings. Reset restored all eleven defaults and theme defaults. Light/dark, LTR/RTL, normal/reduced motion, desktop, 320px and 390px were reviewed. At 320px the main client/scroll widths matched at 272/272px and every comparison at 224/224px; at 390px they matched at 342/342px and 294/294px. Code blocks retain intentional horizontal scrolling.
- A restarted production preview on port 3016 verified all nine sections, normal 120ms and reduced 0ms feedback, mixed artwork, copied complete color source, dark RTL mobile bounds, select-all and required validation. No production-origin warnings/errors were reported. A production Switch smoke test retained all six sections and independent keyboard toggling after the shared-card extraction. Saved appearance/theme preferences were restored and the temporary viewport override reset.

Evidence: `output/in-app-browser/checkbox-variants/evidence.json`, `production-comparisons.png`, `production-mobile-dark.png` and `mobile-dark-rtl.png`. Final command logs: `/tmp/dixy-checkbox-verified-check.log`, `/tmp/dixy-checkbox-variants-package.log`, `/tmp/dixy-checkbox-variants-format.log`. These are local review artifacts, not durable visual regression baselines. Package rebuilds reproduced the known development Fast Refresh appearance-context issue; reloading restored development, and fresh production was unaffected. Existing shared-chunk build warnings remain. Safari/Firefox, screen readers, physical touch, native OS media preference switching, forced-colors rendering, zoom and hardware energy profiling remain unverified. Personal mastery remains unchecked.

## Tabs foundations, composition and component coverage — 2026-10-15

Reviewed the official [shadcn Base UI Tabs](https://ui.shadcn.com/docs/components/base/tabs) and [HeroUI Tabs](https://heroui.com/en/docs/react/components/tabs) references, including live manual and automatic keyboard activation in Codex’s in-app browser. Dixy keeps its Base UI parts and contracts. Root adds sm/md/lg, line/solid/soft/outline, four semantic colors, inherited radius/material, alignment and horizontal fill. List retains activation/looping; Panel retains primitive-owned hiding/inert state. Refs, controlled state, render composition, callbacks and nested roots remain intact. Disabled tabs can receive arrow focus for discovery under the installed Base UI contract, but cannot activate.

The primary playground aligns eleven controls with complete configured source and generated local API metadata. An explicit Root → List → Tab/Indicator, Panel composition section explains behavior ownership. Eight lazy comparisons demonstrate variants, sizes, colors, icons, radii, materials, orientation/activation and overflow. Only line tabs render an active bar; solid/soft/outline use their selected surface without an extra underline, including rounded vertical groups. A static selected fallback remains usable without Indicator or before its coordinates are ready. Native scrolling keeps overflowing focused tabs reachable in LTR and RTL.

Trigger heights are 32/40/48px; decorative indicator geometry uses Base UI measurements. Finite indicator movement follows the shared 200ms recipe, and feedback follows the 120ms component aliases; reduction makes both immediate. Materials apply only to filled indicators from the optional static pack (1014 bytes gzip), without texture requests, a rendering loop or required Motion dependency. The docs’ unlayered native button reset previously overrode library fonts and selected foregrounds; it now excludes Dixy components so the library controls its visual contract.

`docs/COMPONENT_ROADMAP.md` maps 39 component pages and 50 uppercase runtime family/layout/provider exports against 72 HeroUI and 66 shadcn catalog entries. Aliases, compositions, partial/private implementations and missing components are distinguished. ButtonGroup is next, followed by Avatar/AvatarGroup and basic content/form components. AvatarGroup is included in shadcn’s Avatar documentation, so it is recorded even though it is not a separate catalog entry. The dated inventory is a planning artifact, not a parity score. Other components remain planned work.

The reusable `dixy-component-building` skill is maintained in `docs/skills/dixy-component-building/` and installed in the user skill directory. Both copies validate and include the filled-tab correction, executable documentation, Base UI preservation and an evidence-based WCAG 2.2 AA gate. Personal learning remains separate from implementation completion.

Verification:

- `pnpm check` passed 31 token, 81 React and 10 docs tests (122 total), 615 complete generated examples, freshness/type checks and production builds. Five new Tabs cases cover manual/automatic activation, disabled discovery, panel relationships and keepMounted, refs/render composition, nested themes, RTL/orientation and structural axe checks. JSDOM contrast is excluded; rendered contrast was measured separately. An existing Select test now waits for its actual option focus before End/Enter to remove an asynchronous focus race; Select runtime behavior is unchanged.
- `pnpm package:check` passed isolated tarball installation, declarations, ESM/SSR and browser/CSS consumers. The packed fixture uses the new visual props and server-rendered Indicator; optional material selectors are verified. Core consumers do not require Motion. Repository formatting passed.
- In-app browser review covered desktop, 320/390px component reflow, light/dark, LTR/RTL, normal/reduced motion, manual/automatic activation, disabled discovery, panel entry, copied source and reset. Main client/scroll widths matched at 272/272px at 320px and 342/342px at 390px; comparison previews matched 224/224px at 320px. Long tab lists intentionally scroll. The docs mobile shell was not redesigned.
- Across four variants, four semantic colors and two appearances, 64 selected/inactive matte text/background comparisons passed 4.5:1; the minimum was 5.53:1 for the sampled violet/sand palettes. This does not cover every palette, focus/hover state or material composite. Settled indicator bounds matched selected triggers within fractional layout rounding in both orientations and directions. Intermediate transition samples are recorded separately from settled geometry.
- Fresh production review on port 3016 verified selected surfaces without extra underlines, Base UI relationships, decorative icons, complete configured source, overflowing keyboard focus, shared timing and all five material finishes. No production-origin warnings/errors were reported. Temporary viewport overrides and preview preferences were restored.

Evidence: `output/in-app-browser/tabs/evidence.json`, `production-variants.png`, `production-vertical.png` and `composition.png`. Final command logs: `/tmp/dixy-tabs-verified-check.log`, `/tmp/dixy-tabs-package.log` and `/tmp/dixy-tabs-format.log`. These are local review artifacts. Manual screen-reader/browser combinations, Safari/Firefox, physical touch, native OS media preference switching, actual forced-colors rendering, text resize/200–400% zoom, durable visual baselines and hardware power profiling remain pending. No full WCAG conformance claim is made. Existing shared-chunk warnings and development appearance-provider Fast Refresh behavior remain separate follow-ups.

## Approved Base UI family refresh and documentation reuse — 2026-10-15

Following approval of the full update list, applied the `dixy-component-building` and `design-system-docs` workflows to the remaining existing Base UI families. The implementation scope and dated shadcn/HeroUI reference mapping are in `docs/COMPONENT_REFRESH.md`; the component roadmap now distinguishes the delivered Avatar upgrade from the still-missing AvatarGroup and other new families. No new component stack, icon pack or animation runtime was added.

DOM-owning controls/surfaces now have explicit, locally documented visual contracts where useful: shirt sizes, selected or surface emphasis, semantic colors, contextual radii and optional static materials. Generic Select/Combobox/Autocomplete Roots remain unchanged; Trigger/Input/InputGroup and Popup configure their respective DOM surfaces independently. RadioGroup, ToggleGroup and Slider preserve generic value inference. Compound part inventories, refs, callbacks/cancellation, render/style/className composition, forms, focus and presence remain primitive-owned. Simple Form, Toggle, Separator and group controls are documented as simple components where appropriate.

The pass includes Radio/RadioGroup, Toggle/ToggleGroup, Avatar, Accordion/Collapsible, TextField/Field/Fieldset/Form, Select/Combobox/Autocomplete, Dialog/AlertDialog/Drawer/Popover/PreviewCard/Tooltip, Menu/ContextMenu/Menubar/NavigationMenu, NumberField/OTPField/Slider, Progress/Meter/Toast/ScrollArea, plus CheckboxGroup/Toolbar/Separator. Thirty-three refreshed documentation pages have aligned controls/source and reusable comparisons; all 36 Base UI family pages now have explicit composition guidance, including Checkbox and Switch. Comparison specimens mount near the viewport, while complete copied examples share their actual demo source and settings. API metadata now discovers local component interfaces and generates 59 local references.

Concrete changes include default decorative SVG selector/clear/check artwork with explicit custom children/null preserved; neutral unchecked choices; connected-toggle borders; Avatar frame/fallback styling; grouped number steppers; per-instance numeric/OTP IDs; range/vertical Slider examples; single/multiple Select with invalid/disabled options; Combo input groups and clear actions; bounded popup scrolling; explicit AlertDialog cancel/confirm with Cancel initially focused; Drawer Content; provider-owned toast close controls and semantic measurements. Disclosure sizing used block-size but transitioned height; it now transitions the measured block-size. Generated finite motion aliases cover the new families, reduction removes spatial effects, and direct slider/scroll/drawer manipulation adds no positional interpolation. The optional static material pack is 1566 bytes gzip, below the existing 5 KiB budget, and requests no textures or blur effects.

The docs now consume public Dixy Tabs for Preview/Code, Select for property/theme dropdowns, Switch for boolean settings, Button for shared actions, TextField/Slider for input controls, and Collapsible for navigation/settings/source/API disclosures. The docs-only Select adapter turns existing option declarations into public compound parts and passes real value callbacks; it does not synthesize DOM change events. Native semantic headings, links and tables remain. The preset JSON editor remains a native textarea pending the separate public Textarea component. Existing search-result navigation logic remains in place with the styled input; a dedicated search-composition interaction review remains follow-up work. Mobile documentation-shell redesign was not included.

Verification:

- Final `pnpm check` passed freshness, workspace types, 31 token tests, 84 React tests and 10 docs tests (125 total), 946 complete generated examples and production builds. Three added contract cases cover inherited/overridden visual attributes, refs/render/state callbacks, typed object Select cancellation/default/custom artwork and range Slider callback inference. Existing behavioral tests remain part of the required check; comprehensive new per-component testing is deferred as requested.
- Final `pnpm package:check` passed independent tarball installation, declarations, ESM/SSR, browser/CSS consumers and optional-material checks. The consumer now exercises new visual props and RadioGroup/ToggleGroup/Slider generics as well as object-valued Select/Combobox. Material selectors for Radio and Select are verified. No required Motion installation was introduced. Repository formatting passed, then the evidence files received a focused final format check.
- In-app browser review loaded the 33 refreshed development pages with their primary content and composition sections. The initial Popover observation was during lazy loading; its hydrated keyboard-open path was subsequently verified. This is a documentation render smoke check, not the full visual/interaction matrix.
- Fresh production review on port 3016 verified Select size controls, multiple selection of personal/team, the actual compound Preview/Code tab relationships, complete copied source with lg/multiple/reduced settings, and AlertDialog initial Cancel focus plus return focus after dismissal. No production-origin warnings/errors were reported in the reviewed production tab. A local Popover computed 200ms normal and 0ms reduced motion. Dark Avatar rendering retained its 40px frame and 8px radius.
- A requested 390px override did not change this background tab: observed innerWidth remained 1280px. The screenshot is therefore named `production-avatar-dark.png`; no new mobile/reflow result is claimed. Temporary viewport overrides were reset. Preview appearance was restored to light and the observed reduced-motion preference restored after the normal-motion check.
- Package rebuilds reproduced the known development appearance-provider Fast Refresh issue. The original port-3000 server was no longer listening at the final reload; it was restarted and a fresh Form documentation tab rendered successfully. Fresh production review was unaffected. Existing shared-chunk build warnings remain separate follow-ups.

Evidence: `output/in-app-browser/base-ui-refresh/evidence.json`, `production-select.png`, `production-alert-dialog.png` and `production-avatar-dark.png`. Final logs: `/tmp/dixy-refresh-final-check.log`, `/tmp/dixy-refresh-final-package.log`, `/tmp/dixy-refresh-final-format.log`; local server logs: `/tmp/dixy-refresh-{preview,dev}.log`. Required checks do not establish full WCAG 2.2 AA conformance. The full visual/state/material contrast matrix, screen readers, physical touch, Safari/Firefox, real zoom/text resize, actual forced colors/native media switching, narrow-view reflow, durable visual baselines and hardware power profiling remain pending. Personal mastery remains unchecked.

## Consistent family comparison showcases — 2026-10-15

The 33 refreshed families now follow the existing Checkbox/Switch comparison layout. Each of 121 categories has one shared preview card, labeled comparison items and one complete expandable/copyable code block underneath. The shared card owns Theme propagation, preview loading and source presentation for both existing and refreshed comparisons. Public Dixy Inline, Stack and Text arrange the new rows. Larger compositions wrap; compact Avatar examples omit repetitive helper text and center the frame. The primary Avatar playground retains its description. Toggle specimens center their control and feedback. Separator now includes its subtle/strong emphasis comparison.

Live rows and copied examples use the same category configurations and layout styles. The copied source retains the original demo's imports, helpers, data and per-instance state, renders every sibling configuration and includes the selected Theme. All 121 grouped sources are included in the public-package example checker. Category previews remain deferred until near the viewport; no new dependency or runtime animation is introduced.

Development in-app browser checks verified grouped Avatar sizes, treatments, colors, all five radii and materials, source expansion and complete copied size source. Light/dark and system/reduced Theme propagation were observed; reduced motion and light preview preferences were restored. Select small/medium/large values remained independent after changing the small instance, and Accordion keyboard activation expanded only the chosen treatment. Those previews measured 702px client/scroll widths with larger examples wrapping within the card. The original Switch retained six shared cards and independent keyboard toggling after the card extraction. Full per-component testing remains deferred.

Final verification: `pnpm check` passed workspace freshness/types, 31 token + 84 React + 10 docs tests (125 total), 1067 complete generated examples (including all 121 new grouped sources) and production builds. `pnpm package:check` passed isolated installation, declarations, ESM/SSR, browser/CSS consumers and optional materials (1566 bytes gzip). Repository formatting passed, followed by a focused format check of these evidence entries.

A restarted production preview on port 3016 verified five Avatar categories with exactly one preview/code card each, real 32/40/48px frames, complete copied multi-instance source and expansion/collapse. A grouped Select keyboard check changed only the medium specimen to team and returned focus to its combobox. The reviewed preview measured 702px client/scroll widths. No production-tab warnings/errors were reported. Source-copy evidence was read again after a stale browser clipboard observation before confirming its full configuration.

Evidence: `output/in-app-browser/comparison-layout/evidence.json` and `production-avatar-sizes.png`. Logs: `/tmp/dixy-comparison-layout-final-check.log`, `/tmp/dixy-comparison-layout-package.log`, `/tmp/dixy-comparison-layout-format.log` and `/tmp/dixy-comparison-layout-preview.log`. The first validation run was stopped to include the final compact demo/layout changes; the final run passed. The known development appearance-provider Fast Refresh issue recurred after cached package output restoration and recovered with a full reload. Existing shared-chunk warnings remain. No new narrow viewport, physical touch, assistive-technology or comprehensive WCAG result is claimed; mobile documentation work and the broader component matrix remain deferred. Personal mastery remains unchecked.

### Common component additions — 2026-10-15

Added all 37 approved missing families using Base UI where available, native semantic compositions for simple structures, and unstyled React Aria for collection, date, time and color gaps. No shadcn or HeroUI implementation imports were added. The catalog now contains 76 component pages, with actual composition trees, generated API references (100 local interfaces), complete examples and 94 new grouped comparison categories. Five new nonvisual locale/date exports are included in the 92 uppercase runtime exports. API/token tables, keyboard shortcuts and preset JSON editing now consume public Dixy Table, Kbd and Textarea components.

Preserved primitive generics, refs and callbacks; native parts support typed element composition. Added group defaults with child overrides, named date popups with portaled theme restoration, finite reduced-motion behavior, a 24px resize handle, manual carousel controls, and accessible chart data. Chart is a basic nonnegative bar recipe; Resizable handles two panes; Carousel has no autoplay; application code owns DataTable sorting/filtering transforms. These are documented implementation boundaries, not full reference-library parity.

Verification: `pnpm check` passed 31 token + 93 React + 10 docs tests (134 total), 1462 complete generated examples, freshness/types and production builds. Nine new contract tests cover groups, native forms/refs, resizing, collections, dates, carousel/chart/progress, color and command behavior. An existing Menu test now waits for focus before sending Enter, preserving its assertion. Example checking batches 16 independent modules while retaining all generated cases; the final build stage took 38.508 seconds. `pnpm package:check` passed isolated installation, declarations, ESM/SSR, browser/CSS consumers and tree-shaking. Pure namespace initializers prevent unused composite families from retaining their backing modules. Optional materials remain 1629 bytes gzip, without texture requests or required Motion. A compiled DateField/ColorPicker/Card server-render smoke check also passed without browser globals.

In-app browser evidence covers rendering all 37 new development pages and focused production command selection, tag removal/focus, table sorting, date/range selection and focus restoration, keyboard/pointer/RTL resizing and manual carousel navigation. Final production DatePicker review verified its explicit dialog name, light portaled Theme, reduced motion with 0s animation, and restored dark/LTR/reduced preview preferences. Earlier unnamed-popup and inline-command observations preceded fixes and are superseded by the final checks. Evidence: `output/in-app-browser/component-additions/evidence.json` and `production-date-picker.png`. Validation logs: `/tmp/dixy-additions-final-check.log` and `/tmp/dixy-additions-final-package.log`. Development dependency/HMR state was restored with a full workspace install and server reload after package output changes.

Comprehensive per-component WCAG 2.2 AA review, assistive technology, locale/RTL combinations, forced colors, zoom, physical touch and mobile documentation remain pending. No conformance certification or personal mastery is claimed. See `docs/COMPONENT_ADDITIONS.md` for the implementation matrix.

### Playground layout and border/surface review — 2026-10-15

Rebuilt the theme playground around a dense, interactive overview and compact controls below it, using the HeroUI theme builder as a layout reference. Dixy's own Checkbox, Switch, RadioGroup, Slider, Tabs, AvatarGroup, ButtonGroup, Card, Progress, Field and TextField provide the specimens. Overview, the lazy searchable 78-preview gallery and a new Surfaces & borders inspector are separate views. Starter presets, custom accent sliders, heading font, density, motion and import remain in a named More foundations dialog. The existing complete React/preset export and share-link workflows remain intact. Playground appearance applies consistently to its chrome and preview without changing the documentation app's saved appearance.

The border review preserves existing control contrast and adds the inherited `--dixy-stroke-width` token. Shorthands and component aliases follow it; strong borders and focus remain fixed at 2px. Width labels no longer imply contrast roles. Card uses the raised surface, decorative edge and its independent depth token. Two browser findings were repaired: optional material styles erased card elevation, and radius scope declarations reset inherited shadow/width aliases. Material finishes retain their static image while card elevation owns the shadow; generated scope rules now separate geometry, appearance-dependent shadows and widths. Regression assertions protect inherited stroke/depth behavior.

Canonical token calculations cover 39 accents × 11 neutrals × 2 appearances × 5 opaque surfaces (4,290 combinations per role). Minima: default border 3.368:1, focus 3.299:1, primary text 14.276:1, secondary text 7.360:1. Subtle border minimum is 1.386:1 and remains decorative. No blanket palette lightening was applied. The detailed decisions and source reference are in `docs/PLAYGROUND_SURFACE_REVIEW.md`; raw measurements are in `output/in-app-browser/playground-refresh/contrast.json`.

Final verification passed `pnpm check`: 31 token + 93 React + 10 docs tests (134 total), 1462 complete examples, metadata/token freshness, typechecks and production builds. The final build stage took 40.041 seconds. `pnpm package:check` passed isolated installation, declarations, ESM/SSR, browser/CSS exports and tree-shaking; optional materials measure 1714 bytes gzip. Formatting passed after the evidence updates.

Focused production checks verified keyboard tab activation, Save feedback, preview-dialog Escape/focus restoration, the complete 3258-character copied React theme export including shared stroke, invalid-preset feedback and return focus from import, gallery filtering, light/dark surface colors and reduced preview Theme propagation. Final Flat computes `box-shadow: none`; Raised computes the expected two shadow layers. Inputs, Select and Card followed the 2px theme stroke while the focus ring stayed 2px. The initial overview mounts zero gallery cards until the library view is requested. At 1280×720, body and main scroll widths were 1280px. At 390×844, overview/token content stayed within 390px and all toolbar actions stayed within the viewport. The narrow foundations dialog initially caused a 406px scroll width; its final padded viewport measures 390px client/scroll widths with a centered 342px popup (24px gutters). Temporary responsive tabs were closed and overrides cleared; the user's original preset link was restored.

Evidence: `output/in-app-browser/playground-refresh/evidence.json`, `desktop-light.png`, `desktop-dark.png`, `surfaces-dark.png`, `mobile-light.png` and `contrast.json`. No warnings/errors were observed in the final production deliverable tab. Logs: `/tmp/dixy-playground-final-check.log`, `/tmp/dixy-playground-final-package.log`, `/tmp/dixy-playground-final-format.log` and `/tmp/dixy-playground-preview.log`. Broader WCAG/assistive-technology, zoom, physical-touch and platform testing remain pending; personal learning remains unchecked.

### Expressive theme image exploration — 2026-10-20

Generated eight independent raster direction boards with the built-in image_gen tool: Living Forest, Retro OS, Material Light, Tactile Atelier, Winamp Signal, Y2K Titanium, Studio Hardware and Prism Glass. The follow-up set responds to the user's Winamp Skin Museum link and supplied modern audio-hardware/glassmorphism reference screenshots. The museum was opened with web browsing and visually reviewed in Codex's in-app browser. No specific museum skin was copied. The user requested images before implementation planning; no implementation plan, component, CSS, public contract, generated metadata or existing docs UI was changed.

The boards use comparable cards, buttons, tabs, fields, switches, checkboxes, sliders and toast specimens; the follow-up set adds Progress and a small player composition to explore applying the style across existing core components. These are illustrative images, not compiled examples or functioning controls. All eight were visually inspected for composition, readable main labels, distinct materials/edges and control coverage, then copied into `output/imagegen/2026-10-20-theme-directions/`. PNG signatures, dimensions and the presence of eight saved prompts were verified. `README.md` records direction descriptions, references, additional theme seeds and limitations; `PROMPTS.md` preserves the exact prompts and generation mode.

This was an image/documentation-only exploration, so `pnpm check` and `pnpm package:check` were not run. No proposed skin has desktop/mobile, keyboard, light/dark, reduced-motion, contrast or assistive-technology verification. Generated focus/state samples do not establish behavior or accessibility, and incidental mascots/microtext in the first set are not proposed library assets. Runtime work and personal learning remain unchecked.

### Personalization and extensible skins proposal — 2026-10-20

Inspected the current Theme/ThemeScope, material/shape/personality contracts, optional CSS/Motion exports, build emission, version-1 playground presets and existing expressive-foundations plan. Recorded `docs/PERSONALIZATION_AND_SKINS_PLAN.md` in response to the user's request for user-authored themes, React-framework support, rendering/library choices and six initial skins. The recommendation extends the existing foundations with versioned skin manifests, stable part/role hooks, independently loaded CSS/SVG packs and a modern fork/edit/preview/export creator. It preserves component behavior and portal/preference inheritance, migrates existing presets and separates authoring tools from consumer rendering.

Official Base UI, Motion, React, MDN, React Three Fiber, three.js, Zod, SVGO and DTCG references inform the proposal. Six suggested initial packs are Living Forest, Retro OS, Winamp Signal, Studio Hardware, Prism Glass and Tactile Atelier. Studio Hardware/Forest form the proposed first implementation proof; WebGL/three.js/React Three Fiber are reserved for a separately imported live-scene use case. Budgets and framework targets are acceptance proposals, not benchmark results or compatibility guarantees.

Only planning/evidence documents changed. No dependency was installed, and no theme/compiler/editor/component implementation was performed. `pnpm check` and `pnpm package:check` are not applicable to this documentation-only task. Browser, accessibility, device/performance and framework acceptance cases remain pending; personal mastery remains unchecked.

### Six 2D skins in the existing playground — detailed plan, 2026-10-20

Saved `docs/SIX_THEME_PLAYGROUND_IMPLEMENTATION_PLAN.md` for later implementation, grounded in the current playground route/workbench, gallery/registry/example defaults, preset parser/exporter, Theme/ThemeScope, visual helpers, token recipes, optional CSS build and packed-consumer checks. Updated the earlier personalization proposal to point to this authoritative build plan and remove Three.js/React Three Fiber from the current direction.

The plan specifies all six skin briefs and their component/state/asset treatments, shared part/role contracts, compact skin definitions and separate CSS/assets, v1-to-v2 preset migration, nested/portal precedence, the gallery inheritance correction, lazy scene additions, stable interaction state during skin switches, initial SSR stylesheet loading, rapid-switch failure handling, editing/URL coordination and export parity. P0–P6 work packages have dependency order and completion gates. Runtime implementation and coverage items remain pending.

Official MDN/WebGPU/WGSL references distinguish direct 2D WebGL/GLSL effects from WebGPU/WGSL. All six skins have complete CSS/SVG defaults; a single optional bounded shader experiment is independent of six-pack completion. The plan excludes engines, canvas controls and DOM-to-texture capture, and records shader lifecycle/reduction/failure rules, proposed byte/layer/pixel/frame budgets and repeated baseline/static/backdrop device measurements. Limits are acceptance targets, not measured achievements.

Verification for this task is source/reference inspection, plan consistency checks and focused Markdown formatting. No dependency, shader, component, CSS or playground runtime changed; `pnpm check` and `pnpm package:check` were not run for planning documents. No new visual, accessibility, framework or performance pass is claimed. Personal learning remains unchecked.

### Six skin playground, mail composition and procedural Forest — 2026-10-21

Implemented six independent skin definitions/CSS entries in `@dixy-ui/themes`, selected through the existing playground. The shared SkinDefinition remains in tokens; React imports no theme catalog or renderer. Theme/ThemeScope carry scoping/defaults, explicit material precedence, nested clearing and inherited motion/effects reduction. Gallery examples now inherit material/radius/shape while ordinary component pages continue passing their explicit controls. Preset v2 stores installed skin IDs and bounded overrides, migrates v1, and drives preview props plus complete React/JSON/CSS exports. Added per-skin session drafts, 30-step undo/redo, restore defaults, debounced URL updates, selected SSR CSS, loading/retry and source failure fallback.

Overview, lazy Player, Email and States scenes use public Dixy components. Email follows the supplied shadcn layout reference using Dixy Card, Button, IconButton, Field, TextField, Textarea, Switch, Avatar, Badge and Dialog: folders/search, unread filter, starring, archive/trash/recovery, compose and inline reply are local mock interactions. No message leaves the preview. The six themes retain their distinct material/edge/typography recipes. `docs/SIX_THEME_COVERAGE.md` classifies all 78 gallery families; specialist artwork and exhaustive per-part review are explicitly distinguished from shared styling support.

Following the user's correction, Forest's static WebP frame was replaced by a separately imported procedural React/SVG renderer. The original generated image guided the asymmetric leaves, clipped midrib/branching vein geometry, layered twigs, moss/flowers, paper grain, serif actions, inset rims, checked-switch leaf, field-label leaf and acorn slider. Earlier static frame files are archived under `output/imagegen/2026-10-20-theme-directions/retired-static-assets/` and are not emitted to the package. An optional Theme ornamentRenderer supplies decorative parts without changing component interaction owners. SVG IDs are deterministic per instance through useId; all artwork is aria-hidden and ignores pointer events. Forest is the first code-rendered skin; particle-system work remains separate.

Animation is an explicit animateOrnaments opt-in. The playground offers a 20-second preview and Pause nature; its timer is cleaned up. CSS respects explicit/OS reduced motion, and quiet/reduced effects remove SVG ornamentation. The final OS reduction selector matches the animation rule's specificity. The five other packs remain static CSS; Prism's one bounded frosted toolbar is optional. No Three.js, WebGL/WebGPU renderer, shader execution or JavaScript drawing loop was added.

Automated evidence: `pnpm check` passed 31 token + 96 React + 2 theme + 11 docs tests (140 total), 1462 complete examples, freshness/types and production builds. The artwork regression verifies nested clearing, reduced effects and preserved editable state; existing behavior tests cover refs, native values and open portal focus/identity. Six generated theme wrappers typecheck against public packages. `pnpm package:check` verifies isolated core/token/skin consumers, declarations, ESM/SSR, Vite assets, unused-skin CSS exclusion, resolvable/unique SVG IDs and absence of bitmap output. Final logs are `/tmp/dixy-forest-final-check.log` and `/tmp/dixy-forest-final-package.log`; earlier successful package evidence is `/tmp/dixy-forest-package.log`.

Focused desktop browser results and screenshots are saved in `output/in-app-browser/six-skins/` (initial six-pack) and `output/in-app-browser/forest-procedural/` (current Forest). The original overview was reviewed against the generated board. The initial six-pack browser pass checked light/dark for all six, gallery inheritance, local mail flows/recovery, keyboard dialog focus, player and save/error states, draft preservation and history. The procedural pass separately verifies actual SVG artwork, native interactions, motion controls and current production behavior. Earlier mobile screenshots are diagnostic snapshots; mobile checking was explicitly deferred by the user and was stopped. Performance profiling was also deferred in favor of visual fidelity. Static byte/structure evidence is not an FPS, energy or low-end-device result.

See `docs/FOREST_PROCEDURAL_THEME.md` for public usage, geometry and limitations. Next/React Router SSR fixtures, full AT/WCAG, zoom, OS forced colors/reduced transparency, physical touch and hardware profiling remain release follow-ups. No conformance certification or personal mastery is claimed.

Final procedural desktop production observations: 20 decorative instances and 242 leaf uses rendered with zero SVG image or HTML image nodes. The controls started the leaf animation, paused it to animation-name:none, and automatically returned to still artwork after the finite preview. The project field retained its edited text through animation/appearance changes; the keyboard slider advanced 65→66. The decorated Dialog had the selected Forest scope and returned focus to Explore on Escape. Reduced motion won over animation opt-in; reduced effects removed all preview ornament instances and card shadows. The final production console had no warning/error entries. Screenshots: desktop-light.png, desktop-details.png and desktop-dark.png in output/in-app-browser/forest-procedural/. Final formatting and skin freshness checks passed. CSS/renderer measurements are 2,909/3,675 bytes gzip respectively; these are file sizes, not profiling results.

### Five additional procedural skins — 2026-10-21

Refined Retro OS, Winamp Signal, Studio Hardware, Prism Glass and Tactile Atelier against their saved generated boards. Added independent optional React/SVG renderer entries for pixel window chrome, machined rails and meters, ceramic/steel hardware, spectral glass light, and walnut/paper/linen. Fine geometry, fasteners and local SVG references are original code. No static sprites, external SVG assets, rendering engine or animation-frame loop is used. Existing component semantics, refs and state are unchanged. Forest is preserved.

Authored component recipes in scripts/skin-details.mjs complement the canonical manifests/generator. Frames, buttons, fields, tabs, switches/checkboxes, slider handles and progress tracks carry each skin's material language. Atelier now defaults to the tomato family for its terracotta enamel. Prism's background uses one SVG diffusion filter; its Card surface is explicitly tinted at 76% opacity, while text and fields keep readable backing. Explicit material overrides and motion/effect reductions remain supported. The editor lazy-loads the selected renderer, exports its matching public import/prop, and offers finite 20-second animation previews for all six skins.

Final `pnpm check` passed: 140 tests, 1462 complete generated examples, freshness/types and production builds. `pnpm package:check` passed independent packed declarations, SSR, repeated-instance SVG references, reduced settings and all six separate browser consumers. Exclusion checks verify unselected CSS and renderers do not enter each selected-skin bundle. Core CSS remains 400.88 kB / 34.55 kB gzip. The five selected CSS entries are 2639–2989 bytes gzip, within the existing 5 KiB budget. Renderer plus shared emitted helper figures are 1268–1721 bytes gzip; this is a concatenated-module size, not a minified bundle benchmark or device profile.

Focused production desktop review at 1280×720 covered all five default/opposite appearances, opt-in/pause animation and native editable state. Project text and keyboard slider value 66 persisted across skins. Mail kept its local reply draft and three decorated panels; Player retained Glass Rivers, volume 66 and playing state across all five. The decorated Atelier Dialog restored Explore focus after Escape/exit. Reduced motion yielded no animated markers and animation-name:none for every skin. Reduced effects removed all optional artwork and card shadows across all five. Final production console observations were empty. Evidence/screenshots and measured sizes: output/in-app-browser/five-procedural/. See docs/PROCEDURAL_SKINS.md for composition and limitations.

Mobile checks and hardware performance profiling were explicitly deferred by the user. OS preference emulation, full AT/WCAG/contrast matrix, forced colors, zoom and framework-specific SSR integration remain release checks. No conformance or personal mastery claim is made.

### Additional theme image exploration — 2026-10-21

Used the built-in imagegen tool, as requested, to generate four more independent visual boards before further theme implementation: Ocean Depths, Candy Clay, Art Deco and a fresh Y2K Titanium exploration. The same navigation, hero, buttons/states, tabs, field, switches/checkboxes, slider, progress and toast composition makes the material differences comparable. Reviewed all four outputs and verified PNG signatures and 1536×1024 dimensions. Saved project copies, exact prompts and original source paths in output/imagegen/2026-10-21-more-theme-directions/. These four are visual concepts, not additional installed themes or runtime sprite assets. No image-derived performance or accessibility claims are made.

### Theme surface/content ownership — 2026-10-21

Applied the user's correction that themes should not inject unrelated content or simulate unavailable actions. Removed the Button ornament slot from the core renderer contract and all theme contracts, along with its mounting point and unused CSS. Consumer-provided button icons/labels and the functional loading spinner remain under the existing Button contract. Forest no longer appends a decorative leaf to field labels. Removed Retro's decorative title bar, disk/activity marks, minimize/maximize/close symbols and resize grip; its existing frame now has only a small bevel inlay, and the reserved header padding is removed. Existing material, border, frame and control-state styling continue to supply character. Updated the current procedural-theme guides with this policy for future theme work.

`pnpm check` passed 141 tests, 1462 complete examples, freshness/type checks and production builds. The added contract regression verifies supplied button/IconButton icons, refs, focus, keyboard activation, theme switching and the loading spinner. `pnpm package:check` passed all selected-skin consumers, declarations and SSR, including assertions that no skin injects button ornaments and Retro has no simulated window chrome. Formatting passed.

Fresh production in-app review verified all six skins: Explore has exactly its supplied arrow SVG, Save changes has no SVG, and neither contains theme artwork. No fake Retro chrome exists; its card padding is 24px. Forest label pseudo-content computes to none. Forest, Retro and Atelier were also checked in the opposite appearance. Enter activated Save, retained focus and added only the consumer's meaningful saved-state check icon. The final console had no warnings/errors. Screenshots and DOM evidence: output/in-app-browser/theme-content-ownership/. Mobile/performance remain deferred; OS preference emulation, full AT/zoom/forced-colors were not repeated for this removal pass.

### Theme engine and future AI authoring review — 2026-10-22

Reviewed all six authored skins, their source contracts/compiler/preset/editor/loading boundaries, and five distinct unbuilt directions: the latest Ocean Depths, Candy Clay, Art Deco and Y2K Titanium boards plus earlier Material Light. Saved docs/THEME_ENGINE_REVIEW_2026-10-22.md with current capabilities, precise authoring gaps, per-theme renderer/parameter recommendations, a schema/recipe/compiler architecture, compatibility/migration boundaries, AI proposal/validation/export workflow and implementation order. Official MDN, DTCG, JSON Schema and Ajv references support rendering/interoperability/validation recommendations.

The recommendation keeps CSS/procedural SVG as the core, considers Canvas 2D only for an explicit particle scene and WebGL/GLSL only for a justified live effect such as Ocean caustics; WebGPU/WGSL and Three.js are not required by these visual directions. Essential gaps are portable typography/visual defaults, bounded material/frame/pattern parameters, consistent overrides, a generated registry and data-driven authoring/compiler contracts. Model integration belongs in optional authoring tooling with deterministic validated output; core components do not load a model or run generated code.

Restarted the existing local production preview for in-app review. All six Overview skins had zero canvas/image nodes. Confirmed a concrete geometry inconsistency: Studio Hardware Radius → Square sets data-radius=none and its button radius to 0px, but cards remain 16px. The tested Flat setting correctly removed card and switch-well shadows. Screenshots/DOM evidence are saved under output/in-app-browser/theme-engine-review-2026-10-22/. No runtime code, dependency, public API or generated file changed; implementation/package checks were not rerun for this review-only pass. Mobile/hardware profiling and the wider accessibility/framework matrix remain deferred or untested. Personal mastery is not established by this review.

### Shared theme engine: six existing skins — implementation, 2026-10-22

Implemented `ThemeDocument` schema version 1, inferred authoring types, bounded parameters, copied/frozen validation output and field diagnostics in the separate themes authoring entry. Moved all six visual defaults into portable documents and trusted material/frame registration; manifests now carry presentation metadata. The same `compileThemeDocument` API emits installed CSS/definitions and supports renamed forks without loading arbitrary modules. Generated entries also export complete static Theme settings; a lightweight foundations entry supplies shared font/stroke/elevation resolution to docs preview and export. Generated docs mappings unify definitions, selected CSS loaders and lazy renderer registration. The core React library does not import this engine. No model, particle/GPU library or dependency was added.

Fixed radius consistency by using contextual control/card/overlay tokens, with multiplicative Forest corner variation that resolves to zero for Square. Control stroke now reaches action and input borders; decorative frame width remains a separate recipe parameter. Elevation and relief no longer silently update one another in the editor. Shared relief aliases preserve nested scopes and Flat removes panel/action/well/track/thumb shadows. Final reduced-effects policy clears component-layer material overrides and uses an opaque glass fallback. Explicit component materials, supported local radius overrides, Base UI semantics and the recent consumer-content policy remain intact. Existing v1 definitions, defineSkin, import paths and playground preset v1/v2 parsing remain supported.

The first schema intentionally permits six reviewed material/frame pairs; arbitrary cross-pair selection, non-Forest organic corner variation, unknown fields/recipes/versions and executable content are rejected. This is the first shared compiler slice, not a general vector/shader language or a document editor/import/marketplace. Independent material roles, adjustable organic geometry/seeds and AI remain pending. API, precedence, output and compatibility details are saved in docs/THEME_ENGINE.md.

`pnpm check` passed 146 tests, type/freshness checks, all 1462 complete examples and production builds. `pnpm package:check` passed standalone installation, declarations, all-six static Theme settings, JSON schema/document/compiler exports, SSR, selected-only CSS/renderers and checks excluding the authoring schema/validator from static consumer bundles. Focused formatting passed. The packed-consumer pass caught and resolved a static style weak-type incompatibility; the browser pass caught and resolved button-border specificity and component-layer reduced-gradient overrides. Final selected CSS ranges from 2924–3447 bytes gzip, below the existing 5120-byte per-skin gate; these are file sizes, not device performance results.

Fresh production in-app evidence covers all six light/dark appearances, zero-radius Square cards/fields, contextual Large panels, 2px action/input strokes, Flat shadows and reduced-effects artwork/material removal. Forest's reduced-motion preview retains its flag but computes leaf animation-name:none; the other five suppress animated flags. Focused Email Compose verifies square portaled dialog/fields and Escape focus restoration. Enter activates Save and retains focus; a typed project value survives switching skins; player selection and keyboard volume input survive a skin switch. The final browser console contained no warnings/errors. Screenshots and DOM observations: output/in-app-browser/theme-engine-implementation-2026-10-22/. The preview remains available on port 3016 with Winamp Signal restored. Mobile/hardware profiling remain user-deferred; OS preference emulation, full AT/contrast/zoom/forced-colors and additional framework fixtures were not performed. Personal mastery remains unchecked.

### Independent theme composition, five new themes and shared frame polish — 2026-10-22–23

Expanded the authoring document to schema version 2 and separated eleven material recipes from eleven frame recipes. All 121 combinations compile with the selected frame's explicit renderer. Original paired v1 documents migrate; SkinDefinition v1, the original six paths/IDs and installed preset v1/v2 remain supported. Added Ocean Depths, Candy Clay, Art Deco, Y2K Titanium and Material Light as ordinary documents through the same compiler, with independent static definitions, settings, CSS and procedural React/SVG exports. The core React package remains independent of the authoring engine. No model, image sprite, shader/GPU package or new dependency was added.

The playground now keeps examples on the left and a neutral, scrollable customization panel on the right. It provides a starter chooser, material/frame selectors, schema-derived bounded sliders, foundations, naming/forking and twelve local save slots with explicit failure/full-shelf feedback. Custom preset envelopes use version 3; direct documents can also be imported. Complete data drives SSR, URL restoration, history and exports. The authoring compiler has an eight-entry cache; static exported React uses a definition/settings object, full CSS and the matching renderer import without loading the compiler. Fixed CSS export's font-family spelling and clarified export instructions. A browser regression caught the Select's transient empty value when removing a custom option; the starter chooser now accepts only installed IDs or Original Dixy.

Compared Candy Clay directly with output/imagegen/2026-10-21-more-theme-directions/02-candy-clay.png. Replaced its beige/brown direction with lavender surfaces, tangerine actions, plum text, softer grain and fuller corners. Added shared cushion relief, text tint and corner fullness parameters alongside sheen, grain scale, light angle, surface mixes and geometry. These are reusable recipe parameters rather than Candy-ID component CSS. Sculptural scene illustrations from the concept remain application content, not injected controls.

Following the user's close-up feedback, components now own their border silhouette: removed the extra Button pseudo-border, new-frame continuous inlays, redundant Titanium outlines and Prism rim. Clay uses smaller freeform corner squiggles, Ocean retains coral/bubbles without another perimeter stroke, and Prism facets are smaller. Every Card/Dialog frame—including Forest's legacy renderer—uses the shared content-safe decoration band derived from insets; corner artwork also shrinks on small panels. Dense layouts can override three shared frame-clearance variables. The mail example uses that compact contract and a wider mailbox column inside the narrower preview. Labels, supplied icons and functional hit targets remain separate from artwork.

Final pnpm check passed 148 tests, type/freshness checks, 1462 complete examples and production builds. pnpm package:check passed independently installed declarations, all-eleven selected-only CSS/renderers, static settings, authoring/schema/documents exports, SSR, repeated SVG IDs/references and preference reductions. Static consumer checks exclude the compiler/schema and unselected artwork. Focused formatting passed. Selected skin CSS remains below the 5120-byte gzip gate; final byte figures are in packages/themes/dist/bytes.json. Core CSS remains 400.88 kB / 34.55 kB gzip. These are asset sizes, not device performance results.

Production in-app browser review at 1280×720 covered all eleven light/dark appearances, the five new default visuals and focused Ocean/Titanium/Clay/Prism border/content clearance. Verified custom Clay/Deco save, saved-shelf restore, URL/reload, direct document import, React/full-CSS/document exports, keyboard cushion edits and undo/redo. A mixed theme resolves Square cards/actions/fields to 0px. Flat removes panel/action/thumb shadows; reduced effects remove artwork/paint/shadows. Mail retained the typed reply through a frame change and used the compact 14px decoration band; its portaled Compose inherited the selected custom ID and frame. Escape restored Compose focus after exit. Player retained Glass Rivers and keyboard volume 66 through a frame change. Final fresh-tab console had no warnings/errors. A stale module error during preview asset replacement was resolved by restarting/reloading the production preview before final checks.

Evidence and screenshots: output/in-app-browser/theme-composition-2026-10-23/. Earlier comparison screenshots remain in output/in-app-browser/theme-composition-2026-10-22/. The final playground is running on port 3016 with Candy Clay ready. Mobile/hardware profiling remain user-deferred; OS preference emulation, full AT/contrast/zoom/forced-colors and other framework fixtures were not completed. No conformance or personal mastery claim is made. Engine contract, compatibility, controls and remaining work are saved in docs/THEME_ENGINE.md.

### Five additional theme concept boards — 2026-10-23

Used the built-in image_gen tool to explore Terminal Phosphor, Apple-inspired Liquid Glass, Risograph Club, Midnight Observatory and Inflatable Pop. Each board shows comparable existing-component types: hero/actions, player, fields, tabs, choices, slider/progress and button states. Visually reviewed all five and verified PNG signatures/dimensions. Saved originals, exact prompts and provenance under output/imagegen/2026-10-23-theme-directions/. The accompanying README identifies generated state/layout quirks to avoid during implementation, including Inflatable Pop's switch-thumb position and interlocking panel shapes in the print/observatory boards. No runtime code, dependency or installed theme changed; implementation/package tests were not required for image exploration. Images do not establish accessibility or performance, and personal mastery remains unchecked.

### No frame recipe and Orbital Command concept — 2026-10-23

Added the shared `none` frame recipe as the first Frame dropdown choice, labelled No frame. It preserves the selected material and content padding while suppressing decorative Card/Dialog borders and trim. The authoring compiler returns renderer:null; the generated lazy-renderer map omits this option, preview passes an explicit null, and exported React has no artwork import. Hidden decoration-only sliders and animation controls no longer suggest unavailable frame effects. Padding remains editable. Existing v2 documents and installed themes remain compatible; the matrix now covers eleven materials and twelve frame choices (132 combinations).

pnpm check passed 150 tests, freshness/types, 1462 complete examples and production builds. pnpm package:check passed standalone package declarations, authoring output, SSR and selected-asset isolation. Focused formatting passed. An initial concurrent package rebuild briefly removed declaration files during typechecking; checks were rerun after it completed. In-app browser evidence verifies Ceramic paint remains, zero optional artwork, 0px card border, retained 1px field border, No frame save/reload, light/dark, renderer-free React export and Enter activation of Save. Console observations were empty. Screenshot: output/in-app-browser/no-frame-2026-10-23/no-frame-dark.png. Mobile/hardware profiling remain user-deferred; full AT/OS-preference checks were not repeated. Personal mastery remains unchecked.

Also generated Orbital Command using the built-in image_gen tool in response to the additional request for an Expanse/cyberpunk-inspired spacecraft UI. Reviewed the original 1536×1024 concept: aerospace panels, crisp telemetry, a reserved lunar trajectory illustration and cyan/amber controls. Saved the image and exact prompt/provenance in output/imagegen/2026-10-23-theme-directions/06-orbital-command.png and 06-orbital-command-prompt.json. This is a concept board, not an installed theme; no image asset or graphics engine was added to runtime components.

### Playground performance audit and focused optimizations — 2026-10-23

Applied the web-perf skill and reviewed production assets, source, optional artwork DOM cost and actual in-app interactions. Trace/Lighthouse tooling and browser Performance entries were unavailable, so no Web Vitals, FPS or hardware claims were made. Saved docs/PERFORMANCE_REVIEW_2026-10-23.md and raw asset/DOM evidence under output/performance/theme-playground-2026-10-23/.

Stopped generating export code while its dialog is closed, memoized open export output and unchanged-preset derivation, lazy-loaded the component gallery, skipped unchanged stylesheet writes and added an active-preserving eight-style cap for authored themes. Preserved the finite installed packs and existing eight-document compilation cache. The static eager JS graph fell from 540,717 to 538,676 summed gzip bytes (2,041 bytes / 0.38%); the route module fell from 12,804 to 11,275 gzip bytes. A 332,780-byte gzip shared UI module remains the principal loading target. Forest's tested Overview had 3,829 elements / 3,110 preview SVG descendants; the same material with No frame had 618 / nine. These are structural measurements, not latency/paint results.

pnpm check passed 150 tests, 1462 complete examples, freshness/types and production builds. Focused formatting passed. This slice changed docs code only; public package/CSS checks were not required. In-app verification covered the deferred gallery, current-theme export, closed code-node absence, theme changes and nine ephemeral imports; one current authored stylesheet remained, and the forced eviction path was not exercised. Audit imports were not persisted to the saved shelf. Console observations were empty. User tabs were preserved. Mobile/hardware profiling and the full accessibility/device trace matrix remain deferred or untested; personal mastery remains unchecked.

### 2026-10-29 — DialKit theme recipe controls

- Added DialKit 2.1.0 to the docs app and replaced material/frame range controls with its controlled Slider component under Additional effects. Labels, bounds and steps still come from the public authoring schema.
- Values flow through changeThemeParameter into the same document used for preview, Undo, local saves and exports. Controlled values also follow preset restoration without a second store. DialKit remains a docs dependency.
- In-app browser: expanded all 14 controls in light appearance; keyboard Right changed Highlight strength from 0.50 to 0.55, updated the serialized URL document and enabled Undo. Visual layout inspected at the current narrow viewport. Docs typecheck passed.
- Package check attempted: blocked by the offline package mirror missing react-aria-components@1.22.1. Dedicated mobile, dark appearance and reduced-motion interaction checks remain untested.
- Full pnpm check passed, including contract generation checks, typechecks, tests, all 1,462 complete examples and production builds.

### 2026-10-29 — Quiet inspector playground

- Applied the selected first mockup direction: a larger preview beside a 300px inspector, a single scene picker, and prominent starting theme, accent and corners. Moved Undo/Redo into the toolbar and kept every preview scene available.
- Surface highlights, cushion relief and grain stay visible. Frame/spacing, advanced surface parameters, advanced foundations and local saves use native collapsed disclosures. Removed duplicate fork copy; edits continue through the existing theme document and export flow.
- DialKit rows now have 12px gaps and 42px height, with section spacing and labels constrained to leave room for values. Desktop preview and inspector scroll separately. Narrow previews use one column; mobile keeps all controls in document flow.
- In-app browser evidence: light desktop layout, dark appearance, frame disclosure, keyboard Highlight strength 0.50→0.55 and serialized state/Undo, plus 390px mobile layout (page width 390px, one 320px specimen column, 12px dial gaps). Native Enter collapsed the frame disclosure. Viewport override restored afterward.
- Reduced-motion CSS explicitly suppresses slider transitions; OS reduced-motion emulation and full screen-reader checks were not performed.
- Package check retried and blocked by the offline package mirror missing react-aria-components@1.22.1. No library exports or package contracts changed.
- Final Quiet inspector pnpm check passed: typechecks, tests, 1,462 complete examples and production builds.

### 2026-10-29 — Dixy Accordion and consistent inspector surface

- Replaced all five native sidebar disclosures (swatches, advanced foundations, frame/spacing, advanced surface, save/restore) with the public Dixy Accordion export. Shared docs composition uses Root/Item/Header/Trigger/Panel with multiple expansion, semantic headings and right-aligned rotating chevrons. Base UI continues to own state, focus and panel accessibility.
- Styled the plain accordion for the inspector with 48px headers, quiet separators, hover feedback and spaced panel content; retained the 12px DialKit row gaps. Reduced-motion rules disable panel/chevron transitions without changing library contracts.
- Removed the recipe wrapper background so Surface inherits the inspector surface. Browser computed background is rgba(0,0,0,0) in both light and dark; slider fills remain intact.
- In-app browser: Enter expands/collapses Frame & spacing; Tab from the closed frame header lands on Advanced surface, skipping hidden controls. Save & restore expands at 390px with page width 390px; desktop light/dark layouts inspected and viewport restored. Confirmed zero native details elements remain in the sidebar. OS reduced-motion emulation and screen-reader checks remain untested.
- pnpm check passed, including tests, typechecks, all 1,462 complete examples and production builds. pnpm package:check attempted again; its offline consumer install is still blocked by missing react-aria-components@1.22.1 in the package mirror.

### 2026-10-29 — Foundation naming correction

- Renamed the inspector accordion to Base foundations for base color, body font, elevation and control stroke. Renamed its deeper-settings button and dialog title to Advanced foundations.
- Verified both labels and the expanded base controls in the in-app browser. Copy-only change; prior mobile/theme/keyboard behavior was not retested. pnpm check passed.

### 2026-11-06 — Theme character: controls, motion, voice and details

Why: a review of the playground found the themes changed card frames but left controls, motion and type nearly identical. Without the frames, Retro OS, Candy Clay, Y2K and Art Deco looked alike. The library's goal is to be distinctive, so themes now also reshape what users touch.

- Theme document schemaVersion 4 adds a closed `character` block: control language (12), motion personality (6) with press depth and tempo, type voice (heading case/weight/tracking, numerals), state cues (6), details (focus style, dividers, text selection, scrollbars, icon stroke) and a gradient-only backdrop (9 patterns, intensity, scale). v3 documents migrate to a neutral character, and their compiled CSS stays identical (tested).
- `packages/themes/src/character.ts` compiles character to CSS on existing parts and state hooks only (`data-dixy-skin`, `data-checked`, `aria-busy`, `aria-invalid`, `:focus-visible`). Markup, labels, hit targets, refs and Base UI behaviour are unchanged. Thumb squash and the brass lever use the independent `scale`/`rotate` properties, so Base UI's thumb `transform` is untouched.
- Each starter has its own character. For example, Retro OS has a pixel bevel, stepped easing, marching-ants loading and dashed focus. Art Deco has diamond checkboxes, brass lever switches, a double focus outline, double dividers and a sunburst backdrop. All 11 control languages are unique (tested).
- Typography: added Fraunces, Poiret One, Silkscreen, Orbitron, Fredoka and Share Tech Mono as named stacks with system fallbacks (`themeFontPackages` maps each to its @fontsource package; exports include only the fonts a theme uses). Docs pin all six at 5.3.0.
- Safety rules: motion durations change only inside `prefers-reduced-motion:no-preference` and `:not([data-motion="reduced"])`; press depth is multiplied by the spatial factor; animated state cues also require effects not reduced; backdrops are hidden for reduced effects, `prefers-contrast:more`, forced colors and reduced transparency; focus styles keep an outline of at least 2px; an explicit Square radius beats a language's corner shapes; radios stay round.
- Playground: new Character section (control language, motion, backdrop, Type voice, States & details, Borrow a character); Shuffle button (deterministic per seed); Compare themes view (your theme beside three chosen starters, same controls); per-theme sample copy (`voice` in manifests/catalog); a chosen light/dark appearance now persists across starter switches until Reset. Original Dixy keeps a neutral character when edited instead of inheriting Material Light's.
- Material Light now differs from Original Dixy: porcelain halo controls, springy motion, light-weight tight headings and a faint dot backdrop.
- Rechecked the 2026-10-22 Studio Hardware radius issue: with Radius → Square, cards and buttons both compute 0px, so it was already fixed by the compiler.
- Tests: new packages/themes/test/character.test.mjs (7 tests: uniqueness, neutral migration parity, scoping, reduced-motion guards, reductions, focus width, closed data); docs playground tests for character round-trip, borrow, neutral Original, shuffle validity and catalog voice; skin-consumer SSR fixture now asserts schemaVersion 4 and published character.
- pnpm check passed (tokens 31, themes 21, docs 19, react 13 files, examples and production builds). pnpm package:check: offline install blocked by missing @swc/helpers@0.5.24 in the local store; `node scripts/verify-package.mjs --online` passed end to end. Selected skin CSS stays under the 5,120-byte gzip gate (largest Candy Clay at 4,334 B).
- In-app browser (1440×900): checked all 11 starters in Overview; Compare view with Forest/Retro/Candy/Deco; Art Deco keyboard Tab gives a `double` 4px outline at a 2px offset; Candy Clay with motion=reduced computes 0ms durations and spatial factor 0 (168ms with the springy curve otherwise); Dark persists from Retro OS to Candy Clay; Shuffle produced a valid ceramic/forest/pixel mix; 375px Retro OS has no horizontal scroll; no console errors after interaction.
- Not tested: OS-level reduced-motion/contrast/transparency emulation (CSS paths are covered by unit tests only), forced colors, screen readers, physical touch, hardware performance of backdrops, and visual review of every character × material × frame combination. Low-contrast combinations are possible with Shuffle. Personal mastery items remain unchecked.

### 2026-11-06 — Readable Shuffle

- `themeContrast(preset, appearances?)` in the playground measures, for light and dark, primary text against the material-tinted card surface, and the solid accent button against that surface. It reproduces the compiled `color-mix(in srgb, …)` for surface mix and text tint. Button label contrast was already enforced at 4.5:1 by `actionColors`, which throws otherwise.
- Shuffle now returns only themes with text ≥ 4.5:1 and buttons ≥ 3:1 in both appearances. It retries up to 48 derived seeds and is still deterministic per seed. If none pass, it removes text tint and tries known-safe accents. After a shuffle, the status line reports the measured ratios.
- Probe: 0 of 300 guarded shuffles fell below target; the lowest text ratio was 12.63:1. New tests cover 120 seeds plus a known low case.
- Finding, not changed: four starters have accent buttons below 3:1 against their own card surface in light appearance. Winamp Signal (1.59) and Ocean Depths (1.94) are dark-first, so this only affects light mode. Candy Clay (1.90) and Y2K Titanium (2.06) fall short in their recommended light appearance. Their button labels still meet 4.5:1. Changing their accents is a design decision for the owner.
- pnpm check passed. In-app browser: Shuffle from Original Dixy produced a ceramic/deco theme and reported text 13.3:1 and buttons 5.7:1; no console errors. The guard does not cover secondary/muted text, disabled states, backdrop patterns behind text, or ornament overlap; those were not measured.

### 2026-11-06 — Responsive Email and Dashboard playground scenes

Why: the Email preview used viewport media queries, but the preview canvas sits beside the customisation panel and is much narrower than the viewport. Its three separate cards squeezed into narrow columns, and the reader pane disappeared. The new layouts follow shadcn's mail and dashboard-01 blocks: one framed app shell with panes separated by dividers.

- New `apps/docs/src/styles/theme-scenes.css` uses container queries (`container: scene / inline-size`), so both scenes respond to the preview's own width. Breakpoints: ≥900px full sidebar and side-by-side panes; 640–899px icon rail (labels hidden, still announced through `aria-label`); <640px one pane at a time.
- Email (`theme-email-scene.tsx`): one `Card.Root` shell with nav, list and reader. The list and reader scroll independently inside a fixed 640px shell. Below 640px the nav becomes a top icon bar, and the list and reader swap with a Back button. Message rows use a native `<button>` (focus-visible ring, `aria-pressed`) with a separate star IconButton. Archive, Trash and Reply live in the reader toolbar and are disabled when no message is selected. The old viewport-based email rules were removed from `theme-skins.css`.
- Dashboard (`theme-dashboard-scene.tsx`, new "Dashboard" preview option): sidebar, header, four KPI cards with trend badges, a Visitors `Chart` with a 7d/30d/90d range toggle, Goals with `Progress`, and a documents `Table`. Inner `dash` container: KPI cards go 4 → 2 → 1 columns; chart and goals stack below 820px; Type and Owner columns hide below 540px, and the table scrolls horizontally in a focusable region. Desktop has a collapse-to-rail toggle. Below 640px the sidebar becomes an off-canvas drawer with a scrim, Escape to close, and focus moving to Close and back to Menu. Transitions are disabled under `prefers-reduced-motion`.
- Follow-ups from browser testing: below 640px the email shell now grows with its content instead of using a fixed 620px height, because the nested scroll left the message body about 200px tall on a phone. List ↔ reader swaps now move focus (Back button ↔ the selected message) instead of dropping it on `<body>`. The dashboard chart's caption is visually hidden, since the panel heading already names the chart.
- pnpm check passed (tokens, skins, docs metadata, typecheck, tests, builds).
- In-app browser (Original Dixy): Email at 1600px (216/340/fill panes), 1180px (60px rail, 300px list), and 375px (top icon bar; message opens the reader, Back returns, no horizontal scroll). Keyboard: Enter on a message focuses Back, and Enter on Back refocuses that message. Dashboard at 1600px (4 KPI columns, chart beside goals, full table), 1180px (rail, 2 KPI columns, stacked panels), and 375px (1 KPI column, Type/Owner hidden, table scrolls; Menu opens the drawer with a scrim and focuses Close, and Escape closes it and returns focus to Menu). Both scenes checked in Dark.
- Not tested: themed skins with frames or ornaments (for example Retro OS or the user's pixel theme), OS-level reduced motion (CSS guard only), screen readers, touch, and the light/dark × skin matrix. In this pane the drawer's slide transition stalled until forced; with the transition bypassed, the computed position was correct. Crossing the 640px breakpoint by resizing plays the slide-out once.

### 2026-11-06 — Window chrome: Winamp, Win9x and Scrapbook eras

Why: frames were thin trim around a modern rounded card, so starters differed mostly by colour. Winamp skins and social-profile pages looked different because of how the window was built: title bars, bevel stacks, display wells and chunky boxes.

- New `packages/themes/src/chrome.ts` and `character.chrome` (schemaVersion 5; v4 documents migrate to `defaultChrome`, which compiles to nothing; tested for parity). Title bar = `Card.Header`, window = `Card.Root`/dialog popup, display well = the `Card.Content` right after the header. Everything is CSS on existing parts plus `content:""` pseudo-elements, so Base UI refs, events, focus and semantics are unchanged.
- Starters: Winamp Signal now has a grip title bar with three window buttons, a four-layer pixel bevel, square corners and a dark LCD well (the old top rail is hidden when a title bar is present). Retro OS has a classic caption bar. Studio Hardware has a recessed panel with four screws. Art Deco has a stepped inset edge. Tactile Atelier has a hanging paper tab and a ruled-paper well. New Scrapbook starter: glossy blue-violet header, thick two-tone 16px box, tinted panel with zebra rows, pink accent and pearl controls. Its CSS is 3.7 KB gzip and it has no ornament renderer, so the generator and docs export skip `/react` for renderer-less skins.
- Playground: a new "Window chrome" inspector section (title bar, edge, well, corners). The Overview hero and Compare cards now keep the eyebrow in `Card.Header` and the headline in its own `Card.Content`, so the headline sits in the well. Compare defaults to Retro OS, Scrapbook and Art Deco.
- Contrast measured in the in-app browser: Winamp title bar 10.1:1, Winamp LCD 14.2:1, Retro caption 11.0:1, Scrapbook header 6.2:1, Scrapbook panel text 14.2:1.
- Size: Winamp Signal CSS is now 4,962 B gzip, close to the 5,120 B gate. The next Winamp addition will need trimming elsewhere.
- Tests: themes 23 (two new chrome tests), docs 21 (renderer-less skins allowed), React 97, tokens 31; SSR fixture asserts schemaVersion 5. pnpm check passed; `node scripts/verify-package.mjs --online` passed (offline store still missing @swc/helpers@0.5.24).
- In-app browser: Winamp Overview at 1440 and 375px (no horizontal scroll; title bar insets 4px inside the bevel); Compare with Retro/Scrapbook/Deco and Hardware; Atelier Overview; Scrapbook light and dark.
- Not tested: forced colors and screen readers in a real OS (CSS fallback is unit-tested only), long Card.Title/Description content inside title bars outside the docs, Winamp in light appearance, keyboard focus rings next to the title bar, touch. The six remaining starters have no chrome yet. Personal mastery items remain unchecked.

### 2026-11-06 — Window chrome for the remaining six starters

- New chrome values: `titlebar: glass` (light strip, three round lights tinted by accent and edge), `titlebar: chrome` (brushed light metal with fixed dark ink and pill buttons), `well: glass` (translucent canvas with a sheen; opaque under reduced transparency or more contrast) and `well: sunken` (soft deep inset).
- Assignments: Living Forest (double edge, tinted well), Prism Glass (glass bar, glass well), Ocean Depths (glass well, round corners), Candy Clay (pill edge, sunken well, round), Y2K Titanium (chrome bar, LCD well, notched corners), Material Light (sunken well). All twelve starters now have chrome, and a test asserts no two share a combination.
- Found while testing: in Y2K (a light theme) the ghost nav buttons inside the dark LCD well used `--dixy-button-secondary-text`, which the well didn't override, so they were dark text on black. The LCD well now also re-points neutral-button text and soft fills, the default border and the surface at its own ink.
- The No-frame test now also neutralises chrome corners, since notched corners use clip-path but are character, not frame output.
- Contrast scan in the in-app browser: every visible text element in the title bars and wells, composited through translucent backgrounds, for the six starters in light and dark (≈31 elements each). No failures besides disabled buttons, which WCAG exempts. The scan ignores background images, so it flagged Y2K's chrome bar text against the card behind it. The real pairing is #0d1418 on metal ≥ #aab5bc, about 8.8:1. After the LCD fix, the Y2K solid and soft buttons inside the LCD measure 7.8:1 and 7.4:1 against their own fills.
- Sizes: Winamp Signal 5,034 B gzip and Y2K Titanium 4,969 B, both under the 5,120 B gate but close to it.
- pnpm check passed (tokens 31, react 97, themes 23, docs 21); `node scripts/verify-package.mjs --online` passed.
- Not tested: forced colors and screen readers in a real OS, touch, phone width for the six (Winamp was checked at 375px earlier), long titles in glass/chrome bars, and how the glass well looks over busy backdrops on low-end hardware.

### 2026-11-06 — Living Forest polish

Why: Forest's starting parameters felt unpolished. The vines grew densely along every edge of every card, so gutters were overgrown and every card looked the same. The 2px frame plus the recent double edge doubled up with the vine stems. The tinted well added a boxy mint panel inside the paper card. The topographic backdrop at 0.35 read as a moiré. In dark mode the leaves were bright lime and looked like confetti.

- Ornament (starter only, applied after migration through a new `starterOrnaments` map, so saved v2 documents keep their own migrated defaults): density 68 → 32, corner density 78 → 90, canopy depth 48 → 34, variation 72 → 58, leaf scale 22 → 19, stem weight 40 → 30, seed 17 → 23, style Woodland mix → Wild ivy, canopy Scattered trails → Corner cascades, stem Twining vines → Tender shoots.
- Frame: width 2 → 1, padding 40 → 32 on all sides. Chrome: double edge and tinted well removed; corners now `round`, so the vines carry the structure.
- Backdrop: topographic intensity 0.35 → 0.1, scale 1.4 → 2.6 (fewer, fainter contour lines).
- Dark foliage palette (forest frame, all documents using it): `#4d7a42 #b0c978 #d1cd9b #a09b65` → `#4a7040 #7f9f5c #a3ad7c #857f55`.
- Method: tried three variants live in the in-app browser through playground URLs carrying a patched document: ivy at density 38, fern at density 24 (too sparse), and ivy at density 32 weighted to the corners (chosen). Checked light and dark at 1440×900.
- pnpm check passed (tokens 31, react 97, themes 23, docs 21). Forest CSS is 3,941 B gzip.
- Not tested: phone width, reduced motion with the new ornament (the motion setting is unchanged), and how other documents using the forest frame in dark mode look with the new palette. The canvas still draws its vines about a second after first paint. That is existing behaviour and not changed.

### 2026-11-06 — Forest leaves from real plants

Why: every forest style drew from the same six generic leaf shapes (ivy, oak, birch, willow, bud, fern), so changing the style changed the mix but not the silhouette. The user asked for different leaves inspired by nature.

- `organic-paint.ts` `petal()` gains seven species, each drawn from a real plant's recognisable feature:
  - ginkgo: a fan on a long stalk, with the centre notch and fine radiating veins
  - maple: a palmate leaf with five pointed lobes and a vein to each tip
  - eucalyptus: a silver-dollar sprig of round coin leaves in opposite pairs, shrinking toward the tip
  - olive: a narrow lance with a two-tone (silvery underside) fill
  - clover: a trefoil of heart-shaped leaflets with the pale chevron
  - blossom: a five-petal dog-rose flower, cream petals with a warm centre
  - berry: a small hanging rowan or elder cluster with a highlight
- Six new forest styles: Ginkgo fans, Maple grove, Eucalyptus, Olive branch, Clover meadow and Wildflower hedge. The hedge mixes ivy, blossom, birch, berry, fern and clover.
- The style names were added to `organicFrameRecipes.forest.styles`, which the schema already validates with `choice(organicStyles)`. That makes them additive: no migration was needed, and the existing styles keep their exact mixes, so saved documents look the same.
- Forest starter style: Wild ivy → Wildflower hedge.
- Blossom petals (`rgba(255,250,238,.94)`), blossom centres (`#d9a441`) and berries (`#a8473a`) use fixed natural colours. Everything else uses the frame's `--dixy-organic-a..d` palette.
- Method: all six new styles were rendered live in the in-app browser with a forked document ID (`trial/forest`). Wildflower hedge was also checked in dark mode. The dev server had to be restarted to pick up the new dist.
- `pnpm check` passed (react 97, themes 23, docs 21). The package verifier passed with `--online`.
- Not tested:
  - phone width
  - reduced motion
  - dark mode for the five other new styles
  - the browser pane only paints canvases after a screenshot when it is in the background, so live timing was not judged

### 2026-11-06 — Natural branching and a responsive playground header

Why: the user reported that the branches still looked weird. A screenshot showed a leaf on a long S-shaped stalk, like a lollipop tree. Three things stacked up:

- the twig curved 9px along the vine before turning out, which made a hook
- the leaf was then set at a random angle, which made a kink
- clover, ginkgo and maple drew their own long stalk on top

The hanging canopy stems had a separate problem: they were S-wiggles, and their leaves were placed on a sine curve rather than on the stem itself, so they floated beside it.

- Side shoots now leave the vine at a slant in its growth direction and arc outward. The leaf takes the twig's final direction (±0.15 rad), so there is no kink. Twigs are thinner (0.5–0.85px) with round caps.
- Hanging stems are one gentle arc. Leaves are placed with the stem's real bezier point and tangent and alternate sides like plant nodes.
- Leaf stalk length as a share of leaf length: clover 0.45 → 0.16, ginkgo 0.42 → 0.2, maple 0.28 → 0.14. Clover leaflets get a thin outline so they read as three leaflets rather than one cloud.
- Header: below 1100px the playground header overflowed its fixed 64px height because the action group wrapped.
  - The actions now stay on one row. Shuffle, Reset and Copy link go icon-only below 1100px; their labels are visually hidden, not removed, so the buttons keep their accessible names.
  - The two-row layout now starts below 760px (it was 540px).
  - Below 420px, Get code is icon-only too. The 44px touch targets are kept.
- Verified in the in-app browser:
  - header scrollWidth equals clientWidth at 880, 800, 620 and 375px, and there is no page overflow
  - Forest starter checked in dark mode at desktop width
  - `pnpm check` passed (tokens 31, react 97, themes 23, docs 21)
- Not tested: the header with the keyboard (the focus order is unchanged because only labels are hidden), Forest in light mode after the twig change, and the other leaf styles after the twig change.

### 2026-11-06 — App-shell aside joins the card

- Under Prism Glass, the email aside looked like a separate floating slab. The card has a 6px frame inset (`--dixy-skin-frame-inset`) and a 16px radius, but the shell inside had square corners, and the nav painted its own opaque `--dixy-color-background-surface`.
- `theme-scenes.css`: the shell is now concentric with the card, using `border-radius: max(0px, calc(var(--dixy-shape-container) - var(--dixy-skin-frame-inset)))` with `overflow: clip` (10px under Prism Glass). Its aside (email and dashboard) is tinted with `color-mix(in oklab, text-primary 4%, transparent)` instead of an opaque fill, so it reads as a region of the same card, and glass or textured skins show through. The library `Sidebar` was not used: it is a collapsible disclosure component, not a layout region.
- Verified in the in-app browser: Prism Glass dark at 1600px (email and dashboard) and the narrow single-pane email (the top bar follows the card curve). pnpm check passed. Not rechecked visually: Original Dixy light and the other skins (the computed radius falls back to the card radius when there is no inset).

### 2026-11-06 — Springy motion no longer flashes hover colours

- Bug: under Candy Clay ("Springy overshoot"), hovering ghost buttons such as the dashboard nav flashed. The springy recipe set `--dixy-motion-easing-standard` to an overshooting `linear(…1.12…)` curve, and that token also times `background-color` and `border-color`. Stepping the 168ms hover transition with `Animation.currentTime` showed lightness rising from the 0.919 target to 1.0 (pure white) at about 50%, then settling.
- Fix (`packages/themes/src/character.ts`): motion recipes now separate `easing` (all feedback, including colour, which must never overshoot) from `spatial` (bouncy movement). For springy, the standard easing becomes `cubic-bezier(0.22,1,0.36,1)`. The spring curve moves to a new `--dixy-motion-easing-spatial`, the movement-only component tokens (switch thumb, checkbox/radio indicator, tabs indicator) and enter motion. The clay control language reads the spatial easing for button/thumb `transform` and `scale`, so the squish still bounces.
- Test: `packages/themes/test/character.test.mjs` checks that no motion style's standard easing overshoots (linear stops outside 0–1, or bezier y outside 0–1) and that springy still emits the spatial curve. It fails on the previous recipe.
- Verified in the in-app browser (Candy Clay, dashboard nav): hover background lightness stays 0.919 and alpha rises steadily; button `transform`/`scale` still use the spring.
- Checks: themes tests 24/24 and the apps/docs typecheck passed. `pnpm check` and `pnpm package:check` failed only on the themes typecheck, in `organic-paint-world.ts`, a file another session is writing; no errors in files touched here. Not tested: other components under springy (switch, tabs and menus by eye), reduced motion (durations are already 0ms there).

### 2026-11-06 — Five new starters and eight more Google fonts

- New starters, each built entirely from the existing swappable parts (material, frame, ornament painter, character, chrome, backdrop, fonts). No theme-specific code paths:
  - **Blueprint**: cyanotype grid material, drafting frame (dimension lines labelled with the card's real size, ruler ticks, compass arcs, registration marks), IBM Plex Mono, instrument controls, dark by default.
  - **Riso Zine**: riso-paper material, two-ink off-register trace, halftone corners, torn tape, Archivo Black headings, stamp states, halftone backdrop.
  - **Neon Night Market**: wet-asphalt material, glowing tubes with a hot core, broken tubes with electrodes, sign shapes, Tilt Neon headings, glow focus, scanline backdrop.
  - **Sumi Ink** (Japanese): washi material, four-stroke tapered brush border with dry-brush gaps, bamboo, plum blossom, ensō, an abstract hanko seal (no real characters), Shippori Mincho headings.
  - **Tokyo Transit** (Japanese): station-enamel material, route lines bending 45°, station roundels ("G07"), interchange pills, a tactile yellow platform edge, Zen Kaku Gothic New, LED state cues.
- Each frame has four styles plus the shared variation, motion and density sliders. Painters live in `packages/themes/src/organic-paint-world.ts`, and each ornament is its own package entry (`@dixy-ui/themes/<slug>/react`).
- Modularity fix: the docs playground hard-coded which frames are canvas-painted. `isOrganicFrameId` now delegates to `isOrganicFrame` from `@dixy-ui/themes/authoring`, so new painters appear without docs changes.
- Fonts: `fontKeys`, `themeFonts` and `themeFontPackages` gain the following. Every stack falls back to a close system face, and every package is pinned at 5.3.0.
  - plex (IBM Plex Mono)
  - archivo (Archivo Black)
  - neon (Tilt Neon)
  - mincho (Shippori Mincho)
  - gothic (Zen Kaku Gothic New)
  - playfair (Playfair Display)
  - caveat (Caveat)
  - bricolage (Bricolage Grotesque)
- The docs only load the Latin subsets, so Japanese glyphs fall back to Hiragino and Yu fonts.
- Fixes found in review:
  - Riso's notched clip-path cut off the ornament canvas, so its corners are now `inherit`.
  - Sumi's paper well looked like a notebook and was replaced with pixel corners.
  - Sumi's `cornerScale` of 0.4 was below the schema minimum, so it is now 0.5.
  - The character test now expects 12 distinct control languages.
- Verified:
  - `pnpm check` passed.
  - `node scripts/verify-package.mjs --online` passed.
  - The skin CSS gzip for each new skin is between 3.6 and 4.1 kB, under the 5,120 B gate.
  - In the in-app browser at desktop width: Blueprint dark, Riso light, Neon dark, Sumi light and dark, and Transit light.
- Not tested:
  - Riso and Transit in dark mode, and Blueprint and Neon in light mode
  - the non-default styles of each painter
  - mobile widths for the new themes
  - keyboard focus on the new controls and chrome
  - OS reduced motion (painters only animate while `playing`, and flicker needs motion > 0)
  - forced colours and screen readers

### 2026-11-06 — One outline contract for every canvas frame

- Problem: some frames bent their outline away from the card shape, so they read as squiggles next to the crisp controls inside.
  - Ocean: five strands with ±3.7px waver, each with its own seed, so they crossed.
  - Candy Clay: a ±2.7px lumpy tube.
  - Sumi: bamboo floated beside the card, with gaps that looked like ruler ticks.
- Contract (`packages/themes/src/organic-paint.ts`): `trace()` caps waver at the exported `maxWaver` = 1.5px. Every painter's outline follows the card's rounded rectangle, and character comes from ornaments, texture and colour.
- Ocean: the strands share one seed and are 1.6px apart, so they stay parallel like contour lines. Bead drift off the line went from ±6px to ±1.5px.
- Sumi:
  - Bamboo grows from a ground stroke that continues the bottom border past the corner.
  - The stalk is one tapered stroke with bowed node rings.
  - Leaves droop in fans from the upper nodes. The fans that point toward the card are short enough to stay in its padding.
  - The plum branch now starts at the top-left corner of the frame.
- Verified in the in-app browser (light, desktop): Ocean, Candy Clay and Sumi follow the card shape, and `pnpm check` ran.
- Not rechecked: Forest (its vine waver is now capped too), the other painter styles, dark mode, and mobile width.

### 2026-11-06 — No starter title bars; calendar spacing

- Title bars: the window-chrome title bar (the strip with buttons above card content) added height without meaning, so no starter ships one now.
  - It was removed from Winamp, Retro OS, Atelier, Prism, Y2K, Riso, Transit and Scrapbook. Their edge, well and corner chrome stays.
  - Riso moved from a stepped edge to a double edge so it doesn't share Art Deco's chrome.
  - The title bar is still an opt-in playground choice.
  - The character test now checks that every starter uses `titlebar: "none"`.
- Calendar (`packages/react/src/styles/additions.css`; covers Calendar, RangeCalendar and both date pickers):
  - Header: the nav row (any wrapper holding `[slot="previous"]`) puts the arrows at the edges and centres the month heading. The heading ellipsizes. The arrows are square buttons sized to the interaction target.
  - Width: the calendar takes a definite width of 7 × day size, plus gaps, padding and border, with `max-inline-size: 100%`. Before, the calendar either spilled out of narrow cards (a 296px grid in a 223px card) or, once the grid was fluid, stretched to the popover's 1342px maximum.
  - Grid: a fixed table layout with 2px spacing; days are square (`aspect-ratio: 1`) and shrink evenly in narrow containers.
  - States: added hover and pressed fills. Today is underlined. Days from other months use the tertiary text colour at 60% opacity. In a range, only the start and end are outlined and the days between share a soft fill.
- Verified in the in-app browser:
  - the docs Calendar at 1400px and in the narrow docs preview
  - the DateRangePicker popover (344px wide, 40px days), with a range picked by keyboard (Enter, arrows, Enter)
  - `pnpm check` and `pnpm package:check` passed
- Not tested:
  - dark mode
  - OS reduced motion (the hover transition uses the field motion token)
  - `sm` and `lg` sizes
  - screen readers
  - whether `data-today` is set in every React Aria version
  - In very narrow containers (about 220px) the days shrink to about 24px, below the 44px touch target.

### 2026-11-06 — Workspace overview for the theme playground

- Problem: the Overview preview was a bento of unrelated specimen cards, so a theme was judged one widget at a time rather than as a product.
- Process: two HTML/CSS directions were mocked in `output/overview-mockups/` (A: workspace screen, B: specimen sheet). A was chosen.
- Change:
  - New `WorkspaceScene` (`apps/docs/src/components/theme-workspace-scene.tsx`) replaces `OverviewContents` in `theme-playground.tsx`. It has a sidebar, a top bar (breadcrumbs, search with ⌘K, primary action), a greeting with a Day/Week/Month toggle group, three stat cards (accent solid card, reviews, and a storage card whose Slider changes the used percentage and badge), a projects card (Tabs filtering a Table with status Badges, Progress, AvatarGroup and a per-row Menu), a "Start something" form (Field, RadioGroup, Switch, Checkbox), activity and a dismissible Alert.
  - Every part is a public Dixy export. The skin voice still supplies the eyebrow, headline, body and primary button.
  - `apps/docs/src/styles/theme-workspace.css` holds layout only: semantic colour, type, radius and shadow tokens, and a `workspace` container query (≤1080px stacks the split, ≤820px hides the sidebar, ≤640px trims the top bar, stacks stats and hides optional table columns).
  - Card parts keep the `Card.Header` + `Card.Content` order so window-chrome wells (`packages/themes/src/chrome.ts`) still apply.
  - Removed 221 lines of orphaned `.theme-specimen*` rules from `theme-skins.css` and the unused `.theme-form-status` rule.
  ```tsx
  <Card.Root variant="solid" color="accent">   {/* accent stat follows the theme */}
  <Tabs.Panel value={tab}><ProjectRows rows={projects.filter((p) => p.tab === tab)} /></Tabs.Panel>
  ```
- Verified in the in-app browser:
  - default light and dark at 1440px; Retro OS and Living Forest skins
  - 375px: no document overflow, and the table fits its card (221/221px) after hiding glyphs and optional columns
  - keyboard: Enter opens a row Menu, Escape closes it and returns focus to the trigger; arrow keys move between project tabs
  - "Create project" adds a toast and changes the badge to Created
  - `pnpm check` passed (97 React tests, typecheck, builds)
- Not tested: OS reduced motion (no custom animation was added; components keep their own guards), forced colours, screen readers, other skins and organic frames, touch devices.
- Note: a duplicate playground instance appeared once after Vite hot reloads failed mid-edit; a clean reload rendered a single instance.

### 2026-11-06 — Fifteen launch starters, composed ornaments and switch fixes

- Problem: the launch needed about 20 starters, including terminal/TUI, sci-fi and festival themes and a liquid-glass look. A first pass of the festival painters stamped the same motif on every card corner (Diwali rangoli) and sliced soft powder clouds against the frame clip (Holi). Switches also misbehaved: in the brass control style the diamond thumb slid diagonally out of the track, and squeezed tracks let thumbs overshoot.
- Change:
  - 15 starters (32 in total): Phosphor Terminal, ANSI Panes, Swiss Poster, Azulejo Tile, Brutalist Concrete, Atomic Lounge, Orbital HUD, Freighter, Solar Sail, Diwali Lights, Lunar New Year, Papel Picado, Holi Colours, Yule Knit and Glass UI. Each one has:
    - a v2 document, character and unique chrome (`packages/themes/src/starters-launch.ts`)
    - a material and frame recipe (`recipes.ts`) and an organic recipe with 4 styles and light/dark palettes (`organic-settings.ts`)
    - its own `<dir>/ornament.tsx` entry, a frame prefix and a detail keyframe (`frame-styles.ts`)
    - package exports, SSR fixture and package-check rows
  - Fonts: VT323 (`terminal`) and JetBrains Mono (`jetbrains`), pinned Fontsource 5.3.0 with `@font-face` rules in `docs.css`.
  - The painters live in a new file, `organic-paint-launch.ts`, which composes by card size instead of stamping:
    ```ts
    const tierOf = (w, h) =>
      w >= 440 && h >= 160 ? "hero" : w < 300 || h < 140 ? "small" : "card";
    const choose = (index, seed, salt, n) =>
      Math.floor(rand(seed * 0.173 + index * 7.31 + salt * 3.7) * n) % n;
    function room(x, y, w, h, l) {
      /* distance to content box: soft marks stop short of it */
    }
    ```
    - A hero card gets the full scene, a regular card one accent, and a small card one detail.
    - Each instance picks its accent corner and ink from its own index.
    - Diwali clips to the card's own rounded rectangle: a toran hangs from the top edge, a corner rangoli sits in the padding and lamps stand on the card's floor, so neighbouring cards never collide.
    - Holi cloud radii are capped by `room()`, so the content clip never cuts them.
  - Shared fixes:
    - `chrome.ts`: the recessed, tinted, glass, sunken and paper wells reset text to `--dixy-color-text-primary`, because the on-accent text of solid cards vanished on a repainted well.
    - `character.ts` brass: switch thumbs travel with `transform`, which CSS applies after the individual `rotate`/`scale` properties, so the rotated thumb slid along the diagonal. The diamond is now a `clip-path` polygon. The clay press squash is now `scale: 1 y`, so it no longer stretches the travel.
    - `packages/react/src/styles/primitives.css`: `.dixy-switch-root` gets `flex-shrink: 0`. In the workspace form row the 40px track shrank to 37.9px and the thumb ran 2px past its end.
- Verified (in-app browser, docs on :3001):
  - All 15 starters in light and dark.
  - The reworked Diwali and Holi compositions, plus Glass UI in light and dark.
  - Switch geometry measured in both states for brass, clay, pixel, instrument, pearl, hardware and chrome: thumb vertically centred, 2px inset at both ends, 40px track.
  - Typecheck and theme tests passed. Every skin's CSS is under the 5,120 B gzip gate (largest is Freighter at about 4.3 KB).
- Not tested:
  - mobile width
  - keyboard, OS reduced motion, forced colours, screen readers
  - every painter style other than each starter's default
  - Picado, Lunar, Yule, Atomic, Azulejo, Freighter and Solar Sail after the tier rework (only Diwali, Holi and Glass UI were re-viewed)
- Known gap: the system has no per-card `backdrop-filter`; the only blur is a fixed 8px on the theme backdrop layer. Glass UI therefore approximates glass with translucent tints, a specular inset and a canvas rim. Muted labels on dark glass are low contrast.

### 2026-11-06 — Intrinsic-width labels and actions, and an Overview component wall

- Problem:
  - In the base theme, badges wrapped their text ("2 waiting", "Healthy", and "In progress" at 375px in the States preview), which pushed stat labels onto broken lines.
  - Badges, chips, kbd and buttons placed in a column `Stack`, a `Card.Content` grid or an `Empty` grew to the container's full width. The "New release" badge measured 384px for an 83px label.
  - The playground's Overview (a product workspace) looked too much like the Dashboard preview.
- Change (library CSS):
  - `additions.css`: `.dixy-badge`, `.dixy-chip`, `.dixy-kbd` and `.dixy-avatar-count` get `inline-size: fit-content; white-space: nowrap; flex-shrink: 0`. As grid or column-flex children, they now keep one line at their own width.
  - `components.css`: `.dixy-button` gets `inline-size: fit-content`. A button is as wide as its label unless the author sets `inline-size: 100%`; author CSS wins because the library sits in `@layer dixy.components`. Vertical `ButtonGroup` children reset to `inline-size: auto`, so they still stretch.
  - `.dixy-empty-content` gets `justify-items: center`, so intrinsic actions follow the centred empty-state copy.
  - `.dixy-checkbox-root` and the visual `.dixy-radio-root` get `flex-shrink: 0` (the same reason as the switch fix: a long label must not squeeze the control).
  ```css
  :where(.dixy-badge, .dixy-chip, .dixy-kbd, .dixy-avatar-count) {
    flex-shrink: 0;
    inline-size: fit-content;
    white-space: nowrap;
  }
  ```
- Change (docs): two consumers that relied on stretched buttons now say so: `.theme-skin-option` and `.theme-track-row` add `inline-size: 100%`.
- Change (Overview): `theme-workspace-scene.tsx` and `theme-workspace.css` are rewritten as a column masonry of 10 small compositions, after you chose direction A (the mock is `output/overview-mockups/c-showcase-directions.html`). The compositions are:
  - sign-up form
  - revenue `Chart`
  - notification switches
  - team with a role `Menu` (radio items)
  - pricing with a `ToggleGroup` and checkboxes
  - `RangeCalendar`
  - filters with `TagGroup` and a range `Slider`
  - `OTPField`
  - inline `Command` with `Kbd`
  - upload with `Progress`, `AvatarGroup` and `IconButton`

  Every card is `Card.Header` + `Card.Content`, so wells, titlebars, frames and ornaments apply. The skin voice still drives the eyebrow, headline and toast copy. Full-width actions opt in with `.theme-wall-wide`.

- Verified (in-app browser):
  - Before/after width diff of every button and badge across all eight preview views, with all 78 gallery demos loaded. Only the stretched cases changed, plus Player track rows, which were then fixed in docs.
  - Audit script (wrap, stretch, overflow, squeeze) is clean on the base theme at 1440px and 375px in light and dark. "In progress" no longer wraps. Papel Picado at 820px and 1280px is clean.
  - New Overview, all clean at 375px with no page overflow:
    - Base: light 1440px, dark 375px.
    - Papel Picado: light and dark 1440px (canvas garlands).
    - Orbital HUD: 1440px and 375px (hud frame).
    - Retro OS: 375px.
  - Keyboard: the role menu opens with Enter, Arrow + Enter changes the role, and Escape closes it and returns focus to the trigger.
  - `pnpm check` passed: 97 React tests, the themes, tokens and docs tests (0 failures), typecheck and builds. `pnpm package:check` passed: install, declarations, ESM/SSR, browser builds and CSS exports.
- Note: the long-running docs server on :3000 (another session's) failed SSR for the newer launch skins ("The skin finish could not load"). A fresh server on :3002 loads them, so this is stale server state, not this change.
- Not tested:
  - OS reduced motion (the wall adds no motion of its own)
  - forced colours, screen readers, touch devices
  - the gallery under skins other than the base theme
  - Candy Clay, Art Deco and the other frame skins on the new Overview
  - consumer apps outside this repo that relied on buttons stretching in a grid or column flex. They now need `inline-size: 100%`, which is a visible behaviour change worth a release note.
- Follow-up (same day), stray ornaments under the Overview: the wall first used CSS multi-column. Each canvas ornament starts 32px above its card. For the first card in a column (Team, Filters), that bleed fell into the previous column's fragment, so Chrome painted the whole canvas at the bottom of the previous column. That left flowers and lamps floating below the grid and stretched the canvas, in every skin with bleeding decoration. The wall now uses three explicit `.theme-wall-col` stacks in a grid, so no card is ever fragmented. Below 52rem the stacks become `display: contents` in a 2-column grid; below 34rem there is a single column. Verified in the in-app browser: every canvas lies within 48px of its own card for Papel Picado at 1440px, 1024px and 375px, and for Holi at 1440px. Diwali has no overlap at 1440px. There is no page overflow at 375px. A hidden browser pane never reveals streamed SSR Suspense content (React waits for an animation frame), so ornaments were checked after a client-side view switch.

### 2026-11-06 — Shuffle stops putting a black LCD well inside light cards

- Problem: Shuffle picks a starter's whole character, chrome included, onto a random material. The `lcd` well paints a fixed `#060906` ground in both appearances, so about 1 in 10 shuffles (48 of 500 seeds) put a near-black, scanlined panel inside a light paper card. Every material already follows the appearance (light tint for light, dark tint for dark), so the fixed well was the only light/dark clash source among material + well.
- Change:
  - `packages/themes/src/chrome.ts` adds `wellGrounds`, one trait per well: `surface` (none), `canvas` (recessed, tinted, paper, glass, sunken), or `fixed` with `color`, `tone`, `inkAccent` and an appearance-following `substitute` (LCD → recessed). The LCD CSS now reads its ground and ink mix from the trait, so the measurement and the paint cannot drift. Exported from `@dixy-ui/themes/authoring`.
  - `themeContrast` (docs) now also returns `well`, the largest surface-to-well luminance ratio across both appearances, and measures text and the accent button against the well's own ground as well as the card. Shuffle requires `well ≤ 3` (`shuffleContrastTargets.wellStep`); canvas wells measure ≈1.1–1.4, the LCD 16–18 on a light card and 1.3 on a dark one.
  - `adaptWellForShuffle` swaps a clashing fixed well for its substitute instead of re-rolling, so the terminal and Y2K characters still appear in shuffles with a recessed panel.
- Decision: the compiler still keeps the LCD dark in both appearances. Winamp Signal, Y2K Titanium and Phosphor choose a dark display on a light card on purpose, and a hand-picked well is an explicit author choice. Shuffle is the only path that combines parts nobody chose together, so the rule lives there.
- Verified:
  - Node: 500 seeds before → 48 LCD wells; after → 0, worst step 1.36. New tests: 400 seeds with no fixed well, step ≤ 3, text ≥ 4.5:1 and buttons ≥ 3:1 on card and well; Winamp's LCD measures > 3 in light and ≤ 3 in dark and is swapped to `recessed`; Candy Clay is untouched.
  - In-app browser (docs dev server on :3001, playground): 50 shuffles in the dark preview and 50 in light, zero LCD wells, worst computed card-to-well step 1.34:1, no console errors.
  - `pnpm check` and `pnpm package:check` passed.
- Not tested: frame-painted (organic canvas) ornaments and title bars (grip, caption and gradient bars are fixed dark strips with their own ink, judged acceptable as small bands); forced colours; OS reduced motion; mobile width after shuffle; screen readers. The playground does not warn when an author hand-picks LCD in a light theme.

### 2026-11-06 — Inspector warns about a clashing display well

- Decision (with the user): picking the LCD well by hand in a theme with a light card should warn about likely bad UX, without blocking it. People can still make odd themes on purpose.
- Change: `wellClash(preset)` (docs lib) reuses the shuffle measurement. It returns the clashing appearance, the step, the well's tone and its substitute when a fixed-ground well exceeds `wellStep` in either appearance. Otherwise it returns `null`. The Window chrome section shows an amber `.theme-mixer-warning` (`role="status"`, warning border tokens) under Display well, for example: "LCD display stays dark in both appearances, so the light theme gets a near-black panel on a light card (18:1)…". It has a "Use Recessed with screws" button. The LCD stays applied until the author acts. The swap unmounts the warning, so focus returns to the Display well picker.
- Verified:
  - Unit test: Winamp's LCD reports a light-appearance clash with substitute `recessed`; the swapped theme and Candy Clay report none.
  - In-app browser (:3001 playground): choosing LCD on a Ceramic card shows the warning and keeps the LCD. Text is readable in both docs themes (light ink on dark). The button swaps to Recessed, clears the warning and focuses the picker. `pnpm check` passed.
- Not tested: screen reader announcement, 375px layout of the warning, forced colours.

### 2026-11-06 — Original 12 starters ported to the HTML redesign

- Context: the user reviewed an HTML mockup of the first 12 starters. They liked Winamp, Studio Hardware, Prism Glass and Retro UI, and said the rest needed fixes. They asked to "Port all 12".
- Change:
  - Schema v6: two material parameters, `backdropBlur` (0–40 px) and `backdropSaturate` (100–200 %). Migration 5→6 adds neutral defaults (0 / 100), so older documents compile with identical paint. The compiler emits `backdrop-filter` on surfaces only inside `@supports`, and drops it under `prefers-reduced-transparency`. The recipe mixer exposes both values under "Advanced surface".
  - Optional `darkCanvas` on material recipes. Prism Glass, Sea Glass and Pixel Enamel use it for a distinct dark backdrop.
  - Materials retuned for all 12, plus a new `scrapbook-paper`. Retro OS's desktop teal is now #7fc2bc, so muted text keeps its contrast.
  - Per-starter foundations: accent, neutral, radius, fonts, appearance and border, using the mockup's palette and type. Added a `starterMaterials` override map (glass blur for Prism 22/160 and Ocean 14/130). Retuned character for Prism, Ocean, Deco, Scrapbook, Winamp and Retro. Y2K chrome is now line/tinted/notched.
  - Fonts: Manrope, Figtree and Cormorant Garamond (variable). Fontsource packages pinned at 5.3.0, with `@font-face` rules in `docs.css`.
  - Tests: legacy fixtures strip the v6 fields; schemaVersion asserts are 6 (themes tests, docs test, `fixtures/skin-consumer/ssr.mjs`). The shuffle-session contrast test now builds its own pale peach accent, because Candy Clay is pink now.
- Kept on purpose (test contracts): Living Forest `accentColor: "grass"` with a custom green accent; botanical controls (all 12 control styles stay in use); Candy cushion 0.85.
- Verified:
  - In-app browser (:3001 playground): all 12 in light. Winamp, Candy Clay, Prism Glass, Ocean Depths and Retro OS in dark.
  - Every skin ≤ 4,646 B gzip (Ocean is the largest).
  - `pnpm check`, `pnpm package:check` and `node scripts/verify-package.mjs --online` passed.
- Not tested:
  - Dark mode for Forest, Hardware, Atelier, Deco, Y2K, Material and Scrapbook.
  - Mobile width, keyboard, OS reduced motion, reduced transparency and forced colours.
  - Safari's `-webkit-backdrop-filter` path.
- Known gaps:
  - The ornament painters for these 12 are mostly unchanged (only the Forest density moved).
  - The mockup's feature pieces (LCD readout, knob, orb, tape) are preview-only.
  - Winamp keeps its fixed-dark LCD well in light mode. The well-clash warning flags this; it was left alone.
  - The Studio Hardware orange renders darker than in the mockup, because of the accent contrast mapping.

### 2026-11-07 — Landing page with a live theme studio

- Decision: the landing page **replaces** the home route (`/`) instead of living alongside it. The old `/` was already a marketing-style overview inside the docs shell, and two front doors would compete. `/` now renders outside `DocsShell` (like `/playground`) with its own sticky header, so the hero and showcase can use the full width. The docs nav "Introduction" and the shell's home links still point at `/`.
- Change:
  - `apps/docs/src/routes/index.tsx`: hero (pill, headline, install command with copy + status, CTAs to installation and `#themes`), a theme studio, a features grid, an index of every registry component, and a closing CTA to `/playground`.
  - Theme studio reuses the playground machinery, not a copy: `skinThemePreset(id)` builds the preset, `prepareSkin()` injects the starter's CSS, `materials.css` loads on demand, and `playgroundThemeProps()` feeds a nested `<Theme>`. Copy comes from `previewVoice()`. A request counter drops stale loads when someone clicks quickly. "Customise in playground" passes `serializeThemePreset()` as `?theme=`, so the playground opens on the same starter and appearance.
  - Starters are a Base UI `ToggleGroup` (one tab stop, arrow keys). On phones it is a horizontal strip. The preview follows the page appearance until the visitor picks Light or Dark for it.
  - `apps/docs/src/components/landing-showcase.tsx`: one small product built only from public exports. It has Card, Badge, Button, a Dialog with a Form, Progress, Tabs, a Table with a per-row Menu (checkbox item and danger item), a Switch, a Select, TextField, a Checkbox, Avatar and Toast.
  - `apps/docs/src/styles/landing.css`: layout only inside the canvas. Smooth anchor scrolling only under `prefers-reduced-motion: no-preference`.
  - The install command reads `pnpm add @dixy-ui/react @dixy-ui/themes`, labelled "Provisional package names. Not yet published to npm."
- Verified (in-app browser, docs dev server on :3001):
  - All 33 options (Original + 32 starters) applied by script with no horizontal overflow and no console errors. Visually checked: Living Forest (light), Neon Night Market (dark), Glass UI, Winamp Signal (dark).
  - Page dark mode via the header toggle; the preview follows it.
  - 375px: `scrollWidth` = 375 after fixes (install pill now shrinks; table cells no longer break mid-word and scroll inside a focusable `role="region"`).
  - Keyboard: one tab stop in the starter group, ArrowRight ×3 + Space selects Winamp Signal; the Invite dialog opens on Enter, focuses the email field, is themed through the portal, and Escape returns focus to Invite; the Select changes region by keyboard; the form submit raises a toast.
  - "Customise in playground" opened `/playground` with Neon Night Market in dark.
  - `/docs/installation` still renders inside the docs shell.
- Not tested: OS reduced motion (no emulation in the pane; reviewed in code only: the smooth-scroll rule is gated, and the nested Theme uses `motion: "system"`), forced colours, screen readers, Safari, touch scrolling of the starter strip on a real phone, and the visual quality of every starter at 375px (only the base theme was viewed at 375px).
- Known gaps: the old overview styles in `docs.css` (`.overview-*`, `.hero-*`, `.principle-strip`, `.component-card*`, `.learning-banner`) are now unused and were left in place to avoid colliding with other sessions' edits to that file.

### 2026-11-07 — Landing v2: whole-page theming and HeroUI-style sections

- Bug fixed: "App appearance requires its root provider" after a package rebuild. `app-appearance-provider.tsx` imports `preview-theme.ts`, which imports `@dixy-ui/tokens`. A tokens rebuild therefore re-ran the module, so Vite created a new context object while the mounted root still provided the old one. Every consumer then threw until a full reload. The context now lives alone in `components/app-appearance-context.ts` with type-only imports, so hot updates keep its identity. Verified: with `/docs/installation` open, `pnpm --filter @dixy-ui/tokens build` hot-updated `__root` and `docs-shell` with no new errors.
- Change (user request): the chosen starter now themes the **whole landing page**, not just a framed preview. One `<Theme {...playgroundThemeProps(preset)}>` wraps the page. The page background uses `--dixy-skin-ground` / `--dixy-skin-canvas`. Light/dark is the site-wide appearance (header toggle and dock share it).
- Change (user request): every visible piece is a Dixy component: Button, IconButton, Badge, Heading, Text, TextField, Card, Toggle/ToggleGroup, Select, Tabs, Separator, Chip, Kbd, Switch, Slider. Navigation buttons use a docs-only `ButtonLink` / `ButtonAnchor` (`components/button-link.tsx`): a Dixy Button rendering the router `Link`, with `nativeButton={false}` and `role="link"`. This is needed because Base UI gives non-native buttons `role="button"`, and navigation must announce as a link.
- Change (user request, after reviewing heroui.com): sections were re-planned before building.
  1. Header.
  2. Hero with install field.
  3. **Live app window**: Dixy Tabs switch between Mail, Dashboard and Music (the playground's scene components, imported unchanged and lazy-loaded) and the original Blocks composition. A **floating theme dock** holds a starter Select, Shuffle, Light/Dark and "Customise".
  4. Starter gallery: 33 selectable cards in a ToggleGroup.
  5. Bento "why Dixy" with live widgets, including the current theme's material/frame/fonts.
  6. Ship-it code snippet.
  7. A **small** components strip: count, 8 links, Browse all.
  8. Final CTA card and footer.
- Fix during build: one `<Suspense>` around all four panels broke panel swapping; now each panel has its own boundary.
- Fix during build: dark Shiki colours were keyed to `.docs-app` only; `landing.css` adds the same rule for `.landing`.
- Verified (in-app browser, :3001):
  - All 33 starters applied from the gallery: no horizontal overflow, no console errors.
  - Visually checked Living Forest (dark) across every section, and Retro OS at 375px.
  - With rendered frames, each window tab mounts only its own panel. Scripted runs while the pane was hidden showed panels piling up: Base UI unmounts an exiting panel after an animation frame, and hidden documents pause frames.
  - All 18 link-buttons have `role="link"`.
  - Keyboard: dock Select (Enter, ↓↓, Enter) applied Living Forest, returned focus to the trigger, and announced "Living Forest applied."
  - 375px: page `scrollWidth` 375. The dock wraps into two rows after a fix (it was cramped). The dashboard's own table scrolls inside its card.
- Not tested:
  - OS reduced motion (no emulation; code review only: smooth scroll is gated, and the Theme uses `motion: "system"`).
  - Forced colours, screen readers, Safari, real touch devices.
  - Every starter at 375px (only Retro OS).
  - The Mail/Dashboard/Music scenes at 375px under each starter.
  - Light appearance for most starters on the new sections.
- Known gaps:
  - The chosen starter is not persisted (no URL param or cookie); a reload returns to Original Dixy.
  - Docs pages do not adopt the landing's starter.
  - `theme-skins.css` is imported for the Music scene and also carries playground inspector styles.
  - The old overview styles in `docs.css` are still unused.

### 2026-11-07 — Landing starter saved in the URL

- Decision (user): persist the chosen starter in the URL, so a reload or a shared link keeps it.
- Change in `apps/docs/src/routes/index.tsx`:
  - `/?starter=<slug>` (for example `living-forest`). `validateSearch` drops unknown slugs, so a bad link falls back to Original Dixy. Choosing Original Dixy removes the parameter.
  - The route loader inlines the starter's CSS (and `materials.css` when the starter uses a finish) through `head.styles`, as `/playground` does, so the server HTML is already themed.
  - `useStarter` reads the URL as the source of truth. Selection still loads the CSS first, then commits with `navigate({ replace: true, resetScroll: false })`: replace, so browsing 33 starters doesn't fill Back history. An effect deduplicates the head style against the client-injected one and retries the CSS if the server load failed.
- Fix found while verifying: lazy scenes inside the window's Base UI tab panels caused a hydration mismatch, because `React.lazy` suspends on the server. `ClientScene` (`landing-window.tsx`) now mounts them only after hydration, and both sides render the same loading state first.
- Verified (in-app browser, :3001):
  - Selecting Neon Night Market sets `?starter=neon-night-market`; after a reload the page, dock and gallery still show it, with one skin style tag.
  - `curl` of `/?starter=neon-night-market` returns HTML with the skin style and `data-dixy-skin` on the page Theme. `?starter=not-a-theme` renders the default.
  - Choosing Original Dixy clears the query.
  - Fresh tabs at `/?starter=living-forest` and `/` → Swiss Poster had no console errors (no hydration mismatch).
- Not tested: Back/forward behaviour (by design it doesn't record history), and production build behaviour beyond `pnpm check`.

### 2026-11-07 — Playground inspector in four tabs

- Decision (user): make the playground side panel easier to use with tabs. A static HTML/CSS mock (`output/overview-mockups/playground-panel.html`, gitignored) was reviewed and approved before any React work.
- Change:
  - **Scene picker:** the "Overview" dropdown above the preview is now a Dixy `Tabs` bar: Overview · Components | Email · Dashboard · Player | States · Compare · Surfaces. It stays one row and scrolls sideways when narrow. Each scene renders in its own `Tabs.Panel`, which replaces a long chain of ternaries.
  - **Inspector:** a header (theme swatch, name, description, edit count), four tabs, one scrolling body, and a footer ("N changes from <starter>" + Reset all).
    - **Theme:** a searchable starter grid (6 shown, then "Show all 33"), an accent swatch `ToggleGroup` with a custom OKLCH option, corners and neutral base.
    - **Style:** material and its dials, component finish as tiles, type, depth (elevation, relief, stroke, effects), layout (density, geometry, frame, direction), and a collapsed advanced surface section.
    - **Character:** controls, motion (plus reduce motion), backdrop, window chrome, type voice, states & details, ornament, borrow a character.
    - **Export:** inline code with React/CSS/Preset/Document formats (Expand opens the existing dialog); copy link, copy, download or import a preset; save in this browser.
  - A dot on a tab marks unsaved edits in that tab. Edits are counted against the starter's defaults (`countChanges`). The accent counts as one decision. Direction, reduce motion and effects are not counted, because they carry across starter switches and Reset all.
  - `ThemeRecipeMixer` now takes a `part` prop (`material | frame | advanced | character | borrow | save`), so each tab places the slice it needs. Shared `InspectorGroup` / `InspectorField` / `Segmented` live in `theme-inspector-parts.tsx`. Segmented choices are `ToggleGroup`s: one tab stop, arrow keys.
  - Removed the "Advanced foundations" dialog, whose controls are now in the tabs, and its quick "Start somewhere" starter presets. The 33 skins cover that role.
  - Styles live in `styles/theme-inspector.css`. Old toolbar rules that targeted the removed dropdown wrapper (`.theme-preview-toolbar > div:first-child`) were deleted, because they hid the tab dividers and wrapped the bar.
- Fixes during verification:
  - Picking a named accent on a custom-accent starter counted two edits; the accent now counts once.
  - Finish chips used a token that doesn't exist; they now use `--dixy-color-background-action-primary`.
  - Inline code used light Shiki colours in dark mode; it now follows the playground's appearance.
- Verified (in-app browser, :3001):
  - Every tab renders its groups.
  - Living Forest plus blue accent plus Full corners shows "2 changes" and a dot on Theme; adding Expressive ornament gives 3 and a dot on Character; Reset all returns to "Matches Living Forest".
  - Export renders tsx code. Light and dark both checked.
  - 375px: no horizontal overflow, and the footer sticks to the bottom of the stacked panel.
  - Keyboard: arrows move across scene tabs (skipping dividers), Enter selects Dashboard; the inspector tabs wrap with arrows, and Tab enters the panel.
  - No console errors. `pnpm check` passes.
- Not tested:
  - Reduced motion with real emulation, forced colours, screen readers, Safari.
  - Saving and loading local themes in the new tab.
  - Every starter's organic frame controls in the Style tab (only Living Forest).
  - Import from the Export tab.
- Known gap: the scene bar scrolls with a hidden scrollbar and has no edge fade to hint at more tabs.

### 2026-11-07 — Playground scene and tab in the URL; compact starter thumbnails

- Decision (user): keep the chosen scene and inspector tab in the URL.
  - `/playground?view=<scene>&panel=<tab>`. `validateSearch` drops unknown values and the defaults (`workspace`, `theme`), so links stay short and stale links fall back.
  - `ThemePlayground` is now controlled (`view`/`panel` props). The route writes the values with `replace: true, resetScroll: false`, since a tab is a view of the page, not history.
  - The debounced theme write now merges into the existing search instead of replacing it, so editing a theme no longer drops `view`/`panel`.
  - The loader deps are unchanged, so switching tabs does not reload skin CSS.
- Fix (user report): starter thumbnails in the three-column inspector grid overlapped ("Aa" ran into the switch), Retro OS's offset shadow spilled past the card, and the check squeezed the name.
  - Inspector-only overrides now scale the miniature parts for ~90px cards, keep 2px for offset shadows, and let names wrap.
  - The selected check is a small badge on the thumbnail's empty corner.
  - The shared `.theme-skin-miniature` rules are unchanged for other layouts.
- Verified (in-app browser, :3001):
  - Dashboard plus Style gives `?view=dashboard&panel=style`; choosing Theme removes `panel`.
  - A Floating elevation edit keeps both params; a reload restores Dashboard, Style and "1 change".
  - Server HTML for `?view=email&panel=export` already selects Email/Export; `?view=bogus&panel=nope` renders Overview/Theme.
  - No console errors.
  - All 33 thumbnails: no title/switch overlap and no overflow past the card edge, checked by measuring them; first 15 also checked visually.
  - `pnpm check` passes.
- Not tested: Back/forward (by design tab changes don't add history entries), and thumbnails in dark appearance.

### 2026-11-07 — Playground chrome on Dixy tokens

- User report: segmented controls, scene tabs and dividers in the playground looked like wireframes, with inconsistent border colours.
- Audit (computed styles):
  - Selected items used the library's **soft** variant: `action.secondary.subtle` fill (the same value as the sunken track, so no fill contrast) plus a 1px border in `text.action.secondary`, i.e. an ink outline.
  - Track outlines used `border.default`.
  - Dividers and my select override used `border.subtle`.
  - The inspector tab rule used `border.default`.
  - The Light/Dark buttons used a third style (`--doc-soft` fill, no border).
  - Above "Advanced surface", the group rule and the accordion's top border drew a double line.
- Change, scoped to the playground in `theme-inspector.css` (the library's soft variant is unchanged):
  - Track: `background.surface.sunken`, no outline.
  - Selected thumb: `background.surface.raised` + `border.subtle` + `shadow.raised`.
  - Text: `text.secondary` at rest, `text.primary` when selected.
  - Applied to segmented toggles, the scene tab indicator and the Light/Dark pair.
  - Dividers and the inspector tab rule: `border.subtle`. Text-entry controls (selects) are back on the library's `border.default` (3:1 control boundary).
  - The doubled rule is removed. The file now references `--dixy-*` tokens directly instead of the `--doc-*` aliases.
- Verified: computed styles map every value above to its token. Screenshot of the Style tab and preview bar (light). `pnpm check` passes.
- Not tested: dark appearance visually (the tokens are appearance-aware, but not looked at), and forced colours, where the thumb relies on its border.
- Open question: whether the library should offer this track-and-thumb look as its own Tabs/ToggleGroup variant instead of a docs-level override.

### 2026-11-07 — Segmented variants in the library

- Decision (user): promote the playground's track-and-thumb look into the library instead of keeping a docs-only override.
- Library (`@dixy-ui/react`):
  - `Tabs.Root variant="segmented"`:
    - The list is a `background.surface.sunken` track with no outline.
    - The thumb (Indicator, or the active tab when there is no Indicator) is `background.surface.raised` + `border.subtle` + `shadow.raised`.
    - Text is `text.secondary` at rest and `text.primary` when selected. It stays neutral by design, so `color` does not tint it.
  - `ToggleGroup segmented` (boolean): the same track and thumb, on pressed toggles. It replaces `attached` (the group never gets `data-attached` as well), and overrides the toggles' variant and colour for the pressed state. Selection, roving focus and the keyboard are unchanged.
  - Materials: the segmented thumb rule is scoped through the list, so `materials.css` adds its texture without erasing the raised shadow. Segmented toggles already outrank the material edge.
  - Forced colours: the segmented track gets a `CanvasText` outline, and the existing `Highlight` rules mark the selection.
  - Tests in `segmented.test.tsx`:
    - Tabs: `data-variant` on the list and Indicator, arrows + Enter selection, panel association, axe.
    - ToggleGroup: `data-segmented` without `data-attached`, one tab stop, arrows + Space pressing, axe.
- Docs:
  - The Tabs registry variant control and the variants comparison include `segmented`. Toggle Group has a Segmented switch and the demo passes it.
  - `api.json` regenerated with `pnpm docs:generate`, not hand-edited.
- Playground: the scene bar uses `variant="segmented"`. Light/Dark is now a segmented ToggleGroup instead of two pressed Buttons. The inspector's `Segmented` helper uses `segmented`. The override block in `theme-inspector.css` is replaced by layout-only rules. Two old `.theme-appearance` rules in `theme-playground.css` were removed, because as unlayered CSS they would beat the library's track gap.
- Card pickers: finish tiles now match starter cards (`border.subtle` at rest; `border.focus` plus a 1px ring when selected) instead of the outline toggle's ink border.
- Verified (in-app browser, :3001, separate tab):
  - Computed styles on the scene bar, Light/Dark and inspector rows map to the tokens above. The thumb keeps `shadow.raised` with the matte finish.
  - Light and dark screenshots.
  - On the Toggle Group docs page, the Segmented switch sets `data-segmented` on the preview, and the code sample includes it.
  - `pnpm check` and `pnpm package:check` pass.
- Not tested: forced colours and screen readers in a real browser; segmented with `orientation="vertical"` (no vertical-specific styles were written); each material finish visually.

### 2026-11-07 — Ocean Depths and Candy Clay use plain cards, as in the HTML redesign

- Request: the user preferred the frame borders from the HTML mockup for these two starters. Everything else in both themes stays as it was.
- Change (`packages/themes/src/documents.ts`):
  - Both starters' frame changes from the painted organic ornament (`coral` bubble rope, `cushion` flower and striped band) to `none`. The card material now carries the look: Ocean is frosted sea glass with a thin light rim; Candy is a clay card defined only by its shadows.
  - Candy's chrome edge changes from `pill` (a thick two-tone 3px accent border the mockup never had) to `line`.
  - Candy keeps corner scale 1.5 and variation 0.15, which gives the softer clay rounding and is what the "soft-machine" test checks.
  - The `coral` and `cushion` frames and the `/ocean-depths/react` and `/candy-clay/react` ornament exports still exist, for the mixer and for consumers.
- Verified:
  - In-app browser (:3001 playground): both starters in light and dark. Computed card border for Candy is 0px.
  - Themes and docs tests pass, as do `pnpm check` and `pnpm package:check`.
- Not tested: mobile width, forced colours, reduced transparency (Ocean's glass), and Safari.

### 2026-11-07 — Selected toggle reads as a raised thumb in every skin

- Problem (user screenshot, Candy Clay "Pro plan"): in an attached toggle group, the selected segment got only the base library's faint tint and a dark outline. The unselected one looked just as filled, so it was hard to tell which was active.
- Change (`packages/themes/src/compile-css.ts`, all skins):
  - Attached or segmented toggle groups get the same sunken track as the tabs list: canvas colour, skin edge, skin inset.
  - The pressed, non-solid toggle gets `--dixy-skin-selected`, falling back to `--dixy-skin-thumb`, plus the control relief, so it matches the slider and switch knob. In dark appearance `--dixy-skin-selected` is the raised finish. The thumb paint stays light in dark themes, and its label would vanish (it was measured unreadable in dark Candy Clay and Winamp).
  - Unpressed toggles stay transparent in the track.
- Verified:
  - In-app browser: Candy Clay in light (selected toggle paint equals the knob's white-to-pink gradient) and dark; Winamp Signal (dark). Clicking Monthly moves the thumb.
  - `pnpm check` and `pnpm package:check` passed.
- Not tested: other skins' light themes one by one, forced colours, keyboard focus ring on the new thumb, and mobile.

### 2026-11-07 — Components from the shadcn / HeroUI / Radix gap list

- Why: a comparison with shadcn/ui, HeroUI and Radix found a few components that Dixy lacked. All of them are now added, except Spacer (gaps already cover it) and Portal/Slot (Base UI and `useRender` already cover them).
- Library (`@dixy-ui/react`), all styled only with `--dixy-*` tokens in `additions.css`. Theme accent, neutral, radius, density, material, skin and appearance therefore apply without per-theme CSS:
  - `Grid` (layout.tsx): `columns` (clamped 1–12) or `minColumnWidth` auto-fit, with `gap` on the stack scale. It has an explicit `ReactElement` return type, because the inferred one broke the packed `.d.ts` (caught by `package:check`).
  - `VisuallyHidden` (visually-hidden.tsx): exports the existing `.dixy-visually-hidden` class as a component, plus `focusable`.
  - `Code`, `Blockquote` (typography.tsx): built on `nativePart`, so they get `data-dixy-visual`, which the component colour aliases need. Code sizes in `em` to follow the surrounding text.
  - `Snippet` (snippet.tsx): IconButton copy, `role=status` announcements, a failure path, a timeout reset and cleanup on unmount.
  - `PasswordField` (password-field.tsx): wraps TextField (a Base UI Input), so `Field.Label` still labels it. The toggle has a constant name and `aria-pressed`, and focus stays on it. The focus ring moves to the group via `:has()`.
  - `DataList` (content.tsx): `dl` > `div` > `dt` + `dd`, aligned with subgrid.
  - `User` (user.tsx): composes Avatar; `aria-hidden` avatar; initials.
  - `Image` (image.tsx): status during render (no effect race), a ref check for images that finished before hydration, one fallback.
  - `Navbar` (navbar.tsx): `header` built on Base UI Collapsible. Content and Menu each wrap a `nav` (only one is displayed at a time). Collapse uses a named container query. Links close the menu.
  - Shared decorative glyphs (copy, check, eye, menu, close) live in `utilities/inline-icons.tsx`. No icon-pack dependency.
- Docs: 10 registry entries with controls, composition trees, keyboard tables and lessons; 10 demos whose defaults match the controls; `api.json` regenerated with `pnpm docs:generate`. The theme gallery picks them up through the registry.
- Verified:
  - `pnpm check` passes (109 library tests, including 10 new tests with axe).
  - `pnpm package:check` (the verify script with `--online`, because this worktree's offline store lacked one tarball) passes.
  - `pnpm examples:check` typechecks all 1580 generated examples.
  - In-app browser, :3002: the Navbar collapses at a 622px bar with `md` and expands with `sm`; the menu opens, current page is highlighted. On a 375px phone width there is no horizontal overflow, and the preview is correct in light and dark. PasswordField: Tab reaches the toggle, Space shows the password, focus stays on the toggle, and the Field label resolves. Image: the broken src falls back and reports `loaded`.
  - Fixed during verification: three registry `token` values duplicated fixed rows in the docs token table (React duplicate-key warning).
- Not tested: forced colours, screen readers, touch devices, 200%/400% zoom, each material finish and skin visually, Snippet copy in a real browser clipboard (unit-tested with a mock only), and RTL.

### 2026-11-08 — Beta readiness: MIT, Cloudflare Workers, release pipeline, tree shaking

- Decisions (user): MIT license; docs on Cloudflare. A future Pro version will be a separate, commercially licensed package.
- Repository:
  - `LICENSE` (MIT) at the root and in each published package; metadata fields on all three packages.
  - Cloudflare: `@cloudflare/vite-plugin` and `wrangler` (exact pins) in `apps/docs`; `wrangler.jsonc` with the TanStack Start server entry; `deploy` and `cf-typegen` scripts. `pnpm-workspace.yaml` allows the `esbuild` and `workerd` build scripts, because pnpm 12 otherwise fails `--frozen-lockfile` installs.
  - Workflows: `deploy-docs.yml` (production on `main`, preview aliases for PRs, skipped without secrets) and `release.yml` (all checks, then changesets with provenance; private packages are never published).
  - Changesets: `pre enter beta`, `privatePackages.version: true`, package versions reset to `0.0.0`, and two changesets (first beta; `Field`/`Dialog` tree shaking).
  - Docs and README say beta. The README is now user-facing; maintainer content moved to `CONTRIBUTING.md`. Added `SECURITY.md`, `CODE_OF_CONDUCT.md`, issue forms and a PR template.
  - `scripts/check-tree-shaking.mjs` runs in `package:check` (before `verify-package`, so CI's `--online` flag still reaches that script).
- Library fix: `Field` and `Dialog` were plain objects that read `Primitive.*` properties at module scope. Bundlers keep property reads that might have side effects, so every consumer kept Base UI's dialog and field code. Both now use the `/* @__PURE__ */ (() => ({…}))()` pattern the other compound components already used. Button alone went from 128.8 to 17.1 KiB minified; Navbar + Snippet + DataList from 147.3 to 44.1 KiB.
- Verified:
  - `pnpm install --frozen-lockfile`, `pnpm check`, `pnpm package:check --online` and Prettier pass.
  - Docs `vite build` produces a Worker; `wrangler deploy --dry-run` reports 9213 KiB / 1605 KiB gzipped.
  - In the in-app browser, `vite preview` on `workerd` server-renders the landing page and the Navbar page. Fetching the same page without and with the `dixy-appearance=dark` cookie returns light and dark HTML respectively. `vite dev` on `workerd` renders the Snippet page without console errors.
  - Dry-run `changeset version` produced `0.1.0-beta.0` for all three packages, and was then reverted.
  - The tree-shaking check detects a real leak: a DatePicker import includes `react-aria`, `react-stately` and `@internationalized/date`.
- Not tested: an actual Cloudflare deploy and PR preview (no account connected), an actual npm publish, trusted publishing via OIDC with `pnpm publish`, and the release workflow end to end on GitHub.
- Accounts (same day): the user created the `dixy-ui` npm organisation and a granular token (read and write to `@dixy-ui` only, no org access, 30-day expiry) saved as the `NPM_TOKEN` GitHub secret. A first token was pasted into chat and was replaced; it must be revoked on npm. Then the three packages dropped `"private": true` and gained `publishConfig: { access: "public", provenance: true }`, so merging to `main` will start the release flow.
