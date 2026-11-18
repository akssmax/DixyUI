/** Pixel references assume a 16px root. CSS output uses rem for size and leading. */
export const fontSizePrimitives = [
  12, 14, 16, 18, 20, 24, 28, 32, 36, 44, 56, 72, 96, 128,
] as const;
export const lineHeightPrimitives = [
  16, 20, 24, 26, 28, 32, 36, 40, 44, 52, 64, 72, 96, 128,
] as const;

/**
 * Fluid roles grow from `min` at a 320px-wide container to their full size at
 * 1280px, using container query units (`cqi`). With no size container in the
 * tree, `cqi` falls back to the small viewport, so they still scale on phones.
 */
export const fluidRange = { from: 320, to: 1280 } as const;
export const fontWeightPrimitives = {
  regular: 400,
  medium: 500,
  label: 550,
  semibold: 600,
  strong: 650,
  bold: 700,
} as const;
export const fontFamilies = {
  sans: '"Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif',
  display:
    '"Space Grotesk Variable", "Inter Variable", ui-sans-serif, system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Consolas, monospace',
} as const;

export interface TypographyToken {
  family: keyof typeof fontFamilies;
  size: (typeof fontSizePrimitives)[number];
  lineHeight: (typeof lineHeightPrimitives)[number];
  weight: keyof typeof fontWeightPrimitives;
  letterSpacing: number;
  description: string;
  /** Smallest size, in px, when the role scales with its container. */
  fluid?: { min: number };
}

/** Semantic contracts: family, size, leading, weight and tracking travel together. */
export const typography = {
  "display.3xl": {
    family: "display",
    size: 128,
    lineHeight: 128,
    weight: "bold",
    letterSpacing: -0.05,
    fluid: { min: 52 },
    description:
      "Poster-scale words and numerals: one or two words that are the interface.",
  },
  "display.2xl": {
    family: "display",
    size: 96,
    lineHeight: 96,
    weight: "bold",
    letterSpacing: -0.045,
    fluid: { min: 44 },
    description: "Oversized values, selections and short statements.",
  },
  "display.xl": {
    family: "display",
    size: 72,
    lineHeight: 72,
    weight: "bold",
    letterSpacing: -0.04,
    fluid: { min: 36 },
    description: "Large expressive lists, options and hero lines.",
  },
  "display.lg": {
    family: "display",
    size: 56,
    lineHeight: 64,
    weight: "bold",
    letterSpacing: -0.035,
    description: "Short hero statements on generous layouts.",
  },
  "display.md": {
    family: "display",
    size: 44,
    lineHeight: 52,
    weight: "bold",
    letterSpacing: -0.03,
    description: "Page introductions and smaller hero statements.",
  },
  "display.sm": {
    family: "display",
    size: 36,
    lineHeight: 44,
    weight: "strong",
    letterSpacing: -0.025,
    description: "Compact display statements; use for narrow layouts.",
  },
  "heading.lg": {
    family: "sans",
    size: 32,
    lineHeight: 40,
    weight: "strong",
    letterSpacing: -0.025,
    description: "Major sections in a document.",
  },
  "heading.md": {
    family: "sans",
    size: 28,
    lineHeight: 36,
    weight: "strong",
    letterSpacing: -0.02,
    description: "Sections and prominent content headings.",
  },
  "heading.sm": {
    family: "sans",
    size: 24,
    lineHeight: 32,
    weight: "strong",
    letterSpacing: -0.015,
    description: "Subsections and dialog headings.",
  },
  "title.lg": {
    family: "sans",
    size: 20,
    lineHeight: 28,
    weight: "semibold",
    letterSpacing: -0.01,
    description: "Card headings and grouped content.",
  },
  "title.md": {
    family: "sans",
    size: 18,
    lineHeight: 26,
    weight: "semibold",
    letterSpacing: -0.005,
    description: "Compact content headings.",
  },
  "title.sm": {
    family: "sans",
    size: 16,
    lineHeight: 24,
    weight: "semibold",
    letterSpacing: 0,
    description: "Small headings within a component.",
  },
  "body.lg": {
    family: "sans",
    size: 18,
    lineHeight: 28,
    weight: "regular",
    letterSpacing: 0,
    description: "Introductory and spacious reading text.",
  },
  "body.md": {
    family: "sans",
    size: 16,
    lineHeight: 24,
    weight: "regular",
    letterSpacing: 0,
    description: "Default reading text and inputs.",
  },
  "body.sm": {
    family: "sans",
    size: 14,
    lineHeight: 20,
    weight: "regular",
    letterSpacing: 0.005,
    description: "Secondary text and compact navigation.",
  },
  "label.lg": {
    family: "sans",
    size: 16,
    lineHeight: 24,
    weight: "label",
    letterSpacing: 0,
    description: "Large control labels.",
  },
  "label.md": {
    family: "sans",
    size: 14,
    lineHeight: 20,
    weight: "label",
    letterSpacing: 0.005,
    description: "Default labels, buttons and tabs.",
  },
  "label.sm": {
    family: "sans",
    size: 12,
    lineHeight: 16,
    weight: "label",
    letterSpacing: 0.01,
    description: "Short supporting labels; never primary reading text.",
  },
  caption: {
    family: "sans",
    size: 12,
    lineHeight: 16,
    weight: "regular",
    letterSpacing: 0.01,
    description: "Metadata and supporting captions.",
  },
  "code.md": {
    family: "mono",
    size: 14,
    lineHeight: 24,
    weight: "regular",
    letterSpacing: 0,
    description: "Multiline code samples.",
  },
  "code.sm": {
    family: "mono",
    size: 12,
    lineHeight: 20,
    weight: "regular",
    letterSpacing: 0,
    description: "Compact token names and inline metadata.",
  },
} as const satisfies Record<string, TypographyToken>;

export type TypographyRole = keyof typeof typography;
export type TextVariant = Exclude<
  TypographyRole,
  `display.${string}` | `heading.${string}` | `title.${string}`
>;
export type HeadingVariant = Exclude<TypographyRole, TextVariant>;

/** The CSS font shorthand; tracking is deliberately a separate property. */
export function font<T extends TypographyRole>(role: T): string {
  return `var(--dixy-font-${role.replaceAll(".", "-")})`;
}

/** Axes in the actual docs font files. Italic is a separate Inter face. */
export const variableFontAxes = {
  inter: { wght: { min: 100, max: 900 }, opsz: { min: 14, max: 32 } },
  spaceGrotesk: { wght: { min: 300, max: 700 } },
} as const;
