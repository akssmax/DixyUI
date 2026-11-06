# Procedural skins — 2026-10-21

Eleven skins now have code-rendered detail, guided by the generated boards in `output/imagegen/2026-10-20-theme-directions/`. The five newer directions—Ocean Depths, Candy Clay, Art Deco, Y2K Titanium and Material Light—also use the shared material/frame compiler. See THEME_ENGINE.md for the current recipe list and composition controls. The shared components and their Base UI/native behavior remain the same. Forest's geometry is documented separately in [FOREST_PROCEDURAL_THEME.md](FOREST_PROCEDURAL_THEME.md).

| Skin            | Material and frame                                                         | Component details                                                                                 | Optional motion                           |
| --------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| Retro OS        | Pixel bevel inlay, hard ink borders and shadows                            | Inset fields, square switches, yellow slider handle, segmented tracks                             | Frame bevel gently fades                  |
| Winamp Signal   | Gunmetal rails, separately sized steel screws and small segmented meters   | Mechanical action bevels, dark LCD fields, meter segments, ridged slider handle, indicator switch | Meters pulse from their baseline          |
| Studio Hardware | Ceramic shell, machined screws, inset seam and registration marks          | Steel conic dial shading, engraved switch cap, recessed tracks, slider ticks, enamel action edges | Registration indicator breathes           |
| Prism Glass     | Tinted surfaces, luminous rims, spectral background light and small facets | Inset glass fields, highlighted tab surfaces, opal thumb, luminous track and action edges         | Background light and rim highlights drift |
| Tactile Atelier | Procedural walnut grain, paper noise, linen weave and inset stitching      | Enamel action edges, brass switch and slider, serif labels, recessed fields and tracks            | A narrow frame highlight breathes         |

Update 2026-10-29: Forest, Candy Clay, Ocean Depths and Art Deco now use optional procedural Canvas 2D frames with continuous measured borders and bounded opt-in animation. Other renderers retain their SVG/CSS geometry. There are no sprite sheets, bitmap textures, external SVG requests, Three.js or WebGL/WebGPU contexts. See the current organic controls in [THEME_ENGINE.md](THEME_ENGINE.md). Prism uses one SVG blur for its background light; cards do not each allocate a backdrop blur. Atelier paper uses SVG turbulence; walnut grain is explicit deterministic path geometry. These choices satisfy the current 2D visual scope, not a measured hardware performance target.

## Public composition

Each skin exposes three independent entries: definition, stylesheet and optional React renderer. For example:

```tsx
import { Theme, Card, Button } from "@dixy-ui/react";
import { prismGlass } from "@dixy-ui/themes/prism-glass";
import { PrismOrnament } from "@dixy-ui/themes/prism-glass/react";
import "@dixy-ui/react/styles.css";
import "@dixy-ui/themes/prism-glass.css";

<Theme skin={prismGlass} ornamentRenderer={PrismOrnament} appearance="dark">
  <Card.Root>
    <Card.Title>Make something playful.</Card.Title>
    <Button>Explore</Button>
  </Card.Root>
</Theme>;
```

Renderer names are listed in [the themes package README](../packages/themes/README.md). CSS/definition-only use remains supported; artwork is an enhancement. Nothing in the core library imports a skin renderer or theme catalog. The docs use compiled public exports and lazy-load only the chosen renderer. React export includes the same renderer and settings as the preview. Installed presets and validated custom documents share the authoring contract. The playground can mix eleven materials with eleven frames and export static CSS/settings without a compiler runtime.

The ornament slots are Theme, Card, Dialog and Switch thumb. Buttons render only consumer-provided content and the existing functional loading indicator; themes cannot add prefix icons or occupy button layout slots. Fake title bars, minimize/maximize/close controls and resize grips are excluded from surface decoration. A real window toolbar must be explicitly composed with working actions. A renderer may omit a slot when it adds no useful character. Artwork is `aria-hidden`, does not accept pointer events and does not create another interactive element. Frame geometry stays separate from live labels, editable content and primitive semantics. Screws have fixed dimensions so wide panels do not distort them. SVG IDs use React `useId`; repeated instances and SSR references are verified against packed exports.

Authored visual defaults now come from `packages/themes/src/documents.ts`; trusted recipes and the shared compiler live beside it in `recipes.ts`, `compile-css.ts` and `frame-styles.ts`. `scripts/generate-skins.mjs` invokes that public compiler; manifests contain presentation metadata. See [the shared engine contract](THEME_ENGINE.md). Generated definitions/styles are not edited by hand. Each recipe targets its own component's skin attribute and respects explicit material overrides. Card/Dialog receive full frames; menus and other popups receive their existing static surface treatment. Specialist editors retain their own anatomy; this does not claim a bespoke illustrated treatment for all 78 component families.

## Motion and reductions

Still artwork is the default. `animateOrnaments` opts into CSS motion; the playground exposes Pause and stops its preview after 20 seconds. This finite timer lives in the editor, not the skin package. Consumers wanting a finite preview must own its duration. No renderer mounts a timer, animation frame or browser listener.

Inherited reduced motion overrides opt-in animation, and OS reduced-motion CSS is present. Quiet ornament or reduced effects remove the optional renderer. Reduced effects also simplify component finishes; explicit material overrides keep their own appearance. Increased contrast, reduced transparency and forced colors hide decorative artwork. Full platform/assistive-technology verification remains pending.

## Evidence and limits

Automated checks cover public types/export snippets, repeated-instance SSR and local SVG references, preference reductions, selected-skin package consumption, and exclusion of unselected CSS/renderers. Browser evidence and final measurements are recorded in `output/in-app-browser/five-procedural/` and [BUILD_LOG.md](BUILD_LOG.md).

The user deferred mobile checks and hardware performance profiling. File sizes and structural checks are not FPS, energy, loading or low-end-device benchmarks. The separate particle experiment, framework-specific SSR fixtures, OS preference emulation, real AT, zoom and wider accessibility release matrix remain follow-ups.
