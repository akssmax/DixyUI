---
"@dixy-ui/tokens": minor
"@dixy-ui/react": minor
"@dixy-ui/themes": patch
---

Typography: add `display.xl`, `display.2xl` and `display.3xl` (72, 96 and 128px) for words that are the interface: selected values, cities, speeds. They're fluid. Each grows linearly from a phone-safe minimum (36, 44 and 52px) in a 320px container to its full size at 1280px, using container query units (`cqi`) with `clamp()`. With no size container, they follow the small viewport. Their line-height is unitless (`1`), so leading shrinks with the size. Size primitives 72, 96 and 128 are added. `display.lg` and smaller are unchanged. Skins pick up the new roles for heading weight and tracking.
