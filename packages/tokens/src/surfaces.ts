import type { SemanticColor } from "./color.js";

/** Dixy reference pixels at a 16px root; full is a CSS capsule sentinel. */
export const radiusPrimitives = {
  "0": 0,
  "2": 2,
  "4": 4,
  "6": 6,
  "8": 8,
  "10": 10,
  "12": 12,
  "16": 16,
  "24": 24,
  full: 9999,
} as const;
export type RadiusToken = keyof typeof radiusPrimitives;

/** Full rounding is contextual: content panels retain usable rectangular corners. */
export const radiusPresets = {
  none: { control: "0", card: "0", overlay: "0" },
  sm: { control: "4", card: "8", overlay: "12" },
  md: { control: "10", card: "12", overlay: "16" },
  lg: { control: "16", card: "16", overlay: "24" },
  full: { control: "full", card: "16", overlay: "24" },
} as const satisfies Record<
  string,
  Record<"control" | "card" | "overlay", RadiusToken>
>;
export type RadiusPreset = keyof typeof radiusPresets;
export type RadiusRole = keyof (typeof radiusPresets)["md"];

/** Border strokes stay in CSS pixels; they do not scale with spacing density. */
export const borderWidths = { "0": 0, "1": 1, "2": 2 } as const;
export type BorderWidthToken = keyof typeof borderWidths;
export const borderStyles = { solid: "solid", dashed: "dashed" } as const;
export const borderRoles = {
  subtle: { width: "1", style: "solid", color: "border.subtle" },
  default: { width: "1", style: "solid", color: "border.default" },
  strong: { width: "2", style: "solid", color: "border.strong" },
  danger: { width: "1", style: "solid", color: "border.danger" },
} as const satisfies Record<
  string,
  {
    width: BorderWidthToken;
    style: keyof typeof borderStyles;
    color: SemanticColor;
  }
>;
export type BorderRole = keyof typeof borderRoles;
export const focusRing = { width: "2", offset: 3 } as const satisfies {
  width: BorderWidthToken;
  offset: number;
};

interface ShadowLayer {
  readonly x: number;
  readonly y: number;
  readonly blur: number;
  readonly spread: number;
  readonly inset?: boolean;
  readonly opacity: { readonly light: number; readonly dark: number };
}

/** Same geometry in both appearances; dark surfaces use stronger neutral occlusion. */
export const shadowLayers = {
  none: [],
  inset: [
    {
      x: 0,
      y: 1,
      blur: 2,
      spread: 0,
      inset: true,
      opacity: { light: 0.06, dark: 0.28 },
    },
  ],
  raised: [
    { x: 0, y: 1, blur: 2, spread: 0, opacity: { light: 0.06, dark: 0.24 } },
    { x: 0, y: 2, blur: 6, spread: -1, opacity: { light: 0.08, dark: 0.32 } },
  ],
  floating: [
    { x: 0, y: 4, blur: 8, spread: -2, opacity: { light: 0.08, dark: 0.28 } },
    { x: 0, y: 12, blur: 24, spread: -4, opacity: { light: 0.12, dark: 0.36 } },
  ],
  overlay: [
    { x: 0, y: 8, blur: 16, spread: -4, opacity: { light: 0.12, dark: 0.32 } },
    { x: 0, y: 24, blur: 48, spread: -8, opacity: { light: 0.18, dark: 0.44 } },
  ],
} as const satisfies Record<string, readonly ShadowLayer[]>;
export type ShadowRole = keyof typeof shadowLayers;
export type SurfaceAppearance = "light" | "dark";

export function shadowValue(
  role: ShadowRole,
  appearance: SurfaceAppearance,
): string {
  const layers: readonly ShadowLayer[] = shadowLayers[role];
  return (
    layers
      .map(
        (layer) =>
          `${layer.inset ? "inset " : ""}${layer.x}px ${layer.y}px ${layer.blur}px ${layer.spread}px rgb(0 0 0 / ${layer.opacity[appearance]})`,
      )
      .join(", ") || "none"
  );
}

export function radius<T extends RadiusToken>(
  token: T,
): `var(--dixy-radius-${T})` {
  return `var(--dixy-radius-${token})`;
}
export function surfaceRadius<T extends RadiusRole>(
  role: T,
): `var(--dixy-radius-${T})` {
  return `var(--dixy-radius-${role})`;
}
export function borderWidth<T extends BorderWidthToken>(
  token: T,
): `var(--dixy-border-width-${T})` {
  return `var(--dixy-border-width-${token})`;
}
export function border<T extends BorderRole>(
  role: T,
): `var(--dixy-border-${T})` {
  return `var(--dixy-border-${role})`;
}
export function shadow<T extends ShadowRole>(
  role: T,
): `var(--dixy-shadow-${T})` {
  return `var(--dixy-shadow-${role})`;
}
