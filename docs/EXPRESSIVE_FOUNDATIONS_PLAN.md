# Dixy expressive foundations architecture plan

Research date: 15 October 2026. The sections below preserve the original architecture proposal. Static materials, semantic shapes, personality presets and optional feedback are now implemented; the bounded backdrop and connected-press examples remain experiments. See the implementation evidence in `docs/BUILD_LOG.md` for actual exports, checks and device limits.

Extend Dixy with Shape, Materials, Haptics, and Emotion, and develop the existing Motion foundation. Make static CSS materials the default rendering approach. Offer backdrop glass as a separate enhancement after profiling it. This gives Dixy tactile character while keeping everyday controls independent of a rendering engine.

## Current Dixy foundations

`packages/tokens/src/surfaces.ts` already owns radius, border, focus, and shadow contracts. `packages/tokens/src/motion.ts` owns timings, easing, spatial/effects springs, and reduced transitions. The React package has generated component aliases, an optional Motion entry, preference handling, and `ThemeScope` propagation into portals. Extend these contracts instead of creating parallel radius, elevation, or animation systems.

The docs consume compiled package exports. Continue generating CSS and API metadata from local contracts; keep the router and documentation outside the library.

## Texture and material library comparison

Suitability below is an engineering assessment of the documented approaches, not a benchmark. Transfer size and rendering cost are separate: a small stylesheet can still request expensive painting.

