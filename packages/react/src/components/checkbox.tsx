import { Checkbox as Primitive } from "@base-ui/react/checkbox";
import { forwardRef, type ComponentProps, type ReactNode } from "react";
import type { Material, RadiusPreset } from "@dixy-ui/tokens";
import { useThemeSettings } from "../theme/theme";
import { withClassName } from "../utilities/class-name";

export interface CheckboxRootProps extends Omit<
  ComponentProps<typeof Primitive.Root>,
  "color"
> {
  /** Visual box and indicator proportions; preserves the shared minimum interaction target. @default md */
  size?: "sm" | "md" | "lg";
  /** Selected emphasis. Unchecked boxes remain neutral. @default solid */
  variant?: "solid" | "soft" | "outline";
  /** Selected semantic color. Accent follows Theme.accentColor. @default accent */
  color?: "accent" | "neutral" | "danger" | "success";
  /** Contextual box rounding. @default Theme.radius */
  radius?: RadiusPreset;
  /** Static box finish; import materials.css. @default Theme.material */
  material?: Material;
}

export interface CheckboxIndicatorProps extends ComponentProps<
  typeof Primitive.Indicator
> {
  /** Decorative checked artwork. Omit for the centered SVG check. Custom children take precedence. */
  checkedIcon?: ReactNode;
  /** Decorative mixed-state artwork. Omit for the centered SVG dash. Custom children take precedence. */
  indeterminateIcon?: ReactNode;
}

function Root({
  size = "md",
  variant = "solid",
  color = "accent",
  radius,
  material,
  className,
  ...props
}: CheckboxRootProps) {
  const theme = useThemeSettings();
  return (
    <Primitive.Root
      {...props}
      className={withClassName("dixy-checkbox-root", className)}
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

function DefaultMark({ mixed = false }: { mixed?: boolean }) {
  return (
    <svg
      className="dixy-checkbox-mark"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className={mixed ? "dixy-checkbox-mixed" : "dixy-checkbox-check"}
        d={mixed ? "M4 8h8" : "M3.5 8 6.5 11 12.5 5"}
      />
    </svg>
  );
}

const Indicator = /* @__PURE__ */ forwardRef<
  HTMLSpanElement,
  CheckboxIndicatorProps
>(function CheckboxIndicator(
  { children, checkedIcon, indeterminateIcon, className, ...props },
  ref,
) {
  return (
    <Primitive.Indicator
      {...props}
      ref={ref}
      className={withClassName("dixy-checkbox-indicator", className)}
    >
      {children === undefined ? (
        <>
          <span
            className="dixy-checkbox-symbol"
            data-state="checked"
            aria-hidden="true"
          >
            {checkedIcon === undefined ? <DefaultMark /> : checkedIcon}
          </span>
          <span
            className="dixy-checkbox-symbol"
            data-state="mixed"
            aria-hidden="true"
          >
            {indeterminateIcon === undefined ? (
              <DefaultMark mixed />
            ) : (
              indeterminateIcon
            )}
          </span>
        </>
      ) : (
        children
      )}
    </Primitive.Indicator>
  );
});

/** Visual props extend Base UI without replacing its interaction/presence contracts. */
export const Checkbox = /* @__PURE__ */ (() => ({
  ...Primitive,
  Root,
  Indicator,
}))();
export type * from "@base-ui/react/checkbox";
