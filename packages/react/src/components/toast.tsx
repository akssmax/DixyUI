import { Toast as Primitive } from "@base-ui/react/toast";
import { defaultArtwork } from "../utilities/default-artwork";
import type { ComponentProps } from "react";
import type { Material, RadiusPreset } from "@dixy-ui/tokens";
import { useComponentVisuals } from "../utilities/component-visuals";
import { withClassName } from "../utilities/class-name";
import { styledPrimitive, themedPortal } from "../utilities/styled-primitive";

export interface ToastRootProps extends Omit<
  ComponentProps<typeof Primitive.Root>,
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
function ToastRootVisual({
  size,
  variant,
  radius,
  material,
  className,
  ...props
}: ToastRootProps) {
  const visual = useComponentVisuals(
    { size, variant, radius, material },
    { variant: "outline" },
  );
  return (
    <Primitive.Root
      {...props}
      {...visual}
      className={withClassName("dixy-toast-root", className)}
    />
  );
}

/** Dixy token styles with the complete Base UI Toast contract. */
export const Toast = /* @__PURE__ */ (() => ({
  ...Primitive,
  Viewport: /* @__PURE__ */ styledPrimitive(
    Primitive.Viewport,
    "dixy-toast-viewport",
  ),
  Root: ToastRootVisual,
  Content: /* @__PURE__ */ styledPrimitive(
    Primitive.Content,
    "dixy-toast-content",
  ),
  Description: /* @__PURE__ */ styledPrimitive(
    Primitive.Description,
    "dixy-toast-description",
  ),
  Title: /* @__PURE__ */ styledPrimitive(Primitive.Title, "dixy-toast-title"),
  Close: /* @__PURE__ */ defaultArtwork(
    Primitive.Close,
    "dixy-toast-close",
    "close",
    false,
  ),
  Action: /* @__PURE__ */ styledPrimitive(
    Primitive.Action,
    "dixy-toast-action",
  ),
  Positioner: /* @__PURE__ */ styledPrimitive(
    Primitive.Positioner,
    "dixy-toast-positioner",
  ),
  Arrow: /* @__PURE__ */ styledPrimitive(Primitive.Arrow, "dixy-toast-arrow"),
  Portal: /* @__PURE__ */ themedPortal(Primitive.Portal),
}))();
export type * from "@base-ui/react/toast";
