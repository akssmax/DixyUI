import { useState } from "react";
import { Text } from "@dixy-ui/react";
import { Suggestions } from "@dixy-ui/react/ai";
import "@dixy-ui/react/ai.css";

const prompts = [
  "Summarise this thread",
  "Draft a reply",
  "Find the action items",
];

export default function SuggestionsExample({
  size = "sm",
  variant = "outline",
}: {
  size?: "sm" | "md" | "lg";
  variant?: "outline" | "soft" | "ghost";
}) {
  const [chosen, setChosen] = useState<string | null>(null);
  return (
    <div style={{ display: "grid", gap: 12, width: "min(100%, 30rem)" }}>
      <Suggestions.Root>
        {prompts.map((prompt) => (
          <Suggestions.Item
            key={prompt}
            suggestion={prompt}
            size={size}
            variant={variant}
            onSelect={setChosen}
          />
        ))}
      </Suggestions.Root>
      <Text size="sm" tone="muted" role="status">
        {chosen ? `Would send: “${chosen}”` : "Pick a prompt."}
      </Text>
    </div>
  );
}
