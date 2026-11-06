# Dixy personalization and skins proposal

Date: 2026-10-20. Status: researched proposal; no runtime implementation or new dependency installation in this task. Builds on the implemented foundations recorded in EXPRESSIVE_FOUNDATIONS_PLAN.md and the eight image boards in output/imagegen/2026-10-20-theme-directions/.

Implementation update, 2026-10-20: the detailed, authoritative build plan is [Six 2D skins in the existing playground](SIX_THEME_PLAYGROUND_IMPLEMENTATION_PLAN.md). The user has fixed the current direction as 2D. Three.js and React Three Fiber are excluded; optional direct WebGL2/GLSL effects are a separately measured experiment, with WebGPU/WGSL deferred. The six themes will be built into the existing /playground, using the current components. This overview supplies product rationale; the detailed plan governs package/API choices, work packages and acceptance criteria.

## Product direction

Dixy should let a brand or individual author a distinctive interface skin while continuing to use the same components. Personalization includes silhouette, edge construction, material, texture, typography, icon treatment, depth, ornament and interaction response, in addition to color. Forms, selection, focus, refs, events and accessible relationships remain owned by the existing components.

A skin is an installable, versioned visual package. A personality preset remains a smaller coordinated default for finish, shape and motion; do not grow the existing personality enum into a closed list of every user-created skin.

## Current repository evidence

- packages/react/src/theme/theme.tsx already supplies material, shape, personality, effects, motion, radius, colors and density. ThemeScope carries settings and token overrides into portals. Ancestor motion/effects reduction wins.
- packages/tokens/src/materials.ts defines matte, glossy, soft, metal and paper recipes, plus existing conservative material/backdrop budgets.
- packages/tokens/src/shapes.ts supplies semantic control/container/feature radii and decorative SVG silhouettes; interactive content is deliberately not clipped.
- packages/tokens/src/personalities.ts coordinates restrained, playful and tactile defaults.
- packages/react/package.json exports optional materials, backdrop pilot, Motion and feedback entries. Motion is an optional peer. The React peer range is currently React 19.
- apps/docs/src/lib/theme-playground.ts has a validated, serializable version-1 preset, starter presets, import/export and theme mapping. The serialized preset covers colors, typography, radius, density, depth and border, but does not yet describe skin assets, role recipes or the full expressive Theme settings.
- packages/react/vite.config.ts emits optional CSS separately. Preserve this separation for skin packs.

The missing work is an authoring/distribution contract, stable styling hooks and skin coverage, rather than a new rendering engine.

## Rendering and dependency decisions

| Need                                                             | Recommended approach                                                                             | Ownership and limits                                                                                                                                             |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Component behavior                                               | Existing Base UI, React Aria and native semantic parts                                           | Preserve current family ownership; no replacement component stack.                                                                                               |
| Color, geometry, bevel, light, depth and pressed response        | CSS variables, explicit cascade layers, gradients, borders and bounded shadows                   | Default path; no additional theme renderer JavaScript or idle animation loop. CSS painting still has a cost.                                                     |
| Botanical edges, pixel corners, panel seams and custom ornaments | Original optimized SVG; corner pieces plus repeatable edges, or suitable nine-slice border-image | Decoration only, independent of focus and target geometry. Avoid stretching leaves around a changing rectangle.                                                  |
| Material grain where CSS is insufficient                         | Small cacheable raster tiles                                                                     | Selected pack only; verify compressed transfer and decoded dimensions. Do not rasterize entire controls or their text.                                           |
| Finite interaction motion                                        | Existing CSS motion tokens; optional existing Motion entry for a demonstrated need               | Keep Base UI presence ownership. Motion documents feature splitting and lazy loading.                                                                            |
| Theme import/schema tools                                        | Zod, if the richer schema justifies replacing the current manual parser                          | Authoring/editor and build tools only; do not add validation to every rendered control. Schema validation is not asset sanitization or accessibility validation. |
| SVG optimization                                                 | SVGO                                                                                             | Build-time only. Optimization is not sanitization; imported SVG needs a separate restricted ingestion policy.                                                    |
| Optional 2D shader effect                                        | Separate direct WebGL2/GLSL experiment; WGSL backend deferred                                    | Six static themes use CSS/SVG. One lazy decorative region, no 3D engine, complete static fallback and measured lifecycle/cost gates.                             |
| Tokens exchanged with design tools                               | DTCG-compatible export of suitable standard token types                                          | Keep asset manifests, component recipes and policy metadata separate or in documented extensions. The DTCG report is not a W3C Standard.                         |

