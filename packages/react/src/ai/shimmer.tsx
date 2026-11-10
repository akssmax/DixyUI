import type { ComponentPropsWithRef, ElementType } from "react";
import { createElement } from "react";

export interface ShimmerOwnProps<E extends ElementType = "span"> {
  /** The element to render. @default span */
  as?: E;
  /** Sweep duration in seconds. With reduced motion the text is static. @default 2 */
  duration?: number;
}

export type ShimmerProps<E extends ElementType = "span"> = ShimmerOwnProps<E> &
  Omit<ComponentPropsWithRef<E>, "as">;

/** Text with a light sweeping across it, for in-progress labels such as
 * "Thinking…". Purely visual; the text itself is read normally. */
export function Shimmer<E extends ElementType = "span">({
  as,
  duration = 2,
  className,
  style,
  ...props
}: ShimmerProps<E>) {
  return createElement(as ?? "span", {
    ...props,
    className: ["dixy-shimmer", className].filter(Boolean).join(" "),
    style: { "--dixy-shimmer-duration": `${duration}s`, ...style },
  });
}

export interface LoaderProps extends ComponentPropsWithRef<"span"> {
  /** Accessible name. @default Loading */
  label?: string;
}

/** Three pulsing dots for "the reply is on its way". Announced as a status. */
export function Loader({
  label = "Loading",
  className,
  ...props
}: LoaderProps) {
  return (
    <span
      role="status"
      {...props}
      className={["dixy-loader", className].filter(Boolean).join(" ")}
    >
      <span className="dixy-loader-dot" aria-hidden="true" />
      <span className="dixy-loader-dot" aria-hidden="true" />
      <span className="dixy-loader-dot" aria-hidden="true" />
      <span className="dixy-visually-hidden">{label}</span>
    </span>
  );
}
