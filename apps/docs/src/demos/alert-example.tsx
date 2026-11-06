import { Alert, Stack } from "@dixy-ui/react";
import type { VisualProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";
export default function AlertExample({
  size = "md",
  variant = "outline",
  color = "accent",
  radius,
  material,
}: VisualProps) {
  const visual = { size, variant, color, radius, material };
  return (
    <Stack gap="md" style={{ width: "min(100%, 24rem)" }}>
      <Alert.Root {...visual}>
        <Alert.Title>Changes saved</Alert.Title>
        <Alert.Description>
          Your workspace is up to date. Use role="status" for a dynamically
          inserted announcement.
        </Alert.Description>
      </Alert.Root>
    </Stack>
  );
}
