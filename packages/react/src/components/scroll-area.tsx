import { ScrollArea as Primitive } from "@base-ui/react/scroll-area";
import type { ComponentProps } from "react";
import type { RadiusPreset } from "@dixy-ui/tokens";
import { useComponentVisuals } from "../utilities/component-visuals";
import { withClassName } from "../utilities/class-name";
import { styledPrimitive } from "../utilities/styled-primitive";

export interface ScrollAreaRootProps extends Omit<
  ComponentProps<typeof Primitive.Root>,
  "size" | "variant" | "radius"
> {
  /** Visual scrollbar thickness; viewport bounds are supplied by the consumer. @default md */
  size?: "sm" | "md" | "lg";
  /** Visual emphasis; behavioral state remains primitive-owned. @default plain */
  variant?: "plain" | "outline" | "soft";
  /** Contextual rounding; panels cap full rounding to preserve content. @default Theme.radius */
  radius?: RadiusPreset;
}
function ScrollAreaRootVisual({
  size,
  variant,
  radius,
  className,
  ...props
}: ScrollAreaRootProps) {
  const visual = useComponentVisuals(
    { size, variant, radius },
    { variant: "plain" },
  );
  return (
    <Primitive.Root
      {...props}
      {...visual}
      className={withClassName("dixy-scroll-area-root", className)}
    />
  );
}

/** Dixy token styles with the complete Base UI ScrollArea contract. */
export const ScrollArea = /* @__PURE__ */ (() => ({
  ...Primitive,
  Root: ScrollAreaRootVisual,
  Viewport: /* @__PURE__ */ styledPrimitive(
    Primitive.Viewport,
    "dixy-scroll-area-viewport",
  ),
  Scrollbar: /* @__PURE__ */ styledPrimitive(
    Primitive.Scrollbar,
    "dixy-scroll-area-scrollbar",
  ),
  Content: /* @__PURE__ */ styledPrimitive(
    Primitive.Content,
    "dixy-scroll-area-content",
  ),
  Thumb: /* @__PURE__ */ styledPrimitive(
    Primitive.Thumb,
    "dixy-scroll-area-thumb",
  ),
  Corner: /* @__PURE__ */ styledPrimitive(
    Primitive.Corner,
    "dixy-scroll-area-corner",
  ),
}))();
export type * from "@base-ui/react/scroll-area";
