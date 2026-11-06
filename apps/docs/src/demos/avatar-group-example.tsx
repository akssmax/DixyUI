import { Avatar, AvatarGroup, Stack } from "@dixy-ui/react";
import type { VisualProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";
export default function AvatarGroupExample({
  size = "md",
  variant = "outline",
  color = "accent",
  radius,
  material,
}: VisualProps) {
  const visual = {
    size,
    variant: variant === "ghost" ? ("outline" as const) : variant,
    color,
    radius,
    material,
  };
  return (
    <Stack gap="md" style={{ width: "min(100%, 24rem)" }}>
      <AvatarGroup.Root {...visual} role="group" aria-label="Project members">
        {["AS", "JL", "MK"].map((name) => (
          <Avatar.Root key={name} {...visual}>
            <Avatar.Fallback role="img" aria-label={name}>
              {name}
            </Avatar.Fallback>
          </Avatar.Root>
        ))}
        <AvatarGroup.Count role="img" aria-label="Three more members">
          +3
        </AvatarGroup.Count>
      </AvatarGroup.Root>
    </Stack>
  );
}
