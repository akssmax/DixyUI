import {
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { AppAppearanceContext } from "./app-appearance-context";
import {
  appAppearanceCookie,
  systemAppearanceCookie,
  type AppAppearance,
  type AppearancePreference,
} from "../lib/app-appearance";
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

const darkQuery = "(prefers-color-scheme: dark)";

export function AppAppearanceProvider({
  initialAppearancePreference,
  initialAppearance,
  initialPreviewTheme,
  initialDocsTheme,
  children,
}: {
  initialAppearancePreference: AppearancePreference;
  initialAppearance: AppAppearance;
  initialPreviewTheme: PreviewThemeSettings;
  initialDocsTheme: DocsThemeSettings;
  children: ReactNode;
}) {
  // The server resolves the same initial values for SSR and hydration.
  const [appearancePreference, updatePreference] = useState(
    initialAppearancePreference,
  );
  const [appearance, updateAppearance] = useState(initialAppearance);
  const [previewTheme, updateTheme] = useState(initialPreviewTheme);

  // Track the OS scheme: remember it for the server's next render, and follow
  // it live while the reader's choice is "system".
  useEffect(() => {
    const media = matchMedia(darkQuery);
    const sync = () => {
      const system: AppAppearance = media.matches ? "dark" : "light";
      saveCookie(systemAppearanceCookie, system);
      if (appearancePreference === "system") updateAppearance(system);
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [appearancePreference]);

  const setAppearancePreference = useCallback(
    (next: AppearancePreference) => {
      updatePreference(next);
      updateAppearance(
        next !== "system"
          ? next
          : matchMedia(darkQuery).matches
            ? "dark"
            : "light",
      );
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
  // Light/dark toggles pick an explicit appearance, leaving "system".
  const setAppearance: (appearance: AppAppearance) => void =
    setAppearancePreference;
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
        appearancePreference,
        setAppearancePreference,
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
