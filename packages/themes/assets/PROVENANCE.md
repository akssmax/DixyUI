# Asset provenance

forest-frame.svg and walnut-grain.svg are original editable SVG artwork authored for Dixy on 2026-10-20. No third-party skin, stock artwork, font or generated mockup pixels are embedded. These are static decorative assets with no scripts, external resources or SVG filters. Retain this provenance when distributing modified packs.

forest-frame.webp is an original botanical frame generated with built-in imagegen on 2026-10-20, using the user's generated Living Forest board as a style reference. The source PNG remains at the imagegen output location and is recorded in the project's asset prompt notes. The runtime copy is resized/compressed with cwebp, retains alpha, and uses nine-slice framing. It contains no text or interface pixels.

## Superseded on 2026-10-21

The Forest SVG/WebP files have been moved to `output/imagegen/2026-10-20-theme-directions/retired-static-assets/`. They are exploratory references only. Runtime Forest artwork is now original procedural geometry in `src/forest/ornament.tsx`; it uses no bitmap, external SVG or sprite sheet. The build no longer copies this assets directory into dist. The unused original walnut-grain SVG is retained as source exploration only.

## Organic frames — 2026-10-29

The Forest, Candy Clay, Sea Glass/Ocean Depths and Brass/Art Deco frames are original procedural paths authored for Dixy in `src/organic-paint.ts`, measured through `src/organic-geometry.ts` and rendered by the optional Canvas 2D runtime. The interactive design explorations informed the geometry; no mockup pixels, generated image, external artwork, texture or sprite is embedded. Forest's small switch-thumb leaf remains inline SVG. The previous full SVG botanical frame has been superseded; its historical design notes remain in docs/FOREST_PROCEDURAL_THEME.md.
