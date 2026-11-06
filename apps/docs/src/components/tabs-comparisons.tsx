import { lazy } from "react";
import { ComponentComparisons } from "./component-comparisons";

const examples = [
  {
    name: "Variants",
    slug: "variants",
    detail:
      "Line, solid, soft and outline share the same selection and keyboard contracts. Inactive labels stay neutral.",
    Example: lazy(() => import("../demos/tabs-variants-comparison")),
  },
  {
    name: "Sizes",
    slug: "sizes",
    detail:
      "Compare sm, md and lg trigger proportions. Each respects the shared minimum interaction target.",
    Example: lazy(() => import("../demos/tabs-sizes-comparison")),
  },
  {
    name: "Colors",
    slug: "colors",
    detail:
      "Accent follows Theme. Neutral, danger and success use Dixy’s semantic action colors.",
    Example: lazy(() => import("../demos/tabs-colors-comparison")),
  },
  {
    name: "Icons and content",
    slug: "icons",
    detail:
      "Compose decorative artwork beside a text label. Panels hold the interactive content.",
    Example: lazy(() => import("../demos/tabs-icons-comparison")),
  },
  {
    name: "Corner radii",
    slug: "radii",
    detail:
      "Five contextual presets apply to triggers and the selected surface. Radius inherits Theme when omitted.",
    Example: lazy(() => import("../demos/tabs-radii-comparison")),
  },
  {
    name: "Materials",
    slug: "materials",
    detail:
      "The optional static finish belongs to the selected surface in filled variants. Line stays flat; effects reduction removes decoration.",
    Example: lazy(() => import("../demos/tabs-materials-comparison")),
  },
  {
    name: "Orientation and activation",
    slug: "orientation",
    detail:
      "Compare manual horizontal navigation with automatic vertical navigation. Selection and keyboard focus remain distinct.",
    Example: lazy(() => import("../demos/tabs-orientation-comparison")),
  },
  {
    name: "Overflow",
    slug: "overflow",
    detail:
      "A bounded native scroll region keeps long lists reachable with pointer and keyboard. Focused tabs scroll into view.",
    Example: lazy(() => import("../demos/tabs-overflow-comparison")),
  },
];
const sources = import.meta.glob<string>("../demos/tabs-*-comparison.tsx", {
  query: "?raw",
  import: "default",
});
export default function TabsComparisons() {
  return (
    <ComponentComparisons family="tabs" examples={examples} sources={sources} />
  );
}
