import { Dialog as Primitive } from "@base-ui/react/dialog";
import type { Material, RadiusPreset } from "@dixy-ui/tokens";
import { useComponentVisuals } from "../utilities/component-visuals";
import type { ComponentProps } from "react";
import { ThemeScope, SkinOrnament } from "../theme/theme";
import { withClassName } from "../utilities/class-name";

export interface DialogPopupProps extends ComponentProps<
  typeof Primitive.Popup
> {
  /** The maximum width of the dialog. @default md */
  size?: "sm" | "md" | "lg";
  /** Surface emphasis. @default outline */ variant?: "outline" | "soft";
  /** Panel rounding. @default Theme.radius */ radius?: RadiusPreset;
  /** Optional static finish; import materials.css. @default Theme.material */ material?: Material;
}

function Portal({
  children,
  ...props
}: ComponentProps<typeof Primitive.Portal>) {
  return (
    <Primitive.Portal {...props}>
      <ThemeScope>{children}</ThemeScope>
    </Primitive.Portal>
  );
}

function Backdrop({
  className,
  ...props
}: ComponentProps<typeof Primitive.Backdrop>) {
  return (
    <Primitive.Backdrop
      {...props}
      className={withClassName("dixy-dialog-backdrop", className)}
    />
  );
}

function Viewport({
  className,
  ...props
}: ComponentProps<typeof Primitive.Viewport>) {
  return (
    <Primitive.Viewport
      {...props}
      className={withClassName("dixy-dialog-viewport", className)}
    />
  );
}

function Popup({
  size = "md",
  variant,
  radius,
  material,
  className,
  ...props
}: DialogPopupProps) {
  const visual = useComponentVisuals({ size, variant, radius, material });
  return (
    <Primitive.Popup
      {...props}
      className={withClassName("dixy-dialog-popup", className)}
      {...visual}
    >
      {props.children}
      <SkinOrnament part="dialog" />
    </Primitive.Popup>
  );
}

function Title({
  className,
  ...props
}: ComponentProps<typeof Primitive.Title>) {
  return (
    <Primitive.Title
      {...props}
      className={withClassName("dixy-dialog-title", className)}
    />
  );
}

function Description({
  className,
  ...props
}: ComponentProps<typeof Primitive.Description>) {
  return (
    <Primitive.Description
      {...props}
      className={withClassName("dixy-dialog-description", className)}
    />
  );
}

// Pure wrapper: bundlers may drop the whole object when it is unused.
export const Dialog = /* @__PURE__ */ (() => ({
  Root: Primitive.Root,
  Trigger: Primitive.Trigger,
  Portal,
  Backdrop,
  Viewport,
  Popup,
  Title,
  Description,
  Close: Primitive.Close,
  createHandle: Primitive.createHandle,
  Handle: Primitive.Handle,
}))();
