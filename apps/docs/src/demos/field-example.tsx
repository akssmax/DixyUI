import { Field, TextField, Stack } from "@dixy-ui/react";

export default function FieldExample({
  orientation = "vertical",
  disabled = false,
  invalid = false,
}: {
  orientation?: "vertical" | "horizontal";
  disabled?: boolean;
  invalid?: boolean;
}) {
  return (
    <Stack gap="md" style={{ width: "min(100%, 22rem)" }}>
      <Field.Root
        orientation={orientation}
        disabled={disabled}
        invalid={invalid}
      >
        <Field.Label>Project name</Field.Label>
        <TextField name="project" defaultValue="Dixy studio" />
        <Field.Description>
          Choose a name your team will recognize.
        </Field.Description>
        <Field.Error match={invalid}>
          Choose a different project name.
        </Field.Error>
      </Field.Root>
    </Stack>
  );
}
