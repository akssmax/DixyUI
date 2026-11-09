import { useState } from "react";
import { Copy, RotateCcw, ThumbsUp } from "lucide-react";
import { Icon } from "@dixy-ui/react";
import { Message } from "@dixy-ui/react/ai";
import "@dixy-ui/react/ai.css";

export default function MessageExample({
  variant = "flat",
  avatar = true,
  actions = true,
}: {
  variant?: "contained" | "flat";
  avatar?: boolean;
  actions?: boolean;
}) {
  const [liked, setLiked] = useState(false);
  return (
    <div style={{ display: "grid", gap: 16, width: "min(100%, 32rem)" }}>
      <Message.Root from="user">
        {avatar ? <Message.Avatar fallback="MA" /> : null}
        <Message.Content>Can you summarise the release notes?</Message.Content>
      </Message.Root>
      <Message.Root from="assistant" variant={variant}>
        {avatar ? <Message.Avatar fallback="AI" color="accent" /> : null}
        <Message.Content>
          Three things changed: a new AI entry, faster tree shaking, and clearer
          focus rings on every control.
        </Message.Content>
        {actions ? (
          <Message.Actions>
            <Message.Action label="Copy">
              <Icon render={<Copy />} />
            </Message.Action>
            <Message.Action label="Regenerate">
              <Icon render={<RotateCcw />} />
            </Message.Action>
            <Message.Action
              label="Good response"
              aria-pressed={liked}
              onClick={() => setLiked(!liked)}
            >
              <Icon render={<ThumbsUp />} />
            </Message.Action>
          </Message.Actions>
        ) : null}
      </Message.Root>
    </div>
  );
}
