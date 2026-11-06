import { ToggleGroup, Toggle, Stack } from "@dixy-ui/react";
import type { ToggleProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";

type Props = Pick<
  ToggleProps,
  "size" | "variant" | "color" | "radius" | "material"
> & {
  attached?: boolean;
  orientation?: "horizontal" | "vertical";
  disabled?: boolean;
  multiple?: boolean;
};

export default function ToggleGroupExample({
  attached = false,
  orientation = "horizontal",
  size = "md",
  variant = "soft",
  color = "accent",
  radius,
  material,
  disabled = false,
  multiple = false,
}: Props) {
  return (
    <Stack gap="md" style={{ width: "min(100%, 22rem)" }}>
      <ToggleGroup
        orientation={orientation}
        attached={attached}
        aria-label="Text formatting"
        multiple={multiple}
        disabled={disabled}
      >
        {["Bold", "Italic", "Underline"].map((value) => (
          <Toggle
            size={size}
            variant={variant}
            color={color}
            radius={radius}
            material={material}
            key={value}
            value={value}
            aria-label={value}
          >
            {value}
          </Toggle>
        ))}
      </ToggleGroup>
    </Stack>
  );
}
