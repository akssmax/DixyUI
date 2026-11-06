import { useState } from "react";
import type { MenubarProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";
import { Menubar, Menu, Stack } from "@dixy-ui/react";

type Props = Pick<MenubarProps, "size" | "variant" | "radius"> & {
  disabled?: boolean;
};

export default function MenubarExample({
  size = "md",
  variant = "plain",
  radius,
  disabled = false,
}: Props) {
  const [action, setAction] = useState("Use arrow keys to move between menus.");
  return (
    <Stack gap="md" style={{ width: "min(100%, 22rem)" }}>
      <Menubar
        size={size}
        variant={variant}
        radius={radius}
        disabled={disabled}
      >
        {["File", "Edit"].map((label) => (
          <Menu.Root key={label}>
            <Menu.Trigger>{label}</Menu.Trigger>
            <Menu.Portal>
              <Menu.Positioner sideOffset={8}>
                <Menu.Popup
                  size={size}
                  radius={radius}
                  variant={variant === "plain" ? "outline" : variant}
                >
                  <Menu.Item
                    onClick={() => setAction(label + " action selected")}
                  >
                    New action
                  </Menu.Item>
                  <Menu.Item onClick={() => setAction("Settings selected")}>
                    Settings
                  </Menu.Item>
                </Menu.Popup>
              </Menu.Positioner>
            </Menu.Portal>
          </Menu.Root>
        ))}
      </Menubar>
      <span role="status">{action}</span>
    </Stack>
  );
}
