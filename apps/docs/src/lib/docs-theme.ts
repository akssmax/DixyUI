import { skinCatalog } from "@dixy-ui/themes/catalog";

/**
 * The theme a reader applies to the documentation. "none" is Original Dixy.
 * `scope` decides whether the skin restyles the docs chrome too, or only the
 * live component previews (useful for skins that trade readability for character).
 */
export interface DocsThemeSettings {
  skin: string;
  scope: "all" | "previews";
}

export const docsThemeCookie = "dixy-docs-theme";
export const defaultDocsTheme: Readonly<DocsThemeSettings> = Object.freeze({
  skin: "none",
  scope: "all",
});

export function isInstalledSkin(id: unknown): id is string {
  return (
    id === "none" ||
    (typeof id === "string" && skinCatalog.some((skin) => skin.id === id))
  );
}

export function parseDocsTheme(input?: string): DocsThemeSettings {
  try {
    if (!input || input.length > 256) return { ...defaultDocsTheme };
    const value = JSON.parse(input);
    if (!value || Array.isArray(value) || value.version !== 1)
      return { ...defaultDocsTheme };
    return {
      skin: isInstalledSkin(value.skin) ? value.skin : defaultDocsTheme.skin,
      scope: value.scope === "previews" ? "previews" : "all",
    };
  } catch {
    return { ...defaultDocsTheme };
  }
}

export function serializeDocsTheme(settings: DocsThemeSettings): string {
  return JSON.stringify({ version: 1, ...settings });
}
