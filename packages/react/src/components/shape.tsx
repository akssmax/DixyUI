import { useMemo, type CSSProperties, type ComponentProps } from "react";
import {
  expressiveShapes,
  shapePaths,
  shapeSvgPath,
  springEasing,
  type DecorativeShape,
  type ExpressiveShape,
} from "@dixy-ui/tokens";
import { useThemeSettings } from "../theme/theme";

export type ShapeKind = DecorativeShape | ExpressiveShape;

export interface ShapeProps extends Omit<
  ComponentProps<"svg">,
  "children" | "viewBox" | "dangerouslySetInnerHTML" | "tabIndex"
> {
  /**
   * Silhouette. The expressive set (`cookie-9`, `clover-4`, `burst`, `heart`
   * and 31 more) shares one outline structure, so changing `kind` between
   * two of them morphs on the Theme's spatial spring. @default flower
   */
  kind?: ShapeKind;
  /** Give meaningful artwork a name; omit for decorative artwork. */
  label?: string;
}

const expressive = new Set<string>(expressiveShapes);

/** Artwork only; content and interactive hit areas stay outside its path. */
export function Shape({
  kind = "flower",
  label,
  className,
  style,
  ...props
}: ShapeProps) {
  const { motionScheme } = useThemeSettings();
  const morphs = expressive.has(kind);
  const d = morphs
    ? shapeSvgPath(kind as ExpressiveShape)
    : shapePaths[kind as DecorativeShape];
  // CSS `d` transitions between paths with the same commands; the spring is
  // simulated into a `linear()` easing. Reduced motion zeroes it in CSS.
  const curve = useMemo(
    () => springEasing(motionScheme, "spatial", "default"),
    [motionScheme],
  );
  const spring = morphs ? curve : null;
  return (
    <svg
      {...props}
      viewBox={morphs ? "0 0 100 100" : "-5 -5 110 110"}
      className={["dixy-shape", className].filter(Boolean).join(" ")}
      data-kind={kind}
      style={
        spring
          ? ({
              "--dixy-shape-morph-duration": `${spring.duration}ms`,
              "--dixy-shape-morph-easing": spring.easing,
              ...style,
            } as CSSProperties)
          : style
      }
      fill="currentColor"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      tabIndex={undefined}
    >
      <path
        d={d}
        style={morphs ? ({ d: `path("${d}")` } as CSSProperties) : undefined}
      />
    </svg>
  );
}
