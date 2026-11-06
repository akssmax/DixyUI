import { createFileRoute } from "@tanstack/react-router";
import Content from "../../content/learning.mdx";
export const Route = createFileRoute("/docs/learning")({
  head: () => ({ meta: [{ title: "Learning the system — Dixy UI" }] }),
  component: () => (
    <article className="prose-page mdx-content">
      <Content />
    </article>
  ),
});
