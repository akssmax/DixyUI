---
"@dixy-ui/tokens": minor
"@dixy-ui/react": minor
---

Add an expressive shape library and shape morphing.

- Tokens: 35 shapes (`expressiveShapes`: circle, square, slanted, dome, semicircle, fan, oval, pill, triangle, arrow, diamond, clam-shell, pentagon, gem, sunny, very-sunny, cookie-4/6/7/9/12, clover-4/8, burst, soft-burst, boom, soft-boom, bloom, puffy, puffy-diamond, pixel-circle, pixel-triangle, bun, ghostish, heart). Each is a rounded polygon with true circular fillets, resampled to 120 evenly spaced points from the top centre, clockwise, so any two morph point-for-point. `shapeOutline()`, `shapeSvgPath()` and `shapePolygon()` return points, SVG path data and a CSS `polygon()`.
- Tokens: `springEasing(scheme, kind, speed)` turns a Dixy spring into a CSS `linear()` easing and settle time for CSS-only transitions.
- React: `Shape` accepts the new kinds (`ShapeKind`). Changing `kind` between two of them morphs the path on the Theme's spatial spring; reduced motion switches instantly. Browsers without CSS `d` switch without morphing. The four hand-drawn kinds are unchanged.
