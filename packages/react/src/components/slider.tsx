import { Slider as Primitive } from "@base-ui/react/slider";
import type { SliderRootProps as BaseSliderRootProps } from "@base-ui/react/slider";
import type { RadiusPreset, Material } from "@dixy-ui/tokens";
import { useComponentVisuals } from "../utilities/component-visuals";
import { withClassName } from "../utilities/class-name";
import { styledPrimitive } from "../utilities/styled-primitive";

export interface SliderRootProps<
  Value extends number | readonly number[] = number | readonly number[],
> extends Omit<BaseSliderRootProps<Value>, "color"> {
  /** Track and thumb proportions. @default md */ size?: "sm" | "md" | "lg";
  /** Filled track and thumb emphasis. @default accent */ color?:
    "accent" | "neutral" | "danger" | "success";
  /** Track rounding. @default Theme.radius */ radius?: RadiusPreset;
  /** Static track finish; import materials.css. @default Theme.material */ material?: Material;
}
function Root<
  Value extends number | readonly number[] = number | readonly number[],
>({
  size,
  color,
  radius,
  material,
  className,
  ...props
}: SliderRootProps<Value>) {
  const visual = useComponentVisuals({ size, color, radius, material });
  return (
    <Primitive.Root
      {...props}
      {...visual}
      className={withClassName("dixy-slider-root", className)}
    />
  );
}
/** Dixy token styles with the complete Base UI Slider contract. */
export const Slider = /* @__PURE__ */ (() => ({
  ...Primitive,
  Root: Root,
  Label: /* @__PURE__ */ styledPrimitive(Primitive.Label, "dixy-slider-label"),
  Value: /* @__PURE__ */ styledPrimitive(Primitive.Value, "dixy-slider-value"),
  Control: /* @__PURE__ */ styledPrimitive(
    Primitive.Control,
    "dixy-slider-control",
  ),
  Track: /* @__PURE__ */ styledPrimitive(Primitive.Track, "dixy-slider-track"),
  Thumb: /* @__PURE__ */ styledPrimitive(Primitive.Thumb, "dixy-slider-thumb"),
  Indicator: /* @__PURE__ */ styledPrimitive(
    Primitive.Indicator,
    "dixy-slider-indicator",
  ),
}))();
export type * from "@base-ui/react/slider";
