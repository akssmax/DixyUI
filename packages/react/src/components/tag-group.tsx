import * as Primitive from "react-aria-components/TagGroup";

import type { VisualProps } from "../utilities/native-part";
import { useComponentVisuals } from "../utilities/component-visuals";
import { withClassName } from "../utilities/class-name";
import { styledPrimitive } from "../utilities/styled-primitive";
import { defaultArtwork } from "../utilities/default-artwork";
export interface TagGroupRootProps
  extends
    Omit<Primitive.TagGroupProps, keyof VisualProps>,
    Pick<VisualProps, "size" | "radius"> {}
function Root({ size, radius, className, ...props }: TagGroupRootProps) {
  const visual = useComponentVisuals({
    size,
    radius,
  });
  return (
    <Primitive.TagGroup
      {...props}
      {...visual}
      className={["dixy-aria-root dixy-tag-group", className]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
export const TagGroup = /* @__PURE__ */ (() => ({
  Root,
  List: /* @__PURE__ */ styledPrimitive(Primitive.TagList, "dixy-aria-taglist"),
  Item: /* @__PURE__ */ styledPrimitive(Primitive.Tag, "dixy-aria-tag"),
  Label: /* @__PURE__ */ styledPrimitive(Primitive.Label, "dixy-aria-label"),
  Remove: /* @__PURE__ */ defaultArtwork(
    Primitive.Button,
    "dixy-aria-button",
    "close",
    false,
  ),
  Text: /* @__PURE__ */ styledPrimitive(Primitive.Text, "dixy-aria-text"),
}))();
