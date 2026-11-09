import { Combobox as Primitive } from "@base-ui/react/combobox";
import { defaultArtwork } from "../utilities/default-artwork";
import type { ComponentProps } from "react";
import type { Material, RadiusPreset } from "@dixy-ui/tokens";
import { useComponentVisuals } from "../utilities/component-visuals";
import { withClassName } from "../utilities/class-name";
import { styledPrimitive, themedPortal } from "../utilities/styled-primitive";

export interface ComboboxInputProps extends Omit<
  ComponentProps<typeof Primitive.Input>,
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
function ComboboxInputVisual({
  size,
  variant,
  radius,
  material,
  className,
  ...props
}: ComboboxInputProps) {
  const visual = useComponentVisuals(
    { size, variant, radius, material },
    { variant: "outline" },
  );
  return (
    <Primitive.Input
      {...props}
      {...visual}
      className={withClassName("dixy-combobox-input", className)}
    />
  );
}

export interface ComboboxInputGroupProps extends Omit<
  ComponentProps<typeof Primitive.InputGroup>,
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
function ComboboxInputGroupVisual({
  size,
  variant,
  radius,
  material,
  className,
  ...props
}: ComboboxInputGroupProps) {
  const visual = useComponentVisuals(
    { size, variant, radius, material },
    { variant: "outline" },
  );
  return (
    <Primitive.InputGroup
      {...props}
      {...visual}
      className={withClassName("dixy-combobox-input-group", className)}
    />
  );
}

export interface ComboboxPopupProps extends Omit<
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
function ComboboxPopupVisual({
  size,
  variant,
  radius,
  material,
  className,
  ...props
}: ComboboxPopupProps) {
  const visual = useComponentVisuals(
    { size, variant, radius, material },
    { variant: "outline" },
  );
  return (
    <Primitive.Popup
      {...props}
      {...visual}
      className={withClassName("dixy-combobox-popup", className)}
    />
  );
}

/** Dixy token styles with the complete Base UI Combobox contract. */
export const Combobox = /* @__PURE__ */ (() => ({
  ...Primitive,
  Label: /* @__PURE__ */ styledPrimitive(
    Primitive.Label,
    "dixy-combobox-label",
  ),
  Input: ComboboxInputVisual,
  InputGroup: ComboboxInputGroupVisual,
  Trigger: /* @__PURE__ */ defaultArtwork(
    Primitive.Trigger,
    "dixy-combobox-trigger",
    "chevron",
    false,
  ),
  List: /* @__PURE__ */ styledPrimitive(Primitive.List, "dixy-combobox-list"),
  Status: /* @__PURE__ */ styledPrimitive(
    Primitive.Status,
    "dixy-combobox-status",
  ),
  Backdrop: /* @__PURE__ */ styledPrimitive(
    Primitive.Backdrop,
    "dixy-combobox-backdrop",
  ),
  Positioner: /* @__PURE__ */ styledPrimitive(
    Primitive.Positioner,
    "dixy-combobox-positioner",
  ),
  Popup: ComboboxPopupVisual,
  Arrow: /* @__PURE__ */ styledPrimitive(
    Primitive.Arrow,
    "dixy-combobox-arrow",
  ),
  Icon: /* @__PURE__ */ styledPrimitive(Primitive.Icon, "dixy-combobox-icon"),
  Group: /* @__PURE__ */ styledPrimitive(
    Primitive.Group,
    "dixy-combobox-group",
  ),
  GroupLabel: /* @__PURE__ */ styledPrimitive(
    Primitive.GroupLabel,
    "dixy-combobox-group-label",
  ),
  Item: /* @__PURE__ */ styledPrimitive(Primitive.Item, "dixy-combobox-item"),
  ItemIndicator: /* @__PURE__ */ defaultArtwork(
    Primitive.ItemIndicator,
    "dixy-combobox-item-indicator",
    "check",
  ),
  Chips: /* @__PURE__ */ styledPrimitive(
    Primitive.Chips,
    "dixy-combobox-chips",
  ),
  Chip: /* @__PURE__ */ styledPrimitive(Primitive.Chip, "dixy-combobox-chip"),
  ChipRemove: /* @__PURE__ */ defaultArtwork(
    Primitive.ChipRemove,
    "dixy-combobox-chip-remove",
    "close",
    false,
  ),
  Row: /* @__PURE__ */ styledPrimitive(Primitive.Row, "dixy-combobox-row"),
  Empty: /* @__PURE__ */ styledPrimitive(
    Primitive.Empty,
    "dixy-combobox-empty",
  ),
  Clear: /* @__PURE__ */ defaultArtwork(
    Primitive.Clear,
    "dixy-combobox-clear",
    "close",
    false,
  ),
  Separator: /* @__PURE__ */ styledPrimitive(
    Primitive.Separator,
    "dixy-combobox-separator",
  ),
  Portal: /* @__PURE__ */ themedPortal(Primitive.Portal),
}))();
export type * from "@base-ui/react/combobox";
