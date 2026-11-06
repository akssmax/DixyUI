import type { AccentColor, NeutralColor } from "./color.js";
import type { Density } from "./spacing.js";
import type { RadiusPreset } from "./surfaces.js";
import type { Material } from "./materials.js";
import type { ShapePreset } from "./shapes.js";

export type OrnamentLevel = "quiet" | "balanced" | "expressive";
export type SkinRelief = 0 | 1 | 2;

/** Portable data only. Artwork and recipes are supplied by an explicit CSS import. */
export interface SkinDefinition {
  readonly id: string;
  readonly name: string;
  readonly version: 1;
  readonly defaults: {
    readonly accentColor: AccentColor;
    readonly neutralColor: NeutralColor;
    readonly radius: RadiusPreset;
    readonly density: Density;
    readonly material: Material;
    readonly shape: ShapePreset;
  };
}
