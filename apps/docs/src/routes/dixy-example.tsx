import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { Theme } from "@dixy-ui/react";
import { useAppAppearance } from "../components/app-appearance-provider";
import {
  playgroundThemeProps,
  skinCatalog,
  skinThemePreset,
} from "../lib/theme-playground";
import {
  deduplicateSkinStyles,
  loadMaterialCSS,
  loadSkinCSS,
} from "../lib/theme-skin-catalogue";
import { FernpayApp } from "../example/fernpay-app";
import {
  fernpayViewIds,
  isOneOf,
  type FernpayViewId as ViewId,
} from "../lib/route-search";

/** "original" is the default Dixy look; every other option is a starter skin. */
const skinOptions = [
  { slug: "original", name: "Original Dixy" },
  ...skinCatalog.map((skin) => ({ slug: skin.slug, name: skin.name })),
];
function skinId(slug: string | undefined) {
  return skinCatalog.find((skin) => skin.slug === slug)?.id ?? "none";
}

export const Route = createFileRoute("/dixy-example")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { view?: ViewId; skin?: string } => ({
    view:
      isOneOf(fernpayViewIds, search.view) && search.view !== "overview"
        ? search.view
        : undefined,
    skin: skinCatalog.some((skin) => skin.slug === search.skin)
      ? (search.skin as string)
      : undefined,
  }),
  loaderDeps: ({ search }) => ({ id: skinId(search.skin) }),
  loader: async ({ deps }) => {
    try {
      const preset = skinThemePreset(deps.id);
      return {
        id: deps.id,
        css: await loadSkinCSS(deps.id),
        materialCSS:
          preset.material !== "inherit" ? await loadMaterialCSS() : "",
      };
    } catch {
      return { id: deps.id, css: "", materialCSS: "" };
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: "Fernpay — a Dixy UI example app" },
      {
        name: "description",
        content:
          "A mock personal finance dashboard built only from Dixy UI components.",
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
  component: DixyExample,
});

function DixyExample() {
  const { view = "overview", skin } = Route.useSearch();
  const { id } = Route.useLoaderData();
  const navigate = Route.useNavigate();
  const { appearance, setAppearance } = useAppAppearance();
  useEffect(() => deduplicateSkinStyles(id), [id]);

  const themeProps = useMemo(
    () => playgroundThemeProps({ ...skinThemePreset(id), appearance }),
    [id, appearance],
  );

  return (
    <Theme {...themeProps} className="fp-app">
      <FernpayApp
        view={view}
        onView={(next) =>
          navigate({
            search: (prev) => ({
              ...prev,
              view: next === "overview" ? undefined : next,
            }),
          })
        }
        skin={skin ?? "original"}
        skins={skinOptions}
        onSkin={(slug) =>
          navigate({
            search: (prev) => ({
              ...prev,
              skin: slug === "original" ? undefined : slug,
            }),
            replace: true,
            resetScroll: false,
          })
        }
        appearance={appearance}
        onAppearance={setAppearance}
      />
    </Theme>
  );
}
