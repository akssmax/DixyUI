import {
  ToggleGroup as Primitive,
  type ToggleGroupProps as BaseToggleGroupProps,
} from "@base-ui/react/toggle-group";
import { withClassName } from "../utilities/class-name";
export interface ToggleGroupProps<
  Value extends string = string,
> extends BaseToggleGroupProps<Value> {
  /** Visually connect adjacent toggles without changing single/multiple selection. @default false */
  attached?: boolean;
}
export function ToggleGroup<Value extends string = string>({
  attached = false,
  className,
  ...props
}: ToggleGroupProps<Value>) {
  return (
    <Primitive
      {...props}
      data-attached={attached || undefined}
      className={withClassName("dixy-toggle-group", className)}
    />
  );
}
export type * from "@base-ui/react/toggle-group";
