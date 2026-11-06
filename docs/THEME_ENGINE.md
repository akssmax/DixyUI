# Shared theme engine

Updated 2026-10-29. Eleven starter themes use the same schema, material compiler and frame registry. The playground lets you mix these recipes, edit bounded parameters, save a local theme and export static assets. AI remains a later authoring feature.

## Authored sources and generated output

`packages/themes/src/documents.ts` holds starter data. `theme-schema.ts` owns the closed JSON schema, inferred types, validation and parameter labels/bounds. `recipes.ts` registers trusted material paint and independent frame geometry/renderers. `compile-css.ts` applies paint consistently to existing components; `frame-styles.ts` positions optional procedural trim. `manifests.ts` holds presentation metadata.

`scripts/generate-skins.mjs` calls the public `compileThemeDocument` API to generate definitions, complete static Theme settings, separate stylesheets, catalog defaults, JSON Schema and explicit lazy docs mappings. Never edit generated files. Run `pnpm skins:generate`, `pnpm check` and `pnpm package:check` after source changes.

The React library has no dependency on the engine, docs, router, registry or graphics runtime. Docs consume compiled public package exports. Only the authoring playground loads the compiler, with an eight-entry cache. Exported React uses a static definition/settings object, stylesheet and explicit selected renderer import; it does not ship the compiler.

## Independent recipes

All eleven materials can be combined with eleven decorative frames or No frame (132 combinations). No frame preserves material paint and normal component controls, removes decorative Card/Dialog borders and artwork, and exports no renderer import. Its panel-padding controls remain available; decoration-only controls are hidden. The compiler returns renderer: null for this option. Materials own surface tint, grain, directional sheen, recesses, thumb finish and relief. Frames own decorative stroke, inset, corner proportions and procedural trim. A frame never replaces the selected material or injects control content. Switching frame selects its recommended geometry; switching material retains the current numeric paint adjustments and foundations. The user can then fine tune them.

| Starter         | Material          | Frame            |
| --------------- | ----------------- | ---------------- |
| Living Forest   | Botanical paper   | Living grove     |
| Retro OS        | Pixel enamel      | Pixel bevel      |
| Winamp Signal   | Gunmetal          | Signal rails     |
| Studio Hardware | Ceramic           | Machined shell   |
| Prism Glass     | Prismatic glass   | Optical rim      |
| Tactile Atelier | Atelier paper     | Wood & stitches  |
| Ocean Depths    | Sea glass         | Tidal ribbons    |
| Candy Clay      | Candy clay        | Soft sculpture   |
| Art Deco        | Lacquer & brass   | Brass inlay      |
| Y2K Titanium    | Titanium          | Titanium chamfer |
| Material Light  | Frosted porcelain | Porcelain halo   |

A starter is data, not an extra stylesheet branch. For example Candy Clay selects the shared cushion relief, fuller corners, low sheen and a custom tangerine OKLCH accent. These same controls work with other materials and frames. Trusted developer recipes still define the available procedural paint/geometry vocabulary; arbitrary user CSS, SVG markup or executable code is not accepted as theme data.

## Authoring API

```ts
import { compileThemeDocument, frameRecipes } from "@dixy-ui/themes/authoring";
import { themeDocuments } from "@dixy-ui/themes/documents";

const source = themeDocuments[7];
const compiled = compileThemeDocument({
  ...source,
  id: "acme/playful-machine",
  name: "Playful Machine",
  recipes: {
    material: source.recipes.material,
    frame: {
      id: "chamfer",
      version: 1,
      parameters: frameRecipes.chamfer.defaults,
      ornament: defaultOrganicOrnament("chamfer"),
    },
  },
});
// Save compiled.css and compiled.themeProps in build tooling.
// Import the renderer identified by compiled.renderer separately.
```

`parseThemeDocument` accepts an object or JSON string and returns a copied, deeply frozen document. Invalid fields produce `ThemeDocumentError.issues` with paths. `compileThemeDocument` returns the document, compatible v1 definition, static CSS, Theme props and renderer import metadata. IDs never become dynamic import paths. JSON strings are capped at 32 KiB of UTF-8. Unknown recipes/versions/fields, non-finite values, accessors and executable data are rejected. The validator implements this engine's schema vocabulary, not a general JSON Schema implementation. The public `theme-document.schema.json` supports external authoring tools.

## Shared parameters and precedence

