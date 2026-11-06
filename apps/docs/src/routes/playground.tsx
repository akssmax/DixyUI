import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ThemePlayground } from "../components/theme-playground";
import {
  defaultThemePreset,
  parseThemePreset,
  serializeThemePreset,
  type ThemePreset,
} from "../lib/theme-playground";
import {
  loadSkinCSS,
  loadMaterialCSS,
  deduplicateSkinStyles,
} from "../lib/theme-skin-catalogue";
export const Route = createFileRoute("/playground")({
  validateSearch: (search: Record<string, unknown>): { theme?: string } => ({
    theme: typeof search.theme === "string" ? search.theme : undefined,
  }),
  loaderDeps: ({ search }) => {
    try {
      const preset = search.theme
        ? parseThemePreset(search.theme)
        : defaultThemePreset;
      return {
        skin: preset.skin,
        document: preset.document,
        material: preset.material !== "inherit",
      };
    } catch {
      return { skin: "none", document: null, material: false };
    }
  },
  loader: async ({ deps }) => {
    try {
      return {
        skin: deps.document?.id ?? deps.skin,
        css: await loadSkinCSS(deps.skin, deps.document),
        materialCSS: deps.material ? await loadMaterialCSS() : "",
        loadWarning: "",
      };
    } catch {
      return {
        skin: deps.document?.id ?? deps.skin,
        css: "",
        materialCSS: "",
        loadWarning:
          "The skin finish could not load. Your controls and preset are available; choose the skin again to retry.",
      };
    }
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
  const { theme } = Route.useSearch();
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
        search: { theme: serialized },
        replace: true,
        resetScroll: false,
      });
    }, 180);
    return () => window.clearTimeout(timer);
  }, [draft, navigate, theme]);
  function change(next: ThemePreset) {
    setDraft(next);
  }
  return (
    <ThemePlayground
      preset={draft}
      onChange={change}
      warning={incoming.warning || loadWarning}
    />
  );
}
