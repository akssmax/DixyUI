import { Avatar, Stack, Text } from "@dixy-ui/react";
import type { AvatarRootProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";

type Props = Pick<
  AvatarRootProps,
  "size" | "variant" | "color" | "radius" | "material"
> & {
  image?: boolean;
  description?: boolean;
};

export default function AvatarExample({
  size = "md",
  variant = "soft",
  color = "accent",
  radius,
  material,
  image = false,
  description = true,
}: Props) {
  return (
    <Stack
      gap="md"
      style={{
        width: "min(100%, 22rem)",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Avatar.Root
        size={size}
        variant={variant}
        color={color}
        radius={radius}
        material={material}
      >
        <Avatar.Image
          src={
            image
              ? "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%237e4deb'/%3E%3Ctext x='40' y='52' text-anchor='middle' fill='white' font-size='32'%3EAS%3C/text%3E%3C/svg%3E"
              : undefined
          }
          alt="Akshay Saini"
        />
        <Avatar.Fallback role="img" aria-label="Akshay Saini">
          AS
        </Avatar.Fallback>
      </Avatar.Root>
      {description && (
        <Text variant="body.sm">Image and initials share the same frame.</Text>
      )}
    </Stack>
  );
}
