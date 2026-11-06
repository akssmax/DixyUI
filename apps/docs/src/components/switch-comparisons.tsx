import { lazy } from "react";
import { ComponentComparisons } from "./component-comparisons";

const examples = [
  {
    name: "Sizes",
    slug: "sizes",
    detail:
      "Compare sm, md and lg proportions. Each setting works independently.",
    Example: lazy(() => import("../demos/switch-sizes-comparison")),
  },
  {
    name: "Variants",
    slug: "variants",
    detail: "Solid, soft and outline use the same state and keyboard behavior.",
    Example: lazy(() => import("../demos/switch-variants-comparison")),
  },
  {
    name: "Colors",
    slug: "colors",
    detail:
      "Accent follows your theme; neutral, danger and success keep their semantic roles.",
    Example: lazy(() => import("../demos/switch-colors-comparison")),
  },
  {
    name: "With icons",
    slug: "icons",
    detail:
      "Toggle each switch to compare its decorative on/off artwork. The accessible label stays stable.",
    Example: lazy(() => import("../demos/switch-icons-comparison")),
  },
  {
    name: "Corner radii",
    slug: "radii",
    detail:
      "Compare none, sm, md, lg and full rounding on both track and thumb.",
    Example: lazy(() => import("../demos/switch-radii-comparison")),
  },
  {
    name: "Materials",
    slug: "materials",
    detail:
      "Five static finishes use the optional materials stylesheet; effects reduction removes the finish.",
    Example: lazy(() => import("../demos/switch-materials-comparison")),
  },
];
const sources = import.meta.glob<string>("../demos/switch-*-comparison.tsx", {
  query: "?raw",
  import: "default",
});

export default function SwitchComparisons() {
  return (
    <ComponentComparisons
      family="switch"
      examples={examples}
      sources={sources}
    />
  );
}
