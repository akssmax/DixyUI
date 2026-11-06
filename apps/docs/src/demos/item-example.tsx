import { Button, Item, Stack } from "@dixy-ui/react";
import type { VisualProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";
export default function ItemExample({
  size = "md",
  variant = "outline",
  color = "accent",
  radius,
  material,
}: VisualProps) {
  const visual = { size };
  return (
    <Stack gap="md" style={{ width: "min(100%, 24rem)" }}>
      <Item.Root {...visual}>
        <Item.Content>
          <Item.Title>Design foundations</Item.Title>
          <Item.Description>Updated just now.</Item.Description>
        </Item.Content>
        <Item.Actions>
          <Button size={size} variant="outline">
            Open
          </Button>
        </Item.Actions>
      </Item.Root>
    </Stack>
  );
}
