import {
  defaultCharacter,
  defaultOrganicOrnament,
  organicOrnamentVariables,
  type ThemeCharacter,
  isOrganicFrame,
  wellGrounds,
} from "@dixy-ui/themes/authoring";
import {
  compilePlaygroundDocument,
  installedThemeDocuments,
  parseThemeDocument,
  materialRecipes,
  frameRecipes,
  type ThemeDocument,
} from "./theme-authoring.ts";
import {
  skinDefinitions,
  ornamentRenderers,
  frameOrnamentRenderers,
} from "./generated-skin-loaders.ts";
export { skinDefinitions } from "./generated-skin-loaders.ts";
import type { ThemeProps } from "@dixy-ui/react";
import { skinCatalog } from "@dixy-ui/themes/catalog";
import {
  themeFontPackages,
  themeFonts,
  themeFoundationStyle,
} from "@dixy-ui/themes/foundations";
import {
  actionColors,
  colorFamilies,
  colorPalettes,
  oklchToLinearSrgb,
  colorThemeVariables,
  createColorPalette,
  neutralColorFamilies,
  radiusPresets,
  spacingDensity,
  type ColorPalette,
  type Oklch,
} from "@dixy-ui/tokens";

const ornamentSymbols: Record<string, string | null> = Object.fromEntries(
  skinCatalog.map((skin) => [skin.slug, skin.rendererSymbol]),
);

export { skinCatalog };
export const playgroundFonts = themeFonts;

export interface ThemePreset {
  version: 2;
  document: ThemeDocument | null;
  animateOrnaments: boolean;
  skin: string;
  skinVersion: 1;
  ornament: "quiet" | "balanced" | "expressive";
  relief: 0 | 1 | 2;
  effects: "static" | "backdrop" | "reduced";
  material: "inherit" | "matte" | "glossy" | "soft" | "metal" | "paper";
  shape: "inherit" | "rounded" | "pill" | "square";
  dir: "ltr" | "rtl";
  appearance: "light" | "dark";
  accentColor: NonNullable<ThemeProps["accentColor"]>;
  neutralColor: NonNullable<ThemeProps["neutralColor"]>;
  radius: NonNullable<ThemeProps["radius"]>;
  density: NonNullable<ThemeProps["density"]>;
  motion: NonNullable<ThemeProps["motion"]>;
  bodyFont: keyof typeof playgroundFonts;
  headingFont: keyof typeof playgroundFonts;
  depth: "none" | "raised" | "floating";
  border: 1 | 2;
  customAccent: boolean;
  lightness: number;
  chroma: number;
  hue: number;
}
export const defaultThemePreset: ThemePreset = {
  version: 2,
  document: null,
  animateOrnaments: false,
  skin: "none",
  skinVersion: 1,
  ornament: "balanced",
  relief: 1,
  effects: "static",
  material: "inherit",
  shape: "inherit",
  dir: "ltr",
  appearance: "light",
  accentColor: "purple",
  neutralColor: "sand",
  radius: "md",
  density: "default",
  motion: "system",
  bodyFont: "inter",
  headingFont: "grotesk",
  depth: "raised",
  border: 1,
  customAccent: false,
  lightness: 0.54,
  chroma: 0.2,
  hue: 305,
};

export function skinThemePreset(id: string): ThemePreset {
  if (id === "none") return { ...defaultThemePreset };
  const skin = skinDefinitions[id];
  const meta = skinCatalog.find((s) => s.id === id);
  if (!skin || !meta)
    throw new Error("This skin is not installed. Choose an available skin.");
  const { componentFinish, ...foundations } = meta.defaults;
  return {
    ...defaultThemePreset,
    skin: id,
    ...foundations,
    material: componentFinish,
    shape: "inherit",
  };
}
export const starterPresets = [
  { name: "Dixy", description: "Warm & expressive", theme: defaultThemePreset },
  {
    name: "Studio",
    description: "Quiet & precise",
    theme: {
      ...defaultThemePreset,
      accentColor: "blue",
      neutralColor: "slate",
      radius: "sm",
      headingFont: "inter",
      depth: "none",
    },
  },
  {
    name: "Grove",
    description: "Soft & organic",
    theme: {
      ...defaultThemePreset,
      accentColor: "jade",
      neutralColor: "sage",
      radius: "full",
      density: "comfortable",
      headingFont: "serif",
    },
  },
  {
    name: "Ember",
    description: "Bold & editorial",
    theme: {
      ...defaultThemePreset,
      accentColor: "orange",
      neutralColor: "stone",
      radius: "none",
      border: 2,
      headingFont: "grotesk",
      density: "compact",
    },
  },
] as const satisfies readonly {
  name: string;
  description: string;
  theme: ThemePreset;
}[];

