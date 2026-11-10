import {
  organicStyles,
  canopyShapes,
  stemCharacters,
  defaultOrganicOrnament,
} from "./organic-settings.ts";
import {
  colorFamilies,
  neutralColorFamilies,
  radiusPresets,
  spacingDensity,
} from "@dixy-ui/tokens";
import { freezeData } from "./freeze.ts";
import {
  backdropPatterns,
  controlStyles,
  defaultCharacter,
  dividerStyles,
  focusStyles,
  headingCases,
  headingWeights,
  motionStyles,
  numeralStyles,
  scrollbarStyles,
  selectionStyles,
  stateStyles,
} from "./character.ts";
import {
  cornerStyles,
  defaultChrome,
  edgeStyles,
  titlebarStyles,
  wellStyles,
} from "./chrome.ts";
import { frameRecipes, materialRecipes } from "./recipes.ts";

type Schema = {
  readonly type?: "string" | "number" | "integer" | "object";
  readonly enum?: readonly (string | number | boolean)[];
  readonly properties?: Readonly<Record<string, Schema>>;
  readonly required?: readonly string[];
  readonly additionalProperties?: false;
  readonly minimum?: number;
  readonly maximum?: number;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly pattern?: string;
  readonly title?: string;
};
type Infer<S> = S extends { readonly enum: readonly (infer E)[] }
  ? E
  : S extends { readonly properties: infer P }
    ? { readonly [K in keyof P]: Infer<P[K]> }
    : S extends { readonly type: "number" | "integer" }
      ? number
      : string;
const choice = <const T extends readonly (string | number | boolean)[]>(
  values: T,
) => ({ enum: [...values] as unknown as T }) as const;
const keys = <T extends object>(value: T) =>
  Object.keys(value) as (keyof T & string)[];
const object = <const P extends Readonly<Record<string, Schema>>>(
  properties: P,
) =>
  ({
    type: "object",
    properties,
    required: Object.keys(properties),
    additionalProperties: false,
  }) as const;
const number = (title: string, minimum: number, maximum: number) =>
  ({ type: "number", title, minimum, maximum }) as const;

const fontKeys = [
  "inter",
  "grotesk",
  "system",
  "serif",
  "mono",
  "fraunces",
  "deco",
  "pixel",
  "techno",
  "rounded",
  "lcd",
  "plex",
  "archivo",
  "neon",
  "mincho",
  "gothic",
  "playfair",
  "caveat",
  "bricolage",
  "terminal",
  "jetbrains",
  "manrope",
  "figtree",
  "cormorant",
  "plexSans",
  "atkinson",
] as const;

