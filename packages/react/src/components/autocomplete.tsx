import { Autocomplete as Primitive } from "@base-ui/react/autocomplete";
import { defaultArtwork } from "../utilities/default-artwork";
import type { ComponentProps } from "react";
import type { Material, RadiusPreset } from "@dixy-ui/tokens";
import { useComponentVisuals } from "../utilities/component-visuals";
import { withClassName } from "../utilities/class-name";
import { styledPrimitive, themedPortal } from "../utilities/styled-primitive";

export interface AutocompleteInputProps extends Omit<
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
function AutocompleteInputVisual({
  size,
  variant,
  radius,
  material,
  className,
  ...props
}: AutocompleteInputProps) {
  const visual = useComponentVisuals(
    { size, variant, radius, material },
    { variant: "outline" },
  );
  return (
    <Primitive.Input
      {...props}
      {...visual}
      className={withClassName("dixy-autocomplete-input", className)}
    />
  );
}

export interface AutocompleteInputGroupProps extends Omit<
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
function AutocompleteInputGroupVisual({
  size,
  variant,
  radius,
  material,
  className,
  ...props
}: AutocompleteInputGroupProps) {
  const visual = useComponentVisuals(
    { size, variant, radius, material },
    { variant: "outline" },
  );
  return (
    <Primitive.InputGroup
      {...props}
      {...visual}
      className={withClassName("dixy-autocomplete-input-group", className)}
    />
  );
}

export interface AutocompletePopupProps extends Omit<
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
function AutocompletePopupVisual({
  size,
  variant,
  radius,
  material,
  className,
  ...props
}: AutocompletePopupProps) {
  const visual = useComponentVisuals(
    { size, variant, radius, material },
    { variant: "outline" },
  );
  return (
    <Primitive.Popup
      {...props}
      {...visual}
      className={withClassName("dixy-autocomplete-popup", className)}
    />
  );
}

/** Dixy token styles with the complete Base UI Autocomplete contract. */
export const Autocomplete = /* @__PURE__ */ (() => ({
  ...Primitive,
  Trigger: /* @__PURE__ */ defaultArtwork(
    Primitive.Trigger,
    "dixy-autocomplete-trigger",
    "chevron",
    false,
  ),
  Input: AutocompleteInputVisual,
  InputGroup: AutocompleteInputGroupVisual,
  Icon: /* @__PURE__ */ styledPrimitive(
    Primitive.Icon,
    "dixy-autocomplete-icon",
  ),
  Clear: /* @__PURE__ */ defaultArtwork(
    Primitive.Clear,
    "dixy-autocomplete-clear",
    "close",
    false,
  ),
  List: /* @__PURE__ */ styledPrimitive(
    Primitive.List,
    "dixy-autocomplete-list",
  ),
  Status: /* @__PURE__ */ styledPrimitive(
    Primitive.Status,
    "dixy-autocomplete-status",
  ),
  Backdrop: /* @__PURE__ */ styledPrimitive(
    Primitive.Backdrop,
    "dixy-autocomplete-backdrop",
  ),
  Positioner: /* @__PURE__ */ styledPrimitive(
    Primitive.Positioner,
    "dixy-autocomplete-positioner",
  ),
  Popup: AutocompletePopupVisual,
  Arrow: /* @__PURE__ */ styledPrimitive(
    Primitive.Arrow,
    "dixy-autocomplete-arrow",
  ),
  Group: /* @__PURE__ */ styledPrimitive(
    Primitive.Group,
    "dixy-autocomplete-group",
  ),
  GroupLabel: /* @__PURE__ */ styledPrimitive(
    Primitive.GroupLabel,
    "dixy-autocomplete-group-label",
  ),
  Item: /* @__PURE__ */ styledPrimitive(
    Primitive.Item,
    "dixy-autocomplete-item",
  ),
  Row: /* @__PURE__ */ styledPrimitive(Primitive.Row, "dixy-autocomplete-row"),
  Empty: /* @__PURE__ */ styledPrimitive(
    Primitive.Empty,
    "dixy-autocomplete-empty",
  ),
  Separator: /* @__PURE__ */ styledPrimitive(
    Primitive.Separator,
    "dixy-autocomplete-separator",
  ),
  Portal: /* @__PURE__ */ themedPortal(Primitive.Portal),
}))();
export type * from "@base-ui/react/autocomplete";
