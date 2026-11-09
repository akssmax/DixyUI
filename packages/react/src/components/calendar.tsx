import * as Primitive from "react-aria-components/Calendar";
import type {
  DateValue,
  CalendarSelectionMode,
} from "react-aria-components/Calendar";
import type { VisualProps } from "../utilities/native-part";
import { useComponentVisuals } from "../utilities/component-visuals";
import { withClassName } from "../utilities/class-name";
import { styledPrimitive } from "../utilities/styled-primitive";
import { defaultArtwork } from "../utilities/default-artwork";
export interface CalendarRootProps<
  T extends DateValue,
  M extends CalendarSelectionMode = "single",
>
  extends
    Omit<Primitive.CalendarProps<T, M>, keyof VisualProps>,
    Pick<VisualProps, "size" | "color" | "radius" | "material"> {
  /** Surface emphasis. @default outline */ variant?: "outline" | "soft";
}
function Root<T extends DateValue, M extends CalendarSelectionMode = "single">({
  size,
  variant,
  color,
  radius,
  material,
  className,
  ...props
}: CalendarRootProps<T, M>) {
  const visual = useComponentVisuals({
    size,
    variant,
    color,
    radius,
    material,
  });
  return (
    <Primitive.Calendar
      {...props}
      {...visual}
      className={withClassName("dixy-aria-root dixy-calendar", className)}
    />
  );
}
export const Calendar = /* @__PURE__ */ (() => ({
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
  Button: /* @__PURE__ */ defaultArtwork(
    Primitive.Button,
    "dixy-aria-button",
    (props) => (props.slot === "previous" ? "chevron-left" : "chevron-right"),
    false,
  ),
}))();
