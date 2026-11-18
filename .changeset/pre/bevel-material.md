---
"@dixy-ui/tokens": minor
"@dixy-ui/react": minor
"@dixy-ui/themes": minor
---

New `bevel` material: hard 1px raised edges (light top-left, dark bottom-right) for classic desktop chrome. Pressed buttons, pressed toggles and open popup triggers invert the bevel; fields, lists, calendars, checkbox and radio boxes, number and OTP fields and slider/progress/meter tracks become sunken wells; slider thumbs become raised blocks. Recipes may now declare optional `pressedImage`, `pressedEdge` and `wellEdge`, emitted as `--dixy-material-<name>-pressed-image`, `-pressed-edge` and `-well-edge`. Theme documents accept `bevel` for `material` and `componentFinish`. Reduced effects, high contrast and forced colours remove it like the other finishes.
