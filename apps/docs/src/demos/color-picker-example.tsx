import { useState } from "react";
import { Field, ColorPicker, parseColor, Stack, Text } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";
export default function ColorPickerExample({
  format = "hex",
}: {
  format?: "hex" | "hsl" | "rgb";
}) {
  const [value, setValue] = useState(parseColor("#7e4deb"));
  return (
    <Stack gap="md" style={{ width: "min(100%, 24rem)" }}>
      <ColorPicker.Root value={value} onChange={setValue}>
        <Stack gap="md">
          <ColorPicker.Area
            colorSpace="hsb"
            xChannel="saturation"
            yChannel="brightness"
            aria-label="Accent saturation and brightness"
          >
            <ColorPicker.Thumb />
          </ColorPicker.Area>
          <ColorPicker.Slider channel="hue" colorSpace="hsb">
            <ColorPicker.Label>Hue</ColorPicker.Label>
            <ColorPicker.Track>
              <ColorPicker.Thumb />
            </ColorPicker.Track>
          </ColorPicker.Slider>
          <ColorPicker.Field>
            <ColorPicker.Label>Accent color</ColorPicker.Label>
            <ColorPicker.Input />
          </ColorPicker.Field>
          <ColorPicker.Swatch />
          <Text>{value.toString(format)}</Text>
        </Stack>
      </ColorPicker.Root>
    </Stack>
  );
}
