import { useContext } from "react";
import { ButtonGroupContext } from "../utilities/visual-group-context";
import { Button as Primitive } from "@base-ui/react/button";
import type { ComponentProps } from "react";
import { withClassName } from "../utilities/class-name";
import type { Material, ShapePreset } from "@dixy-ui/tokens";
import { useThemeSettings } from "../theme/theme";

export interface ButtonProps extends Omit<
  ComponentProps<typeof Primitive>,
  "color"
> {
  /** Optional finish for solid/soft variants; requires materials.css. Inherits Theme. */
  material?: Material;
  /** Geometry independent of emphasis. Inherits Theme; focus remains outside. */
  shape?: ShapePreset;
  /** The height and horizontal padding. @default md */
  size?: "sm" | "md" | "lg";
  /** The visual emphasis. @default solid */
  variant?: "solid" | "soft" | "outline" | "ghost";
  /** The semantic color palette. @default accent */
  color?: "accent" | "neutral" | "danger" | "success";
  /** Show progress and prevent repeated activation. @default false */
  loading?: boolean;
}

export function Button({
  size: sizeProp,
  variant: variantProp,
  color: colorProp,
  loading = false,
  disabled,
  className,
  children,
  material,
  shape,
  ...props
}: ButtonProps) {
  const theme = useThemeSettings();
  const group = useContext(ButtonGroupContext);
  const size = sizeProp ?? group?.size ?? "md";
  const variant = variantProp ?? group?.variant ?? "solid";
  const color = colorProp ?? group?.color ?? "accent";
  return (
    <Primitive
      {...props}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={withClassName("dixy-button", className)}
      data-dixy-skin={theme.skin?.id}
      data-dixy-material-override={
        material !== undefined ||
        group?.material !== undefined ||
        theme.materialOverride
          ? ""
          : undefined
      }
      data-size={size}
      data-variant={variant}
      data-color={color}
      data-material={material ?? group?.material ?? theme.material}
      data-dixy-shape={shape ?? theme.shape}
    >
      {loading && <span className="dixy-spinner" aria-hidden="true" />}
      {children}
    </Primitive>
  );
}

export interface IconButtonProps extends ButtonProps {
  /** Required accessible name for the icon-only action. */
  "aria-label": string;
}

export function IconButton({ className, ...props }: IconButtonProps) {
  return (
    <Button
      {...props}
      className={withClassName("dixy-icon-button", className)}
    />
  );
}