/** This closed JSON Schema also supplies TypeScript types, validation and control metadata. */
export const themeDocumentSchema = freezeData({
  $schema: "https://json-schema.org/draft/2020-12/schema",
  ...object({
    schemaVersion: choice([6]),
    id: {
      type: "string",
      minLength: 3,
      maxLength: 100,
      pattern: "^[a-z][a-z0-9-]*/[a-z][a-z0-9-]*$",
    },
    name: { type: "string", minLength: 1, maxLength: 80, pattern: "\\S" },
    revision: { type: "integer", minimum: 1, maximum: 2147483647 },
    foundations: object({
      accentColor: choice(colorFamilies),
      customAccent: choice([false, true]),
      lightness: number("Accent lightness", 0.48, 0.83),
      chroma: number("Accent chroma", 0, 0.3),
      hue: number("Accent hue", 0, 360),
      neutralColor: choice(neutralColorFamilies),
      radius: choice(keys(radiusPresets)),
      density: choice(keys(spacingDensity)),
      material: choice(["matte", "glossy", "soft", "metal", "paper"]),
      componentFinish: choice([
        "inherit",
        "matte",
        "glossy",
        "soft",
        "metal",
        "paper",
      ]),
      shape: choice(["rounded", "pill", "square"]),
      appearance: choice(["light", "dark"]),
      bodyFont: choice(fontKeys),
      headingFont: choice(fontKeys),
      border: choice([1, 2]),
      depth: choice(["none", "raised", "floating"]),
      ornament: choice(["quiet", "balanced", "expressive"]),
      relief: choice([0, 1, 2]),
      effects: choice(["static", "backdrop", "reduced"]),
    }),
    recipes: object({
      material: object({
        id: choice(keys(materialRecipes)),
        version: choice([1]),
        parameters: object({
          surfaceMix: number("Light surface neutral mix", 0, 100),
          darkSurfaceMix: number("Dark surface neutral mix", 0, 100),
          sheen: number("Highlight strength", 0, 1),
          cushion: number("Cushion relief", 0, 1),
          inkTint: number("Text tint strength", 0, 1),
          textureScale: number("Grain scale", 0.5, 3),
          lightAngle: number("Light angle", 0, 360),
          backdropBlur: number("Glass blur (px)", 0, 40),
          backdropSaturate: number("Glass saturation (%)", 100, 200),
        }),
      }),
      frame: object({
        id: choice(keys(frameRecipes)),
        version: choice([1]),
        ornament: object({
          style: choice(organicStyles),
          canopy: choice(canopyShapes),
          stem: choice(stemCharacters),
          density: number("Detail density", 0, 100),
          cornerDensity: number("Corner clusters", 0, 100),
          canopyDepth: number("Canopy depth / relief", 0, 100),
          variation: number("Organic variation", 0, 100),
          scale: number("Detail size", 10, 32),
          stemWeight: number("Stem / rim weight", 0, 100),
          motion: number("Motion strength", 0, 100),
          seed: {
            type: "integer",
            title: "Variation seed",
            minimum: 1,
            maximum: 9999,
          },
        }),
        parameters: object({
          width: number("Decorative frame width", 0, 12),
          paddingTop: number("Panel top inset", 16, 64),
          paddingInline: number("Panel inline inset", 16, 64),
          paddingBottom: number("Panel bottom inset", 16, 64),
          inset: number("Scene frame inset", 0, 24),
          cornerVariation: number("Organic corner variation", 0, 0.5),
          cornerScale: number("Corner fullness", 0.5, 3),
        }),
      }),
    }),
    character: object({
      controls: choice(controlStyles),
      motion: object({
        style: choice(motionStyles),
        press: number("Press depth", 0, 4),
        tempo: number("Tempo", 0.5, 2),
      }),
      type: object({
        headingCase: choice(headingCases),
        headingTracking: number("Heading tracking", -0.05, 0.2),
        headingWeight: choice(headingWeights),
        numerals: choice(numeralStyles),
      }),
      states: choice(stateStyles),
      details: object({
        focus: choice(focusStyles),
        divider: choice(dividerStyles),
        selection: choice(selectionStyles),
        scrollbar: choice(scrollbarStyles),
        iconStroke: number("Icon stroke", 1, 2.75),
      }),
      backdrop: object({
        pattern: choice(backdropPatterns),
        intensity: number("Backdrop intensity", 0, 1),
        scale: number("Backdrop scale", 0.5, 3),
      }),
      chrome: object({
        titlebar: choice(titlebarStyles),
        edge: choice(edgeStyles),
        well: choice(wellStyles),
        corners: choice(cornerStyles),
      }),
    }),
  }),
} as const);

export type ThemeDocument = Infer<typeof themeDocumentSchema>;
export type ThemeFoundations = ThemeDocument["foundations"];
export interface ThemeDocumentIssue {
  path: string;
  message: string;
}
export class ThemeDocumentError extends Error {
  readonly issues: readonly ThemeDocumentIssue[];
  constructor(issues: readonly ThemeDocumentIssue[]) {
    super(issues.map((issue) => `${issue.path}: ${issue.message}`).join("\n"));
    this.name = "ThemeDocumentError";
    this.issues = issues;
  }
}

