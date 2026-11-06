import { Box, Container, Inline, Shape, Stack, Text } from "@dixy-ui/react";

export default function ThemeLayoutExample() {
  return (
    <Container size="sm" className="theme-layout-example">
      <Box>
        <Stack gap="md">
          <Shape
            kind="arch"
            style={{
              inlineSize: "2rem",
              blockSize: "2rem",
              color: "var(--dixy-accent)",
            }}
          />
          <Text variant="label.md">A little room to think</Text>
          <Text variant="body.sm" tone="muted">
            Container sets the gutters. Stack and Inline follow your spacing
            density.
          </Text>
          <Inline gap="md">
            {["Explore", "Build", "Share"].map((label) => (
              <Text
                key={label}
                as="span"
                variant="label.sm"
                className="theme-layout-chip"
              >
                {label}
              </Text>
            ))}
          </Inline>
        </Stack>
      </Box>
    </Container>
  );
}
