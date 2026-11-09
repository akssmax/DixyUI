// AI parts from the optional @dixy-ui/react/ai entry. The anatomy follows
// Vercel's AI Elements (Apache-2.0); each part is Dixy's own composition.
export const aiComponentRegistry = {
  conversation: {
    exportName: "Conversation",
    title: "Conversation",
    category: "AI",
    description: "Follows the reply, lets the reader wander.",
    detail:
      "A chat transcript that keeps the newest text in view while it streams, and lets go as soon as the reader scrolls up. A button returns them to the latest message. Status changes are announced once each, never token by token.",
    primitive: "",
    engine: "Native HTML",
    api: [
      "ConversationRootProps",
      "ConversationContentProps",
      "ConversationScrollButtonProps",
      "ConversationEmptyStateProps",
    ],
    source: "ai/conversation.tsx",
    load: () => import("../demos/conversation-example"),
    code: () => import("../demos/conversation-example?raw"),
    composition: {
      tree: "Conversation.Root (status) — relative frame + role=status announcer\n├── Conversation.Content — role=log, aria-live=off, tabIndex=0, scrolls\n│   ├── Conversation.EmptyState (title, description) — when empty\n│   └── Message.Root …\n└── Conversation.ScrollButton — only while away from the end",
      detail:
        "Content is the scroll container, so the page around it stays still. Keep it mounted; swap what is inside it. Root announces Sending, Responding and Response complete through one polite status region.",
    },
    controls: [{ name: "empty", label: "Empty state", initial: false }],
    keyboard: [
      ["Tab", "Focus the log; arrow keys and Page Up/Down scroll it."],
      [
        "Arrow Up / Page Up / Home",
        "Scroll back and stop following the reply.",
      ],
      ["Enter / Space", "On the scroll button: jump to the latest message."],
    ],
    accessibility:
      "The log is role=log with aria-live=off: a live log would read every streamed token. Root announces status changes once each instead. The log is keyboard focusable because it scrolls. The scroll button moves focus into the log as it disappears, so focus never drops to the page.",
    lesson:
      "Following a stream is an instant scroll on every growth, because smooth scrolling lags each token and jitters. Scroll events arrive too late to notice a small upward nudge, so wheel, touch and key intent release the pin first.",
    token: "--dixy-shadow-floating",
  },
  message: {
    exportName: "Message",
    title: "Message",
    category: "AI",
    description: "Who said it, and what you can do with it.",
    detail:
      "One turn in a conversation: an article named for its author, an optional avatar, the body, and a row of actions. User messages sit in a bubble on the right; assistant replies flow as plain text.",
    primitive: "",
    engine: "Base UI + native",
    api: [
      "MessageRootProps",
      "MessageAvatarProps",
      "MessageActionsProps",
      "MessageActionProps",
    ],
    source: "ai/message.tsx",
    load: () => import("../demos/message-example"),
    code: () => import("../demos/message-example?raw"),
    composition: {
      tree: 'Message.Root (from, variant) — article aria-label="You" | "Assistant"\n├── Message.Avatar — decorative Avatar\n├── Message.Content — bubble or flat text\n└── Message.Actions — Base UI Toolbar\n    └── Message.Action (label) — IconButton + Tooltip',
      detail:
        "variant defaults from the author: contained for user, flat otherwise. Actions are a toolbar, so a long transcript costs one Tab stop per message.",
    },
    controls: [
      {
        name: "variant",
        label: "Assistant body",
        options: ["contained", "flat"],
        initial: "flat",
      },
      { name: "avatar", label: "Avatars", initial: true },
      { name: "actions", label: "Actions", initial: true },
    ],
    keyboard: [
      ["Tab", "Move into a message's actions, then on to the next message."],
      ["Arrow Left / Right", "Move between actions inside the toolbar."],
      ["Enter / Space", "Run the focused action."],
    ],
    accessibility:
      "Each message is an article whose name says who wrote it, so screen reader users can move between turns. The avatar is hidden because the name already identifies the author. Every action has a label that is both its accessible name and its tooltip; toggles such as Good response use aria-pressed.",
    lesson:
      "A Toolbar is the right container when the same set of actions repeats many times: roving focus keeps the Tab sequence short without hiding anything.",
    token: "--dixy-color-background-action-primary-subtle",
  },
  response: {
    exportName: "Response",
    title: "Response",
    category: "AI",
    description: "Markdown that reads well mid-sentence.",
    detail:
      "Renders a model's GitHub-flavored markdown with Dixy typography, code blocks, links and tables. While text is still arriving, unfinished fences and bold are closed for display, so half a reply never turns into a wall of code or stray asterisks.",
    primitive: "",
    engine: "react-markdown + remark-gfm",
    api: ["ResponseProps"],
    source: "ai/response.tsx",
    load: () => import("../demos/response-example"),
    code: () => import("../demos/response-example?raw"),
    composition: {
      tree: "Response (streaming, headingOffset, components)\n├── block — memoized, parsed once\n├── block — memoized, parsed once\n└── last block — repaired with completeMarkdown while streaming\n    ├── h3 (from #), p, ul, Blockquote, Code\n    ├── CodeBlock (from ``` fences)\n    └── Table (from pipes), scrollable region",
      detail:
        "Markdown is split into blocks at blank lines; finished blocks are memoized, so each new token re-parses only the last one. Install the optional peers react-markdown and remark-gfm.",
    },
    controls: [
      {
        name: "content",
        label: "Content",
        options: ["mixed", "table", "code"],
        initial: "mixed",
      },
    ],
    keyboard: [
      ["Tab", "Reach links, copy buttons, and scrollable code and tables."],
      ["Arrow keys", "Scroll a focused code block or table sideways."],
    ],
    accessibility:
      "Headings shift down two levels by default, so a reply's # Title does not compete with the page's own h1. External links open in a new tab with rel=noopener. Raw HTML in a reply is shown as text, never rendered. A streaming response sets aria-busy.",
    lesson:
      "A partial reply is invalid markdown most of the time. Repairing only the tail (close the fence, pair the **, drop a half-arrived link) keeps every frame readable without changing the final text.",
    token: "--dixy-font-body-md",
  },
  "code-block": {
    exportName: "CodeBlock",
    title: "Code Block",
    category: "AI",
    description: "Code with its language, one click from the clipboard.",
    detail:
      "A fenced code block with a language label and a copy button. Response uses it for every ``` fence. Pass highlighted markup as children to add syntax colors; the copy action still copies the original code.",
    primitive: "",
    engine: "Native HTML",
    api: ["CodeBlockProps"],
    source: "ai/code-block.tsx",
    load: () => import("../demos/code-block-example"),
    code: () => import("../demos/code-block-example?raw"),
    composition: {
      tree: "CodeBlock (figure)\n├── figcaption — language + IconButton copy\n├── pre tabIndex=0 > code\n└── span[role=status] — Copied / Copy failed",
      detail:
        "Long lines scroll inside the block, which is focusable for that reason. The copy result is announced politely.",
    },
    controls: [
      {
        name: "language",
        label: "Language",
        options: ["tsx", "bash", "json"],
        initial: "tsx",
      },
    ],
    keyboard: [
      ["Tab", "Focus the copy button, then the code."],
      ["Arrow Left / Right", "Scroll long lines in the focused code."],
    ],
    accessibility:
      "The copy button has a constant name and the result is announced through a status region. The scrollable pre is named after its language.",
    lesson:
      "Keep the source of truth separate from its presentation: highlighted markup is for eyes, the code string is for the clipboard.",
    token: "--dixy-font-code-sm",
  },
  "prompt-input": {
    exportName: "PromptInput",
    title: "Prompt Input",
    category: "AI",
    description: "Say it, send it, stop it.",
    detail:
      "The message composer: a textarea that grows with its content, a row for tools such as a model picker, and one button that sends, then stops the reply while it is in progress.",
    primitive: "",
    engine: "Native HTML",
    api: [
      "PromptInputRootProps",
      "PromptInputTextareaProps",
      "PromptInputSubmitProps",
    ],
    source: "ai/prompt-input.tsx",
    load: () => import("../demos/prompt-input-example"),
    code: () => import("../demos/prompt-input-example?raw"),
    composition: {
      tree: "PromptInput.Root (form; value, onSubmit, status, onStop)\n├── PromptInput.Textarea — autosizes; Enter sends\n└── PromptInput.Footer\n    ├── PromptInput.Tools — Select, Toggle, …\n    └── PromptInput.Submit — Send ↔ Stop",
      detail:
        "Root owns the value (controlled or not) and the request status. While submitted or streaming, Enter does not send and Submit becomes Stop; typing the next message is still allowed.",
    },
    controls: [
      {
        name: "status",
        label: "Status",
        options: ["ready", "submitted", "streaming", "error"],
        initial: "ready",
      },
      { name: "tools", label: "Tools row", initial: true },
      { name: "disabled", label: "Disabled", initial: false },
    ],
    keyboard: [
      ["Enter", "Send the message."],
      ["Shift + Enter", "Add a new line."],
      [
        "Enter during IME composition",
        "Confirm the composed text; never sends.",
      ],
      ["Tab", "Move to the tools, then to Send or Stop."],
    ],
    accessibility:
      "Send and Stop are one button that changes its name, so focus survives the switch. With empty input the button is aria-disabled but still focusable, so focus is never dropped to the page after sending. The textarea has an accessible name, not just a placeholder.",
    lesson:
      "isComposing is the difference between a Japanese user confirming a word and sending half a sentence. Safari ends composition before keydown, so keyCode 229 is checked as well.",
    token: "--dixy-radius-card",
  },
  suggestions: {
    exportName: "Suggestions",
    title: "Suggestions",
    category: "AI",
    description: "A good first question, one tap away.",
    detail:
      "Starter prompts as a wrapping list of buttons. Each sends its prompt through onSelect. Long prompts wrap into soft cards instead of overflowing.",
    primitive: "",
    engine: "Native HTML",
    api: ["SuggestionsRootProps", "SuggestionItemProps"],
    source: "ai/suggestion.tsx",
    load: () => import("../demos/suggestions-example"),
    code: () => import("../demos/suggestions-example?raw"),
    composition: {
      tree: 'Suggestions.Root — ul aria-label="Suggestions"\n└── Suggestions.Item (suggestion, onSelect) — li > Button',
      detail:
        "Items take Button's size, variant and color. Move focus to the composer after one is chosen, since the list usually disappears.",
    },
    controls: [
      {
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
        initial: "sm",
      },
      {
        name: "variant",
        label: "Treatment",
        options: ["outline", "soft", "ghost"],
        initial: "outline",
      },
    ],
    keyboard: [
      ["Tab", "Move between suggestions."],
      ["Enter / Space", "Send the focused suggestion."],
    ],
    accessibility:
      "A list announces how many prompts there are. Each button's name is its prompt, so it says exactly what will be sent.",
    lesson:
      "A 1.25em radius is a pill on one line and a soft card on two, so one rule handles every prompt length.",
    token: "--dixy-size-control-sm",
  },
  reasoning: {
    exportName: "Reasoning",
    title: "Reasoning",
    category: "AI",
    description: "Watch it think, then tuck it away.",
    detail:
      "The model's visible thinking. It opens while thinking streams so the reader can follow, then closes once to a single line: Thought for N seconds. A reader who toggled it keeps their choice.",
    primitive: "Collapsible",
    engine: "Base UI",
    api: ["ReasoningRootProps", "ReasoningTriggerProps"],
    source: "ai/reasoning.tsx",
    load: () => import("../demos/reasoning-example"),
    code: () => import("../demos/reasoning-example?raw"),
    composition: {
      tree: "Reasoning.Root (streaming, autoClose, duration) — Collapsible.Root\n├── Reasoning.Trigger — Shimmer “Thinking…” → “Thought for N seconds”\n└── Reasoning.Content — Collapsible.Panel, usually a Response",
      detail:
        "Duration is measured from the streaming prop unless you pass it. Control open yourself to turn off the automatic behavior.",
    },
    controls: [{ name: "autoClose", label: "Close when done", initial: true }],
    keyboard: [["Enter / Space", "Open or close the reasoning."]],
    accessibility:
      "The trigger is a real button with aria-expanded and aria-controls from Base UI Collapsible. The shimmer is visual only; the label is read normally, and reduced motion makes it static.",
    lesson:
      "Automatic behavior must yield to the person. One ref remembers that the reader touched the disclosure, and the auto-close never overrides them.",
    token: "--dixy-disclosure-motion-reveal",
  },
  tool: {
    exportName: "Tool",
    title: "Tool",
    category: "AI",
    description: "What the model called, and what came back.",
    detail:
      "A tool call as a collapsed card: the tool's name and a state badge, with the input, output or error inside. States match the AI SDK's tool part states.",
    primitive: "Collapsible",
    engine: "Base UI",
    api: ["ToolHeaderProps", "ToolSectionProps"],
    source: "ai/tool.tsx",
    load: () => import("../demos/tool-example"),
    code: () => import("../demos/tool-example?raw"),
    composition: {
      tree: "Tool.Root — Collapsible.Root\n├── Tool.Header (name, state, stateLabels) — trigger + Badge\n└── Tool.Content — Collapsible.Panel\n    ├── Tool.Input — JSON\n    ├── Tool.Output — JSON or a React element\n    └── Tool.Error",
      detail:
        "Objects are shown as formatted JSON; pass an element to render a richer result. Override badge text with stateLabels, for example Cancelled for a stopped call.",
    },
    controls: [
      {
        name: "state",
        label: "State",
        options: [
          "input-streaming",
          "input-available",
          "approval-requested",
          "output-available",
          "output-error",
          "output-denied",
        ],
        initial: "output-available",
      },
      { name: "defaultOpen", label: "Open", initial: false },
    ],
    keyboard: [["Enter / Space", "Show or hide the call's details."]],
    accessibility:
      "The state is text in a badge, not color alone, and it is part of the trigger's accessible name. Errors are not alerts: the panel mounts when the reader opens it, and the badge already reports the failure.",
    lesson:
      "An alert inside a disclosure fires when the reader opens it, which is exactly when they least need interrupting. Report state where it is first seen.",
    token: "--dixy-color-background-action-destructive-subtle",
  },
  sources: {
    exportName: "Sources",
    title: "Sources",
    category: "AI",
    description: "Where the answer came from.",
    detail:
      "The pages a reply drew on, behind a Used N sources disclosure. Each source shows its title and host and opens in a new tab.",
    primitive: "Collapsible",
    engine: "Base UI",
    api: ["SourcesTriggerProps", "SourceProps"],
    source: "ai/sources.tsx",
    load: () => import("../demos/sources-example"),
    code: () => import("../demos/sources-example?raw"),
    composition: {
      tree: "Sources.Root — Collapsible.Root\n├── Sources.Trigger (count) — “Used N sources”\n└── Sources.Content — Collapsible.Panel > ul\n    └── Sources.Source (href, title) — li > a target=_blank",
      detail:
        "The host name is derived from href, and stands in for a missing title.",
    },
    controls: [{ name: "defaultOpen", label: "Open", initial: true }],
    keyboard: [
      ["Enter / Space", "Show or hide the sources."],
      ["Tab", "Move between source links."],
      ["Enter", "Open the focused source in a new tab."],
    ],
    accessibility:
      "Each link's accessible name ends with (opens in a new tab), so the new window is not a surprise. Links use rel=noreferrer noopener.",
    lesson:
      "Count in the trigger, detail on demand: citations stay available without crowding every reply.",
    token: "--dixy-color-text-secondary",
  },
  shimmer: {
    exportNames: ["Shimmer", "Loader"],
    title: "Shimmer & Loader",
    category: "AI",
    description: "Something is happening.",
    detail:
      "Shimmer sweeps light across a label such as Thinking…; Loader is three pulsing dots for a reply on its way. Both turn static with reduced motion.",
    primitive: "",
    engine: "Native HTML",
    api: ["ShimmerOwnProps", "LoaderProps"],
    source: "ai/shimmer.tsx",
    load: () => import("../demos/shimmer-example"),
    code: () => import("../demos/shimmer-example?raw"),
    composition: {
      tree: "Shimmer (as, duration) — text with a moving gradient\nLoader (label) — role=status, three aria-hidden dots + visually hidden label",
      detail:
        "Shimmer is purely visual: announce progress elsewhere, for example through Conversation's status. Loader announces its label once.",
    },
    controls: [
      {
        name: "speed",
        label: "Speed",
        options: ["fast", "normal", "slow"],
        initial: "normal",
      },
    ],
    keyboard: [],
    accessibility:
      "Shimmer text is read normally; the sweep is decoration. Loader is a status with a label. With reduced motion or Theme effects set to reduced, both stop animating and stay legible.",
    lesson:
      "background-clip: text paints a gradient through the letters; animating its position is cheap and needs no extra DOM.",
    token: "--dixy-color-text-primary",
  },
} as const;
