import { useState } from "react";
import { Checkbox, CheckboxGroup, Stack, Text } from "@dixy-ui/react";

export default function CheckboxGroupComparison() {
  const [values, setValues] = useState<string[]>(["Email"]);
  return (
    <Stack gap="md" style={{ width: "min(100%, 22rem)" }}>
      <CheckboxGroup
        aria-label="Notification channels"
        allValues={["Email", "In-app"]}
        value={values}
        onValueChange={setValues}
      >
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--dixy-spacing-inline-sm)",
          }}
        >
          <Checkbox.Root parent>
            <Checkbox.Indicator />
          </Checkbox.Root>
          All channels
        </label>
        <div style={{ paddingInlineStart: "var(--dixy-spacing-inset-lg)" }}>
          {["Email", "In-app"].map((value) => (
            <label
              key={value}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--dixy-spacing-inline-sm)",
              }}
            >
              <Checkbox.Root value={value}>
                <Checkbox.Indicator />
              </Checkbox.Root>
              {value}
            </label>
          ))}
        </div>
      </CheckboxGroup>
      <Text variant="body.sm" role="status">
        Selected: {values.join(", ") || "None"}
      </Text>
    </Stack>
  );
}
