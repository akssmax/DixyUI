import {
  Button,
  Calendar,
  DatePicker,
  Stack,
  Inline,
  Heading,
} from "@dixy-ui/react";
import type { VisualProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";
export default function DatePickerExample({
  size = "md",
  variant = "outline",
  color = "accent",
  radius,
  material,
}: VisualProps) {
  const visual = { size, radius };
  return (
    <Stack gap="md" style={{ width: "min(100%, 24rem)" }}>
      <DatePicker.Root {...visual}>
        <DatePicker.Label>Appointment date</DatePicker.Label>
        <DatePicker.Group>
          <DatePicker.Input>
            {(segment) => <DatePicker.Segment segment={segment} />}
          </DatePicker.Input>
          <DatePicker.Button aria-label="Open calendar">▦</DatePicker.Button>
        </DatePicker.Group>
        <DatePicker.Error />
        <DatePicker.Popover aria-label="Choose appointment date">
          <Calendar.Root {...visual} aria-label="Choose a date">
            <Inline>
              <Calendar.Button slot="previous" aria-label="Previous month">
                ‹
              </Calendar.Button>
              <Calendar.Heading />
              <Calendar.Button slot="next" aria-label="Next month">
                ›
              </Calendar.Button>
            </Inline>
            <Calendar.Grid>
              <Calendar.GridHeader>
                {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
              </Calendar.GridHeader>
              <Calendar.GridBody>
                {(date) => <Calendar.Cell date={date} />}
              </Calendar.GridBody>
            </Calendar.Grid>
          </Calendar.Root>
        </DatePicker.Popover>
      </DatePicker.Root>
    </Stack>
  );
}
