import {
  canopyShapes,
  stemCharacters,
  organicFrameRecipes,
  isOrganicFrame,
} from "./organic-settings.ts";
import type { ThemeDocument } from "./theme-schema.ts";

/** Portable numeric CSS controls; the optional renderer never executes imported data. */
export function organicOrnamentVariables(
  frame: string,
  settings: ThemeDocument["recipes"]["frame"]["ornament"],
): Record<string, string> {
  if (!isOrganicFrame(frame)) return {};
  const recipe = organicFrameRecipes[frame];
  const variables: Record<string, string> = {};
  for (const key of [
    "density",
    "cornerDensity",
    "canopyDepth",
    "variation",
    "scale",
    "stemWeight",
    "motion",
    "seed",
  ] as const)
    variables[`--dixy-organic-${key}`] = String(settings[key]);
  variables["--dixy-organic-style"] = String(
    Math.max(0, (recipe.styles as readonly string[]).indexOf(settings.style)),
  );
  variables["--dixy-organic-canopy"] = String(
    canopyShapes.indexOf(settings.canopy),
  );
  variables["--dixy-organic-stem"] = String(
    stemCharacters.indexOf(settings.stem),
  );
  return variables;
}
