import { useState } from "react";
import { SearchField, Stack, Inline, Text } from "@dixy-ui/react";
import type { VisualProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";
export default function SearchFieldExample({
  size = "md",
  variant = "outline",
  color = "accent",
  radius,
  material,
}: VisualProps) {
  const visual = { size, radius };
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  return (
    <Stack gap="md" style={{ width: "min(100%, 24rem)" }}>
      <SearchField.Root
        {...visual}
        value={query}
        onChange={setQuery}
        onSubmit={() => setMessage(`Search: ${query}`)}
      >
        <SearchField.Label>Search projects</SearchField.Label>
        <Inline>
          <SearchField.Input placeholder="Search…" />
          <SearchField.Clear aria-label="Clear search">×</SearchField.Clear>
        </Inline>
        <SearchField.Description slot="description">
          Press Enter to search.
        </SearchField.Description>
        <Text role="status">{message}</Text>
      </SearchField.Root>
    </Stack>
  );
}
