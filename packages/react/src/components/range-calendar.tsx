import * as Primitive from "react-aria-components/RangeCalendar";
import type { DateValue } from "react-aria-components/DatePicker";
import type { VisualProps } from "../utilities/native-part";
import { useComponentVisuals } from "../utilities/component-visuals";
import { withClassName } from "../utilities/class-name";
import { styledPrimitive } from "../utilities/styled-primitive";
export interface RangeCalendarRootProps<T extends DateValue>
  extends
    Omit<Primitive.RangeCalendarProps<T>, keyof VisualProps>,
    VisualProps {}
function Root<T extends DateValue>({
  size,
  variant,
  color,
  radius,
  material,
  className,
  ...props
}: RangeCalendarRootProps<T>) {
  const visual = useComponentVisuals({
    size,
    variant,
    color,
    radius,
    material,
  });
  return (
    <Primitive.RangeCalendar
      {...props}
      {...visual}
      className={withClassName("dixy-aria-root dixy-range-calendar", className)}
    />
  );
}
export const RangeCalendar = /* @__PURE__ */ (() => ({
  Root,
  Grid: /* @__PURE__ */ styledPrimitive(
    Primitive.CalendarGrid,
    "dixy-aria-calendargrid",
  ),
  GridHeader: /* @__PURE__ */ styledPrimitive(
    Primitive.CalendarGridHeader,
    "dixy-aria-calendargridheader",
  ),
  GridBody: /* @__PURE__ */ styledPrimitive(
    Primitive.CalendarGridBody,
    "dixy-aria-calendargridbody",
  ),
  HeaderCell: /* @__PURE__ */ styledPrimitive(
    Primitive.CalendarHeaderCell,
    "dixy-aria-calendarheadercell",
  ),
  Cell: /* @__PURE__ */ styledPrimitive(
    Primitive.CalendarCell,
    "dixy-aria-calendarcell",
  ),
  Heading: /* @__PURE__ */ styledPrimitive(
    Primitive.Heading,
    "dixy-aria-heading",
  ),
  Button: /* @__PURE__ */ styledPrimitive(Primitive.Button, "dixy-aria-button"),
}))();
