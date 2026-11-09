import { ButtonGroupContext } from "../utilities/visual-group-context";
import type { ComponentProps } from "react";
import { nativePart, type NativePartProps } from "../utilities/native-part";
import { Mark } from "../utilities/default-artwork";
import { useComponentVisuals } from "../utilities/component-visuals";
import { withClassName } from "../utilities/class-name";
import { Button } from "./button";
import { TextField } from "./text-field";
import { Collapsible } from "./collapsible";
import { Drawer } from "./drawer";
export interface ButtonGroupProps extends NativePartProps<"div"> {
  /** Connected edges or separate actions. @default true */
  attached?: boolean;
  /** Visual direction; buttons retain ordinary Tab stops. @default horizontal */
  orientation?: "horizontal" | "vertical";
}
const Group = /* @__PURE__ */ nativePart("div", "dixy-button-group", [
  "size",
  "variant",
  "color",
  "radius",
  "material",
] as const);
export function ButtonGroup({
  attached = true,
  orientation = "horizontal",
  role = "group",
  variant = "outline",
  ...props
}: ButtonGroupProps) {
  return (
    <ButtonGroupContext.Provider
      value={{
        size: props.size,
        variant,
        color: props.color,
        radius: props.radius,
        material: props.material,
      }}
    >
      <Group
        {...props}
        variant={variant}
        role={role}
        data-attached={attached}
        data-orientation={orientation}
      />
    </ButtonGroupContext.Provider>
  );
}
export const Textarea = /* @__PURE__ */ nativePart(
  "textarea",
  "dixy-textarea",
  ["size", "variant", "radius", "material"] as const,
);
export const NativeSelect = /* @__PURE__ */ nativePart(
  "select",
  "dixy-native-select",
);
export const InputGroup = /* @__PURE__ */ (() => ({
  Root: /* @__PURE__ */ nativePart("div", "dixy-input-group", [
    "size",
    "variant",
    "radius",
    "material",
  ] as const),
  Addon: /* @__PURE__ */ nativePart("span", "dixy-input-addon", [] as const),
  Text: /* @__PURE__ */ nativePart("span", "dixy-input-addon", [] as const),
  Button,
  Input: TextField,
  Textarea,
}))();
const Nav = /* @__PURE__ */ nativePart("nav", "dixy-pagination", [
  "size",
  "radius",
] as const);
export interface PaginationProps extends NativePartProps<
  "nav",
  "size" | "radius"
> {}
function PaginationRoot(props: PaginationProps) {
  return <Nav aria-label="Pagination" {...props} />;
}
const PaginationLink = /* @__PURE__ */ nativePart(
  "a",
  "dixy-pagination-link",
  [] as const,
);
export type PaginationStepProps = NativePartProps<"a", never>;
/** Previous-page link with a chevron. Children replace the icon; pass `aria-disabled` on the first page. */
function PaginationPrevious({ children, ...props }: PaginationStepProps) {
  return (
    <PaginationLink aria-label="Previous page" {...props} data-step="previous">
      {children ?? <Mark kind="chevron-left" />}
    </PaginationLink>
  );
}
/** Next-page link with a chevron. Children replace the icon; pass `aria-disabled` on the last page. */
function PaginationNext({ children, ...props }: PaginationStepProps) {
  return (
    <PaginationLink aria-label="Next page" {...props} data-step="next">
      {children ?? <Mark kind="chevron-right" />}
    </PaginationLink>
  );
}
export const Pagination = /* @__PURE__ */ (() => ({
  Root: PaginationRoot,
  List: /* @__PURE__ */ nativePart("ul", "dixy-pagination-list", [] as const),
  Item: /* @__PURE__ */ nativePart("li", "dixy-pagination-item", [] as const),
  Link: PaginationLink,
  Previous: PaginationPrevious,
  Next: PaginationNext,
  Ellipsis: /* @__PURE__ */ nativePart(
    "span",
    "dixy-pagination-ellipsis",
    [] as const,
  ),
}))();
export const Sidebar: {
  Root: typeof Collapsible.Root;
  Trigger: typeof Collapsible.Trigger;
  Panel: typeof Collapsible.Panel;
  Content: ReturnType<typeof nativePart<"aside", "size" | "radius">>;
  Header: ReturnType<typeof nativePart<"header", never>>;
  Nav: ReturnType<typeof nativePart<"nav", never>>;
  Footer: ReturnType<typeof nativePart<"footer", never>>;
  Mobile: typeof Drawer;
} = /* @__PURE__ */ (() => ({
  Root: Collapsible.Root,
  Trigger: Collapsible.Trigger,
  Panel: Collapsible.Panel,
  Content: /* @__PURE__ */ nativePart("aside", "dixy-sidebar", [
    "size",
    "radius",
  ] as const),
  Header: /* @__PURE__ */ nativePart(
    "header",
    "dixy-sidebar-header",
    [] as const,
  ),
  Nav: /* @__PURE__ */ nativePart("nav", "dixy-sidebar-nav", [] as const),
  Footer: /* @__PURE__ */ nativePart(
    "footer",
    "dixy-sidebar-footer",
    [] as const,
  ),
  Mobile: Drawer,
}))();
export interface AspectRatioProps extends NativePartProps<"div", "radius"> {
  /** Positive width / height ratio. @default 1.7777777778 */
  ratio?: number;
}
const Frame = /* @__PURE__ */ nativePart("div", "dixy-aspect-ratio", [
  "radius",
] as const);
export function AspectRatio({
  ratio = 16 / 9,
  style,
  ...props
}: AspectRatioProps) {
  return (
    <Frame
      {...props}
      style={{
        aspectRatio: Number.isFinite(ratio) && ratio > 0 ? ratio : 16 / 9,
        ...style,
      }}
    />
  );
}
export interface SkeletonProps extends NativePartProps<"div", "radius"> {}
const Placeholder = /* @__PURE__ */ nativePart("div", "dixy-skeleton", [
  "radius",
] as const);
export function Skeleton(props: SkeletonProps) {
  return <Placeholder aria-hidden="true" {...props} />;
}
export interface SpinnerProps extends NativePartProps<
  "span",
  "size" | "color"
