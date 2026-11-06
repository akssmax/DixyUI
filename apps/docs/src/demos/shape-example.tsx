import {
  Box,
  Button,
  Heading,
  Inline,
  Shape,
  Stack,
  Text,
  Theme as ShapeScope,
} from "@dixy-ui/react";
import type { DecorativeShape, ShapePreset } from "@dixy-ui/tokens";

interface ShapeExampleProps {
  geometry?: ShapePreset;
  silhouette?: DecorativeShape;
  rtl?: boolean;
}
export default function ShapeExample({
  geometry = "pill",
  silhouette = "flower",
  rtl = false,
}: ShapeExampleProps) {
  return (
    <ShapeScope shape={geometry} dir={rtl ? "rtl" : "ltr"}>
      <Box
        as="section"
        aria-label="Shape specimen"
        style={{
          padding: "var(--dixy-card-padding)",
          border: "var(--dixy-border-default)",
          background: "var(--dixy-surface)",
        }}
      >
        <Stack gap="md">
          <Shape
            kind={silhouette}
            label={`${silhouette} silhouette`}
            style={{ color: "var(--dixy-accent)" }}
          />
          <Heading as="h3" variant="heading.sm">
            A shape with room for content.
          </Heading>
          <Text variant="body.sm">
            Artwork stays separate. Labels, hit areas, and focus rings remain
            intact.
          </Text>
          <Inline>
            <Button>Explore shapes</Button>
            <Button shape="square" variant="outline">
              Square override
            </Button>
          </Inline>
        </Stack>
      </Box>
    </ShapeScope>
  );
}
