import { Button, RangeCalendar, Stack, Inline, Heading } from "@dixy-ui/react";
import type { VisualProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";
export default function RangeCalendarExample({
  size = "md",
  variant = "outline",
  color = "accent",
  radius,
  material,
}: VisualProps) {
  const visual = {
    size,
    variant: variant === "soft" ? ("soft" as const) : ("outline" as const),
    radius,
    material,
  };
  return (
    <Stack gap="md" style={{ width: "min(100%, 24rem)" }}>
      <RangeCalendar.Root {...visual} aria-label="Choose a date">
        <Inline>
          <RangeCalendar.Button slot="previous" aria-label="Previous month">
            ‹
          </RangeCalendar.Button>
          <RangeCalendar.Heading />
          <RangeCalendar.Button slot="next" aria-label="Next month">
            ›
          </RangeCalendar.Button>
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
    </Stack>
  );
}
