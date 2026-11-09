import { createElement, type ComponentProps } from "react";
import { nativePart, type NativePartProps } from "../utilities/native-part";
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

const CodePart = /* @__PURE__ */ nativePart("code", "dixy-code", [
  "size",
  "variant",
  "color",
  "radius",
] as const);
export interface CodeProps extends Omit<
  NativePartProps<"code", "size" | "color" | "radius">,
  "variant"
> {
  /** Surface emphasis. @default soft */
  variant?: "soft" | "outline" | "ghost";
}
/** Inline code: a native code element on a token-driven surface. Size follows the surrounding text. */
export function Code({
  variant = "soft",
  color = "neutral",
  ...props
}: CodeProps) {
  return <CodePart {...props} variant={variant} color={color} />;
}

export interface BlockquoteProps extends NativePartProps<
  "blockquote",
  "size" | "color"
> {}
/** A native blockquote with a semantic leading rule. Keep attribution outside the quote, e.g. in a figcaption. */
export const Blockquote = /* @__PURE__ */ nativePart(
  "blockquote",
  "dixy-blockquote",
  ["size", "color"] as const,
);
