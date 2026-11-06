import { Accordion as Primitive } from "@base-ui/react/accordion";
import type { ComponentProps } from "react";
import type { RadiusPreset } from "@dixy-ui/tokens";
import { useComponentVisuals } from "../utilities/component-visuals";
import { withClassName } from "../utilities/class-name";
import { styledPrimitive } from "../utilities/styled-primitive";

export interface AccordionRootProps extends Omit<
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
function AccordionRootVisual({
  size,
  variant,
  radius,
  className,
  ...props
}: AccordionRootProps) {
  const visual = useComponentVisuals(
    { size, variant, radius },
    { variant: "plain" },
  );
  return (
    <Primitive.Root
      {...props}
      {...visual}
      className={withClassName("dixy-accordion-root", className)}
    />
  );
}

/** Dixy token styles with the complete Base UI Accordion contract. */
export const Accordion = /* @__PURE__ */ (() => ({
  ...Primitive,
  Root: AccordionRootVisual,
  Item: /* @__PURE__ */ styledPrimitive(Primitive.Item, "dixy-accordion-item"),
  Header: /* @__PURE__ */ styledPrimitive(
    Primitive.Header,
    "dixy-accordion-header",
  ),
  Trigger: /* @__PURE__ */ styledPrimitive(
    Primitive.Trigger,
    "dixy-accordion-trigger",
  ),
  Panel: /* @__PURE__ */ styledPrimitive(
    Primitive.Panel,
    "dixy-accordion-panel",
  ),
}))();
export type * from "@base-ui/react/accordion";
