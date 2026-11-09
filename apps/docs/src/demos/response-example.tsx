import { useEffect, useRef, useState } from "react";
import { Button } from "@dixy-ui/react";
import { Response } from "@dixy-ui/react/ai";
import "@dixy-ui/react/ai.css";

const samples = {
  mixed: `## Release checklist

Ship the **beta** once these pass:

- [x] \`pnpm check\`
- [x] Package verification
- [ ] A screen reader pass

> Raw <b>HTML</b> stays text, never markup.

Read more in the [Base UI docs](https://base-ui.com).`,
  table: `| Part | Built from |
| --- | --- |
| Conversation | native log + scroll anchoring |
| Reasoning | Base UI Collapsible |
| Message actions | Base UI Toolbar |`,
  code: `Debounce a value:

\`\`\`tsx
const query = useDebouncedValue(input, 250);
\`\`\``,
} as const;

export default function ResponseExample({
  content = "mixed",
}: {
  content?: "mixed" | "table" | "code";
}) {
  const markdown = samples[content];
  const [shown, setShown] = useState<string>(markdown);
  const [streaming, setStreaming] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);
  useEffect(() => {
    clearInterval(timer.current);
    setShown(markdown);
    setStreaming(false);
  }, [markdown]);
  useEffect(() => () => clearInterval(timer.current), []);

  function replay() {
    clearInterval(timer.current);
    setStreaming(true);
    let index = 0;
    timer.current = setInterval(() => {
      index += 3;
      setShown(markdown.slice(0, index));
      if (index >= markdown.length) {
        clearInterval(timer.current);
        setStreaming(false);
      }
    }, 35);
  }

  return (
    <div style={{ display: "grid", gap: 16, width: "min(100%, 34rem)" }}>
      <Response streaming={streaming}>{shown}</Response>
      <Button
        variant="outline"
        color="neutral"
        size="sm"
        onClick={replay}
        disabled={streaming}
        style={{ justifySelf: "start" }}
      >
        Replay as a stream
      </Button>
    </div>
  );
}
