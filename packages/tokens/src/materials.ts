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
    blend: "normal",
  },
  glossy: {
    label: "Glossy enamel",
    finish: "glossy",
    texture: "none",
    depth: "raised",
    image:
      "linear-gradient(180deg, rgb(255 255 255 / .2), transparent 6px), linear-gradient(180deg, transparent 40%, rgb(0 0 0 / .06))",
    edge: "inset 0 1px 0 rgb(255 255 255 / .25)",
    blend: "normal",
  },
  soft: {
    label: "Soft clay",
    finish: "soft",
    texture: "none",
    depth: "raised",
    // A broad top light, a shaded underside and a thick inset rim read as clay.
    image:
      "radial-gradient(120% 90% at 30% 0%, rgb(255 255 255 / .2), transparent 65%), linear-gradient(160deg, transparent 40%, rgb(0 0 0 / .07))",
    edge: "inset 0 2px 1px rgb(255 255 255 / .4), inset 0 -3px 5px rgb(0 0 0 / .14)",
    blend: "normal",
  },
  metal: {
    label: "Brushed metal",
    finish: "brushed",
    texture: "lines",
    depth: "raised",
    // Irregular brushed grain over a cool steel band (multiplied into the base
    // colour), with a bright bevel rim, reads as machined aluminium.
    image:
      "repeating-linear-gradient(0deg, rgb(255 255 255 / .09) 0 .6px, transparent .6px 1.7px, rgb(0 0 0 / .05) 1.7px 2.2px, transparent 2.2px 3.1px, rgb(255 255 255 / .05) 3.1px 3.5px, transparent 3.5px 4.9px), linear-gradient(180deg, rgb(250 251 253), rgb(224 229 236) 28%, rgb(244 246 249) 52%, rgb(218 224 232) 82%, rgb(236 239 243))",
    edge: "inset 0 1px 0 rgb(255 255 255 / .65), inset 0 -1px 0 rgb(0 0 0 / .22)",
    blend: "normal, multiply",
    // Multiply only darkens, so dark mode screens dim steel highlights instead.
    dark: {
      image:
        "repeating-linear-gradient(0deg, rgb(255 255 255 / .06) 0 .6px, transparent .6px 1.7px, rgb(0 0 0 / .12) 1.7px 2.2px, transparent 2.2px 3.1px, rgb(255 255 255 / .035) 3.1px 3.5px, transparent 3.5px 4.9px), linear-gradient(180deg, rgb(58 63 72), rgb(14 16 20) 28%, rgb(46 51 59) 52%, rgb(8 9 12) 82%, rgb(34 38 44))",
      edge: "inset 0 1px 0 rgb(255 255 255 / .22), inset 0 -1px 0 rgb(0 0 0 / .5)",
      blend: "normal, screen",
    },
  },
  paper: {
    label: "Paper",
    finish: "diffuse",
    texture: "fibers",
    depth: "none",
    // Uneven hairline fibres over a warm stock, multiplied into the base colour.
    image:
      "repeating-linear-gradient(72deg, rgb(120 90 40 / .05) 0 .5px, transparent .5px 2.3px, rgb(120 90 40 / .035) 2.3px 2.7px, transparent 2.7px 5.9px, rgb(120 90 40 / .025) 5.9px 6.2px, transparent 6.2px 9.1px), linear-gradient(160deg, rgb(253 250 242), rgb(245 238 222))",
    edge: "inset 0 0 0 1px rgb(120 90 40 / .08)",
    blend: "normal, multiply",
    // A warm, faintly lifted stock with pale fibres for dark surfaces.
    dark: {
      image:
        "repeating-linear-gradient(72deg, rgb(255 236 200 / .045) 0 .5px, transparent .5px 2.3px, rgb(255 236 200 / .03) 2.3px 2.7px, transparent 2.7px 5.9px, rgb(255 236 200 / .02) 5.9px 6.2px, transparent 6.2px 9.1px), linear-gradient(160deg, rgb(40 34 24), rgb(24 20 13))",
      edge: "inset 0 0 0 1px rgb(255 236 200 / .07)",
      blend: "normal, screen",
    },
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
    blend: string;
    dark?: { image: string; edge: string; blend: string };
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
