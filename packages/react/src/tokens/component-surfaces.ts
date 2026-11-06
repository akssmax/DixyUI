import type { RadiusRole, ShadowRole, BorderWidthToken } from "@dixy-ui/tokens";

export const componentRadii = {
  button: "control",
  input: "control",
  card: "card",
  dialog: "overlay",
} as const satisfies Record<string, RadiusRole>;
export const componentShadows = {
  input: "none",
  card: "raised",
  dialog: "overlay",
} as const satisfies Record<string, ShadowRole>;
export const componentBorderWidths = {
  button: "1",
  input: "1",
  card: "1",
  dialog: "1",
} as const satisfies Record<string, BorderWidthToken>;
