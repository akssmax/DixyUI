import { createFileRoute, notFound } from "@tanstack/react-router";
import {
  FoundationPage,
  foundationPages,
  type FoundationSlug,
} from "../components/foundation-page";

export const Route = createFileRoute("/docs/foundations/$foundation")({
  loader: ({ params }) => {
    if (!Object.hasOwn(foundationPages, params.foundation)) throw notFound();
    return { slug: params.foundation as FoundationSlug };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData ? foundationPages[loaderData.slug].title : "Foundations"} — Dixy UI`,
      },
    ],
  }),
  component: function FoundationRoute() {
    const { slug } = Route.useLoaderData();
    return <FoundationPage key={slug} slug={slug} />;
  },
});
