import { Separator as Primitive } from "@base-ui/react/separator";
import type { ComponentProps } from "react";
import { withClassName } from "../utilities/class-name";
export interface SeparatorProps extends ComponentProps<typeof Primitive> {
  /** Divider emphasis. @default subtle */ emphasis?: "subtle" | "strong";
}
export function Separator({
  emphasis = "subtle",
  className,
  ...props
}: SeparatorProps) {
  return (
    <Primitive
      {...props}
      data-emphasis={emphasis}
      className={withClassName("dixy-separator", className)}
    />
  );
}
export type * from "@base-ui/react/separator";
