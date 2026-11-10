# Design engineering checklist

Dixy is both a component library and a learning project. A checked implementation item means there is working evidence. A checked learning item means **you** can explain, change, and debug it independently; generated code alone never checks that box.

## Implementation milestones

- [x] M1 — pnpm/Turborepo workspace; a separately built React package; TanStack Start docs.
- [x] M2 — semantic tokens, light/dark Theme, typography, Button and IconButton.
- [x] M3 — Field, TextField, Dialog; complete interactive documentation.
- [x] M4 — Checkbox, Switch, Tabs, Tooltip with interaction coverage.
- [x] M6 — Remaining 33 Base UI families: public wrappers, Dixy token recipes, playgrounds and generated part/prop references.
- [x] M5 — production docs smoke test and packed-package consumer validation.
- [ ] Public beta — naming, license, release notes, npm publishing and hosting.

## P0 — Component architecture and TypeScript

- [ ] Explain why the docs depend on the library and the library never depends on the docs.
- [ ] Explain peer dependencies, external dependencies, package exports and CSS side effects.
- [ ] Add a typed Button variant without changing its existing contracts.
- [ ] Explain native element props, refs, event forwarding and Base UI's `render` composition.
- [ ] Explain controlled vs. uncontrolled state; implement and test both on an interactive component.
- [ ] Explain React rendering, component identity, effects, stale closures and cleanup.
- [ ] Demonstrate a discriminated union and an exhaustive state transition in a component.

## P0 — Visual systems and browser behavior

- [ ] Explain primitive → semantic → component tokens; replace an accent without editing components.
- [ ] Explain the CSS cascade, specificity, layers and inheritance using the library styles.
- [ ] Explain portal inheritance and stacking contexts; fix a nested-theme overlay bug.
- [ ] Build a consistent type scale and articulate hierarchy, measure and line-height choices.
- [ ] Verify focus, hover, pressed, disabled, loading, error and empty states.
- [ ] Explain responsive Grid/Flex layouts and prevent overflow at 320px and at zoom.
- [ ] Add finite motion with reduced-motion behavior and no unnecessary layout animation.
- [ ] Measure color contrast for both appearances and interaction states.

## P0 — Accessibility (target: WCAG 2.2 AA)

- [ ] Complete all workflows using only the keyboard.
- [ ] Verify field labels, help text, errors and accessible names.
- [ ] Verify dialog focus entry, containment, Escape and focus restoration.
- [ ] Verify disabled/loading behavior prevents duplicate actions and communicates state.
- [ ] Verify zoom/reflow at 200% and 400%, high contrast and reduced motion.
- [ ] Run an automated axe audit; explain what automation cannot establish.
- [ ] Manually test VoiceOver + Safari; record results and limitations.
- [ ] Obtain NVDA + Firefox/Chrome testing before claiming cross-platform screen-reader support.

## P0 — Quality and distribution

- [ ] Write a behavioral test that fails for a real regression, rather than mirroring markup.
- [ ] Debug a failing test and an unfamiliar component without AI assistance.
- [ ] Explain SSR, hydration, browser-only APIs and deterministic initial rendering.
- [ ] Verify source, preview, controls and copied examples describe the same API.
- [ ] Typecheck every complete example and keep generated API metadata fresh.
- [ ] Install a packed tarball in an independent app; verify types, CSS and runtime behavior.
- [ ] Inspect bundles for duplicate React and unnecessary component code.
- [ ] Run CI checks and explain a Changesets version bump.

## P1 — Deeper design engineering

- [ ] Implement Combobox; explain selection, filtering, keyboard behavior and empty results.
- [ ] Profile a slow interaction; distinguish render, layout and paint cost.
- [ ] Define measured performance budgets and validate a production build.
- [ ] Build a real application screen with the library and use its friction to improve APIs.
- [ ] Document a design decision, alternatives and the tradeoff you accepted.
- [ ] Create a portfolio case study using real failures, revisions, tests and measurements.

## Evidence log

Record commands, screenshots and manual observations here. Do not infer accessibility compliance or personal mastery from a successful build.

| Date       | Evidence                                                          | Result                                                    |
| ---------- | ----------------------------------------------------------------- | --------------------------------------------------------- |
| 2026-10-15 | First slice implemented; see docs/BUILD_LOG.md                    | M1, M2, M3 and M5 verified                                |
| 2026-10-15 | Dixy naming and logo; see docs/BUILD_LOG.md                       | Package and in-app browser checks passed                  |
| 2026-10-15 | 12-stop color, semantic roles and overlays; see docs/BUILD_LOG.md | Contrast, package, Tailwind and in-app browser validation |

## Validation evidence for this implementation

These items describe checks performed on the code, not personal mastery.

- [x] Strict TypeScript, generated API freshness, formatting and production builds.
- [x] 11 behavioral tests, including Dialog focus and theme-token propagation.
- [x] 23 complete generated example configurations typechecked.
- [x] Independent packed-package install, declarations, SSR, browser build and stylesheet checks.
- [x] 13 production routes, server-rendered stylesheet links, emitted CSS and a 404 for an unknown component.
- [x] Chromium checks for playground controls/reset, copied code, lazy source, mobile drawer, keyboard search and reduced motion.
- [x] Overview bounds at 320px and 390px; separate desktop/mobile screenshots.
- [x] Selected axe scans pass for light/dark Button, highlighted code, mobile documentation, the overview and a settled light Dialog inside dark docs.
- [ ] Manual screen-reader, touch, high-contrast and actual 200%/400% zoom review.

M4 is implemented. Next learning exercise: rebuild Checkbox independently, then explain its behavior and API together. Advanced cross-browser/release review remains open below.

## Spacing foundation evidence — 2026-10-15

Implementation evidence only; this does not check personal mastery items above.

- [x] 16 generated numeric primitives, semantic relationships and explicit nested density mappings.
- [x] Framework-independent token exports plus independently installed CSS/TypeScript consumers.
- [x] Stack/Inline composition and density propagation through Theme/Dialog contracts.
- [x] `pnpm check` and `pnpm package:check`; all spacing playground configurations typechecked.
- [x] Codex in-app browser: three densities, immutable primitives, nested scopes, RTL, keyboard focus, light/dark, desktop and 320/390px reflow.
- [ ] Actual 200%/400% browser zoom, reduced-motion preference emulation and clipboard byte verification in the in-app browser.
- [ ] Durable visual regression baselines and manual screen-reader/touch/high-contrast review.

See `docs/BUILD_LOG.md` for measurements, screenshots, visual changes and limitations.

## Typography foundation — implementation evidence

- [x] Compare Primer, Radix Themes, Apple HIG, Material 3 and Atlassian; record the decision and source links in the typography docs.
- [x] Add 18 typed semantic roles, generated rem styles, coordinated leading/weight/tracking, and a framework-independent CSS export.
- [x] Apply the same tokens to documentation, component text, form labels and inputs; remove tiny hard-coded documentation typography.
- [x] Load variable Inter with optical sizing and variable Space Grotesk; restrict the playground to supported axes.
- [x] Keep semantic HTML independent of the visual variant; verify refs, default roles and variant precedence.
- [x] Verify variable-font controls and synchronized example code in Codex's in-app browser; check 320px, 390px and desktop layouts.
- [ ] Manually verify 200%/400% zoom, custom text spacing, screen readers and high contrast for the updated scale.

Personal typography learning remains separate:

- [ ] Explain family, size, leading, weight, tracking and optical sizing without looking them up.
- [ ] Trace a role from its canonical token to generated CSS and the browser's computed style.
- [ ] Choose heading elements independently of the visual hierarchy.
- [ ] Change a token, predict every affected context, and verify the result independently.

## Sizing and layout — implementation evidence, 2026-10-15

- [x] Canonical sizing, interaction-target, container, breakpoint and responsive-gutter contracts with generated CSS and typed public helpers.
- [x] Container composition plus Button/TextField/IconButton integration; spacing density remains independent of sizing.
- [x] Interactive docs and generated Container API; all 144 sizing/layout demo configurations typechecked.
- [x] `pnpm check` and independent `pnpm package:check`, including a consumer without React or Tailwind.
- [x] Codex in-app browser: every breakpoint boundary, container maximums, root-font scaling, target floors, RTL, keyboard, reset, mobile/desktop and light/dark.
- [ ] Native 200%/400% zoom, coarse-pointer/touch, reduced-motion emulation, screen-reader/high-contrast and durable visual regression review.

Personal sizing/layout learning remains separate:

- [ ] Explain the difference between visual control size, icon size, spacing density and activation target size.
- [ ] Trace one breakpoint from its canonical source to generated CSS and matchMedia behavior.
- [ ] Explain viewport thresholds versus parent/container width and verify an RTL layout independently.

## Icon support — implementation evidence

- [x] Audit existing size.icon and color.icon families; reuse their CSS namespace and add only the 48px step.
- [x] Add one-SVG Icon composition with managed naming, merged refs/classes/styles/events and preserved artwork.
- [x] Add component playground, generated local API, foundation size/color specimens and six real Phosphor weights.
- [x] Keep Lucide/Phosphor installed only in docs; preserve core independence from icon packs and runtime registries.
- [x] Verify the decorative/named distinction, keyboard action naming, custom viewBox/fill and deterministic SSR in behavioral tests.
- [x] Verify desktop/mobile light/dark views, synchronized example code, reset and keyboard actions in Codex’s in-app browser.
- [x] Validate packed consumers without icon libraries installed, production SSR SVGs and frozen dependency installation.
- [ ] Iconify explorer/static-data adapter and semantic system-icon registry.
- [ ] Additional tested Heroicons/Tabler/Hugeicons adapters and Material Symbols variable axes.
- [ ] Manual screen-reader, high-contrast, custom text zoom and touch review for the icon examples.

Personal icon learning remains unchecked:

- [ ] Explain the difference between viewBox coordinates, CSS dimensions and a hit target.
- [ ] Implement a pack adapter without changing its native artwork or forcing a common stroke model.
- [ ] Explain decorative icons, named images and named icon-only actions using the accessibility tree.
- [ ] Prove that a selected icon pack stays outside the core package and unused artwork stays out of a consuming bundle.

## Radius, border and shadow — implementation evidence, 2026-10-15

