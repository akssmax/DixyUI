import { useState } from "react";
import type { MenuPopupProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";
import { Menu, Button, Stack, Text } from "@dixy-ui/react";

type Props = Pick<
  MenuPopupProps,
  "size" | "variant" | "radius" | "material"
> & {
  disabled?: boolean;
};

export default function MenuExample({
  size = "md",
  variant = "outline",
  radius,
  material,
  disabled = false,
}: Props) {
  const [action, setAction] = useState("Choose a project action.");
  return (
    <Stack gap="md" style={{ width: "min(100%, 22rem)" }}>
      <Menu.Root>
        <Menu.Trigger render={<Button disabled={disabled} />}>
          Project actions
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner sideOffset={8}>
            <Menu.Popup
              size={size}
              variant={variant}
              radius={radius}
              material={material}
            >
              <Menu.Item onClick={() => setAction("Project duplicated")}>
                Duplicate
              </Menu.Item>
              <Menu.Item
                color="danger"
                disabled={false}
                onClick={() => setAction("Project archived")}
              >
                Archive
              </Menu.Item>
              <Menu.Separator />
              <Menu.CheckboxItem defaultChecked>
                Show archived
                <Menu.CheckboxItemIndicator />
              </Menu.CheckboxItem>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
      <Text role="status" variant="body.sm">
        {action}
      </Text>
    </Stack>
  );
}
