/**
 * The theme engine — every skin definition, ornament renderer, recipe and
 * stylesheet loader (~200 KB) — loaded on demand.
 *
 * The docs shell and every route's options sit in the site-wide entry chunk.
 * Importing the engine statically there made readers on Original Dixy, who
 * never use it, download and parse it on every page. Route loaders await it
 * here; the docs shell suspends on it only when the reader chose a skin. On
 * the server the root loader loads it before rendering, so themed HTML is
 * complete; during hydration React keeps that HTML until the engine arrives,
 * so a themed reader never sees Original Dixy first.
 */
type ThemeEngine = {
  playground: typeof import("./theme-playground");
  skins: typeof import("./theme-skin-catalogue");
};

let engine: ThemeEngine | undefined;
let pending: Promise<ThemeEngine> | undefined;
let settled: Promise<ThemeEngine | undefined> | undefined;

export function loadThemeEngine(): Promise<ThemeEngine> {
  if (engine) return Promise.resolve(engine);
  pending ??= Promise.all([
    import("./theme-playground"),
    import("./theme-skin-catalogue"),
  ]).then(
    ([playground, skins]) => (engine = { playground, skins }),
    (error: unknown) => {
      // A later loadThemeEngine() retries a failed chunk load. `settled`
      // stays resolved, so a render never suspends on a retry loop.
      pending = undefined;
      throw error;
    },
  );
  return pending;
}

/** The engine if it has loaded. */
export function loadedThemeEngine() {
  return engine;
}

/**
 * For `use()`: resolves to undefined instead of rejecting, so a failed chunk
 * load renders the plain shell (and its retry message) rather than an error.
 */
export function settledThemeEngine() {
  settled ??= loadThemeEngine().catch(() => undefined);
  return settled;
}

/** Starter stylesheet for a route's server-inlined `<style>`. */
export async function loadStarterStyles(id: string) {
  try {
    const { playground, skins } = await loadThemeEngine();
    const preset = playground.skinThemePreset(id);
    return {
      id,
      css: await skins.loadSkinCSS(id),
      materialCSS:
        preset.material !== "inherit" ? await skins.loadMaterialCSS() : "",
    };
  } catch {
    // The client retries through prepareSkin; the page still renders.
    return { id, css: "", materialCSS: "" };
  }
}