| Setting              | Behavior                                                                                                                                                                                       |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Foundation colors    | Named accent/base families or a bounded custom OKLCH accent. Custom palettes compile for both appearances.                                                                                     |
| Typography           | Existing named body/heading stacks. Consumers load optional Inter/Space Grotesk fonts.                                                                                                         |
| Radius and shape     | Contextual control/card/overlay tokens; frame corner fullness and variation multiply those tokens. Square remains zero. Semantic square/pill component shape stays separate.                   |
| Control stroke       | Foundation border changes field/action strokes; decorative frame width is independent.                                                                                                         |
| Elevation and relief | Elevation selects external shadow treatment. Relief Flat removes panel/action/well/track/thumb shadows. Reduced effects remove texture, optional artwork and material highlights.              |
| Material paint       | Light/dark surface mixes 0–100%; sheen, cushion relief and text tint 0–1; grain scale 0.5–3; light angle 0–360 degrees. Cushion relief adds rounded bevel lighting and tinted contact shadows. |
| Frame geometry       | Width 0–12px; panel top/inline/bottom inset 16–64px; scene inset 0–24px; corner variation 0–0.5; corner fullness 0.5–3.                                                                        |
| Component finish     | Inherit the recipe, or explicitly choose an existing matte/glossy/soft/metal/paper finish. Explicit component overrides retain their contract.                                                 |

Recipe registration contains trusted paint defaults; theme documents contain validated selections/parameters. There are no Candy-specific component selectors. Material paint is applied consistently to cards, actions, fields, tabs, choices, tracks and thumbs. Frame renderers draw only decorative geometry. Legacy SVG Card/Dialog artwork is clipped to a band derived from panel insets. The four organic Canvas frames use a continuous measured border, a 32px overhang gutter and geometry sized to keep the content insets clear; they do not clip leaf tips with a rectangular band. Dense compositions that use custom Card padding can set `--dixy-skin-frame-safe-inline`, `--dixy-skin-frame-safe-top` and `--dixy-skin-frame-safe-bottom` to their reserved decoration band; the mail example uses this compact layout contract. These overrides are layout-specific and work with every frame. Components own their outer border; extra continuous inlays and Button pseudo-borders are omitted to avoid stacked outlines. Button labels/icons, loading spinners and functional controls remain owned by the application/components. No fake window actions or label leaves are generated.

Existing component refs, events, focus, state, composition and accessibility contracts are unchanged. Motion/effect reductions remain inherited through portaled Theme scopes. Animation is opt-in, with a finite 20-second playground preview. CSS, deterministic React/SVG and optional native Canvas 2D cover the current themes; no GPU library, shader dependency or image sprite was added. Hardware profiling is still required before making performance claims.

## Playground and portability

Examples stay on the left; the neutral customization panel is on the right. Choose a starting theme, surface material and frame, expand the schema-derived parameter controls, and adjust foundations. Changing a recipe forks the starter. Naming/saving stores up to twelve themes in this browser; failures are reported and no existing slot is silently evicted. Local saves are not a cloud backup. Export a preset or document to keep a portable copy.

Get code exports React, full CSS, the theme document and a playground preset. The importer accepts installed presets, custom presets and direct authoring documents. Custom presets preserve the starter identity, document, seed colors and overrides. Undo/redo, URL sharing, reload/SSR and per-theme drafts use the same representation. Loading a different frame loads only its registered optional renderer.

## Compatibility and limitations

SkinDefinition v1, original six IDs/import paths and playground preset v1/v2 remain supported. Custom playground envelopes use version 3. Authoring documents use schemaVersion 3 with recipe version 1. Schema-version-2 documents gain per-frame ornament defaults without changing their paint or geometry; original schemaVersion-1 paired documents migrate through v2; v1 still rejects mismatched pairs. Unknown versions fail explicitly.

The 132-combination test proves compiler composition and renderer selection, not exhaustive visual/accessibility quality for every parameter extreme. Users can create crowded frames at low padding or strong decoration. Evaluate focus/content clearance in the target composition. Default desktop appearances, key interaction/reduction paths and standalone packaging are recorded in BUILD_LOG.md. Mobile, hardware profiling and the full AT/zoom/forced-colors matrix remain deferred or untested. Implementation does not establish personal mastery.

Later work can add semantic material roles, more editable procedural geometry, trusted recipe registration tooling and AI proposals validated against this document. AI must use the same compiler/output path. It should not generate executable theme code for runtime evaluation.

## Organic ornament controls

`recipes.frame.ornament` is data: `{ style, canopy, stem, density, cornerDensity, canopyDepth, variation, scale, stemWeight, motion, seed }`. Styles are selected from `organicFrameRecipes[frame].styles`; frame IDs are `forest`, `cushion`, `coral`, and `deco`. Other frames retain their current renderer and ignore these parameters. A style from another family falls back to the selected frame's first style; the playground resets to the matching defaults when changing frames. There is no dynamic import or executable content in these values.

Density, corner density, canopy depth, variation, weight and motion are 0–100. Detail size is 10–32px, and seed is an integer from 1–9999. Forest's canopy options are Scattered trails, Corner cascades, Overhead boughs, Long tendrils and Open crown; stem options are Twining vines, Woody branches, Tender shoots and Mossy roots. Numeric controls use DialKit; closed choices use Dixy/Base UI selects; grouped controls use Dixy Accordion. Editing a control updates the same document used by preview, Undo/Redo, local save, URL state, JSON and React/CSS exports.

