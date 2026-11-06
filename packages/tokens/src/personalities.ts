import type { Material } from "./materials.js";
import type { ShapePreset } from "./shapes.js";
import type { RadiusPreset } from "./surfaces.js";
import type { MotionScheme } from "./motion.js";

/** Personality coordinates finish and response, leaving semantic colors and preferences intact. */
export const personalityPresets = {
  restrained: {
    label: "Restrained",
    material: "matte",
    shape: "rounded",
    radius: "sm",
    motionScheme: "standard",
    pressDistance: 0.5,
    guidance: "Brief, specific feedback. Keep reading surfaces quiet.",
  },
  playful: {
    label: "Playful",
    material: "glossy",
    shape: "pill",
    radius: "full",
    motionScheme: "expressive",
    pressDistance: 1.5,
    guidance:
      "Warm, direct feedback. Reserve celebration for meaningful completion.",
  },
  tactile: {
    label: "Tactile",
    material: "soft",
    shape: "rounded",
    radius: "lg",
    motionScheme: "standard",
    pressDistance: 1,
    guidance:
      "Calm, concrete feedback. Use edges and depth to explain interaction.",
  },
} as const satisfies Record<
  string,
  {
    label: string;
    material: Material;
    shape: ShapePreset;
    radius: RadiusPreset;
    motionScheme: MotionScheme;
    pressDistance: number;
    guidance: string;
  }
>;
export type Personality = keyof typeof personalityPresets;
