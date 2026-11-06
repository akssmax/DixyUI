import { TimeField, Stack } from "@dixy-ui/react";
import type { VisualProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";
export default function TimeFieldExample({
  size = "md",
  variant = "outline",
  color = "accent",
  radius,
  material,
}: VisualProps) {
  const visual = { size, radius };
  return (
    <Stack gap="md" style={{ width: "min(100%, 24rem)" }}>
      <TimeField.Root {...visual}>
        <TimeField.Label>Appointment time</TimeField.Label>
        <TimeField.Input>
          {(segment) => <TimeField.Segment segment={segment} />}
        </TimeField.Input>
        <TimeField.Description slot="description">
          Your local time.
        </TimeField.Description>
        <TimeField.Error />
      </TimeField.Root>
    </Stack>
  );
}
