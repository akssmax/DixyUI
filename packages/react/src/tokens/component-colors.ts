import type { SemanticColor } from "@dixy-ui/tokens";
/** Components use roles; brand changes never remap validation or destructive intent. */
export const componentColors = {
  "input-background": "background.surface.raised",
  "input-text": "text.primary",
  "input-placeholder": "text.secondary",
  "input-border": "border.default",
  "input-border-invalid": "border.danger",
  "field-error-text": "text.danger",
  "dialog-background": "background.surface.raised",
  "dialog-text": "text.primary",
  "dialog-border": "border.subtle",
  "focus-ring": "border.focus",
  ...Object.fromEntries(
    ["primary", "secondary", "destructive", "success"].flatMap((intent) => [
      [`button-${intent}-background`, `background.action.${intent}`],
      [`button-${intent}-hover`, `background.action.${intent}.hover`],
      [`button-${intent}-pressed`, `background.action.${intent}.pressed`],
      [`button-${intent}-foreground`, `text.on.action.${intent}`],
      [`button-${intent}-soft`, `background.action.${intent}.subtle`],
      [
        `button-${intent}-soft-hover`,
        `background.action.${intent}.subtle.hover`,
      ],
      [
        `button-${intent}-soft-pressed`,
        `background.action.${intent}.subtle.pressed`,
      ],
      [`button-${intent}-text`, `text.action.${intent}`],
    ]),
  ),
} satisfies Record<string, SemanticColor>;
