import { ContextMenu as Primitive } from "@base-ui/react/context-menu";
import { defaultArtwork } from "../utilities/default-artwork";
import type { ComponentProps } from "react";
import type { Material, RadiusPreset } from "@dixy-ui/tokens";
import { useComponentVisuals } from "../utilities/component-visuals";
import { withClassName } from "../utilities/class-name";
import { styledPrimitive, themedPortal } from "../utilities/styled-primitive";

export interface ContextMenuPopupProps extends Omit<
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
function ContextMenuPopupVisual({
  size,
  variant,
  radius,
  material,
  className,
  ...props
}: ContextMenuPopupProps) {
  const visual = useComponentVisuals(
    { size, variant, radius, material },
    { variant: "outline" },
  );
  return (
    <Primitive.Popup
      {...props}
      {...visual}
      className={withClassName("dixy-context-menu-popup", className)}
    />
  );
}

export interface ContextMenuItemProps extends Omit<
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
function ContextMenuItemVisual({
  size,
  color,
  radius,
  className,
  ...props
}: ContextMenuItemProps) {
  const visual = useComponentVisuals(
    { size, color, radius },
    { variant: "soft" },
  );
  return (
    <Primitive.Item
      {...props}
      {...visual}
      data-size={size}
      className={withClassName("dixy-context-menu-item", className)}
    />
  );
}

export interface ContextMenuLinkItemProps extends Omit<
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
function ContextMenuLinkItemVisual({
  size,
  color,
  radius,
  className,
  ...props
}: ContextMenuLinkItemProps) {
  const visual = useComponentVisuals(
    { size, color, radius },
    { variant: "soft" },
  );
  return (
    <Primitive.LinkItem
      {...props}
      {...visual}
      data-size={size}
      className={withClassName("dixy-context-menu-link-item", className)}
    />
  );
}

/** Dixy token styles with the complete Base UI ContextMenu contract. */
export const ContextMenu = /* @__PURE__ */ (() => ({
  ...Primitive,
  Trigger: /* @__PURE__ */ styledPrimitive(
    Primitive.Trigger,
    "dixy-context-menu-trigger",
  ),
  Backdrop: /* @__PURE__ */ styledPrimitive(
    Primitive.Backdrop,
    "dixy-context-menu-backdrop",
  ),
  Positioner: /* @__PURE__ */ styledPrimitive(
    Primitive.Positioner,
    "dixy-context-menu-positioner",
  ),
  Popup: ContextMenuPopupVisual,
  Arrow: /* @__PURE__ */ styledPrimitive(
    Primitive.Arrow,
    "dixy-context-menu-arrow",
  ),
  Group: /* @__PURE__ */ styledPrimitive(
    Primitive.Group,
    "dixy-context-menu-group",
  ),
  GroupLabel: /* @__PURE__ */ styledPrimitive(
    Primitive.GroupLabel,
    "dixy-context-menu-group-label",
  ),
  Item: ContextMenuItemVisual,
  CheckboxItem: /* @__PURE__ */ styledPrimitive(
    Primitive.CheckboxItem,
    "dixy-context-menu-checkbox-item",
  ),
  CheckboxItemIndicator: /* @__PURE__ */ defaultArtwork(
    Primitive.CheckboxItemIndicator,
    "dixy-context-menu-checkbox-item-indicator",
    "check",
  ),
  LinkItem: ContextMenuLinkItemVisual,
  RadioGroup: /* @__PURE__ */ styledPrimitive(
    Primitive.RadioGroup,
    "dixy-context-menu-radio-group",
  ),
  RadioItem: /* @__PURE__ */ styledPrimitive(
    Primitive.RadioItem,
    "dixy-context-menu-radio-item",
  ),
  RadioItemIndicator: /* @__PURE__ */ defaultArtwork(
    Primitive.RadioItemIndicator,
    "dixy-context-menu-radio-item-indicator",
    "dot",
  ),
  SubmenuTrigger: /* @__PURE__ */ styledPrimitive(
    Primitive.SubmenuTrigger,
    "dixy-context-menu-submenu-trigger",
  ),
  Separator: /* @__PURE__ */ styledPrimitive(
    Primitive.Separator,
    "dixy-context-menu-separator",
  ),
  Portal: /* @__PURE__ */ themedPortal(Primitive.Portal),
}))();
export type * from "@base-ui/react/context-menu";
