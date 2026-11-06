import { useState } from "react";
import { Heart, Plus } from "lucide-react";
import { Icon, IconButton, Inline, Stack, Text } from "@dixy-ui/react";

export default function ThemeIconButtonExample() {
  const [favorite, setFavorite] = useState(false);
  const [added, setAdded] = useState(0);
  return (
    <Stack gap="md">
      <Inline gap="md">
        <IconButton
          aria-label="Favorite project"
          aria-pressed={favorite}
          variant={favorite ? "solid" : "soft"}
          onClick={() => setFavorite(!favorite)}
        >
          <Icon render={<Heart />} />
        </IconButton>
        <IconButton
          aria-label="Add project"
          variant="outline"
          onClick={() => setAdded((count) => count + 1)}
        >
          <Icon render={<Plus />} />
        </IconButton>
        <IconButton aria-label="Unavailable project action" disabled>
          <Icon render={<Plus />} />
        </IconButton>
      </Inline>
      <Text variant="body.sm" tone="muted" role="status">
        {added
          ? `${added} ${added === 1 ? "project" : "projects"} added locally.`
          : favorite
            ? "Project favorited."
            : "Small controls. Clear names."}
      </Text>
    </Stack>
  );
}
