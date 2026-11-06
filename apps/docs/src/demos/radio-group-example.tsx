import { useState } from "react";
import type { RadioRootProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";
import { Radio, RadioGroup, Stack, Text } from "@dixy-ui/react";

type Props = Pick<RadioRootProps, "size" | "variant" | "color" | "material"> & {
  orientation?: "horizontal" | "vertical";
  disabled?: boolean;
};

export default function RadioGroupExample({
  orientation = "vertical",
  size = "md",
  variant = "solid",
  color = "accent",
  material,
  disabled = false,
}: Props) {
  const [value, setValue] = useState<string | undefined>("Personal");
  return (
    <Stack gap="md" style={{ width: "min(100%, 22rem)" }}>
      <RadioGroup
        orientation={orientation}
        aria-label="Workspace plan"
        value={value}
        onValueChange={setValue}
        disabled={disabled}
      >
        {["Personal", "Team"].map((plan) => (
          <label
            key={plan}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--dixy-spacing-inline-md)",
            }}
          >
            <Radio.Root
              size={size}
              variant={variant}
              color={color}
              material={material}
              value={plan}
            >
              <Radio.Indicator />
            </Radio.Root>
            {plan}
          </label>
        ))}
      </RadioGroup>
      <Text variant="body.sm" role="status">
        Plan: {value}
      </Text>
    </Stack>
  );
}
