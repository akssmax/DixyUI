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
  /**
   * Draw the group as a segmented control: a sunken track with a raised
   * surface thumb on each pressed toggle. Replaces `attached` and overrides
   * the toggles' variant and color for the pressed state; selection,
   * focus and keyboard behaviour are unchanged.
   * @default false
   */
  segmented?: boolean;
}
export function ToggleGroup<Value extends string = string>({
  attached = false,
  segmented = false,
  className,
  ...props
}: ToggleGroupProps<Value>) {
  return (
    <Primitive
      {...props}
      data-attached={(attached && !segmented) || undefined}
      data-segmented={segmented || undefined}
      className={withClassName("dixy-toggle-group", className)}
    />
  );
}
export type * from "@base-ui/react/toggle-group";
