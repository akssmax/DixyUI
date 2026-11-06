import { createFileRoute, notFound } from "@tanstack/react-router";
import { ComponentPage } from "../components/component-page";
import { componentRegistry, isComponentSlug } from "../registry/components";

export const Route = createFileRoute("/docs/components/$component")({
  loader: ({ params }) => {
    if (!isComponentSlug(params.component)) throw notFound();
    return { slug: params.component };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData ? componentRegistry[loaderData.slug].title : "Component"} — Dixy UI`,
      },
    ],
  }),
  component: function ComponentRoute() {
    const { slug } = Route.useLoaderData();
    return <ComponentPage key={slug} slug={slug} />;
  },
});
