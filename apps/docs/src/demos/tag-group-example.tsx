import { useState } from "react";
import { Item, TagGroup, Stack } from "@dixy-ui/react";
import type { VisualProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";
export default function TagGroupExample({
  size = "md",
  variant = "outline",
  color = "accent",
  radius,
  material,
}: VisualProps) {
  const visual = { size, radius };
  const [tags, setTags] = useState(["Design", "Engineering", "Research"]);
  return (
    <Stack gap="md" style={{ width: "min(100%, 24rem)" }}>
      <TagGroup.Root
        {...visual}
        onRemove={(keys) => setTags(tags.filter((tag) => !keys.has(tag)))}
      >
        <TagGroup.Label>Project tags</TagGroup.Label>
        <TagGroup.List items={tags.map((id) => ({ id }))}>
          {(item) => (
            <TagGroup.Item id={item.id} textValue={item.id}>
              {item.id}
              <TagGroup.Remove slot="remove" aria-label="Remove" />
            </TagGroup.Item>
          )}
        </TagGroup.List>
      </TagGroup.Root>
    </Stack>
  );
}
