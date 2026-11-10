import {
  Button,
  RangeCalendar,
  DateRangePicker,
  Stack,
  Inline,
  Heading,
} from "@dixy-ui/react";
import type { VisualProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";
export default function DateRangePickerExample({
  size = "md",
  variant = "outline",
  color = "accent",
  radius,
  material,
}: VisualProps) {
  const visual = { size, radius };
  return (
    <Stack gap="md" style={{ width: "min(100%, 24rem)" }}>
      <DateRangePicker.Root {...visual}>
        <DateRangePicker.Label>Appointment range</DateRangePicker.Label>
        <DateRangePicker.Group>
          <DateRangePicker.Input slot="start">
            {(segment) => <DateRangePicker.Segment segment={segment} />}
          </DateRangePicker.Input>
          <span aria-hidden="true">–</span>
          <DateRangePicker.Input slot="end">
            {(segment) => <DateRangePicker.Segment segment={segment} />}
          </DateRangePicker.Input>
          <DateRangePicker.Button aria-label="Open calendar" />
        </DateRangePicker.Group>
        <DateRangePicker.Error />
        <DateRangePicker.Popover aria-label="Choose appointment date range">
          <RangeCalendar.Root {...visual} aria-label="Choose a date">
            <Inline>
              <RangeCalendar.Button
                slot="previous"
                aria-label="Previous month"
              />
              <RangeCalendar.Heading />
              <RangeCalendar.Button slot="next" aria-label="Next month" />
            </Inline>
            <RangeCalendar.Grid>
              <RangeCalendar.GridHeader>
                {(day) => (
                  <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>
                )}
              </RangeCalendar.GridHeader>
              <RangeCalendar.GridBody>
                {(date) => <RangeCalendar.Cell date={date} />}
              </RangeCalendar.GridBody>
            </RangeCalendar.Grid>
          </RangeCalendar.Root>
        </DateRangePicker.Popover>
      </DateRangePicker.Root>
    </Stack>
  );
}
