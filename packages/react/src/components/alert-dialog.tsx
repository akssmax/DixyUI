import { AlertDialog as Primitive } from "@base-ui/react/alert-dialog";
import type { ComponentProps } from "react";
import type { Material, RadiusPreset } from "@dixy-ui/tokens";
import { useComponentVisuals } from "../utilities/component-visuals";
import { withClassName } from "../utilities/class-name";
import { styledPrimitive, themedPortal } from "../utilities/styled-primitive";

export interface AlertDialogPopupProps extends Omit<
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
function AlertDialogPopupVisual({
  size,
  variant,
  radius,
  material,
  className,
  ...props
}: AlertDialogPopupProps) {
  const visual = useComponentVisuals(
    { size, variant, radius, material },
    { variant: "outline" },
  );
  return (
    <Primitive.Popup
      {...props}
      {...visual}
      className={withClassName("dixy-alert-dialog-popup", className)}
    />
  );
}

/** Dixy token styles with the complete Base UI AlertDialog contract. */
export const AlertDialog = /* @__PURE__ */ (() => ({
  ...Primitive,
  Backdrop: /* @__PURE__ */ styledPrimitive(
    Primitive.Backdrop,
    "dixy-alert-dialog-backdrop",
  ),
  Close: /* @__PURE__ */ styledPrimitive(
    Primitive.Close,
    "dixy-alert-dialog-close",
  ),
  Description: /* @__PURE__ */ styledPrimitive(
    Primitive.Description,
    "dixy-alert-dialog-description",
  ),
  Popup: AlertDialogPopupVisual,
  Title: /* @__PURE__ */ styledPrimitive(
    Primitive.Title,
    "dixy-alert-dialog-title",
  ),
  Trigger: /* @__PURE__ */ styledPrimitive(
    Primitive.Trigger,
    "dixy-alert-dialog-trigger",
  ),
  Viewport: /* @__PURE__ */ styledPrimitive(
    Primitive.Viewport,
    "dixy-alert-dialog-viewport",
  ),
  Portal: /* @__PURE__ */ themedPortal(Primitive.Portal),
}))();
export type * from "@base-ui/react/alert-dialog";
