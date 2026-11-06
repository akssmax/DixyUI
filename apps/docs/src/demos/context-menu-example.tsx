import { useState } from "react";
import type { ContextMenuPopupProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";
import { ContextMenu, Button, Stack, Text } from "@dixy-ui/react";

type Props = Pick<
  ContextMenuPopupProps,
  "size" | "variant" | "radius" | "material"
> & {
  disabled?: boolean;
};

export default function ContextMenuExample({
  size = "md",
  variant = "outline",
  radius,
  material,
  disabled = false,
}: Props) {
  const [action, setAction] = useState("Choose a project action.");
  return (
    <Stack gap="md" style={{ width: "min(100%, 22rem)" }}>
      <ContextMenu.Root>
        <ContextMenu.Trigger
          style={{
            padding: "var(--dixy-spacing-inset-lg)",
            border: "var(--dixy-border-default)",
            borderRadius: "var(--dixy-radius-card)",
          }}
        >
          Right-click or use Shift + F10
        </ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Positioner sideOffset={8}>
            <ContextMenu.Popup
              size={size}
              variant={variant}
              radius={radius}
              material={material}
            >
              <ContextMenu.Item onClick={() => setAction("Project duplicated")}>
                Duplicate
              </ContextMenu.Item>
              <ContextMenu.Item
                color="danger"
                disabled={disabled}
                onClick={() => setAction("Project archived")}
              >
                Archive
              </ContextMenu.Item>
              <ContextMenu.Separator />
              <ContextMenu.CheckboxItem defaultChecked>
                Show archived
                <ContextMenu.CheckboxItemIndicator />
              </ContextMenu.CheckboxItem>
            </ContextMenu.Popup>
          </ContextMenu.Positioner>
        </ContextMenu.Portal>
      </ContextMenu.Root>
      <Text role="status" variant="body.sm">
        {action}
      </Text>
    </Stack>
  );
}
