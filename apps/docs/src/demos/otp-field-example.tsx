import { useId } from "react";
import { useState } from "react";
import type { OTPFieldRootProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";
import { OTPField, Stack, Text } from "@dixy-ui/react";

type Props = Pick<
  OTPFieldRootProps,
  "size" | "variant" | "radius" | "material"
> & {
  disabled?: boolean;
};

export default function OtpFieldExample({
  size = "md",
  variant = "outline",
  radius,
  material,
  disabled = false,
}: Props) {
  const inputId = useId();
  const [value, setValue] = useState("");
  return (
    <Stack gap="md" style={{ width: "min(100%, 22rem)" }}>
      <label htmlFor={inputId} style={{ font: "var(--dixy-font-label-md)" }}>
        Verification code
      </label>
      <OTPField.Root
        size={size}
        variant={variant}
        radius={radius}
        material={material}
        id={inputId}
        length={6}
        disabled={disabled}
        onValueChange={setValue}
      >
        {Array.from({ length: 6 }, (_, index) => (
          <OTPField.Input
            key={index}
            aria-label={index === 0 ? undefined : "Digit " + (index + 1)}
          />
        ))}
      </OTPField.Root>
      <Text role="status" variant="body.sm">
        {value.length === 6
          ? "Code ready for verification."
          : "Enter the six-digit code."}
      </Text>
    </Stack>
  );
}