const choices: Partial<Record<keyof ThemePreset, readonly unknown[]>> = {
  animateOrnaments: [true, false],
  appearance: ["light", "dark"],
  accentColor: colorFamilies,
  neutralColor: neutralColorFamilies,
  radius: Object.keys(radiusPresets),
  density: Object.keys(spacingDensity),
  motion: ["system", "reduced"],
  bodyFont: Object.keys(playgroundFonts),
  headingFont: Object.keys(playgroundFonts),
  depth: ["none", "raised", "floating"],
  border: [1, 2],
  customAccent: [true, false],
  ornament: ["quiet", "balanced", "expressive"],
  relief: [0, 1, 2],
  effects: ["static", "backdrop", "reduced"],
  material: ["inherit", "matte", "glossy", "soft", "metal", "paper"],
  shape: ["inherit", "rounded", "pill", "square"],
  dir: ["ltr", "rtl"],
};
const legacyKeys = [
  "appearance",
  "accentColor",
  "neutralColor",
  "radius",
  "density",
  "motion",
  "bodyFont",
  "headingFont",
  "depth",
  "border",
  "customAccent",
  "lightness",
  "chroma",
  "hue",
] as const;
function applyValues(
  result: ThemePreset,
  input: Record<string, unknown>,
  required: boolean,
) {
  const keys = required
    ? legacyKeys
    : (Object.keys(defaultThemePreset).filter(
        (k) => !["version", "skin", "skinVersion", "document"].includes(k),
      ) as (keyof ThemePreset)[]);
  for (const key of keys) {
    if (!Object.hasOwn(input, key) && !required) continue;
    const entry = input[key];
    if (choices[key]) {
      if (!choices[key]!.includes(entry))
        throw new Error("Invalid or missing " + key + ".");
    } else {
      const [min, max] =
        key === "lightness"
          ? [0.48, 0.83]
          : key === "chroma"
            ? [0, 0.3]
            : [0, 360];
      if (
        typeof entry !== "number" ||
        !Number.isFinite(entry) ||
        entry < min! ||
        entry > max!
      )
        throw new Error(key + " is outside its supported range.");
    }
    Object.assign(result, { [key]: entry });
  }
}
function object(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}
/** Presets contain bounded data and installed IDs; never executable styles or code. */
export function parseThemePreset(source: string): ThemePreset {
  if (source.length > 32768)
    throw new Error("This preset is too large. Use a compact preset file.");
  const input: unknown = JSON.parse(source);
  if (!object(input)) throw new Error("Paste a Dixy theme preset object.");
  if (Object.hasOwn(input, "schemaVersion")) {
    const document = parseThemeDocument(input);
    return presetFromDocument(
      skinDefinitions[document.id]
        ? parseThemeDocument({
            ...document,
            id: "custom/" + document.id.split("/")[1],
          })
        : document,
    );
  }
  if (input.version === 3) {
    const document = parseThemeDocument(input.document);
    if (skinDefinitions[document.id])
      throw new Error(
        "Custom documents need their own namespaced ID. Fork the starter first.",
      );
    if (
      input.skinVersion !== 1 ||
      !object(input.overrides) ||
      typeof input.skin !== "string"
    )
      throw new Error("Invalid custom preset.");
    const result = presetFromDocument(document, input.skin);
    applyValues(result, input.overrides, false);
    return result;
  }
  if (input.version === 1) {
    const result = { ...defaultThemePreset };
    applyValues(result, input, true);
    return result;
  }
  if (
    input.version !== 2 ||
    typeof input.skin !== "string" ||
    input.skinVersion !== 1 ||
    !object(input.overrides)
  )
    throw new Error("Use a supported Dixy v1 or v2 preset.");
  const result = skinThemePreset(input.skin);
  applyValues(result, input.overrides, false);
  return result;
}
export function serializeThemePreset(preset: ThemePreset): string {
  const base = preset.document
    ? presetFromDocument(preset.document, preset.skin)
    : skinThemePreset(preset.skin);
  const overrides = Object.fromEntries(
    Object.entries(preset).filter(
      ([key, value]) =>
        !["version", "skin", "skinVersion", "document"].includes(key) &&
        value !== base[key as keyof ThemePreset],
    ),
  );
  return JSON.stringify(
    {
      version: preset.document ? 3 : 2,
      skin: preset.skin,
      skinVersion: 1,
      ...(preset.document ? { document: preset.document } : {}),
      overrides,
    },
    null,
    2,
  );
}
export function presetPalette(preset: ThemePreset): ColorPalette {
  return preset.customAccent
    ? createColorPalette([preset.lightness, preset.chroma, preset.hue])
    : colorPalettes[preset.accentColor];
}
export function playgroundThemeProps(
  preset: ThemePreset,
  appearance = preset.appearance,
): ThemeProps {
  const palette = presetPalette(preset);
  const source = preset.document ?? installedThemeDocuments[preset.skin];
  const style: Record<string, string> = {
    ...(source
      ? organicOrnamentVariables(
          source.recipes.frame.id,
          source.recipes.frame.ornament,
        )
      : {}),
    ...(preset.document
      ? compilePlaygroundDocument(preset.document).themeProps.style
      : {}),
    ...themeFoundationStyle(preset),
  };
  if (preset.customAccent)
    Object.assign(style, colorThemeVariables(palette, appearance));
  return {
    skin: preset.document
      ? compilePlaygroundDocument(preset.document).definition
      : (skinDefinitions[preset.skin] ?? null),
    animateOrnaments: preset.animateOrnaments,
    ornamentRenderer: preset.document
      ? (frameOrnamentRenderers[preset.document.recipes.frame.id] ?? null)
      : (ornamentRenderers[preset.skin] ?? null),
    ornament: preset.ornament,
    relief: preset.relief,
    material: preset.material === "inherit" ? undefined : preset.material,
    shape: preset.shape === "inherit" ? undefined : preset.shape,
    effects: preset.effects,
    dir: preset.dir,
    appearance,
    accentColor: preset.accentColor,
    neutralColor: preset.neutralColor,
    radius: preset.radius,
    density: preset.density,
    motion: preset.motion,
    style,
  };
}
export function themeSeed(preset: ThemePreset): Oklch {
  return preset.customAccent
    ? [preset.lightness, preset.chroma, preset.hue]
    : colorPalettes[preset.accentColor].light[9];
}
/** Complete, public-package consumer. The selected skin remains an explicit import. */
export function themeReactCode(preset: ThemePreset): string {
  if (preset.document) return customThemeReactCode(preset);
  const {
    appearance: _,
    style: __,
    skin: ___,
    ornamentRenderer: ____,
    ...settings
  } = playgroundThemeProps(preset);
  const styles = {
    light: playgroundThemeProps(preset, "light").style,
    dark: playgroundThemeProps(preset, "dark").style,
  };
  const meta = skinCatalog.find((s) => s.id === preset.skin);
  const fonts = new Set([preset.bodyFont, preset.headingFont]);
  return [
    'import type { CSSProperties, ReactNode } from "react";',
    'import { Theme, type ThemeProps } from "@dixy-ui/react";',
    'import "@dixy-ui/react/styles.css";',
    ...(meta
      ? [
          "import { " +
            meta.symbol +
            ' } from "@dixy-ui/themes/' +
            meta.slug +
            '";',
          'import "@dixy-ui/themes/' + meta.slug + '.css";',
        ]
      : []),
    ...(meta && ornamentSymbols[meta.slug]
      ? [
          "import { " +
            ornamentSymbols[meta.slug] +
            ' } from "@dixy-ui/themes/' +
            meta.slug +
            '/react";',
        ]
      : []),
    ...(preset.material !== "inherit"
      ? ['import "@dixy-ui/react/materials.css";']
      : []),
    ...[...fonts]
      .map((font) => themeFontPackages[font as keyof typeof themeFontPackages])
      .filter(Boolean)
      .map((pkg) => 'import "' + pkg + '";'),
    "",
    "export const dixyPreset = " +
      JSON.stringify(settings, null, 2) +
      " satisfies ThemeProps;",
    "",
    "const themeStyles = " + JSON.stringify(styles, null, 2) + ";",
    "",
    "export function DixyTheme({ children, appearance = " +
      JSON.stringify(preset.appearance) +
      " }: {",
    '  children: ReactNode; appearance?: "light" | "dark";',
    "}) {",
    "  return (",
    "    <Theme {...dixyPreset} skin={" +
      (meta ? meta.symbol : "null") +
      "}" +
      (meta && ornamentSymbols[meta.slug]
        ? " ornamentRenderer={" + ornamentSymbols[meta.slug] + "}"
        : "") +
      " appearance={appearance}",
    "      style={themeStyles[appearance] as CSSProperties}>",
    "      {children}",
    "    </Theme>",
    "  );",
    "}",
    "",
    "// Wrap your application: <DixyTheme><App /></DixyTheme>",
  ].join("\n");
}
export function themeCSSCode(preset: ThemePreset): string {
  if (preset.document) return customThemeCSSCode(preset);
  const meta = skinCatalog.find((s) => s.id === preset.skin);
  return [
    "/* Use with the matching exported React wrapper. Assets resolve from the selected package. */",
    '@import "@dixy-ui/react/styles.css";',
    ...(meta ? ['@import "@dixy-ui/themes/' + meta.slug + '.css";'] : []),
    ...(preset.material !== "inherit"
      ? ['@import "@dixy-ui/react/materials.css";']
      : []),
    ...(["light", "dark"] as const).map(
      (appearance) =>
        '.dixy-custom-theme[data-appearance="' +
        appearance +
        '"] {\n' +
        Object.entries(playgroundThemeProps(preset, appearance).style ?? {})
          .map(
            ([k, v]) =>
              "  " + (k === "fontFamily" ? "font-family" : k) + ": " + v + ";",
          )
          .join("\n") +
        "\n}",
    ),
    '/* Add className="dixy-custom-theme" to the exported Theme when using these CSS overrides. */',
  ].join("\n\n");
}

