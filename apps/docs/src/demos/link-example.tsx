import { Link, Stack } from "@dixy-ui/react";
import type { LinkProps, VisualProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";
export default function LinkExample({
  size = "md",
  variant = "outline",
  color = "accent",
  radius,
  material,
}: Omit<VisualProps, "color"> & Pick<LinkProps, "color">) {
  const visual = { size, color };
  return (
    <Stack gap="md" style={{ width: "min(100%, 24rem)" }}>
      <Link {...visual} href="#examples">
        Explore component examples
      </Link>
    </Stack>
  );
}
