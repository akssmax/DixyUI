import { Fieldset as Primitive } from "@base-ui/react/fieldset";
import type { ComponentProps } from "react";
import type { RadiusPreset } from "@dixy-ui/tokens";
import { useComponentVisuals } from "../utilities/component-visuals";
import { withClassName } from "../utilities/class-name";
import { styledPrimitive } from "../utilities/styled-primitive";

export interface FieldsetRootProps extends Omit<
  ComponentProps<typeof Primitive.Root>,
  "size" | "variant" | "radius"
> {
  /** Legend and field proportions. @default md */
  size?: "sm" | "md" | "lg";
  /** Visual emphasis; behavioral state remains primitive-owned. @default plain */
  variant?: "plain" | "outline" | "soft";
  /** Contextual rounding; panels cap full rounding to preserve content. @default Theme.radius */
  radius?: RadiusPreset;
}
function FieldsetRootVisual({
  size,
  variant,
  radius,
  className,
  ...props
}: FieldsetRootProps) {
  const visual = useComponentVisuals(
    { size, variant, radius },
    { variant: "plain" },
  );
  return (
    <Primitive.Root
      {...props}
      {...visual}
      className={withClassName("dixy-fieldset-root", className)}
    />
  );
}

/** Dixy token styles with the complete Base UI Fieldset contract. */
export const Fieldset = /* @__PURE__ */ (() => ({
  ...Primitive,
  Root: FieldsetRootVisual,
  Legend: /* @__PURE__ */ styledPrimitive(
    Primitive.Legend,
    "dixy-fieldset-legend",
  ),
}))();
export type * from "@base-ui/react/fieldset";
