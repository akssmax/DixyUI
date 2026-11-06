import {
  createContext,
  useContext,
  useId,
  useRef,
  useState,
  type ComponentPropsWithRef,
} from "react";
import { nativePart, type NativePartProps } from "../utilities/native-part";
export interface ResizableRootProps extends NativePartProps<"div", "radius"> {
  /** Size of the start panel as a percentage, controlled. */ value?: number;
  /** Initial start-panel percentage. @default 50 */ defaultValue?: number;
  /** Called during direct manipulation and keyboard resizing. */ onValueChange?: (
    value: number,
  ) => void;
  /** Minimum start-panel percentage. @default 10 */ min?: number;
  /** Maximum start-panel percentage. @default 90 */ max?: number;
  /** Split direction. @default horizontal */ orientation?:
    "horizontal" | "vertical";
}
const Context = createContext<null | {
  value: number;
  min: number;
  max: number;
  orientation: "horizontal" | "vertical";
  set: (v: number) => void;
  root: React.RefObject<HTMLDivElement | null>;
  id: string;
}>(null);
function useSplit() {
  const context = useContext(Context);
  if (!context) throw Error("Resizable parts require Resizable.Root");
  return context;
}
const Frame = /* @__PURE__ */ nativePart("div", "dixy-resizable", [
  "radius",
] as const);
function Root({
  value,
  defaultValue = 50,
  min = 10,
  max = 90,
  onValueChange,
  orientation = "horizontal",
  children,
  ref,
  ...props
}: ResizableRootProps) {
  const [local, setLocal] = useState(defaultValue);
  const root = useRef<HTMLDivElement>(null);
  const id = useId();
  const minimum = Number.isFinite(min) ? Math.max(0, Math.min(100, min)) : 10;
  const maximum = Number.isFinite(max)
    ? Math.max(minimum, Math.min(100, max))
    : 90;
  const clamp = (v: number) =>
    Math.max(minimum, Math.min(maximum, Number.isFinite(v) ? v : 50));
  const current = clamp(value ?? local);
  const set = (v: number) => {
    const next = clamp(v);
    if (value === undefined) setLocal(next);
    onValueChange?.(next);
  };
  return (
    <Context.Provider
      value={{
        value: current,
        min: minimum,
        max: maximum,
        orientation,
        set,
        root,
        id,
      }}
    >
      <Frame
        {...props}
        data-orientation={orientation}
        ref={(node) => {
          root.current = node;
          if (typeof ref === "function") return ref(node);
          if (ref) ref.current = node;
        }}
      >
        {children}
      </Frame>
    </Context.Provider>
  );
}
export interface ResizablePanelProps extends Omit<
  NativePartProps<"div", never>,
  "id"
> {
  side: "start" | "end";
}
const Pane = /* @__PURE__ */ nativePart(
  "div",
  "dixy-resizable-panel",
  [] as const,
);
function Panel({ side, style, ...props }: ResizablePanelProps) {
  const c = useSplit();
  return (
    <Pane
      {...props}
      id={`${c.id}-${side}`}
      style={{
        flex: `0 0 calc(${side === "start" ? c.value : 100 - c.value}% - var(--dixy-resize-handle-size, 24px) / 2)`,
        ...style,
      }}
    />
  );
}
export interface ResizableHandleProps extends ComponentPropsWithRef<"div"> {}
function Handle({
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onLostPointerCapture,
  onKeyDown,
  className,
  ...props
}: ResizableHandleProps) {
  const c = useSplit();
  const drag = useRef<null | {
    id: number;
    position: number;
    value: number;
    length: number;
    sign: number;
  }>(null);
  const finish = () => {
    drag.current = null;
  };
  return (
    <div
      {...props}
      className={["dixy-resizable-handle", className].filter(Boolean).join(" ")}
      role="separator"
      tabIndex={0}
      aria-label={props["aria-label"] ?? "Resize panels"}
      aria-controls={`${c.id}-start`}
      aria-orientation={
        c.orientation === "horizontal" ? "vertical" : "horizontal"
      }
      aria-valuemin={c.min}
      aria-valuemax={c.max}
      aria-valuenow={c.value}
      onPointerDown={(e) => {
        onPointerDown?.(e);
        if (e.defaultPrevented || e.button !== 0 || !c.root.current) return;
        const rect = c.root.current.getBoundingClientRect();
        drag.current = {
          id: e.pointerId,
          position: c.orientation === "horizontal" ? e.clientX : e.clientY,
          value: c.value,
          length: c.orientation === "horizontal" ? rect.width : rect.height,
          sign:
            c.orientation === "horizontal" &&
            getComputedStyle(c.root.current).direction === "rtl"
              ? -1
              : 1,
        };
        e.currentTarget.setPointerCapture(e.pointerId);
        e.currentTarget.focus();
        e.preventDefault();
      }}
      onPointerMove={(e) => {
        onPointerMove?.(e);
        const d = drag.current;
        if (!e.defaultPrevented && d && d.id === e.pointerId && d.length > 0)
          c.set(
            d.value +
              (((c.orientation === "horizontal" ? e.clientX : e.clientY) -
                d.position) /
                d.length) *
                100 *
                d.sign,
          );
      }}
      onLostPointerCapture={(e) => {
        onLostPointerCapture?.(e);
        finish();
      }}
      onPointerUp={(e) => {
        onPointerUp?.(e);
        finish();
      }}
      onPointerCancel={(e) => {
        onPointerCancel?.(e);
        finish();
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (e.defaultPrevented) return;
        const rtl =
          c.orientation === "horizontal" &&
          c.root.current &&
          getComputedStyle(c.root.current).direction === "rtl";
        const increment =
          c.orientation === "horizontal"
            ? rtl
              ? "ArrowLeft"
              : "ArrowRight"
            : "ArrowDown";
        const decrement =
          c.orientation === "horizontal"
            ? rtl
              ? "ArrowRight"
              : "ArrowLeft"
            : "ArrowUp";
        let next: number | undefined;
        if (e.key === increment) next = c.value + (e.shiftKey ? 10 : 1);
        if (e.key === decrement) next = c.value - (e.shiftKey ? 10 : 1);
        if (e.key === "Home") next = c.min;
        if (e.key === "End") next = c.max;
        if (next !== undefined) {
          e.preventDefault();
          c.set(next);
        }
      }}
    />
  );
}
export const Resizable = /* @__PURE__ */ (() => ({ Root, Panel, Handle }))();
