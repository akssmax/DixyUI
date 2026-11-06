import { Select as Primitive } from "@base-ui/react/select";
import { defaultArtwork } from "../utilities/default-artwork";
import type { ComponentProps } from "react";
import type { Material, RadiusPreset } from "@dixy-ui/tokens";
import { useComponentVisuals } from "../utilities/component-visuals";
import { withClassName } from "../utilities/class-name";
import { styledPrimitive, themedPortal } from "../utilities/styled-primitive";

export interface SelectTriggerProps extends Omit<
  ComponentProps<typeof Primitive.Trigger>,
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
function SelectTriggerVisual({
  size,
  variant,
  radius,
  material,
  className,
  ...props
}: SelectTriggerProps) {
  const visual = useComponentVisuals(
    { size, variant, radius, material },
    { variant: "outline" },
  );
  return (
    <Primitive.Trigger
      {...props}
      {...visual}
      className={withClassName("dixy-select-trigger", className)}
    />
  );
}

export interface SelectPopupProps extends Omit<
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
function SelectPopupVisual({
  size,
  variant,
  radius,
  material,
  className,
  ...props
}: SelectPopupProps) {
  const visual = useComponentVisuals(
    { size, variant, radius, material },
    { variant: "outline" },
  );
  return (
    <Primitive.Popup
      {...props}
      {...visual}
      className={withClassName("dixy-select-popup", className)}
    />
  );
}

/** Dixy token styles with the complete Base UI Select contract. */
export const Select = /* @__PURE__ */ (() => ({
  ...Primitive,
  Label: /* @__PURE__ */ styledPrimitive(Primitive.Label, "dixy-select-label"),
  Trigger: SelectTriggerVisual,
  Icon: /* @__PURE__ */ defaultArtwork(
    Primitive.Icon,
    "dixy-select-icon",
    "chevron",
  ),
  Backdrop: /* @__PURE__ */ styledPrimitive(
    Primitive.Backdrop,
    "dixy-select-backdrop",
  ),
  Positioner: /* @__PURE__ */ styledPrimitive(
    Primitive.Positioner,
    "dixy-select-positioner",
  ),
  Popup: SelectPopupVisual,
  List: /* @__PURE__ */ styledPrimitive(Primitive.List, "dixy-select-list"),
  Item: /* @__PURE__ */ styledPrimitive(Primitive.Item, "dixy-select-item"),
  ItemIndicator: /* @__PURE__ */ defaultArtwork(
    Primitive.ItemIndicator,
    "dixy-select-item-indicator",
    "check",
  ),
  ItemText: /* @__PURE__ */ styledPrimitive(
    Primitive.ItemText,
    "dixy-select-item-text",
  ),
  Arrow: /* @__PURE__ */ styledPrimitive(Primitive.Arrow, "dixy-select-arrow"),
  ScrollDownArrow: /* @__PURE__ */ styledPrimitive(
    Primitive.ScrollDownArrow,
    "dixy-select-scroll-down-arrow",
  ),
  ScrollUpArrow: /* @__PURE__ */ styledPrimitive(
    Primitive.ScrollUpArrow,
    "dixy-select-scroll-up-arrow",
  ),
  Group: /* @__PURE__ */ styledPrimitive(Primitive.Group, "dixy-select-group"),
  GroupLabel: /* @__PURE__ */ styledPrimitive(
    Primitive.GroupLabel,
    "dixy-select-group-label",
  ),
  Separator: /* @__PURE__ */ styledPrimitive(
    Primitive.Separator,
    "dixy-select-separator",
  ),
  Portal: /* @__PURE__ */ themedPortal(Primitive.Portal),
}))();
export type * from "@base-ui/react/select";
