/** Canonical Dixy colors: OKLCH primitives → semantic roles → component aliases. */
export type Oklch = readonly [lightness: number, chroma: number, hue: number];
export type ColorAppearance = "light" | "dark";
export const colorSteps = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
export type ColorStep = (typeof colorSteps)[number];
export const neutralColorFamilies = [
  "neutral",
  "slate",
  "gray",
  "zinc",
  "stone",
  "taupe",
  "mauve",
  "mist",
  "olive",
  "sage",
  "sand",
] as const;
export const accentColorFamilies = [
  "tomato",
  "red",
  "ruby",
  "crimson",
  "rose",
  "pink",
  "fuchsia",
  "plum",
  "purple",
  "violet",
  "iris",
  "indigo",
  "blue",
  "sky",
  "cyan",
  "teal",
  "emerald",
  "jade",
  "green",
  "grass",
  "lime",
  "mint",
  "yellow",
  "amber",
  "orange",
  "brown",
  "bronze",
  "gold",
] as const;
export const colorFamilies = [
  ...neutralColorFamilies,
  ...accentColorFamilies,
] as const;
export type NeutralColor = (typeof neutralColorFamilies)[number];
export type ColorFamily = (typeof colorFamilies)[number];
export type ColorScale = Readonly<Record<ColorStep, Oklch>>;
export type ColorPalette = Readonly<Record<ColorAppearance, ColorScale>>;
export type AccentColor = ColorFamily;

