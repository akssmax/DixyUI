import { PreviewCard as Primitive } from "@base-ui/react/preview-card";
import type { ComponentProps } from "react";
import type { Material, RadiusPreset } from "@dixy-ui/tokens";
import { useComponentVisuals } from "../utilities/component-visuals";
import { withClassName } from "../utilities/class-name";
import { styledPrimitive, themedPortal } from "../utilities/styled-primitive";

export interface PreviewCardPopupProps extends Omit<
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
function PreviewCardPopupVisual({
  size,
  variant,
  radius,
  material,
  className,
  ...props
}: PreviewCardPopupProps) {
  const visual = useComponentVisuals(
    { size, variant, radius, material },
    { variant: "outline" },
  );
  return (
    <Primitive.Popup
      {...props}
      {...visual}
      className={withClassName("dixy-preview-card-popup", className)}
    />
  );
}

/** Dixy token styles with the complete Base UI PreviewCard contract. */
export const PreviewCard = /* @__PURE__ */ (() => ({
  ...Primitive,
  Trigger: /* @__PURE__ */ styledPrimitive(
    Primitive.Trigger,
    "dixy-preview-card-trigger",
  ),
  Positioner: /* @__PURE__ */ styledPrimitive(
    Primitive.Positioner,
    "dixy-preview-card-positioner",
  ),
  Popup: PreviewCardPopupVisual,
  Arrow: /* @__PURE__ */ styledPrimitive(
    Primitive.Arrow,
    "dixy-preview-card-arrow",
  ),
  Backdrop: /* @__PURE__ */ styledPrimitive(
    Primitive.Backdrop,
    "dixy-preview-card-backdrop",
  ),
  Viewport: /* @__PURE__ */ styledPrimitive(
    Primitive.Viewport,
    "dixy-preview-card-viewport",
  ),
  Portal: /* @__PURE__ */ themedPortal(Primitive.Portal),
}))();
export type * from "@base-ui/react/preview-card";
