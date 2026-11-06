import { useState } from "react";
import { CheckboxGroup, Checkbox, Stack, Text } from "@dixy-ui/react";

export default function CheckboxGroupExample({
  gap = "md",
  orientation = "vertical",

  disabled = false,
}: {
  gap?: "sm" | "md" | "lg";
  orientation?: "horizontal" | "vertical";

  disabled?: boolean;
}) {
  const [values, setValues] = useState<string[]>(["Email"]);
  return (
    <Stack gap="md" style={{ width: "min(100%, 22rem)" }}>
      <CheckboxGroup
        orientation={orientation}
        gap={gap}
        aria-label="Delivery channels"
        value={values}
        onValueChange={setValues}
        disabled={disabled}
      >
        {["Email", "In-app"].map((value) => (
          <label
            key={value}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--dixy-spacing-inline-md)",
            }}
          >
            <Checkbox.Root value={value}>
              <Checkbox.Indicator />
            </Checkbox.Root>
            {value}
          </label>
        ))}
      </CheckboxGroup>
      <Text variant="body.sm" role="status">
        Selected: {values.join(", ") || "None"}
      </Text>
    </Stack>
  );
}
