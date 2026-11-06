import type { SpacingFamily, SpacingSize } from "@dixy-ui/tokens";

type SemanticReference = {
  [F in SpacingFamily]: readonly [F, SpacingSize<F>];
}[SpacingFamily];

/** Component aliases live with the React library, generated into its stylesheet. */
export const componentSpacing = {
  "button-gap": ["inline", "sm"],
  "button-padding": ["inset", "md"],
  "button-padding-sm": ["inset", "sm"],
  "button-padding-lg": ["inset", "lg"],
  "card-padding": ["inset", "md"],
  "dialog-padding": ["inset", "lg"],
  "form-field-gap": ["stack", "sm"],
  "form-group-gap": ["stack", "lg"],
  "navigation-item-gap": ["inline", "sm"],
  "input-padding": ["inset", "sm"],
} as const satisfies Record<string, SemanticReference>;
