import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { Theme } from "@dixy-ui/react";
import "@dixy-ui/react/ai.css";
import { useAppAppearance } from "../components/app-appearance-provider";
import { playgroundThemeProps, skinThemePreset } from "../lib/theme-playground";
import { skinCatalog } from "@dixy-ui/themes/catalog";
import { loadStarterStyles } from "../lib/theme-engine";
import { deduplicateSkinStyles } from "../lib/theme-skin-catalogue";
import { WrenApp } from "../ai-example/wren-app";
import "../styles/ai-example.css";

/** "original" is the default Dixy look; every other option is a starter skin. */
const skinOptions = [
  { slug: "original", name: "Original Dixy" },
  ...skinCatalog.map((skin) => ({ slug: skin.slug, name: skin.name })),
];

function skinId(slug: string | undefined) {
  return skinCatalog.find((skin) => skin.slug === slug)?.id ?? "none";
}

export const Route = createFileRoute("/ai-example")({
  validateSearch: (search: Record<string, unknown>): { skin?: string } => ({
    skin: skinCatalog.some((skin) => skin.slug === search.skin)
      ? (search.skin as string)
      : undefined,
  }),
  loaderDeps: ({ search }) => ({ id: skinId(search.skin) }),
  loader: ({ deps }) => loadStarterStyles(deps.id),
  head: ({ loaderData }) => ({
    meta: [
      { title: "Wren — a Dixy UI AI example app" },
      {
        name: "description",
        content:
          "A scripted AI chat app built from Dixy UI and its AI parts: streaming markdown, reasoning, tool calls and sources.",
      },
    ],
    styles: [
      ...(loaderData?.css
        ? [{ "data-dixy-skin-style": loaderData.id, children: loaderData.css }]
        : []),
      ...(loaderData?.materialCSS
        ? [{ children: loaderData.materialCSS }]
        : []),
    ],
  }),
  component: AiExample,
});

function AiExample() {
  const { id } = Route.useLoaderData();
  const { skin } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { appearance, setAppearance } = useAppAppearance();
  useEffect(() => deduplicateSkinStyles(id), [id]);
  const themeProps = useMemo(
    () => playgroundThemeProps({ ...skinThemePreset(id), appearance }),
    [id, appearance],
  );
  return (
    <Theme {...themeProps} className="wren-app">
      <WrenApp
        appearance={appearance}
        onAppearance={setAppearance}
        skin={skin ?? "original"}
        skins={skinOptions}
        onSkin={(slug) =>
          navigate({
            search: { skin: slug === "original" ? undefined : slug },
            replace: true,
            resetScroll: false,
          })
        }
      />
    </Theme>
  );
}
