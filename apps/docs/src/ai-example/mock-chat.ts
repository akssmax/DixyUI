/**
 * A scripted stand-in for a model. It streams reasoning, tool calls, markdown
 * and sources on timers, in the same message-part shape the AI SDK's
 * `useChat` produces, so the UI is written exactly as it would be against a
 * real backend. No network, no keys, and every run of a demo looks the same.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatStatus, ToolState } from "@dixy-ui/react/ai";
import { pickScript, type ScriptStep } from "./scripts";

export type MessagePart =
  | { type: "text"; text: string }
  | { type: "reasoning"; text: string; streaming: boolean }
  | {
      type: "tool";
      id: string;
      name: string;
      state: ToolState;
      input: unknown;
      output?: unknown;
      errorText?: string;
    }
  | { type: "sources"; sources: { href: string; title: string }[] };

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  parts: MessagePart[];
  /** Set when the reader stopped the reply part way. */
  stopped?: boolean;
}

export interface ChatOptions {
  /** "deep" models think out loud before answering. */
  model: "swift" | "deep";
  /** Whether replies may call the search tool and cite sources. */
  webSearch: boolean;
}

let counter = 0;
const id = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${counter++}`;

/** Wait, rejecting as soon as the reply is stopped. */
function wait(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) return reject(signal.reason);
    const timer = setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(signal.reason);
      },
      { once: true },
    );
  });
}

/** Split text into small uneven chunks, roughly how tokens arrive. */
function chunks(text: string) {
  const out: string[] = [];
  let index = 0;
  while (index < text.length) {
    const size = 2 + ((index * 7) % 5);
    out.push(text.slice(index, index + size));
    index += size;
  }
  return out;
}

export function useMockChat(initial: ChatMessage[] = []) {
  const [messages, setMessages] = useState<ChatMessage[]>(initial);
  const [status, setStatus] = useState<ChatStatus>("ready");
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);

  /** Apply a change to the assistant message being written. */
  const update = useCallback(
    (messageId: string, change: (parts: MessagePart[]) => MessagePart[]) =>
      setMessages((current) =>
        current.map((message) =>
          message.id === messageId
            ? { ...message, parts: change(message.parts) }
            : message,
        ),
      ),
    [],
  );

  const run = useCallback(
    async (steps: ScriptStep[], messageId: string, signal: AbortSignal) => {
      const streamInto = async (
        kind: "text" | "reasoning",
        text: string,
        speed: number,
      ) => {
        update(messageId, (parts) => [
          ...parts,
          kind === "text"
            ? { type: "text", text: "" }
            : { type: "reasoning", text: "", streaming: true },
        ]);
        for (const piece of chunks(text)) {
          await wait(speed, signal);
          update(messageId, (parts) => {
            const last = parts.at(-1)!;
            if (last.type !== "text" && last.type !== "reasoning") return parts;
            return [
              ...parts.slice(0, -1),
              { ...last, text: last.text + piece },
            ];
          });
        }
        if (kind === "reasoning")
          update(messageId, (parts) =>
            parts.map((part) =>
              part.type === "reasoning" ? { ...part, streaming: false } : part,
            ),
          );
      };

      await wait(450, signal);
      setStatus("streaming");
      for (const step of steps) {
        if (step.kind === "reasoning")
          await streamInto("reasoning", step.text, 18);
        else if (step.kind === "text") await streamInto("text", step.text, 14);
        else if (step.kind === "sources") {
          await wait(200, signal);
          update(messageId, (parts) => [
            ...parts,
            { type: "sources", sources: step.sources },
          ]);
        } else {
          const toolId = id("tool");
          const setTool = (
            patch: Partial<Extract<MessagePart, { type: "tool" }>>,
          ) =>
            update(messageId, (parts) =>
              parts.map((part) =>
                part.type === "tool" && part.id === toolId
                  ? { ...part, ...patch }
                  : part,
              ),
            );
          update(messageId, (parts) => [
            ...parts,
            {
              type: "tool",
              id: toolId,
              name: step.name,
              state: "input-streaming",
              input: step.input,
            },
          ]);
          await wait(350, signal);
          setTool({ state: "input-available" });
          await wait(step.duration ?? 1100, signal);
          if (step.error)
            setTool({ state: "output-error", errorText: step.error });
          else setTool({ state: "output-available", output: step.output });
        }
      }
    },
    [update],
  );

  const respond = useCallback(
    async (prompt: string, options: ChatOptions) => {
      controller.current?.abort();
      const abort = new AbortController();
      controller.current = abort;
      const messageId = id("assistant");
      setStatus("submitted");
      setMessages((current) => [
        ...current,
        { id: messageId, role: "assistant", parts: [] },
      ]);
      try {
        await run(pickScript(prompt, options), messageId, abort.signal);
        setStatus("ready");
      } catch {
        if (!abort.signal.aborted) {
          setStatus("error");
          return;
        }
        // Stopped: settle anything left mid-flight so nothing spins forever.
        setMessages((current) =>
          current.map((message) =>
            message.id === messageId
              ? {
                  ...message,
                  stopped: true,
                  parts: message.parts.map((part) =>
                    part.type === "reasoning"
                      ? { ...part, streaming: false }
                      : part.type === "tool" &&
                          (part.state === "input-streaming" ||
                            part.state === "input-available")
                        ? { ...part, state: "output-denied" as const }
                        : part,
                  ),
                }
              : message,
          ),
        );
        setStatus("ready");
      } finally {
        if (controller.current === abort) controller.current = null;
      }
    },
    [run],
  );

  const sendMessage = useCallback(
    (text: string, options: ChatOptions) => {
      setMessages((current) => [
        ...current,
        { id: id("user"), role: "user", parts: [{ type: "text", text }] },
      ]);
      void respond(text, options);
    },
    [respond],
  );

  /** Replace the last reply with a fresh run of the same prompt. */
  const regenerate = useCallback(
    (options: ChatOptions) => {
      const lastUser = [...messages].reverse().find((m) => m.role === "user");
      const prompt = lastUser?.parts.find((p) => p.type === "text");
      if (!prompt || prompt.type !== "text") return;
      setMessages((current) =>
        current.at(-1)?.role === "assistant" ? current.slice(0, -1) : current,
      );
      void respond(prompt.text, options);
    },
    [messages, respond],
  );

  const stop = useCallback(() => controller.current?.abort("stopped"), []);

  const reset = useCallback((next: ChatMessage[] = []) => {
    controller.current?.abort("reset");
    setMessages(next);
    setStatus("ready");
  }, []);

  return { messages, status, sendMessage, regenerate, stop, reset };
}

/** The plain text of a message, for copying. */
export function messageText(message: ChatMessage) {
  return message.parts
    .filter(
      (part): part is Extract<MessagePart, { type: "text" }> =>
        part.type === "text",
    )
    .map((part) => part.text)
    .join("\n\n");
}
