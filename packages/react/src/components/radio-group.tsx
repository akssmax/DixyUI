import {
  RadioGroup as Primitive,
  type RadioGroupProps as BaseRadioGroupProps,
} from "@base-ui/react/radio-group";
import { withClassName } from "../utilities/class-name";
export interface RadioGroupProps<
  Value = unknown,
> extends BaseRadioGroupProps<Value> {
  /** Visual layout; native radio keyboard behavior is unchanged. @default vertical */
  orientation?: "horizontal" | "vertical";
}
export function RadioGroup<Value = unknown>({
  orientation = "vertical",
  className,
  ...props
}: RadioGroupProps<Value>) {
  return (
    <Primitive
      {...props}
      data-orientation={orientation}
      className={withClassName("dixy-radio-group", className)}
    />
  );
}
export type * from "@base-ui/react/radio-group";
