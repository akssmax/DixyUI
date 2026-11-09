import { Collapsible } from "@base-ui/react/collapsible";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { ChevronDownGlyph, SparkGlyph } from "../utilities/inline-icons";
import { Shimmer } from "./shimmer";

const ReasoningContext = createContext<{
  streaming: boolean;
  duration: number | undefined;
}>({ streaming: false, duration: undefined });

export interface ReasoningRootProps extends Omit<
  ComponentProps<typeof Collapsible.Root>,
  "open" | "defaultOpen" | "onOpenChange"
> {
  /** The model is still thinking. Opens the panel so the reader can follow,
   * then closes it once when thinking ends. @default false */
  streaming?: boolean;
  /** Controlled open state. Stops the automatic open and close. */
  open?: boolean;
  /** Initial open state when uncontrolled. @default false */
  defaultOpen?: boolean;
  /** Called when the reader opens or closes it. */
  onOpenChange?: (open: boolean) => void;
  /** Thinking time in seconds. Measured from `streaming` when omitted. */
  duration?: number;
  /** Close automatically when thinking ends. A reader who toggled the panel
   * keeps their choice. @default true */
  autoClose?: boolean;
}

/** The model's visible thinking, collapsed into one line once it is done. */
function Root({
  streaming = false,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  duration: durationProp,
  autoClose = true,
  className,
  children,
  ...props
}: ReasoningRootProps) {
  const [openState, setOpenState] = useState(defaultOpen || streaming);
  const open = openProp ?? openState;
  const touched = useRef(false);
  const started = useRef<number | null>(streaming ? Date.now() : null);
  const [measured, setMeasured] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (streaming) {
      started.current ??= Date.now();
      if (!touched.current) setOpenState(true);
      return;
    }
    if (started.current === null) return;
    setMeasured(Math.max(1, Math.round((Date.now() - started.current) / 1000)));
    started.current = null;
    if (!autoClose || touched.current) return;
    const timer = setTimeout(() => setOpenState(false), 800);
    return () => clearTimeout(timer);
  }, [streaming, autoClose]);

  return (
    <ReasoningContext.Provider
      value={{ streaming, duration: durationProp ?? measured }}
    >
      <Collapsible.Root
        {...props}
        open={open}
        onOpenChange={(next) => {
          touched.current = true;
          setOpenState(next);
          onOpenChange?.(next);
        }}
        data-streaming={streaming || undefined}
        className={["dixy-reasoning", className].filter(Boolean).join(" ")}
      >
        {children}
      </Collapsible.Root>
    </ReasoningContext.Provider>
  );
}

export interface ReasoningTriggerProps extends Omit<
  ComponentProps<typeof Collapsible.Trigger>,
  "children"
> {
  /** Replace the label. Receives the state the default label uses. */
  children?:
    | ReactNode
    | ((state: { streaming: boolean; duration?: number }) => ReactNode);
  /** Label while thinking. @default Thinking… */
  thinkingLabel?: string;
  /** Label once done. @default "Thought for N seconds" */
  formatDuration?: (seconds: number | undefined) => string;
}

const defaultDuration = (seconds: number | undefined) =>
  seconds === undefined
    ? "Thought for a few seconds"
    : `Thought for ${seconds} second${seconds === 1 ? "" : "s"}`;

function Trigger({
  children,
  thinkingLabel = "Thinking…",
  formatDuration = defaultDuration,
  className,
  ...props
}: ReasoningTriggerProps) {
  const state = useContext(ReasoningContext);
  return (
    <Collapsible.Trigger
      {...props}
      className={["dixy-reasoning-trigger", className]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="dixy-reasoning-icon" aria-hidden="true">
        <SparkGlyph />
      </span>
      {typeof children === "function" ? (
        children(state)
      ) : children !== undefined ? (
        children
      ) : state.streaming ? (
        <Shimmer>{thinkingLabel}</Shimmer>
      ) : (
        <span>{formatDuration(state.duration)}</span>
      )}
      <span className="dixy-reasoning-chevron" aria-hidden="true">
        <ChevronDownGlyph />
      </span>
    </Collapsible.Trigger>
  );
}

function Content({
  className,
  ...props
}: ComponentProps<typeof Collapsible.Panel>) {
  return (
    <Collapsible.Panel
      {...props}
      className={["dixy-reasoning-content", className]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

/** Built on Base UI Collapsible: the trigger is a real button with
 * aria-expanded, and the panel keeps the primitive's state attributes. */
export const Reasoning = /* @__PURE__ */ (() => ({ Root, Trigger, Content }))();
