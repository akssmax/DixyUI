import { Resizable, Stack } from "@dixy-ui/react";
import type { VisualProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";
export default function ResizableExample({
  size = "md",
  variant = "outline",
  color = "accent",
  radius,
  material,
}: VisualProps) {
  const visual = { radius };
  return (
    <Stack gap="md" style={{ width: "min(100%, 24rem)" }}>
      <Resizable.Root {...visual}>
        <Resizable.Panel side="start">Navigation</Resizable.Panel>
        <Resizable.Handle aria-label="Resize navigation panel" />
        <Resizable.Panel side="end">Workspace content</Resizable.Panel>
      </Resizable.Root>
    </Stack>
  );
}
