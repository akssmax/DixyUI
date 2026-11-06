import { NativeSelect, Stack } from "@dixy-ui/react";
import type { VisualProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";
export default function NativeSelectExample({
  size = "md",
  variant = "outline",
  color = "accent",
  radius,
  material,
}: VisualProps) {
  const visual = { size, variant, radius, material };
  return (
    <Stack gap="md" style={{ width: "min(100%, 24rem)" }}>
      <label style={{ display: "grid", gap: 8 }}>
        Workspace plan
        <NativeSelect {...visual} defaultValue="personal">
          <option value="personal">Personal</option>
          <option value="team">Team</option>
          <option disabled value="enterprise">
            Enterprise
          </option>
        </NativeSelect>
      </label>
    </Stack>
  );
}
