import { Chart, Stack } from "@dixy-ui/react";
import type { VisualProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";
export default function ChartExample({
  size = "md",
  variant = "outline",
  color = "accent",
  radius,
  material,
}: VisualProps) {
  const visual = { color };
  return (
    <Stack gap="md" style={{ width: "min(100%, 24rem)" }}>
      <Chart
        {...visual}
        label="Projects by month"
        data={[
          { label: "Jan", value: 12 },
          { label: "Feb", value: 18 },
          { label: "Mar", value: 15 },
          { label: "Apr", value: 24 },
        ]}
      />
    </Stack>
  );
}