| Candidate                                                        | What it provides                                                                                          | License and integration                                                      | Recommendation for Dixy                                                                                                                                                                                             |
| ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Open Props](https://open-props.style/#gradients)                | CSS custom properties for gradients, noise, inner/outer shadows, and other foundations; selective imports | MIT; CSS can be used without a JavaScript runtime                            | Best reference or selective upstream source. Dixy already owns overlapping tokens, so avoid importing the complete foundation. Its noise examples use filters; isolate decoration from text and profile the recipe. |
| [pattern.css](https://github.com/bansal/pattern.css)             | CSS backgrounds for dots, grids, stripes, and related repeating patterns                                  | MIT; no JavaScript; uses `currentColor` and transparency                     | Best small CSS pattern candidate. Adapt selected recipes into optional Dixy textures with notices, or provide an optional integration. Patterns alone do not supply gloss, lighting, or depth.                      |
| [Hero Patterns](https://heropatterns.com/)                       | Downloadable repeatable SVG patterns and generated background CSS                                         | CC BY 4.0; retain credit, license link, and modification information         | Useful optional assets. Self-host only selected patterns. Keep provenance with each asset and distribute appropriate attribution.                                                                                   |
| [css-doodle](https://css-doodle.com/)                            | Generative art web component with CSS/SVG features, shader features, and terminal image rendering         | MIT library; community artwork has its own provenance                        | Use for authoring experiments and exported static assets. Its runtime and potentially elaborate scenes are unnecessary for default component materials.                                                             |
| [Textures.js](https://github.com/riccardoscalco/textures)        | JavaScript generation of SVG patterns, designed for data visualization with D3                            | MIT                                                                          | Useful for chart patterns or asset generation. No reason to add a D3-oriented runtime to a surface finish.                                                                                                          |
| [liquid-glass-react](https://github.com/rdev/liquid-glass-react) | Refraction, chromatic aberration, elasticity, and glass controls                                          | MIT; React integration                                                       | Reference for an isolated experiment. The maintainer documents missing displacement in Safari/Firefox and describes shader mode as less stable. It does not meet the default cross-browser reliability goal.        |
| [liquidGL](https://github.com/naughtyduk/liquidGL)               | Snapshot rasterization and WebGPU/WebGL glass rendering, with renderer fallbacks                          | JavaScript/GPU renderer; review the selected release license before adoption | Keep outside the component foundation. Dynamic content registration, texture memory, CORS, and documented large-surface Safari instability add integration costs.                                                   |

The [CC BY 4.0 terms](https://creativecommons.org/licenses/by/4.0/) require appropriate attribution and identification of changes. Preserve MIT notices when adapting library code. The implementation uses original Dixy CSS recipes and no new rendering dependency or third-party texture asset.

**Recommended stack:** Dixy-owned CSS recipes; selected pattern.css/Open Props ideas or code where useful; small self-hosted texture tiles; the existing optional Motion integration. Add dependencies only where they save meaningful maintenance. A material combines finish, texture, lighting, edge, and depth; a pattern library supplies only part of that system.

## What Apple publicly documents about Liquid Glass

Apple describes a layered material with lensing, highlights, shadows, adaptive tint and contrast, and interaction-linked deformation. The regular material adapts to its surroundings; the clear variant has narrower use cases. Glass belongs primarily to floating navigation and controls, with content retaining a clear hierarchy. System accessibility settings modify transparency, contrast, and motion. These are coordinated behaviors beyond a blur effect. [Meet Liquid Glass](https://developer.apple.com/videos/play/wwdc2025/219/)

Native apps apply the system effect through APIs such as SwiftUI `glassEffect`, its interactive configuration, and `GlassEffectContainer`. A container lets nearby glass share a sampling region, and effect IDs connect morphing transitions. Apple explains that glass cannot directly sample other glass consistently. [Build a SwiftUI app with the new design](https://developer.apple.com/videos/play/wwdc2025/323/)

Apple documents rendering glass together as a performance optimization. It also warns that updates beneath glass require additional calculations and that grouping spatially distant elements can enlarge the region that needs updates. Native glass still has a rendering cost. [GlassEffectContainer](https://developer.apple.com/documentation/swiftui/glasseffectcontainer), [Rendering efficiency](https://developer.apple.com/documentation/xcode/improving-your-app-s-rendering-efficiency)

These sources document behavior and public integration APIs. They do not establish a complete proprietary shader implementation or prove that an equivalent web effect has the same cost. For Dixy, borrow the hierarchy, shape coherence, restrained highlights, and preference handling. Describe optional CSS blur as frosted glass; reserve “liquid refraction” for an experiment that actually distorts the backdrop.

## Proposed foundation contracts

| Foundation | Dixy contract                                                                                      | First delivery                                                                                                                                                                                     |
| ---------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Shape      | Primitive silhouettes → semantic control/container/feature roles → supported component assignments | Reuse existing radius tokens for rounded rectangles and pills. Add opt-in static SVG silhouettes for decorative surfaces. Keep focus outlines, hit areas, and labels outside destructive clipping. |
| Materials  | Typed recipes referencing color, texture, finish, edge, existing depth, and foreground roles       | Matte, glossy/enamel, soft/clay, brushed metal, and paper. Add frosted glass only after the static slice is measured.                                                                              |
| Motion     | Existing timings and spatial/effects springs, plus finite response recipes                         | Reuse current press/presence behavior. Later prototype an expressive button group with distinct pressed and selected states, preserved minimum sizes, and immediate reduced behavior.              |
| Haptics    | Semantic selection, toggle, snap, success, and warning events delivered to an optional adapter     | Default no-op adapter; user opt-in; client-only invocation after meaningful state changes. Native hosts may supply their own adapter. Visual feedback always remains sufficient.                   |
| Emotion    | Explicit personality presets combining the other foundations and authored feedback guidance        | Start with restrained, playful, and tactile presets. Preserve semantic status colors and accessibility settings. Personality never infers a user's emotion.                                        |

Google's expanded shape library is a useful precedent for expressive silhouettes and morphing, rather than a requirement to put complex contours on every control. [Material 3 Expressive](https://m3.material.io/get-started)

Browser vibration is not a portable native haptics engine. The Vibration API has limited availability and may do nothing when unsupported. Feature detection alone does not establish permission, suitable hardware, or delivery. Haptics must never determine whether an action succeeds. [Vibration API](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API)

### Material composition

Use a stable base and foreground, then add decorative lighting and texture behind the content. Keep opacity on the decorative layer rather than the whole control. Decorative layers must not intercept events, create accessible content, or alter layout. Do not apply filters to the parent containing labels or icons. Avoid consuming pseudo-elements that a component already needs.

Reuse existing semantic shadows and borders. A glossy recipe adds a static highlight and bevel; soft/clay adjusts lighting; brushed metal adds a restrained directional pattern; paper uses a small repeatable tile when gradients cannot produce the required detail. These are visual approximations, not physical simulations.

Keep dense reading surfaces quiet. For glass over arbitrary imagery, a tint is not sufficient evidence of readable contrast. Give critical text an opaque backing or keep that surface opaque; verify every allowed foreground/background combination. Loading, disabled, selected, error, hover, and focus must retain their existing meanings.

### Rendering modes

| Mode                      | Rendering                                                                            | Intended use                                                         |
| ------------------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| Static, default           | Bounded CSS gradients, borders, shadows; optional cached tiles; no backdrop sampling | Controls, cards, long lists, and reading surfaces                    |
| Backdrop, explicit opt-in | Static glass styling plus a bounded `backdrop-filter` region                         | A small floating toolbar or navigation surface after profiling       |
| Experimental refraction   | Separate demo/module with SVG displacement or a GPU renderer                         | A specialized experience with its own compatibility and power review |

`backdrop-filter` processes the backdrop and requires transparency to be visible. Feature support says whether an effect can render, not whether it is inexpensive on a device. Use `@supports` with a complete opaque fallback. [MDN backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter)

Reduced transparency and increased contrast force opaque materials; forced colors remove decorative images and preserve system colors and focus. Reduced motion removes decorative movement. Dixy's explicit reduced-effects setting should conservatively select static, opaque recipes. Respect `prefers-reduced-transparency` where available, but provide an explicit setting because support remains limited. [MDN reduced transparency](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-transparency)

Prefer transform/opacity for finite decorative motion, then measure the result. They often avoid layout/paint, but large layers and excessive promotion still consume resources. Do not animate blur, shadows, texture offsets, or widths across an entire component collection. An expressive group that reallocates width needs a dedicated layout experiment and a nonmoving fallback. [Web animation performance](https://web.dev/articles/animations-guide)

### Package and theme integration

Proposed source ownership:

```text
packages/tokens/src/materials.ts          canonical recipe definitions
packages/tokens/src/shapes.ts             silhouettes and semantic assignments
packages/tokens/src/personalities.ts      coordinated preset mappings
scripts/generate-materials.mjs            CSS generation and freshness checking
packages/react/src/tokens/component-materials.ts
packages/react/src/styles/materials.css   generated/compiled optional styling
packages/react/src/feedback/              optional feedback adapter
apps/docs/src/components/material-foundation.tsx
```

Expose optional `@dixy-ui/tokens/materials.css` and `@dixy-ui/react/materials.css` entries. Emit them separately: the current React Vite build collects CSS into `styles.css`, so merely creating another source file will not guarantee independent loading. Verify packed artifacts and dependency graphs. Do not import optional textures or effects from the core stylesheet or root JavaScript entry.

Add a typed `material` option only to supported surfaces and controls, initially Box/Button/IconButton; derive API metadata from those local types. Keep semantic variants responsible for status/emphasis and let materials change finish. Register allowed combinations rather than enabling arbitrary recipes on every component.

An illustrative future usage, **not a current API**:

```tsx
import "@dixy-ui/react/styles.css";
import "@dixy-ui/react/materials.css";

<Theme effects="static">
  <Button material="glossy">Create project</Button>
</Theme>;
```

`effects` would allow `static`, `backdrop`, and `reduced`, defaulting to `static`. It governs rendering policy rather than replacing the existing `motion` preference. Ancestor or OS reduction wins. Carry the policy, personality mappings, and token overrides through both Theme context and `ThemeScope`; exercise already-open portals when preferences change. Use deterministic static SSR, with CSS feature/preference queries for enhancements. Avoid hardware or battery heuristics as a condition of usable rendering.

## Proposed performance budgets and validation

These are initial acceptance targets to validate during implementation, not achieved measurements or promises of low battery use.

| Area                         | Starting budget                                                                                                                 |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Core dependency cost         | No added material runtime JavaScript, texture requests, or required Motion dependency for existing core consumers               |
| Optional static material CSS | At most 5 KiB gzip for the initial recipe pack, measured separately from core CSS                                               |
| Texture assets               | At most 4 KiB transferred per tile and 16 KiB for the initial pack; maximum 256 × 256 pixels per tile; request only used assets |
| Steady state                 | No material timers, requestAnimationFrame loop, polling, or infinite decorative animation                                       |
| Per surface                  | Initially at most two gradient layers, one texture layer, and two shadow layers; no blanket `will-change`                       |
| Backdrop pilot               | One visible sampling region, at most 15% of viewport area and 8px blur; increase only with device evidence                      |
| Layout                       | No material-induced layout shift or hit-target change; keyboard and pointer actions remain immediate                            |

The backdrop limits are conservative experiment parameters, not a threshold known to be fast. A 256 × 256 RGBA tile alone represents approximately 256 KiB of decoded pixels; compressed transfer bytes do not describe total image, layer, or GPU memory.

Build a repeatable production comparison with identical flat/static/backdrop scenes: a toolbar, scrolling content, a list of controls, and a popup. Record browser/device, viewport, pixel ratio, asset bytes, and the active recipe. Capture idle, scroll, press/release, and open/close traces across repeated runs. Compare frame-time distributions, paint/raster work, long tasks, and layer memory where tooling exposes them. At 60 Hz, 16.7ms is the entire frame interval, not the material's allowance. CPU throttling on desktop does not establish mobile GPU or energy behavior.

Review desktop and 320/390px layouts in Codex's in-app browser, both appearances, keyboard navigation, RTL, reduced motion, reduced transparency, forced colors, failed textures, unsupported filters, nested themes, and portals. A missing texture must preserve the usable solid material. Separately require Safari/iOS, Firefox, a representative midrange Android device, and real-device energy/thermal observations before claiming broad reliability or low power consumption. Record unavailable cases honestly.

## Delivery sequence

1. **Static material slice:** canonical recipes, separate exports, light/dark foregrounds, supported Box/Button/IconButton assignments, and a lazy Material Lab whose preview, controls, reset, and copied code match. Include flat comparison scenes and collect production evidence. Run `pnpm check` and `pnpm package:check`.
2. **Shape and personality:** expose the semantic shape model, add a small decorative silhouette set, and coordinate tested presets with existing motion. Preserve focus, clipping boundaries, minimum targets, and portal inheritance.
3. **Backdrop glass pilot:** add one optional toolbar recipe with opaque fallback and explicit effects reduction. Ship only if the browser/device comparison meets the agreed budget. Keep true refraction in an isolated experiment.
4. **Feedback and expressive motion:** implement the no-op/opt-in haptics adapter, then evaluate the connected button group separately. Preserve Base UI refs, composition, keyboard/state behavior, and presence ownership.

Implementation evidence and remaining device checks are recorded separately in the build log and checklist. Personal learning remains unchecked.

## Implementation decisions

The first material pack uses CSS patterns throughout, so it has no texture requests. Controls confine decoration to 3px edge bands to keep the semantic label background intact; Box uses the full surface recipe with contrast-checked primary text. Shared shadow roles keep recipes within two shadow layers. No refraction engine is included.

The public Box and Shape components were added because Box was proposed in the plan but absent from the library. The feedback adapter is emitted through `@dixy-ui/react/feedback` from `packages/react/src/feedback.tsx`; it is independent of the optional Motion engine. New labs consume compiled exports and generate their code from authored source.

The documented core budget is interpreted as no new material rendering engine, texture fetches or required animation dependency. Typed props, theme propagation, Box and Shape necessarily add ordinary component JavaScript. Their packaged behavior is verified separately; no claim of zero core byte growth is made.
