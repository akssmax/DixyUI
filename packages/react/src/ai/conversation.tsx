import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type ReactNode,
  type RefObject,
} from "react";
import { IconButton } from "../components/button";
import { ArrowDownGlyph } from "../utilities/inline-icons";
import { useMotionPreferences } from "../utilities/motion-preferences";
import type { ChatStatus } from "./types";

/** Distance from the end, in pixels, that still counts as "at the latest message". */
const bottomThreshold = 48;

interface ConversationContextValue {
  scrollRef: RefObject<HTMLDivElement | null>;
  attach: (node: HTMLDivElement | null) => void;
  atBottom: boolean;
  scrollToBottom: (behavior?: ScrollBehavior) => void;
}
const ConversationContext = createContext<ConversationContextValue | null>(
  null,
);
function useConversationContext(part: string) {
  const context = useContext(ConversationContext);
  if (!context)
    throw new Error(`${part} must be placed inside Conversation.Root.`);
  return context;
}

/** Keep the newest content in view while it streams, without fighting a
 * reader who scrolls up. Returns whether the view is following the end. */
export function useStickToBottom() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  // State, not only a ref, so listeners move with a remounted log.
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const attach = useCallback((node: HTMLDivElement | null) => {
    scrollRef.current = node;
    setElement(node);
  }, []);
  const following = useRef(true);
  const [atBottom, setAtBottom] = useState(true);
  const { reducedMotion } = useMotionPreferences();

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      const element = scrollRef.current;
      if (!element) return;
      following.current = true;
      setAtBottom(true);
      element.scrollTo({
        top: element.scrollHeight,
        behavior: reducedMotion ? "auto" : behavior,
      });
    },
    [reducedMotion],
  );

  useLayoutEffect(() => {
    if (!element) return;
    const distance = () =>
      element.scrollHeight - element.scrollTop - element.clientHeight;

    // Growth while following pins the end instantly; smooth scrolling here
    // would lag behind each token and read as jitter.
    const pin = () => {
      if (following.current) element.scrollTop = element.scrollHeight;
    };
    const onScroll = () => {
      const near = distance() <= bottomThreshold;
      if (near) following.current = true;
      setAtBottom(near);
    };
    // Intent to read back releases the pin at once, before the next token
    // arrives; scroll events alone are too late for a small upward nudge.
    const release = () => {
      if (distance() > 1) following.current = false;
    };
    const onWheel = (event: WheelEvent) => {
      if (event.deltaY < 0) following.current = false;
    };
    const onKey = (event: KeyboardEvent) => {
      if (["ArrowUp", "PageUp", "Home"].includes(event.key))
        following.current = false;
    };

    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(pin);
    observer?.observe(element);
    for (const child of Array.from(element.children)) observer?.observe(child);
    // New messages are new children; observe them as they mount.
    const mutations =
      typeof MutationObserver === "undefined"
        ? null
        : new MutationObserver((records) => {
            for (const record of records)
              record.addedNodes.forEach((node) => {
                if (node instanceof Element) observer?.observe(node);
              });
            pin();
          });
    mutations?.observe(element, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    element.addEventListener("scroll", onScroll, { passive: true });
    element.addEventListener("wheel", onWheel, { passive: true });
    element.addEventListener("touchmove", release, { passive: true });
    element.addEventListener("keydown", onKey);
    pin();
    return () => {
      observer?.disconnect();
      mutations?.disconnect();
      element.removeEventListener("scroll", onScroll);
      element.removeEventListener("wheel", onWheel);
      element.removeEventListener("touchmove", release);
      element.removeEventListener("keydown", onKey);
    };
  }, [element]);

  return { scrollRef, attach, atBottom, scrollToBottom };
}

export interface ConversationStatusLabels {
  /** Announced when a message is sent. @default Sending */
  submitted?: string;
  /** Announced when the reply starts arriving. @default Responding */
  streaming?: string;
  /** Announced when the reply finishes. @default Response complete */
  ready?: string;
  /** Announced when the request fails. @default Something went wrong */
  error?: string;
}

export interface ConversationRootProps extends ComponentPropsWithRef<"div"> {
  /** Request state. Changes are announced politely, once each, so assistive
   * technology hears "Responding" and "Response complete" rather than every
   * streamed token. */
  status?: ChatStatus;
  /** Override the announced status messages. */
  statusLabels?: ConversationStatusLabels;
}

