import { Form as Primitive } from "@base-ui/react/form";
import type { ComponentProps } from "react";
import { withClassName } from "../utilities/class-name";
export interface FormProps extends ComponentProps<typeof Primitive> {
  /** Space between fields without changing validation. @default md */ gap?:
    "sm" | "md" | "lg";
}
export function Form({ gap = "md", className, ...props }: FormProps) {
  return (
    <Primitive
      {...props}
      data-gap={gap}
      className={withClassName("dixy-form", className)}
    />
  );
}
export type * from "@base-ui/react/form";
