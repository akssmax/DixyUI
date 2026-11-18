import { ProgressCircle, Stack } from "@dixy-ui/react";
import type { VisualProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";
export default function ProgressCircleExample({
  size = "md",
  variant = "outline",
  color = "accent",
  radius,
  material,
  showValue = false,
}: VisualProps & { showValue?: boolean }) {
  const visual = { size, color };
  return (
    <Stack gap="md" style={{ width: "min(100%, 24rem)" }}>
      <ProgressCircle
        {...visual}
        showValue={showValue}
        aria-label="Upload progress"
        value={65}
      />
    </Stack>
  );
}
