import type { CSSProperties } from "react";
import type { Control, DemoState } from "../registry/components";

export interface FamilyComparison {
  slug: string;
  name: string;
  detail: string;
  items: { label: string; props: DemoState }[];
}

const categories: Record<string, { name: string; detail: string }> = {
  size: {
    name: "Sizes",
    detail: "Compare the three Dixy shirt sizes side by side.",
  },
  variant: {
    name: "Visual treatments",
    detail: "Emphasis changes presentation while the primitive keeps behavior.",
  },
  color: {
    name: "Semantic colors",
    detail: "Semantic color supplements the selected state or measurement.",
  },
  radius: {
    name: "Corner radii",
    detail:
      "Contextual rounding applies to the control or surface; large panels stay readable.",
  },
  material: {
    name: "Materials",
    detail:
      "Optional static finishes use the same public component. Import materials.css in your application.",
  },
  orientation: {
    name: "Orientation",
    detail:
      "The owning primitive controls layout and keyboard behavior as documented above.",
  },
  gap: {
    name: "Field spacing",
    detail: "Spacing changes independently of validation and field semantics.",
  },
  mode: {
    name: "Composition",
    detail: "Compare inline and modal command composition.",
  },
  state: { name: "States", detail: "Compare enabled and disabled navigation." },
  format: {
    name: "Color formats",
    detail:
      "The same color can be edited and represented in different formats.",
  },
  emphasis: {
    name: "Emphasis",
    detail: "Compare subtle and strong separators within the same content.",
  },
};

/** Both live rows and complete copied examples use these configurations. */
export function familyComparisons(
  family: string,
  controls: readonly Control[],
): FamilyComparison[] {
  const defaults = {
    ...Object.fromEntries(controls.map((c) => [c.name, c.initial])),
    ...(family === "avatar" ? { description: false } : {}),
  };
  return controls.flatMap((control) => {
    const category = categories[control.name];
    return category && control.options?.length
      ? [
          {
            ...category,
            slug: control.name,
            items: control.options.map((label) => ({
              label,
              props: { ...defaults, [control.name]: label },
            })),
          },
        ]
      : [];
  });
}

export const comparisonRowStyle = {
  justifyContent: "center",
  inlineSize: "100%",
} satisfies CSSProperties;

const compactFamilies = new Set([
  "avatar",
  "toggle",
  "tooltip",
  "popover",
  "preview-card",
  "dialog",
  "alert-dialog",
  "drawer",
  "menu",
  "context-menu",
  "toast",
]);

export function comparisonItemStyle(family: string): CSSProperties {
  const compact = compactFamilies.has(family);
  const small = family === "avatar" || family === "toggle";
  return {
    flex: small ? "0 1 6rem" : compact ? "0 1 10rem" : "1 1 16rem",
    minInlineSize: 0,
    maxInlineSize: small ? "8rem" : compact ? "14rem" : "22rem",
    inlineSize: "100%",
    alignItems: "center",
  };
}
