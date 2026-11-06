import { Drawer, Button, Stack, Text } from "@dixy-ui/react";
import type { DrawerPopupProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";

type Props = Pick<
  DrawerPopupProps,
  "size" | "variant" | "radius" | "material"
> & {
  disabled?: boolean;
  swipeDirection?: "up" | "down" | "left" | "right";
};

export default function DrawerExample({
  size = "md",
  variant = "outline",
  radius,
  material,
  disabled = false,
  swipeDirection = "down",
}: Props) {
  return (
    <Stack gap="md" style={{ width: "min(100%, 22rem)" }}>
      <Drawer.Root swipeDirection={swipeDirection}>
        <Drawer.Trigger render={<Button disabled={disabled} />}>
          Open drawer
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Backdrop />
          <Drawer.Viewport>
            <Drawer.Popup
              size={size}
              variant={variant}
              radius={radius}
              material={material}
            >
              <Drawer.Content>
                <Drawer.Title>Dixy studio</Drawer.Title>
                <Drawer.Description>
                  Your theme follows this panel through its portal.
                </Drawer.Description>
                <Drawer.Close render={<Button variant="outline" />}>
                  Close
                </Drawer.Close>
              </Drawer.Content>
            </Drawer.Popup>
          </Drawer.Viewport>
        </Drawer.Portal>
      </Drawer.Root>
    </Stack>
  );
}
