import { Toggle as Primitive } from "@base-ui/react/toggle";
import { useState, type ComponentProps } from "react";
import type { ExpressiveShape, Material, RadiusPreset } from "@dixy-ui/tokens";
import { Shape } from "./shape";
import { useComponentVisuals } from "../utilities/component-visuals";
import { withClassName } from "../utilities/class-name";
import { useThemeSettings } from "../theme/theme";

export interface ToggleProps extends Omit<
  ComponentProps<typeof Primitive>,
  "size" | "variant" | "color" | "radius" | "material"
> {
  /** Component proportions; preserves the shared interaction target. `xs` and `xl` keep the label type. @default md */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Visual emphasis; behavioral state remains primitive-owned. @default soft */
  variant?: "solid" | "soft" | "outline" | "ghost";
  /** Semantic emphasis; unselected controls remain neutral. @default accent */
  color?: "accent" | "neutral" | "danger" | "success";
  /** Contextual rounding; panels cap full rounding to preserve content. @default Theme.radius */
  radius?: RadiusPreset;
  /** Optional static finish; import materials.css. @default Theme.material */
  material?: Material;
  /** Expressive shape: round when off, squarer when pressed or selected, on the Theme's spring. Attached groups keep their own corners. @default Theme.morph */
  morph?: boolean;
  /**
   * Shape-backed icon toggle: the container is drawn as `[off, on]` library
   * shapes and morphs between them on the spatial spring when selected
   * (for example `["circle", "cookie-9"]`). The hit area stays the square
   * control; the shape is decorative.
   */
  shapes?: readonly [off: ExpressiveShape, on: ExpressiveShape];
}
function ToggleControlVisual({
  size,
  variant,
  color,
  radius,
  material,
  morph,
  shapes,
  className,
  children,
  pressed,
  defaultPressed,
  onPressedChange,
  ...props
}: ToggleProps) {
  const theme = useThemeSettings();
  // Mirror the selection so the shape can follow it in either control mode.
  const [own, setOwn] = useState(defaultPressed ?? false);
  const on = pressed ?? own;
  const visual = useComponentVisuals(
    { size, variant, color, radius, material },
    { variant: "soft" },
  );
  return (
    <Primitive
      {...props}
      {...visual}
      pressed={pressed}
      defaultPressed={defaultPressed}
      onPressedChange={(next, details) => {
        setOwn(next);
        onPressedChange?.(next, details);
      }}
      data-morph={
        !shapes && (morph ?? theme.morph === "press") ? "" : undefined
      }
      data-shaped={shapes ? "" : undefined}
      className={withClassName("dixy-toggle", className)}
    >
      {shapes && (
        <Shape
          kind={on ? shapes[1] : shapes[0]}
          className="dixy-toggle-shape"
          aria-hidden="true"
        />
      )}
      {children}
    </Primitive>
  );
}

export const Toggle = ToggleControlVisual;
export type * from "@base-ui/react/toggle";
