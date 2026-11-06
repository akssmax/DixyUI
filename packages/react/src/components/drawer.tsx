import { Drawer as Primitive } from "@base-ui/react/drawer";
import type { ComponentProps } from "react";
import type { Material, RadiusPreset } from "@dixy-ui/tokens";
import { useComponentVisuals } from "../utilities/component-visuals";
import { withClassName } from "../utilities/class-name";
import { styledPrimitive, themedPortal } from "../utilities/styled-primitive";

export interface DrawerPopupProps extends Omit<
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
function DrawerPopupVisual({
  size,
  variant,
  radius,
  material,
  className,
  ...props
}: DrawerPopupProps) {
  const visual = useComponentVisuals(
    { size, variant, radius, material },
    { variant: "outline" },
  );
  return (
    <Primitive.Popup
      {...props}
      {...visual}
      className={withClassName("dixy-drawer-popup", className)}
    />
  );
}

/** Dixy token styles with the complete Base UI Drawer contract. */
export const Drawer = /* @__PURE__ */ (() => ({
  ...Primitive,
  Backdrop: /* @__PURE__ */ styledPrimitive(
    Primitive.Backdrop,
    "dixy-drawer-backdrop",
  ),
  Close: /* @__PURE__ */ styledPrimitive(Primitive.Close, "dixy-drawer-close"),
  Content: /* @__PURE__ */ styledPrimitive(
    Primitive.Content,
    "dixy-drawer-content",
  ),
  Description: /* @__PURE__ */ styledPrimitive(
    Primitive.Description,
    "dixy-drawer-description",
  ),
  Indent: /* @__PURE__ */ styledPrimitive(
    Primitive.Indent,
    "dixy-drawer-indent",
  ),
  IndentBackground: /* @__PURE__ */ styledPrimitive(
    Primitive.IndentBackground,
    "dixy-drawer-indent-background",
  ),
  Popup: DrawerPopupVisual,
  SwipeArea: /* @__PURE__ */ styledPrimitive(
    Primitive.SwipeArea,
    "dixy-drawer-swipe-area",
  ),
  Title: /* @__PURE__ */ styledPrimitive(Primitive.Title, "dixy-drawer-title"),
  Trigger: /* @__PURE__ */ styledPrimitive(
    Primitive.Trigger,
    "dixy-drawer-trigger",
  ),
  Viewport: /* @__PURE__ */ styledPrimitive(
    Primitive.Viewport,
    "dixy-drawer-viewport",
  ),
  Portal: /* @__PURE__ */ themedPortal(Primitive.Portal),
}))();
export type * from "@base-ui/react/drawer";
