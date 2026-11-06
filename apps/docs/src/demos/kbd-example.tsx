import { Kbd, Stack } from "@dixy-ui/react";
import type { VisualProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";
export default function KbdExample({
  size = "md",
  variant = "outline",
  color = "accent",
  radius,
  material,
}: VisualProps) {
  const visual = { size, radius };
  return (
    <Stack gap="md" style={{ width: "min(100%, 24rem)" }}>
      <Kbd {...visual}>⌘ K</Kbd>
    </Stack>
  );
}
