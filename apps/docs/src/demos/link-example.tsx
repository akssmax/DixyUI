import { Link, Stack } from "@dixy-ui/react";
import type { VisualProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";
export default function LinkExample({
  size = "md",
  variant = "outline",
  color = "accent",
  radius,
  material,
}: VisualProps) {
  const visual = { size, color };
  return (
    <Stack gap="md" style={{ width: "min(100%, 24rem)" }}>
      <Link {...visual} href="#examples">
        Explore component examples
      </Link>
    </Stack>
  );
}
