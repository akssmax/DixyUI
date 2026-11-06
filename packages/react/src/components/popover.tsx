import { Popover as Primitive } from "@base-ui/react/popover";
import type { ComponentProps } from "react";
import type { Material, RadiusPreset } from "@dixy-ui/tokens";
import { useComponentVisuals } from "../utilities/component-visuals";
import { withClassName } from "../utilities/class-name";
import { styledPrimitive, themedPortal } from "../utilities/styled-primitive";

export interface PopoverPopupProps extends Omit<
  ComponentProps<typeof Primitive.Popup>,
  "size" | "variant" | "radius" | "material"
> {
  /** Component proportions; preserves the shared interaction target. @default md */
  size?: "sm" | "md" | "lg";
  /** Visual emphasis; behavioral state remains primitive-owned. @default outline */
  variant?: "outline" | "soft";
  /** Contextual rounding; panels cap full rounding to preserve content. @default Theme.radius */
  radius?: RadiusPreset;
  /** Optional static finish; import materials.css. @default Theme.material */
  material?: Material;
}
function PopoverPopupVisual({
  size,
  variant,
  radius,
  material,
  className,
  ...props
}: PopoverPopupProps) {
  const visual = useComponentVisuals(
    { size, variant, radius, material },
    { variant: "outline" },
  );
  return (
    <Primitive.Popup
      {...props}
      {...visual}
      className={withClassName("dixy-popover-popup", className)}
    />
  );
}

/** Dixy token styles with the complete Base UI Popover contract. */
export const Popover = /* @__PURE__ */ (() => ({
  ...Primitive,
  Trigger: /* @__PURE__ */ styledPrimitive(
    Primitive.Trigger,
    "dixy-popover-trigger",
  ),
  Positioner: /* @__PURE__ */ styledPrimitive(
    Primitive.Positioner,
    "dixy-popover-positioner",
  ),
  Popup: PopoverPopupVisual,
  Arrow: /* @__PURE__ */ styledPrimitive(Primitive.Arrow, "dixy-popover-arrow"),
  Backdrop: /* @__PURE__ */ styledPrimitive(
    Primitive.Backdrop,
    "dixy-popover-backdrop",
  ),
  Title: /* @__PURE__ */ styledPrimitive(Primitive.Title, "dixy-popover-title"),
  Description: /* @__PURE__ */ styledPrimitive(
    Primitive.Description,
    "dixy-popover-description",
  ),
  Close: /* @__PURE__ */ styledPrimitive(Primitive.Close, "dixy-popover-close"),
  Viewport: /* @__PURE__ */ styledPrimitive(
    Primitive.Viewport,
    "dixy-popover-viewport",
  ),
  Portal: /* @__PURE__ */ themedPortal(Primitive.Portal),
}))();
export type * from "@base-ui/react/popover";
