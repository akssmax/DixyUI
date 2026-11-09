/*
 * Search-param ids the routes validate. They live here, not beside the
 * components that render them, because a route's validateSearch is not code
 * split: importing these from the playground or the Fernpay app pulled those
 * whole modules (and dialkit and motion) into the entry chunk of every page.
 */

/** Preview scenes in the playground's tab bar. */
export const previewSceneIds = [
  "workspace",
  "library",
  "email",
  "dashboard",
  "player",
  "states",
  "compare",
  "tokens",
] as const;
export type PreviewSceneId = (typeof previewSceneIds)[number];
export const defaultPreviewScene: PreviewSceneId = "workspace";

/** Playground inspector tabs. */
export const inspectorTabIds = [
  "theme",
  "style",
  "character",
  "export",
] as const;
export type InspectorTabId = (typeof inspectorTabIds)[number];
export const defaultInspectorTab: InspectorTabId = "theme";

/** Fernpay example views. */
export const fernpayViewIds = [
  "overview",
  "transactions",
  "cards",
  "settings",
] as const;
export type FernpayViewId = (typeof fernpayViewIds)[number];

export function isOneOf<T extends string>(
  ids: readonly T[],
  value: unknown,
): value is T {
  return (
    typeof value === "string" && (ids as readonly string[]).includes(value)
  );
}
