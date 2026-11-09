import { useEffect, useRef, useState } from "react";
import { Button } from "@dixy-ui/react";
import { Reasoning, Response } from "@dixy-ui/react/ai";
import "@dixy-ui/react/ai.css";

const thought =
  "The reader asked for a weekend plan. Rain is likely on Saturday, so indoor places should come first, close together, with one food stop each day.";

export default function ReasoningExample({
  autoClose = true,
}: {
  autoClose?: boolean;
}) {
  const [text, setText] = useState(thought);
  const [streaming, setStreaming] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);
  useEffect(() => () => clearInterval(timer.current), []);

  function think() {
    clearInterval(timer.current);
    setText("");
    setStreaming(true);
    let index = 0;
    timer.current = setInterval(() => {
      index += 3;
      setText(thought.slice(0, index));
      if (index >= thought.length) {
        clearInterval(timer.current);
        setStreaming(false);
      }
    }, 40);
  }

  return (
    <div style={{ display: "grid", gap: 16, width: "min(100%, 32rem)" }}>
      <Reasoning.Root streaming={streaming} autoClose={autoClose}>
        <Reasoning.Trigger />
        <Reasoning.Content>
          <Response streaming={streaming}>{text}</Response>
        </Reasoning.Content>
      </Reasoning.Root>
      <Button
        variant="outline"
        color="neutral"
        size="sm"
        onClick={think}
        disabled={streaming}
        style={{ justifySelf: "start" }}
      >
        Think again
      </Button>
    </div>
  );
}
