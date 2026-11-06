import { OTPField as Primitive } from "@base-ui/react/otp-field";
import type { ComponentProps } from "react";
import type { Material, RadiusPreset } from "@dixy-ui/tokens";
import { useComponentVisuals } from "../utilities/component-visuals";
import { withClassName } from "../utilities/class-name";
import { styledPrimitive } from "../utilities/styled-primitive";

export interface OTPFieldRootProps extends Omit<
  ComponentProps<typeof Primitive.Root>,
  "size" | "variant" | "radius" | "material"
> {
  /** Digit slot dimensions. @default md */
  size?: "sm" | "md" | "lg";
  /** Visual emphasis; behavioral state remains primitive-owned. @default outline */
  variant?: "outline" | "soft";
  /** Contextual rounding; panels cap full rounding to preserve content. @default Theme.radius */
  radius?: RadiusPreset;
  /** Optional static finish; import materials.css. @default Theme.material */
  material?: Material;
}
function OTPFieldRootVisual({
  size,
  variant,
  radius,
  material,
  className,
  ...props
}: OTPFieldRootProps) {
  const visual = useComponentVisuals(
    { size, variant, radius, material },
    { variant: "outline" },
  );
  return (
    <Primitive.Root
      {...props}
      {...visual}
      className={withClassName("dixy-otp-field-root", className)}
    />
  );
}

/** Dixy token styles with the complete Base UI OTPField contract. */
export const OTPField = /* @__PURE__ */ (() => ({
  ...Primitive,
  Root: OTPFieldRootVisual,
  Input: /* @__PURE__ */ styledPrimitive(
    Primitive.Input,
    "dixy-otp-field-input",
  ),
  Separator: /* @__PURE__ */ styledPrimitive(
    Primitive.Separator,
    "dixy-otp-field-separator",
  ),
}))();
export type * from "@base-ui/react/otp-field";
