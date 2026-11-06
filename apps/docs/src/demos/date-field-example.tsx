import { DateField, Stack } from "@dixy-ui/react";
import type { VisualProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";
export default function DateFieldExample({
  size = "md",
  variant = "outline",
  color = "accent",
  radius,
  material,
}: VisualProps) {
  const visual = { size, radius };
  return (
    <Stack gap="md" style={{ width: "min(100%, 24rem)" }}>
      <DateField.Root {...visual}>
        <DateField.Label>Appointment date</DateField.Label>
        <DateField.Input>
          {(segment) => <DateField.Segment segment={segment} />}
        </DateField.Input>
        <DateField.Description slot="description">
          Enter day, month and year.
        </DateField.Description>
        <DateField.Error />
      </DateField.Root>
    </Stack>
  );
}
