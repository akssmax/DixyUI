import {
  Heading,
  Text,
  type HeadingVariant,
  type TextVariant,
  type TextProps,
} from "@dixy-ui/react";

interface TypographyExampleProps extends Pick<TextProps, "tone"> {
  headingVariant?: HeadingVariant;
  textVariant?: TextVariant;
}

export default function TypographyExample({
  headingVariant = "heading.sm",
  textVariant = "body.md",
  tone = "muted",
}: TypographyExampleProps) {
  return (
    <div
      style={{
        display: "grid",
        gap: "var(--dixy-spacing-stack-sm)",
        maxWidth: "36rem",
        minWidth: 0,
      }}
    >
      <Heading as="h3" variant={headingVariant}>
        Make something feel something.
      </Heading>
      <Text variant={textVariant} tone={tone}>
        The right words, in the right proportions. A little clarity goes a long
        way.
      </Text>
    </div>
  );
}
