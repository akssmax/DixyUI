import { Button, Empty, Stack } from "@dixy-ui/react";
import type { VisualProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";
export default function EmptyExample({
  size = "md",
  variant = "outline",
  color = "accent",
  radius,
  material,
}: VisualProps) {
  const visual = { size, variant, radius };
  return (
    <Stack gap="md" style={{ width: "min(100%, 24rem)" }}>
      <Empty.Root {...visual}>
        <Empty.Title>No projects yet</Empty.Title>
        <Empty.Description>Create a project to get started.</Empty.Description>
        <Empty.Content>
          <Button size={size}>Create project</Button>
        </Empty.Content>
      </Empty.Root>
    </Stack>
  );
}