> {
  /** Accessible loading message. @default Loading */
  label?: string;
}
const Loading = /* @__PURE__ */ nativePart("span", "dixy-loading", [
  "size",
  "color",
] as const);
export function Spinner({
  label = "Loading",
  children,
  ...props
}: SpinnerProps) {
  return (
    <Loading {...props} role="status">
      <span className="dixy-spinner" aria-hidden="true" />
      <span className="dixy-visually-hidden">{label}</span>
      {children}
    </Loading>
  );
}
export interface ProgressCircleProps extends Omit<
  NativePartProps<"div", "size" | "color">,
  "children"
> {
  /** Omit for indeterminate progress. */ value?: number;
  /** Maximum positive value. @default 100 */ max?: number;
  /** Required accessible name. */ "aria-label": string;
}
export function ProgressCircle({
  value,
  max = 100,
  size,
  color,
  className,
  ...props
}: ProgressCircleProps) {
  const visual = useComponentVisuals({
    size,
    color,
  });
  const maximum = Number.isFinite(max) && max > 0 ? max : 100;
  const bounded =
    value === undefined || !Number.isFinite(value)
      ? undefined
      : Math.max(0, Math.min(maximum, value));
  return (
    <div
      {...props}
      {...visual}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={maximum}
      aria-valuenow={bounded}
      className={["dixy-progress-circle", className].filter(Boolean).join(" ")}
    >
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="16" className="dixy-progress-ring-track" />
        <circle
          cx="20"
          cy="20"
          r="16"
          pathLength="100"
          strokeDasharray={`${bounded === undefined ? 25 : (bounded / maximum) * 100} 100`}
          className="dixy-progress-ring-fill"
        />
      </svg>
    </div>
  );
}
export interface ScrollShadowProps extends NativePartProps<"div", "radius"> {
  /** Accessible name for the focusable scroll region. */ "aria-label": string;
}
const Overflow = /* @__PURE__ */ nativePart("div", "dixy-scroll-shadow", [
  "radius",
] as const);
export function ScrollShadow(props: ScrollShadowProps) {
  return <Overflow tabIndex={0} role="region" {...props} />;
}

export interface TextareaProps extends NativePartProps<
  "textarea",
  "size" | "variant" | "radius" | "material"
> {}
export interface NativeSelectProps extends NativePartProps<
  "select",
  "size" | "variant" | "radius" | "material"
> {}
export interface InputGroupProps extends NativePartProps<
  "div",
  "size" | "variant" | "radius" | "material"
> {}
export interface SidebarProps extends NativePartProps<
  "aside",
  "size" | "radius"
> {}
