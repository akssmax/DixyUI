import { Toggle as Primitive } from "@base-ui/react/toggle";
import type { ComponentProps } from "react";
import type { Material, RadiusPreset } from "@dixy-ui/tokens";
import { useComponentVisuals } from "../utilities/component-visuals";
import { withClassName } from "../utilities/class-name";

export interface ToggleProps extends Omit<
  ComponentProps<typeof Primitive>,
  "size" | "variant" | "color" | "radius" | "material"
> {
  /** Component proportions; preserves the shared interaction target. @default md */
  size?: "sm" | "md" | "lg";
  /** Visual emphasis; behavioral state remains primitive-owned. @default soft */
  variant?: "solid" | "soft" | "outline" | "ghost";
  /** Semantic emphasis; unselected controls remain neutral. @default accent */
  color?: "accent" | "neutral" | "danger" | "success";
  /** Contextual rounding; panels cap full rounding to preserve content. @default Theme.radius */
  radius?: RadiusPreset;
  /** Optional static finish; import materials.css. @default Theme.material */
  material?: Material;
}
function ToggleControlVisual({
  size,
  variant,
  color,
  radius,
  material,
  className,
  ...props
}: ToggleProps) {
  const visual = useComponentVisuals(
    { size, variant, color, radius, material },
    { variant: "soft" },
  );
  return (
    <Primitive
      {...props}
      {...visual}
      className={withClassName("dixy-toggle", className)}
    />
  );
}

export const Toggle = ToggleControlVisual;
export type * from "@base-ui/react/toggle";
