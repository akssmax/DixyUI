import { Badge, Inline } from "@dixy-ui/react";
import type { VisualProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";

const statuses = [
  ["accent", "New"],
  ["neutral", "Draft"],
  ["info", "In review"],
  ["success", "Paid"],
  ["warning", "Due soon"],
  ["danger", "Overdue"],
] as const;

/** Every semantic color in the chosen treatment, so a color that ignores it stands out. */
export default function BadgeExample({
  size = "md",
  variant = "outline",
  radius,
  material,
}: Omit<VisualProps, "color">) {
  return (
    <Inline gap="sm" style={{ justifyContent: "center" }}>
      {statuses.map(([color, label]) => (
        <Badge
          key={color}
          size={size}
          variant={variant}
          color={color}
          radius={radius}
          material={material}
        >
          {label}
        </Badge>
      ))}
    </Inline>
  );
}