/** A custom document is independent of its optional starter identity. */
export function presetFromDocument(
  document: ThemeDocument,
  starter = "none",
): ThemePreset {
  if (starter !== "none" && !skinDefinitions[starter])
    throw new Error("This starter is not installed.");
  const { componentFinish, ...foundations } = document.foundations;
  return {
    ...defaultThemePreset,
    ...foundations,
    skin: starter,
    document,
    material: componentFinish,
    shape: "inherit",
  };
}
export function editableThemeDocument(preset: ThemePreset): ThemeDocument {
  const source =
    preset.document ??
    installedThemeDocuments[preset.skin] ??
    installedThemeDocuments["dixy/material-light"]!;
  const foundations = { ...source.foundations };
  for (const key of Object.keys(
    foundations,
  ) as (keyof ThemeDocument["foundations"])[]) {
    if (key === "componentFinish")
      foundations.componentFinish = preset.material;
    else if (key !== "material" && key !== "shape")
      Object.assign(foundations, { [key]: preset[key as keyof ThemePreset] });
  }
  if (preset.shape !== "inherit") foundations.shape = preset.shape;
  return parseThemeDocument({
    ...source,
    id: preset.document?.id ?? "custom/my-theme",
    name: preset.document?.name ?? "My theme",
    foundations,
    // Original Dixy borrows Material Light's paint only; it keeps a neutral character.
    character:
      preset.document?.character ??
      installedThemeDocuments[preset.skin]?.character ??
      defaultCharacter,
  });
}

