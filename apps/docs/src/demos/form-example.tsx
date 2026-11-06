import { useState } from "react";
import { Form, Field, TextField, Button, Stack, Text } from "@dixy-ui/react";

export default function FormExample({
  gap = "md",
  disabled = false,
}: {
  gap?: "sm" | "md" | "lg";
  disabled?: boolean;
}) {
  const [message, setMessage] = useState("Enter a name, then save.");
  return (
    <Stack gap="md" style={{ width: "min(100%, 22rem)" }}>
      <Form
        gap={gap}
        onSubmit={(event) => {
          event.preventDefault();
          setMessage("Saved your workspace.");
        }}
      >
        <Field.Root name="workspace">
          <Field.Label>Workspace name</Field.Label>
          <TextField name="workspace" required disabled={disabled} />
          <Field.Error />
        </Field.Root>
        <Button type="submit" disabled={disabled}>
          Save workspace
        </Button>
      </Form>
      <Text role="status" variant="body.sm">
        {message}
      </Text>
    </Stack>
  );
}
