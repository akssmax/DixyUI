import { useCallback, useContext, useState, type ReactNode } from "react";
import { AppAppearanceContext } from "./app-appearance-context";
import { appAppearanceCookie, type AppAppearance } from "../lib/app-appearance";
import {
  defaultPreviewTheme,
  previewThemeCookie,
  serializePreviewTheme,
  updatePreviewTheme,
  type PreviewThemeSettings,
} from "../lib/preview-theme";
import {
  docsThemeCookie,
  serializeDocsTheme,
  type DocsThemeSettings,
} from "../lib/docs-theme";

function saveCookie(name: string, value: string) {
  try {
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
  } catch {
    // Settings still work for this visit if cookie access is blocked.
  }
}

export function AppAppearanceProvider({
  initialAppearance,
  initialPreviewTheme,
  initialDocsTheme,
  children,
}: {
  initialAppearance: AppAppearance;
  initialPreviewTheme: PreviewThemeSettings;
  initialDocsTheme: DocsThemeSettings;
  children: ReactNode;
}) {
  // The server cookie supplies the same initial value for SSR and hydration.
  const [appearance, updateAppearance] = useState(initialAppearance);
  const [previewTheme, updateTheme] = useState(initialPreviewTheme);
  const setAppearance = useCallback(
    (next: AppAppearance) => {
      updateAppearance(next);
      saveCookie(appAppearanceCookie, next);
      // An app theme change returns previews to following the app appearance.
      if (previewTheme.appearance !== null) {
        const followingApp = { ...previewTheme, appearance: null };
        updateTheme(followingApp);
        saveCookie(previewThemeCookie, serializePreviewTheme(followingApp));
      }
    },
    [previewTheme],
  );
  const setPreviewTheme = useCallback(
    (patch: Partial<PreviewThemeSettings>) => {
      const next = updatePreviewTheme(previewTheme, patch);
      updateTheme(next);
      saveCookie(previewThemeCookie, serializePreviewTheme(next));
    },
    [previewTheme],
  );
  const [docsTheme, updateDocsTheme] = useState(initialDocsTheme);
  const setDocsTheme = useCallback(
    (patch: Partial<DocsThemeSettings>) => {
      const next = { ...docsTheme, ...patch };
      updateDocsTheme(next);
      saveCookie(docsThemeCookie, serializeDocsTheme(next));
    },
    [docsTheme],
  );
  const resetPreviewTheme = useCallback(() => {
    updateTheme(defaultPreviewTheme);
    saveCookie(previewThemeCookie, serializePreviewTheme(defaultPreviewTheme));
  }, []);

  return (
    <AppAppearanceContext.Provider
      value={{
        appearance,
        setAppearance,
        previewTheme,
        setPreviewTheme,
        resetPreviewTheme,
        docsTheme,
        setDocsTheme,
      }}
    >
      {children}
    </AppAppearanceContext.Provider>
  );
}

export function useAppAppearance() {
  const context = useContext(AppAppearanceContext);
  if (!context) throw new Error("App appearance requires its root provider.");
  return context;
}

export function usePreviewTheme() {
  const { appearance, previewTheme, setPreviewTheme, resetPreviewTheme } =
    useAppAppearance();
  return {
    settings: previewTheme,
    appearance: previewTheme.appearance ?? appearance,
    setSettings: setPreviewTheme,
    resetSettings: resetPreviewTheme,
  };
}
