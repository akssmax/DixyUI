import { createElement, type ComponentType, type ReactNode } from "react";
import { withClassName } from "./class-name";

type Artwork = "check" | "chevron" | "close" | "dot";
function Mark({ kind }: { kind: Artwork }) {
  return (
    <svg
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
      {kind === "check" ? (
        <path d="m3.5 8 3 3 6-6" />
      ) : kind === "chevron" ? (
        <path d="m4 6 4 4 4-4" />
      ) : kind === "close" ? (
        <path d="m4 4 8 8M12 4l-8 8" />
      ) : (
        <circle cx="8" cy="8" r="3" fill="currentColor" stroke="none" />
      )}
    </svg>
  );
}
/** Preserve the exact primitive type and explicit children/null/render callbacks. */
export function defaultArtwork<T>(
  primitive: T,
  className: string,
  kind: Artwork,
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
      children: children === undefined ? <Mark kind={kind} /> : children,
    });
  }
  return Styled as T;
}
