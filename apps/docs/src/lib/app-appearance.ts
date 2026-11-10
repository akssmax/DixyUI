/** The resolved color appearance the UI renders in. */
export type AppAppearance = "light" | "dark";

/** What the reader chose. "system" follows the OS color scheme. */
export type AppearancePreference = "system" | AppAppearance;

/** Stores the reader's choice. A missing or unknown value means "system". */
export const appAppearanceCookie = "dixy-appearance";

/**
 * The OS color scheme the browser last reported. The server can't run
 * matchMedia, so with "system" it reads the Sec-CH-Prefers-Color-Scheme
 * client hint (Chromium) or falls back to this cookie (Safari, Firefox).
 */
export const systemAppearanceCookie = "dixy-system-appearance";

export function parseAppearancePreference(
  value: string | undefined | null,
): AppearancePreference {
  return value === "light" || value === "dark" ? value : "system";
}

export function parseAppearance(
  value: string | undefined | null,
): AppAppearance | null {
  return value === "light" || value === "dark" ? value : null;
}
