import { createFileRoute } from "@tanstack/react-router";
import Content from "../../content/installation.mdx";
export const Route = createFileRoute("/docs/installation")({
  head: () => ({ meta: [{ title: "Installation — Dixy UI" }] }),
  component: () => (
    <article className="prose-page mdx-content">
      <Content />
    </article>
  ),
});
