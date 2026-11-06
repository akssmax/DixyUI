import { cssCornerRadius, roundedBorder } from "./organic-geometry.ts";
import {
  type OrganicPainter,
  type OrganicSettings,
  type OrganicPalette,
} from "./organic-paint.ts";
import {
  defaultOrganicOrnament,
  organicFrameRecipes,
  canopyShapes,
  stemCharacters,
  type OrganicFrame,
} from "./organic-settings.ts";

type PaintJob = (now: number) => boolean;
const jobs = new Set<PaintJob>();
let frame = 0;
function tick(now: number) {
  frame = 0;
  for (const job of [...jobs]) if (!job(now)) jobs.delete(job);
  if (jobs.size) frame = requestAnimationFrame(tick);
}
function schedule(job: PaintJob) {
  jobs.add(job);
  if (!frame) frame = requestAnimationFrame(tick);
}
function cancel(job: PaintJob) {
  jobs.delete(job);
  if (!jobs.size && frame) {
    cancelAnimationFrame(frame);
    frame = 0;
  }
}

// A single stylesheet observer invalidates all mounted frames, including exported CSS changes.
const styleListeners = new Set<() => void>();
let stylesheetObserver: MutationObserver | undefined;
function watchStyles(listener: () => void) {
  styleListeners.add(listener);
  if (!stylesheetObserver) {
    stylesheetObserver = new MutationObserver(() =>
      styleListeners.forEach((notify) => notify()),
    );
    stylesheetObserver.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }
  return () => {
    styleListeners.delete(listener);
    if (!styleListeners.size) {
      stylesheetObserver?.disconnect();
      stylesheetObserver = undefined;
    }
  };
}

