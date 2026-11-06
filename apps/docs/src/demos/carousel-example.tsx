import { Item, Carousel, Stack, Inline, Text, Heading } from "@dixy-ui/react";
import type { VisualProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";
export default function CarouselExample({
  size = "md",
  variant = "outline",
  color = "accent",
  radius,
  material,
}: VisualProps) {
  const visual = { size };
  return (
    <Stack gap="md" style={{ width: "min(100%, 24rem)" }}>
      <Carousel.Root {...visual} aria-label="Design principles">
        <Carousel.Viewport>
          {["Clarity", "Consistency", "Character"].map((title, index) => (
            <Carousel.Item key={title} aria-label={`${index + 1} of 3`}>
              <Heading as="h3" variant="title.sm">
                {title}
              </Heading>
              <Text>Make every interaction understandable.</Text>
            </Carousel.Item>
          ))}
        </Carousel.Viewport>
        <Inline>
          <Carousel.Previous size={size} variant="outline" />
          <Carousel.Next size={size} variant="outline" />
        </Inline>
      </Carousel.Root>
    </Stack>
  );
}
