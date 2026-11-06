import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Dialog,
  Field,
  IconButton,
  Text,
  TextField,
  Textarea,
  Switch,
} from "@dixy-ui/react";
import {
  Archive,
  ArrowLeft,
  ArrowUpRight,
  Inbox,
  Mail,
  Pencil,
  Reply,
  Search,
  Send,
  Star,
  Trash2,
  X,
} from "lucide-react";
import "../styles/theme-scenes.css";

const seedMessages = [
  {
    id: 1,
    sender: "Maya Chen",
    initials: "MC",
    address: "maya@example.com",
    subject: "A little inspiration for the next chapter",
    preview: "I've been collecting a few things that made me stop and look.",
    time: "10:42",
    body: [
      "Hey there,",
      "I've been collecting a few things that made me stop and look this week. A beautifully worn book cover. The way the light falls across a ceramic cup. An old music player with a skin someone made just for themselves.",
      "There's something lovely about tools that feel personal. I thought these might spark a few ideas for what we're making next.",
      "No rush. Take a look whenever you have a quiet moment.",
      "Maya",
    ],
    unread: true,
  },
  {
    id: 2,
    sender: "Alex Rivera",
    initials: "AR",
    address: "alex@example.com",
    subject: "Friday's design session",
    preview: "A few thoughts before we get together. Bring your wild ideas.",
    time: "09:18",
    body: [
      "Hi team,",
      "For Friday's design session, let's bring one thing that has a personality all its own.",
      "It could be a book, a website, a piece of music equipment or something from your kitchen. We'll explore what makes it feel that way.",
      "Bring your wild ideas. See you Friday!",
      "Alex",
    ],
    unread: true,
  },
  {
    id: 3,
    sender: "Studio North",
    initials: "SN",
    address: "hello@example.com",
    subject: "Your workspace, a little more you",
    preview: "A small update with room for a lot of possibility.",
    time: "Yesterday",
    body: [
      "Hello,",
      "Your workspace is ready for a fresh start.",
      "Choose a look you love, change a few details, and make yourself at home. It's still the same familiar tools, with a little more character.",
      "We can't wait to see what you make.",
      "Studio North",
    ],
    unread: false,
  },
  {
    id: 4,
    sender: "Jamie Park",
    initials: "JP",
    address: "jamie@example.com",
    subject: "The playlist you asked for",
    preview: "Here it is. Something for a slow afternoon.",
    time: "Yesterday",
    body: [
      "Hey!",
      "Here's that playlist you asked about. A few old favorites and a couple of new discoveries.",
      "Hope it makes a good companion for a slow afternoon.",
      "Jamie",
    ],
    unread: false,
  },
];
type Message = (typeof seedMessages)[number];
export default function ThemeEmailScene() {
  const [folder, setFolder] = useState("Inbox");
  const [messages, setMessages] = useState(seedMessages);
  const [active, setActive] = useState<number | null>(1);
  const [query, setQuery] = useState("");
  const [starred, setStarred] = useState<number[]>([1]);
  const [archived, setArchived] = useState<number[]>([]);
  const [deleted, setDeleted] = useState<number[]>([]);
  const [compose, setCompose] = useState(false);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sent, setSent] = useState<Message[]>([]);
  const [notice, setNotice] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [reply, setReply] = useState("");
  const [showReader, setShowReader] = useState(false);
  const sceneRef = useRef<HTMLDivElement>(null);
  const readerToggled = useRef(false);
  // In single-pane mode the list and reader swap. Move focus with them so
  // keyboard users don't land on <body> when the focused pane is hidden.
  useEffect(() => {
    if (!readerToggled.current) {
      readerToggled.current = true;
      return;
    }
    const scene = sceneRef.current;
    if (!scene) return;
    const target = showReader
      ? scene.querySelector<HTMLElement>(".theme-mail-back")
      : scene.querySelector<HTMLElement>(
          ".theme-mail-message[data-selected] .theme-mail-message-open",
        );
    if (target && target.offsetParent !== null) target.focus();
  }, [showReader]);
  const selected = (folder === "Sent" ? sent : messages).find(
    (m) => m.id === active,
  );
  const visible = useMemo(() => {
    const source =
      folder === "Sent"
        ? sent
        : messages.filter((m) =>
            folder === "Trash"
              ? deleted.includes(m.id)
              : !deleted.includes(m.id) &&
                (folder === "Archive"
                  ? archived.includes(m.id)
                  : !archived.includes(m.id)),
          );
    return source.filter(
      (m) =>
        (folder !== "Starred" || starred.includes(m.id)) &&
        (!unreadOnly || m.unread) &&
        (m.sender + " " + m.subject + " " + m.preview)
          .toLowerCase()
          .includes(query.toLowerCase()),
    );
  }, [folder, messages, sent, query, archived, deleted, starred, unreadOnly]);
  function choose(message: Message) {
    setReply("");
    setActive(message.id);
    setShowReader(true);
    setMessages((ms) =>
      ms.map((m) => (m.id === message.id ? { ...m, unread: false } : m)),
    );
  }
  function changeFolder(next: string) {
    setFolder(next);
    setActive(null);
    setShowReader(false);
    setQuery("");
  }
  function favorite(id: number) {
    setStarred((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id],
    );
  }
  function startCompose(reply = false) {
    setTo(reply && selected ? selected.address : "");
    setSubject(reply && selected ? "Re: " + selected.subject : "");
    setBody("");
    setCompose(true);
  }
  function send(event: FormEvent) {
    event.preventDefault();
    const message = {
      id: Date.now(),
      sender: "You",
      initials: "YO",
      address: to,
      subject,
      preview: body,
      time: "Just now",
      body: body.split("\n").filter(Boolean),
      unread: false,
    };
    setSent((current) => [message, ...current]);
    setCompose(false);
    setNotice("Message added to Sent in this preview.");
  }
  const folders = [
    ["Inbox", Inbox],
    ["Starred", Star],
    ["Sent", Send],
    ["Archive", Archive],
    ["Trash", Trash2],
  ] as const;
  const inboxUnread = messages.filter(
    (m) => m.unread && !deleted.includes(m.id) && !archived.includes(m.id),
  ).length;
  return (
    <Card.Root
      ref={sceneRef}
      className="theme-email-scene"
      data-reading={showReader || undefined}
    >
      <div className="theme-mail-shell">
        <aside className="theme-mail-nav" aria-label="Mailbox">
          <div className="theme-mail-brand">
            <span className="theme-mail-brand-mark" aria-hidden="true">
              <Mail size={16} />
            </span>
            <span className="theme-mail-label">
              <strong>Postbox</strong>
              <small>alex@example.com</small>
            </span>
          </div>
          <Button
            className="theme-mail-compose"
            aria-label="Compose"
            onClick={() => startCompose()}
          >
            <Pencil size={16} />
            <span className="theme-mail-label">Compose</span>
          </Button>
          <nav aria-label="Mailbox folders">
            {folders.map(([name, Icon]) => (
              <Button
                key={name}
                variant={folder === name ? "soft" : "ghost"}
                color="neutral"
                aria-label={name}
                aria-pressed={folder === name}
                title={name}
                onClick={() => changeFolder(name)}
              >
                <Icon size={16} />
                <span className="theme-mail-label">{name}</span>
                {name === "Inbox" && inboxUnread > 0 && (
                  <span className="theme-mail-count">{inboxUnread}</span>
                )}
              </Button>
            ))}
          </nav>
          <div className="theme-mail-account">
            <Avatar.Root size="sm">
              <Avatar.Fallback>AS</Avatar.Fallback>
            </Avatar.Root>
            <span className="theme-mail-label">
              <Text size="sm" variant="label.sm">
                Alex S.
              </Text>
              <Text size="sm" tone="muted">
                Personal workspace
              </Text>
            </span>
          </div>
        </aside>
        <section className="theme-mail-list" aria-label={folder}>
          <header className="theme-mail-pane-header">
            <div className="theme-mail-list-heading">
              <h2>{folder}</h2>
              <Badge variant="soft" color="neutral">
                {visible.length}
              </Badge>
              <div
                className="theme-mail-filter"
                role="group"
                aria-label="Filter messages"
              >
                <Button
                  size="sm"
                  variant={!unreadOnly ? "soft" : "ghost"}
                  color="neutral"
                  aria-pressed={!unreadOnly}
                  onClick={() => setUnreadOnly(false)}
                >
                  All
                </Button>
                <Button
                  size="sm"
                  variant={unreadOnly ? "soft" : "ghost"}
                  color="neutral"
                  aria-pressed={unreadOnly}
                  onClick={() => setUnreadOnly(true)}
                >
                  Unread
                </Button>
              </div>
            </div>
          </header>
          <div className="theme-mail-search">
            <label>
              <Search size={15} aria-hidden="true" />
              <span className="sr-only">Search messages</span>
              <TextField
                type="search"
                value={query}
                onValueChange={setQuery}
                placeholder="Search"
              />
            </label>
          </div>
          <div
            className="theme-mail-messages"
            role="group"
            aria-label={folder + " messages"}
          >
            {visible.map((message) => (
              <div
                key={message.id}
                className="theme-mail-message"
                data-selected={active === message.id || undefined}
              >
                <button
                  type="button"
                  className="theme-mail-message-open"
                  aria-pressed={active === message.id}
                  onClick={() => choose(message)}
                >
                  <span className="theme-mail-message-top">
                    <strong>
                      {message.unread && (
                        <span
                          className="theme-unread-dot"
                          aria-label="Unread"
                        />
                      )}
                      {message.sender}
                    </strong>
                    <small>{message.time}</small>
                  </span>
                  <span className="theme-mail-message-subject">
                    {message.subject}
                  </span>
                  <span className="theme-mail-message-preview">
                    {message.preview}
                  </span>
                </button>
                <IconButton
                  variant="ghost"
                  color="neutral"
                  size="sm"
                  className="theme-mail-star"
                  aria-label={
                    (starred.includes(message.id) ? "Unstar " : "Star ") +
                    message.subject
                  }
                  aria-pressed={starred.includes(message.id)}
                  onClick={() => favorite(message.id)}
                >
                  <Star
                    size={14}
                    fill={
                      starred.includes(message.id) ? "currentColor" : "none"
                    }
                  />
                </IconButton>
              </div>
            ))}
            {!visible.length && (
              <div className="theme-mail-empty">
                <Inbox size={28} />
                <Text>No messages here.</Text>
                <Text size="sm" tone="muted">
                  {query ? "Try another search." : "A little breathing room."}
                </Text>
              </div>
            )}
          </div>
        </section>
        <section className="theme-mail-reader" aria-label="Message">
          <header className="theme-mail-pane-header theme-mail-toolbar">
            <Button
              variant="ghost"
              color="neutral"
              size="sm"
              className="theme-mail-back"
              onClick={() => setShowReader(false)}
            >
              <ArrowLeft size={15} />
              {folder}
            </Button>
            <div>
              <IconButton
                variant="ghost"
                color="neutral"
                aria-label="Archive message"
                disabled={
                  !selected ||
                  folder === "Sent" ||
                  folder === "Trash" ||
                  folder === "Archive"
                }
                onClick={() => {
                  if (!selected) return;
                  setArchived((ids) => [...ids, selected.id]);
                  setActive(null);
                  setShowReader(false);
                  setNotice("Message moved to Archive.");
                }}
              >
                <Archive size={16} />
              </IconButton>
              <IconButton
                variant="ghost"
                color="neutral"
                aria-label="Move message to trash"
                disabled={!selected || folder === "Sent" || folder === "Trash"}
                onClick={() => {
                  if (!selected) return;
                  setDeleted((ids) => [...ids, selected.id]);
                  setActive(null);
                  setShowReader(false);
                  setNotice("Message moved to Trash.");
                }}
              >
                <Trash2 size={16} />
              </IconButton>
              <IconButton
                variant="ghost"
                color="neutral"
                aria-label="Reply in composer"
                disabled={!selected}
                onClick={() => startCompose(true)}
              >
                <Reply size={16} />
              </IconButton>
            </div>
          </header>
          {selected ? (
            <>
              <div className="theme-mail-reader-body">
                <div className="theme-mail-sender">
                  <Avatar.Root>
                    <Avatar.Fallback>{selected.initials}</Avatar.Fallback>
                  </Avatar.Root>
                  <div>
                    <Text size="sm" variant="label.sm">
                      {selected.sender}
                    </Text>
                    <Text size="sm" tone="muted">
                      {folder === "Sent"
                        ? "To: " + selected.address
                        : selected.address}
                    </Text>
                  </div>
                  <Text size="sm" tone="muted">
                    {selected.time}
                  </Text>
                </div>
                <div className="theme-mail-subject">
                  <h2>{selected.subject}</h2>
                  <Badge variant="soft" color="neutral">
                    {folder === "Trash"
                      ? "Trash"
                      : folder === "Archive"
                        ? "Archived"
                        : "Personal"}
                  </Badge>
                  {(folder === "Trash" || folder === "Archive") && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setDeleted((ids) =>
                          ids.filter((id) => id !== selected.id),
                        );
                        setArchived((ids) =>
                          ids.filter((id) => id !== selected.id),
                        );
                        changeFolder("Inbox");
                        setNotice("Message restored to Inbox.");
                      }}
                    >
                      Restore to inbox
                    </Button>
                  )}
                </div>
                <div className="theme-mail-body">
                  {selected.body.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>
              <form
                className="theme-mail-reply"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!reply.trim()) return;
                  setSent((current) => [
                    {
                      id: Date.now(),
                      sender: "You",
                      initials: "YO",
                      address: selected.address,
                      subject: "Re: " + selected.subject,
                      preview: reply,
                      time: "Just now",
                      body: [reply],
                      unread: false,
                    },
                    ...current,
                  ]);
                  setReply("");
                  setNotice("Reply added to Sent in this preview.");
                }}
              >
                <label>
                  <span className="sr-only">Reply to {selected.sender}</span>
                  <Textarea
                    value={reply}
                    onChange={(event) => setReply(event.target.value)}
                    placeholder={"Reply to " + selected.sender + "…"}
                    rows={3}
                  />
                </label>
                <div className="theme-mail-reply-actions">
                  <label>
                    <Switch.Root size="sm">
                      <Switch.Thumb />
                    </Switch.Root>
                    Mute thread
                  </label>
                  <Button size="sm" type="submit" disabled={!reply.trim()}>
                    Send <Send size={14} />
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="theme-mail-empty">
              <Mail size={34} />
              <Text variant="label.md">No message selected</Text>
              <Text size="sm" tone="muted">
                Choose a message or write something new.
              </Text>
              <Button variant="outline" onClick={() => startCompose()}>
                Write a message <ArrowUpRight size={16} />
              </Button>
            </div>
          )}
        </section>
      </div>
      <span className="theme-mail-notice" role="status">
        {notice}
      </span>
      <Dialog.Root open={compose} onOpenChange={setCompose}>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Viewport>
            <Dialog.Popup className="theme-compose-dialog">
              <div className="theme-compose-heading">
                <Dialog.Title>A new conversation.</Dialog.Title>
                <Dialog.Close
                  render={
                    <IconButton
                      variant="ghost"
                      color="neutral"
                      aria-label="Close compose"
                    />
                  }
                >
                  <X size={18} />
                </Dialog.Close>
              </div>
              <Dialog.Description>
                A local preview. Sending adds your message to this mock inbox's
                Sent folder.
              </Dialog.Description>
              <form onSubmit={send}>
                <Field.Root>
                  <Field.Label>To</Field.Label>
                  <TextField
                    type="email"
                    required
                    value={to}
                    onValueChange={setTo}
                    placeholder="hello@example.com"
                  />
                </Field.Root>
                <Field.Root>
                  <Field.Label>Subject</Field.Label>
                  <TextField
                    required
                    value={subject}
                    onValueChange={setSubject}
                    placeholder="What's on your mind?"
                  />
                </Field.Root>
                <label className="theme-compose-message">
                  Message
                  <Textarea
                    required
                    value={body}
                    onChange={(event) => setBody(event.target.value)}
                    placeholder="A few words can go a long way…"
                    rows={7}
                  />
                </label>
                <div className="theme-compose-footer">
                  <Button type="submit">
                    <Send size={16} />
                    Send preview
                  </Button>
                  <Dialog.Close
                    render={<Button variant="ghost" color="neutral" />}
                  >
                    Discard
                  </Dialog.Close>
                </div>
              </form>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>
    </Card.Root>
  );
}
