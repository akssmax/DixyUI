import { useState } from "react";
import { Button, ButtonGroup, Stack, Text } from "@dixy-ui/react";
import type { VisualProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";
export default function ButtonGroupExample({
  size = "md",
  variant = "outline",
  color = "accent",
  radius,
  material,
  attached = true,
  orientation = "horizontal",
}: VisualProps & {
  attached?: boolean;
  orientation?: "horizontal" | "vertical";
}) {
  const [action, setAction] = useState("Choose an action.");
  const visual = { size, variant, color, radius, material };
  return (
    <Stack gap="md" style={{ width: "min(100%, 24rem)" }}>
      <ButtonGroup
        {...visual}
        attached={attached}
        orientation={orientation}
        aria-label="Document actions"
      >
        <Button size={size} variant={variant} color={color} material={material}>
          Save
        </Button>
        <Button size={size} variant={variant} color={color} material={material}>
          Share
        </Button>
        <Button
          size={size}
          variant={variant}
          color={color}
          material={material}
          disabled
        >
          Archive
        </Button>
      </ButtonGroup>
      <Text variant="body.sm" role="status">
        {action}
      </Text>
    </Stack>
  );
}
