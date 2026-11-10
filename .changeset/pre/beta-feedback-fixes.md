---
"@dixy-ui/themes": patch
"@dixy-ui/react": patch
---

Fixes from the first outside beta test:

- Popups (Popover, Menu and other overlays using the absolute positioning strategy) no longer open a page height away from their trigger under a starter theme. Each starter positioned and isolated `.dixy-theme`, which also matched the zero-height `.dixy-portal-scope` wrapper at the end of `<body>`, making it the popups' containing block. The rule now skips the portal scope.
- `Tabs.Panel` stretches to the full width of `Tabs.Root`, even when an app turns the root into a flex column.
- The `@dixy-ui/themes` README now gives the correct starter count (38) and links to dixyui.com.
