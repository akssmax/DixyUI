import { Popover, Button, Stack, Text } from "@dixy-ui/react";
import type { PopoverPopupProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";

type Props = Pick<
  PopoverPopupProps,
  "size" | "variant" | "radius" | "material"
> & {
  disabled?: boolean;
};

export default function PopoverExample({
  size = "md",
  variant = "outline",
  radius,
  material,
  disabled = false,
}: Props) {
  return (
    <Stack gap="md" style={{ width: "min(100%, 22rem)" }}>
      <Popover.Root>
        <Popover.Trigger render={<Button disabled={disabled} />}>
          Workspace details
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner sideOffset={8}>
            <Popover.Popup
              size={size}
              variant={variant}
              radius={radius}
              material={material}
            >
              <Popover.Title>Dixy studio</Popover.Title>
              <Popover.Description>
                Your theme follows this panel through its portal.
              </Popover.Description>
              <Popover.Close render={<Button variant="outline" />}>
                Close
              </Popover.Close>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </Stack>
  );
}
