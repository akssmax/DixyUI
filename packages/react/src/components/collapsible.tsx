import { Collapsible as Primitive } from "@base-ui/react/collapsible";
import type { ComponentProps } from "react";
import type { RadiusPreset } from "@dixy-ui/tokens";
import { useComponentVisuals } from "../utilities/component-visuals";
import { withClassName } from "../utilities/class-name";
import { styledPrimitive } from "../utilities/styled-primitive";

export interface CollapsibleRootProps extends Omit<
  ComponentProps<typeof Primitive.Root>,
  "size" | "variant" | "radius"
> {
  /** Trigger height and typography. @default md */
  size?: "sm" | "md" | "lg";
  /** Visual emphasis; behavioral state remains primitive-owned. @default plain */
  variant?: "plain" | "outline" | "soft";
  /** Contextual rounding; panels cap full rounding to preserve content. @default Theme.radius */
  radius?: RadiusPreset;
}
function CollapsibleRootVisual({
  size,
  variant,
  radius,
  className,
  ...props
}: CollapsibleRootProps) {
  const visual = useComponentVisuals(
    { size, variant, radius },
    { variant: "plain" },
  );
  return (
    <Primitive.Root
      {...props}
      {...visual}
      className={withClassName("dixy-collapsible-root", className)}
    />
  );
}

/** Dixy token styles with the complete Base UI Collapsible contract. */
export const Collapsible = /* @__PURE__ */ (() => ({
  ...Primitive,
  Root: CollapsibleRootVisual,
  Trigger: /* @__PURE__ */ styledPrimitive(
    Primitive.Trigger,
    "dixy-collapsible-trigger",
  ),
  Panel: /* @__PURE__ */ styledPrimitive(
    Primitive.Panel,
    "dixy-collapsible-panel",
  ),
}))();
export type * from "@base-ui/react/collapsible";
