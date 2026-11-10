import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type ReactElement,
  type SVGProps,
} from "react";
import {
  CodeXml,
  Copy,
  Globe,
  Lightbulb,
  Map as MapGlyph,
  Menu as MenuGlyph,
  Moon,
  PanelLeft,
  Rocket,
  RotateCcw,
  Scale,
  Search,
  SquarePen,
  Sun,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import {
  Avatar,
  Button,
  Field,
  Icon,
  IconButton,
  Link,
  Select,
  Sidebar,
  Text,
  TextField,
  Toast,
  Toggle,
  ToggleGroup,
  Tooltip,
} from "@dixy-ui/react";
import {
  Conversation,
  Loader,
  Message,
  PromptInput,
  Reasoning,
  Response,
  Sources,
  Suggestions,
  Tool,
} from "@dixy-ui/react/ai";
import {
  messageText,
  useMockChat,
  type ChatMessage,
  type ChatOptions,
} from "./mock-chat";
import { suggestions } from "./scripts";

const suggestionIcons = [MapGlyph, CodeXml, Scale, Rocket];

type Mode = "chat" | "work";

/** Work mode starters: bigger tasks, shown as cards. Each prompt reuses a
 * script from scripts.ts, so the reply still shows off the AI parts. */
const workStarters = [
  {
    icon: CodeXml,
    title: "Write a React hook",
    description: "Draft a typed useDebouncedValue, ready to drop in",
    prompt: "Write a useDebouncedValue hook in TypeScript",
  },
  {
    icon: Scale,
    title: "Compare UI primitives",
    description: "Weigh Base UI against React Aria for a design system",
    prompt: "Compare Base UI and React Aria for a design system",
  },
  {
    icon: Rocket,
    title: "Check a deploy",
    description: "Look up the latest release and explain what failed",
    prompt: "Check my deploy status",
  },
];

const modeCopy: Record<Mode, { heading: string; placeholder: string }> = {
  chat: { heading: "What’s on your mind?", placeholder: "Ask Wren anything" },
  work: {
    heading: "What should we work on?",
    placeholder: "Describe a task for Wren",
  },
};

const models = [
  { value: "swift", label: "Swift" },
  { value: "deep", label: "Deep" },
];

interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
}

const seedChats: Chat[] = [
  {
    id: "seed-colors",
    title: "Naming colour tokens",
    messages: [
      {
        id: "seed-colors-u",
        role: "user",
        parts: [{ type: "text", text: "How should I name colour tokens?" }],
      },
      {
        id: "seed-colors-a",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: "Name them by **role**, not by hue: `text-primary`, `background-subtle`, `border-focus`. A role survives a rebrand, while `blue-500` does not. Keep the raw scale (`blue-1` to `blue-12`) underneath, and point roles at it.",
          },
        ],
      },
    ],
  },
];

function titleFrom(messages: ChatMessage[]) {
  const first = messages.find((m) => m.role === "user");
  const text = first ? messageText(first) : "";
  return text
    ? text.length > 42
      ? `${text.slice(0, 40)}…`
      : text
    : "New chat";
}

export interface WrenAppProps {
  appearance: "light" | "dark";
  onAppearance: (appearance: "light" | "dark") => void;
  /** The active starter skin's slug; "original" is plain Dixy. */
  skin: string;
  skins: readonly { slug: string; name: string }[];
  onSkin: (slug: string) => void;
}