/** Deliberately validates only our engine-owned schema vocabulary; not a general JSON Schema evaluator. */
function validate(
  schema: Schema,
  value: unknown,
  path: string,
  issues: ThemeDocumentIssue[],
): unknown {
  const fail = (message: string) => {
    issues.push({ path, message });
    return undefined;
  };
  if (schema.enum)
    return schema.enum.includes(value as string | number | boolean)
      ? value
      : fail("Unsupported value.");
  if (schema.type === "object") {
    if (
      !value ||
      typeof value !== "object" ||
      Array.isArray(value) ||
      ![Object.prototype, null].includes(Object.getPrototypeOf(value))
    )
      return fail("Expected a plain data object.");
    const source = value as Record<string, unknown>;
    const properties = schema.properties!;
    const output: Record<string, unknown> = {};
    for (const key of Reflect.ownKeys(source)) {
      if (typeof key !== "string" || !Object.hasOwn(properties, key)) {
        issues.push({
          path: `${path}.${String(key)}`,
          message: "Unknown field.",
        });
        continue;
      }
      const descriptor = Object.getOwnPropertyDescriptor(source, key)!;
      if (!Object.hasOwn(descriptor, "value")) {
        issues.push({
          path: `${path}.${key}`,
          message: "Accessors are not theme data.",
        });
        continue;
      }
      output[key] = validate(
        properties[key],
        descriptor.value,
        `${path}.${key}`,
        issues,
      );
    }
    for (const key of schema.required!)
      if (!Object.hasOwn(source, key))
        issues.push({ path: `${path}.${key}`, message: "Required field." });
    return Object.freeze(output);
  }
  if (schema.type === "string") {
    if (
      typeof value !== "string" ||
      value.length < (schema.minLength ?? 0) ||
      value.length > (schema.maxLength ?? Infinity) ||
      (schema.pattern && !new RegExp(schema.pattern).test(value))
    )
      return fail("Invalid text.");
  } else if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < schema.minimum! ||
    value > schema.maximum! ||
    (schema.type === "integer" && !Number.isInteger(value))
  )
    return fail("Number is outside the supported range.");
  return value;
}

