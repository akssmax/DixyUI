import { useState } from "react";
import { useComponentVisuals } from "../utilities/component-visuals";
import { EyeGlyph, EyeOffGlyph } from "../utilities/inline-icons";
import { IconButton } from "./button";
import { TextField, type TextFieldProps } from "./text-field";

export interface PasswordFieldProps extends Omit<TextFieldProps, "type"> {
  /** Controlled visibility of the password text. */
  visible?: boolean;
  /** Initial visibility when uncontrolled. @default false */
  defaultVisible?: boolean;
  /** Called when the visibility toggle is pressed. */
  onVisibleChange?: (visible: boolean) => void;
  /** Accessible name of the toggle; its pressed state says whether the password is shown. @default Show password */
  toggleLabel?: string;
}

/**
 * A Base UI Input with a show/hide toggle. It works inside Field.Root, so
 * Field.Label, Description and Error keep their relationships. The toggle is
 * a separate Tab stop with a constant name and aria-pressed. className and
 * style reach the Input, preserving Base UI's state callback.
 */
export function PasswordField({
  visible: visibleProp,
  defaultVisible = false,
  onVisibleChange,
  toggleLabel = "Show password",
  size = "md",
  variant = "outline",
  radius,
  material,
  disabled,
  autoComplete = "current-password",
  ...props
}: PasswordFieldProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultVisible);
  const visible = visibleProp ?? uncontrolled;
  const visual = useComponentVisuals({ size, variant, radius, material });
  function toggle() {
    const next = !visible;
    if (visibleProp === undefined) setUncontrolled(next);
    onVisibleChange?.(next);
  }
  return (
    <div
      {...visual}
      className="dixy-input-group dixy-password-field"
      data-disabled={disabled ? "" : undefined}
      data-visible={visible ? "" : undefined}
    >
      <TextField
        {...props}
        size={size}
        disabled={disabled}
        autoComplete={autoComplete}
        spellCheck={false}
        autoCapitalize="off"
        type={visible ? "text" : "password"}
      />
      <IconButton
        type="button"
        className="dixy-password-toggle"
        variant="ghost"
        color="neutral"
        size="sm"
        aria-label={toggleLabel}
        aria-pressed={visible}
        disabled={disabled}
        onClick={toggle}
      >
        {visible ? <EyeOffGlyph /> : <EyeGlyph />}
      </IconButton>
    </div>
  );
}
