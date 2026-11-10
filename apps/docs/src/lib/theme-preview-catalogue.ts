import { componentRegistry, type DemoState } from "../registry/components.ts";

export interface ThemePreviewEntry {
  slug: string;
  title: string;
  category: string;
  description: string;
  coveredExports: readonly string[];
  defaults: DemoState;
  load: () => Promise<unknown>;
}

/** Reuse the authored examples and their local defaults; never load raw source. */
export const themePreviewEntries: readonly ThemePreviewEntry[] = [
  ...Object.entries(componentRegistry).map(([slug, entry]) => ({
    slug,
    title: entry.title,
    category: entry.category,
    description: entry.description,
    coveredExports:
      "exportNames" in entry
        ? entry.exportNames
        : "exportName" in entry
          ? [entry.exportName]
          : slug === "typography"
            ? ["Heading", "Text"]
            : slug === "radio-group"
              ? ["Radio", "RadioGroup"]
              : slug === "text-field"
                ? ["TextField"]
                : slug === "icon"
                  ? ["Icon"]
                  : [entry.primitive!],
    defaults: Object.fromEntries(
      entry.controls
        .filter(
          (control) => !["material", "radius", "shape"].includes(control.name),
        )
        .map((control) => [control.name, control.initial]),
    ),
    load: entry.load,
  })),
  {
    slug: "icon-button",
    title: "Icon Button",
    category: "Actions",
    description: "A small action, with a clear purpose.",
    coveredExports: ["IconButton"],
    defaults: {},
    load: () => import("../demos/theme-icon-button-example"),
  },
  {
    slug: "layout",
    title: "Box, Shape & layout",
    category: "Layout",
    description:
      "Surfaces, decorative artwork, shared gutters and flexible layouts.",
    coveredExports: ["Box", "Shape", "Container", "Stack", "Inline"],
    defaults: {},
    load: () => import("../demos/theme-layout-example"),
  },
].sort((first, second) => first.title.localeCompare(second.title));

export const themePreviewCategories = [
  "All components",
  ...new Set(themePreviewEntries.map((entry) => entry.category)),
];

export function filterThemePreviews(query: string, category: string) {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return themePreviewEntries.filter((entry) => {
    const searchable =
      `${entry.title} ${entry.category} ${entry.coveredExports.join(" ")}`.toLowerCase();
    return (
      (category === "All components" || entry.category === category) &&
      words.every((word) => searchable.includes(word))
    );
  });
}
