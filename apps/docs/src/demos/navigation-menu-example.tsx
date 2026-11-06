import { NavigationMenu, Stack } from "@dixy-ui/react";
import type { NavigationMenuRootProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";

type Props = Pick<NavigationMenuRootProps, "size" | "variant" | "radius"> & {
  disabled?: boolean;
};

export default function NavigationMenuExample({
  size = "md",
  variant = "plain",
  radius,
  disabled = false,
}: Props) {
  return (
    <Stack gap="md" style={{ width: "min(100%, 22rem)" }}>
      <NavigationMenu.Root size={size} variant={variant} radius={radius}>
        <NavigationMenu.List>
          <NavigationMenu.Item>
            <NavigationMenu.Trigger disabled={disabled}>
              Resources
            </NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <NavigationMenu.Link href="/docs/installation">
                Installation
              </NavigationMenu.Link>
              <NavigationMenu.Link href="/docs/foundations/typography">
                Typography
              </NavigationMenu.Link>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Link href="/docs/learning">
              Learning
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
        <NavigationMenu.Portal>
          <NavigationMenu.Positioner sideOffset={8}>
            <NavigationMenu.Popup
              size={size}
              radius={radius}
              variant={variant === "plain" ? "outline" : variant}
            >
              <NavigationMenu.Viewport />
            </NavigationMenu.Popup>
          </NavigationMenu.Positioner>
        </NavigationMenu.Portal>
      </NavigationMenu.Root>
    </Stack>
  );
}
