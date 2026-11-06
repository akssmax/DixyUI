import type { ComponentProps } from "react";
import { shapePaths, type DecorativeShape } from "@dixy-ui/tokens";

export interface ShapeProps extends Omit<
  ComponentProps<"svg">,
  "children" | "viewBox" | "dangerouslySetInnerHTML" | "tabIndex"
> {
  /** Static decorative silhouette. @default flower */
  kind?: DecorativeShape;
  /** Give meaningful artwork a name; omit for decorative artwork. */
  label?: string;
}

/** Artwork only; content and interactive hit areas stay outside its path. */
export function Shape({
  kind = "flower",
  label,
  className,
  ...props
}: ShapeProps) {
  return (
    <svg
      {...props}
      viewBox="-5 -5 110 110"
      className={["dixy-shape", className].filter(Boolean).join(" ")}
      fill="currentColor"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      tabIndex={undefined}
    >
      <path d={shapePaths[kind]} />
    </svg>
  );
}
