import type { ShaderProgramId } from "./shader-programs";

/** Reviewed skin → shader pairings, shared by /lab/shaders and the Fernpay example. */
export const shaderPairings = [
  { slug: "ocean-depths", program: "caustics", label: "Ocean caustics" },
  { slug: "phosphor-terminal", program: "phosphor", label: "Phosphor CRT" },
  { slug: "neon-night-market", program: "neonRain", label: "Neon rain" },
  {
    slug: "prism-glass",
    program: "iridescence",
    label: "Thin-film iridescence",
  },
  { slug: "diwali-lights", program: "bokeh", label: "Lamp bokeh" },
  { slug: "solar-sail", program: "aurora", label: "Aurora and stars" },
  { slug: "sunset-drive", program: "sunsetGrid", label: "Sunset grid" },
  { slug: "save-point", program: "menuStars", label: "Menu sky" },
  { slug: "arcade-cabinet", program: "arcadeAttract", label: "Attract mode" },
] as const satisfies readonly {
  slug: string;
  program: ShaderProgramId;
  label: string;
}[];

export type ShaderPairing = (typeof shaderPairings)[number];

export function shaderForSkin(slug: string): ShaderPairing | undefined {
  return shaderPairings.find((pairing) => pairing.slug === slug);
}
