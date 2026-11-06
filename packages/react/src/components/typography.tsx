import { createElement, type ComponentProps } from "react";
import type { HeadingVariant, TextVariant } from "@dixy-ui/tokens";
export type { HeadingVariant, TextVariant } from "@dixy-ui/tokens";

type TextElement = "p" | "span" | "div";
type TextNativeProps<Element extends TextElement> = Omit<
  ComponentProps<"p">,
  "ref"
> &
  Pick<ComponentProps<Element>, "ref">;

export interface TextProps<
  Element extends TextElement = "p",
> extends TextNativeProps<Element> {
  /** The semantic HTML element. @default p */
  as?: Element;
  /** A complete semantic type style. Overrides size when supplied. @default body.md */
  variant?: TextVariant;
  /** Convenience size within the body family. @default md */
  size?: "sm" | "md" | "lg";
  /** The text emphasis. @default default */
  tone?: "default" | "muted" | "accent";
}

export function Text<Element extends TextElement = "p">({
  as,
  size = "md",
  variant,
  tone = "default",
  className,
  ...props
}: TextProps<Element>) {
  return createElement(as ?? "p", {
    ...props,
    className: ["dixy-text", className].filter(Boolean).join(" "),
    "data-size": size,
    "data-tone": tone,
    "data-typography": variant ?? `body.${size}`,
  });
}

export interface HeadingProps extends ComponentProps<"h2"> {
  /** The semantic heading level, independent of visual size. @default h2 */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  /** A complete visual style, independent of the heading level. @default heading.md */
  variant?: HeadingVariant;
  /** Convenience size within the heading family. @default md */
  size?: "sm" | "md" | "lg";
}

export function Heading({
  as = "h2",
  size = "md",
  variant,
  className,
  ...props
}: HeadingProps) {
  return createElement(as, {
    ...props,
    className: ["dixy-heading", className].filter(Boolean).join(" "),
    "data-size": size,
    "data-typography": variant ?? `heading.${size}`,
  });
}
