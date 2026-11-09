import { Stack, User } from "@dixy-ui/react";

export default function UserExample({
  size = "md",
  color = "accent",
  avatarVariant = "soft",
}: {
  size?: "sm" | "md" | "lg";
  color?: "accent" | "neutral" | "danger" | "success";
  avatarVariant?: "solid" | "soft" | "outline";
}) {
  return (
    <Stack gap="md" style={{ width: "min(100%, 22rem)" }}>
      <User
        name="Akshay Saini"
        description="Design engineer"
        size={size}
        color={color}
        avatarVariant={avatarVariant}
      />
      <User
        name="Mira Chen"
        description="mira@dixy.dev"
        size={size}
        color={color}
        avatarVariant={avatarVariant}
      />
    </Stack>
  );
}
