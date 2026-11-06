import { useState } from "react";
import {
  Checkbox,
  Field,
  Stack,
  Text,
  type CheckboxRootProps,
} from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";

type Props = Pick<
  CheckboxRootProps,
  | "size"
  | "variant"
  | "color"
  | "radius"
  | "material"
  | "disabled"
  | "readOnly"
  | "indeterminate"
> & {
  description?: boolean;
  invalid?: boolean;
  indicator?: "check" | "heart" | "plus";
};

export default function CheckboxExample({
  size = "md",
  variant = "solid",
  color = "accent",
  radius,
  material,
  indicator = "check",
  description = true,
  invalid = false,
  disabled = false,
  readOnly = false,
  indeterminate = false,
}: Props) {
  const [checked, setChecked] = useState(false);
  const artwork =
    indicator === "check" ? undefined : (
      <svg
        viewBox="0 0 16 16"
        fill={indicator === "heart" ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d={
            indicator === "heart"
              ? "M8 13 2.6 7.7a3.1 3.1 0 0 1 4.4-4.4L8 4.4l1.1-1.1a3.1 3.1 0 0 1 4.3 4.4Z"
              : "M3 8h10M8 3v10"
          }
        />
      </svg>
    );
  return (
    <Stack gap="md" style={{ width: "min(100%, 22rem)" }}>
      <Field.Root invalid={invalid} disabled={disabled}>
        <Field.Label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--dixy-spacing-inline-md)",
          }}
        >
          <Checkbox.Root
            name="updates"
            checked={checked}
            onCheckedChange={setChecked}
            size={size}
            variant={variant}
            color={color}
            radius={radius}
            material={material}
            disabled={disabled}
            readOnly={readOnly}
            indeterminate={indeterminate}
          >
            <Checkbox.Indicator checkedIcon={artwork} />
          </Checkbox.Root>
          Product updates
        </Field.Label>
        {description && (
          <Field.Description>
            Receive updates about your projects.
          </Field.Description>
        )}
        {invalid && (
          <Field.Error match={true}>
            Choose whether to receive project updates.
          </Field.Error>
        )}
      </Field.Root>
      <Text variant="body.sm" role="status">
        {indeterminate
          ? "Partially selected"
          : checked
            ? "Updates enabled"
            : "Updates disabled"}
      </Text>
    </Stack>
  );
}
