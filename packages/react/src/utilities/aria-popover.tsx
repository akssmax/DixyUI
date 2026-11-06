import { Popover, type PopoverProps } from "react-aria-components/Popover";
import { ThemeScope } from "../theme/theme";
import { withClassName } from "./class-name";
export interface AriaPopoverProps extends PopoverProps {
  /** Required name for the portaled dialog surface. */ "aria-label": string;
}
/** Preserve React Aria presence/focus while restoring portaled Dixy tokens. */
export function AriaPopover({
  children,
  className,
  ...props
}: AriaPopoverProps) {
  return (
    <Popover
      {...props}
      className={withClassName("dixy-aria-popover", className)}
    >
      {(state) => (
        <ThemeScope>
          {typeof children === "function" ? children(state) : children}
        </ThemeScope>
      )}
    </Popover>
  );
}
