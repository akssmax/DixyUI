---
"@dixy-ui/react": patch
---

Accessibility: `Dialog.Popup` now sets `aria-modal="true"` unless `Dialog.Root` has `modal={false}`, and `AlertDialog.Popup` always does. Base UI makes the page inert but omits the attribute. `Toolbar.Root` now handles Home and End (first or last focusable item), as the WAI-ARIA toolbar pattern describes; text inputs inside the toolbar keep their caret behavior.
