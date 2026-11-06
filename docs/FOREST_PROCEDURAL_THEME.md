> Updated 2026-10-29: the original SVG frame described below has been superseded by the optional Canvas 2D Living Grove renderer. It combines a measured continuous vine with corner growth, six botanical mixes, five canopy shapes and four stem characters. Public imports are unchanged. The small switch-thumb leaf remains SVG. See [THEME_ENGINE.md](THEME_ENGINE.md) and the [themes README](../packages/themes/README.md) for current parameters, motion and cleanup policy. The remainder records the earlier SVG implementation.

# Living Forest — procedural refinement

Date: 2026-10-21. Supersedes the earlier static Forest frame delivery. The user requested code-rendered artwork, refinement against the original generated board, and desktop review first. Particle-system work is separate; no WebGL engine is required for this botanical geometry.

## What is drawn in code

`packages/themes/src/forest/ornament.tsx` exports `ForestOrnament`. Its SVG geometry draws layered curved branches, asymmetric leaves, flowers, moss and paper grain. The leaf midrib follows a cubic curve; eight pairs of branching veins and smaller subdivisions are clipped inside the silhouette. Split shading, highlights and a petiole give the leaves volume. Deterministic seeds vary branch curvature and attachment angles. React useId keeps gradients, clips and filters unique across server rendering, repeated cards and popups.

The generated board at `output/imagegen/2026-10-20-theme-directions/01-living-forest.png` guides the serif type, ivory paper, green enamel, woody borders and acorn/brass details. It is a visual reference; the implemented plants are editable vector geometry, not embedded mockup pixels.

| Existing component     | Forest treatment                                                                              |
| ---------------------- | --------------------------------------------------------------------------------------------- |
| Theme                  | A cropped procedural canopy and soft dappled leaf shadows behind content                      |
| Card and Dialog        | Layered twig borders, attached leaf clusters, flowers, moss and paper grain                   |
| Button                 | Inset double rims and display typography; consumer-owned icons/content                        |
| Field.Label and inputs | Serif labels, warmer inset wells and retained focus/error semantics                           |
| Switch                 | Cream knob with generated checked-state leaf; neutral unchecked state                         |
| Checkbox               | Inset checked bevel with the existing check/mixed-state artwork                               |
| Slider                 | Acorn-shaped thumb and textured cap, preserving the original hit target and keyboard behavior |
| Progress/Meter         | Recessed warm tracks and inherited semantic fill                                              |
| Tabs                   | Existing Base UI selection/indicator with the Forest surface treatment                        |

## Integration and behavior

The core library exposes an optional `ornamentRenderer` slot on Theme. Its part contract is theme/card/dialog/switch-thumb, ornament level, motion/effects and an animation opt-in. It does not import the Forest package. A changed/cleared skin clears the inherited renderer unless explicitly supplied; context crosses portals. Artwork has aria-hidden and pointer-events:none and contains no labels, input values or interactions. Original refs, event callbacks, render composition and native inputs stay with the components.

```tsx
import { Theme, Card, Button } from "@dixy-ui/react";
import { livingForest } from "@dixy-ui/themes/living-forest";
import { ForestOrnament } from "@dixy-ui/themes/living-forest/react";
import "@dixy-ui/react/styles.css";
import "@dixy-ui/themes/living-forest.css";

<Theme skin={livingForest} ornamentRenderer={ForestOrnament}>
  <Card.Root>
    <Button>Explore</Button>
  </Card.Root>
</Theme>;
```

Add `animateOrnaments` to opt into leaf motion. The playground's **Animate nature · 20s** control starts a finite preview; **Pause nature** stops it. A cleaned-up timer ends the preview automatically. Reduced motion keeps the artwork still; quiet ornament/reduced effects remove SVG detail. The OS reduced-motion media rule uses the same selector specificity as the animation rule. Contrast/forced-color modes hide ornamentation.

The playground lazily imports the renderer only for Forest. Complete React exports include its public import and prop; preset JSON stores bounded data, not executable rendering code. The old bitmap and initial SVG frame are preserved under `output/imagegen/2026-10-20-theme-directions/retired-static-assets/` and are not packaged or requested by the runtime. The built package does not copy the old assets directory.

## Evidence and remaining review

Required checks and desktop browser evidence are recorded in BUILD_LOG.md and `output/in-app-browser/forest-procedural/`. Tests cover optional artwork scoping/clearing, preserved editable state, public generated exports, independent SSR, unique/resolvable SVG IDs and absence of bitmap output. The existing component behavior suite remains in the check gate.

Mobile checks and performance profiling were explicitly deferred by the user. There is no FPS, energy, low-end-device or full WCAG claim. Screen-reader, physical-touch, zoom, OS reduced-transparency and forced-color testing remain release work. These records describe implementation; personal mastery remains unchecked.

References: [React useId](https://react.dev/reference/react/useId), [SVG use](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/use), [procedural SVG noise](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feTurbulence).