Each selected entry imports only its painter; the shared runtime owns hydration, measurement, theme/style invalidation, the bounded scheduler and cleanup. It reads all four computed CSS corner radii, including elliptical/percentage values. Content-safe overrides continue to work in compact email layouts. Canvas is decorative and pointer-inert; base CSS and primitive semantics do not depend on Canvas or JavaScript availability. Opt-in animation is finite, is paused offscreen/in hidden tabs and respects inherited/OS reductions. See the package README for memory/frame caps and manual verification limits.

## Character (schemaVersion 4)

Updated 2026-11-06. Materials and frames paint surfaces. `character` decides how controls are shaped, how they move, and how text and state read. It is closed data compiled by `packages/themes/src/character.ts` into the same skin stylesheet.

| Field                                                                 | Values                                                                                              |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `controls`                                                            | standard, botanical, pixel, instrument, hardware, glass, stitched, pearl, clay, brass, chrome, halo |
| `motion.style` / `press` / `tempo`                                    | standard, snappy, stepped, springy, weighted, drift; press 0–4px; tempo 0.5–2×                      |
| `type.headingCase` / `headingWeight` / `headingTracking` / `numerals` | none, uppercase, small-caps; 300–900; −0.05–0.2em; proportional, tabular, oldstyle                  |
| `states`                                                              | standard, led, marching, inlay, glow, stamp (selected tab, invalid field, busy button)              |
| `details`                                                             | focus (ring, double, dashed, glow, offset), divider, selection, scrollbar, iconStroke 1–2.75        |
| `backdrop.pattern` / `intensity` / `scale`                            | none, grid, scanlines, sunburst, caustics, fibre, dots, topo, halftone; 0–1; 0.5–3×                 |

Rules: character only targets existing parts and state hooks. Durations change only when motion is allowed. Press depth scales with the reduced-motion spatial factor. Backdrops and animated cues disappear under reduced effects, more contrast, forced colors and reduced transparency. Focus outlines stay at least 2px. An explicit Square radius overrides a control language's corners, except radios, which stay round. Version-3 documents migrate to `defaultCharacter`, which emits no extra rules.

Starter fonts beyond Inter and Space Grotesk (Fraunces, Poiret One, Silkscreen, Orbitron, Fredoka, Share Tech Mono) are named stacks with system fallbacks. `themeFontPackages` lists the optional @fontsource package for each, and React exports import only the fonts in use.

The playground adds a Character section, Shuffle (seeded), a Compare themes view and per-starter sample copy (`voice`, presentation metadata only).

## Window chrome (schemaVersion 5)

Updated 2026-11-06. `character.chrome` gives a frame real window structure, not just a colour. It is compiled by `packages/themes/src/chrome.ts` and maps onto existing Card parts only:

| Part                                            | Field      | Values                                                                                                                                                                                                                      |
| ----------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Card.Header` → title bar                       | `titlebar` | none, grip (media-player grip strip + buttons), caption (classic desktop), gradient (social profile header), tab (hanging paper label), glass (light strip with three round lights), chrome (brushed metal, fixed dark ink) |
| `Card.Root` / dialog popup → window edge        | `edge`     | line, bevel (four-layer pixel bevel), double, pill (thick two-tone), stepped (inset brass inlay)                                                                                                                            |
| `Card.Content` directly after the header → well | `well`     | none, lcd (dark display with its own ink), recessed (with four screws), tinted (zebra rows), paper (ruled), glass (translucent; opaque under reduced transparency or more contrast), sunken (soft deep inset)               |
| window corners                                  | `corners`  | inherit, pixel (0), notched (clip-path; clips outer shadows), round (16px)                                                                                                                                                  |

Rules: no markup, refs, events or focus order change. Window buttons and grip lines are `content:""` pseudo-elements, so screen readers don't hear them. A title bar or well that sets its own ground also sets `--dixy-color-text-primary/secondary/muted`, so nested copy and components follow it. Measured in the browser: Winamp bar 10.1:1, Winamp LCD 14.2:1, Retro caption 11.0:1, Scrapbook header 6.2:1, Scrapbook panel 14.2:1. Under forced colors the title bar drops its gradient and grip art and keeps a system-colour rule. Version-4 documents migrate to `defaultChrome`, which emits no rules. The title bar bleeds to the card edge using `--dixy-skin-pad-top` and `--dixy-skin-pad-inline` (new token variables from the frame padding).

Starters (all twelve now carry chrome, and no two share the same combination; tested): Winamp Signal (grip, bevel, lcd, pixel), Retro OS (caption, bevel, pixel), Scrapbook (gradient, pill, tinted, round), Studio Hardware (recessed), Art Deco (stepped), Tactile Atelier (tab, paper), Living Forest (round corners; its structure comes from the vine frame), Prism Glass (glass bar, glass well), Ocean Depths (glass well, round), Candy Clay (pill edge, sunken well, round), Y2K Titanium (chrome bar, lcd, notched), Material Light (sunken). Scrapbook is the first starter with no ornament renderer (frame `none`); its look comes entirely from chrome and character, so its React export imports no `/react` entry. The LCD well also re-points neutral-button text/soft fills and the default border at its own ink, so ghost and outline buttons stay readable inside a dark display in a light theme.
