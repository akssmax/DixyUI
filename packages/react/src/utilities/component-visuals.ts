import type { Material, RadiusPreset } from "@dixy-ui/tokens";
import { useThemeSettings } from "../theme/theme";

/** Semantic colors shared by the family styles. warning and info map to the status tokens. */
export type VisualColor =
  "accent" | "neutral" | "danger" | "success" | "warning" | "info";

type VisualSettings = {
  size?: "sm" | "md" | "lg";
  variant?: string;
  color?: VisualColor;
  radius?: RadiusPreset;
  material?: Material;
};

/** Visual attributes only: primitive refs, events and render callbacks pass through. */
export function useComponentVisuals(
  settings: VisualSettings,
  defaults: VisualSettings = {},
) {
  const theme = useThemeSettings();
  return {
    "data-dixy-visual": "",
    "data-dixy-skin": theme.skin?.id,
    "data-dixy-material-override":
      settings.material !== undefined ||
      defaults.material !== undefined ||
      theme.materialOverride
        ? ""
        : undefined,
    "data-size": settings.size ?? defaults.size ?? "md",
    "data-variant": settings.variant ?? defaults.variant ?? "outline",
    "data-color": settings.color ?? defaults.color ?? "accent",
    "data-radius": settings.radius ?? defaults.radius ?? theme.radius,
    "data-material": settings.material ?? defaults.material ?? theme.material,
  };
}
