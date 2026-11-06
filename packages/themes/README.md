# Dixy 2D skins

Import one definition and its stylesheet alongside @dixy-ui/react/styles.css. Skins change existing Dixy components. Each skin has an optional, independently imported React renderer; no graphics engine is required.

```tsx
import { Theme, Button } from "@dixy-ui/react";
import { studioHardware } from "@dixy-ui/themes/studio-hardware";
import { HardwareOrnament } from "@dixy-ui/themes/studio-hardware/react";
import "@dixy-ui/react/styles.css";
import "@dixy-ui/themes/studio-hardware.css";

<Theme
  skin={studioHardware}
  ornamentRenderer={HardwareOrnament}
  ornament="balanced"
  relief={1}
>
  <Button>Save changes</Button>
</Theme>;
```

Eleven independent entries: living-forest, retro-os, winamp-signal, studio-hardware, prism-glass, tactile-atelier, ocean-depths, candy-clay, art-deco, y2k-titanium, material-light. Explicit material overrides use the optional @dixy-ui/react/materials.css pack. Undefined skin inherits, null clears; ThemeScope preserves the skin in popups.

Use authoring.defineSkin for compatible original definition/CSS pairs. Use a namespaced ID and scope CSS to actual data-dixy-skin parts; keep artwork separate from control semantics. The catalog contains metadata only. No raw CSS, JavaScript or shader is executed from imported playground presets.

Generated definitions and CSS come from portable src/documents.ts, trusted src/recipes.ts and the shared authoring compiler. src/manifests.ts contains presentation metadata. Run pnpm skins:generate after changing a source recipe, then pnpm check and pnpm package:check. Runtime artwork is drawn by SVG geometry or the optional native Canvas 2D frame renderer. Earlier image experiments are archived outside the package. See assets/PROVENANCE.md.

`@dixy-ui/themes/authoring` exports `parseThemeDocument`, `compileThemeDocument`, the closed JSON schema and field diagnostics. `@dixy-ui/themes/documents` supplies eleven starting documents. The compiler emits static CSS, a compatible v1 definition, complete Theme props and renderer import metadata (null for No frame). Consumers render the saved output without loading the compiler. Schema version 3 allows every registered material/frame combination (132 total, including No frame), with bounded procedural ornament settings. Original schema-version-1 paired documents and version-2 documents migrate. Arbitrary executable input and unknown recipes are rejected. Shared bounded knobs include surface mixes, sheen, cushion relief, text tint, grain scale, light direction and frame geometry. No component CSS branches on a Candy theme ID.

Each existing skin entry also exports complete starter settings, for example `studioHardwareTheme`. Spread them onto Theme alongside the separately imported renderer. These settings include portable fonts, control stroke and elevation. Override appearance explicitly when appropriate; using the original compact definition alone still inherits appearance. See docs/THEME_ENGINE.md in the repository for the authoring contract, parameter precedence and current scope.

To author a theme, export a validated definition and a separate CSS entry:

```tsx
import { defineSkin } from "@dixy-ui/themes/authoring";
export const notebook = defineSkin({
  id: "your-brand/notebook",
  name: "Notebook",
  version: 1,
  defaults: {
    accentColor: "bronze",
    neutralColor: "sand",
    radius: "md",
    density: "comfortable",
    material: "paper",
    shape: "rounded",
  },
});
```

```css
@layer dixy.components {
  .dixy-card[data-dixy-skin="your-brand/notebook"] {
    border-style: dashed;
  }
}
```

Import that stylesheet and pass `skin={notebook}` to Theme. Keep focus outlines, input semantics, selected/invalid/disabled cues and native interaction targets intact. Test light/dark and reduced effects. Use `data-dixy-material-override` to avoid replacing an explicit component finish. The playground imports validated documents and custom presets, provides independent recipe controls and saves up to twelve local themes. It exports static React/CSS as well as portable JSON. Installing arbitrary user code or hosting a theme marketplace remains separate.

All eleven renderers are still by default. Animation is explicitly enabled with animateOrnaments and obeys motion/effect reductions. Each renderer supplies frame details through Card/Dialog and compact optional switch-thumb surface ornaments; inputs, tabs, tracks and choices receive their own scoped CSS recipes. Prism permits one explicitly authored `.dixy-skin-backdrop` direct child with `effects="backdrop"`; unsupported/reduced transparency falls back to opaque content. Do not put blur on every card. No graphics engine or shader dependency is required. Forest, Candy Clay, Ocean Depths and Art Deco use a shared, opt-in Canvas 2D scheduler; the remaining renderers use SVG/CSS.

