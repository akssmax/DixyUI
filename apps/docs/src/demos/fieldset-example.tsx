import { Fieldset, Field, TextField, Stack } from "@dixy-ui/react";
import type { FieldsetRootProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";

type Props = Pick<FieldsetRootProps, "size" | "variant" | "radius"> & {
  disabled?: boolean;
};

export default function FieldsetExample({
  size = "md",
  variant = "plain",
  radius,
  disabled = false,
}: Props) {
  return (
    <Stack gap="md" style={{ width: "min(100%, 22rem)" }}>
      <Fieldset.Root
        size={size}
        variant={variant}
        radius={radius}
        disabled={disabled}
      >
        <Fieldset.Legend>Workspace profile</Fieldset.Legend>
        <Field.Root>
          <Field.Label>Workspace name</Field.Label>
          <TextField
            size={size}
            radius={radius}
            defaultValue="Dixy studio"
            name="workspace"
          />
          <Field.Description>Visible to your team.</Field.Description>
        </Field.Root>
      </Fieldset.Root>
    </Stack>
  );
}
