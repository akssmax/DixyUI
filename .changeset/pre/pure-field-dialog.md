---
"@dixy-ui/react": patch
---

`Field` and `Dialog` are now tree-shakeable. An app that imports only `Button` drops from about 129 KiB to 17 KiB minified (React excluded), because unused Base UI dialog and field code is no longer retained.
