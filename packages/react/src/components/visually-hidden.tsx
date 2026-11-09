import { createElement, type ComponentPropsWithRef } from "react";

type HiddenElement = "span" | "div" | "label" | "h2" | "h3" | "p";

export interface VisuallyHiddenOwnProps {
  /** Reveal the content while it, or something inside it, has keyboard focus (skip links). @default false */
  focusable?: boolean;
}

export type VisuallyHiddenProps<E extends HiddenElement = "span"> =
  VisuallyHiddenOwnProps & {
    /** The semantic element. @default span */
    as?: E;
  } & Omit<ComponentPropsWithRef<E>, "as" | "focusable">;

/** Hide content visually while keeping it in the accessibility tree. */
export function VisuallyHidden<E extends HiddenElement = "span">({
  as,
  focusable = false,
  className,
  ...props
}: VisuallyHiddenProps<E>) {
  return createElement(as ?? "span", {
    ...props,
    className: ["dixy-visually-hidden", className].filter(Boolean).join(" "),
    "data-focusable": focusable ? "" : undefined,
  });
}