function useStatusAnnouncement(
  status: ChatStatus | undefined,
  labels: ConversationStatusLabels = {},
) {
  const previous = useRef(status);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const before = previous.current;
    previous.current = status;
    if (!status || status === before) return;
    if (status === "ready")
      setMessage(
        before === "streaming" || before === "submitted"
          ? (labels.ready ?? "Response complete")
          : "",
      );
    else if (status === "submitted") setMessage(labels.submitted ?? "Sending");
    else if (status === "streaming")
      setMessage(labels.streaming ?? "Responding");
    else setMessage(labels.error ?? "Something went wrong");
  }, [status, labels.ready, labels.submitted, labels.streaming, labels.error]);
  return message;
}

function Root({
  status,
  statusLabels,
  className,
  children,
  ...props
}: ConversationRootProps) {
  const stick = useStickToBottom();
  const message = useStatusAnnouncement(status, statusLabels);
  return (
    <ConversationContext.Provider value={stick}>
      <div
        {...props}
        data-status={status}
        className={["dixy-conversation", className].filter(Boolean).join(" ")}
      >
        {children}
        <span className="dixy-visually-hidden" role="status">
          {message}
        </span>
      </div>
    </ConversationContext.Provider>
  );
}

export interface ConversationContentProps extends ComponentPropsWithRef<"div"> {
  /** Accessible name of the message log. @default Conversation */
  "aria-label"?: string;
}

/** The scrolling message log. It is keyboard scrollable and is not a live
 * region: Root announces status changes instead of each token. */
function Content({
  className,
  children,
  "aria-label": label = "Conversation",
  ref,
  ...props
}: ConversationContentProps) {
  const { attach } = useConversationContext("Conversation.Content");
  // Stable, or React would detach and reattach the log on every render.
  const mergedRef = useCallback(
    (node: HTMLDivElement | null) => {
      attach(node);
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [attach, ref],
  );
  return (
    <div
      {...props}
      ref={mergedRef}
      role="log"
      aria-live="off"
      aria-label={label}
      tabIndex={0}
      className={["dixy-conversation-content", className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

export interface ConversationScrollButtonProps extends Omit<
  ComponentPropsWithRef<typeof IconButton>,
  "aria-label" | "children"
> {
  /** Accessible name. @default Scroll to latest message */
  "aria-label"?: string;
  children?: ReactNode;
}

/** Appears once the reader leaves the latest message; returns them to it. */
function ScrollButton({
  "aria-label": label = "Scroll to latest message",
  className,
  children,
  onClick,
  ...props
}: ConversationScrollButtonProps) {
  const { atBottom, scrollToBottom, scrollRef } = useConversationContext(
    "Conversation.ScrollButton",
  );
  if (atBottom) return null;
  return (
    <IconButton
      variant="outline"
      color="neutral"
      size="sm"
      {...props}
      aria-label={label}
      className={["dixy-conversation-scroll-button", className]
        .filter(Boolean)
        .join(" ")}
      onClick={(event) => {
        onClick?.(event);
        scrollToBottom();
        // The button unmounts at the bottom; keep focus in the log, not body.
        scrollRef.current?.focus({ preventScroll: true });
      }}
    >
      {children ?? <ArrowDownGlyph />}
    </IconButton>
  );
}

export interface ConversationEmptyStateProps extends Omit<
  ComponentPropsWithRef<"div">,
  "title"
> {
  /** The headline, e.g. "What can I help with?" */
  title?: ReactNode;
  /** A supporting line. */
  description?: ReactNode;
  /** Decorative mark above the title. */
  icon?: ReactNode;
}

function EmptyState({
  title,
  description,
  icon,
  className,
  children,
  ...props
}: ConversationEmptyStateProps) {
  return (
    <div
      {...props}
      className={["dixy-conversation-empty", className]
        .filter(Boolean)
        .join(" ")}
    >
      {icon ? (
        <span className="dixy-conversation-empty-icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      {title ? (
        <h2 className="dixy-conversation-empty-title">{title}</h2>
      ) : null}
      {description ? (
        <p className="dixy-conversation-empty-description">{description}</p>
      ) : null}
      {children}
    </div>
  );
}

/** A chat transcript: a scrolling log that follows streamed replies, a
 * return-to-latest button and polite status announcements. */
export const Conversation = /* @__PURE__ */ (() => ({
  Root,
  Content,
  ScrollButton,
  EmptyState,
}))();
