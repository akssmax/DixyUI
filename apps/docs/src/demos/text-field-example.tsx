import "@dixy-ui/react/materials.css";
import { useState } from "react";
import { Field, TextField, type TextFieldProps } from "@dixy-ui/react";

interface TextFieldExampleProps extends Pick<
  TextFieldProps,
  "size" | "variant" | "disabled" | "radius" | "material"
> {
  invalid?: boolean;
}

export default function TextFieldExample({
  radius,
  material,
  size = "md",
  variant = "outline",
  disabled = false,
  invalid = false,
}: TextFieldExampleProps) {
  const [value, setValue] = useState("");
  return (
    <Field.Root
      invalid={invalid}
      disabled={disabled}
      style={{ width: 280, maxWidth: "100%" }}
    >
      <Field.Label>Project name</Field.Label>
      <TextField
        radius={radius}
        material={material}
        size={size}
        variant={variant}
        value={value}
        onValueChange={setValue}
        placeholder="Something worth making"
        autoComplete="off"
      />
      {invalid ? (
        <Field.Error match={true}>
          Choose a name that isn’t already taken.
        </Field.Error>
      ) : (
        <Field.Description>
          Big ideas start with a small name.
        </Field.Description>
      )}
    </Field.Root>
  );
}