Forest uses a separate renderer entry so importing another skin never pulls it in:

```tsx
import { livingForest } from "@dixy-ui/themes/living-forest";
import { ForestOrnament } from "@dixy-ui/themes/living-forest/react";
import "@dixy-ui/themes/living-forest.css";

<Theme skin={livingForest} ornamentRenderer={ForestOrnament} animateOrnaments>
  <Card.Root>
    <Button>Explore</Button>
  </Card.Root>
</Theme>;
```

Omit animateOrnaments for still geometry. The playground's Animate details button previews motion for 20 seconds and has a pause control. Quiet ornament and reduced effects remove decorative artwork; reduced motion keeps it still. SVG IDs and Canvas instance variation come from React useId; geometry uses deterministic seeds. Canvas paints after hydration, leaving the CSS surface and component semantics available during SSR. External bitmap/SVG files are not used by any renderer.

| Skin            | Optional React export | Drawn in code                                                          |
| --------------- | --------------------- | ---------------------------------------------------------------------- |
| Living Forest   | `ForestOrnament`      | Continuous vines, corner groves, six leaf mixes and five canopy shapes |
| Retro OS        | `RetroOrnament`       | Pixel bevel inlays, hard frame edges                                   |
| Winamp Signal   | `SignalOrnament`      | Machined rails, screws, segmented meters                               |
| Studio Hardware | `HardwareOrnament`    | Steel screws, registration marks, dial engraving                       |
| Prism Glass     | `PrismOrnament`       | Diffused spectral light, rim highlights, glass facets                  |
| Tactile Atelier | `AtelierOrnament`     | Walnut grain, paper noise, linen weave, stitching                      |
| Ocean Depths    | `OceanOrnament`       | Tidal ribbons, seafoam beads, glass droplets and quiet currents        |
| Candy Clay      | `ClayOrnament`        | Piped petals, twisted rope, candy pebbles and ribbon folds             |
| Art Deco        | `DecoOrnament`        | Fine filigree, Art Deco, hammered edges and quiet gilding              |
| Y2K Titanium    | `TitaniumOrnament`    | Chamfers, screws, perforations and light pipes                         |
| Material Light  | `LightOrnament`       | Porcelain halo and fine rim highlights                                 |

Each export comes from `@dixy-ui/themes/<slug>/react`. CSS/definition-only consumption remains supported without the React artwork. See `docs/PROCEDURAL_SKINS.md` in the repository for architecture and verification scope.

Themes style component surfaces and edges. Button labels and icons belong to the consumer; no renderer is mounted inside a Button. A loading spinner remains a functional Button feature. Retro frames do not simulate window title bars, window actions or resize handles. Compose working controls explicitly when an application needs them.

## Organic frames

The public renderer imports stay the same. `recipes.frame.ornament` in a v3 authoring document controls density, corner clusters, canopy depth/relief, variation, detail size, stem/rim weight, motion strength and a deterministic seed. Style choices are closed enums. Forest adds five canopy shapes and four stem characters. Switching a frame in the playground loads that frame's default settings; paint remains independent.

The compiler emits portable numeric `--dixy-organic-*` variables in CSS and Theme styles. Exported consumers need the chosen renderer and saved stylesheet/settings, never the authoring compiler or DialKit. `organicFrameRecipes`, `canopyShapes`, `stemCharacters`, `defaultOrganicOrnament` and `organicOrnamentVariables` are public authoring helpers. See [the engine guide](../../docs/THEME_ENGINE.md).

Native Canvas 2D draws one measured, continuous border path with all four computed CSS corner radii. Leaves fit a 32px overflow gutter and the authored content insets without a rectangular cut mask. Use at least 32px of outer layout space for full overhang; the playground uses 40px specimen gaps. Compact layouts can reserve a smaller content-safe band with the existing `--dixy-skin-frame-safe-*` overrides; leaf geometry shrinks to fit that band.

Frames are still by default. Animated frames share one scheduler, paint at most 30 times per second, and stop after 20 seconds even when `animateOrnaments` stays true. Toggle it off/on for another preview. Offscreen and hidden-tab frames stop scheduling; observers and jobs are released on unmount. Canvas backing stores are limited to two million pixels each. Density edits use a finite grow/retract transition; reduced motion applies the final count immediately. Reduced effects/quiet omit the optional renderer; contrast/forced-color modes hide its layer. No bitmap textures, external SVG files or image downloads are used. These limits are implementation policy, not a claim of measured device performance.
