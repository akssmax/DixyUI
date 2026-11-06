import type { SpaceToken } from "./spacing.js";

/** Container maximums include their responsive inline gutters. */
export const containerWidths = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;
export type ContainerSize = keyof typeof containerWidths;

/** Viewport thresholds in reference pixels, emitted as rem media queries. */
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  wide: 1536,
} as const;
export type Breakpoint = keyof typeof breakpoints;

export const responsiveGutters = {
  base: "200",
  sm: "300",
  lg: "400",
} as const satisfies Partial<Record<Breakpoint | "base", SpaceToken>>;

export function container<T extends ContainerSize>(
  token: T,
): `var(--dixy-container-${T})` {
  return `var(--dixy-container-${token})`;
}

/** Use this in matchMedia; custom properties cannot appear in media conditions. */
export function minWidth(token: Breakpoint): `(min-width: ${number}rem)` {
  return `(min-width: ${breakpoints[token] / 16}rem)`;
}

export const layoutGutter = "var(--dixy-layout-gutter)" as const;
