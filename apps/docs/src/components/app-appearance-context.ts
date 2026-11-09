import { createContext } from "react";
import type { AppAppearance } from "../lib/app-appearance";
import type { PreviewThemeSettings } from "../lib/preview-theme";
import type { DocsThemeSettings } from "../lib/docs-theme";

/*
 * The context object lives alone, with type-only imports, so Vite never
 * re-executes it when a package dist rebuilds. If it sat beside the provider
 * (which imports @dixy-ui/tokens at runtime), a hot update would create a new
 * context while the mounted root still provided the old one, and every
 * consumer would throw "requires its root provider" until a full reload.
 */
export const AppAppearanceContext = createContext<{
  appearance: AppAppearance;
  setAppearance: (appearance: AppAppearance) => void;
  previewTheme: PreviewThemeSettings;
  setPreviewTheme: (patch: Partial<PreviewThemeSettings>) => void;
  resetPreviewTheme: () => void;
  docsTheme: DocsThemeSettings;
  setDocsTheme: (patch: Partial<DocsThemeSettings>) => void;
} | null>(null);
