import { AvatarGroupContext } from "../utilities/visual-group-context";
import { nativePart, type NativePartProps } from "../utilities/native-part";
export interface CardProps extends NativePartProps<"section"> {}
export const Card = /* @__PURE__ */ (() => ({
  Root: /* @__PURE__ */ nativePart(
    "section",
    "dixy-card",
    ["size", "variant", "color", "radius", "material"] as const,
    "card",
  ),
  Header: /* @__PURE__ */ nativePart("header", "dixy-card-header", [] as const),
  Title: /* @__PURE__ */ nativePart("h3", "dixy-card-title", [] as const),
  Description: /* @__PURE__ */ nativePart("p", "dixy-description", [] as const),
  Content: /* @__PURE__ */ nativePart("div", "dixy-card-content", [] as const),
  Footer: /* @__PURE__ */ nativePart("footer", "dixy-card-footer", [] as const),
}))();
export const Alert = /* @__PURE__ */ (() => ({
  Root: /* @__PURE__ */ nativePart("div", "dixy-alert", [
    "size",
    "variant",
    "color",
    "radius",
    "material",
  ] as const),
  Title: /* @__PURE__ */ nativePart("h3", "dixy-alert-title", [] as const),
  Description: /* @__PURE__ */ nativePart(
    "div",
    "dixy-description",
    [] as const,
  ),
}))();
export const Badge = /* @__PURE__ */ nativePart("span", "dixy-badge", [
  "size",
  "variant",
  "color",
  "radius",
  "material",
] as const);
export const Chip = /* @__PURE__ */ nativePart("span", "dixy-chip", [
  "size",
  "variant",
  "color",
  "radius",
  "material",
] as const);
export const Kbd = /* @__PURE__ */ nativePart("kbd", "dixy-kbd", [
  "size",
  "radius",
] as const);
export const Empty = /* @__PURE__ */ (() => ({
  Root: /* @__PURE__ */ nativePart("section", "dixy-empty", [
    "size",
    "variant",
    "radius",
  ] as const),
  Title: /* @__PURE__ */ nativePart("h3", "dixy-empty-title", [] as const),
  Description: /* @__PURE__ */ nativePart("p", "dixy-description", [] as const),
  Content: /* @__PURE__ */ nativePart("div", "dixy-empty-content", [] as const),
}))();
export const Item = /* @__PURE__ */ (() => ({
  Root: /* @__PURE__ */ nativePart("div", "dixy-item", ["size"] as const),
  Media: /* @__PURE__ */ nativePart("div", "dixy-item-media", [] as const),
  Content: /* @__PURE__ */ nativePart("div", "dixy-item-content", [] as const),
  Title: /* @__PURE__ */ nativePart("h3", "dixy-item-title", [] as const),
  Description: /* @__PURE__ */ nativePart("p", "dixy-description", [] as const),
  Actions: /* @__PURE__ */ nativePart("div", "dixy-item-actions", [] as const),
}))();
const AvatarGroupFrame = /* @__PURE__ */ nativePart(
  "div",
  "dixy-avatar-group",
  ["size", "variant", "color", "radius", "material"] as const,
);
export interface AvatarGroupProps extends Omit<
  NativePartProps<"div">,
  "variant"
> {
  /** Fallback surface emphasis. @default soft */ variant?:
    "solid" | "soft" | "outline";
}
function AvatarGroupRoot({ variant = "soft", ...props }: AvatarGroupProps) {
  return (
    <AvatarGroupContext.Provider
      value={{
        size: props.size,
        variant,
        color: props.color,
        radius: props.radius,
        material: props.material,
      }}
    >
      <AvatarGroupFrame {...props} variant={variant} />
    </AvatarGroupContext.Provider>
  );
}
export const AvatarGroup = /* @__PURE__ */ (() => ({
  Root: AvatarGroupRoot,
  Count: /* @__PURE__ */ nativePart("span", "dixy-avatar-count", [] as const),
}))();
export const Table = /* @__PURE__ */ (() => ({
  Root: /* @__PURE__ */ nativePart("table", "dixy-table", ["size"] as const),
  Caption: /* @__PURE__ */ nativePart(
    "caption",
    "dixy-table-caption",
    [] as const,
  ),
  Header: /* @__PURE__ */ nativePart("thead", "dixy-table-header", [] as const),
  Body: /* @__PURE__ */ nativePart("tbody", "dixy-table-body", [] as const),
  Footer: /* @__PURE__ */ nativePart("tfoot", "dixy-table-footer", [] as const),
  Row: /* @__PURE__ */ nativePart("tr", "dixy-table-row", [] as const),
  Head: /* @__PURE__ */ nativePart("th", "dixy-table-head", [] as const),
  Cell: /* @__PURE__ */ nativePart("td", "dixy-table-cell", [] as const),
}))();

export interface AlertProps extends NativePartProps<"div"> {}
export interface BadgeProps extends NativePartProps<"span"> {}
export interface ChipProps extends NativePartProps<"span"> {}
export interface KbdProps extends NativePartProps<"kbd", "size" | "radius"> {}
export interface EmptyProps extends NativePartProps<
  "section",
  "size" | "variant" | "radius"
> {}
export interface ItemProps extends NativePartProps<"div", "size"> {}
export interface TableProps extends NativePartProps<"table", "size"> {}
