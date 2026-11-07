import {
  createElement,
  type ComponentPropsWithRef,
  type CSSProperties,
  type ElementType,
  type ReactElement,
} from "react";
import type { ContainerSize, SpacingSize } from "@dixy-ui/tokens";
import type { Material, ShapePreset } from "@dixy-ui/tokens";
import { useThemeSettings } from "../theme/theme";

export interface BoxOwnProps {
  /** Optional surface finish; import materials.css. Inherits Theme. */
  material?: Material;
  /** Semantic surface shape, without clipping children or focus. Inherits Theme. */
  shape?: ShapePreset;
}

export interface ContainerOwnProps {
  /** Maximum inline size, including the responsive gutters. @default xl */
  size?: ContainerSize;
}

export interface StackOptions {
  /** Space between vertically related children. @default md */
  gap?: SpacingSize<"stack">;
}

export interface InlineOptions {
  /** Space between horizontally related children. @default sm */
  gap?: SpacingSize<"inline">;
  /** Cross-axis alignment. @default center */
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  /** Wrap children when inline space is limited. @default true */
  wrap?: boolean;
}

type LayoutElement = Extract<
  ElementType,
  | "div"
  | "section"
  | "article"
  | "nav"
  | "main"
  | "aside"
  | "ul"
  | "ol"
  | "li"
  | "span"
  | "form"
>;
export type StackProps<E extends LayoutElement = "div"> = StackOptions & {
  as?: E;
} & Omit<ComponentPropsWithRef<E>, keyof StackOptions | "as">;
export type InlineProps<E extends LayoutElement = "div"> = InlineOptions & {
  as?: E;
} & Omit<ComponentPropsWithRef<E>, keyof InlineOptions | "as">;
export type ContainerProps<E extends LayoutElement = "div"> =
  ContainerOwnProps & {
    as?: E;
  } & Omit<ComponentPropsWithRef<E>, keyof ContainerOwnProps | "as">;

export type BoxProps<E extends LayoutElement = "div"> = BoxOwnProps & {
  as?: E;
} & Omit<ComponentPropsWithRef<E>, keyof BoxOwnProps | "as">;

export function Box<E extends LayoutElement = "div">({
  as,
  material,
  shape,
  className,
  ...props
}: BoxProps<E>) {
  const theme = useThemeSettings();
  return createElement(as ?? "div", {
    ...props,
    className: ["dixy-box", className].filter(Boolean).join(" "),
    "data-dixy-skin": theme.skin?.id,
    "data-dixy-material-override":
      material !== undefined || theme.materialOverride ? "" : undefined,
    "data-material": material ?? theme.material,
    "data-dixy-shape": shape ?? theme.shape,
  });
}

export function Container<E extends LayoutElement = "div">({
  as,
  size = "xl",
  className,
  ...props
}: ContainerProps<E>) {
  return createElement(as ?? "div", {
    ...props,
    className: ["dixy-container", className].filter(Boolean).join(" "),
    "data-size": size,
  });
}

export function Stack<E extends LayoutElement = "div">({
  as,
  gap = "md",
  className,
  ...props
}: StackProps<E>) {
  const Component: ElementType = as ?? "div";
  return createElement(Component, {
    ...props,
    className: ["dixy-stack", className].filter(Boolean).join(" "),
    "data-gap": gap,
  });
}

export function Inline<E extends LayoutElement = "div">({
  as,
  gap = "sm",
  align = "center",
  wrap = true,
  className,
  ...props
}: InlineProps<E>) {
  const Component: ElementType = as ?? "div";
  return createElement(Component, {
    ...props,
    className: ["dixy-inline", className].filter(Boolean).join(" "),
    "data-gap": gap,
    "data-align": align,
    "data-wrap": wrap,
  });
}

export interface GridOwnProps {
  /** Fixed number of equal columns. Ignored when minColumnWidth is set. @default 2 */
  columns?: number;
  /** Fit as many columns as this minimum width allows, e.g. "12rem". Never overflows a narrow parent. */
  minColumnWidth?: string;
  /** Space between rows and columns. @default md */
  gap?: SpacingSize<"stack">;
  /** Block-axis alignment of items within their row. @default stretch */
  align?: "start" | "center" | "end" | "stretch";
}

export type GridProps<E extends LayoutElement = "div"> = GridOwnProps & {
  as?: E;
} & Omit<ComponentPropsWithRef<E>, keyof GridOwnProps | "as">;

/** Two-dimensional layout: equal columns, or responsive auto-fit columns. */
export function Grid<E extends LayoutElement = "div">({
  as,
  columns = 2,
  minColumnWidth,
  gap = "md",
  align = "stretch",
  className,
  style,
  ...props
}: GridProps<E>): ReactElement {
  const count =
    Number.isInteger(columns) && columns > 0 ? Math.min(columns, 12) : 2;
  return createElement(as ?? "div", {
    ...props,
    className: ["dixy-grid", className].filter(Boolean).join(" "),
    "data-gap": gap,
    "data-align": align,
    "data-fit": minColumnWidth ? "" : undefined,
    style: {
      "--dixy-grid-columns": count,
      ...(minColumnWidth ? { "--dixy-grid-min": minColumnWidth } : {}),
      ...(style as CSSProperties | undefined),
    } as CSSProperties,
  } as Record<string, unknown>);
}
