import { useState } from "react";
import type { ToggleProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";
import { Toggle, Stack, Text } from "@dixy-ui/react";

type Props = Pick<
  ToggleProps,
  "size" | "variant" | "color" | "radius" | "material"
> & {
  disabled?: boolean;
};

export default function ToggleExample({
  size = "md",
  variant = "soft",
  color = "accent",
  radius,
  material,
  disabled = false,
}: Props) {
  const [pressed, setPressed] = useState(false);
  return (
    <Stack gap="md" style={{ width: "min(100%, 22rem)", alignItems: "center" }}>
      <Toggle
        size={size}
        variant={variant}
        color={color}
        radius={radius}
        material={material}
        aria-label="Bold text"
        pressed={pressed}
        onPressedChange={setPressed}
        disabled={disabled}
      >
        <strong>B</strong>
      </Toggle>
      <Text variant="body.sm" role="status">
        Bold {pressed ? "on" : "off"}
      </Text>
    </Stack>
  );
}
