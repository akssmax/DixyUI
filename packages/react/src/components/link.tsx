import {
  Link as Primitive,
  type LinkProps as PrimitiveProps,
} from "react-aria-components/Link";
import type { VisualProps } from "../utilities/native-part";
import { useComponentVisuals } from "../utilities/component-visuals";
import { withClassName } from "../utilities/class-name";
export interface LinkProps extends Omit<PrimitiveProps, "color"> {
  /** Label size. @default md */ size?: "sm" | "md" | "lg";
  /** Semantic link color. @default accent */ color?:
    "accent" | "neutral" | "danger" | "success";
}
export function Link({ size, color, className, ...props }: LinkProps) {
  const visual = useComponentVisuals({ size, color });
  return (
    <Primitive
      {...props}
      {...visual}
      className={withClassName("dixy-link", className)}
    />
  );
}
