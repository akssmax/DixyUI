import { Radio as Primitive } from "@base-ui/react/radio";
import type { ComponentProps } from "react";
import type { Material } from "@dixy-ui/tokens";
import { useComponentVisuals } from "../utilities/component-visuals";
import { withClassName } from "../utilities/class-name";
import { styledPrimitive } from "../utilities/styled-primitive";

export interface RadioRootProps extends Omit<
  ComponentProps<typeof Primitive.Root>,
  "size" | "variant" | "color" | "material"
> {
  /** Component proportions; preserves the shared interaction target. @default md */
  size?: "sm" | "md" | "lg";
  /** Visual emphasis; behavioral state remains primitive-owned. @default solid */
  variant?: "solid" | "soft" | "outline";
  /** Semantic emphasis; unselected controls remain neutral. @default accent */
  color?: "accent" | "neutral" | "danger" | "success";
  /** Optional static finish; import materials.css. @default Theme.material */
  material?: Material;
}
function RadioRootVisual({
  size,
  variant,
  color,
  material,
  className,
  ...props
}: RadioRootProps) {
  const visual = useComponentVisuals(
    { size, variant, color, material },
    { variant: "solid" },
  );
  return (
    <Primitive.Root
      {...props}
      {...visual}
      className={withClassName("dixy-radio-root", className)}
    />
  );
}

/** Dixy token styles with the complete Base UI Radio contract. */
export const Radio = /* @__PURE__ */ (() => ({
  ...Primitive,
  Root: RadioRootVisual,
  Indicator: /* @__PURE__ */ styledPrimitive(
    Primitive.Indicator,
    "dixy-radio-indicator",
  ),
}))();
export type * from "@base-ui/react/radio";
