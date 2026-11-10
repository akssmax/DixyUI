import { createFileRoute, notFound } from "@tanstack/react-router";
import { ComponentPage } from "../components/component-page";
import { componentIndex, isComponentSlug } from "../generated/component-index";

export const Route = createFileRoute("/docs/components/$component")({
  loader: ({ params }) => {
    if (!isComponentSlug(params.component)) throw notFound();
    return { slug: params.component };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData ? componentIndex[loaderData.slug].title : "Component"} — Dixy UI`,
      },
    ],
  }),
  component: function ComponentRoute() {
    const { slug } = Route.useLoaderData();
    return <ComponentPage key={slug} slug={slug} />;
  },
});
