import * as Primitive from "react-aria-components/ListBox";

import type { VisualProps } from "../utilities/native-part";
import { useComponentVisuals } from "../utilities/component-visuals";
import { withClassName } from "../utilities/class-name";
import { styledPrimitive } from "../utilities/styled-primitive";
export interface ListBoxRootProps<T extends object>
  extends
    Omit<Primitive.ListBoxProps<T>, keyof VisualProps>,
    Pick<VisualProps, "size" | "color" | "radius" | "material"> {
  /** Surface emphasis. @default outline */ variant?: "outline" | "soft";
}
function Root<T extends object>({
  size,
  variant,
  color,
  radius,
  material,
  className,
  ...props
}: ListBoxRootProps<T>) {
  const visual = useComponentVisuals({
    size,
    variant,
    color,
    radius,
    material,
  });
  return (
    <Primitive.ListBox
      {...props}
      {...visual}
      className={withClassName("dixy-aria-root dixy-list-box", className)}
    />
  );
}
export const ListBox = /* @__PURE__ */ (() => ({
  Root,
  Item: /* @__PURE__ */ styledPrimitive(
    Primitive.ListBoxItem,
    "dixy-aria-listboxitem",
  ),
  Section: /* @__PURE__ */ styledPrimitive(
    Primitive.ListBoxSection,
    "dixy-aria-listboxsection",
  ),
  Header: /* @__PURE__ */ styledPrimitive(Primitive.Header, "dixy-aria-header"),
  Text: /* @__PURE__ */ styledPrimitive(Primitive.Text, "dixy-aria-text"),
}))();
