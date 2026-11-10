import { frameRecipes, materialRecipes } from "./recipes.ts";
import type { FrameRecipeId } from "./recipes.ts";
import type { ThemeDocument, ThemeFoundations } from "./theme-schema.ts";
import type { ThemeCharacter } from "./character.ts";

export interface ResolvedThemeRecipe {
  id: string;
  slug: string;
  frame: FrameRecipeId;
  material: keyof typeof materialRecipes;
  grain: string;
  thumb: string;
  tintActions: boolean;
  sheen: number;
  cushion: number;
  inkTint: number;
  textureScale: number;
  lightAngle: number;
  backdropBlur: number;
  backdropSaturate: number;
  finish: string;
  edge: string;
  darkEdge: string;
  shadow: string;
  inset: string;
  canvas: string;
  /** Optional ground image for dark appearance; light canvas is used when absent. */
  darkCanvas?: string;
  /** Optional shadow and inset for dark appearance; light values are used when absent. */
  darkShadow?: string;
  darkInset?: string;
  /**
   * With the neutral accent, solid actions use ink (step 12) instead of the
   * mid-grey step 9: black in light, white in dark. Focus stays blue so it
   * still reads as focus. Any other accent ignores it.
   */
  monoAccent?: boolean;
  /**
   * Light mode only: solid actions use the accent's step 11 (12 on hover and
   * press) so white labels reach 7:1 (WCAG AAA) instead of step 9's ~5:1.
   */
  deepSolid?: boolean;
  /** Optional control heights [sm, md, lg]; e.g. 44px md for large touch targets. */
  controlHeights?: readonly [string, string, string];
  tint: readonly string[];
  parameters: ThemeDocument["recipes"]["frame"]["parameters"];
  ornament: ThemeDocument["recipes"]["frame"]["ornament"];
  surfaceMix: number;
  darkSurfaceMix: number;
  foundations: ThemeFoundations;
  character: ThemeCharacter;
}
export function resolveThemeRecipe(
  document: ThemeDocument,
): ResolvedThemeRecipe {
  return {
    ...materialRecipes[document.recipes.material.id],
    ...document.recipes.material.parameters,
    id: document.id,
    slug: document.id.split("/")[1],
    frame: document.recipes.frame.id,
    material: document.recipes.material.id,
    parameters: document.recipes.frame.parameters,
    ornament: document.recipes.frame.ornament,
    foundations: document.foundations,
    character: document.character,
  };
}
export function themeRenderer(document: ThemeDocument) {
  const recipe = frameRecipes[document.recipes.frame.id];
  if (!recipe.rendererEntry) return null;
  return Object.freeze({
    symbol: recipe.renderer,
    entry: `@dixy-ui/themes/${recipe.rendererEntry}`,
  });
}
