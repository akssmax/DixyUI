import * as Primitive from "react-aria-components/SearchField";
import type { ReactNode } from "react";
import {
  Group as AriaGroup,
  type GroupProps,
} from "react-aria-components/Group";
import { defaultArtwork, Mark } from "../utilities/default-artwork";

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
export interface SearchFieldGroupProps extends GroupProps {
  /** Leading search icon. Pass `false` to omit it, or a node to replace it. @default true */
  icon?: boolean | ReactNode;
}
/** The visible field: one bordered box holding the icon, Input and Clear. */
function Group({
  icon = true,
  className,
  children,
  ...props
}: SearchFieldGroupProps) {
  const leading =
    icon === false ? null : (
      <span className="dixy-search-field-icon" aria-hidden="true">
        {icon === true ? <Mark kind="search" /> : icon}
      </span>
    );
  return (
    <AriaGroup
      {...props}
      className={withClassName(
        "dixy-aria-group",
        className as Parameters<typeof withClassName>[1],
      )}
    >
      {typeof children === "function" ? (
        (state) => (
          <>
            {leading}
            {children(state)}
          </>
        )
      ) : (
        <>
          {leading}
          {children}
        </>
      )}
    </AriaGroup>
  );
}
export const SearchField = /* @__PURE__ */ (() => ({
  Root,
  Group,
  Input: /* @__PURE__ */ styledPrimitive(Primitive.Input, "dixy-aria-input"),
  Label: /* @__PURE__ */ styledPrimitive(Primitive.Label, "dixy-aria-label"),
  Clear: /* @__PURE__ */ defaultArtwork(
    Primitive.Button,
    "dixy-aria-button",
    "close",
    false,
  ),
  Description: /* @__PURE__ */ styledPrimitive(
    Primitive.Text,
    "dixy-aria-text",
  ),
  Error: /* @__PURE__ */ styledPrimitive(
    Primitive.FieldError,
    "dixy-aria-fielderror",
  ),
}))();
