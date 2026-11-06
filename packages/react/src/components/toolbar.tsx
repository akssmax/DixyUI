import { Toolbar as Primitive } from "@base-ui/react/toolbar";
import type { ComponentProps } from "react";
import type { RadiusPreset } from "@dixy-ui/tokens";
import { useComponentVisuals } from "../utilities/component-visuals";
import { withClassName } from "../utilities/class-name";
import { styledPrimitive } from "../utilities/styled-primitive";

export interface ToolbarRootProps extends ComponentProps<
  typeof Primitive.Root
> {
  /** Proportions for contained toolbar controls. @default md */ size?:
    "sm" | "md" | "lg";
  /** Toolbar surface. @default plain */ variant?: "plain" | "outline" | "soft";
  /** Toolbar rounding. @default Theme.radius */ radius?: RadiusPreset;
}
function Root({
  size,
  variant,
  radius,
  className,
  ...props
}: ToolbarRootProps) {
  const visual = useComponentVisuals(
    { size, variant, radius },
    { variant: "plain" },
  );
  return (
    <Primitive.Root
      {...props}
      {...visual}
      className={withClassName("dixy-toolbar-root", className)}
    />
  );
}

/** Dixy token styles with the complete Base UI Toolbar contract. */
export const Toolbar = /* @__PURE__ */ (() => ({
  ...Primitive,
  Separator: /* @__PURE__ */ styledPrimitive(
    Primitive.Separator,
    "dixy-toolbar-separator",
  ),
  Root: Root,
  Group: /* @__PURE__ */ styledPrimitive(Primitive.Group, "dixy-toolbar-group"),
  Button: /* @__PURE__ */ styledPrimitive(
    Primitive.Button,
    "dixy-toolbar-button",
  ),
  Link: /* @__PURE__ */ styledPrimitive(Primitive.Link, "dixy-toolbar-link"),
  Input: /* @__PURE__ */ styledPrimitive(Primitive.Input, "dixy-toolbar-input"),
}))();
export type * from "@base-ui/react/toolbar";
