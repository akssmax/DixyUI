import { Meter as Primitive } from "@base-ui/react/meter";
import type { ComponentProps } from "react";
import type { Material, RadiusPreset } from "@dixy-ui/tokens";
import { useComponentVisuals } from "../utilities/component-visuals";
import { withClassName } from "../utilities/class-name";
import { styledPrimitive } from "../utilities/styled-primitive";

export interface MeterRootProps extends Omit<
  ComponentProps<typeof Primitive.Root>,
  "size" | "color" | "radius" | "material"
> {
  /** Visual track thickness for a bounded measurement. @default md */
  size?: "sm" | "md" | "lg";
  /** Semantic emphasis; unselected controls remain neutral. @default accent */
  color?: "accent" | "neutral" | "danger" | "success";
  /** Contextual rounding; panels cap full rounding to preserve content. @default Theme.radius */
  radius?: RadiusPreset;
  /** Optional static finish; import materials.css. @default Theme.material */
  material?: Material;
}
function MeterRootVisual({
  size,
  color,
  radius,
  material,
  className,
  ...props
}: MeterRootProps) {
  const visual = useComponentVisuals(
    { size, color, radius, material },
    { variant: "soft" },
  );
  return (
    <Primitive.Root
      {...props}
      {...visual}
      className={withClassName("dixy-meter-root", className)}
    />
  );
}

/** Dixy token styles with the complete Base UI Meter contract. */
export const Meter = /* @__PURE__ */ (() => ({
  ...Primitive,
  Root: MeterRootVisual,
  Track: /* @__PURE__ */ styledPrimitive(Primitive.Track, "dixy-meter-track"),
  Indicator: /* @__PURE__ */ styledPrimitive(
    Primitive.Indicator,
    "dixy-meter-indicator",
  ),
  Label: /* @__PURE__ */ styledPrimitive(Primitive.Label, "dixy-meter-label"),
}))();
export type * from "@base-ui/react/meter";