Sources: [Base UI styling](https://base-ui.com/react/handbook/styling), [Motion bundle splitting](https://motion.dev/docs/react-reduce-bundle-size), [CSS border-image](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/border-image), [CSS masking](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/mask-image), [CSS backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter), [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API), [WebGPU and WGSL](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API), [Zod](https://zod.dev/), [SVGO](https://svgo.dev/), [DTCG token format](https://www.designtokens.org/tr/2025.10/format/).

WebGL is a browser graphics API and uses GLSL shaders; WebGPU uses WGSL. Both can render 2D effects without a 3D engine. CSS/SVG supply the six complete default skins. A direct shader experiment may enhance a bounded backdrop; it does not render controls or automatically sample live DOM. No rendering stack guarantees zero performance cost.

## Skin anatomy

1. Foundations: semantic palettes and foregrounds, typography roles, spacing/density, borders, shape roles and elevation.
2. Surface recipes: matte, enamel, paper, ceramic, metal, tinted glass; layer opacity, static lighting and permitted grain.
3. Edge recipes: plain, pixel-step, machined, botanical, stitched; separate control, container and feature treatments.
4. Component mapping: role defaults plus explicit per-component/part overrides where a real visual difference needs them.
5. Response recipes: hover, pressed, selected, disabled, loading, invalid and focus; finite timings/press distance rather than arbitrary callbacks.
6. Assets and metadata: original art, relative asset references, dimensions, attribution/license, schema version, compatible Dixy versions, declared coverage and fallback.
7. Appearances and preferences: authored light/dark mappings, static fallback, reduced effects/transparency, reduced motion and forced colors.

Use stable documented part attributes or CSS hooks rather than relying on undocumented internal selectors. Existing pseudo-elements are already occupied on some controls: reserve an explicit decorative layer where needed instead of assuming every component has a free ::before.

Decorative layers are hidden from assistive technology, ignore pointer input, do not affect layout or focus, and cannot cover labels. Avoid SVG filters on text-containing parents. For botanical or angular outlines, the real focus indicator and usable hit region remain clear and unclipped.

Token values alone cannot express all of these designs. Static role/part recipes plus a small decoration contract cover the needed differences without six component implementations.

## Authoring and packaging

Proposed packages/entries, not existing exports:

- @dixy-ui/themes: independently importable built-in skin CSS and selected assets.
- @dixy-ui/themes/authoring plus the build script: manifest schema, migrations and normalization/compiler support. The detailed plan keeps this in one theme workspace package initially.
- Existing @dixy-ui/react: behavior plus skin scope/inheritance integration; no editor, graphics engine or all-skins barrel side effect.
- Docs theme studio: consumes compiled public packages, using Dixy's own controls.

A manifest should contain schemaVersion, id/name, compatibility, token values/aliases, authored light/dark values, recipe selections, permitted part overrides, assets/provenance, declared supported components and effect preferences. Use an open namespaced skin ID and installed pack registration rather than requiring edits to the library's personality union.

Provide two creation paths:

- Visual creator: users fork a skin and compose registered materials, frames, ornaments and response recipes without writing code. Import/export is data with bounded values and asset references.
- Developer skin SDK: authors can add original static CSS/SVG recipes through documented hooks and ship a pack. Arbitrary JavaScript is not part of the shareable visual preset format. New recipe packs are installed through an explicit developer workflow, not executed from an imported preset.

Compile manifests to static CSS variables, scoped recipe selectors and asset URLs. Keep the compiler out of normal consumer bundles. Use the same validated model for studio previews and exports. The studio may interpret edits live; consumer output should not parse/recompile a theme on each render.

Migration should accept the current version-1 presets unchanged and upgrade them with default recipe mappings. New fields require a new preset schema version, not silent reinterpretation of old data. Record pack compatibility so a core update cannot silently change old skins.

Precedence: ordinary base defaults < skin defaults < explicit nested theme/component customization. Inherited accessibility/effect reductions constrain the resulting enhancement. Theme ID, computed values and preference updates must cross portal boundaries, including overlays already open when the user changes skin.

Illustrative future consumer usage; this API does not exist yet:

```tsx
import { livingForest } from "@dixy-ui/themes/living-forest";
import "@dixy-ui/react/styles.css";
import "@dixy-ui/themes/living-forest.css";

<Theme skin={livingForest}>
  <Button>Explore</Button>
  <Switch.Root>
    <Switch.Thumb />
  </Switch.Root>
</Theme>;
```

## A modern creation experience

Flow: browse gallery → fork → choose character and foundations → tune component details → inspect real application/state previews → export/save/share.

Expose understandable controls: frame style, material, roundness, relief, ornament amount, typography, color and response. Give quieter dense-content styling and more expressive feature surfaces separate roles; avoid decorating every table cell like a hero card.

Include light/dark and reduced-effects preview switches, hover/pressed/disabled/error samples, a mobile viewport, undo/reset and a comparison view. Show honest contrast/effect/asset feedback. An automated check is evidence for the inspected cases, not a blanket accessible-theme badge.

Export CSS plus assets, the editable versioned manifest and the matching React usage snippet. Start with local files and existing share mechanisms. A community gallery and remote asset hosting are later distribution work; they are not prerequisites for the first creator.

## Six initial skins

| Skin            | Distinctive treatment                                                     | First implementation technique                                                                 | What it proves                                                            |
| --------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Living Forest   | Vine edges, restrained leaves, ivory reading surfaces, seed-like thumbs   | SVG corner/edge assets plus CSS surfaces; optional tiny grain tile                             | Scalable artwork, decorative clearance and expressive versus quiet roles. |
| Retro OS        | Pixel corners, window rails, hard offset shadows, bold mono accents       | CSS edges/shadows and small static pixel SVG where needed                                      | Geometry and press response can change without component forks.           |
| Winamp Signal   | Dark modular panels, gunmetal bevels, lime active marks and linear faders | CSS lighting, borders, finite highlights and authored dark/light palettes                      | A coherent skin can cover ordinary forms as well as a player composition. |
| Studio Hardware | Ceramic housings, orange reveals, machined slider/switch thumbs           | CSS bevels, bounded shadows and static directional highlights                                  | Modern skeuomorphism using the same controls and values.                  |
| Prism Glass     | Translucent tinted panels, thin optical edges and periwinkle active areas | Static translucent/tinted recipe by default; bounded backdrop enhancement on selected surfaces | Optional expensive effects degrade to a recognizable opaque skin.         |
| Tactile Atelier | Paper, walnut framing, stitched details, enamel and brass                 | CSS plus a few optimized edge/texture assets                                                   | Material diversity and warm craft beyond a palette swap.                  |

Keep Y2K Titanium as the next Winamp-family skin and Material Light as a quieter later alternative. The six proposed initial skins are product recommendations, not an implementation commitment already executed.

## Delivery sequence

1. Contract slice: define the manifest and open skin IDs; establish role/part hooks, cascade/override rules, v1 migration, static CSS emission and portal/preference propagation.
2. Two contrasting proofs: build Studio Hardware and Living Forest across Card, Button, IconButton, TextField, Switch, Checkbox, Slider, Progress, Tabs, Select, Dialog and Toast. Use the same application code for both. This exposes decoration/material limitations before authoring all packs.
3. Six-pack authoring: complete Retro OS, Winamp Signal and Tactile Atelier from the proved contract; add Prism Glass with static mode first and backdrop enhancement only after measurement.
4. Coverage expansion: map the rest of the existing catalog through shared roles, then review each family's special parts. Keep an explicit supported/partial/pending matrix. A twelve-component proof is not full-library support.
5. Creator: extend the existing playground into fork/edit/preview/export, consuming the same schema/compiler as theme authors. Keep controls, preview and copied output synchronized.
6. Release gate: production browser review, packaged consumer checks and framework fixtures; record limitations. Community publishing can follow a stable local export/import experience.

The starter coverage should include default/hover/focus/pressed/selected/disabled/loading/invalid as applicable, nested skins, open portals, long text, RTL, dense content and failed/missing assets. Reuse one settings form, player composition and dense dashboard/table scene for fair comparisons.

## Performance and compatibility acceptance

- Target zero extra skin-renderer JavaScript and zero idle timers/requestAnimationFrame loops for static skin consumers. Some theme selection/React scope code may still be needed; measure that incremental cost rather than claiming all themes are zero-JS.
- Import only the selected skin pack; verify CSS, asset, font and JS transfers separately in the packed consumer. Do not ship all six packs to every app.
- Keep the existing material pack's 5 KiB gzip budget. Initially target at most an additional 5 KiB gzip CSS per selected skin and a separately measured asset budget; detailed SVG artwork may need a justified adjustment after profiling. These are proposed limits, not measured achievements.
- Retain the current pilot's one bounded blur region, at most 8px and 15% viewport area, until device evidence justifies any expansion. Those limits do not guarantee good performance. Do not apply backdrop-filter to every nested control/card.
- Static first paint must be usable before optional effects and assets load. A missing leaf tile, unsupported filter or reduced-effects setting leaves a complete legible control.
- Measure unchanged flat and skinned scenes under idle, scroll, typing, press and overlay interactions. Inspect frame distributions, paint/raster work, long tasks, transferred bytes and memory where tooling exposes them. Include representative mobile hardware; desktop throttling is not proof of mobile GPU/power behavior.
- A future optional 2D shader enhancement must stay outside component semantics, load separately, stop offscreen/when hidden/reduced, render on demand at rest and release resources. The detailed plan bounds one region and excludes a canvas per button.
- Target Vite React, TanStack Start, Next.js App Router and React Router SSR through separate small consumer fixtures. Keep the library independent of their routers and CSS frameworks. Existing SSR fixtures do not establish every framework's compatibility.
- React 19 is the current peer target. RSC consumers require correct client boundaries and build preservation of directives; theme token/CSS data can remain independent. React's [client-boundary documentation](https://react.dev/reference/rsc/use-client) explains this distinction.
- Check pnpm check for implementation; pnpm package:check for changed CSS, public exports/types or packaging. Review actual desktop/mobile, keyboard, light/dark, reduced-motion/effects, forced-colors, composited text/control contrast and assistive technology as applicable.

## Decision to carry forward

Build an extensible 2D CSS/SVG skin system and a modern creator in the existing playground on Dixy's existing behavior and expressive foundations. Use the first six skins to validate it. Add Zod/SVGO only in authoring tooling if useful; retain optional Motion. Exclude Three.js/React Three Fiber. Optional direct 2D shaders require the separate evidence gate in SIX_THEME_PLAYGROUND_IMPLEMENTATION_PLAN.md. This remains planning: no new runtime, theme pack or compatibility claim was delivered.
