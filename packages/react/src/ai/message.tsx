import {
  createContext,
  useContext,
  type ComponentProps,
  type ComponentPropsWithRef,
  type ReactElement,
  type ReactNode,
} from "react";
import { Avatar } from "../components/avatar";
import { IconButton } from "../components/button";
import { Toolbar } from "../components/toolbar";
import { Tooltip } from "../components/tooltip";

export type MessageRole = "user" | "assistant" | "system";

const MessageContext = createContext<MessageRole>("assistant");

export interface MessageRootProps extends ComponentPropsWithRef<"article"> {
  /** Who wrote it. Sets alignment, the default surface and the accessible name. */
  from: MessageRole;
  /** How the body sits. "contained" is a bubble; "flat" is plain flowing
   * text, the usual choice for long assistant replies.
   * @default contained for user, flat otherwise */
  variant?: "contained" | "flat";
  /** Accessible name of the message, read when moving between messages.
   * @default "You" for user, "Assistant" for assistant, "System" for system */
  "aria-label"?: string;
}

const defaultLabels: Record<MessageRole, string> = {
  user: "You",
  assistant: "Assistant",
  system: "System",
};

function Root({
  from,
  variant,
  className,
  "aria-label": label,
  ...props
}: MessageRootProps) {
  return (
    <MessageContext.Provider value={from}>
      <article
        {...props}
        aria-label={label ?? defaultLabels[from]}
        data-from={from}
        data-variant={variant ?? (from === "user" ? "contained" : "flat")}
        className={["dixy-message", className].filter(Boolean).join(" ")}
      />
    </MessageContext.Provider>
  );
}

export interface MessageAvatarProps extends Omit<
  ComponentProps<typeof Avatar.Root>,
  "children"
> {
  /** Image URL. */
  src?: string;
  /** Initials or an icon while the image loads or when it is missing. */
  fallback?: ReactNode;
}

/** Decorative: the message's accessible name already says who wrote it. */
function MessageAvatar({
  src,
  fallback,
  className,
  size = "sm",
  ...props
}: MessageAvatarProps) {
  return (
    <Avatar.Root
      size={size}
      {...props}
      aria-hidden="true"
      className={["dixy-message-avatar", className].filter(Boolean).join(" ")}
    >
      {src ? <Avatar.Image src={src} alt="" /> : null}
      <Avatar.Fallback>{fallback}</Avatar.Fallback>
    </Avatar.Root>
  );
}

function Content({ className, ...props }: ComponentPropsWithRef<"div">) {
  return (
    <div
      {...props}
      className={["dixy-message-content", className].filter(Boolean).join(" ")}
    />
  );
}

export interface MessageActionsProps extends ComponentProps<
  typeof Toolbar.Root
> {
  /** Accessible name of the toolbar. @default Message actions */
  "aria-label"?: string;
}

/** A toolbar, so a long transcript costs one Tab stop per message; arrow
 * keys move between its actions. */
function Actions({
  className,
  "aria-label": label = "Message actions",
  ...props
}: MessageActionsProps) {
  const from = useContext(MessageContext);
  return (
    <Toolbar.Root
      {...props}
      aria-label={label}
      data-from={from}
      className={["dixy-message-actions", className].filter(Boolean).join(" ")}
    />
  );
}

export interface MessageActionProps extends Omit<
  ComponentProps<typeof IconButton>,
  "aria-label"
> {
  /** The action's name: its accessible name and its tooltip. */
  label: string;
  /** Show the label as a tooltip on hover and focus. @default true */
  tooltip?: boolean;
  /** The pressed state for toggles such as "Good response". */
  "aria-pressed"?: boolean;
  children: ReactElement | ReactNode;
}

function Action({
  label,
  tooltip = true,
  className,
  children,
  ...props
}: MessageActionProps) {
  const button = (
    <Toolbar.Button
      render={
        <IconButton
          variant="ghost"
          color="neutral"
          size="sm"
          {...props}
          aria-label={label}
          className={["dixy-message-action", className]
            .filter(Boolean)
            .join(" ")}
        />
      }
    >
      {children}
    </Toolbar.Button>
  );
  if (!tooltip) return button;
  return (
    <Tooltip.Root>
      <Tooltip.Trigger render={button} />
      <Tooltip.Portal>
        <Tooltip.Positioner sideOffset={6}>
          <Tooltip.Popup>{label}</Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

/** One turn in a conversation: who wrote it, the body and its actions. */
export const Message = /* @__PURE__ */ (() => ({
  Root,
  Avatar: MessageAvatar,
  Content,
  Actions,
  Action,
}))();
