import {
  compileThemeDocument,
  parseThemeDocument,
  materialRecipes,
  frameRecipes,
  themeDocumentSchema,
  type ThemeDocument,
} from "@dixy-ui/themes/authoring";
import { themeDocuments } from "@dixy-ui/themes/documents";

export {
  compileThemeDocument,
  parseThemeDocument,
  materialRecipes,
  frameRecipes,
  themeDocumentSchema,
};
export type { ThemeDocument };
export const installedThemeDocuments: Readonly<Record<string, ThemeDocument>> =
  Object.fromEntries(themeDocuments.map((document) => [document.id, document]));

// Authoring-only cache: bounded, keyed by complete data, and never part of the core runtime.
const compiled = new Map<string, ReturnType<typeof compileThemeDocument>>();
export function compilePlaygroundDocument(document: ThemeDocument) {
  const key = JSON.stringify(document);
  const cached = compiled.get(key);
  if (cached) return cached;
  const result = compileThemeDocument(document);
  if (compiled.size >= 8) compiled.delete(compiled.keys().next().value!);
  compiled.set(key, result);
  return result;
}

/** IDs stay data: callers select an explicit, generated renderer map. */
export function renameTheme(
  document: ThemeDocument,
  name: string,
): ThemeDocument {
  const trimmed = name.trim();
  const slug =
    trimmed
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "my-theme";
  return parseThemeDocument({
    ...document,
    id: `custom/${/^[a-z]/.test(slug) ? slug : "theme-" + slug}`,
    name: trimmed,
    revision: document.revision + 1,
  });
}

export {
  organicFrameRecipes,
  canopyShapes,
  stemCharacters,
  isOrganicFrame,
} from "@dixy-ui/themes/authoring";
