import type { ShadowRole } from "./surfaces.js";

/** Static finishes. Glass is deliberately confined to the separate backdrop pilot. */
export const materialRecipes = {
  matte: {
    label: "Matte",
    finish: "diffuse",
    texture: "none",
    depth: "none",
    image: "none",
    edge: "none",
  },
  glossy: {
    label: "Glossy enamel",
    finish: "glossy",
    texture: "none",
    depth: "raised",
    image:
      "linear-gradient(180deg, rgb(255 255 255 / .2), transparent 6px), linear-gradient(180deg, transparent 40%, rgb(0 0 0 / .06))",
    edge: "inset 0 1px 0 rgb(255 255 255 / .25)",
  },
  soft: {
    label: "Soft clay",
    finish: "soft",
    texture: "none",
    depth: "raised",
    image: "linear-gradient(145deg, transparent 35%, rgb(0 0 0 / .04))",
    edge: "inset 0 -2px 2px rgb(0 0 0 / .08)",
  },
  metal: {
    label: "Brushed metal",
    finish: "brushed",
    texture: "lines",
    depth: "raised",
    image:
      "repeating-linear-gradient(0deg, transparent 0 2px, rgb(0 0 0 / .025) 2px 3px), linear-gradient(110deg, transparent 35%, rgb(0 0 0 / .045) 55%, transparent 75%)",
    edge: "inset 0 1px 0 rgb(255 255 255 / .18)",
  },
  paper: {
    label: "Paper",
    finish: "diffuse",
    texture: "fibers",
    depth: "none",
    image:
      "radial-gradient(ellipse at 1px 1px, rgb(0 0 0 / .045) .5px, transparent .75px)",
    edge: "none",
  },
} as const satisfies Record<
  string,
  {
    label: string;
    finish: string;
    texture: string;
    depth: ShadowRole;
    image: string;
    edge: string;
  }
>;

export type Material = keyof typeof materialRecipes;
export type EffectsPreference = "static" | "backdrop" | "reduced";

/** Hard pilot limits, not a claim of device performance. */
export const materialBudgets = {
  cssGzipBytes: 5120,
  textureTransferBytes: 4096,
  backdropBlurPx: 8,
  backdropViewportFraction: 0.15,
  gradientLayers: 2,
  shadowLayers: 2,
} as const;

export function materialImage<T extends Material>(
  value: T,
): `var(--dixy-material-${T}-image)` {
  return `var(--dixy-material-${value}-image)`;
}
