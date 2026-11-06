import { Menubar as Primitive } from "@base-ui/react/menubar";
import type { ComponentProps } from "react";
import type { RadiusPreset } from "@dixy-ui/tokens";
import { useComponentVisuals } from "../utilities/component-visuals";
import { withClassName } from "../utilities/class-name";

export interface MenubarProps extends Omit<
  ComponentProps<typeof Primitive>,
  "size" | "variant" | "radius"
> {
  /** Component proportions; preserves the shared interaction target. @default md */
  size?: "sm" | "md" | "lg";
  /** Visual emphasis; behavioral state remains primitive-owned. @default plain */
  variant?: "plain" | "outline" | "soft";
  /** Contextual rounding; panels cap full rounding to preserve content. @default Theme.radius */
  radius?: RadiusPreset;
}
function MenubarControlVisual({
  size,
  variant,
  radius,
  className,
  ...props
}: MenubarProps) {
  const visual = useComponentVisuals(
    { size, variant, radius },
    { variant: "plain" },
  );
  return (
    <Primitive
      {...props}
      {...visual}
      className={withClassName("dixy-menubar", className)}
    />
  );
}

export const Menubar = MenubarControlVisual;
export type * from "@base-ui/react/menubar";