export function parseThemeDocument(input: unknown): ThemeDocument {
  let value = input;
  if (typeof input === "string") {
    if (input.length > 32768 || new TextEncoder().encode(input).length > 32768)
      throw new ThemeDocumentError([
        { path: "$", message: "Theme document exceeds 32 KiB." },
      ]);
    try {
      value = JSON.parse(input);
    } catch {
      throw new ThemeDocumentError([{ path: "$", message: "Invalid JSON." }]);
    }
  }
  // Version 1 had fixed material/frame pairs and fewer paint parameters.
  if (
    value &&
    typeof value === "object" &&
    Object.getOwnPropertyDescriptor(value, "schemaVersion")?.value === 1
  ) {
    const legacy = value as Record<string, unknown>;
    // Copy through JSON only after checking descriptors; no accessors/functions are executed.
    assertData(legacy);
    const migrated = JSON.parse(JSON.stringify(legacy));
    const pairs: Record<string, string> = {
      forest: "botanical-paper",
      pixel: "pixel-enamel",
      rails: "gunmetal",
      ceramic: "ceramic",
      glass: "prismatic-glass",
      stitch: "atelier-paper",
    };
    if (
      !pairs[migrated.recipes?.frame?.id] ||
      pairs[migrated.recipes.frame.id] !== migrated.recipes?.material?.id ||
      (migrated.recipes.frame.id !== "forest" &&
        migrated.recipes.frame.parameters?.cornerVariation !== 0)
    )
      throw new ThemeDocumentError([
        { path: "$.recipes", message: "Invalid version-1 recipe pair." },
      ]);
    for (const key of [
      "customAccent",
      "lightness",
      "chroma",
      "hue",
      "componentFinish",
    ])
      if (Object.hasOwn(migrated.foundations ?? {}, key))
        throw new ThemeDocumentError([
          { path: "$.foundations." + key, message: "Not a version-1 field." },
        ]);
    for (const key of [
      "sheen",
      "cushion",
      "inkTint",
      "textureScale",
      "lightAngle",
    ])
      if (Object.hasOwn(migrated.recipes?.material?.parameters ?? {}, key))
        throw new ThemeDocumentError([
          {
            path: "$.recipes.material.parameters." + key,
            message: "Not a version-1 field.",
          },
        ]);
    if (Object.hasOwn(migrated.recipes?.frame?.parameters ?? {}, "cornerScale"))
      throw new ThemeDocumentError([
        {
          path: "$.recipes.frame.parameters.cornerScale",
          message: "Not a version-1 field.",
        },
      ]);
    migrated.schemaVersion = 2;
    migrated.foundations = {
      ...migrated.foundations,
      componentFinish: "inherit",
      customAccent: false,
      lightness: 0.54,
      chroma: 0.2,
      hue: 305,
    };
    migrated.recipes.material.parameters = {
      ...migrated.recipes.material.parameters,
      sheen: 0.35,
      cushion: 0,
      inkTint: 0,
      textureScale: 1,
      lightAngle: 145,
    };
    migrated.recipes.frame.parameters.cornerScale = 1;
    value = migrated;
  }
  // V2 had geometry and paint, but no procedural ornament controls.
  if (
    value &&
    typeof value === "object" &&
    Object.getOwnPropertyDescriptor(value, "schemaVersion")?.value === 2
  ) {
    assertData(value);
    const migrated = JSON.parse(JSON.stringify(value));
    if (Object.hasOwn(migrated.recipes?.frame ?? {}, "ornament"))
      throw new ThemeDocumentError([
        { path: "$.recipes.frame.ornament", message: "Not a version-2 field." },
      ]);
    if (migrated.recipes?.frame)
      migrated.recipes.frame.ornament = defaultOrganicOrnament(
        migrated.recipes.frame.id,
      );
    migrated.schemaVersion = 3;
    value = migrated;
  }
  // V3 had paint and frames but no control/motion/type character; neutral character keeps its look.
  if (
    value &&
    typeof value === "object" &&
    Object.getOwnPropertyDescriptor(value, "schemaVersion")?.value === 3
  ) {
    assertData(value);
    const migrated = JSON.parse(JSON.stringify(value));
    if (Object.hasOwn(migrated, "character"))
      throw new ThemeDocumentError([
        { path: "$.character", message: "Not a version-3 field." },
      ]);
    // Version-4 character, without the version-5 chrome block.
    const { chrome: _chrome, ...v4Character } = defaultCharacter;
    migrated.character = JSON.parse(JSON.stringify(v4Character));
    migrated.schemaVersion = 4;
    value = migrated;
  }
  // V4 had character but no window chrome; no chrome compiles to no rules.
  if (
    value &&
    typeof value === "object" &&
    Object.getOwnPropertyDescriptor(value, "schemaVersion")?.value === 4
  ) {
    assertData(value);
    const migrated = JSON.parse(JSON.stringify(value));
    if (migrated.character && typeof migrated.character === "object") {
      if (Object.hasOwn(migrated.character, "chrome"))
        throw new ThemeDocumentError([
          { path: "$.character.chrome", message: "Not a version-4 field." },
        ]);
      migrated.character.chrome = { ...defaultChrome };
    }
    migrated.schemaVersion = 5;
    value = migrated;
  }
  // V5 materials had no backdrop glass; 0px blur and 100% saturation compile to no filter.
  if (
    value &&
    typeof value === "object" &&
    Object.getOwnPropertyDescriptor(value, "schemaVersion")?.value === 5
  ) {
    assertData(value);
    const migrated = JSON.parse(JSON.stringify(value));
    const parameters = migrated.recipes?.material?.parameters;
    if (parameters && typeof parameters === "object") {
      for (const key of ["backdropBlur", "backdropSaturate"])
        if (Object.hasOwn(parameters, key))
          throw new ThemeDocumentError([
            {
              path: "$.recipes.material.parameters." + key,
              message: "Not a version-5 field.",
            },
          ]);
      parameters.backdropBlur = 0;
      parameters.backdropSaturate = 100;
    }
    migrated.schemaVersion = 6;
    value = migrated;
  }
  const issues: ThemeDocumentIssue[] = [];
  const document = validate(
    themeDocumentSchema,
    value,
    "$",
    issues,
  ) as ThemeDocument;
  if (issues.length) throw new ThemeDocumentError(issues);
  return document;
}

function assertData(value: unknown, depth = 0): void {
  if (depth > 10)
    throw new ThemeDocumentError([
      { path: "$", message: "Theme data is too deeply nested." },
    ]);
  if (value && typeof value === "object") {
    if (
      ![Object.prototype, Array.prototype, null].includes(
        Object.getPrototypeOf(value),
      )
    )
      throw new ThemeDocumentError([
        { path: "$", message: "Expected plain data." },
      ]);
    for (const key of Reflect.ownKeys(value)) {
      const d = Object.getOwnPropertyDescriptor(value, key)!;
      if (
        !Object.hasOwn(d, "value") ||
        typeof d.value === "function" ||
        typeof key === "symbol"
      )
        throw new ThemeDocumentError([
          { path: "$", message: "Only plain data is supported." },
        ]);
      assertData(d.value, depth + 1);
    }
  }
}
