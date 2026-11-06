import * as Primitive from "react-aria-components/DateField";
import type { DateValue } from "react-aria-components/DatePicker";
import type { VisualProps } from "../utilities/native-part";
import { useComponentVisuals } from "../utilities/component-visuals";
import { withClassName } from "../utilities/class-name";
import { styledPrimitive } from "../utilities/styled-primitive";
export interface DateFieldRootProps<T extends DateValue>
  extends
    Omit<Primitive.DateFieldProps<T>, keyof VisualProps>,
    Pick<VisualProps, "size" | "radius"> {}
function Root<T extends DateValue>({
  size,
  radius,
  className,
  ...props
}: DateFieldRootProps<T>) {
  const visual = useComponentVisuals({
    size,
    radius,
  });
  return (
    <Primitive.DateField
      {...props}
      {...visual}
      className={withClassName("dixy-aria-root dixy-date-field", className)}
    />
  );
}
export const DateField = /* @__PURE__ */ (() => ({
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
  Description: /* @__PURE__ */ styledPrimitive(
    Primitive.Text,
    "dixy-aria-text",
  ),
  Error: /* @__PURE__ */ styledPrimitive(
    Primitive.FieldError,
    "dixy-aria-fielderror",
  ),
}))();
