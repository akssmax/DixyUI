import { IconButton, Stack, Text, VisuallyHidden } from "@dixy-ui/react";

export default function VisuallyHiddenExample({
  focusable = true,
}: {
  focusable?: boolean;
}) {
  return (
    <Stack gap="md" style={{ width: "min(100%, 24rem)" }}>
      <VisuallyHidden focusable={focusable}>
        <a href="#visually-hidden-target">Skip to content</a>
      </VisuallyHidden>
      <Text tone="muted" variant="body.sm">
        Press Tab: the skip link appears only while it has focus.
      </Text>
      <IconButton aria-label="Notifications" variant="outline">
        <span aria-hidden="true">🔔</span>
      </IconButton>
      <Text id="visually-hidden-target">
        Unread
        <VisuallyHidden> notifications</VisuallyHidden>: 3
      </Text>
    </Stack>
  );
}
