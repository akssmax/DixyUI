import { useId } from "react";
import { NumberField, Stack } from "@dixy-ui/react";
import type { NumberFieldRootProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";

type Props = Pick<
  NumberFieldRootProps,
  "size" | "variant" | "radius" | "material"
> & {
  disabled?: boolean;
};

export default function NumberFieldExample({
  size = "md",
  variant = "outline",
  radius,
  material,
  disabled = false,
}: Props) {
  const inputId = useId();
  return (
    <Stack gap="md" style={{ width: "min(100%, 22rem)" }}>
      <NumberField.Root
        size={size}
        variant={variant}
        radius={radius}
        material={material}
        defaultValue={3}
        min={1}
        max={10}
        disabled={disabled}
      >
        <NumberField.ScrubArea>
          <label htmlFor={inputId}>Seats</label>
        </NumberField.ScrubArea>
        <NumberField.Group>
          <NumberField.Decrement aria-label="Remove a seat">
            −
          </NumberField.Decrement>
          <NumberField.Input id={inputId} />
          <NumberField.Increment aria-label="Add a seat">
            +
          </NumberField.Increment>
        </NumberField.Group>
      </NumberField.Root>
    </Stack>
  );
}
