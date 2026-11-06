import { CheckboxGroup as Primitive } from "@base-ui/react/checkbox-group";
import type { ComponentProps } from "react";
import { withClassName } from "../utilities/class-name";
export interface CheckboxGroupProps extends ComponentProps<typeof Primitive> {
  /** Arrange labeled choices. @default vertical */ orientation?:
    "horizontal" | "vertical";
  /** Spacing between choices. @default md */ gap?: "sm" | "md" | "lg";
}
export function CheckboxGroup({
  orientation = "vertical",
  gap = "md",
  className,
  ...props
}: CheckboxGroupProps) {
  return (
    <Primitive
      {...props}
      data-orientation={orientation}
      data-gap={gap}
      className={withClassName("dixy-checkbox-group", className)}
    />
  );
}
export type * from "@base-ui/react/checkbox-group";
