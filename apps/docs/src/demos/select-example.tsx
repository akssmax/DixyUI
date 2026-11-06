import { Select, Stack, Field } from "@dixy-ui/react";
import type { SelectTriggerProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";

type Props = Pick<
  SelectTriggerProps,
  "size" | "variant" | "radius" | "material"
> & {
  disableEnterprise?: boolean;
  invalid?: boolean;
  multiple?: boolean;
  disabled?: boolean;
};

export default function SelectExample({
  disableEnterprise = false,
  invalid = false,
  multiple = false,
  size = "md",
  variant = "outline",
  radius,
  material,
  disabled = false,
}: Props) {
  return (
    <Stack gap="md" style={{ width: "min(100%, 22rem)" }}>
      <Field.Root invalid={invalid} disabled={disabled}>
        <Field.Label>Workspace plan</Field.Label>
        <Select.Root
          key={String(multiple)}
          multiple={multiple}
          defaultValue={multiple ? ["personal"] : "personal"}
          disabled={disabled}
        >
          <Select.Trigger
            size={size}
            variant={variant}
            radius={radius}
            material={material}
            aria-label="Workspace plan"
          >
            <Select.Value />
            <Select.Icon />
          </Select.Trigger>
          <Select.Portal>
            <Select.Positioner sideOffset={8}>
              <Select.Popup
                size={size}
                variant={variant}
                radius={radius}
                material={material}
              >
                <Select.List>
                  {["personal", "team", "enterprise"].map((plan) => (
                    <Select.Item
                      key={plan}
                      value={plan}
                      disabled={plan === "enterprise" && disableEnterprise}
                    >
                      <Select.ItemText>{plan}</Select.ItemText>
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.List>
              </Select.Popup>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
        <Field.Description>
          Choose the workspace plan that fits your team.
        </Field.Description>
        <Field.Error match={invalid}>Choose an available plan.</Field.Error>
      </Field.Root>
    </Stack>
  );
}
