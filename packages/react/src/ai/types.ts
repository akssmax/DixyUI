/** Request lifecycle, matching the AI SDK's `useChat` status values. */
export type ChatStatus = "ready" | "submitted" | "streaming" | "error";

/** Tool call lifecycle, matching the AI SDK's tool part `state` values. */
export type ToolState =
  | "input-streaming"
  | "input-available"
  | "approval-requested"
  | "approval-responded"
  | "output-available"
  | "output-error"
  | "output-denied";
