import { Spinner, Stack } from "@dixy-ui/react";
import type { VisualProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";
export default function SpinnerExample({
  size = "md",
  variant = "outline",
  color = "accent",
  radius,
  material,
  contained = false,
}: VisualProps & { contained?: boolean }) {
  const visual = { size, color };
  return (
    <Stack gap="md" style={{ width: "min(100%, 24rem)" }}>
      <Spinner {...visual} contained={contained} label="Loading workspace" />
    </Stack>
  );
}
