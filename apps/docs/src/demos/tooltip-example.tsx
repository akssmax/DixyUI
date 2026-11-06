import { Tooltip, Button, Stack } from "@dixy-ui/react";
import type { TooltipPopupProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";

type Props = Pick<
  TooltipPopupProps,
  "size" | "variant" | "radius" | "material"
> & {
  disabled?: boolean;
  side?: "top" | "bottom" | "left" | "right";
};

export default function TooltipExample({
  size = "md",
  variant = "outline",
  radius,
  material,
  disabled = false,
  side = "top",
}: Props) {
  return (
    <Stack gap="md" style={{ width: "min(100%, 22rem)" }}>
      <Tooltip.Provider delay={400}>
        <Tooltip.Root>
          <Tooltip.Trigger
            render={<Button variant="outline" disabled={disabled} />}
          >
            Save changes
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Positioner side={side} sideOffset={8}>
              <Tooltip.Popup
                size={size}
                variant={variant}
                radius={radius}
                material={material}
              >
                Save changes
              </Tooltip.Popup>
            </Tooltip.Positioner>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    </Stack>
  );
}
