import { Blockquote, Text } from "@dixy-ui/react";

export default function BlockquoteExample({
  size = "md",
  color = "accent",
}: {
  size?: "sm" | "md" | "lg";
  color?: "accent" | "neutral" | "danger" | "success";
}) {
  return (
    <figure style={{ margin: 0, width: "min(100%, 30rem)" }}>
      <Blockquote size={size} color={color}>
        A design system is a product that serves products.
      </Blockquote>
      <Text
        as="span"
        variant="body.sm"
        tone="muted"
        style={{ display: "block", marginTop: 8 }}
      >
        — <cite>Design systems handbook</cite>
      </Text>
    </figure>
  );
}