/** Linear-light sRGB conversion from OKLab (CSS Color 4 conversion matrices). */
export function oklchToLinearSrgb([
  lightness,
  chroma,
  hue,
]: Oklch): readonly number[] {
  const angle = (hue * Math.PI) / 180;
  const a = chroma * Math.cos(angle);
  const b = chroma * Math.sin(angle);
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}
export function isInSrgb(color: Oklch): boolean {
  return oklchToLinearSrgb(color).every(
    (channel) => channel >= -0.000001 && channel <= 1.000001,
  );
}
/** Reduce chroma at fixed hue/lightness. This is a deterministic sRGB policy, not CSS's perceptual gamut-mapping algorithm. */
export function gamutMap(color: Oklch): Oklch {
  const [l, c, h] = color;
  if (!color.every(Number.isFinite) || l < 0 || l > 1 || c < 0 || c > 0.4) {
    throw new RangeError(
      "Use finite OKLCH values: lightness 0–1, chroma 0–0.4, and a hue in degrees.",
    );
  }
  const hue = ((h % 360) + 360) % 360;
  if (isInSrgb([l, c, hue])) return [l, c, hue];
  let low = 0;
  let high = c;
  for (let i = 0; i < 28; i++) {
    const middle = (low + high) / 2;
    if (isInSrgb([l, middle, hue])) low = middle;
    else high = middle;
  }
  return [l, low, hue];
}
export function contrastRatio(first: Oklch, second: Oklch): number {
  const luminance = (color: Oklch) => {
    const [r, g, b] = oklchToLinearSrgb(color);
    return (
      0.2126 * Math.max(0, Math.min(1, r!)) +
      0.7152 * Math.max(0, Math.min(1, g!)) +
      0.0722 * Math.max(0, Math.min(1, b!))
    );
  };
  const a = luminance(first);
  const b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
export function toOklch(color: Oklch): string {
  const l = Number(color[0].toFixed(6));
  const h = Number(color[2].toFixed(6));
  const mapped = gamutMap([l, color[1], h]);
  // Round chroma inward so emitted CSS does not escape sRGB at the gamut edge.
  return `oklch(${l} ${Math.floor(mapped[1] * 1e6) / 1e6} ${h})`;
}
const white: Oklch = [1, 0, 0];
const ink: Oklch = [0.13, 0.005, 270];
const black: Oklch = [0, 0, 0];
export const colorConstants = { white, ink, black } as const;
export const overlayFamilies = ["black", "white"] as const;
export type OverlayFamily = (typeof overlayFamilies)[number];
export const overlayAlpha = {
  1: 0.05,
  2: 0.1,
  3: 0.15,
  4: 0.2,
  5: 0.3,
  6: 0.4,
  7: 0.5,
  8: 0.6,
  9: 0.7,
  10: 0.8,
  11: 0.9,
  12: 0.95,
} as const;
export function overlayColor(family: OverlayFamily, step: ColorStep): string {
  return `var(--dixy-color-${family}-a${step})`;
}
export function toOverlayColor(family: OverlayFamily, step: ColorStep): string {
  return `oklch(${family === "white" ? 1 : 0} 0 0 / ${overlayAlpha[step]})`;
}

function scale(
  hue: number,
  values: readonly (readonly [number, number])[],
): ColorScale {
  if (values.length !== 12)
    throw new Error("A Dixy palette must contain exactly 12 stops.");
  return Object.fromEntries(
    values.map(([l, c], index) => [index + 1, gamutMap([l, c, hue])]),
  ) as unknown as ColorScale;
}
// Each mode is independently authored. Lightness is not a contrast guarantee.
const lightRamp = (solid: number, chroma: number) =>
  (
    [
      [0.995, 0.002],
      [0.98, 0.008],
      [0.954, 0.022],
      [0.925, 0.038],
      [0.89, 0.055],
      [0.845, 0.075],
      [0.76, 0.1],
      [0.59, 0.14],
      [solid, chroma],
      [solid - 0.045, chroma * 0.95],
      [0.415, chroma * 0.75],
      [0.255, chroma * 0.38],
    ] as const
  ).map(([l, c]) => [l, Math.min(c, chroma)] as const);
const darkRamp = (solid: number, chroma: number) =>
  (
    [
      [0.155, 0.012],
      [0.185, 0.02],
      [0.235, 0.04],
      [0.28, 0.055],
      [0.315, 0.07],
      [0.36, 0.085],
      [0.455, 0.1],
      [0.585, 0.12],
      [solid, chroma],
      [solid + 0.035, chroma * 0.85],
      [0.825, chroma * 0.65],
      [0.94, chroma * 0.15],
    ] as const
  ).map(([l, c]) => [l, Math.min(c, chroma)] as const);
// Family hues follow the breadth of Tailwind and Radix; these are Dixy's own 12-stop ramps.
const neutralSeeds = {
  neutral: [0, 0],
  slate: [260, 0.025],
  gray: [270, 0.006],
  zinc: [285, 0.009],
  stone: [70, 0.016],
  taupe: [65, 0.024],
  mauve: [325, 0.022],
  mist: [205, 0.02],
  olive: [110, 0.022],
  sage: [155, 0.02],
  sand: [85, 0.013],
} as const satisfies Record<NeutralColor, readonly [number, number]>;
const accentSeeds = {
  tomato: [35, 0.54, 0.19],
  red: [25, 0.535, 0.19],
  ruby: [355, 0.535, 0.18],
  crimson: [10, 0.53, 0.19],
  rose: [15, 0.54, 0.2],
  pink: [350, 0.54, 0.19],
  fuchsia: [330, 0.54, 0.2],
  plum: [315, 0.52, 0.18],
  purple: [305, 0.545, 0.2],
  violet: [292, 0.54, 0.2],
  iris: [280, 0.54, 0.2],
  indigo: [270, 0.54, 0.2],
  blue: [260, 0.54, 0.19],
  sky: [230, 0.8, 0.12],
  cyan: [210, 0.52, 0.13],
  teal: [185, 0.5, 0.12],
  emerald: [165, 0.49, 0.14],
  jade: [160, 0.49, 0.14],
  green: [155, 0.49, 0.14],
  grass: [140, 0.49, 0.14],
  lime: [130, 0.8, 0.18],
  mint: [170, 0.8, 0.12],
  yellow: [102, 0.82, 0.17],
  amber: [85, 0.8, 0.16],
  orange: [50, 0.54, 0.18],
  brown: [60, 0.48, 0.08],
  bronze: [55, 0.54, 0.08],
  gold: [80, 0.54, 0.1],
} as const satisfies Record<
  (typeof accentColorFamilies)[number],
  readonly [number, number, number]
>;
function neutralPalette(hue: number, chroma: number): ColorPalette {
  const lightness = [
    0.99, 0.975, 0.948, 0.919, 0.887, 0.843, 0.755, 0.6, 0.49, 0.445, 0.415,
    0.235,
  ];
  const darkLightness = [
    0.145, 0.19, 0.235, 0.275, 0.32, 0.375, 0.46, 0.56, 0.82, 0.86, 0.825, 0.95,
  ];
  const weights = [0.25, 0.33, 0.42, 0.5, 0.58, 0.67, 0.83, 1, 1, 1, 1.17, 1];
  return {
    light: scale(
      hue,
      lightness.map((l, i) => [l, chroma * weights[i]!]),
    ),
    dark: scale(
      hue,
      darkLightness.map((l, i) => [
        l,
        chroma *
          [0.67, 0.75, 0.83, 0.83, 0.92, 1, 1.08, 1.08, 1, 0.83, 0.75, 0.5][i]!,
      ]),
    ),
  };
}
export const colorPalettes: Readonly<Record<ColorFamily, ColorPalette>> = {
  ...Object.fromEntries(
    neutralColorFamilies.map((family) => {
      const [h, c] = neutralSeeds[family];
      return [family, neutralPalette(h, c)];
    }),
  ),
  ...Object.fromEntries(
    accentColorFamilies.map((family) => {
      const [h, l, c] = accentSeeds[family];
      return [
        family,
        {
          light: scale(h, lightRamp(l, c)),
          dark: scale(
            h,
            darkRamp(
              l >= 0.75 ? Math.min(0.86, l + 0.03) : 0.74,
              Math.min(0.15, c),
            ),
          ),
        },
      ];
    }),
  ),
} as Record<ColorFamily, ColorPalette>;
export function actionColors(palette: ColorScale, appearance: ColorAppearance) {
  const pressed = gamutMap([
    palette[9][0] - (appearance === "light" ? 0.065 : 0.035),
    palette[9][1] * 0.95,
    palette[9][2],
  ]);
  const states = [palette[9], palette[10], pressed];
  const candidates = [white, ink].map((foreground) => ({
    foreground,
    minimum: Math.min(
      ...states.map((background) => contrastRatio(foreground, background)),
    ),
  }));
  candidates.sort((a, b) => b.minimum - a.minimum);
  if (candidates[0]!.minimum < 4.5)
    throw new RangeError(
      "This palette has no common 4.5:1 foreground across solid, hover and pressed states. Choose a lighter or darker seed.",
    );
  return {
    background: palette[9],
    hover: palette[10],
    pressed,
    foreground: candidates[0]!.foreground,
  };
}
/**
 * Focus ring colour. Step 8 is about 4:1 against white, which drops under
 * 3:1 on mid-grey light surfaces (Brutalist Concrete measured 2.81:1). In
 * light mode the ring leans 30% toward step 11 in OKLab, which kept every
 * built-in theme at or above 3.48:1; dark mode already clears 3:1 at step 8.
 */
export function focusColor(
  palette: ColorScale,
  appearance: ColorAppearance,
): Oklch {
  if (appearance === "dark") return palette[8];
  const lab = ([l, c, h]: Oklch) => [
    l,
    c * Math.cos((h * Math.PI) / 180),
    c * Math.sin((h * Math.PI) / 180),
  ];
  const [l1, a1, b1] = lab(palette[8]);
  const [l2, a2, b2] = lab(palette[11]);
  const t = 0.3;
  const [l, a, b] = [
    l1! + (l2! - l1!) * t,
    a1! + (a2! - a1!) * t,
    b1! + (b2! - b1!) * t,
  ];
  const c = Math.hypot(a, b);
  const h =
    c < 1e-4 ? palette[8][2] : ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360;
  return gamutMap([l, c, h]);
}
/** Seed-based brand palette; unsafe seeds are rejected rather than silently claiming accessible output. */
export function createColorPalette(seed: Oklch): ColorPalette {
  const [l, c, h] = gamutMap(seed);
  const light = scale(h, lightRamp(Math.max(0.48, Math.min(0.83, l)), c));
  const dark = scale(
    h,
    darkRamp(Math.max(0.72, Math.min(0.86, l + 0.15)), c * 0.8),
  );
  actionColors(light, "light");
  actionColors(dark, "dark");
  return { light, dark };
}
export function colorThemeVariables(
  palette: ColorPalette,
  appearance: ColorAppearance,
): Record<string, string> {
  const action = actionColors(palette[appearance], appearance);
  return {
    ...Object.fromEntries(
      colorSteps.map((step) => [
        `--dixy-color-brand-${step}`,
        toOklch(palette[appearance][step]),
      ]),
    ),
    "--dixy-color-brand-pressed": toOklch(action.pressed),
    "--dixy-color-brand-on-solid": toOklch(action.foreground),
    "--dixy-color-brand-focus": toOklch(
      focusColor(palette[appearance], appearance),
    ),
  };
}
export type ColorReference =
  | `${ColorFamily | "brand" | "base"}.${ColorStep}`
  | "white"
  | "ink"
  | "black"
  | `${OverlayFamily}.a${ColorStep}`
  | `${ColorFamily | "brand" | "base"}.pressed`
  | `${ColorFamily | "brand" | "base"}.on-solid`
  | `${ColorFamily | "brand" | "base"}.focus`;
const role = (light: ColorReference, dark: ColorReference = light) => ({
  light,
  dark,
});
type Role = ReturnType<typeof role>;
type ActionRole<Name extends string> =
  | `background.action.${Name}`
  | `background.action.${Name}.hover`
  | `background.action.${Name}.pressed`
  | `background.action.${Name}.subtle`
  | `background.action.${Name}.subtle.hover`
  | `background.action.${Name}.subtle.pressed`
  | `text.on.action.${Name}`
  | `text.action.${Name}`;
type StatusRole<Name extends string> =
  | `background.${Name}`
  | `background.${Name}.bold`
  | `text.${Name}`
  | `text.on.${Name}`
  | `icon.${Name}`
  | `border.${Name}`;
const actionRoles = <Name extends string>(
  name: Name,
  palette: ColorFamily | "brand" | "base",
) =>
  ({
    [`background.action.${name}`]: role(`${palette}.9`),
    [`background.action.${name}.hover`]: role(`${palette}.10`),
    [`background.action.${name}.pressed`]: role(`${palette}.pressed`),
    [`background.action.${name}.subtle`]: role(`${palette}.3`),
    [`background.action.${name}.subtle.hover`]: role(`${palette}.4`),
    [`background.action.${name}.subtle.pressed`]: role(`${palette}.5`),
    [`text.on.action.${name}`]: role(`${palette}.on-solid`),
    [`text.action.${name}`]: role(`${palette}.11`),
  }) as Record<ActionRole<Name>, Role>;
const statusRoles = <Name extends string>(name: Name, palette: ColorFamily) =>
  ({
    [`background.${name}`]: role(`${palette}.3`),
    [`background.${name}.bold`]: role(`${palette}.9`),
    [`text.${name}`]: role(`${palette}.11`),
    [`text.on.${name}`]: role(`${palette}.on-solid`),
    [`icon.${name}`]: role(`${palette}.11`),
    [`border.${name}`]: role(`${palette}.8`),
  }) as Record<StatusRole<Name>, Role>;
/** Property → purpose → emphasis/state. Action success and feedback success stay independent. */
export const semanticColors = {
  "background.overlay": role("black.a8", "black.a9"),
  "background.overlay.subtle": role("black.a4"),
  "background.overlay.strong": role("black.a10"),
  "background.overlay.inverse": role("white.a8"),
  "background.canvas": role("base.1"),
  "background.surface": role("base.2"),
  "background.surface.raised": role("white", "base.3"),
  "background.surface.sunken": role("base.3", "base.1"),
  "background.subtle": role("base.3"),
  "background.inverse": role("base.12"),
  "background.selected": role("brand.5"),
  "background.disabled": role("base.3"),
  "text.primary": role("base.12"),
  "text.secondary": role("base.11"),
  "text.tertiary": role("base.11"),
  "text.inverse": role("white", "ink"),
  "text.link": role("brand.11"),
  "text.selected": role("brand.11"),
  "text.disabled": role("base.8", "base.7"),
  "icon.primary": role("base.12"),
  "icon.secondary": role("base.11"),
  "icon.disabled": role("base.8", "base.7"),
  "border.subtle": role("base.6"),
  "border.default": role("base.8"),
  "border.strong": role("base.9", "base.8"),
  "border.focus": role("brand.focus"),
  ...actionRoles("primary", "brand"),
  ...actionRoles("secondary", "base"),
  ...actionRoles("destructive", "red"),
  ...actionRoles("success", "green"),
  ...statusRoles("success", "green"),
  ...statusRoles("danger", "red"),
  ...statusRoles("warning", "amber"),
  ...statusRoles("information", "blue"),
  ...statusRoles("discovery", "purple"),
  /*
   * Categorical data-viz series. Series 1 follows the theme's accent; light
   * mode uses the focus mix because bright accents (amber, lime, sky, mint,
   * yellow) measure ~1.5:1 at step 9. Series 2–6 are step-9 companions picked
   * per accent (chartSeriesFamilies), every one ≥3:1 against canvas, surface
   * and raised surfaces (WCAG 1.4.11 non-text contrast).
   */
  "chart.1": role("brand.focus", "brand.9"),
  // Series 2–6 shown for the default blue accent; each data-accent rule
  // rebinds them through chartSeriesFamilies so no series repeats the accent.
  "chart.2": role("orange.9"),
  "chart.3": role("teal.9"),
  "chart.4": role("crimson.9"),
  "chart.5": role("grass.9"),
  "chart.6": role("gold.9"),
  "chart.grid": role("base.6"),
  "chart.axis": role("base.11"),
  "chart.cursor": role("base.4"),
} as const;
export type SemanticColor = keyof typeof semanticColors;
/** Companion hues for chart series 2–6, in preference order. */
export const chartCompanionFamilies = [
  "orange",
  "teal",
  "violet",
  "crimson",
  "grass",
  "gold",
  "blue",
  "pink",
  "cyan",
] as const satisfies readonly ColorFamily[];
const hueGap = (a: number, b: number) => {
  const gap = Math.abs(a - b) % 360;
  return Math.min(gap, 360 - gap);
};
/**
 * Families for chart series 2–6 under an accent. Series 1 is the accent, so
 * companions within 35° of its hue are skipped; near-grey accents keep the
 * first five. Every pair in the resulting six is at least 30° apart.
 */
export function chartSeriesFamilies(accent: ColorFamily): ColorFamily[] {
  const [, chroma, hue] = colorPalettes[accent].light[9];
  const picked: ColorFamily[] = [];
  for (const family of chartCompanionFamilies) {
    if (picked.length === 5) break;
    if (chroma >= 0.05 && hueGap(hue, colorPalettes[family].light[9][2]) < 35)
      continue;
    picked.push(family);
  }
  return picked;
}
export const colorThemePersonalities = {
  minimal: { accentColor: "blue", neutralColor: "neutral", overrides: {} },
  expressive: { accentColor: "purple", neutralColor: "mauve", overrides: {} },
  nostalgic: {
    accentColor: "purple",
    neutralColor: "sand",
    overrides: {
      "background.canvas": "purple.2",
      "background.surface.sunken": "purple.3",
    },
  },
} as const satisfies Record<
  string,
  {
    accentColor: ColorFamily;
    neutralColor: NeutralColor;
    overrides: Partial<Record<SemanticColor, ColorReference>>;
  }
>;
export function color(palette: ColorFamily, step: ColorStep): string {
  return `var(--dixy-color-${palette}-${step})`;
}
export function semanticColor(role: SemanticColor): string {
  return `var(--dixy-color-${role.replaceAll(".", "-")})`;
}
export function colorReference(reference: ColorReference): string {
  return `var(--dixy-color-${reference.replaceAll(".", "-")})`;
}
export function resolveColor(
  reference: ColorReference,
  appearance: ColorAppearance,
  accent: ColorFamily = "blue",
  neutral: NeutralColor = "neutral",
): Oklch {
  if (reference === "white" || reference === "ink" || reference === "black")
    return colorConstants[reference];
  const [family, step] = reference.split(".");
  if (step?.startsWith("a"))
    throw new RangeError(
      "Overlay contrast depends on the surface underneath; resolve an opaque role or inspect overlayAlpha instead.",
    );
  const palette =
    colorPalettes[
      (family === "brand"
        ? accent
        : family === "base"
          ? neutral
          : family) as ColorFamily
    ][appearance];
  if (step === "pressed") return actionColors(palette, appearance).pressed;
  if (step === "on-solid") return actionColors(palette, appearance).foreground;
  if (step === "focus") return focusColor(palette, appearance);
  return palette[Number(step) as ColorStep];
}
