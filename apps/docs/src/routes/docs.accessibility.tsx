import { createFileRoute } from "@tanstack/react-router";
import Content from "../../content/accessibility.mdx";
export const Route = createFileRoute("/docs/accessibility")({
  head: () => ({ meta: [{ title: "Accessibility — Dixy UI" }] }),
  component: () => (
    <article className="prose-page mdx-content">
      <Content />
    </article>
  ),
});
