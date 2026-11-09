import { Textarea, Stack } from "@dixy-ui/react";
import type { VisualProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";
export default function TextareaExample({
  size = "md",
  variant = "outline",
  color = "accent",
  radius,
  material,
}: VisualProps) {
  const visual = { size, variant, radius, material };
  return (
    <Stack gap="md" style={{ width: "min(100%, 24rem)" }}>
      <label className="dixy-field">
        <span className="dixy-label">Project notes</span>
        <Textarea
          {...visual}
          name="notes"
          placeholder="Add a few details…"
          rows={4}
        />
      </label>
    </Stack>
  );
}
