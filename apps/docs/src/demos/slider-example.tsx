import { Slider, Stack } from "@dixy-ui/react";
import type { SliderRootProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";

type Props = Pick<SliderRootProps, "size" | "color" | "radius" | "material"> & {
  range?: boolean;
  orientation?: "horizontal" | "vertical";
  disabled?: boolean;
};

export default function SliderExample({
  range = false,
  orientation = "horizontal",
  size = "md",
  color = "accent",
  radius,
  material,
  disabled = false,
}: Props) {
  return (
    <Stack gap="md" style={{ width: "min(100%, 22rem)" }}>
      <Slider.Root
        key={String(range)}
        orientation={orientation}
        size={size}
        color={color}
        radius={radius}
        material={material}
        defaultValue={range ? [25, 75] : 40}
        disabled={disabled}
      >
        <Slider.Label>Volume</Slider.Label>
        <Slider.Value />
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
          </Slider.Track>
          <Slider.Thumb
            index={0}
            aria-label={range ? "Minimum volume" : "Volume"}
          />
          {range && <Slider.Thumb index={1} aria-label="Maximum volume" />}
        </Slider.Control>
      </Slider.Root>
    </Stack>
  );
}
