import * as Primitive from "react-aria-components/DatePicker";
import type { DateValue } from "react-aria-components/DatePicker";
import type { VisualProps } from "../utilities/native-part";
import { useComponentVisuals } from "../utilities/component-visuals";
import { withClassName } from "../utilities/class-name";
import { styledPrimitive } from "../utilities/styled-primitive";
import { defaultArtwork } from "../utilities/default-artwork";
import { AriaPopover } from "../utilities/aria-popover";
export interface DatePickerRootProps<T extends DateValue>
  extends
    Omit<Primitive.DatePickerProps<T>, keyof VisualProps>,
    Pick<VisualProps, "size" | "radius"> {}
function Root<T extends DateValue>({
  size,
  radius,
  className,
  ...props
}: DatePickerRootProps<T>) {
  const visual = useComponentVisuals({
    size,
    radius,
  });
  return (
    <Primitive.DatePicker
      {...props}
      {...visual}
      className={withClassName("dixy-aria-root dixy-date-picker", className)}
    />
  );
}
export const DatePicker = /* @__PURE__ */ (() => ({
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
  Button: /* @__PURE__ */ defaultArtwork(
    Primitive.Button,
    "dixy-aria-button",
    "calendar",
    false,
  ),
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
