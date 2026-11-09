import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { appAppearanceCookie, type AppAppearance } from "./app-appearance";
import { parsePreviewTheme, previewThemeCookie } from "./preview-theme";
import { docsThemeCookie, parseDocsTheme } from "./docs-theme";

export const getAppPreferences = createServerFn({ method: "GET" }).handler(
  () => ({
    appearance: (getCookie(appAppearanceCookie) === "dark"
      ? "dark"
      : "light") as AppAppearance,
    previewTheme: parsePreviewTheme(getCookie(previewThemeCookie)),
    docsTheme: parseDocsTheme(getCookie(docsThemeCookie)),
  }),
);
