import { createElement, type ComponentType, type ReactNode } from "react";
import { withClassName } from "./class-name";

export type Artwork =
  | "calendar"
  | "check"
  | "chevron"
  | "chevron-left"
  | "chevron-right"
  | "close"
  | "dot"
  | "minus"
  | "plus"
  | "search";

/* 16px strokes in one visual weight, so every built-in part matches. */
const paths: Record<Artwork, ReactNode> = {
  calendar: (
    <>
      <rect x="2.5" y="3.5" width="11" height="10" rx="2" />
      <path d="M2.5 6.75h11M5.5 2v3M10.5 2v3" />
    </>
  ),
  check: <path d="m3.5 8 3 3 6-6" />,
  chevron: <path d="m4 6 4 4 4-4" />,
  "chevron-left": <path d="m10 4-4 4 4 4" />,
  "chevron-right": <path d="m6 4 4 4-4 4" />,
  close: <path d="m4 4 8 8M12 4l-8 8" />,
  dot: <circle cx="8" cy="8" r="3" fill="currentColor" stroke="none" />,
  minus: <path d="M3.5 8h9" />,
  plus: <path d="M8 3.5v9M3.5 8h9" />,
  search: (
    <>
      <circle cx="7" cy="7" r="4.25" />
      <path d="m13 13-2.9-2.9" />
    </>
  ),
};

export function Mark({ kind }: { kind: Artwork }) {
  return (
    <svg
      className="dixy-artwork"
      data-artwork={kind}
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[kind]}
    </svg>
  );
}
/** Preserve the exact primitive type and explicit children/null/render callbacks. */
export function defaultArtwork<T>(
  primitive: T,
  className: string,
  kind: Artwork | ((props: Record<string, unknown>) => Artwork),
  decorative = true,
): T {
  function Styled({
    children,
    className: custom,
    ...props
  }: {
    children?: ReactNode;
    className?: string | ((state: unknown) => string | undefined);
  }) {
    return createElement(primitive as ComponentType<Record<string, unknown>>, {
      ...(decorative ? { "aria-hidden": true } : {}),
      ...props,
      className: withClassName(className, custom),
      children:
        children === undefined ? (
          <Mark kind={typeof kind === "function" ? kind(props) : kind} />
        ) : (
          children
        ),
    });
  }
  return Styled as T;
}
