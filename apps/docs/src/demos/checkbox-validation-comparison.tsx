import { useState } from "react";
import { Checkbox, Field, Form, Button, Stack, Text } from "@dixy-ui/react";

export default function CheckboxValidationComparison() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <Stack gap="md" style={{ width: "min(100%, 22rem)" }}>
      <Form
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
        }}
      >
        <Field.Root name="agreement">
          <Field.Label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--dixy-spacing-inline-sm)",
            }}
          >
            <Checkbox.Root required>
              <Checkbox.Indicator />
            </Checkbox.Root>
            Accept terms and conditions
          </Field.Label>
          <Field.Description>
            Required to continue with this example.
          </Field.Description>
          <Field.Error match="valueMissing">
            Accept the terms to continue.
          </Field.Error>
        </Field.Root>
        <Button type="submit">Continue</Button>
      </Form>
      <Text role="status" variant="body.sm">
        {submitted
          ? "Preference saved for this example."
          : "Select the checkbox, then continue."}
      </Text>
    </Stack>
  );
}
