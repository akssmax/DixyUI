import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ThemeProps } from "@dixy-ui/react";
import { useAppAppearance } from "./app-appearance-provider";
import {
  playgroundThemeProps,
  skinThemePreset,
} from "../lib/theme-playground";
import {
  deduplicateSkinStyles,
  prepareSkin,
} from "../lib/theme-skin-catalogue";
import {
  defaultPreviewTheme,
  type PreviewThemeSettings,
} from "../lib/preview-theme";
import type { AppAppearance } from "../lib/app-appearance";
import type { DocsThemeSettings } from "../lib/docs-theme";

/**
 * Theme props for the reader's docs theme. `skinProps` is null for Original
 * Dixy. `shellProps` is what the docs chrome uses: the skin when the scope is
 * "all", otherwise the plain Dixy root so only previews take on the skin.
 */
export function useDocsTheme() {
  const { appearance, docsTheme, setDocsTheme } = useAppAppearance();
  const [error, setError] = useState("");
  const { skin, scope } = docsTheme;
  const skinProps = useMemo<ThemeProps | null>(() => {
    if (skin === "none") return null;
    try {
      return playgroundThemeProps({ ...skinThemePreset(skin), appearance });
    } catch {
      return null;
    }
  }, [skin, appearance]);
  useEffect(() => {
    if (skin === "none") return;
    setError("");
    // Covers a failed server load, and removes the duplicate style the root
    // head added once the client has injected the same skin.
    void prepareSkin(skin, null)
      .then(async () => {
        deduplicateSkinStyles(skin);
        if (skinThemePreset(skin).material !== "inherit")
          await import("@dixy-ui/react/materials.css");
      })
      .catch(() => setError("That theme could not load. Choose it again."));
  }, [skin]);
  // Load the new starter's stylesheet before committing it. Committing first
  // rendered the new data-dixy-skin with no matching CSS until the chunk
  // arrived: a frame (or a round trip) of half-styled docs and layout shift.
  const request = useRef(0);
  const selectDocsTheme = useCallback(
    (patch: Partial<DocsThemeSettings>) => {
      const generation = ++request.current;
      const next = patch.skin;
      if (!next || next === "none") return setDocsTheme(patch);
      setError("");
      void (async () => {
        await prepareSkin(next, null);
        if (skinThemePreset(next).material !== "inherit")
          await import("@dixy-ui/react/materials.css");
      })()
        .then(() => {
          if (request.current === generation) setDocsTheme(patch);
        })
        .catch(() => {
          if (request.current === generation)
            setError("That theme could not load. Choose it again.");
        });
    },
    [setDocsTheme],
  );
  const shellProps: ThemeProps = (scope === "all" && skinProps) || {
    appearance,
    accentColor: "purple",
  };
  return {
    docsTheme,
    setDocsTheme: selectDocsTheme,
    skinProps,
    shellProps,
    error,
  };
}

const previewKeys = [
  "accentColor",
  "neutralColor",
  "radius",
  "density",
  "motion",
  "dir",
] as const;

/**
 * Props for a live preview. With a docs theme, the skin is the base and only
 * the settings a reader deliberately changed in the preview panel override it,
 * so the default purple accent never paints over Ocean Depths' teal.
 */
export function previewThemeProps(
  settings: PreviewThemeSettings,
  appearance: AppAppearance,
  skinProps: ThemeProps | null,
): ThemeProps {
  if (!skinProps)
    return {
      appearance,
      accentColor: settings.accentColor,
      neutralColor: settings.neutralColor,
      radius: settings.radius,
      density: settings.density,
      motion: settings.motion,
      dir: settings.dir,
    };
  const overrides: Partial<ThemeProps> = {};
  for (const key of previewKeys)
    if (settings[key] !== defaultPreviewTheme[key])
      Object.assign(overrides, { [key]: settings[key] });
  return { ...skinProps, appearance, ...overrides };
}
