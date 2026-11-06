import { Skeleton, Stack, Text } from "@dixy-ui/react";
import type { VisualProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";
export default function SkeletonExample({
  size = "md",
  variant = "outline",
  color = "accent",
  radius,
  material,
}: VisualProps) {
  const visual = { radius };
  return (
    <Stack gap="md" style={{ width: "min(100%, 24rem)" }}>
      <Stack gap="sm" aria-label="Content is loading">
        <Skeleton {...visual} style={{ height: 72 }} />
        <Skeleton {...visual} style={{ width: "75%" }} />
        <Skeleton {...visual} style={{ width: "50%" }} />
        <Text variant="body.sm">Loading content…</Text>
      </Stack>
    </Stack>
  );
}
