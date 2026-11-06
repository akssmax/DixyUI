import { ScrollShadow, Stack, Text } from "@dixy-ui/react";
import type { VisualProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";
export default function ScrollShadowExample({
  size = "md",
  variant = "outline",
  color = "accent",
  radius,
  material,
}: VisualProps) {
  const visual = { radius };
  return (
    <Stack gap="md" style={{ width: "min(100%, 24rem)" }}>
      <ScrollShadow
        {...visual}
        role="region"
        aria-label="Release notes"
        style={{ height: 160 }}
      >
        {Array.from({ length: 12 }, (_, index) => (
          <Text key={index}>
            Release note {index + 1}: Improve the details.
          </Text>
        ))}
      </ScrollShadow>
    </Stack>
  );
}
