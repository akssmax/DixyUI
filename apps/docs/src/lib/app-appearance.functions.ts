import { createServerFn } from "@tanstack/react-start";
import {
  getCookie,
  getRequestHeader,
  setResponseHeader,
} from "@tanstack/react-start/server";
import {
  appAppearanceCookie,
  parseAppearance,
  parseAppearancePreference,
  systemAppearanceCookie,
  type AppAppearance,
} from "./app-appearance";
import { parsePreviewTheme, previewThemeCookie } from "./preview-theme";
import { docsThemeCookie, parseDocsTheme } from "./docs-theme";

const colorSchemeHint = "Sec-CH-Prefers-Color-Scheme";

export const getAppPreferences = createServerFn({ method: "GET" }).handler(
  () => {
    const appearancePreference = parseAppearancePreference(
      getCookie(appAppearanceCookie),
    );
    // Ask Chromium to send the OS color scheme. Critical-CH makes it retry a
    // first request that lacked the hint, so system-dark readers get a dark
    // first paint instead of a light flash.
    setResponseHeader("Accept-CH", colorSchemeHint);
    setResponseHeader("Critical-CH", colorSchemeHint);
    setResponseHeader("Vary", colorSchemeHint);
    const appearance: AppAppearance =
      appearancePreference !== "system"
        ? appearancePreference
        : (parseAppearance(getRequestHeader(colorSchemeHint)) ??
          parseAppearance(getCookie(systemAppearanceCookie)) ??
          "light");
    return {
      appearancePreference,
      appearance,
      previewTheme: parsePreviewTheme(getCookie(previewThemeCookie)),
      docsTheme: parseDocsTheme(getCookie(docsThemeCookie)),
    };
  },
);
