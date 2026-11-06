import { NumberField as Primitive } from "@base-ui/react/number-field";
import type { ComponentProps } from "react";
import type { Material, RadiusPreset } from "@dixy-ui/tokens";
import { useComponentVisuals } from "../utilities/component-visuals";
import { withClassName } from "../utilities/class-name";
import { styledPrimitive } from "../utilities/styled-primitive";

export interface NumberFieldRootProps extends Omit<
  ComponentProps<typeof Primitive.Root>,
  "size" | "variant" | "radius" | "material"
> {
  /** Input and stepper proportions. @default md */
  size?: "sm" | "md" | "lg";
  /** Visual emphasis; behavioral state remains primitive-owned. @default outline */
  variant?: "outline" | "soft";
  /** Contextual rounding; panels cap full rounding to preserve content. @default Theme.radius */
  radius?: RadiusPreset;
  /** Optional static finish; import materials.css. @default Theme.material */
  material?: Material;
}
function NumberFieldRootVisual({
  size,
  variant,
  radius,
  material,
  className,
  ...props
}: NumberFieldRootProps) {
  const visual = useComponentVisuals(
    { size, variant, radius, material },
    { variant: "outline" },
  );
  return (
    <Primitive.Root
      {...props}
      {...visual}
      className={withClassName("dixy-number-field-root", className)}
    />
  );
}

/** Dixy token styles with the complete Base UI NumberField contract. */
export const NumberField = /* @__PURE__ */ (() => ({
  ...Primitive,
  Root: NumberFieldRootVisual,
  Group: /* @__PURE__ */ styledPrimitive(
    Primitive.Group,
    "dixy-number-field-group",
  ),
  Increment: /* @__PURE__ */ styledPrimitive(
    Primitive.Increment,
    "dixy-number-field-increment",
  ),
  Decrement: /* @__PURE__ */ styledPrimitive(
    Primitive.Decrement,
    "dixy-number-field-decrement",
  ),
  Input: /* @__PURE__ */ styledPrimitive(
    Primitive.Input,
    "dixy-number-field-input",
  ),
  ScrubArea: /* @__PURE__ */ styledPrimitive(
    Primitive.ScrubArea,
    "dixy-number-field-scrub-area",
  ),
  ScrubAreaCursor: /* @__PURE__ */ styledPrimitive(
    Primitive.ScrubAreaCursor,
    "dixy-number-field-scrub-area-cursor",
  ),
}))();
export type * from "@base-ui/react/number-field";
