---
"@dixy-ui/react": patch
"@dixy-ui/themes": patch
---

Textarea no longer turns into an ellipse under `radius="full"`: multi-line fields take `min(control radius, card radius)`, so they cap at the card radius in full mode and are unchanged in every other radius mode. Skin CSS applies the same cap before its corner scale.
