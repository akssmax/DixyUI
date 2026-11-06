import { Chip, Stack } from "@dixy-ui/react";
import type { VisualProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";
export default function ChipExample({
  size = "md",
  variant = "outline",
  color = "accent",
  radius,
  material,
}: VisualProps) {
  const visual = { size, variant, color, radius, material };
  return (
    <Stack gap="md" style={{ width: "min(100%, 24rem)" }}>
      <Chip {...visual}>New release</Chip>
    </Stack>
  );
}
