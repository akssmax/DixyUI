import {
  cloneElement,
  type ComponentProps,
  type ReactElement,
  type SVGProps,
} from "react";
import { useRender } from "@base-ui/react/use-render";
import type { IconSize, SemanticColor } from "@dixy-ui/tokens";

export type IconColor =
  | "inherit"
  | (SemanticColor extends infer Role
      ? Role extends `icon.${infer Name}`
        ? Name
        : never
      : never);

export interface IconProps extends Omit<
  ComponentProps<"svg">,
  | "children"
  | "color"
  | "width"
  | "height"
  | "role"
  | "aria-label"
  | "aria-labelledby"
  | "aria-hidden"
  | "tabIndex"
  | "focusable"
> {
  /** One SVG element or SVG icon component. Pack-specific props belong here. */
  render: ReactElement<SVGProps<SVGSVGElement>>;
  /** The existing icon sizing token. Button children inherit their control's icon size unless explicitly set. @default md */
  size?: IconSize;
  /** A semantic icon foreground, or the surrounding text/control color. @default inherit */
  color?: IconColor;
  /** Accessible name for a meaningful standalone image. Omit for decorative icons. */
  label?: string;
}

/** Composes a single SVG; it adds no wrapper, icon-pack dependency or runtime fetch. */
export function Icon({
  render,
  size,
  color = "inherit",
  label,
  className,
  ref,
  ...props
}: IconProps) {
  const element = useRender({
    defaultTagName: "svg",
    render,
    ref,
    props: {
      ...props,
      className: ["dixy-icon", className].filter(Boolean).join(" "),
      "data-icon-size": size,
      "data-icon-color": color,
    },
  });
  const name = label?.trim() || undefined;
  // Pack defaults must not turn a decorative icon into a duplicate announcement,
  // or hide an explicitly named image. Composition still preserves refs/events.
  return cloneElement(element as ReactElement<SVGProps<SVGSVGElement>>, {
    "aria-hidden": name ? undefined : true,
    "aria-label": name,
    "aria-labelledby": undefined,
    role: name ? "img" : undefined,
    focusable: "false",
    tabIndex: undefined,
  });
}
