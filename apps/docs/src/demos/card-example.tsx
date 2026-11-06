import { Button, Card, Stack } from "@dixy-ui/react";
import type { VisualProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";
export default function CardExample({
  size = "md",
  variant = "outline",
  color = "accent",
  radius,
  material,
}: VisualProps) {
  const visual = { size, variant, color, radius, material };
  return (
    <Stack gap="md" style={{ width: "min(100%, 24rem)" }}>
      <Card.Root {...visual}>
        <Card.Header>
          <Card.Title>Design workspace</Card.Title>
          <Card.Description>A shared home for the next idea.</Card.Description>
        </Card.Header>
        <Card.Content>Invite your team and start a project.</Card.Content>
        <Card.Footer>
          <Button size={size}>Create project</Button>
        </Card.Footer>
      </Card.Root>
    </Stack>
  );
}
