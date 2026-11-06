import * as Primitive from "react-aria-components/SearchField";

import type { VisualProps } from "../utilities/native-part";
import { useComponentVisuals } from "../utilities/component-visuals";
import { withClassName } from "../utilities/class-name";
import { styledPrimitive } from "../utilities/styled-primitive";
export interface SearchFieldRootProps
  extends
    Omit<Primitive.SearchFieldProps, keyof VisualProps>,
    Pick<VisualProps, "size" | "radius"> {}
function Root({ size, radius, className, ...props }: SearchFieldRootProps) {
  const visual = useComponentVisuals({
    size,
    radius,
  });
  return (
    <Primitive.SearchField
      {...props}
      {...visual}
      className={withClassName("dixy-aria-root dixy-search-field", className)}
    />
  );
}
export const SearchField = /* @__PURE__ */ (() => ({
  Root,
  Input: /* @__PURE__ */ styledPrimitive(Primitive.Input, "dixy-aria-input"),
  Label: /* @__PURE__ */ styledPrimitive(Primitive.Label, "dixy-aria-label"),
  Clear: /* @__PURE__ */ styledPrimitive(Primitive.Button, "dixy-aria-button"),
  Description: /* @__PURE__ */ styledPrimitive(
    Primitive.Text,
    "dixy-aria-text",
  ),
  Error: /* @__PURE__ */ styledPrimitive(
    Primitive.FieldError,
    "dixy-aria-fielderror",
  ),
}))();