/** The same starter picker Fernpay uses: every part restyles from tokens. */
function ThemePicker({ skin, skins, onSkin }: WrenAppProps) {
  return (
    <Field.Root className="wren-theme-picker">
      <Field.Label className="dixy-visually-hidden">Theme</Field.Label>
      <Select.Root
        value={skin}
        onValueChange={(value) => value && onSkin(String(value))}
        items={skins.map((s) => ({ value: s.slug, label: s.name }))}
      >
        <Select.Trigger size="sm" aria-label="Theme">
          <Select.Value />
          <Select.Icon />
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner sideOffset={8} align="end">
            <Select.Popup size="sm">
              <Select.List>
                {skins.map((s) => (
                  <Select.Item key={s.slug} value={s.slug}>
                    <Select.ItemText>{s.name}</Select.ItemText>
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </Field.Root>
  );
}

function AppearanceButton({ appearance, onAppearance }: WrenAppProps) {
  const next = appearance === "light" ? "dark" : "light";
  return (
    <Tooltip.Root>
      <Tooltip.Trigger
        render={
          <IconButton
            variant="ghost"
            color="neutral"
            aria-label={`Switch to ${next} appearance`}
            onClick={() => onAppearance(next)}
          />
        }
      >
        <Icon render={appearance === "light" ? <Moon /> : <Sun />} />
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Positioner sideOffset={8}>
          <Tooltip.Popup>
            {appearance === "light" ? "Dark" : "Light"} appearance
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

export function WrenApp(props: WrenAppProps) {
  return (
    <Toast.Provider>
      <Tooltip.Provider delay={400}>
        <Shell {...props} />
        <Toasts />
      </Tooltip.Provider>
    </Toast.Provider>
  );
}

function Toasts() {
  const manager = Toast.useToastManager();
  return (
    <Toast.Portal>
      <Toast.Viewport>
        {manager.toasts.map((toast) => (
          <Toast.Root key={toast.id} toast={toast}>
            <Toast.Content>
              <Toast.Title />
              <Toast.Description />
            </Toast.Content>
            <Toast.Close aria-label="Dismiss notification" />
          </Toast.Root>
        ))}
      </Toast.Viewport>
    </Toast.Portal>
  );
}

function Brand() {
  return (
    <span className="wren-brand">
      <span className="wren-brand-mark" aria-hidden="true" />
      Wren
    </span>
  );
}

function ChatList({
  chats,
  active,
  onSelect,
}: {
  chats: Chat[];
  active: string;
  onSelect: (id: string) => void;
}) {
  if (chats.length === 0)
    return (
      <Text size="sm" tone="muted" className="wren-chat-empty">
        No chats match
      </Text>
    );
  return (
    <ul className="wren-chat-list">
      {chats.map((chat) => (
        <li key={chat.id}>
          <Button
            variant={chat.id === active ? "soft" : "ghost"}
            color="neutral"
            size="sm"
            className="wren-chat-item"
            aria-current={chat.id === active ? "page" : undefined}
            onClick={() => onSelect(chat.id)}
          >
            {chat.title}
          </Button>
        </li>
      ))}
    </ul>
  );
}

/** A sidebar action that shows its label when expanded and a tooltip in the
 * collapsed rail. The label stays in the accessibility tree either way. */
function RailButton({
  icon,
  label,
  collapsed,
  className,
  ...props
}: {
  icon: ReactElement<SVGProps<SVGSVGElement>>;
  label: string;
  collapsed: boolean;
} & Omit<ComponentProps<typeof Button>, "children">) {
  return (
    <Tooltip.Root disabled={!collapsed}>
      <Tooltip.Trigger
        render={
          <Button
            variant="ghost"
            color="neutral"
            size="sm"
            {...props}
            className={["wren-rail-button", className]
              .filter(Boolean)
              .join(" ")}
          />
        }
      >
        <Icon render={icon} />
        <span className="wren-rail-label">{label}</span>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Positioner side="right" sideOffset={8}>
          <Tooltip.Popup>{label}</Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

function Shell(props: WrenAppProps) {
  const chat = useMockChat();
  const [chats, setChats] = useState<Chat[]>(() => [
    { id: "chat-new", title: "New chat", messages: [] },
    ...seedChats,
  ]);
  const [active, setActive] = useState("chat-new");
  const [mobileNav, setMobileNav] = useState(false);
  const [mode, setMode] = useState<Mode>("chat");
  const [collapsed, setCollapsed] = useState(false);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const searchField = useRef<HTMLInputElement>(null);
  const searchButton = useRef<HTMLButtonElement>(null);
  const sidebarId = useId();
  const [options, setOptions] = useState<ChatOptions>({
    model: "deep",
    webSearch: true,
  });
  const textarea = useRef<HTMLTextAreaElement>(null);
  const busy = chat.status === "submitted" || chat.status === "streaming";

  // Mirror the live transcript into the history list.
  useEffect(() => {
    setChats((current) =>
      current.map((item) =>
        item.id === active
          ? {
              ...item,
              messages: chat.messages,
              title: titleFrom(chat.messages),
            }
          : item,
      ),
    );
  }, [chat.messages, active]);

  function open(id: string) {
    if (id === active) return setMobileNav(false);
    const next = chats.find((item) => item.id === id);
    chat.reset(next?.messages ?? []);
    setActive(id);
    setMobileNav(false);
    requestAnimationFrame(() => textarea.current?.focus());
  }

  function newChat() {
    const empty = chats.find((item) => item.messages.length === 0);
    if (empty) return open(empty.id);
    const id = `chat-${Date.now().toString(36)}`;
    chat.reset([]);
    setChats((current) => [
      { id, title: "New chat", messages: [] },
      ...current,
    ]);
    setActive(id);
    setMobileNav(false);
    requestAnimationFrame(() => textarea.current?.focus());
  }

  function send(text: string) {
    chat.sendMessage(text, options);
    textarea.current?.focus();
  }

  function startSearch() {
    setCollapsed(false);
    setSearching(true);
    requestAnimationFrame(() => searchField.current?.focus());
  }

  function endSearch() {
    setSearching(false);
    setQuery("");
  }

  const title = chats.find((item) => item.id === active)?.title ?? "New chat";
  const needle = query.trim().toLowerCase();
  // Like ChatGPT, an unsent chat is not listed until it has a message.
  const visibleChats = chats.filter(
    (item) =>
      item.messages.length > 0 &&
      (!needle || item.title.toLowerCase().includes(needle)),
  );
  const empty = chat.messages.length === 0;

  const searchBox = (
    <TextField
      ref={searchField}
      size="sm"
      type="search"
      aria-label="Search chats"
      placeholder="Search chats"
      value={query}
      className="wren-search-field"
      onChange={(event) => setQuery(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          endSearch();
          // The field unmounts; hand focus back to the button that opened it.
          searchButton.current?.focus();
        }
      }}
    />
  );

  return (
    <div className="wren-shell" data-collapsed={collapsed || undefined}>
      <Sidebar.Content
        className="wren-sidebar"
        radius="none"
        data-collapsed={collapsed || undefined}
      >
        <Sidebar.Header className="wren-sidebar-header">
          <Brand />
          {/* One element in both states, so focus stays on it after toggling. */}
          <Tooltip.Root>
            <Tooltip.Trigger
              render={
                <IconButton
                  variant="ghost"
                  color="neutral"
                  size="sm"
                  className="wren-sidebar-toggle"
                  aria-label={collapsed ? "Open sidebar" : "Close sidebar"}
                  aria-expanded={!collapsed}
                  aria-controls={sidebarId}
                  onClick={() => {
                    setCollapsed(!collapsed);
                    if (!collapsed) endSearch();
                  }}
                />
              }
            >
              <Icon render={<PanelLeft />} />
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Positioner
                side={collapsed ? "right" : "bottom"}
                sideOffset={8}
              >
                <Tooltip.Popup>
                  {collapsed ? "Open sidebar" : "Close sidebar"}
                </Tooltip.Popup>
              </Tooltip.Positioner>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Sidebar.Header>
        <Sidebar.Nav
          id={sidebarId}
          aria-label="Chats"
          className="wren-sidebar-nav"
        >
          <RailButton
            collapsed={collapsed}
            icon={<SquarePen />}
            label="New chat"
            onClick={newChat}
          />
          <RailButton
            collapsed={collapsed}
            icon={<Search />}
            label="Search chats"
            ref={searchButton}
            aria-pressed={searching && !collapsed}
            onClick={() =>
              searching && !collapsed ? endSearch() : startSearch()
            }
          />
          {collapsed ? null : (
            <>
              {searching ? searchBox : null}
              <h2 className="wren-list-heading">Recents</h2>
              <ChatList chats={visibleChats} active={active} onSelect={open} />
            </>
          )}
        </Sidebar.Nav>
        <Sidebar.Footer className="wren-sidebar-footer">
          {collapsed ? null : (
            <div className="wren-sidebar-links">
              <Link href="/playground" size="sm">
                Customise in the theme playground
              </Link>
              <Link href="/dixy-example" size="sm">
                See the Fernpay example
              </Link>
            </div>
          )}
          <div className="wren-user">
            <Avatar.Root size="sm" color="accent" variant="soft">
              <Avatar.Fallback>DX</Avatar.Fallback>
            </Avatar.Root>
            <span className="wren-user-text">
              <span className="wren-user-name">Dixy demo</span>
              <Text size="sm" tone="muted">
                Scripted replies
              </Text>
            </span>
          </div>
        </Sidebar.Footer>
      </Sidebar.Content>

      <Sidebar.Mobile.Root
        open={mobileNav}
        onOpenChange={setMobileNav}
        swipeDirection="left"
      >
        <Sidebar.Mobile.Portal>
          <Sidebar.Mobile.Backdrop />
          <Sidebar.Mobile.Viewport>
            <Sidebar.Mobile.Popup className="wren-mobile-nav">
              <Sidebar.Mobile.Content>
                <Sidebar.Mobile.Title>
                  <Brand />
                </Sidebar.Mobile.Title>
                <nav aria-label="Chats" className="wren-sidebar-nav">
                  <Button
                    variant="ghost"
                    color="neutral"
                    size="sm"
                    className="wren-rail-button"
                    onClick={newChat}
                  >
                    <Icon render={<SquarePen />} /> New chat
                  </Button>
                  {searchBox}
                  <h2 className="wren-list-heading">Recents</h2>
                  <ChatList
                    chats={visibleChats}
                    active={active}
                    onSelect={open}
                  />
                </nav>
                {/* The top bar has no room for these on a phone. */}
                <div className="wren-mobile-settings">
                  <ThemePicker {...props} />
                  <AppearanceButton {...props} />
                </div>
              </Sidebar.Mobile.Content>
            </Sidebar.Mobile.Popup>
          </Sidebar.Mobile.Viewport>
        </Sidebar.Mobile.Portal>
      </Sidebar.Mobile.Root>

      <main
        className="wren-main"
        data-empty={empty || undefined}
        data-mode={mode}
      >
        <header className="wren-topbar">
          <div className="wren-topbar-start">
            <IconButton
              className="wren-only-mobile"
              variant="ghost"
              color="neutral"
              aria-label="Open chats"
              onClick={() => setMobileNav(true)}
            >
              <Icon render={<MenuGlyph />} />
            </IconButton>
            <h1 className="wren-title">{title}</h1>
          </div>
          <ToggleGroup
            segmented
            aria-label="Mode"
            className="wren-mode"
            value={[mode]}
            onValueChange={(value) => value[0] && setMode(value[0] as Mode)}
          >
            <Toggle value="chat" size="sm">
              Chat
            </Toggle>
            <Toggle value="work" size="sm">
              Work
            </Toggle>
          </ToggleGroup>
          <div className="wren-topbar-end">
            <IconButton
              variant="ghost"
              color="neutral"
              className="wren-only-mobile"
              aria-label="New chat"
              onClick={newChat}
            >
              <Icon render={<SquarePen />} />
            </IconButton>
            <div className="wren-only-desktop">
              <ThemePicker {...props} />
              <AppearanceButton {...props} />
            </div>
          </div>
        </header>

        <Conversation.Root
          status={chat.status}
          className="wren-conversation"
          statusLabels={{
            streaming: "Wren is responding",
            ready: chat.messages.at(-1)?.stopped
              ? "Stopped"
              : "Wren finished responding",
          }}
        >
          <Conversation.Content aria-label="Chat with Wren">
            {empty ? (
              <Conversation.EmptyState
                className="wren-welcome"
                title={modeCopy[mode].heading}
                description="Wren replays scripted replies built from the Dixy AI parts."
              />
            ) : (
              chat.messages.map((message, index) => (
                <ChatTurn
                  key={message.id}
                  message={message}
                  streaming={busy && index === chat.messages.length - 1}
                  last={index === chat.messages.length - 1}
                  onRegenerate={() => chat.regenerate(options)}
                />
              ))
            )}
          </Conversation.Content>
          <Conversation.ScrollButton />
        </Conversation.Root>

        <div className="wren-composer" data-mode={mode}>
          <PromptInput.Root
            status={chat.status}
            onSubmit={send}
            onStop={chat.stop}
          >
            <PromptInput.Textarea
              ref={textarea}
              placeholder={modeCopy[mode].placeholder}
              onKeyDown={(event) => {
                if (event.key === "Escape" && busy) {
                  event.preventDefault();
                  chat.stop();
                }
              }}
            />
            <PromptInput.Footer>
              <PromptInput.Tools>
                <Select.Root
                  value={options.model}
                  items={models}
                  onValueChange={(value) =>
                    value &&
                    setOptions((current) => ({
                      ...current,
                      model: value as ChatOptions["model"],
                    }))
                  }
                >
                  <Select.Trigger
                    aria-label="Model"
                    className="wren-model-trigger"
                  >
                    <Select.Value />
                    <Select.Icon />
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Positioner sideOffset={8} side="top">
                      <Select.Popup>
                        <Select.List>
                          {models.map((model) => (
                            <Select.Item key={model.value} value={model.value}>
                              <Select.ItemText>{model.label}</Select.ItemText>
                              <span className="wren-model-note">
                                {model.value === "deep"
                                  ? "Thinks before answering"
                                  : "Answers straight away"}
                              </span>
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.List>
                      </Select.Popup>
                    </Select.Positioner>
                  </Select.Portal>
                </Select.Root>
                <Toggle
                  size="sm"
                  variant="ghost"
                  pressed={options.webSearch}
                  onPressedChange={(webSearch) =>
                    setOptions((current) => ({ ...current, webSearch }))
                  }
                  className="wren-search-toggle"
                >
                  <Icon render={<Globe />} />
                  <span className="wren-search-label">Search</span>
                </Toggle>
              </PromptInput.Tools>
              <PromptInput.Submit />
            </PromptInput.Footer>
          </PromptInput.Root>
          <Text size="sm" tone="muted" className="wren-disclaimer">
            Wren replays scripted replies. Enter sends, Shift+Enter adds a line,
            Esc stops.
          </Text>
        </div>
        {empty && mode === "chat" ? (
          <Suggestions.Root className="wren-suggestions">
            {suggestions.map((suggestion, index) => {
              const Glyph = suggestionIcons[index % suggestionIcons.length]!;
              return (
                <Suggestions.Item
                  key={suggestion}
                  suggestion={suggestion}
                  onSelect={send}
                  variant="ghost"
                  size="md"
                >
                  <Icon render={<Glyph />} />
                  {suggestion}
                </Suggestions.Item>
              );
            })}
          </Suggestions.Root>
        ) : null}
        {empty && mode === "work" ? (
          <section className="wren-work" aria-labelledby={`${sidebarId}-work`}>
            <h2 id={`${sidebarId}-work`} className="wren-work-heading">
              <Icon render={<Lightbulb />} />
              See what Work can do
            </h2>
            <Suggestions.Root
              className="wren-work-cards"
              aria-label="Work starters"
            >
              {workStarters.map(
                ({ icon: Glyph, title, description, prompt }) => (
                  <Suggestions.Item
                    key={title}
                    suggestion={prompt}
                    onSelect={send}
                    variant="outline"
                    size="md"
                    className="wren-work-card"
                  >
                    <span className="wren-work-card-top" aria-hidden="true">
                      <Icon render={<Glyph />} />
                      <span className="wren-work-try">Try</span>
                    </span>
                    <span className="wren-work-card-title">{title}</span>
                    <span className="wren-work-card-text">{description}</span>
                  </Suggestions.Item>
                ),
              )}
            </Suggestions.Root>
          </section>
        ) : null}
      </main>
    </div>
  );
}

function ChatTurn({
  message,
  streaming,
  last,
  onRegenerate,
}: {
  message: ChatMessage;
  streaming: boolean;
  last: boolean;
  onRegenerate: () => void;
}) {
  const toast = Toast.useToastManager();
  const [rating, setRating] = useState<"good" | "bad" | null>(null);
  const lastText = useMemo(
    () =>
      message.parts.reduce(
        (found, part, index) => (part.type === "text" ? index : found),
        -1,
      ),
    [message.parts],
  );

  if (message.role === "user")
    return (
      <Message.Root from="user">
        <Message.Content>{messageText(message)}</Message.Content>
      </Message.Root>
    );

  async function copy() {
    try {
      await navigator.clipboard.writeText(messageText(message));
      toast.add({ title: "Copied to clipboard" });
    } catch {
      toast.add({
        title: "Couldn't copy",
        description: "The clipboard is unavailable.",
      });
    }
  }

  return (
    <Message.Root from="assistant" aria-label="Wren">
      <Message.Avatar fallback={<span className="wren-brand-mark" />} />
      <Message.Content>
        {message.parts.length === 0 && streaming ? (
          <Loader label="Wren is thinking" />
        ) : null}
        {message.parts.map((part, index) => {
          switch (part.type) {
            case "reasoning":
              return (
                <Reasoning.Root key={index} streaming={part.streaming}>
                  <Reasoning.Trigger />
                  <Reasoning.Content>
                    <Response streaming={part.streaming}>{part.text}</Response>
                  </Reasoning.Content>
                </Reasoning.Root>
              );
            case "tool":
              return (
                <Tool.Root key={part.id}>
                  <Tool.Header
                    name={part.name}
                    state={part.state}
                    stateLabels={{ "output-denied": "Cancelled" }}
                  />
                  <Tool.Content>
                    <Tool.Input>{part.input}</Tool.Input>
                    {part.output !== undefined ? (
                      <Tool.Output>{part.output}</Tool.Output>
                    ) : null}
                    {part.errorText ? (
                      <Tool.Error>{part.errorText}</Tool.Error>
                    ) : null}
                  </Tool.Content>
                </Tool.Root>
              );
            case "sources":
              return (
                <Sources.Root key={index}>
                  <Sources.Trigger count={part.sources.length} />
                  <Sources.Content>
                    {part.sources.map((source) => (
                      <Sources.Source key={source.href} {...source} />
                    ))}
                  </Sources.Content>
                </Sources.Root>
              );
            default:
              return (
                <Response
                  key={index}
                  streaming={streaming && index === lastText}
                >
                  {part.text}
                </Response>
              );
          }
        })}
        {message.stopped ? (
          <Text size="sm" tone="muted">
            Stopped
          </Text>
        ) : null}
      </Message.Content>
      {!streaming && message.parts.length > 0 ? (
        <Message.Actions>
          <Message.Action label="Copy" onClick={copy}>
            <Icon render={<Copy />} />
          </Message.Action>
          {last ? (
            <Message.Action label="Regenerate" onClick={onRegenerate}>
              <Icon render={<RotateCcw />} />
            </Message.Action>
          ) : null}
          <Message.Action
            label="Good response"
            aria-pressed={rating === "good"}
            onClick={() => setRating(rating === "good" ? null : "good")}
          >
            <Icon render={<ThumbsUp />} />
          </Message.Action>
          <Message.Action
            label="Bad response"
            aria-pressed={rating === "bad"}
            onClick={() => setRating(rating === "bad" ? null : "bad")}
          >
            <Icon render={<ThumbsDown />} />
          </Message.Action>
        </Message.Actions>
      ) : null}
    </Message.Root>
  );
}
