import type { RadiusToken } from "./surfaces.js";

/** Semantic roles reuse the radius scale. Pill panels keep readable rectangular corners. */
export const shapePresets = {
  rounded: { control: "10", container: "12", feature: "24" },
  pill: { control: "full", container: "16", feature: "24" },
  square: { control: "0", container: "0", feature: "0" },
} as const satisfies Record<
  string,
  Record<"control" | "container" | "feature", RadiusToken>
>;
export type ShapePreset = keyof typeof shapePresets;
export type ShapeRole = keyof (typeof shapePresets)["rounded"];

/** Decorative silhouettes only: never clip interactive content or its focus ring. */
export const shapePaths = {
  flower:
    "M50 8C65-4 78 9 76 24C94 20 105 38 91 50C105 64 94 80 76 76C80 94 63 105 50 91C37 105 20 94 24 76C6 80-5 63 9 50C-5 37 6 20 24 24C20 6 37-5 50 8Z",
  clover:
    "M50 20C18-16-16 18 20 50C-16 82 18 116 50 80C82 116 116 82 80 50C116 18 82-16 50 20Z",
  arch: "M10 90V50A40 40 0 0 1 90 50V90Z",
  cut: "M22 6H78L94 22V78L78 94H22L6 78V22Z",
} as const;
export type DecorativeShape = keyof typeof shapePaths;

export function shapeRadius<T extends ShapeRole>(
  role: T,
): `var(--dixy-shape-${T})` {
  return `var(--dixy-shape-${role})`;
}
