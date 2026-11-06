import {
  createElement,
  type ComponentPropsWithRef,
  type ElementType,
} from "react";
import type { Material, RadiusPreset } from "@dixy-ui/tokens";
import { SkinOrnament, type SkinOrnamentProps } from "../theme/theme";
import { useComponentVisuals } from "./component-visuals";
export interface VisualProps {
  /** Component proportions. @default md */
  size?: "sm" | "md" | "lg";
  /** Surface emphasis. @default outline */
  variant?: "solid" | "soft" | "outline" | "ghost";
  /** Semantic color. @default accent */
  color?: "accent" | "neutral" | "danger" | "success";
  /** Inherits the nearest Theme. */
  radius?: RadiusPreset;
  /** Optional static finish; import materials.css. Inherits Theme. */
  material?: Material;
}
export type NativePartProps<
  E extends ElementType,
  Keys extends keyof VisualProps = keyof VisualProps,
> = Omit<ComponentPropsWithRef<E>, "size" | "color"> &
  Pick<VisualProps, Keys> & {
    /** Override the semantic element, e.g. a title heading level. */ as?: E;
  };
/** Native semantic parts preserve React 19 refs and native handlers. */
export function nativePart<
  E extends ElementType,
  Keys extends keyof VisualProps = keyof VisualProps,
>(
  element: E,
  name: string,
  visualKeys?: readonly Keys[],
  ornamentPart?: SkinOrnamentProps["part"],
) {
  function Part({
    as: elementOverride,
    size,
    variant,
    color,
    radius,
    material,
    className,
    ...props
  }: NativePartProps<E>) {
    const visual = useComponentVisuals({
      size,
      variant,
      color,
      radius,
      material,
    });
    return createElement(elementOverride ?? element, {
      ...props,
      ...(ornamentPart
        ? {
            children: [
              props.children,
              createElement(SkinOrnament, {
                part: ornamentPart,
                key: "dixy-skin-ornament",
              }),
            ],
          }
        : {}),
      "data-dixy-skin": visual["data-dixy-skin"],
      ...(visualKeys?.length === 0 ? {} : visual),
      className: [name, className].filter(Boolean).join(" "),
    });
  }
  Part.displayName = name;
  return Part as <T extends ElementType = E>(
    props: NativePartProps<T, Keys>,
  ) => ReturnType<typeof Part>;
}