/** Mount only after hydration. Every observer, listener and queued paint is released on disposal. */
export function mountOrganicCanvas(
  canvas: HTMLCanvasElement,
  kind: OrganicFrame,
  painter: OrganicPainter,
  instance: number,
  animate: boolean,
  motion: string,
) {
  const host = canvas.parentElement,
    surface = host?.parentElement;
  const ctx = canvas.getContext("2d");
  if (!host || !surface || !ctx) return () => {};
  const defaults = defaultOrganicOrnament(kind);
  let settings: OrganicSettings = defaults;
  let colors: OrganicPalette;
  let width = 0,
    height = 0,
    dpr = 1;
  let path = roundedBorder(
    1,
    1,
    Array.from({ length: 4 }, () => ({ x: 0, y: 0 })),
  );
  let limits = { top: 24, inline: 24, bottom: 24 };
  let shown: number = defaults.density;
  let initialized = false,
    visible = true,
    dirty = true,
    disposed = false;
  let clock = 0,
    lastPaint = 0;
  const deadline = performance.now() + 20000;
  const preferences = [
    "(prefers-reduced-motion: reduce)",
    "(prefers-reduced-transparency: reduce)",
    "(prefers-contrast: more)",
    "(forced-colors: active)",
  ].map((query) => matchMedia(query));
  const numeric = (
    style: CSSStyleDeclaration,
    key: string,
    fallback: number,
    min: number,
    max: number,
  ) => {
    const value = Number.parseFloat(
      style.getPropertyValue(`--dixy-organic-${key}`),
    );
    return Number.isFinite(value)
      ? Math.max(min, Math.min(max, value))
      : fallback;
  };
  function measure() {
    const elementStyle = getComputedStyle(surface!),
      style = getComputedStyle(host!);
    width = host!.getBoundingClientRect().width;
    height = host!.getBoundingClientRect().height;
    path = roundedBorder(
      width,
      height,
      [
        elementStyle.borderTopLeftRadius,
        elementStyle.borderTopRightRadius,
        elementStyle.borderBottomRightRadius,
        elementStyle.borderBottomLeftRadius,
      ].map((value) => cssCornerRadius(value, width, height)),
    );
    const px = (value: string) => Number.parseFloat(value) || 0;
    // Keep the actual authored content insets clear, rather than cutting the leaves with a mask.
    const safe = (key: string, fallback: number) => {
      const authored = Number.parseFloat(
        style.getPropertyValue(`--dixy-skin-frame-safe-${key}`),
      );
      return Number.isFinite(authored)
        ? Math.max(6, authored)
        : Math.max(8, fallback - 5);
    };
    limits = {
      top: safe("top", px(elementStyle.paddingTop)),
      inline: safe(
        "inline",
        Math.min(px(elementStyle.paddingLeft), px(elementStyle.paddingRight)),
      ),
      bottom: safe("bottom", px(elementStyle.paddingBottom)),
    };
    const recipe = organicFrameRecipes[kind];
    settings = {
      density: numeric(style, "density", defaults.density, 0, 100),
      cornerDensity: numeric(
        style,
        "cornerDensity",
        defaults.cornerDensity,
        0,
        100,
      ),
      canopyDepth: numeric(style, "canopyDepth", defaults.canopyDepth, 0, 100),
      variation: numeric(style, "variation", defaults.variation, 0, 100),
      scale: numeric(style, "scale", defaults.scale, 10, 32),
      stemWeight: numeric(style, "stemWeight", defaults.stemWeight, 0, 100),
      motion: numeric(style, "motion", defaults.motion, 0, 100),
      seed: Math.round(numeric(style, "seed", defaults.seed, 1, 9999)),
      style:
        recipe.styles[
          Math.round(numeric(style, "style", 0, 0, recipe.styles.length - 1))
        ],
      canopy:
        canopyShapes[
          Math.round(numeric(style, "canopy", 0, 0, canopyShapes.length - 1))
        ],
      stem: stemCharacters[
        Math.round(numeric(style, "stem", 0, 0, stemCharacters.length - 1))
      ],
    };
    const ink = (key: string, fallback: string) =>
      style.getPropertyValue(`--dixy-organic-${key}`).trim() || fallback;
    colors = {
      a: ink("a", recipe.light[0]),
      b: ink("b", recipe.light[1]),
      c: ink("c", recipe.light[2]),
      d: ink("d", recipe.light[3]),
      paper: elementStyle.backgroundColor,
      line: elementStyle.borderTopColor,
    };
    // Bound backing memory to two million pixels per visible surface; keep CSS geometry exact.
    dpr = Math.min(
      devicePixelRatio || 1,
      2,
      Math.sqrt(2_000_000 / ((width + 64) * (height + 64))),
    );
    const cw = Math.max(1, Math.round((width + 64) * dpr)),
      ch = Math.max(1, Math.round((height + 64) * dpr));
    if (canvas.width !== cw) canvas.width = cw;
    if (canvas.height !== ch) canvas.height = ch;
    if (!initialized) {
      shown = settings.density;
      initialized = true;
    }
  }
  const job: PaintJob = (now) => {
    if (disposed) return false;
    const update = dirty;
    if (dirty) {
      measure();
      dirty = false;
    }
    if (!visible || document.hidden || width <= 0 || height <= 0) {
      canvas.removeAttribute("data-running");
      return false;
    }
    const reduce =
      motion === "reduced" || preferences.some((query) => query.matches);
    const running =
      animate &&
      !reduce &&
      settings.motion > 0 &&
      now < deadline &&
      getComputedStyle(canvas).display !== "none";
    if (reduce) shown = settings.density;
    const changing = Math.abs(shown - settings.density) > 0.015;
    const elapsed = Math.min(0.05, Math.max(0, (now - lastPaint) / 1000));
    if (!update && (running || changing) && now - lastPaint < 1000 / 30)
      return true;
    if (changing)
      shown += (settings.density - shown) * Math.min(1, elapsed * 9);
    else shown = settings.density;
    if (running) clock += elapsed;
    lastPaint = now;
    canvas.toggleAttribute("data-running", running);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width + 64, height + 64);
    ctx.translate(32, 32);
    painter(
      ctx,
      path,
      width,
      height,
      settings,
      colors,
      clock,
      running,
      instance,
      limits,
      shown,
    );
    return running || Math.abs(shown - settings.density) > 0.015;
  };
  const refresh = () => {
    if (disposed) return;
    dirty = true;
    schedule(job);
  };
  const resize =
    typeof ResizeObserver === "undefined" ? null : new ResizeObserver(refresh);
  resize?.observe(host);
  const intersection =
    typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver((entries) => {
          visible = entries.some((entry) => entry.isIntersecting);
          if (visible) refresh();
          else {
            cancel(job);
            canvas.removeAttribute("data-running");
          }
        });
  intersection?.observe(surface);
  const attributes = new MutationObserver(refresh);
  // Every enclosing Theme can contribute appearance or custom CSS variables.
  for (
    let ancestor: Element | null = surface;
    ancestor;
    ancestor = ancestor.parentElement
  )
    attributes.observe(ancestor, {
      attributes: true,
      attributeFilter: [
        "style",
        "class",
        "data-appearance",
        "data-motion",
        "data-effects",
        "data-ornament",
      ],
    });
  const stopWatching = watchStyles(refresh);
  const visibility = () => {
    if (document.hidden) {
      cancel(job);
      canvas.removeAttribute("data-running");
    } else refresh();
  };
  document.addEventListener("visibilitychange", visibility);
  window.addEventListener("resize", refresh);
  canvas.addEventListener("contextrestored", refresh);
  preferences.forEach((query) => query.addEventListener("change", refresh));
  refresh();
  return () => {
    disposed = true;
    cancel(job);
    resize?.disconnect();
    intersection?.disconnect();
    attributes.disconnect();
    stopWatching();
    document.removeEventListener("visibilitychange", visibility);
    window.removeEventListener("resize", refresh);
    canvas.removeEventListener("contextrestored", refresh);
    preferences.forEach((query) =>
      query.removeEventListener("change", refresh),
    );
    canvas.removeAttribute("data-running");
  };
}
