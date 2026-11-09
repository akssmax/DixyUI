import { useState } from "react";
import { Globe } from "lucide-react";
import { Icon, Text, Toggle } from "@dixy-ui/react";
import { PromptInput } from "@dixy-ui/react/ai";
import "@dixy-ui/react/ai.css";

export default function PromptInputExample({
  status = "ready",
  tools = true,
  disabled = false,
}: {
  status?: "ready" | "submitted" | "streaming" | "error";
  tools?: boolean;
  disabled?: boolean;
}) {
  const [sent, setSent] = useState<string | null>(null);
  const [stopped, setStopped] = useState(0);
  return (
    <div style={{ display: "grid", gap: 8, width: "min(100%, 34rem)" }}>
      <PromptInput.Root
        status={status}
        disabled={disabled}
        onSubmit={setSent}
        onStop={() => setStopped((count) => count + 1)}
      >
        <PromptInput.Textarea placeholder="Ask anything" />
        <PromptInput.Footer>
          {tools ? (
            <PromptInput.Tools>
              <Toggle size="sm" variant="ghost" defaultPressed>
                <Icon render={<Globe />} />
                Search
              </Toggle>
            </PromptInput.Tools>
          ) : null}
          <PromptInput.Submit />
        </PromptInput.Footer>
      </PromptInput.Root>
      <Text size="sm" tone="muted" role="status">
        {status === "submitted" || status === "streaming"
          ? `Busy: the button stops the reply (stopped ${stopped}×).`
          : sent
            ? `Sent: “${sent}”`
            : "Enter sends. Shift+Enter adds a line."}
      </Text>
    </div>
  );
}
