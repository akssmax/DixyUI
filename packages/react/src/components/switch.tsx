import { Switch as Primitive } from "@base-ui/react/switch";
import type { ComponentProps, ReactNode } from "react";
import type { Material, RadiusPreset } from "@dixy-ui/tokens";
import { useThemeSettings, SkinOrnament } from "../theme/theme";
import { withClassName } from "../utilities/class-name";

export interface SwitchRootProps extends Omit<
  ComponentProps<typeof Primitive.Root>,
  "color"
> {
  /** Track and thumb proportions, using Dixy's control sizes. @default md */
  size?: "sm" | "md" | "lg";
  /** Visual emphasis of the selected track. @default solid */
  variant?: "solid" | "soft" | "outline";
  /** Semantic selected color. Accent follows Theme.accentColor. @default accent */
  color?: "accent" | "neutral" | "danger" | "success";
  /** Track rounding; thumb rounding is inset to match. @default Theme.radius */
  radius?: RadiusPreset;
  /** Static track finish; import materials.css. @default Theme.material */
  material?: Material;
}

export interface SwitchThumbProps extends ComponentProps<
  typeof Primitive.Thumb
> {
  /** Decorative on-state artwork. Custom children take precedence. */
  checkedIcon?: ReactNode;
  /** Decorative off-state artwork. Custom children take precedence. */
  uncheckedIcon?: ReactNode;
}

function Root({
  size = "md",
  variant = "solid",
  color = "accent",
  radius,
  material,
  className,
  ...props
}: SwitchRootProps) {
  const theme = useThemeSettings();
  return (
    <Primitive.Root
      {...props}
      className={withClassName("dixy-switch-root", className)}
      data-dixy-skin={theme.skin?.id}
      data-dixy-material-override={
        material !== undefined || theme.materialOverride ? "" : undefined
      }
      data-size={size}
      data-variant={variant}
      data-color={color}
      data-radius={radius ?? theme.radius}
      data-material={material ?? theme.material}
    />
  );
}

function Thumb({
  checkedIcon,
  uncheckedIcon,
  children,
  className,
  ...props
}: SwitchThumbProps) {
  const theme = useThemeSettings();
  return (
    <Primitive.Thumb
      {...props}
      className={withClassName("dixy-switch-thumb", className)}
      data-dixy-skin={theme.skin?.id}
    >
      {children === undefined ? (
        <>
          {checkedIcon === undefined &&
            uncheckedIcon === undefined &&
            theme.ornamentRenderer && <SkinOrnament part="switch-thumb" />}
          {checkedIcon !== undefined && (
            <span
              className="dixy-switch-icon"
              data-state="checked"
              aria-hidden="true"
            >
              {checkedIcon}
            </span>
          )}
          {uncheckedIcon !== undefined && (
            <span
              className="dixy-switch-icon"
              data-state="unchecked"
              aria-hidden="true"
            >
              {uncheckedIcon}
            </span>
          )}
        </>
      ) : (
        children
      )}
    </Primitive.Thumb>
  );
}

/** Base UI owns interaction, refs, form values and composition. */
export const Switch = /* @__PURE__ */ (() => ({
  ...Primitive,
  Root,
  Thumb,
}))();
export type * from "@base-ui/react/switch";
