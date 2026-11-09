/**
 * @dixy-ui/react/ai: chat and agent interface parts composed from Dixy
 * primitives. The anatomy follows Vercel's AI Elements (Apache-2.0); the code
 * is Dixy's own. Import "@dixy-ui/react/ai.css" alongside the core styles.
 * Response needs the optional peers react-markdown and remark-gfm.
 */
export type { ChatStatus, ToolState } from "./ai/types";
export {
  Conversation,
  useStickToBottom,
  type ConversationRootProps,
  type ConversationContentProps,
  type ConversationScrollButtonProps,
  type ConversationEmptyStateProps,
  type ConversationStatusLabels,
} from "./ai/conversation";
export {
  Message,
  type MessageRole,
  type MessageRootProps,
  type MessageAvatarProps,
  type MessageActionsProps,
  type MessageActionProps,
} from "./ai/message";
export { Response, type ResponseProps } from "./ai/response";
export { CodeBlock, type CodeBlockProps } from "./ai/code-block";
export {
  PromptInput,
  usePromptInputContext,
  type PromptInputRootProps,
  type PromptInputTextareaProps,
  type PromptInputSubmitProps,
} from "./ai/prompt-input";
export {
  Suggestions,
  type SuggestionsRootProps,
  type SuggestionItemProps,
} from "./ai/suggestion";
export {
  Reasoning,
  type ReasoningRootProps,
  type ReasoningTriggerProps,
} from "./ai/reasoning";
export { Tool, type ToolHeaderProps, type ToolSectionProps } from "./ai/tool";
export {
  Sources,
  type SourcesTriggerProps,
  type SourceProps,
} from "./ai/sources";
export {
  Shimmer,
  Loader,
  type ShimmerProps,
  type ShimmerOwnProps,
  type LoaderProps,
} from "./ai/shimmer";
export { completeMarkdown, splitMarkdownBlocks } from "./ai/markdown";
