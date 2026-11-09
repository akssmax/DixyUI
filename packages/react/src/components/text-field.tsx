import { Input as Primitive } from "@base-ui/react/input";
import { Field as PrimitiveField } from "@base-ui/react/field";
import type { Material, RadiusPreset } from "@dixy-ui/tokens";
import { useComponentVisuals } from "../utilities/component-visuals";
import type { ComponentProps } from "react";
import { withClassName } from "../utilities/class-name";
import { useThemeSettings } from "../theme/theme";
import { styledPrimitive } from "../utilities/styled-primitive";

export interface TextFieldProps extends Omit<
  ComponentProps<typeof Primitive>,
  "size"
> {
  /** The height and type size of the control. @default md */
  size?: "sm" | "md" | "lg";
  /** The visual surface treatment. @default outline */
  variant?: "outline" | "soft";
  /** Input rounding. @default Theme.radius */ radius?: RadiusPreset;
  /** Optional static finish; import materials.css. @default Theme.material */ material?: Material;
}

export function TextField({
  size = "md",
  variant = "outline",
  radius,
  material,
  className,
  ...props
}: TextFieldProps) {
  const visual = useComponentVisuals({ size, variant, radius, material });
  return (
    <Primitive
      {...props}
      className={withClassName("dixy-input", className)}
      {...visual}
    />
  );
}

export interface FieldRootProps extends ComponentProps<
  typeof PrimitiveField.Root
> {
  /** Arrange a field and its label. @default vertical */ orientation?:
    "horizontal" | "vertical";
}
function FieldRoot({
  orientation = "vertical",
  className,
  ...props
}: FieldRootProps) {
  return (
    <PrimitiveField.Root
      {...props}
      data-orientation={orientation}
      className={withClassName("dixy-field", className)}
    />
  );
}

function FieldLabel({
  className,
  ...props
}: ComponentProps<typeof PrimitiveField.Label>) {
  const theme = useThemeSettings();
  return (
    <PrimitiveField.Label
      {...props}
      className={withClassName("dixy-label", className)}
      data-dixy-skin={theme.skin?.id}
    />
  );
}

function FieldDescription({
  className,
  ...props
}: ComponentProps<typeof PrimitiveField.Description>) {
  return (
    <PrimitiveField.Description
      {...props}
      className={withClassName("dixy-description", className)}
    />
  );
}

function FieldError({
  className,
  ...props
}: ComponentProps<typeof PrimitiveField.Error>) {
  return (
    <PrimitiveField.Error
      {...props}
      className={withClassName("dixy-error", className)}
    />
  );
}

// Pure wrapper: bundlers may drop the whole object when it is unused.
export const Field = /* @__PURE__ */ (() => ({
  Root: FieldRoot,
  Label: FieldLabel,
  Description: FieldDescription,
  Error: FieldError,
  Validity: PrimitiveField.Validity,
  Control: /* @__PURE__ */ styledPrimitive(
    PrimitiveField.Control,
    "dixy-input",
  ),
  Item: /* @__PURE__ */ styledPrimitive(PrimitiveField.Item, "dixy-field-item"),
}))();
