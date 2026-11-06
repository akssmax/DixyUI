import { useState } from "react";
import {
  Button,
  InputGroup,
  TextField,
  Field,
  Stack,
  Text,
} from "@dixy-ui/react";
import type { VisualProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";
export default function InputGroupExample({
  size = "md",
  variant = "outline",
  color = "accent",
  radius,
  material,
}: VisualProps) {
  const visual = { size, variant, radius, material };
  const [message, setMessage] = useState("");
  return (
    <Stack gap="md" style={{ width: "min(100%, 24rem)" }}>
      <Field.Root>
        <Field.Label>Website</Field.Label>
        <InputGroup.Root {...visual}>
          <InputGroup.Addon aria-hidden="true">https://</InputGroup.Addon>
          <TextField size={size} placeholder="example.com" />
          <InputGroup.Button
            size="sm"
            variant="ghost"
            aria-label="Copy website"
            onClick={() => setMessage("Example copy action selected")}
          >
            Copy
          </InputGroup.Button>
        </InputGroup.Root>
        <Field.Description>
          Enter the domain without its protocol.
        </Field.Description>
        <Text role="status">{message}</Text>
      </Field.Root>
    </Stack>
  );
}
