import {
  compilePlaygroundDocument,
  type ThemeDocument,
} from "./theme-authoring.ts";
import { skinCSSLoaders as loaders } from "./generated-skin-loaders.ts";
const pending = new Map<string, Promise<string>>();
/** Vite processes only the requested CSS module, including relative artwork URLs. */
export function loadSkinCSS(
  id: string,
  themeDocument?: ThemeDocument | null,
): Promise<string> {
  if (themeDocument)
    return Promise.resolve(compilePlaygroundDocument(themeDocument).css);
  if (id === "none") return Promise.resolve("");
  if (!loaders[id])
    return Promise.reject(new Error("This skin is not installed."));
  const cached = pending.get(id);
  if (cached) return cached;
  const result = loaders[id]()
    .then((m) => m.default)
    .catch((error) => {
      pending.delete(id);
      throw error;
    });
  pending.set(id, result);
  return result;
}
export async function loadMaterialCSS() {
  return (await import("@dixy-ui/react/materials.css?inline")).default;
}
export async function prepareSkin(
  id: string,
  themeDocument?: ThemeDocument | null,
): Promise<void> {
  const css = await loadSkinCSS(id, themeDocument);
  const styleId = themeDocument?.id ?? id;
  const current = document.querySelector<HTMLStyleElement>(
    `style[data-dixy-skin-style="${styleId}"]`,
  );
  if (current) {
    if (themeDocument && current.textContent !== css) current.textContent = css;
    trimCustomStyles(styleId);
    return;
  }
  if (!css) return;
  const style = document.createElement("style");
  style.dataset.dixySkinStyle = styleId;
  style.textContent = css;
  document.head.append(style);
  trimCustomStyles(styleId);
}
/** Keep only eight inactive/active authored styles; installed packs are a finite registry. */
function trimCustomStyles(activeId?: string) {
  const styles = [
    ...document.querySelectorAll<HTMLStyleElement>(
      "style[data-dixy-skin-style]",
    ),
  ].filter((style) => !loaders[style.dataset.dixySkinStyle!]);
  let remaining = styles.length;
  for (const style of styles) {
    if (remaining <= 8) break;
    if (style.dataset.dixySkinStyle !== activeId) {
      style.remove();
      remaining--;
    }
  }
}
export function deduplicateSkinStyles(activeId?: string) {
  const seen = new Set<string>();
  for (const style of [
    ...document.querySelectorAll<HTMLStyleElement>(
      "style[data-dixy-skin-style]",
    ),
  ].reverse()) {
    const id = style.dataset.dixySkinStyle!;
    if (seen.has(id)) style.remove();
    else seen.add(id);
  }
  trimCustomStyles(activeId);
}
