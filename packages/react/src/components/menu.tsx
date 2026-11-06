import { Menu as Primitive } from "@base-ui/react/menu";
import { defaultArtwork } from "../utilities/default-artwork";
import type { ComponentProps } from "react";
import type { Material, RadiusPreset } from "@dixy-ui/tokens";
import { useComponentVisuals } from "../utilities/component-visuals";
import { withClassName } from "../utilities/class-name";
import { styledPrimitive, themedPortal } from "../utilities/styled-primitive";

export interface MenuPopupProps extends Omit<
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
function MenuPopupVisual({
  size,
  variant,
  radius,
  material,
  className,
  ...props
}: MenuPopupProps) {
  const visual = useComponentVisuals(
    { size, variant, radius, material },
    { variant: "outline" },
  );
  return (
    <Primitive.Popup
      {...props}
      {...visual}
      className={withClassName("dixy-menu-popup", className)}
    />
  );
}

export interface MenuItemProps extends Omit<
  ComponentProps<typeof Primitive.Item>,
  "size" | "color" | "radius"
> {
  /** Component proportions; preserves the shared interaction target. @default md */
  size?: "sm" | "md" | "lg";
  /** Semantic emphasis; unselected controls remain neutral. @default accent */
  color?: "accent" | "neutral" | "danger" | "success";
  /** Contextual rounding; panels cap full rounding to preserve content. @default Theme.radius */
  radius?: RadiusPreset;
}
function MenuItemVisual({
  size,
  color,
  radius,
  className,
  ...props
}: MenuItemProps) {
  const visual = useComponentVisuals(
    { size, color, radius },
    { variant: "soft" },
  );
  return (
    <Primitive.Item
      {...props}
      {...visual}
      data-size={size}
      className={withClassName("dixy-menu-item", className)}
    />
  );
}

export interface MenuLinkItemProps extends Omit<
  ComponentProps<typeof Primitive.LinkItem>,
  "size" | "color" | "radius"
> {
  /** Component proportions; preserves the shared interaction target. @default md */
  size?: "sm" | "md" | "lg";
  /** Semantic emphasis; unselected controls remain neutral. @default accent */
  color?: "accent" | "neutral" | "danger" | "success";
  /** Contextual rounding; panels cap full rounding to preserve content. @default Theme.radius */
  radius?: RadiusPreset;
}
function MenuLinkItemVisual({
  size,
  color,
  radius,
  className,
  ...props
}: MenuLinkItemProps) {
  const visual = useComponentVisuals(
    { size, color, radius },
    { variant: "soft" },
  );
  return (
    <Primitive.LinkItem
      {...props}
      {...visual}
      data-size={size}
      className={withClassName("dixy-menu-link-item", className)}
    />
  );
}

/** Dixy token styles with the complete Base UI Menu contract. */
export const Menu = /* @__PURE__ */ (() => ({
  ...Primitive,
  Arrow: /* @__PURE__ */ styledPrimitive(Primitive.Arrow, "dixy-menu-arrow"),
  Backdrop: /* @__PURE__ */ styledPrimitive(
    Primitive.Backdrop,
    "dixy-menu-backdrop",
  ),
  CheckboxItem: /* @__PURE__ */ styledPrimitive(
    Primitive.CheckboxItem,
    "dixy-menu-checkbox-item",
  ),
  CheckboxItemIndicator: /* @__PURE__ */ defaultArtwork(
    Primitive.CheckboxItemIndicator,
    "dixy-menu-checkbox-item-indicator",
    "check",
  ),
  Group: /* @__PURE__ */ styledPrimitive(Primitive.Group, "dixy-menu-group"),
  GroupLabel: /* @__PURE__ */ styledPrimitive(
    Primitive.GroupLabel,
    "dixy-menu-group-label",
  ),
  Item: MenuItemVisual,
  LinkItem: MenuLinkItemVisual,
  Popup: MenuPopupVisual,
  Positioner: /* @__PURE__ */ styledPrimitive(
    Primitive.Positioner,
    "dixy-menu-positioner",
  ),
  RadioGroup: /* @__PURE__ */ styledPrimitive(
    Primitive.RadioGroup,
    "dixy-menu-radio-group",
  ),
  RadioItem: /* @__PURE__ */ styledPrimitive(
    Primitive.RadioItem,
    "dixy-menu-radio-item",
  ),
  RadioItemIndicator: /* @__PURE__ */ defaultArtwork(
    Primitive.RadioItemIndicator,
    "dixy-menu-radio-item-indicator",
    "dot",
  ),
  Trigger: /* @__PURE__ */ styledPrimitive(
    Primitive.Trigger,
    "dixy-menu-trigger",
  ),
  Viewport: /* @__PURE__ */ styledPrimitive(
    Primitive.Viewport,
    "dixy-menu-viewport",
  ),
  Separator: /* @__PURE__ */ styledPrimitive(
    Primitive.Separator,
    "dixy-menu-separator",
  ),
  SubmenuTrigger: /* @__PURE__ */ styledPrimitive(
    Primitive.SubmenuTrigger,
    "dixy-menu-submenu-trigger",
  ),
  Input: /* @__PURE__ */ styledPrimitive(Primitive.Input, "dixy-menu-input"),
  List: /* @__PURE__ */ styledPrimitive(Primitive.List, "dixy-menu-list"),
  Clear: /* @__PURE__ */ styledPrimitive(Primitive.Clear, "dixy-menu-clear"),
  Empty: /* @__PURE__ */ styledPrimitive(Primitive.Empty, "dixy-menu-empty"),
  Portal: /* @__PURE__ */ themedPortal(Primitive.Portal),
}))();
export type * from "@base-ui/react/menu";
