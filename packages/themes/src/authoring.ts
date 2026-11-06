import { organicOrnamentVariables } from "./organic-css.ts";
export { organicOrnamentVariables } from "./organic-css.ts";
import {
  colorFamilies,
  neutralColorFamilies,
  radiusPresets,
  spacingDensity,
} from "@dixy-ui/tokens";
import type { SkinDefinition } from "@dixy-ui/tokens";
import { compileThemeCSS } from "./compile-css.ts";
import { themeFoundationStyle } from "./foundations.ts";
import { parseThemeDocument } from "./theme-schema.ts";
import { resolveThemeRecipe, themeRenderer } from "./resolve.ts";

export {
  parseThemeDocument,
  themeDocumentSchema,
  ThemeDocumentError,
} from "./theme-schema.ts";
export type {
  ThemeDocument,
  ThemeFoundations,
  ThemeDocumentIssue,
} from "./theme-schema.ts";
export {
  organicFrameRecipes,
  canopyShapes,
  stemCharacters,
  defaultOrganicOrnament,
  isOrganicFrame,
} from "./organic-settings.ts";
export { frameRecipes, materialRecipes } from "./recipes.ts";
export {
  themeFoundationStyle,
  themeFonts,
  themeFontPackages,
} from "./foundations.ts";
export {
  backdropPatterns,
  characterLabels,
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
export type { ThemeCharacter } from "./character.ts";
export {
  titlebarStyles,
  edgeStyles,
  wellStyles,
  cornerStyles,
  defaultChrome,
  chromeLabels,
  wellGrounds,
} from "./chrome.ts";
export type {
  ThemeChrome,
  TitlebarStyle,
  EdgeStyle,
  WellStyle,
  CornerStyle,
  WellGround,
} from "./chrome.ts";

/** Build-time authoring API. Emits static CSS/settings; no compiler is needed to render the result. */
export function compileThemeDocument(input: unknown) {
  const document = parseThemeDocument(input);
  const f = document.foundations;
  const definition = defineSkin({
    id: document.id,
    name: document.name,
    version: 1,
    defaults: f,
  });
  const {
    appearance,
    accentColor,
    neutralColor,
    radius,
    density,
    shape,
    ornament,
    relief,
    effects,
  } = f;
  return Object.freeze({
    document,
    definition,
    css: compileThemeCSS(resolveThemeRecipe(document)),
    renderer: themeRenderer(document),
    themeProps: Object.freeze({
      skin: definition,
      ...(f.componentFinish === "inherit"
        ? {}
        : { material: f.componentFinish }),
      appearance,
      accentColor,
      neutralColor,
      radius,
      density,
      shape,
      ornament,
      relief,
      effects,
      style: {
        ...themeFoundationStyle(f),
        ...organicOrnamentVariables(
          document.recipes.frame.id,
          document.recipes.frame.ornament,
        ),
      },
    }),
  });
}

/** Validate portable metadata. Styles and artwork are separate, authored package assets. */
export function defineSkin(value: SkinDefinition): SkinDefinition {
  if (
    !value ||
    typeof value !== "object" ||
    value.version !== 1 ||
    !/^[a-z][a-z0-9-]*\/[a-z][a-z0-9-]*$/.test(value.id) ||
    typeof value.name !== "string" ||
    !value.name.trim() ||
    value.name.length > 80
  )
    throw new Error(
      "A skin needs version 1, a namespaced ID and a short name.",
    );
  const d = value.defaults;
  if (
    !d ||
    !colorFamilies.includes(d.accentColor) ||
    !neutralColorFamilies.includes(d.neutralColor) ||
    !Object.hasOwn(radiusPresets, d.radius) ||
    !Object.hasOwn(spacingDensity, d.density) ||
    !["matte", "glossy", "soft", "metal", "paper"].includes(d.material) ||
    !["rounded", "pill", "square"].includes(d.shape)
  )
    throw new Error("Unsupported skin foundations.");
  return Object.freeze({
    id: value.id,
    name: value.name,
    version: 1,
    defaults: Object.freeze({
      accentColor: d.accentColor,
      neutralColor: d.neutralColor,
      radius: d.radius,
      density: d.density,
      material: d.material,
      shape: d.shape,
    }),
  });
}