type CharacterGroup = "motion" | "type" | "details" | "backdrop" | "chrome";
/** Edit one character field. Top-level keys take a string; grouped keys take [group, key]. */
export function changeThemeCharacter(
  preset: ThemePreset,
  key: "controls" | "states" | readonly [CharacterGroup, string],
  value: string | number,
): ThemePreset {
  const document = editableThemeDocument(preset);
  const character: Record<string, unknown> = { ...document.character };
  if (typeof key === "string") character[key] = value;
  else
    character[key[0]] = {
      ...(document.character[key[0]] as object),
      [key[1]]: value,
    };
  return {
    ...preset,
    document: parseThemeDocument({ ...document, character }),
  };
}

/** Reset character to a starter's authored character (or neutral). */
export function applyStarterCharacter(
  preset: ThemePreset,
  starter: string,
): ThemePreset {
  const document = editableThemeDocument(preset);
  const character: ThemeCharacter =
    installedThemeDocuments[starter]?.character ?? defaultCharacter;
  return {
    ...preset,
    document: parseThemeDocument({ ...document, character }),
  };
}

// sRGB helpers mirror the compiled CSS `color-mix(in srgb, …)` so the guard measures what renders.
type Rgb = readonly [number, number, number];
const encode = (c: number) => {
  const v = Math.max(0, Math.min(1, c));
  return v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
};
const decode = (c: number) =>
  c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
