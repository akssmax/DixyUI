import { fontFamilies, typography } from "@dixy-ui/tokens";
import type { ThemeFoundations } from "./theme-schema.ts";

export const themeFonts = {
  inter: { label: "Inter", value: fontFamilies.sans },
  grotesk: { label: "Space Grotesk", value: fontFamilies.display },
  system: {
    label: "System sans",
    value: "ui-sans-serif, system-ui, sans-serif",
  },
  serif: { label: "System serif", value: "ui-serif, Georgia, Cambria, serif" },
  mono: {
    label: "System mono",
    value: "ui-monospace, SFMono-Regular, Consolas, monospace",
  },
  fraunces: {
    label: "Fraunces",
    value: '"Fraunces Variable", "Fraunces", ui-serif, Georgia, serif',
  },
  deco: {
    label: "Poiret One",
    value: '"Poiret One", "Josefin Sans", "Futura", ui-sans-serif, sans-serif',
  },
  pixel: {
    label: "Silkscreen",
    value: '"Silkscreen", "VT323", ui-monospace, monospace',
  },
  techno: {
    label: "Orbitron",
    value:
      '"Orbitron Variable", "Orbitron", "Eurostile", "Bank Gothic", ui-sans-serif, sans-serif',
  },
  rounded: {
    label: "Fredoka",
    value:
      '"Fredoka Variable", "Fredoka", ui-rounded, "SF Pro Rounded", "Nunito", sans-serif',
  },
  lcd: {
    label: "Share Tech Mono",
    value: '"Share Tech Mono", "VT323", ui-monospace, monospace',
  },
  // Google Fonts via Fontsource; each stack falls back to a close system face.
  plex: {
    label: "IBM Plex Mono",
    value: '"IBM Plex Mono", ui-monospace, SFMono-Regular, monospace',
  },
  archivo: {
    label: "Archivo Black",
    value: '"Archivo Black", "Arial Black", ui-sans-serif, sans-serif',
  },
  neon: {
    label: "Tilt Neon",
    value: '"Tilt Neon", "Fredoka Variable", ui-rounded, sans-serif',
  },
  mincho: {
    label: "Shippori Mincho",
    value:
      '"Shippori Mincho", "Hiragino Mincho ProN", "Yu Mincho", ui-serif, serif',
  },
  gothic: {
    label: "Zen Kaku Gothic New",
    value:
      '"Zen Kaku Gothic New", "Hiragino Sans", "Yu Gothic", ui-sans-serif, system-ui, sans-serif',
  },
  playfair: {
    label: "Playfair Display",
    value:
      '"Playfair Display Variable", "Playfair Display", ui-serif, Georgia, serif',
  },
  caveat: {
    label: "Caveat",
    value: '"Caveat Variable", "Caveat", "Comic Sans MS", cursive',
  },
  bricolage: {
    label: "Bricolage Grotesque",
    value:
      '"Bricolage Grotesque Variable", "Bricolage Grotesque", ui-sans-serif, sans-serif',
  },
  terminal: {
    label: "VT323",
    value: '"VT323", "Share Tech Mono", ui-monospace, monospace',
  },
  jetbrains: {
    label: "JetBrains Mono",
    value: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
  },
  manrope: {
    label: "Manrope",
    value:
      '"Manrope Variable", "Manrope", ui-sans-serif, system-ui, sans-serif',
  },
  atkinson: {
    label: "Atkinson Hyperlegible",
    value: '"Atkinson Hyperlegible", ui-sans-serif, system-ui, sans-serif',
  },
  plexSans: {
    label: "IBM Plex Sans",
    value:
      '"IBM Plex Sans Variable", "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif',
  },
  figtree: {
    label: "Figtree",
    value:
      '"Figtree Variable", "Figtree", ui-sans-serif, system-ui, sans-serif',
  },
  cormorant: {
    label: "Cormorant Garamond",
    value:
      '"Cormorant Garamond Variable", "Cormorant Garamond", "Garamond", ui-serif, Georgia, serif',
  },
} as const;

/** Optional @fontsource packages that load each named web font. System stacks need none. */
export const themeFontPackages: Partial<
  Record<keyof typeof themeFonts, string>
> = {
  inter: "@fontsource-variable/inter",
  grotesk: "@fontsource-variable/space-grotesk",
  fraunces: "@fontsource-variable/fraunces",
  deco: "@fontsource/poiret-one",
  pixel: "@fontsource/silkscreen",
  techno: "@fontsource-variable/orbitron",
  rounded: "@fontsource-variable/fredoka",
  lcd: "@fontsource/share-tech-mono",
  plex: "@fontsource/ibm-plex-mono",
  archivo: "@fontsource/archivo-black",
  neon: "@fontsource/tilt-neon",
  mincho: "@fontsource/shippori-mincho",
  gothic: "@fontsource/zen-kaku-gothic-new",
  playfair: "@fontsource-variable/playfair-display",
  caveat: "@fontsource-variable/caveat",
  bricolage: "@fontsource-variable/bricolage-grotesque",
  terminal: "@fontsource/vt323",
  jetbrains: "@fontsource/jetbrains-mono",
  manrope: "@fontsource-variable/manrope",
  figtree: "@fontsource-variable/figtree",
  plexSans: "@fontsource-variable/ibm-plex-sans",
  atkinson: "@fontsource/atkinson-hyperlegible",
  cormorant: "@fontsource-variable/cormorant-garamond",
};

/** Shared by the compiled consumer settings and playground exports; no React or router import. */
export function themeFoundationStyle(
  settings: Pick<
    ThemeFoundations,
    "bodyFont" | "headingFont" | "border" | "depth"
  >,
): Readonly<Record<string, string> & { fontFamily: string }> {
  const style: Record<string, string> & { fontFamily: string } = {
    fontFamily: themeFonts[settings.bodyFont].value,
    "--dixy-font-sans": themeFonts[settings.bodyFont].value,
    "--dixy-font-display": themeFonts[settings.headingFont].value,
    "--dixy-skin-cushion-elevation":
      settings.depth === "none"
        ? "0 0 0 transparent"
        : "var(--dixy-skin-cushion-cast)",
    "--dixy-card-shadow": `var(--dixy-shadow-${settings.depth})`,
    "--dixy-skin-depth-shadow":
      settings.depth === "none"
        ? "0 0 0 transparent"
        : settings.depth === "floating"
          ? "var(--dixy-skin-authored-shadow, 0 0 0 transparent), var(--dixy-shadow-floating)"
          : "var(--dixy-skin-authored-shadow, var(--dixy-shadow-raised))",
    "--dixy-stroke-width": `${settings.border}px`,
  };
  for (const part of ["card", "button", "input", "dialog"])
    style[`--dixy-${part}-border-width`] = `${settings.border}px`;
  for (const role of Object.keys(typography))
    if (role.startsWith("heading.") || role.startsWith("title."))
      style[`--dixy-font-${role.replaceAll(".", "-")}-family`] =
        themeFonts[settings.headingFont].value;
  return Object.freeze(style);
}