- [x] Compare primary Radix, Material 3 and Apple references; document the chosen contextual corners and restrained depth.
- [x] Add canonical radius, border and shadow contracts, generated public CSS and typed framework-independent helpers.
- [x] Integrate Button/TextField/Dialog aliases while preserving Base UI behavior, portal inheritance and legacy overrides.
- [x] Add source-derived specimens and a live surface/Dialog playground with synchronized code and reset.
- [x] Run `pnpm check`, independent `pnpm package:check` and formatting validation; typecheck 30 surface configurations within 246 complete examples.
- [x] Codex in-app browser: all presets, border/shadow roles, density, RTL, nested scopes, light/dark, keyboard and desktop/320/390px layouts.
- [ ] Actual zoom, reduced-motion/forced-colors rendering, screen-reader/touch review and durable visual regression baselines.

Personal surface-token learning remains separate:

- [ ] Explain primitive radii, contextual roles, border semantics and shadow geometry independently.
- [ ] Derive concentric corners from actual border/padding distance and verify the result.
- [ ] Trace a nested Theme through generated CSS and a Dialog portal without relying on the docs implementation.

## Base UI coverage and component roadmap — 2026-10-15

The initial audit found four integrated families and 33 remaining. The expansion is now implemented: all 37 documented families have public wrappers; all 33 added families have live playgrounds and generated references. The historical inventory below records the starting point. Audited the installed `@base-ui/react@1.9.0` public exports against `packages/react/src/index.ts` and the [official component catalog](https://base-ui.com/react/overview/quick-start). There are **37 documented component families: 4 integrated and 33 remaining**. Radio and RadioGroup are separate import modules within one documented family, making 38 component modules in the installed package. Utilities and internal exports are not component families.

### Existing coverage

| Base UI family | Dixy public API    | Current coverage                                                                                                        |
| -------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| Button         | Button, IconButton | Styled controls using Dixy tokens.                                                                                      |
| Input          | TextField          | Styled input, sizes and outline/soft variants.                                                                          |
| Field          | Field              | Root, Label, Description, Error and Validity; Control and Item were subsequently added.                                 |
| Dialog         | Dialog             | Root, Trigger, Portal, Backdrop, Viewport, Popup, Title, Description and Close; handle helpers were subsequently added. |

Dixy also supplies Theme, Text, Heading, Icon, Stack, Inline, Container, useMotionPreferences and the optional MotionProvider entry. These are useful existing building blocks, not extra Base UI component families. The documentation's mobile drawer is composed from Dialog; it does not establish coverage of Base UI Drawer.

### Existing contract completion

- [x] Expose and document Field.Control and Field.Item, retaining label, validation and form registration behavior.
- [x] Expose Dialog.createHandle and Dialog.Handle; generate helper reference metadata and compile a typed handle in the packed consumer. A dedicated detached-trigger playground remains a follow-up.
- [x] Audit each existing wrapper's public parts, exported types, refs, events and render composition before using it as the pattern for new wrappers.

Family checkmarks below establish wrappers, public exports, token styles, a playground and generated API availability. The listed behaviors describe each family’s review scope; they do not claim every advanced composition was manually tested. See the validation gaps after the completion gate.

### Batch 1 — Everyday controls and first interaction lessons (8 families)

Checkbox, Switch, Tabs and Tooltip form the completed M4 implementation slice. They remain the recommended personal learning exercises. RadioGroup extends the keyboard lesson; CheckboxGroup, Fieldset and Form complete the first form example. Paths below are relative to `@base-ui/react/`; proposed Dixy family names preserve upstream names except the existing TextField alias.

- [x] **Checkbox** (`checkbox`) — selected/invalid/disabled colors, control corners, icon sizing, spacing and focus; include indeterminate state and native form submission.
- [x] **CheckboxGroup** (`checkbox-group`) — form-group spacing and inherited control tokens; include group validation and parent/child selection.
- [x] **Radio + RadioGroup** (`radio`, `radio-group`) — selected colors, circular indicator geometry and target sizing; include arrow navigation, one selection and form values.
- [x] **Switch** (`switch`) — selected/disabled colors and feedback motion; add track/thumb aliases and verify Space, naming and form submission.
- [x] **Tabs** (`tabs`) — label typography, selected text/background, spacing and navigation motion; include orientation, activation modes and focus behavior.
- [x] **Tooltip** (`tooltip`) — compact typography, overlay surface, border, floating shadow and enter/exit motion; include focus/hover, dismissal and provider delays.
- [x] **Fieldset** (`fieldset`) — legend typography, form-group spacing and borders; verify grouped naming and disabled propagation.
- [x] **Form** (`form`) — compose existing field/error typography and spacing; verify client/server errors, submit and reset without replacing native semantics.

### Batch 2 — Structure, disclosure and status (8 families)

- [x] **Toggle** (`toggle`) — button sizing, label/icon tokens and pressed state colors; preserve aria-pressed and disabled behavior.
- [x] **ToggleGroup** (`toggle-group`) — shared Toggle recipe, inline spacing and grouped borders; verify single/multiple selection and roving focus.
- [x] **Accordion** (`accordion`) — heading/label roles, borders, inset spacing and reveal motion; verify single/multiple expansion and keyboard navigation.
- [x] **Collapsible** (`collapsible`) — trigger tokens, content spacing and reveal motion; preserve expanded semantics, presence and content focus safety.
- [x] **Separator** (`separator`) — semantic border colors/widths and spacing; support both orientations and decorative/semantic usage.
- [x] **Avatar** (`avatar`) — image/fallback surface, label typography and icon sizing; add avatar geometry aliases and verify fallback timing and naming.
- [x] **Progress** (`progress`) — track/status colors and component geometry aliases; distinguish determinate and indeterminate states and preserve value semantics.
- [x] **Meter** (`meter`) — measurement track/indicator geometry, semantic colors and label typography; verify min/max/value semantics separately from task progress.

### Batch 3 — Popups, actions and feedback (6 families)

- [x] **Popover** (`popover`) — overlay radius, surface, border, floating shadow and enter/exit motion; retain Base UI positioning, arrows and focus management.
- [x] **AlertDialog** (`alert-dialog`) — Dialog surface/backdrop recipe plus destructive action colors; verify required decision semantics and focus restoration.
- [x] **Menu** (`menu`) — shared popup/item recipes, label/icon tokens and highlighted/disabled/danger states; include submenu, checkbox and radio items.
- [x] **ContextMenu** (`context-menu`) — reuse Menu recipes; verify pointer/keyboard opening, submenus and restored focus.
- [x] **PreviewCard** (`preview-card`) — card typography, overlay surface, spacing and floating shadow; verify pointer/focus transitions and dismissal.
- [x] **Toast** (`toast`) — status colors/icons, text roles, overlay corners/shadow and finite enter/exit motion; verify announcements, queue, actions, pause and dismissal.

### Batch 4 — Selection and specialized inputs (6 families)

- [x] **Select** (`select`) — TextField trigger recipe, menu-item states and popup surface; include labels, placeholder, keyboard selection and form values.
- [x] **Combobox** (`combobox`) — input, popup, selection and chip aliases; verify filtering, empty results, single/multiple selection and accessible announcements.
- [x] **Autocomplete** (`autocomplete`) — shared input/list recipes; preserve free text while verifying suggestions, completion and keyboard behavior.
- [x] **NumberField** (`number-field`) — input typography/sizing and stepper icon/target tokens; verify locale parsing, bounds, stepping and scrub behavior.
- [x] **OTPField** (`otp-field`) — code/body typography, control sizing, spacing and focus/error tokens; verify paste, autofill, editing and form submission.
- [x] **Slider** (`slider`) — semantic track/range colors, thumb geometry and target tokens; verify keyboard steps, bounds, multiple thumbs and RTL.

### Batch 5 — Navigation, scrolling and gesture behavior (5 families)

- [x] **Drawer** (`drawer`) — overlay/backdrop recipe, responsive sizing and gesture-aware motion; include swipe dismissal, snap points, nested drawers and focus restoration.
- [x] **NavigationMenu** (`navigation-menu`) — label/selected colors, navigation spacing and popup surfaces; verify links, focus movement, viewport sizing and RTL.
- [x] **Menubar** (`menubar`) — shared Menu recipes and compact trigger spacing; verify horizontal navigation, submenu handoff and RTL.
- [x] **Toolbar** (`toolbar`) — label/icon sizing, group gaps and separators; verify roving focus, orientation, RTL and embedded controls.
- [x] **ScrollArea** (`scroll-area`) — semantic thumb/track colors and geometry/target aliases; verify both axes, native scrolling, touch and keyboard reachability.

### Dixy token contract for every new component

Reuse canonical tokens through React-owned component aliases. Existing surface aliases cover Button, Input, Card and Dialog; new component aliases still need to be designed. A completed foundation does not imply that checkbox geometry, switch tracks, slider thumbs, toast placement or overlay layering already have final contracts.

| Concern          | Existing foundation to reuse                                              | Integration rule                                                                                                                                                   |
| ---------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Typography       | Semantic `--dixy-font-*` roles and matching letter spacing                | Labels use label roles; descriptions use body roles; text inputs retain 16px body sizing. Inherit variable fonts.                                                  |
| Color            | Semantic background, text, icon, border, action and feedback roles        | Map hover, pressed, selected, disabled and invalid states explicitly. Validation meaning uses feedback roles.                                                      |
| Spacing          | Inline, stack, inset and section roles                                    | New component spacing aliases reference existing semantic roles and respect Theme density.                                                                         |
| Sizing           | Control 32/40/48px, icon 12–48px, target 24px minimum/44px comfortable    | Distinguish visible marks from interaction targets. Density changes spacing without shrinking text or target floors.                                               |
| Surfaces         | Control/card/overlay radii, semantic borders, focus ring and shadow roles | Define aliases for each new surface; use circular geometry where the control requires it. Keep focus visible with shadow none.                                     |
| Motion           | Feedback, enter, exit, navigation and reveal transitions                  | Respect inherited reduced motion. Keep Base UI in charge of popup presence and positioning. Timer delays and toast lifetimes are separate from animation duration. |
| Icons            | Existing Icon composition, size and semantic foreground tokens            | Keep icon packs outside the core; expose render composition for replacing artwork. Give icon-only actions an accessible name.                                      |
| Theme and layout | Theme, ThemeScope and layout helpers                                      | Portals inherit appearance, accent/neutral colors, density, radius, motion and custom properties. Use logical properties and verify RTL.                           |

### Supporting utilities, tracked separately

- [x] Integrate/document DirectionProvider so direction-sensitive Base UI behavior follows the application's direction, including portals.
- [x] Document CSPProvider for consumers requiring a nonce and audit the integration using the installed API.
- [x] Export stable mergeProps/useRender alongside DirectionProvider/CSPProvider. Internals and unstable helpers stay outside Dixy’s public API.

No additional component-library dependency is needed: Base UI is already installed. Import each primitive from its public subpath and add a styled Dixy wrapper. Review all of that family's public parts, including nonvisual providers/helpers, rather than stopping at the default demo.

### Completion gate for each family

- [x] Public typed exports preserve refs, native props, events, render composition and supported controlled/uncontrolled contracts.
- [ ] Style all meaningful states through Dixy tokens; check nested themes and portals without hardcoded palette/font/spacing values.
- [x] Document real compositions and accessible usage, with controlled first-slice examples. Keep playground controls, source and generated API metadata aligned; typecheck complete examples against built public exports.
- [ ] Test meaningful behavior: keyboard/focus/RTL, labeling, disabled state, form serialization/validation or popup lifecycle as applicable.
- [ ] Verify desktop/mobile, light/dark, density/radius presets and reduced motion in Codex's in-app browser. Record screen-reader, zoom, touch or forced-colors gaps explicitly.
- [x] Run `pnpm check` and `pnpm package:check` for implementation changes; inspect bundle independence and optional dependencies when relevant.
- [x] Add evidence and a short learning explanation/snippet to the build log. Implementation evidence does not check personal mastery.

### Personal learning for this expansion

- [ ] Explain why styling a Base UI primitive preserves more behavior than rebuilding its interaction model.
- [ ] Trace a selected control state from Base UI's state attributes through a Dixy component alias to the semantic token.
- [ ] Build and explain a controlled Checkbox, a keyboard-operated RadioGroup and a themed portaled Tooltip independently.
- [ ] Explain the behavioral differences between Select, Combobox and Autocomplete, and between Progress and Meter.
- [ ] Diagnose one focus, form or portal regression using a failing behavioral test and browser evidence.

## Motion — implementation evidence, 2026-10-15

- [x] Review current M3 Expressive physics/specs, Radix, Apple and Motion; document the chosen web tuning and ratio-to-coefficient conversion.
- [x] Add canonical durations, easing, spring schemes and transition recipes with generated CSS and framework-independent public helpers.
- [x] Add optional Motion integration; keep the core and token-only consumers independent of the engine.
- [x] Respect live OS reduction and inherited Theme reduction through nested scopes and portals; render static before hydration.
- [x] Add finite retargeting, presence, sequence, easing, Dialog and loading examples with synchronized source and reset.
- [x] Add duration/frequency guidance supplied by the user; clarify the occasional page-transition exception and variable spring settling time.
- [x] Run `pnpm check` and `pnpm package:check`; typecheck 22 Motion configurations within 268 complete examples.
- [x] Codex in-app browser: normal/reduced previews, spring/effects behavior, stagger, keyboard, RTL, desktop/320/390px, light/dark and a production smoke test.
- [ ] Actual OS reduced-motion media emulation, clipboard byte equivalence, manual screen-reader/forced-colors/zoom/touch and durable visual regression review.

Personal motion learning remains separate:

- [ ] Explain duration/easing versus physical springs and why velocity continuity matters during interruption.
- [ ] Convert damping ratio to a coefficient, then predict how stiffness, mass and damping affect the result.
- [ ] Implement an effects/spatial pair and prove reduction covers opacity, geometry, delay and looping behavior.
- [ ] Review animation frequency and choose when no animation is the better interaction.

## Theme playground — implementation evidence, 2026-10-15

- [x] Standalone `/playground` route with its own full-width header and workspace, outside DocsShell.
- [x] Editable foundation presets, named/custom OKLCH colors, fonts, radius, density, borders, card depth and motion using compiled public exports.
- [x] Keep real previews and both exported appearances aligned through one theme mapping; preserve portal token inheritance.
- [x] Copy/import versioned JSON, copy complete React code and restore all settings from a copied URL.
- [x] Focused preset validation, custom-color contrast and generated consumer-code typechecks (five tests).
- [x] Codex in-app browser: desktop, 320/390px, light/dark, keyboard form/sliders, modal containment/restoration, clipboard values, import/reload and explicit reduced motion. See docs/BUILD_LOG.md.
- [x] Final validation: `pnpm check`, `pnpm package:check`, focused formatting and production route smoke test passed; see the build log for counts and the consumer-fixture annotation correction.
- [ ] Native OS reduction, screen readers, forced colors, browser zoom and physical touch review.

Personal theme learning remains separate:

- [ ] Trace a foundation control through the theme mapping into a component and its copied code.
- [ ] Explain why a readable solid accent does not prove every semantic role is accessible.
- [ ] Build and apply a reusable theme independently, including a portaled overlay and both appearances.

### Expansion validation evidence — 2026-10-15

- [x] All 33 added families preserve every public upstream part/helper; Radio and RadioGroup remain separate typed exports. Field.Control/Item and Dialog handles close the existing runtime gaps.
- [x] Final checks: `pnpm check`, `pnpm package:check` and `pnpm format:check` passed; 345 complete generated examples typechecked and all 39 built component routes plus compiled CSS were verified.
- [x] 27 new behavioral/coverage tests: controlled and mixed Checkbox, refs/composition/form values, Switch, Tabs/RTL, Tooltip/theme portals, choice groups, toggles, disclosures, numeric bounds, Slider, Progress/Meter, Form validation, OTP paste, Avatar/ScrollArea, popup dismissal/focus, Menu, Select, filtered inputs, Toast and SSR. The React suite has 52 passing tests.
- [x] Complete demos and lazy per-family API references derive from public types. A separate Field page documents its styled Control. Playground theme controls and copied code include density, motion and direction; reset restores them.
- [x] Codex in-app browser: all 33 new default playgrounds render at 1280px desktop and 390px mobile without preview errors or document/preview horizontal overflow. See `output/in-app-browser/components-desktop-evidence.json` and `components-mobile-evidence.json`.
- [x] Browser interaction review: Checkbox keyboard/mixed state, Switch keyboard/dark appearance, Tabs activation/RTL/reduction settings, Tooltip focus/Escape, Drawer placement/dismissal, filtered Combobox input, Menubar keyboard action, and mobile Toast lifecycle/bounds. Component tests cover additional state paths.
- [x] Independent packed consumer: every family export and stable utility, explicit generic object values, negative type cases, ESM/SSR and browser build; no required icon pack or Motion dependency.
- [x] Tree-shaking regression guard: the standard consumer excludes unused Combobox, Drawer, OTP Field and Toast styles/classes from JavaScript. Its JS fell from 706.79kB to 308.76kB (227.11kB to 98.45kB gzip) after pure family construction. This is the same fixture, not a whole-docs performance score.
- [ ] Dedicated compositions for every advanced part (multiple-selection chips, submenu combinations, detached popup triggers, nested/snap-point drawers, navigation transitions and toast stacking/anchoring), with browser regression coverage.
- [ ] Broad screen-reader, actual 200%/400% zoom, forced-colors rendering, real touch/drag/swipe and cross-browser review. All new default routes were smoke-tested; that is not an accessibility certification.
- [ ] Durable visual regression baselines and complete light/dark/density/radius/motion interaction matrices for every family.

Personal learning items above remain unchecked until the user demonstrates them. Command/build evidence and remaining limitations are recorded in `docs/BUILD_LOG.md`.

### Component preview appearance fix — 2026-10-15

- [x] Component previews follow docs light/dark appearance on entry and docs theme changes; reset restores the current docs appearance while local comparisons remain available.
- [x] Codex in-app browser verified Tooltip/ Button navigation, keyboard reset/theme changes, matching copied code and dark mobile rendering at 390px without main horizontal overflow. `pnpm check` and focused formatting passed; see `docs/BUILD_LOG.md`.

### Foundation preview appearance sync — 2026-10-15

- [x] Color and Theming previews initialize from and follow app appearance while retaining other foundation choices and supporting local comparisons.
- [x] Palette explorer, semantic mappings and copied code use the same preview appearance. In-app browser verified navigation, desktop/mobile light/dark and keyboard app theme changes; `pnpm check` and focused formatting passed. Evidence and limits are in `docs/BUILD_LOG.md`.

### Remember app appearance — 2026-10-15

- [x] Persist app light/dark preference across refreshes and docs/editor navigation; use the saved value for matching server rendering and hydration.
- [x] Verify absent/valid/invalid cookie SSR, dark foundation/component refreshes, local comparison isolation, standalone editor chrome and mobile keyboard light/dark refreshes. `pnpm check`, final docs types and focused formatting passed; see `docs/BUILD_LOG.md` for evidence and limits.

### Remember shared preview themes — 2026-10-15

- [x] Save shared preview theme choices across component, Color and Theming navigation/refresh; restore validated choices for server rendering and hydration, with app appearance following and explicit shared reset behavior.
- [x] Keep preview attributes, controls and copied code aligned. Verify persistence, named personalities, app theme switching, reset, desktop/mobile layout and malformed-cookie fallbacks. Three new model tests and final `pnpm check` passed; evidence and native select keyboard limitations are in `docs/BUILD_LOG.md`.

## Whole-library theme preview — implementation evidence, 2026-10-15

- [x] All documented families plus IconButton and layout helpers appear in a shared-theme gallery (41 previews).
- [x] Search, category filtering, empty results, reset, nearby lazy loading and independent failure boundaries.
- [x] Sticky desktop foundation/appearance controls and mobile focus-aware navigation between editor and gallery.
- [x] Coverage guard checks every public visual export and registered example; seven docs tests cover gallery and preset contracts.
- [x] Codex in-app browser: all 41 examples rendered without failures or card overflow at desktop and 390px; loaded examples also reflowed at 320px. Representative keyboard, selection, portal, reduced-motion and reset checks recorded in docs/BUILD_LOG.md.
- [ ] Screen readers, physical touch, native zoom/forced colors and a complete matrix of component states and nested interactions.

Personal learning remains unchecked:

- [ ] Explain how a single theme reaches every lazy demo and portaled popup without importing documentation into the library.
- [ ] Independently add a component example and demonstrate that gallery coverage and copied theme code stay aligned.

Whole-library validation: `pnpm check`, `pnpm package:check`, focused formatting and production gallery smoke checks passed. These are implementation results; personal learning items above remain unchecked.

### Applied component motion — implementation evidence, 2026-10-15

- [x] Generate public component recipe assignments and CSS aliases for Button, Dialog/AlertDialog, Drawer, menu families and Tabs; preserve Base UI presence, refs, events and focus ownership.
- [x] Apply finite shared timings, shorter exits and immediate reduced behavior while retaining functional tab coordinates, drawer offsets and direct pointer tracking. Keep progress cadence separate.
- [x] Add a composed live example with synchronized source, motion/edge/orientation/RTL controls and reset; show the indicator in Tabs docs and all drawer edges in its playground.
- [x] Six new behavioral tests cover open-portal preference changes, Menu keyboard activation and vertical RTL Tabs in both modes. `pnpm check` passed 58 React tests, 28 token tests, seven docs tests, 380 complete examples and production builds; `pnpm package:check` and focused formatting passed.
- [x] Codex in-app browser: all five families in normal/reduced mode; desktop, 320/390px, light/dark, keyboard, focus restoration, indicator geometry, all drawer edges and physical RTL anchoring, representative pointer swipe, loading button and production smoke checks. Evidence and exact scope are in `docs/BUILD_LOG.md`.
- [ ] Native OS preference switching, physical touch/all velocity and swipe combinations, nested/snap-point drawers, advanced submenu/navigation combinations, screen readers, forced colors, zoom, cross-browser and durable visual baselines.

Personal component-motion learning remains separate:

- [ ] Explain the component-to-semantic recipe mapping and independently add a component motion recipe.
- [ ] Demonstrate why reduced decorative motion must preserve functional positioning and direct manipulation.
- [ ] Diagnose an interrupted presence or focus regression using a behavioral test and browser evidence.

### Expressive foundations research and plan — 2026-10-15

- [x] Review existing surface/motion/theme contracts, compare texture/material libraries and Apple's public Liquid Glass guidance, and record a concrete architecture and proposed performance budgets in `docs/EXPRESSIVE_FOUNDATIONS_PLAN.md`.
- [x] Implement and measure the separately loaded static material pack and synchronized Material Lab.
- [x] Extend semantic shape roles and coordinated personality presets with focus, contrast and portal checks.
- [ ] Profile the optional backdrop-glass pilot on target browsers and real devices before making power or reliability claims.
- [x] Add optional semantic haptics and evaluate expressive button-group motion independently.

The research pass was followed by the implementation evidence below. The target-device glass profiling item and personal learning remain unchecked.

### Expressive foundations implementation evidence — 2026-10-15

- [x] Canonical material, shape, personality and feedback contracts; generated CSS with freshness checks; separate static material and experimental backdrop exports. Static material CSS is 801 bytes gzip and requests no texture assets.
- [x] Box and decorative Shape exports; typed Button/IconButton material and shape settings; Theme personality/effects propagation through nested themes and open portals; inherited reduction wins.
- [x] Optional feedback adapter entry, explicit opt-in, bounded vibration fallback, adapter failure isolation and reduction/disabled-ancestor guards. No new rendering dependency or required Motion installation.
- [x] Four lazy foundation pages and a finite comparison lab; generated local API tables; matching preview/source/reset controls; ordinary Button playground support. The connected group stays a docs-only opt-in experiment with persistent selection separate from momentary press.
- [x] In-app browser: desktop and 320/390px, light/dark, all finishes and geometry presets, loading/disabled controls, keyboard activation/focus restoration, named artwork, personality portals, reduced materials, visible feedback and copied code. Mobile main/preview bounds match client widths.
- [x] Bounded in-app frame samples for flat/static/backdrop modes; no sampled interval over 20ms. The pressed group redistributed width at desktop and retained equal widths with zero-duration reduction. These are local browser observations, not real-device energy benchmarks.
- [ ] Safari/iOS, Firefox, physical Android/touch, native OS preference switching, forced-colors rendering, 200%/400% zoom, screen readers and real-device GPU/energy/thermal profiling.

Personal expressive-foundation learning remains separate:

- [ ] Trace a material from canonical recipe through generated CSS, theme scope, public export and copied example.
- [ ] Explain the difference between static finish, backdrop sampling and refraction; profile a scene independently.
- [ ] Implement and debug a host feedback adapter without making action success depend on haptics.

Final expressive-foundation validation: `pnpm check`, `pnpm package:check` and `pnpm format:check` passed; 107 tests and 462 complete examples passed. Fresh production in-app browser review passed, including the optional CSS load and a reduced dark mobile portal. Exact evidence and remaining device limitations are in `docs/BUILD_LOG.md`.

### Checkbox alignment and feedback motion — implementation evidence, 2026-10-15

- [x] Replace font-dependent default check/mixed glyphs with centered decorative SVG artwork; preserve custom children/null, refs, render composition, state callbacks and keepMounted.
- [x] Generate checkbox feedback/indicator aliases from the shared 120ms recipe; keep Base UI presence ownership and immediate reduced behavior without a runtime animation dependency.
- [x] Align Checkbox/Checkbox Group demos, generated examples, README and packed consumer with the default indicator. `pnpm check` passed 109 tests and 462 complete examples; `pnpm package:check` and formatting passed.
- [x] In-app browser: checked/mixed/unchecked states, keyboard focus, normal/reduced motion, light/dark, LTR/RTL, desktop and 320/390px; matching mark/control centers and fresh production/copied-source verification. Evidence and precise limitations are in `docs/BUILD_LOG.md`.
- [ ] Native OS motion switching, Safari/Firefox, physical touch, forced colors, zoom, screen-reader review and durable visual regression baselines.

Personal learning remains separate:

- [ ] Explain why a centered glyph box can still produce off-center artwork, and trace the checkbox recipe through generated aliases and Base UI presence.

### Switch variants and comparison documentation — implementation evidence, 2026-10-15

- [x] Extend Root with three shirt sizes, three emphasis variants, four semantic colors, radius and inherited optional materials; add decorative Thumb artwork while preserving Base UI composition, refs, state, forms and accessibility.
- [x] Generate shared 120ms feedback/thumb aliases with immediate reduction; keep functional RTL travel correct through production CSS optimization using an inherited direction token.
- [x] Align nine playground controls, description, generated local API props and copied source. Add horizontal padding to local/primitive API tables and keep mobile controls/toolbar within bounds.
- [x] Add six lazy comparison sections below the playground, each with real independent switches, matching Theme settings and complete expandable/copyable source.
- [x] `pnpm check`: 113 tests, 506 complete examples and production builds. `pnpm package:check`, final docs typecheck and formatting passed. Browser evidence covers desktop, 320/390px, light/dark, normal/reduced motion, keyboard, all size/radius and color/variant combinations, all finishes, disabled/readOnly and production RTL travel.
- [ ] Physical touch, Safari/Firefox, screen readers, native OS preference changes, forced-colors rendering, zoom, hardware energy measurements and durable visual baselines.

Personal learning remains separate:

- [ ] Trace a Switch visual prop through its local interface, semantic tokens, generated API, live controls, copied example and packed declaration; explain why production RTL travel uses an inherited direction token.

### Checkbox variants and comparison documentation — implementation evidence, 2026-10-15

- [x] Add three shirt sizes, three selected-emphasis variants, four semantic colors, inherited radius/material and separate checked/mixed artwork slots; retain neutral unchecked state, centered marks and Base UI contracts.
- [x] Keep finite shared 120ms feedback, Base UI presence and immediate reduced behavior; extend the static materials pack without texture requests or a required animation runtime.
- [x] Align eleven playground controls, Field descriptions/errors, generated local API metadata and configured source. Add nine comparison sections, including primitive-owned select-all and required form validation, with complete expandable/copyable examples.
- [x] `pnpm check`: 117 tests, 562 complete examples and production builds. Packed consumer/SSR/CSS checks and formatting passed. In-app production review covered keyboard, light/dark, LTR/RTL, normal/reduced motion, desktop and 320/390px bounds, all size/radius combinations, colors, finishes, custom artwork, readOnly/disabled, select-all, validation, copying and reset. Shared Switch comparison cards retained their six working examples.
- [ ] Screen readers, physical touch, Safari/Firefox, native OS preference switching, forced-colors rendering, zoom, real-device energy measurements and durable visual baselines.

Personal learning remains separate:

- [ ] Trace a Checkbox visual prop and custom indicator through the public types, semantic CSS, generated API, controls, copied example and packed consumer; explain Field validation and the CheckboxGroup parent contract.

### Tabs and component coverage — implementation evidence, 2026-10-15

- [x] Extend Tabs with three shirt sizes, four emphasis variants, four semantic colors, contextual radius/material, alignment and fill while preserving Base UI state, refs, render composition, focus and presence contracts.
- [x] Reserve the active bar for line tabs; filled and rounded groups use a selected surface without an extra underline. Preserve static selection before Indicator geometry is ready and when Indicator is omitted.
- [x] Align eleven playground controls, generated API, complete source and explicit composition guidance. Add eight executable comparisons, including manual/automatic activation, icons, vertical/RTL and native overflow.
- [x] `pnpm check`: 122 tests, 615 complete examples and production builds. Packed declarations/SSR/CSS checks and formatting passed. In-app production review covers keyboard, desktop, 320/390px component bounds, light/dark, RTL, normal/reduced motion, materials, copying and reset. Sampled matte text contrast is at least 5.53:1; this is not complete palette/state conformance.
- [x] Save a dated public component inventory and HeroUI/shadcn coverage roadmap. Save and install the validated `dixy-component-building` skill with composition, foundations and WCAG 2.2 AA evidence requirements.
- [ ] Complete per-component screen-reader/platform checks, Safari/Firefox, physical touch, native media preferences, forced colors, text resize/real zoom and durable visual baselines before a full conformance claim.

Personal learning remains separate:

- [ ] Explain Tabs behavior ownership, manual versus automatic activation, disabled discovery, functional RTL positioning and the difference between automated accessibility evidence and WCAG conformance.

### Approved Base UI family refresh — implementation evidence, 2026-10-15

- [x] Extend the approved existing component families with meaningful visual contracts while preserving compound anatomy, generic values, refs, event details/cancellation, render/style/className composition, forms, focus and Base UI presence. Keep simple controls simple.
- [x] Add family styles, default decorative artwork, optional static materials and generated finite/reduced motion. Correct the disclosure block-size transition and retain immediate direct manipulation. Material pack: 1566 bytes gzip, without texture requests, blur or required Motion.
- [x] Update 33 primary demos and their controls/source/comparisons; publish anatomy on all 36 Base UI family pages. Generate 59 local API references from source interfaces. Record the current shadcn/HeroUI adaptations in `docs/COMPONENT_REFRESH.md` and update the existing-component roadmap status.
- [x] Use public Dixy Tabs, Select, Switch, Button, TextField, Slider and Collapsible in documentation controls/disclosures. Preserve semantic HTML and the JSON textarea where no public replacement yet exists.
- [x] `pnpm check`: 125 tests, 946 complete examples and production builds. Packed consumer/SSR/CSS and formatting checks passed. Browser smoke evidence covers 33 documentation pages and focused production Select, source copy, docs Tabs and AlertDialog behavior. Full per-component testing remains deferred.
- [ ] Complete the full visual/state/contrast matrix, narrow-view reflow, screen-reader/browser combinations, actual forced colors/native media switching, text resize/zoom, physical touch, Safari/Firefox and durable visual baselines before conformance claims.

The attempted narrow override remained at 1280px in the background tab; it is recorded as pending, not a mobile pass. Evidence, limitations and development-server recovery are recorded in `docs/BUILD_LOG.md`.

Personal learning remains separate:

- [ ] Explain why virtual generic Roots keep their primitive contract while DOM-owning parts receive visual settings, and independently trace one family through types, styles, generated API, executable docs and the packed consumer.
- [ ] Independently review a compound component's actual accessible names, focus/presence and native form behavior; distinguish implementation completion from WCAG conformance.

### Consistent family comparison showcases — implementation evidence, 2026-10-15

- [x] Use the Checkbox/Switch shared preview-and-source card for all 121 comparison categories across the 33 refreshed families, with labeled independent specimens, public Dixy layout/text and wrapping larger compositions.
- [x] Keep live rows and complete copied multi-instance source aligned, preserving helpers, local state and Theme settings. Include every grouped source in the compiled-public-package example checker.
- [x] Focused development in-app review: Avatar light/dark, all radii/materials, Theme motion propagation, source expansion/copy, independent Select values and Accordion keyboard state, and existing Switch comparison behavior.
- [ ] Complete the previously deferred per-component visual/accessibility matrix, narrow-view reflow, assistive technology, real zoom, physical touch and platform review. This layout pass does not establish WCAG conformance.

Personal learning remains separate:

- [ ] Explain how a grouped example preserves independent component state while sharing the same public demo, configuration and copyable source contract.

Verification evidence for this layout pass:

- [x] `pnpm check`: 125 tests, 1067 complete examples and production builds. `pnpm package:check` and repository formatting passed.
- [x] Fresh production in-app review verified one preview/source card per Avatar category, 32/40/48px frames, complete grouped copy/expansion, independent keyboard Select state, bounded desktop preview rows and no observed production warnings/errors. Evidence is recorded in `docs/BUILD_LOG.md`.

### Common component additions — implementation evidence, 2026-10-15

- [x] Deliver the 37 approved families with Base UI first, unstyled React Aria fallbacks and Dixy-owned semantic/native compositions.
- [x] Document actual part trees, generated contracts, complete copied examples and 94 shared comparison categories; reuse public Dixy components in documentation UI.
- [x] Preserve typed primitive contracts and verify groups, native forms, collections, date/color values, bounded resizing and manual navigation in focused tests.
- [x] Pass `pnpm check` (134 tests, 1462 complete examples and production builds) and `pnpm package:check`, including isolated consumers and unused-family tree-shaking.
- [x] Record all 37 page render checks and focused production interactions, named themed date popups and reduced-motion evidence in `docs/BUILD_LOG.md`.
- [ ] Complete the deferred WCAG 2.2 AA, assistive technology, locale/RTL, zoom, forced-colors, physical-touch and mobile matrix.
- [ ] Personally explain the ownership boundaries between Base UI, React Aria, native semantic parts and application-controlled recipes. Implementation evidence does not establish mastery.

### Playground and surface review — implementation evidence, 2026-10-15

- [x] Use a compact preview-first layout, public Dixy specimens, a separate lazy library view and a dedicated surface/border inspector.
- [x] Separate stroke thickness from contrast roles; preserve default/focus contrast and independent keyboard focus geometry.
- [x] Correct material/elevation and radius-scope inheritance conflicts in generated token styles, with regression assertions.
- [x] Review named-theme control/text contrast across 4,290 combinations per role; keep subtle borders decorative.
- [ ] Complete full WCAG 2.2 AA, assistive-technology, zoom, physical-touch and platform review; token calculations and focused UI checks do not establish conformance.
- [ ] Personally explain how custom-property binding scopes can reset inherited values and how elevation differs from a material finish. Implementation evidence does not establish mastery.

Verification for this pass:

- [x] `pnpm check`: 134 tests, 1462 complete examples, freshness/types and production builds. Independent package consumer checks and formatting passed.
- [x] Focused production desktop/390px, keyboard, light/dark, reduced preview Theme, copy/import/filter and dialog focus/bounds evidence is recorded in `docs/BUILD_LOG.md`; no final production warnings/errors were observed.

### Expressive themes — image exploration evidence, 2026-10-20

- [x] Generate and visually review eight distinct raster directions, including botanical borders, retro OS, Winamp-inspired skins, modern skeuomorphism and glassmorphism. Save all PNGs and exact built-in image_gen prompts in `output/imagegen/2026-10-20-theme-directions/`.
- [x] Record supplied references, common-control intent, additional theme seeds and static-image limitations in the image gallery README and `docs/BUILD_LOG.md`.
- [x] Record the six initial visual directions and a detailed 2D build plan over the existing core components after the user's image review. See `docs/SIX_THEME_PLAYGROUND_IMPLEMENTATION_PLAN.md`; implementation remains pending.
- [ ] Implement and verify selected skins across relevant desktop/mobile, keyboard, light/dark, reduced-motion, contrast and accessibility cases. Static image review is not implementation evidence.
- [ ] Personally explain how expressive borders, materials and state styling preserve the shared components' behavior and accessibility. Personal mastery has not been established.

### User-authored skins — proposal evidence, 2026-10-20

- [x] Inspect the existing expressive Theme contracts and preset serialization, research rendering/authoring options using official sources, and record the six-skin and creator proposal in `docs/PERSONALIZATION_AND_SKINS_PLAN.md`.
- [ ] Implement versioned extensible skin manifests, preset migration, stable styling hooks, independent CSS/assets and nested/portal preference propagation.
- [ ] Deliver the proposed starter skins with an explicit component/state support matrix and measured performance evidence.
- [ ] Deliver a modern fork/edit/preview/export creator and verify public-package output in the intended React frameworks.
- [ ] Personally explain and independently author a skin while preserving component contracts and evaluating rendering/accessibility tradeoffs. A researched proposal does not establish mastery.

### Six 2D skins in the playground — planning evidence, 2026-10-20

- [x] Save a source-grounded implementation plan for Living Forest, Retro OS, Winamp Signal, Studio Hardware, Prism Glass and Tactile Atelier in the existing `/playground`, with component reuse and Three.js/React Three Fiber excluded.
- [x] Record detailed theme briefs, P0–P6 dependency/completion gates, gallery inheritance, preset migration, public-package/export parity, optional 2D shader boundaries and proposed performance budgets in `docs/SIX_THEME_PLAYGROUND_IMPLEMENTATION_PLAN.md`.
- [ ] P0–P1: capture fresh baseline/coverage, implement the skin contract/compiler, scoping and versioned preset migration.
- [ ] P2–P3: deliver two proof skins, then all six through the existing playground/gallery with an explicit component/state matrix.
- [ ] P4: deliver the supported creator controls, draft history and synchronized export/import/share workflow.
- [ ] P5, optional: measure bounded backdrop/shader experiments; accept or reject them with evidence. Static delivery does not depend on a shader.
- [ ] P6: complete required checks and truthful package/framework/browser/accessibility/performance evidence.
- [ ] Personally explain the skin architecture and independently profile an expressive theme. A saved plan does not establish mastery.

### Six skins and procedural Forest — implementation evidence, 2026-10-21

- [x] Add independent six-skin definitions/CSS, scoped defaults and explicit overrides without a theme dependency in the core library.
- [x] Implement v1 migration, v2 bounded presets, per-skin drafts/history, selected SSR styles and synchronized React/JSON/CSS export.
- [x] Reuse the public components in Overview, Player, Email and States; document shared versus specialist coverage for 78 previews.
- [x] Replace Forest's static frame with procedural React/SVG leaves, veins, twigs, flowers, moss and paper, using the generated board as reference.
- [x] Carry Forest character into buttons, fields, choices, tracks and the acorn slider while preserving existing component contracts.
- [x] Add opt-in decorative motion, a finite 20-second playground preview and reduced-motion/effects handling.
- [x] Record automated/packed-consumer and focused desktop evidence in BUILD_LOG.md and FOREST_PROCEDURAL_THEME.md.
- [ ] Complete the mobile, hardware-performance, AT/WCAG, zoom, forced-color and framework release matrix. Mobile/performance work was deferred by the user.
- [ ] Explore the separate particle direction after the Forest review.
- [ ] Personally explain and independently author/profile procedural skin artwork. Implementation does not establish personal mastery.

### Five additional procedural skins — implementation evidence, 2026-10-21

- [x] Refine Retro OS, Winamp Signal, Studio Hardware, Prism Glass and Tactile Atelier with original code-rendered detail guided by their generated boards.
- [x] Add separate optional renderer exports and selected-only docs loading/export parity; retain definition/CSS-only consumption and unchanged core package payload.
- [x] Carry each material through frames, actions, fields, tabs, choices and tracks while preserving the shared components.
- [x] Verify all five light/dark appearances, still/animate/pause and inherited reduced motion/effects in the in-app production browser.
- [x] Verify retained Overview, Mail and Player state through skin switches, native keyboard slider input and decorated Dialog Escape/focus restoration.
- [x] Pass pnpm check and package:check, including all six isolated selected-skin consumers, public declarations, SSR and unselected CSS/renderer exclusion.
- [x] Save screenshots, file-size evidence and architecture notes in output/in-app-browser/five-procedural/ and docs/PROCEDURAL_SKINS.md.
- [x] Generate and inspect four additional imagegen concept boards before further implementation; preserve images/prompts in output/imagegen/2026-10-21-more-theme-directions/.
- [ ] Implement any selected additional concept direction as a live theme; the new four images are visual exploration only.
- [ ] Complete the deferred mobile/performance and wider accessibility/framework release matrix.
- [ ] Personally explain, author and profile these skins. Implementation and generated concepts do not establish mastery.

### Theme content ownership — implementation evidence, 2026-10-21

- [x] Remove theme-injected button icons and the Button ornament slot; preserve consumer icons/content and functional loading behavior.
- [x] Remove automatic Forest label leaves and Retro's fake title bar, window actions and resize grip; reclaim header spacing.
- [x] Record the surface/content boundary in the procedural skin guides for future themes.
- [x] Pass pnpm check (141 tests, 1462 complete examples), package:check and formatting; verify all six skins and focused opposite-appearance/keyboard behavior in the production in-app browser.
- [ ] Complete the previously deferred mobile/performance and broader accessibility release matrix.
- [ ] Personally explain the distinction between expressive surface styling, owned content and functional affordances. Implementation does not establish mastery.

### Theme engine and AI authoring — review evidence, 2026-10-22

- [x] Review the six existing skins, five distinct unbuilt visual directions and current definition/authoring/compiler/preset boundaries.
- [x] Save renderer/parameter recommendations, current source findings, AI authoring architecture and ordered work in docs/THEME_ENGINE_REVIEW_2026-10-22.md.
- [x] Record live desktop rendering structure and the Hardware radius override inconsistency in output/in-app-browser/theme-engine-review-2026-10-22/.
- [x] Implement the first consistent-parameter, portable-defaults and versioned authoring/recipe/compiler slice; broader composition remains pending below.
- [x] Reproduce the existing six skins through the new data model before extending the five unbuilt directions.
- [ ] Add the optional AI proposal adapter and validated artifact workflow after the shared schema/compiler exists.
- [ ] Evaluate optional particle/caustics adapters with target-device evidence; no GPU dependency is required by the current proposal.
- [ ] Complete the deferred mobile/performance/accessibility/framework checks.
- [ ] Personally explain and independently author a validated procedural theme. A review does not establish mastery.

### Shared theme engine — first implementation slice, 2026-10-22

- [x] Add the closed versioned document schema, inferred types, bounds, field diagnostics and trusted recipe registry; preserve SkinDefinition v1 and preset v1/v2 compatibility.
- [x] Compile all six existing themes through the shared package API; generate static settings, CSS, schema, catalog defaults and explicit loader mappings.
- [x] Share foundation styles between standalone settings and playground preview/export without adding the compiler to core or static consumer bundles.
- [x] Verify contextual Square/Large radius, explicit geometry semantics, 2px control stroke, independent elevation/relief and reduced material paint.
- [x] Pass pnpm check (146 tests and 1462 complete examples), package:check and focused formatting; exercise all six static settings exports in packed consumers.
- [x] Save all-six light/dark, geometry/stroke/reduction and focused keyboard/portal/state evidence in output/in-app-browser/theme-engine-implementation-2026-10-22/.
- [ ] Extract independently composable material roles and procedural leaf/vein/seed controls; version 1 currently permits the six reviewed material/frame pairs.
- [ ] Add a document editor/import/registration workflow and later AI authoring; the current playground preset importer still edits installed skins only.
- [ ] Complete deferred mobile/hardware profiling and remaining OS preferences, AT, contrast, zoom, forced-colors and framework release checks.
- [ ] Personally explain and author a theme through this contract. Implementation and passing checks do not establish mastery.

### Independent theme composition and frame polish — implementation evidence, 2026-10-23

- [x] Separate material paint and frame geometry/renderers; compile all 121 registered combinations through document schema v2 while migrating the original paired v1 documents.
- [x] Add Ocean Depths, Candy Clay, Art Deco, Y2K Titanium and Material Light using the same engine and independent public package entries.
- [x] Add right-panel recipe/foundation controls, local naming/saves, custom preset v3, document import, static React/full-CSS/document export, URL restoration and history.
- [x] Compare Candy Clay with its original image and expose reusable cushion relief, text tint and corner fullness instead of theme-ID component overrides.
- [x] Establish shared content-safe Card/Dialog decoration bands, compact-layout clearance variables and one component border owner; remove redundant inlays/pseudo-borders and verify the four reported visual cases.
- [x] Pass pnpm check (148 tests, 1462 complete examples), package:check and focused formatting; keep every selected skin below the 5 KiB gzip gate.
- [x] Record desktop all-eleven light/dark, custom save/reload/import/export/history, Square/Flat/reduced-effects and focused Mail/Player evidence under output/in-app-browser/theme-composition-2026-10-23/.
- [ ] Add semantic material roles, editable leaf/vein/seed geometry and trusted recipe registration tooling; these remain separate from the shipped independent recipe composition.
- [ ] Add AI proposal tooling later using the same schema/compiler, as requested.
- [ ] Complete deferred mobile/hardware profiling and remaining OS preferences, AT, contrast, zoom, forced-colors and framework release checks.
- [ ] Personally explain, independently author and profile a composed theme. Implementation and passing checks do not establish mastery.

### Additional visual theme exploration — 2026-10-23

- [x] Generate and visually review five component-based concept boards: Terminal Phosphor, Liquid Glass, Risograph Club, Midnight Observatory and Inflatable Pop; archive prompts/provenance and verify PNG files.
- [ ] Implement selected directions through the shared engine and verify their component states, accessibility and performance. These images are concepts only.
- [ ] Personally explain and independently author these material/frame recipes. Generated images do not establish mastery.

### No frame and spacecraft concept — 2026-10-23

- [x] Add a shared No frame option, nullable renderer metadata, renderer-free exports and matching playground controls; verify material preservation, save/reload, light/dark and keyboard action.
- [x] Pass pnpm check (150 tests, 1462 examples), package:check and focused formatting; archive in-app evidence.
- [x] Generate, review and archive the Orbital Command spacecraft UI concept with exact imagegen prompt/provenance.
- [ ] Implement a selected space direction through the shared recipes and complete deferred accessibility/performance checks; concept art and implementation do not establish personal mastery.

### Playground performance — evidence, 2026-10-23

- [x] Audit production eager JS, theme-editor work and optional SVG DOM cost; save bounded findings in docs/PERFORMANCE_REVIEW_2026-10-23.md.
- [x] Gate/memoize export generation, defer gallery loading, reuse unchanged preset derivation and avoid redundant stylesheet writes with an active-preserving authored-style cap.
- [x] Pass pnpm check (150 tests, 1462 complete examples) and focused formatting; verify gallery/export/theme/import paths in the in-app browser.
- [ ] Trace and reduce the large shared UI chunk and procedural Forest geometry on representative devices; static bytes/DOM counts do not prove user-perceived speed.
- [ ] Complete deferred mobile/hardware and full accessibility checks; personally explain and independently profile the changes before claiming mastery.

### DialKit recipe tuning — 2026-10-29

- [x] Connect docs-only DialKit sliders to schema-bounded material/frame parameters and the existing theme document; verify keyboard changes and serialized state in the in-app browser.
- [ ] Complete dedicated mobile, dark and reduced-motion verification; independently explain the controlled-state integration before claiming personal mastery.

### Quiet inspector — 2026-10-29

- [x] Apply the selected first playground mockup with a larger preview, progressive disclosure, 12px DialKit gaps and a responsive single-column specimen.
- [x] Verify light/dark, keyboard parameter editing/disclosure and 390px mobile overflow in the in-app browser; preserve preview/export state wiring.
- [ ] Verify OS reduced-motion behavior and screen-reader experience, and independently explain the layout/state decisions before claiming mastery.

### Inspector disclosure refinement — 2026-10-29

- [x] Use public Dixy Accordion parts for all sidebar collapsible sections; preserve primitive state, focus and accessibility contracts.
- [x] Remove the extra Surface wrapper fill in both appearances; verify accordion Enter/Tab behavior, 390px overflow and full pnpm check.
- [ ] Verify OS reduced-motion and screen-reader behavior; personally explain the Accordion composition before claiming mastery.
- [x] Correct inspector terminology: Base foundations contains basic settings; Advanced foundations opens deeper settings. Browser verified and pnpm check passed (2026-10-29).

### Theme character — 2026-11-06

- [x] Add a closed, versioned character block (controls, motion, type voice, states, details, backdrop) with v3→v4 migration that leaves existing CSS unchanged.
- [x] Give all eleven starters a unique control language and personality; verify scoping, reduced-motion guards, focus width and closed data in unit tests.
- [x] Add playground Character controls, Shuffle, Compare themes and per-theme voice; verify keyboard focus, reduced motion, dark persistence and 375px overflow in the in-app browser.
- [x] Pass pnpm check and the package consumer check (online mode; the offline store is missing @swc/helpers@0.5.24).
- [ ] Verify OS-level reduced motion/contrast/transparency, forced colors and screen readers for every control language; profile backdrop cost on real devices.
- [x] Make Shuffle reject combinations below 4.5:1 text and 3:1 accent-button contrast in both appearances; test 120 seeds (2026-11-06).
- [ ] Decide whether Candy Clay and Y2K Titanium should get a deeper accent: their light-mode buttons are about 2:1 against their own surface.
- [ ] Personally explain the character compiler, the specificity strategy and the motion guard before claiming mastery.

### Window chrome — 2026-11-06

- [x] Add a closed `character.chrome` block (titlebar, edge, well, corners) with v4→v5 migration that emits no rules for existing documents; unit-test scoping, decorative-only pseudo content, forced-colors fallback and closed values.
- [x] Rebuild Winamp Signal as a window (grip title bar with buttons, four-layer pixel bevel, LCD display well); give Retro OS a caption bar, Hardware a recessed screwed panel, Deco a stepped edge and Atelier a paper tab.
- [x] Add the Scrapbook starter (social-profile era: gradient header, thick two-tone round box, tinted panel with zebra rows, pink accent) as an independent package entry with no ornament renderer.
- [x] Measure chrome text contrast in the in-app browser (all ≥ 6.1:1) and check 375px overflow, dark Scrapbook and Compare view.
- [x] Give Forest, Prism, Ocean, Candy, Y2K and Material Light their own chrome (new glass/chrome title bars, glass/sunken wells); every starter unique (tested); contrast scan of all bars and wells in light and dark passes (2026-11-06).
- [ ] Verify title bars with long Card.Title + Card.Description content in real apps, forced colors and screen readers in a real browser/OS.
- [ ] Personally explain how chrome maps onto Card parts and why decorative pieces are pseudo-elements before claiming mastery.

### New starters and fonts — 2026-11-06

- [x] Add Blueprint, Riso Zine, Neon Night Market, Sumi Ink and Tokyo Transit from swappable material/frame/painter/character/chrome parts. Each ships as its own package entry. Pass pnpm check and the online package check.
- [x] Remove the docs app's hard-coded list of canvas frames and derive it from `isOrganicFrame` in the themes package.
- [x] Add eight pinned Fontsource Google fonts (Plex Mono, Archivo Black, Tilt Neon, Shippori Mincho, Zen Kaku Gothic New, Playfair Display, Caveat, Bricolage Grotesque) with system fallbacks.
- [ ] Check every painter style in both appearances, at mobile width, with the keyboard, OS reduced motion and forced colours.
- [ ] Decide whether to ship Japanese font subsets (currently Latin only), measuring the size cost.
- [ ] Personally explain how a painter is registered (recipe, organic settings, frame prefix, package entry) before claiming mastery.

### Workspace overview preview — 2026-11-06

- [x] Replace the playground's Overview bento grid with a small product workspace (`apps/docs/src/components/theme-workspace-scene.tsx`) built only from public Dixy parts: Sidebar, Breadcrumbs, SearchField, Kbd, ToggleGroup, Card, Badge, Slider, Tabs, Table, Progress, AvatarGroup, Menu, Field/TextField, RadioGroup, Switch, Checkbox, Alert, Dialog and Toast. Skin voice copy still drives the headline and primary actions.
- [x] Use only semantic tokens and a named container query in `theme-workspace.css`, and keep `Card.Header` + `Card.Content` pairs so window-chrome wells still apply. Remove the orphaned specimen rules from `theme-skins.css` and `.theme-form-status`.
- [x] In-app browser: default light and dark at 1440px, Retro OS and Living Forest skins, 375px with no page overflow and the table fitting its card, keyboard row menu (Enter opens, Escape restores focus), tab arrow navigation, project-created toast. `pnpm check` passed.
- [ ] Check OS reduced motion, forced colours, screen readers and the remaining skins (especially organic frames) with the new layout.
- [ ] Decide whether Overview and the Dashboard preview overlap too much (both now have a sidebar, metrics and a table).
- [ ] Personally explain why the workspace sticks to semantic tokens and Card part structure instead of its own colours before claiming mastery.

### Launch starters — 2026-11-06

- [x] Add 15 starters (32 total), covering terminal/TUI, sci-fi, festival and Glass UI, each with unique chrome, its own painter entry and pinned fonts (VT323, JetBrains Mono). Each skin's CSS is under 5,120 B gzip.
- [x] Compose canvas ornaments by card tier (hero / card / small) with per-instance corner and ink choices, instead of stamping every corner. Keep soft marks out of the content clip with `room()`.
- [x] Fix switch thumbs: the brass diamond uses clip-path instead of `rotate`; the clay squash is vertical only; the switch root doesn't flex-shrink. Measured in the in-app browser across seven control styles.
- [ ] Re-view Picado, Lunar, Yule, Atomic, Azulejo, Freighter and Solar Sail after the tier rework, at mobile width, with the keyboard, OS reduced motion and forced colours.
- [ ] Decide whether v1 needs material-level `backdropBlur`/`backdropSaturate` (and specular/refraction) for real glass.
- [ ] Personally explain why individual `rotate`/`scale` properties compose before `transform` and how that broke the brass switch, before claiming mastery.

### Intrinsic widths and Overview wall — 2026-11-06

- [x] Stop badges, chips, kbd and avatar counts from wrapping or stretching (`fit-content`, `nowrap`, no shrink). Size buttons to their label, with vertical button groups still stretching and empty-state actions centred. Keep checkbox and radio controls from shrinking.
- [x] Diff every button and badge width across all preview views and 78 gallery demos before and after. Fix the two docs consumers that relied on stretching.
- [x] Replace the Overview with a 10-card component wall (direction A, chosen from an HTML mock), using only public Dixy exports, semantic tokens and `Card.Header` + `Card.Content` pairs.
- [x] In-app browser: base light/dark at 1440px and 375px, Papel Picado light/dark, Orbital HUD at 1440px and 375px, Retro OS at 375px, keyboard role menu.
- [ ] Check OS reduced motion, forced colours, screen readers and the remaining frame skins on the new Overview.
- [ ] Add a release note: buttons no longer stretch in grid or column-flex parents; full-width actions need `inline-size: 100%`.
- [ ] Personally explain why `fit-content` on the component plus author CSS outside `@layer` is a safer default than relying on `align-items: stretch` from the parent, before claiming mastery.

### Shuffle well/surface coherence — 2026-11-06

- [x] Give every chrome well a data-driven ground trait (`wellGrounds` in `packages/themes/src/chrome.ts`: surface, canvas, or fixed with tone, ink mix and an appearance-following substitute), exported from `@dixy-ui/themes/authoring`. The LCD CSS reads its ground and ink mix from the same trait.
- [x] Measure the surface-to-well luminance step and text/accent contrast on the well's own ground in `themeContrast`; Shuffle keeps the step ≤ 3:1 and swaps a clashing fixed well for its substitute (LCD → recessed), keeping the rest of the starter's character. Unit-test 400 seeds plus the Winamp LCD case.
- [x] In-app browser: 50 shuffles each in light and dark preview gave zero LCD wells and a worst card-to-well step of 1.34:1; no console errors.
- [x] Warn (advisory, not blocking) under Display well when a hand-picked fixed well clashes with either appearance, with a one-click swap to its substitute that returns focus to the well picker. Decided with the user: alert about likely bad UX, but people can still make odd themes (2026-11-06).
- [ ] Check the well warning with a screen reader (it is a `role="status"` region) and at 375px.
- [ ] Check shuffled themes for frame-painted (organic canvas) and title-bar clashes, which the well trait does not cover; forced colours and OS reduced motion untested.
- [ ] Personally explain why the clash is fixed in Shuffle rather than by making the compiler repaint the LCD for light themes, before claiming mastery.

### Original 12 starters ported — 2026-11-06

- [x] Add card glass as schema v6 material parameters (`backdropBlur`, `backdropSaturate`). A neutral 5→6 migration keeps old paint identical. Surfaces get it only behind `@supports`, and it is disabled for `prefers-reduced-transparency`.
- [x] Port all 12 originals to the mockup's materials, foundations, fonts and character. `pnpm check`, `pnpm package:check` and `verify-package --online` pass. All skins are ≤ 4,646 B gzip.
- [x] In-app browser: all 12 checked in light; Winamp, Candy, Prism, Ocean and Retro checked in dark.
- [ ] Dark mode for Forest, Hardware, Atelier, Deco, Y2K, Material and Scrapbook.
- [ ] Mobile, keyboard, reduced motion, reduced transparency, forced colours, Safari backdrop-filter.
- [ ] Redesign the ornament painters of the 12 originals to match the mockup.
- [ ] Personally explain why glass is a material parameter with a `@supports` guard rather than a chrome well, before claiming mastery.

### Landing page — 2026-11-07

- [x] Replace `/` with a full-width landing page outside the docs shell: hero with an install command and CTAs, a live component showcase, a starter-theme studio, a features grid, a component index, and links to the docs and `/playground`.
- [x] Reuse the playground's theme machinery (`skinThemePreset`, `prepareSkin`, `playgroundThemeProps`, `previewVoice`, `serializeThemePreset`) instead of duplicating it.
- [x] In-app browser: all 33 options applied with no overflow or console errors; light/dark page and preview; 375px with no horizontal overflow; keyboard for the starter group, Dialog, Select and Toast; playground hand-off.
- [ ] Check OS reduced motion with real emulation, forced colours, screen readers, Safari, and each starter at 375px.
- [ ] Remove the now-unused overview styles from `docs.css`.
- [ ] Personally explain why the showcase nests a second `Theme` inside the page's own Theme, and what that means for portals and tokens, before claiming mastery.

### Landing v2: whole-page theming and sections — 2026-11-07

- [x] Keep the app-appearance context identity stable across hot updates by moving it to a dependency-free module; verified with a tokens rebuild while a docs page was open.
- [x] Theme the whole landing page with the chosen starter, using Dixy components throughout; navigation buttons keep link semantics (`role="link"`).
- [x] Re-plan sections after reviewing heroui.com: live app window (Mail, Dashboard, Music, Blocks) with a floating theme dock, starter gallery, bento, snippet, a small components strip, final CTA.
- [x] In-app browser: 33 starters with no overflow or errors; 375px with no overflow; keyboard dock Select; per-panel Suspense fix.
- [x] Persist the chosen starter in the URL (`/?starter=<slug>`), server-rendered with its CSS; verified reload, shared link, invalid slug and clearing (2026-11-07).
- [ ] Decide whether docs pages should adopt the landing's starter.
- [ ] Check reduced motion with real emulation, forced colours, screen readers, Safari, and the scenes under each starter at 375px and in light.
- [ ] Personally explain why a React context must live in a module whose identity survives hot updates, and why `nativeButton={false}` needs `role="link"` for navigation, before claiming mastery.

### Playground inspector tabs — 2026-11-07

- [x] Mock the tabbed inspector in plain HTML/CSS and get approval before building.
- [x] Replace the scene dropdown with a Dixy `Tabs` bar, one panel per scene.
- [x] Group every control into Theme / Style / Character / Export tabs of flat sections; split `ThemeRecipeMixer` into placeable parts.
- [x] Show edits per tab (dots) and in total against the starter, with Reset all.
- [x] In-app browser: all tabs, edit counts and reset, light/dark, 375px with no overflow, keyboard for both tab lists; `pnpm check` passes.
- [ ] Check reduced motion with real emulation, forced colours, screen readers, Safari; exercise save/load and import from the Export tab.
- [x] Keep the inspector tab and scene in the URL (`?view=&panel=`), server-rendered, replacing history; fix the cramped starter thumbnails (2026-11-07).
- [ ] Personally explain why segmented choices use `ToggleGroup` (one tab stop) while the scene picker uses `Tabs`, before claiming mastery.

### Segmented variants — 2026-11-07

- [x] Audit the playground chrome's border and surface tokens; record the soft variant's ink-outline selection as the cause of the wireframe look.
- [x] Add `Tabs variant="segmented"` and `ToggleGroup segmented` built only from surface, border, shadow and text tokens, with forced-colours outlines and material compatibility.
- [x] Tests for selection, focus and axe; registry controls, demo and generated API updated; `pnpm check` and `pnpm package:check` pass.
- [x] Playground uses the library variants; docs-level override removed.
- [ ] Check segmented in forced colours, with a screen reader, vertically oriented, and under each material finish.
- [ ] Personally explain why the segmented thumb rule is scoped through the list (cascade order versus materials.css in the same layer), before claiming mastery.

## Shader backdrops (prototype) — 2026-11-09

- [x] Opt-in WebGL backdrop on `/lab/shaders` for Ocean Depths and Phosphor Terminal, driven by theme tokens, with reduced-motion still frame, off-screen pause and static fallback. Evidence: docs/BUILD_LOG.md, 2026-11-09.
- [x] Four more pairings (Neon Night Market, Prism Glass, Diwali Lights, Solar Sail); uncapped display-rate loop with adaptive resolution; every shader ≤0.1 ms/frame on Apple M5. Evidence: docs/BUILD_LOG.md, 2026-11-09.
- [ ] Measure real frame rate (120 Hz) and battery cost on a low-end laptop and a phone; test Safari and Firefox.
- [ ] Decide whether shaders graduate into `@dixy-ui/themes` as an `effects: "shader"` option behind a separate lazy export (needs `pnpm package:check`).
- [ ] Learning: explain how a fragment shader runs per pixel, why the runtime keeps a single WebGL context, and how token colours reach the GPU as uniforms.

## Example app — Fernpay (/dixy-example), 2026-11-09

- [x] Mock fintech app built only from Dixy components (59 used), with live skin switching across all starters. Evidence: docs/BUILD_LOG.md, 2026-11-09.
- [ ] Keyboard-only and screen-reader pass through the whole app; dark appearance on every view; Safari/Firefox.
- [ ] Library follow-ups found while building: line/area `Chart`, `AvatarGroup` clipping at `sm`, a z-index scale for app chrome vs overlays.
- [ ] Learning: explain why `isolation: isolate` fixed the top bar painting over the dialog backdrop.
- [x] Layout molecules (PageHeader, SectionHeader, SectionFooter, StatCard) on every view; no shift between views or filter states; no horizontal overflow from 375 to 1600px. Evidence: docs/BUILD_LOG.md, 2026-11-09.
- [ ] Learning: explain how fixed slot heights and reserved space prevent layout shift, and why a molecule owns those rules rather than each view.

## Base control alignment — 2026-11-09

- [x] Every field-like control measures 32/40/48 at sm/md/lg across the default theme and 30 skins, checked on `/lab/controls`. Evidence: docs/COMPONENT_AUDIT.md, docs/BUILD_LOG.md 2026-11-09.
- [x] Built-in SVG icons replace consumer text glyphs in the date, calendar, number, search and tag parts.
- [ ] Coarse-pointer hit-area extension for 32px controls; Accordion indicator part.
- [x] Pagination: square tiles at control height, Previous/Next parts with icons. `/lab/kitchen-sink` renders all 76 registry demos for review. Evidence: docs/BUILD_LOG.md, 2026-11-09.
- [ ] Review the kitchen sink (user) and list remaining component fixes.
- [x] Semantic colors: `warning` and `info` join accent/neutral/danger/success on the shared `color` prop (Badge, Chip, Alert, Card and other family components), mapped to the existing status tokens. Outline and ghost Badge/Chip and outline Alert now use the color. Evidence: docs/BUILD_LOG.md, 2026-11-09.
- [x] Kitchen-sink pass: Accordion rows, Breadcrumbs current page, Item actions, Meter/Progress/Slider value row, Skeleton, TagGroup remove, checkbox description, ColorField label, NavigationMenu link, attached ButtonGroup seams, disabled outline buttons. Evidence: docs/BUILD_LOG.md, 2026-11-09.
- [x] NativeSelect chevron: a thin wrapper holds the select and a decorative chevron in one grid cell; ref, className and props stay on the select. Evidence: docs/BUILD_LOG.md, 2026-11-09.
- [x] Second kitchen-sink pass against shadcn source: Table/DataTable, TagGroup, Kbd, ScrollArea, Empty, AvatarGroup count, Carousel icon controls, Item separators. Evidence: docs/BUILD_LOG.md, 2026-11-09.
- [ ] Learning: explain why `:is(a, b):not(c)` outranked the Accordion's own `.trigger` rule, and how to read specificity of `:is()`.
- [ ] Learning: explain why a framed group must own the height and border (and its parts stretch) rather than each part declaring the control height.

## Library gap fill (shadcn / HeroUI / Radix comparison) — 2026-11-07

Components that shadcn/ui, HeroUI or Radix (Primitives + Themes) ship and Dixy did not. Spacer was skipped (Stack and Grid gaps cover it); Portal and Slot are not needed (Base UI portals and `useRender`/`mergeProps`).

- [x] Grid — fixed equal columns or `minColumnWidth` auto-fit with a `min(…, 100%)` overflow guard; stack spacing gaps.
- [x] VisuallyHidden — public utility; `focusable` reveals skip links on focus.
- [x] Code and Blockquote — native elements on `nativePart`, so they take theme colour, radius and skin attributes.
- [x] Snippet — copy to clipboard, an uncopied prompt symbol, a polite status for Copied/Copy failed, timer cleanup.
- [x] PasswordField — Base UI Input inside Field, a toggle with a constant name and `aria-pressed`, controlled and uncontrolled visibility.
- [x] DataList — native `dl`/`dt`/`dd` with subgrid alignment, horizontal or vertical.
- [x] User — Avatar + name + description; the avatar is decorative; initials are derived from the name.
- [x] Image — lazy loading, a placeholder, one fallback, `data-status`, a reduced-motion-aware fade, a pre-hydration `complete` check.
- [x] Navbar — a header landmark, Collapsible menu, container-query collapse (`sm`/`md`/`lg`/`never`), `aria-current`, closes the menu on navigation.
- [x] 10 interaction/axe tests in `extras.test.tsx`; registry entries, demos and generated API; `pnpm check` and `pnpm package:check` (run with `--online` in a fresh worktree) pass.
- [ ] Forced colours, screen readers (VoiceOver/NVDA), touch, and 200%/400% zoom for all ten components.
- [ ] Each material finish and skin looked at visually on Snippet, PasswordField and Navbar.
- [ ] Personally explain why Navbar uses a container query rather than a media query, and why Image resets its state during render instead of in an effect.

## Public beta readiness — 2026-11-08

Plan and remaining steps: [docs/BETA_PLAN.md](docs/BETA_PLAN.md).

- [x] MIT license and package metadata on all published packages.
- [x] Docs build and run on Cloudflare Workers (`workerd` locally; dry-run upload 1.6 MiB gzipped).
- [x] Deploy-docs and release workflows, safe to merge before any accounts are connected.
- [x] Changesets beta pre-release mode; dry run produces `0.1.0-beta.0`.
- [x] User-facing README, supported browsers, beta labels, CONTRIBUTING (DCO), SECURITY, code of conduct, issue/PR templates.
- [x] Tree-shaking check with size budgets in `package:check`; fixed `Field`/`Dialog` retaining Base UI code (Button-only bundle 128.8 → 17.1 KiB).
- [ ] Connect Cloudflare (API token + account ID secrets) and confirm the first production deploy and a PR preview.
- [x] Create the `dixy-ui` npm organisation and the `NPM_TOKEN` secret (scoped to `@dixy-ui`, expires 2026-12-08).
- [ ] API naming pass and Experimental labels.
- [ ] Beta accessibility bar: contrast script, keyboard, forced colours and zoom passes, Known issues page.
- [x] Remove `private` from the three packages and add `publishConfig` (public, provenance).
- [ ] Publish `0.1.0-beta.0`, smoke-test from npm, then switch to trusted publishing and delete the token.

## Docs performance pass — 2026-11-09

- [x] `@dixy-ui/react` builds one module per component (`preserveModules`), so docs pages load only the components they render; route options and route CSS no longer pull the playground, Fernpay, foundation components or landing CSS into the entry. `/docs/installation` initial JS 2,339 → 1,017 KB (677 → 294 KB gzip). Evidence: docs/BUILD_LOG.md, 2026-11-09.
- [x] Docs theme switching loads the starter's CSS before committing it (no half-styled frames); the docs theme is inlined only on docs-shell pages; the landing shader loop runs on the compositor; `<html>` follows the themed canvas so overscroll is no longer white.
- [ ] Measure LCP and INP with the pane visible, on throttled network and CPU, and in Safari and Firefox.
- [ ] Prune inactive skin `<style>` tags on docs theme switches; make skin definitions load lazily.
- [ ] Learning: explain why a route's `validateSearch` import ends up in the entry chunk, and how bundlers decide chunk boundaries by module rather than by export.

## Radius and hero fixes — 2026-11-09

- [x] Multi-line fields cap at the card radius under `radius="full"` (library textarea and skin compiler); docs scene cards use the card radius. Evidence: docs/BUILD_LOG.md, 2026-11-09.
- [x] Homepage hero height no longer follows the active scene (`contain: size` on the stage body).
- [ ] Audit other multi-line surfaces that use `--dixy-radius-control` under `radius="full"`.
- [ ] Learning: explain why `min(control, card)` changes only the full radius mode.
- [ ] Learning: explain how `contain: size` stops a grid item's content from sizing its row.

## Wren modes and phone layout — 2026-11-10

- [x] Chat and Work modes: a compact one-row composer in Chat; a taller composer and starter cards in Work. Evidence: docs/BUILD_LOG.md, 2026-11-10.
- [x] Composer text is centred on the tools through one shared row height (desktop and coarse pointer).
- [x] Phone layout: drawer holds the theme and appearance controls, replies use the full width, Work cards scroll sideways.
- [x] Library: textarea re-fits on width change; response tables scroll instead of breaking words; the transcript contains its positioned descendants.
- [ ] Test on a real phone (iOS Safari keyboard, safe area).
- [ ] Learning: explain why an unpositioned scroll container lets absolute children stretch the page.

## AI parts and Wren example — 2026-11-09

The anatomy follows Vercel's AI Elements; the implementation is Dixy's own (Base UI + tokens). Evidence: docs/BUILD_LOG.md, 2026-11-09.

- [x] Optional `@dixy-ui/react/ai` entry and `ai.css`; core JS and CSS unchanged, guarded by the tree-shaking and package checks.
- [x] Conversation: stick-to-bottom that yields to the reader, a keyboard-scrollable log, status announced once per change.
- [x] Response: GFM markdown through Dixy parts, streaming repair of partial markdown, memoized finished blocks.
- [x] PromptInput: Enter/Shift+Enter/IME rules, autosize, one Send↔Stop button that keeps focus.
- [x] Message, Reasoning, Tool, Sources, Suggestions, CodeBlock, Shimmer, Loader; reduced-motion handling.
- [x] Wren example (`/ai-example`) on a scripted, AI SDK-shaped mock stream; landing showcase card.
- [x] Docs component pages, playgrounds and generated API for the AI parts (AI category, 10 pages, gallery coverage test).
- [x] Wren: starter-skin picker, collapsible icon-rail sidebar with chat search, centred empty state.
- [ ] Shared `Sidebar` rail mode in the library (Fernpay and Wren each hand-build one).
- [ ] Screen reader pass (VoiceOver/NVDA) on streaming announcements; OS reduced motion; touch scrolling; forced colours; zoom; RTL.
- [ ] Packed consumer test importing `@dixy-ui/react/ai` with its markdown peers.
- [ ] Learning: explain why the log is not a live region and what Root announces instead.
- [ ] Learning: explain why streaming pins with an instant scroll, and why wheel/touch/key intent releases the pin before scroll events do.
- [ ] Learning: explain why Send/Stop is one button and why empty input uses `focusableWhenDisabled`.
- [ ] Learning: explain what `completeMarkdown` repairs and why only the last block is re-parsed.
- [ ] Learning: explain why the sidebar toggle and composer must stay the same DOM element across layout changes.
