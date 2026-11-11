import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ThemePlayground } from "../components/theme-playground";
import {
  defaultInspectorTab,
  defaultPreviewScene,
  inspectorTabIds,
  isOneOf,
  previewSceneIds,
} from "../lib/route-search";
import {
  defaultThemePreset,
  parseThemePreset,
  serializeThemePreset,
  type ThemePreset,
} from "../lib/theme-playground";
import { deduplicateSkinStyles } from "../lib/theme-skin-catalogue";
import { loadThemeEngine } from "../lib/theme-engine";

let lastLoad:
  | {
      key: string;
      data: {
        skin: string;
        css: string;
        materialCSS: string;
        loadWarning: string;
      };
    }
  | undefined;
export const Route = createFileRoute("/playground")({
  // Unknown or default view/panel values are dropped, so links stay short and
  // a stale link falls back to Overview and the Theme tab.
  validateSearch: (
    search: Record<string, unknown>,
  ): { theme?: string; view?: string; panel?: string } => ({
    theme: typeof search.theme === "string" ? search.theme : undefined,
    view:
      isOneOf(previewSceneIds, search.view) &&
      search.view !== defaultPreviewScene
        ? search.view
        : undefined,
    panel:
      isOneOf(inspectorTabIds, search.panel) &&
      search.panel !== defaultInspectorTab
        ? search.panel
        : undefined,
  }),
  // Parsing a preset needs the theme engine, which is loaded on demand so it
  // stays out of the site-wide entry chunk (route options live there).
  loaderDeps: ({ search }) => ({ theme: search.theme }),
  loader: async ({ deps }) => {
    const { playground, skins } = await loadThemeEngine();
    let skin = "none";
    let document: ThemePreset["document"] = null;
    let material = false;
    try {
      const preset = deps.theme
        ? playground.parseThemePreset(deps.theme)
        : playground.defaultThemePreset;
      skin = preset.skin;
      document = preset.document;
      material = preset.material !== "inherit";
    } catch {
      // An invalid preset falls back to Original Dixy; the page warns.
    }
    // Control tweaks rewrite ?theme= often; reuse the result while the skin,
    // document and material it depends on are unchanged.
    const key = JSON.stringify([skin, document, material]);
    if (lastLoad?.key === key) return lastLoad.data;
    let data;
    try {
      data = {
        skin: document?.id ?? skin,
        css: await skins.loadSkinCSS(skin, document),
        materialCSS: material ? await skins.loadMaterialCSS() : "",
        loadWarning: "",
      };
    } catch {
      return {
        skin: document?.id ?? skin,
        css: "",
        materialCSS: "",
        loadWarning:
          "The skin finish could not load. Your controls and preset are available; choose the skin again to retry.",
      };
    }
    lastLoad = { key, data };
    return data;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: "Theme playground — Dixy UI" },
      {
        name: "description",
        content:
          "Eleven expressive skins. Real Dixy components. Make a theme that feels like you.",
      },
    ],
    styles: [
      ...(loaderData?.css
        ? [
            {
              "data-dixy-skin-style": loaderData.skin,
              children: loaderData.css,
            },
          ]
        : []),
      ...(loaderData?.materialCSS
        ? [{ children: loaderData.materialCSS }]
        : []),
    ],
  }),
  component: PlaygroundRoute,
});
function PlaygroundRoute() {
  const { theme, view, panel } = Route.useSearch();
  const { loadWarning } = Route.useLoaderData();
  const navigate = Route.useNavigate();
  const incoming = useMemo(() => {
    try {
      return {
        preset: theme ? parseThemePreset(theme) : defaultThemePreset,
        warning: "",
      };
    } catch {
      return {
        preset: defaultThemePreset,
        warning:
          "That link contains an invalid preset. The Dixy starter is loaded; import a supported preset or choose a skin.",
      };
    }
  }, [theme]);
  const [draft, setDraft] = useState(incoming.preset);
  const written = useRef(theme);
  // Several debounced writes can be in flight while a new skin's CSS loads.
  // Their older responses are acknowledgements, not external preset changes.
  const pendingWrites = useRef(new Set<string>());
  useEffect(() => {
    if (theme && pendingWrites.current.has(theme)) {
      pendingWrites.current.delete(theme);
      written.current = theme;
    } else if (theme !== written.current) {
      setDraft(incoming.preset);
      written.current = theme;
    }
    deduplicateSkinStyles(draft.document?.id ?? draft.skin);
  }, [theme, incoming]);
  useEffect(() => {
    const serialized = serializeThemePreset(draft);
    if (serialized === theme || (draft === defaultThemePreset && !theme))
      return;
    const timer = window.setTimeout(() => {
      written.current = serialized;
      pendingWrites.current.add(serialized);
      if (pendingWrites.current.size > 32)
        pendingWrites.current.delete(
          pendingWrites.current.values().next().value!,
        );
      void navigate({
        search: (previous) => ({ ...previous, theme: serialized }),
        replace: true,
        resetScroll: false,
      });
    }, 180);
    return () => window.clearTimeout(timer);
  }, [draft, navigate, theme]);
  function change(next: ThemePreset) {
    setDraft(next);
  }
  // Tabs are a view of the page, not history: replace, keep scroll, keep the theme.
  function setSearch(key: "view" | "panel", value: string, fallback: string) {
    void navigate({
      search: (previous) => ({
        ...previous,
        [key]: value === fallback ? undefined : value,
      }),
      replace: true,
      resetScroll: false,
    });
  }
  return (
    <ThemePlayground
      preset={draft}
      onChange={change}
      warning={incoming.warning || loadWarning}
      view={view ?? defaultPreviewScene}
      onViewChange={(next) => setSearch("view", next, defaultPreviewScene)}
      panel={panel ?? defaultInspectorTab}
      onPanelChange={(next) => setSearch("panel", next, defaultInspectorTab)}
    />
  );
}
