import { NavigationMenu as Primitive } from "@base-ui/react/navigation-menu";
import type { ComponentProps } from "react";
import type { Material, RadiusPreset } from "@dixy-ui/tokens";
import { useComponentVisuals } from "../utilities/component-visuals";
import { withClassName } from "../utilities/class-name";
import { styledPrimitive, themedPortal } from "../utilities/styled-primitive";

export interface NavigationMenuRootProps extends Omit<
  ComponentProps<typeof Primitive.Root>,
  "size" | "variant" | "radius"
> {
  /** Component proportions; preserves the shared interaction target. @default md */
  size?: "sm" | "md" | "lg";
  /** Visual emphasis; behavioral state remains primitive-owned. @default plain */
  variant?: "plain" | "outline" | "soft";
  /** Contextual rounding; panels cap full rounding to preserve content. @default Theme.radius */
  radius?: RadiusPreset;
}
function NavigationMenuRootVisual({
  size,
  variant,
  radius,
  className,
  ...props
}: NavigationMenuRootProps) {
  const visual = useComponentVisuals(
    { size, variant, radius },
    { variant: "plain" },
  );
  return (
    <Primitive.Root
      {...props}
      {...visual}
      className={withClassName("dixy-navigation-menu-root", className)}
    />
  );
}

export interface NavigationMenuPopupProps extends Omit<
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
function NavigationMenuPopupVisual({
  size,
  variant,
  radius,
  material,
  className,
  ...props
}: NavigationMenuPopupProps) {
  const visual = useComponentVisuals(
    { size, variant, radius, material },
    { variant: "outline" },
  );
  return (
    <Primitive.Popup
      {...props}
      {...visual}
      className={withClassName("dixy-navigation-menu-popup", className)}
    />
  );
}

/** Dixy token styles with the complete Base UI NavigationMenu contract. */
export const NavigationMenu = /* @__PURE__ */ (() => ({
  ...Primitive,
  Root: NavigationMenuRootVisual,
  List: /* @__PURE__ */ styledPrimitive(
    Primitive.List,
    "dixy-navigation-menu-list",
  ),
  Item: /* @__PURE__ */ styledPrimitive(
    Primitive.Item,
    "dixy-navigation-menu-item",
  ),
  Content: /* @__PURE__ */ styledPrimitive(
    Primitive.Content,
    "dixy-navigation-menu-content",
  ),
  Trigger: /* @__PURE__ */ styledPrimitive(
    Primitive.Trigger,
    "dixy-navigation-menu-trigger",
  ),
  Positioner: /* @__PURE__ */ styledPrimitive(
    Primitive.Positioner,
    "dixy-navigation-menu-positioner",
  ),
  Viewport: /* @__PURE__ */ styledPrimitive(
    Primitive.Viewport,
    "dixy-navigation-menu-viewport",
  ),
  Backdrop: /* @__PURE__ */ styledPrimitive(
    Primitive.Backdrop,
    "dixy-navigation-menu-backdrop",
  ),
  Popup: NavigationMenuPopupVisual,
  Arrow: /* @__PURE__ */ styledPrimitive(
    Primitive.Arrow,
    "dixy-navigation-menu-arrow",
  ),
  Link: /* @__PURE__ */ styledPrimitive(
    Primitive.Link,
    "dixy-navigation-menu-link",
  ),
  Icon: /* @__PURE__ */ styledPrimitive(
    Primitive.Icon,
    "dixy-navigation-menu-icon",
  ),
  Portal: /* @__PURE__ */ themedPortal(Primitive.Portal),
}))();
export type * from "@base-ui/react/navigation-menu";
