---
"@dixy-ui/react": patch
---

Ship one ES module per component instead of a single flat `dist/dixy.js`. The entry and public exports are unchanged; app bundlers can now split chunks per component, so a page loads only the components it renders.
