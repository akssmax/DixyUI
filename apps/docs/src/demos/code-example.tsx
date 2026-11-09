import { Code, Heading, Stack, Text } from "@dixy-ui/react";

export default function CodeExample({
  variant = "soft",
  color = "neutral",
  size = "md",
}: {
  variant?: "soft" | "outline" | "ghost";
  color?: "accent" | "neutral" | "danger" | "success";
  size?: "sm" | "md" | "lg";
}) {
  return (
    <Stack gap="md" style={{ width: "min(100%, 28rem)" }}>
      <Text>
        Run{" "}
        <Code variant={variant} color={color} size={size}>
          pnpm check
        </Code>{" "}
        before every commit.
      </Text>
      <Heading as="h3" variant="title.md">
        Headings scale it too: <Code variant={variant}>useRender</Code>
      </Heading>
    </Stack>
  );
}
