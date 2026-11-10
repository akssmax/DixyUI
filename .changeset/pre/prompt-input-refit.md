---
"@dixy-ui/react": patch
---

`PromptInput.Textarea` re-measures its height when its width changes, so a resize or a layout change no longer leaves it too tall or too short. Markdown tables in `Response` wrap only between words and scroll sideways on narrow screens, instead of breaking words letter by letter.

`Conversation.Content` is now a positioning context, so visually hidden labels inside messages no longer stretch the page and let it scroll beneath the conversation.
