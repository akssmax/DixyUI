import {
  createContext,
  useContext,
  useId,
  useRef,
  useState,
  type ComponentPropsWithRef,
} from "react";
import { Button, type ButtonProps } from "./button";
import { nativePart, type NativePartProps } from "../utilities/native-part";
const Context = createContext<null | {
  viewport: React.RefObject<HTMLDivElement | null>;
  index: number;
  count: number;
  size?: "sm" | "md" | "lg";
  sync: (el: HTMLDivElement) => void;
  id: string;
}>(null);
function useCarousel() {
  const c = useContext(Context);
  if (!c) throw Error("Carousel parts require Carousel.Root");
  return c;
}
export interface CarouselRootProps extends NativePartProps<"section", "size"> {
  "aria-label": string;
}
const Frame = /* @__PURE__ */ nativePart("section", "dixy-carousel", [
  "size",
] as const);
function Root({ children, size, ...props }: CarouselRootProps) {
  const viewport = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({ index: 0, count: 0 });
  const id = useId();
  const sync = (el: HTMLDivElement) => {
    const slides = [...el.querySelectorAll<HTMLElement>("[data-dixy-slide]")];
    const bounds = el.getBoundingClientRect();
    let index = 0;
    let distance = Infinity;
    slides.forEach((slide, i) => {
      const r = slide.getBoundingClientRect();
      const d = Math.abs(
        (r.left + r.right) / 2 - (bounds.left + bounds.right) / 2,
      );
      if (d < distance) {
        distance = d;
        index = i;
      }
    });
    setState((previous) =>
      previous.index === index && previous.count === slides.length
        ? previous
        : { index, count: slides.length },
    );
  };
  return (
    <Context.Provider value={{ viewport, ...state, sync, id, size }}>
      <Frame {...props} size={size} aria-roledescription="carousel">
        {children}
        <span
          className="dixy-visually-hidden"
          aria-live="polite"
          aria-atomic="true"
        >
          {state.count ? `Slide ${state.index + 1} of ${state.count}` : ""}
        </span>
      </Frame>
    </Context.Provider>
  );
}
export interface CarouselViewportProps extends ComponentPropsWithRef<"div"> {}
function Viewport({
  children,
  onScroll,
  ref,
  className,
  ...props
}: CarouselViewportProps) {
  const c = useCarousel();
  return (
    <div
      {...props}
      id={c.id}
      role={props.role ?? "group"}
      aria-label={props["aria-label"] ?? "Slides"}
      className={["dixy-carousel-viewport", className]
        .filter(Boolean)
        .join(" ")}
      tabIndex={0}
      ref={(node) => {
        c.viewport.current = node;
        if (node) c.sync(node);
        if (typeof ref === "function") return ref(node);
        if (ref) ref.current = node;
      }}
      onScroll={(e) => {
        onScroll?.(e);
        c.sync(e.currentTarget);
      }}
    >
      {children}
    </div>
  );
}
const Slide = /* @__PURE__ */ nativePart(
  "div",
  "dixy-carousel-item",
  [] as const,
);
export interface CarouselItemProps extends NativePartProps<"div", never> {
  "aria-label": string;
}
function Item(props: CarouselItemProps) {
  return (
    <Slide
      {...props}
      data-dixy-slide=""
      role="group"
      aria-roledescription="slide"
    />
  );
}
function Control({
  step,
  children,
  onClick,
  ...props
}: ButtonProps & { step: number }) {
  const c = useCarousel();
  const disabled = step < 0 ? c.index === 0 : c.index >= c.count - 1;
  return (
    <Button
      {...props}
      size={props.size ?? c.size}
      disabled={props.disabled || disabled}
      aria-controls={c.id}
      aria-label={
        props["aria-label"] ?? (step < 0 ? "Previous slide" : "Next slide")
      }
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        const el = c.viewport.current;
        const slide =
          el?.querySelectorAll<HTMLElement>("[data-dixy-slide]")[
            c.index + step
          ];
        if (el && slide) {
          const a = el.getBoundingClientRect(),
            b = slide.getBoundingClientRect();
          el.scrollBy({
            left: (b.left + b.right - a.left - a.right) / 2,
            behavior: "auto",
          });
          c.sync(el);
        }
      }}
    >
      {children ?? (step < 0 ? "Previous" : "Next")}
    </Button>
  );
}
export const Carousel = /* @__PURE__ */ (() => ({
  Root,
  Viewport,
  Item,
  Previous: (props: ButtonProps) => <Control {...props} step={-1} />,
  Next: (props: ButtonProps) => <Control {...props} step={1} />,
}))();
