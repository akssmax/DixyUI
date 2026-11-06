import { ColorPicker as Root } from "react-aria-components/ColorPicker";
import { ColorArea } from "react-aria-components/ColorArea";
import {
  ColorSlider,
  SliderTrack,
  SliderOutput,
} from "react-aria-components/ColorSlider";
import { ColorThumb } from "react-aria-components/ColorThumb";
import {
  ColorField,
  Input,
  Label,
  Text,
  FieldError,
} from "react-aria-components/ColorField";
import { ColorSwatch } from "react-aria-components/ColorSwatch";
import { DialogTrigger } from "react-aria-components/Dialog";
import { Button } from "react-aria-components/Button";
import { AriaPopover } from "../utilities/aria-popover";
import { styledPrimitive as styled } from "../utilities/styled-primitive";
export { parseColor } from "react-aria-components/ColorPicker";
export const ColorPicker = /* @__PURE__ */ (() => ({
  Root,
  Area: /* @__PURE__ */ styled(ColorArea, "dixy-color-area"),
  Thumb: /* @__PURE__ */ styled(ColorThumb, "dixy-color-thumb"),
  Slider: /* @__PURE__ */ styled(ColorSlider, "dixy-color-slider"),
  Track: /* @__PURE__ */ styled(SliderTrack, "dixy-color-track"),
  Output: /* @__PURE__ */ styled(SliderOutput, "dixy-color-output"),
  Field: /* @__PURE__ */ styled(ColorField, "dixy-color-field"),
  Input: /* @__PURE__ */ styled(Input, "dixy-aria-input"),
  Label: /* @__PURE__ */ styled(Label, "dixy-aria-label"),
  Description: /* @__PURE__ */ styled(Text, "dixy-aria-text"),
  Error: /* @__PURE__ */ styled(FieldError, "dixy-aria-fielderror"),
  Swatch: /* @__PURE__ */ styled(ColorSwatch, "dixy-color-swatch"),
  Trigger: DialogTrigger,
  Button: /* @__PURE__ */ styled(Button, "dixy-aria-button"),
  Popover: AriaPopover,
}))();