const fromOklch = (color: Oklch): Rgb =>
  oklchToLinearSrgb(color).map(encode) as unknown as Rgb;
const fromHex = (hex: string): Rgb =>
  [1, 3, 5].map(
    (i) => parseInt(hex.slice(i, i + 2), 16) / 255,
  ) as unknown as Rgb;
const mixRgb = (a: Rgb, amount: number, b: Rgb): Rgb =>
  a.map((v, i) => v * amount + b[i]! * (1 - amount)) as unknown as Rgb;
const luminance = (c: Rgb) =>
  0.2126 * decode(c[0]) + 0.7152 * decode(c[1]) + 0.0722 * decode(c[2]);
const ratio = (a: Rgb, b: Rgb) => {
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

/**
 * Lowest contrast across both appearances for primary text on the material-tinted
 * card surface and on the chrome well's own ground (target 4.5:1), and the solid
 * accent button against both (target 3:1). `well` is the largest luminance step
 * between the card surface and the well inside it: a near-black display on a pale
 * card reads as a hole in the page, so shuffle keeps it under `wellStep`.
 * Accent button text is already guaranteed 4.5:1 by actionColors, which throws otherwise.
 */
export function themeContrast(
  preset: ThemePreset,
  appearances: readonly ("light" | "dark")[] = ["light", "dark"],
): {
  text: number;
  action: number;
  well: number;
} {
  const document = editableThemeDocument(preset);
  const recipe = materialRecipes[document.recipes.material.id];
  const paint = document.recipes.material.parameters;
  const neutral = colorPalettes[preset.neutralColor];
  const accent = presetPalette(preset);
  const ground = wellGrounds[document.character.chrome.well];
  let text = Infinity;
  let action = Infinity;
  let well = 1;
  for (const appearance of appearances) {
    const base = neutral[appearance];
    const raised =
      appearance === "light" ? ([1, 1, 1] as Rgb) : fromOklch(base[3]);
    const [surfaceTint, inkTint] =
      appearance === "light"
        ? [recipe.tint[0]!, recipe.tint[1]!]
        : [recipe.tint[1]!, recipe.tint[0]!];
    const mix =
      appearance === "light" ? paint.surfaceMix : paint.darkSurfaceMix;
    const surface = mixRgb(raised, mix / 100, fromHex(surfaceTint));
    const ink = mixRgb(
      fromOklch(base[12]),
      1 - paint.inkTint,
      fromHex(inkTint),
    );
    const colors = actionColors(accent[appearance], appearance);
    const button = fromOklch(colors.background);
    // The well's ground and the ink it sets, mirroring chrome.ts wellCSS.
    const [wellGround, wellInk] =
      ground.kind === "fixed"
        ? [
            fromHex(ground.color),
            mixRgb(button, ground.inkAccent / 100, [1, 1, 1]),
          ]
        : ground.kind === "canvas"
          ? [fromOklch(base[1]), ink]
          : [surface, ink];
    text = Math.min(text, ratio(ink, surface), ratio(wellInk, wellGround));
    action = Math.min(
      action,
      ratio(button, surface),
      ratio(button, wellGround),
    );
    well = Math.max(well, ratio(surface, wellGround));
  }
  return { text, action, well };
}
/** `wellStep` bounds the surface-to-well luminance ratio; canvas wells sit near 1.1, a dark LCD on paper near 18. */
export const shuffleContrastTargets = {
  text: 4.5,
  action: 3,
  wellStep: 3,
} as const;
const readable = (preset: ThemePreset) => {
  try {
    const result = themeContrast(preset);
    return (
      result.text >= shuffleContrastTargets.text &&
      result.action >= shuffleContrastTargets.action &&
      result.well <= shuffleContrastTargets.wellStep
    );
  } catch {
    return false;
  }
};

/**
 * For the inspector: when the chosen well's ground jumps far from the card in either
 * appearance, say where and offer the appearance-following substitute. Advisory only;
 * the author may keep the clash on purpose.
 */
export function wellClash(preset: ThemePreset): {
  appearance: "light" | "dark";
  step: number;
  tone: "light" | "dark";
  substitute: string;
} | null {
  const ground =
    wellGrounds[editableThemeDocument(preset).character.chrome.well];
  if (ground.kind !== "fixed") return null;
  for (const appearance of ["light", "dark"] as const) {
    const step = themeContrast(preset, [appearance]).well;
    if (step > shuffleContrastTargets.wellStep)
      return {
        appearance,
        step,
        tone: ground.tone,
        substitute: ground.substitute,
      };
  }
  return null;
}

/**
 * A theme ships both appearances, so a well with a fixed ground (the dark LCD) clashes
 * with whichever appearance it does not belong to. Shuffle keeps the starter's
 * character and swaps that well for its appearance-following substitute.
 */
export function adaptWellForShuffle(preset: ThemePreset): ThemePreset {
  const document = editableThemeDocument(preset);
  const ground = wellGrounds[document.character.chrome.well];
  if (ground.kind !== "fixed") return preset;
  if (themeContrast(preset).well <= shuffleContrastTargets.wellStep)
    return preset;
  return changeThemeCharacter(preset, ["chrome", "well"], ground.substitute);
}

/**
 * Deterministic shuffle that only returns readable themes. It retries with derived
 * seeds, then falls back to untinted text and a known-safe accent.
 */
export function shuffleTheme(preset: ThemePreset, seed: number): ThemePreset {
  let candidate = shuffleOnce(preset, seed);
  for (let attempt = 1; attempt < 48 && !readable(candidate); attempt++)
    candidate = shuffleOnce(preset, (seed + attempt * 0x9e3779b1) >>> 0);
  if (readable(candidate)) return candidate;
  let safe = changeThemeParameter(candidate, "material", "inkTint", 0);
  for (const accentColor of ["blue", "purple", "jade", "orange"] as const) {
    const next = { ...safe, accentColor };
    if (readable(next))
      return { ...next, document: editableThemeDocument(next) };
  }
  return { ...safe, document: editableThemeDocument(safe) };
}

function shuffleOnce(preset: ThemePreset, seed: number): ThemePreset {
  let state = seed >>> 0 || 1;
  const random = () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4294967296;
  };
  const pick = <T>(values: readonly T[]) =>
    values[Math.floor(random() * values.length)]!;
  const starters = Object.values(installedThemeDocuments);
  let next = mixThemeRecipe(
    preset,
    "material",
    pick(Object.keys(materialRecipes)),
  );
  next = mixThemeRecipe(next, "frame", pick(Object.keys(frameRecipes)));
  next = applyStarterCharacter(next, pick(starters).id);
  next = changeThemeCharacter(
    next,
    ["motion", "style"],
    pick(starters).character.motion.style,
  );
  next = changeThemeCharacter(
    next,
    ["backdrop", "pattern"],
    pick(starters).character.backdrop.pattern,
  );
  const fonts = pick(starters).foundations;
  next = {
    ...next,
    customAccent: false,
    accentColor: pick(colorFamilies),
    neutralColor: pick(neutralColorFamilies),
    headingFont: fonts.headingFont,
    bodyFont: fonts.bodyFont,
  };
  if (next.document && isOrganicFrameId(next.document.recipes.frame.id))
    next = changeThemeOrnament(next, "seed", 1 + Math.floor(random() * 9998));
  next = adaptWellForShuffle({ ...next, document: editableThemeDocument(next) });
  return { ...next, document: editableThemeDocument(next) };
}
// The theme package owns which frames are canvas-painted; new frames need no docs change.
const isOrganicFrameId = (id: string) => isOrganicFrame(id);
export function mixThemeRecipe(
  preset: ThemePreset,
  kind: "material" | "frame",
  id: string,
): ThemePreset {
  const document = editableThemeDocument(preset);
  const recipes = { ...document.recipes };
  let foundations = { ...document.foundations };
  if (kind === "material") {
    if (!Object.hasOwn(materialRecipes, id))
      throw new Error("Unknown material.");
    recipes.material = {
      ...recipes.material,
      id: id as ThemeDocument["recipes"]["material"]["id"],
    };
    foundations.componentFinish = "inherit";
    foundations.material =
      materialRecipes[id as keyof typeof materialRecipes].baseMaterial;
  } else {
    if (!Object.hasOwn(frameRecipes, id)) throw new Error("Unknown frame.");
    recipes.frame = {
      ...recipes.frame,
      id: id as ThemeDocument["recipes"]["frame"]["id"],
      parameters: frameRecipes[id as keyof typeof frameRecipes].defaults,
      ornament: defaultOrganicOrnament(id),
    };
  }
  return {
    ...preset,
    document: parseThemeDocument({ ...document, foundations, recipes }),
    material: kind === "material" ? "inherit" : preset.material,
  };
}
export function changeThemeParameter(
  preset: ThemePreset,
  kind: "material" | "frame",
  key: string,
  value: number,
): ThemePreset {
  const document = editableThemeDocument(preset);
  return {
    ...preset,
    document: parseThemeDocument({
      ...document,
      recipes: {
        ...document.recipes,
        [kind]: {
          ...document.recipes[kind],
          parameters: { ...document.recipes[kind].parameters, [key]: value },
        },
      },
    }),
  };
}
export function changeThemeOrnament(
  preset: ThemePreset,
  key: string,
  value: string | number,
): ThemePreset {
  const document = editableThemeDocument(preset);
  return {
    ...preset,
    document: parseThemeDocument({
      ...document,
      recipes: {
        ...document.recipes,
        frame: {
          ...document.recipes.frame,
          ornament: { ...document.recipes.frame.ornament, [key]: value },
        },
      },
    }),
  };
}
export function exportThemeDocument(preset: ThemePreset): string {
  return JSON.stringify(editableThemeDocument(preset), null, 2);
}
function customThemeCSSCode(preset: ThemePreset): string {
  const document = editableThemeDocument(preset);
  const css = compilePlaygroundDocument(document).css;
  return (
    "/* Import alongside @dixy-ui/react/styles.css. No authoring runtime is required. */\n" +
    css +
    (["light", "dark"] as const)
      .map(
        (appearance) =>
          `\n.dixy-theme[data-dixy-skin="${document.id}"][data-appearance="${appearance}"] {\n${Object.entries(
            playgroundThemeProps(preset, appearance).style ?? {},
          )
            .map(
              ([key, value]) =>
                `  ${key === "fontFamily" ? "font-family" : key}: ${value};`,
            )
            .join("\n")}\n}`,
      )
      .join("\n")
  );
}
function customThemeReactCode(preset: ThemePreset): string {
  const document = editableThemeDocument(preset),
    compiled = compilePlaygroundDocument(document);
  const { skin, ornamentRenderer, style, appearance, ...settings } =
    playgroundThemeProps(preset);
  const styles = {
    light: playgroundThemeProps(preset, "light").style,
    dark: playgroundThemeProps(preset, "dark").style,
  };
  const fonts = new Set([preset.bodyFont, preset.headingFont]);
  return [
    'import type { CSSProperties, ReactNode } from "react";',
    'import { Theme, type ThemeProps } from "@dixy-ui/react";',
    ...(compiled.renderer
      ? [
          `import { ${compiled.renderer.symbol} } from "${compiled.renderer.entry}";`,
        ]
      : []),
    'import "@dixy-ui/react/styles.css";',
    'import "./dixy-theme.css";',
    ...(preset.material !== "inherit"
      ? ['import "@dixy-ui/react/materials.css";']
      : []),
    ...[...fonts]
      .map((font) => themeFontPackages[font as keyof typeof themeFontPackages])
      .filter(Boolean)
      .map((pkg) => 'import "' + pkg + '";'),
    `const skin = ${JSON.stringify(compiled.definition, null, 2)} as const;`,
    `const settings = ${JSON.stringify(settings, null, 2)} satisfies ThemeProps;`,
    `const styles = ${JSON.stringify(styles, null, 2)};`,
    `export function DixyTheme({children,appearance=${JSON.stringify(preset.appearance)}}:{children:ReactNode;appearance?:"light"|"dark"}) {`,
    `  return <Theme {...settings} skin={skin} ornamentRenderer={${compiled.renderer?.symbol ?? "null"}} appearance={appearance} style={styles[appearance] as CSSProperties}>{children}</Theme>;`,
    "}",
    "// Save the Full theme CSS export as dixy-theme.css beside this file.",
  ].join("\n");
}
