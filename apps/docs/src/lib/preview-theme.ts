import {
  colorFamilies,
  neutralColorFamilies,
  radiusPresets,
  spacingDensity,
  colorThemePersonalities,
  type AccentColor,
  type NeutralColor,
  type RadiusPreset,
  type Density,
  type MotionPreference,
} from "@dixy-ui/tokens";
import type { AppAppearance } from "./app-appearance";

export interface PreviewThemeSettings {
  appearance: AppAppearance | null;
  accentColor: AccentColor;
  neutralColor: NeutralColor;
  radius: RadiusPreset;
  density: Density;
  motion: MotionPreference;
  dir: "ltr" | "rtl";
  personality: keyof typeof colorThemePersonalities | "custom";
}

export const previewThemeCookie = "dixy-preview-theme";
export const defaultPreviewTheme: Readonly<PreviewThemeSettings> =
  Object.freeze({
    appearance: null,
    accentColor: "purple",
    neutralColor: "neutral",
    radius: "md",
    density: "default",
    motion: "system",
    dir: "ltr",
    personality: "custom",
  });

function choice<T extends string>(
  value: unknown,
  values: readonly T[],
  fallback: T,
): T {
  return typeof value === "string" && values.includes(value as T)
    ? (value as T)
    : fallback;
}

export function parsePreviewTheme(input?: string): PreviewThemeSettings {
  try {
    if (!input || input.length > 2048) return { ...defaultPreviewTheme };
    const value = JSON.parse(input);
    if (!value || Array.isArray(value) || value.version !== 1)
      return { ...defaultPreviewTheme };
    const settings: PreviewThemeSettings = {
      appearance:
        value.appearance === "light" || value.appearance === "dark"
          ? value.appearance
          : null,
      accentColor: choice(
        value.accentColor,
        colorFamilies,
        defaultPreviewTheme.accentColor,
      ),
      neutralColor: choice(
        value.neutralColor,
        neutralColorFamilies,
        defaultPreviewTheme.neutralColor,
      ),
      radius: choice(
        value.radius,
        Object.keys(radiusPresets) as RadiusPreset[],
        defaultPreviewTheme.radius,
      ),
      density: choice(
        value.density,
        Object.keys(spacingDensity) as Density[],
        defaultPreviewTheme.density,
      ),
      motion: choice(
        value.motion,
        ["system", "reduced"],
        defaultPreviewTheme.motion,
      ),
      dir: choice(value.dir, ["ltr", "rtl"], defaultPreviewTheme.dir),
      personality: choice(
        value.personality,
        ["custom", "minimal", "expressive", "nostalgic"],
        "custom",
      ),
    };
    if (settings.personality !== "custom") {
      const personality = colorThemePersonalities[settings.personality];
      if (
        personality.accentColor !== settings.accentColor ||
        personality.neutralColor !== settings.neutralColor
      )
        settings.personality = "custom";
    }
    return settings;
  } catch {
    return { ...defaultPreviewTheme };
  }
}

export function serializePreviewTheme(settings: PreviewThemeSettings): string {
  return JSON.stringify({ version: 1, ...settings });
}

export function updatePreviewTheme(
  current: PreviewThemeSettings,
  patch: Partial<PreviewThemeSettings>,
): PreviewThemeSettings {
  const next = { ...current, ...patch };
  if (
    (patch.accentColor !== undefined || patch.neutralColor !== undefined) &&
    patch.personality === undefined
  )
    next.personality = "custom";
  return parsePreviewTheme(serializePreviewTheme(next));
}
