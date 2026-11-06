import type { Density } from "@dixy-ui/tokens";

export const spacingExample = (
  density: Density,
  gap: "sm" | "md" | "lg",
  rtl: boolean,
) => `import { Button, Heading, Inline, Stack, Text, Theme } from "@dixy-ui/react";
import "@dixy-ui/react/styles.css";

export function Settings() {
  return (
    <Theme density="${density}" dir="${rtl ? "rtl" : "ltr"}">
      <Stack gap="${gap}" style={{ padding: "var(--dixy-card-padding)" }}>
        <Heading as="h2" size="sm">Your workspace</Heading>
        <Text>Spacing follows density. Controls keep their height.</Text>
        <Inline gap="sm" align="center">
          <Button>Save changes</Button>
          <Button variant="outline">Cancel</Button>
        </Inline>
      </Stack>
    </Theme>
  );
}`;
