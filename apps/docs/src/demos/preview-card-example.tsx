import { PreviewCard, Button, Stack, Text } from "@dixy-ui/react";
import type { PreviewCardPopupProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";

type Props = Pick<
  PreviewCardPopupProps,
  "size" | "variant" | "radius" | "material"
> & {};

export default function PreviewCardExample({
  size = "md",
  variant = "outline",
  radius,
  material,
}: Props) {
  return (
    <Stack gap="md" style={{ width: "min(100%, 22rem)" }}>
      <PreviewCard.Root>
        <PreviewCard.Trigger href="#preview-card-example">
          Preview the workspace
        </PreviewCard.Trigger>
        <PreviewCard.Portal>
          <PreviewCard.Positioner sideOffset={8}>
            <PreviewCard.Popup
              size={size}
              variant={variant}
              radius={radius}
              material={material}
            >
              <Text variant="label.lg">Dixy studio</Text>
              <Text variant="body.sm">
                A workspace for thoughtful interfaces.
              </Text>
            </PreviewCard.Popup>
          </PreviewCard.Positioner>
        </PreviewCard.Portal>
      </PreviewCard.Root>
    </Stack>
  );
}
