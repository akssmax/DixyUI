import { useEffect, useRef, useState } from "react";
import { Button } from "@dixy-ui/react";
import {
  Conversation,
  Message,
  Response,
  type ChatStatus,
} from "@dixy-ui/react/ai";
import "@dixy-ui/react/ai.css";

const reply =
  "Streaming text grows the log a few characters at a time. While you are at the end, the view **follows** it. Scroll up mid-reply and it lets you read; the arrow button brings you back.\n\n- Status is announced once: *Responding*, then *Response complete*.\n- The log itself is not a live region, so tokens are never read one by one.";

export default function ConversationExample({
  empty = false,
}: {
  empty?: boolean;
}) {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<ChatStatus>("ready");
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);
  useEffect(() => () => clearInterval(timer.current), []);

  function stream() {
    clearInterval(timer.current);
    setText("");
    setStatus("streaming");
    let index = 0;
    timer.current = setInterval(() => {
      index += 4;
      setText(reply.slice(0, index));
      if (index >= reply.length) {
        clearInterval(timer.current);
        setStatus("ready");
      }
    }, 30);
  }

  return (
    <div style={{ display: "grid", gap: 12, width: "min(100%, 34rem)" }}>
      <Conversation.Root
        status={status}
        style={{
          height: 300,
          border: "1px solid var(--dixy-color-border-subtle)",
          borderRadius: 16,
        }}
      >
        <Conversation.Content>
          {empty ? (
            <Conversation.EmptyState
              title="Start a conversation"
              description="Messages you send appear here."
            />
          ) : (
            <>
              <Message.Root from="user">
                <Message.Content>
                  How does the log follow a reply?
                </Message.Content>
              </Message.Root>
              <Message.Root from="assistant">
                <Message.Content>
                  <Response streaming={status === "streaming"}>
                    {text || "Press **Stream a reply** to watch."}
                  </Response>
                </Message.Content>
              </Message.Root>
            </>
          )}
        </Conversation.Content>
        <Conversation.ScrollButton />
      </Conversation.Root>
      <Button
        variant="outline"
        color="neutral"
        size="sm"
        onClick={stream}
        disabled={empty || status === "streaming"}
        style={{ justifySelf: "start" }}
      >
        Stream a reply
      </Button>
    </div>
  );
}
