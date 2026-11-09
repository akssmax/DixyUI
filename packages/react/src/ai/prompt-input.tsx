import {
  createContext,
  useCallback,
  useContext,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentProps,
  type ComponentPropsWithRef,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { IconButton } from "../components/button";
import { ArrowUpGlyph, StopGlyph } from "../utilities/inline-icons";
import type { ChatStatus } from "./types";

interface PromptInputContextValue {
  value: string;
  setValue: (value: string) => void;
  status: ChatStatus;
  disabled: boolean;
  submit: () => void;
  stop?: () => void;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  textareaId: string;
}
const PromptInputContext = createContext<PromptInputContextValue | null>(null);
function usePromptInput(part: string) {
  const context = useContext(PromptInputContext);
  if (!context)
    throw new Error(`${part} must be placed inside PromptInput.Root.`);
  return context;
}

const busy = (status: ChatStatus) =>
  status === "submitted" || status === "streaming";

export interface PromptInputRootProps extends Omit<
  ComponentPropsWithRef<"form">,
  "onSubmit"
> {
  /** Controlled text. Pair with `onValueChange`. */
  value?: string;
  /** Initial text when uncontrolled. @default "" */
  defaultValue?: string;
  /** Called on every edit. */
  onValueChange?: (value: string) => void;
  /** Called with the trimmed text when the user sends. Uncontrolled inputs
   * clear themselves afterwards. Not called for empty text or while busy. */
  onSubmit?: (text: string) => void;
  /** Request state. While submitted or streaming, the send button becomes a
   * stop button and Enter does not send. @default ready */
  status?: ChatStatus;
  /** Called when the user stops a reply in progress. */
  onStop?: () => void;
  /** Disable typing and sending. @default false */
  disabled?: boolean;
}

function Root({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onSubmit,
  status = "ready",
  onStop,
  disabled = false,
  className,
  children,
  ...props
}: PromptInputRootProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const controlled = valueProp !== undefined;
  const value = controlled ? valueProp : uncontrolled;
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const textareaId = useId();

  const setValue = useCallback(
    (next: string) => {
      if (!controlled) setUncontrolled(next);
      onValueChange?.(next);
    },
    [controlled, onValueChange],
  );

  const submit = useCallback(() => {
    const text = value.trim();
    if (!text || disabled || busy(status)) return;
    onSubmit?.(text);
    if (!controlled) setUncontrolled("");
  }, [value, disabled, status, onSubmit, controlled]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit();
  }

  return (
    <PromptInputContext.Provider
      value={{
        value,
        setValue,
        status,
        disabled,
        submit,
        stop: onStop,
        textareaRef,
        textareaId,
      }}
    >
      <form
        {...props}
        data-status={status}
        data-disabled={disabled || undefined}
        className={["dixy-prompt-input", className].filter(Boolean).join(" ")}
        onSubmit={handleSubmit}
        // Clicking the frame's padding focuses the textarea, like a native field.
        onPointerDown={(event) => {
          props.onPointerDown?.(event);
          if (event.target === event.currentTarget) {
            event.preventDefault();
            textareaRef.current?.focus();
          }
        }}
      >
        {children}
      </form>
    </PromptInputContext.Provider>
  );
}

export interface PromptInputTextareaProps extends Omit<
  ComponentPropsWithRef<"textarea">,
  "value" | "defaultValue"
> {
  /** Accessible name. @default Message */
  "aria-label"?: string;
  /** Tallest the field grows before it scrolls, in pixels. @default 200 */
  maxHeight?: number;
}

/** Grows with its content. Enter sends; Shift+Enter adds a line. Enter that
 * confirms an IME composition (Japanese, Chinese, Korean input) never sends. */
function Textarea({
  className,
  "aria-label": label = "Message",
  maxHeight = 200,
  placeholder = "Send a message",
  rows = 1,
  onChange,
  onKeyDown,
  ref,
  style,
  ...props
}: PromptInputTextareaProps) {
  const { value, setValue, submit, disabled, textareaRef, textareaId } =
    usePromptInput("PromptInput.Textarea");

  useLayoutEffect(() => {
    const element = textareaRef.current;
    if (!element) return;
    element.style.height = "auto";
    element.style.height = `${Math.min(element.scrollHeight, maxHeight)}px`;
    element.style.overflowY =
      element.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [value, maxHeight, textareaRef]);

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key !== "Enter" || event.shiftKey) return;
    // keyCode 229 covers Safari, which ends composition before keydown.
    if (event.nativeEvent.isComposing || event.keyCode === 229) return;
    event.preventDefault();
    submit();
  }

  return (
    <textarea
      {...props}
      id={props.id ?? textareaId}
      ref={(node) => {
        textareaRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      rows={rows}
      value={value}
      disabled={disabled}
      placeholder={placeholder}
      aria-label={label}
      enterKeyHint="send"
      style={{ maxHeight, ...style }}
      className={["dixy-prompt-input-textarea", className]
        .filter(Boolean)
        .join(" ")}
      onChange={(event) => {
        onChange?.(event);
        setValue(event.target.value);
      }}
      onKeyDown={handleKeyDown}
    />
  );
}

function Footer({ className, ...props }: ComponentPropsWithRef<"div">) {
  return (
    <div
      {...props}
      className={["dixy-prompt-input-footer", className]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

function Tools({ className, ...props }: ComponentPropsWithRef<"div">) {
  return (
    <div
      {...props}
      className={["dixy-prompt-input-tools", className]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

export interface PromptInputSubmitProps extends Omit<
  ComponentProps<typeof IconButton>,
  "aria-label" | "type" | "children"
> {
  /** Accessible name while ready. @default Send message */
  sendLabel?: string;
  /** Accessible name while a reply is in progress. @default Stop generating */
  stopLabel?: string;
  /** Replace the icons. Receives whether the button currently stops. */
  children?: ReactNode | ((stopping: boolean) => ReactNode);
}

/** Send, then Stop while the reply is in progress. It is one button that
 * changes role, so keyboard focus stays on it across the switch. Empty input
 * leaves it focusable but inert rather than disabled, for the same reason. */
function Submit({
  sendLabel = "Send message",
  stopLabel = "Stop generating",
  children,
  className,
  onClick,
  ...props
}: PromptInputSubmitProps) {
  const { value, status, disabled, stop } =
    usePromptInput("PromptInput.Submit");
  const stopping = busy(status) && !!stop;
  const empty = value.trim() === "";
  const inert = disabled || (!stopping && (empty || busy(status)));
  return (
    <IconButton
      variant="solid"
      color="accent"
      size="sm"
      {...props}
      type={stopping ? "button" : "submit"}
      aria-label={stopping ? stopLabel : sendLabel}
      data-action={stopping ? "stop" : "send"}
      disabled={inert}
      focusableWhenDisabled
      className={["dixy-prompt-input-submit", className]
        .filter(Boolean)
        .join(" ")}
      onClick={(event) => {
        onClick?.(event);
        if (stopping) {
          event.preventDefault();
          stop?.();
        }
      }}
    >
      {typeof children === "function"
        ? children(stopping)
        : (children ?? (stopping ? <StopGlyph /> : <ArrowUpGlyph />))}
    </IconButton>
  );
}

/** The message composer: a growing textarea, a row for tools such as a model
 * picker, and a send/stop button. */
export const PromptInput = /* @__PURE__ */ (() => ({
  Root,
  Textarea,
  Footer,
  Tools,
  Submit,
}))();
export { usePromptInput as usePromptInputContext };
