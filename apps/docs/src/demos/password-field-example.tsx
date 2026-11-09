import { Field, PasswordField, Stack } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";

export default function PasswordFieldExample({
  size = "md",
  variant = "outline",
  radius,
  material,
  disabled = false,
}: {
  size?: "sm" | "md" | "lg";
  variant?: "outline" | "soft";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  material?: "matte" | "glossy" | "soft" | "metal" | "paper";
  disabled?: boolean;
}) {
  return (
    <Stack gap="md" style={{ width: "min(100%, 22rem)" }}>
      <Field.Root disabled={disabled}>
        <Field.Label>Password</Field.Label>
        <PasswordField
          name="password"
          size={size}
          variant={variant}
          radius={radius}
          material={material}
          disabled={disabled}
          defaultValue="correct horse battery"
        />
        <Field.Description>At least 12 characters.</Field.Description>
      </Field.Root>
    </Stack>
  );
}
