import { Button, Calendar, Stack, Inline, Heading } from "@dixy-ui/react";
import type { VisualProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";
export default function CalendarExample({
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
    </Stack>
  );
}
