import {
  ToggleGroup as Primitive,
  type ToggleGroupProps as BaseToggleGroupProps,
} from "@base-ui/react/toggle-group";
import { withClassName } from "../utilities/class-name";
import { useThemeSettings } from "../theme/theme";
export interface ToggleGroupProps<
  Value extends string = string,
> extends BaseToggleGroupProps<Value> {
  /**
   * Visually connect adjacent toggles without changing single/multiple
   * selection. Under Theme morph="press" an attached group becomes an M3
   * connected button group: it spans its container in equal segments with
   * small gaps and round ends, and only shape changes (the pressed segment
   * squares off, the selected one goes fully round). A separate group under
   * morph="press" is an M3 standard group: the pressed toggle widens and its
   * neighbours give way.
   * @default false
   */
  attached?: boolean;
  /**
   * Draw the group as a segmented control: a sunken track with a raised
   * surface thumb on each pressed toggle. Replaces `attached` and overrides
   * the toggles' variant and color for the pressed state; selection,
   * focus and keyboard behaviour are unchanged. Under Theme morph="press"
   * it draws as a connected button group instead.
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
  const theme = useThemeSettings();
  const joined = attached && !segmented;
  return (
    <Primitive
      {...props}
      data-attached={joined || undefined}
      data-connected={
        ((joined || segmented) && theme.morph === "press") || undefined
      }
      data-expressive={
        (!joined && !segmented && theme.morph === "press") || undefined
      }
      data-segmented={segmented || undefined}
      className={withClassName("dixy-toggle-group", className)}
    />
  );
}
export type * from "@base-ui/react/toggle-group";
