import type { ReactNode } from "react";
import { nativePart, type NativePartProps } from "../utilities/native-part";
import { Avatar } from "./avatar";

export interface UserProps extends Omit<
  NativePartProps<"div", "size" | "color" | "radius">,
  "children"
> {
  /** The person's visible name. */
  name: ReactNode;
  /** A secondary line, such as a role or handle. */
  description?: ReactNode;
  /** Avatar image URL. */
  src?: string;
  /** Avatar fallback while the image loads or when it fails. @default initials from a string name */
  fallback?: ReactNode;
  /** Avatar surface emphasis. @default soft */
  avatarVariant?: "solid" | "soft" | "outline";
}

const Frame = /* @__PURE__ */ nativePart("div", "dixy-user", [
  "size",
  "color",
  "radius",
] as const);

function initials(name: ReactNode) {
  if (typeof name !== "string") return null;
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

/** A person: Avatar, name and an optional description. The avatar is
 * decorative because the name is visible text beside it. */
export function User({
  name,
  description,
  src,
  fallback,
  avatarVariant = "soft",
  size,
  color,
  radius = "full",
  ...props
}: UserProps) {
  return (
    <Frame {...props} size={size} color={color} radius={radius}>
      <Avatar.Root
        size={size}
        color={color}
        radius={radius}
        variant={avatarVariant}
        aria-hidden="true"
      >
        {src ? <Avatar.Image src={src} alt="" /> : null}
        <Avatar.Fallback>{fallback ?? initials(name)}</Avatar.Fallback>
      </Avatar.Root>
      <span className="dixy-user-text">
        <span className="dixy-user-name">{name}</span>
        {description ? (
          <span className="dixy-user-description">{description}</span>
        ) : null}
      </span>
    </Frame>
  );
}
