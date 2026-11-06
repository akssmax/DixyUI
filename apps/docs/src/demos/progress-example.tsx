import { Progress, Stack } from "@dixy-ui/react";
import type { ProgressRootProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";

type Props = Pick<
  ProgressRootProps,
  "size" | "color" | "radius" | "material"
> & {
  indeterminate?: boolean;
  level?: "25" | "65" | "90";
};

export default function ProgressExample({
  indeterminate = false,
  size = "md",
  color = "accent",
  radius,
  material,
  level = "65",
}: Props) {
  return (
    <Stack gap="md" style={{ width: "min(100%, 22rem)" }}>
      <Progress.Root
        size={size}
        color={color}
        radius={radius}
        material={material}
        value={indeterminate ? null : Number(level)}
      >
        <Progress.Label>Upload progress</Progress.Label>
        <Progress.Track>
          <Progress.Indicator />
        </Progress.Track>
        <Progress.Value />
      </Progress.Root>
    </Stack>
  );
}
