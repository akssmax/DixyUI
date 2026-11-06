import * as Primitive from "react-aria-components/TimeField";
import type { TimeValue } from "react-aria-components/TimeField";
import type { VisualProps } from "../utilities/native-part";
import { useComponentVisuals } from "../utilities/component-visuals";
import { withClassName } from "../utilities/class-name";
import { styledPrimitive } from "../utilities/styled-primitive";
export interface TimeFieldRootProps<T extends TimeValue>
  extends
    Omit<Primitive.TimeFieldProps<T>, keyof VisualProps>,
    Pick<VisualProps, "size" | "radius"> {}
function Root<T extends TimeValue>({
  size,
  radius,
  className,
  ...props
}: TimeFieldRootProps<T>) {
  const visual = useComponentVisuals({
    size,
    radius,
  });
  return (
    <Primitive.TimeField
      {...props}
      {...visual}
      className={withClassName("dixy-aria-root dixy-time-field", className)}
    />
  );
}
export const TimeField = /* @__PURE__ */ (() => ({
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
