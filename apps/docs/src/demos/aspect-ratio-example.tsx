import { AspectRatio, Stack } from "@dixy-ui/react";
import type { VisualProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";
export default function AspectRatioExample({
  size = "md",
  variant = "outline",
  color = "accent",
  radius,
  material,
}: VisualProps) {
  const visual = { radius };
  return (
    <Stack gap="md" style={{ width: "min(100%, 24rem)" }}>
      <AspectRatio
        {...visual}
        ratio={16 / 9}
        style={{
          background: "var(--dixy-color-background-selected)",
          display: "grid",
          placeItems: "center",
        }}
      >
        16 : 9 media frame
      </AspectRatio>
    </Stack>
  );
}
