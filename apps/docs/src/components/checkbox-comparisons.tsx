import { lazy } from "react";
import { ComponentComparisons } from "./component-comparisons";

const examples = [
  {
    name: "Sizes",
    slug: "sizes",
    detail:
      "Compare sm, md and lg. Each preserves the shared minimum interaction target.",
    Example: lazy(() => import("../demos/checkbox-sizes-comparison")),
  },
  {
    name: "Variants",
    slug: "variants",
    detail:
      "Solid, soft and outline change selected emphasis. Unchecked boxes stay neutral.",
    Example: lazy(() => import("../demos/checkbox-variants-comparison")),
  },
  {
    name: "Colors",
    slug: "colors",
    detail:
      "Accent follows your theme. Neutral, danger and success retain their semantic roles.",
    Example: lazy(() => import("../demos/checkbox-colors-comparison")),
  },
  {
    name: "Custom indicators",
    slug: "indicators",
    detail:
      "Use decorative checked and mixed artwork while keeping the accessible label stable.",
    Example: lazy(() => import("../demos/checkbox-indicators-comparison")),
  },
  {
    name: "Corner radii",
    slug: "radii",
    detail:
      "Compare none, sm, md, lg and full rounding. Radius also inherits from Theme.",
    Example: lazy(() => import("../demos/checkbox-radii-comparison")),
  },
  {
    name: "Materials",
    slug: "materials",
    detail:
      "Five static finishes use the optional materials stylesheet. Effects reduction removes the finish.",
    Example: lazy(() => import("../demos/checkbox-materials-comparison")),
  },
  {
    name: "States",
    slug: "states",
    detail:
      "Checked, mixed, disabled and read-only states share the same centered indicator geometry.",
    Example: lazy(() => import("../demos/checkbox-states-comparison")),
  },
  {
    name: "Select all",
    slug: "group",
    detail:
      "Base UI derives the parent checkbox’s mixed state from the selected delivery channels.",
    Example: lazy(() => import("../demos/checkbox-group-comparison")),
  },
  {
    name: "Form validation",
    slug: "validation",
    detail:
      "Field owns the description and error. The required checkbox must be selected before the form submits.",
    Example: lazy(() => import("../demos/checkbox-validation-comparison")),
  },
];
const sources = import.meta.glob<string>("../demos/checkbox-*-comparison.tsx", {
  query: "?raw",
  import: "default",
});
export default function CheckboxComparisons() {
  return (
    <ComponentComparisons
      family="checkbox"
      examples={examples}
      sources={sources}
    />
  );
}
