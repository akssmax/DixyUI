import { Meter, Stack } from "@dixy-ui/react";
import type { MeterRootProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";

type Props = Pick<MeterRootProps, "size" | "color" | "radius" | "material"> & {
  level?: "25" | "65" | "90";
};

export default function MeterExample({
  size = "md",
  color = "accent",
  radius,
  material,
  level = "65",
}: Props) {
  return (
    <Stack gap="md" style={{ width: "min(100%, 22rem)" }}>
      <Meter.Root
        size={size}
        color={color}
        radius={radius}
        material={material}
        value={Number(level)}
      >
        <Meter.Label>Storage used</Meter.Label>
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
        <Meter.Value />
      </Meter.Root>
    </Stack>
  );
}
