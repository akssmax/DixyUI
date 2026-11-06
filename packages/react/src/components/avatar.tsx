import { useContext } from "react";
import { AvatarGroupContext } from "../utilities/visual-group-context";
import { Avatar as Primitive } from "@base-ui/react/avatar";
import type { ComponentProps } from "react";
import type { Material, RadiusPreset } from "@dixy-ui/tokens";
import { useComponentVisuals } from "../utilities/component-visuals";
import { withClassName } from "../utilities/class-name";
import { styledPrimitive } from "../utilities/styled-primitive";

export interface AvatarRootProps extends Omit<
  ComponentProps<typeof Primitive.Root>,
  "size" | "variant" | "color" | "radius" | "material"
> {
  /** Image and fallback frame dimensions. @default md */
  size?: "sm" | "md" | "lg";
  /** Visual emphasis; behavioral state remains primitive-owned. @default soft */
  variant?: "solid" | "soft" | "outline";
  /** Semantic emphasis; unselected controls remain neutral. @default accent */
  color?: "accent" | "neutral" | "danger" | "success";
  /** Contextual rounding; panels cap full rounding to preserve content. @default Theme.radius */
  radius?: RadiusPreset;
  /** Optional static finish; import materials.css. @default Theme.material */
  material?: Material;
}
function AvatarRootVisual({
  size,
  variant,
  color,
  radius,
  material,
  className,
  ...props
}: AvatarRootProps) {
  const group = useContext(AvatarGroupContext);
  const visual = useComponentVisuals(
    {
      size: size ?? group?.size,
      variant:
        variant ?? (group?.variant === "ghost" ? "outline" : group?.variant),
      color: color ?? group?.color,
      radius: radius ?? group?.radius,
      material: material ?? group?.material,
    },
    { variant: "soft" },
  );
  return (
    <Primitive.Root
      {...props}
      {...visual}
      className={withClassName("dixy-avatar-root", className)}
    />
  );
}

/** Dixy token styles with the complete Base UI Avatar contract. */
export const Avatar = /* @__PURE__ */ (() => ({
  ...Primitive,
  Root: AvatarRootVisual,
  Image: /* @__PURE__ */ styledPrimitive(Primitive.Image, "dixy-avatar-image"),
  Fallback: /* @__PURE__ */ styledPrimitive(
    Primitive.Fallback,
    "dixy-avatar-fallback",
  ),
}))();
export type * from "@base-ui/react/avatar";
