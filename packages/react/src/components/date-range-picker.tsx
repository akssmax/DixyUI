import * as Primitive from "react-aria-components/DateRangePicker";
import type { DateValue } from "react-aria-components/DatePicker";
import type { VisualProps } from "../utilities/native-part";
import { useComponentVisuals } from "../utilities/component-visuals";
import { withClassName } from "../utilities/class-name";
import { styledPrimitive } from "../utilities/styled-primitive";
import { AriaPopover } from "../utilities/aria-popover";
export interface DateRangePickerRootProps<T extends DateValue>
  extends
    Omit<Primitive.DateRangePickerProps<T>, keyof VisualProps>,
    VisualProps {}
function Root<T extends DateValue>({
  size,
  radius,
  className,
  ...props
}: DateRangePickerRootProps<T>) {
  const visual = useComponentVisuals({
    size,
    radius,
  });
  return (
    <Primitive.DateRangePicker
      {...props}
      {...visual}
      className={withClassName(
        "dixy-aria-root dixy-date-range-picker",
        className,
      )}
    />
  );
}
export const DateRangePicker = /* @__PURE__ */ (() => ({
  Root,
  Input: /* @__PURE__ */ styledPrimitive(
    Primitive.DateInput,
    "dixy-aria-dateinput",
  ),
  Segment: /* @__PURE__ */ styledPrimitive(
    Primitive.DateSegment,
    "dixy-aria-datesegment",
  ),
  Label: /* @__PURE__ */ styledPrimitive(Primitive.Label, "dixy-aria-label"),
  Group: /* @__PURE__ */ styledPrimitive(Primitive.Group, "dixy-aria-group"),
  Button: /* @__PURE__ */ styledPrimitive(Primitive.Button, "dixy-aria-button"),
  Description: /* @__PURE__ */ styledPrimitive(
    Primitive.Text,
    "dixy-aria-text",
  ),
  Error: /* @__PURE__ */ styledPrimitive(
    Primitive.FieldError,
    "dixy-aria-fielderror",
  ),
  Popover: AriaPopover,
}))();
