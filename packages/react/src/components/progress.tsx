import { Progress as Primitive } from "@base-ui/react/progress";
import type { ComponentProps } from "react";
import type { Material, RadiusPreset } from "@dixy-ui/tokens";
import { useComponentVisuals } from "../utilities/component-visuals";
import { withClassName } from "../utilities/class-name";
import { styledPrimitive } from "../utilities/styled-primitive";

export interface ProgressRootProps extends Omit<
  ComponentProps<typeof Primitive.Root>,
  "size" | "color" | "radius" | "material"
> {
  /** Visual track thickness for task progress. @default md */
  size?: "sm" | "md" | "lg";
  /** Semantic emphasis; unselected controls remain neutral. @default accent */
  color?: "accent" | "neutral" | "danger" | "success";
  /** Contextual rounding; panels cap full rounding to preserve content. @default Theme.radius */
  radius?: RadiusPreset;
  /** Optional static finish; import materials.css. @default Theme.material */
  material?: Material;
}
function ProgressRootVisual({
  size,
  color,
  radius,
  material,
  className,
  ...props
}: ProgressRootProps) {
  const visual = useComponentVisuals(
    { size, color, radius, material },
    { variant: "soft" },
  );
  return (
    <Primitive.Root
      {...props}
      {...visual}
      className={withClassName("dixy-progress-root", className)}
    />
  );
}

/** Dixy token styles with the complete Base UI Progress contract. */
export const Progress = /* @__PURE__ */ (() => ({
  ...Primitive,
  Root: ProgressRootVisual,
  Track: /* @__PURE__ */ styledPrimitive(
    Primitive.Track,
    "dixy-progress-track",
  ),
  Indicator: /* @__PURE__ */ styledPrimitive(
    Primitive.Indicator,
    "dixy-progress-indicator",
  ),
  Label: /* @__PURE__ */ styledPrimitive(
    Primitive.Label,
    "dixy-progress-label",
  ),
}))();
export type * from "@base-ui/react/progress";
