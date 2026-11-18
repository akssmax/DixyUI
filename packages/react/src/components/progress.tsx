import { Progress as Primitive } from "@base-ui/react/progress";
import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useRef,
  type ComponentProps,
  type ComponentType,
  type CSSProperties,
} from "react";
import { useMotionPreferences } from "../utilities/motion-preferences";
import type { Material, RadiusPreset } from "@dixy-ui/tokens";
import { useComponentVisuals } from "../utilities/component-visuals";
import { withClassName } from "../utilities/class-name";
import { useThemeSettings } from "../theme/theme";
import { styledPrimitive } from "../utilities/styled-primitive";

export interface ProgressRootProps extends Omit<
  ComponentProps<typeof Primitive.Root>,
  "size" | "color" | "radius" | "material"
> {
  /** Visual track thickness for task progress. @default md */
  size?: "sm" | "md" | "lg";
  /** Semantic emphasis; unselected controls remain neutral. @default accent */
  color?: "accent" | "neutral" | "danger" | "success";
  /** Contextual rounding; panels cap full rounding to preserve content. @default Theme.radius */
  radius?: RadiusPreset;
  /** Optional static finish; import materials.css. @default Theme.material */
  material?: Material;
  /** Expressive indicator: a moving wave with a gap before the remaining track. Still under reduced motion. @default Theme.progress */
  wave?: boolean;
}
function ProgressRootVisual({
  size,
  color,
  radius,
  material,
  wave: waveProp,
  className,
  style,
  ...props
}: ProgressRootProps) {
  const theme = useThemeSettings();
  const wave = waveProp ?? theme.progress === "wave";
  const visual = useComponentVisuals(
    { size, color, radius, material },
    { variant: "soft" },
  );
  // The wave's gap and remaining track are drawn by the track in CSS, so it
  // needs the filled fraction; Base UI only writes it on the indicator.
  const { value = null, min = 0, max = 100 } = props;
  const fraction =
    value === null || max <= min
      ? undefined
      : Math.min(1, Math.max(0, (value - min) / (max - min)));
  const waveStyle =
    wave && fraction !== undefined
      ? ({ "--dixy-progress-fraction": fraction } as CSSProperties)
      : undefined;
  return (
    <WaveContext.Provider value={wave}>
      <Primitive.Root
        {...props}
        {...visual}
        data-wave={wave ? "" : undefined}
        style={
          waveStyle
            ? typeof style === "function"
              ? (state) => ({ ...waveStyle, ...style(state) })
              : { ...waveStyle, ...style }
            : style
        }
        className={withClassName("dixy-progress-root", className)}
      />
    </WaveContext.Provider>
  );
}

const WaveContext = createContext(false);

/**
 * The wave as one SVG path across the indicator's width, with round caps at
 * both ends (M3). A tiled mask can't do this: every tile cuts the stroke on
 * a slope, which leaves notches at the joins and flat ends. The phase moves
 * on animation frames; amplitude eases in over the first wavelength so a
 * short indicator reads as a line or a dot. Reduced motion holds it still.
 */
function WaveLine() {
  const svg = useRef<SVGSVGElement>(null);
  const path = useRef<SVGPathElement>(null);
  const { reducedMotion } = useMotionPreferences();
  useEffect(() => {
    const element = svg.current;
    const line = path.current;
    if (!element || !line) return;
    const draw = (phase: number) => {
      const width = element.clientWidth;
      const height = element.clientHeight;
      if (!width || !height) return;
      // CSS sizes the wave: stroke = height / 3, wavelength = height * 5 / 3.
      const stroke = height / 3;
      const length = (height * 5) / 3;
      const start = stroke / 2;
      const end = Math.max(start, width - stroke / 2);
      const amplitude = stroke * Math.min(1, (end - start) / length);
      let d = "";
      const steps = Math.max(1, Math.ceil((end - start) / 2));
      for (let i = 0; i <= steps; i++) {
        const x = start + ((end - start) * i) / steps;
        const y =
          height / 2 +
          amplitude * Math.sin(((x + phase) / length) * Math.PI * 2);
        d += `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`;
      }
      line.setAttribute("d", d);
      line.setAttribute("stroke-width", String(stroke));
    };
    if (reducedMotion || typeof requestAnimationFrame !== "function") {
      draw(0);
      if (typeof ResizeObserver !== "function") return;
      const observer = new ResizeObserver(() => draw(0));
      observer.observe(element);
      return () => observer.disconnect();
    }
    let frame = 0;
    const tick = (time: number) => {
      // One wavelength per 1.2s, travelling toward the leading end.
      const height = element.clientHeight;
      draw(-((time / 1200) % 1) * ((height * 5) / 3));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion]);
  return (
    <svg ref={svg} className="dixy-progress-wave" aria-hidden="true">
      <path
        ref={path}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </svg>
  );
}

type IndicatorProps = ComponentProps<typeof Primitive.Indicator>;
function ProgressIndicatorVisual({ children, ...props }: IndicatorProps) {
  const wave = useContext(WaveContext);
  return createElement(
    styledIndicator as ComponentType<IndicatorProps>,
    props,
    wave ? (
      <>
        <WaveLine />
        {children}
      </>
    ) : (
      children
    ),
  );
}
const styledIndicator = /* @__PURE__ */ styledPrimitive(
  Primitive.Indicator,
  "dixy-progress-indicator",
);

/** Dixy token styles with the complete Base UI Progress contract. */
export const Progress = /* @__PURE__ */ (() => ({
  ...Primitive,
  Root: ProgressRootVisual,
  Track: /* @__PURE__ */ styledPrimitive(
    Primitive.Track,
    "dixy-progress-track",
  ),
  Indicator: ProgressIndicatorVisual as typeof Primitive.Indicator,
  Label: /* @__PURE__ */ styledPrimitive(
    Primitive.Label,
    "dixy-progress-label",
  ),
  Value: /* @__PURE__ */ styledPrimitive(
    Primitive.Value,
    "dixy-progress-value",
  ),
}))();
export type * from "@base-ui/react/progress";
