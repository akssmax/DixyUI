import { useState, type CSSProperties } from "react";
import {
  Button,
  Container,
  Field,
  Heading,
  IconButton,
  Inline,
  Stack,
  Text,
  TextField,
  Theme as DensityScope,
} from "@dixy-ui/react";
import {
  size,
  type ContainerSize,
  type ControlSize,
  type Density,
  type TargetSize,
} from "@dixy-ui/tokens";

interface SizingLayoutExampleProps {
  controlSize?: ControlSize;
  targetSize?: TargetSize;
  density?: Density;
  containerSize?: ContainerSize;
  rtl?: boolean;
}

function ActionIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export default function SizingLayoutExample({
  controlSize = "md",
  targetSize = "minimum",
  density = "default",
  containerSize = "xl",
  rtl = false,
}: SizingLayoutExampleProps) {
  const [message, setMessage] = useState("No action yet.");
  const targetStyle = {
    "--dixy-interaction-target": size("target", targetSize),
  } as CSSProperties;
  return (
    <DensityScope
      density={density}
      dir={rtl ? "rtl" : "ltr"}
      style={targetStyle}
    >
      <Container
        size={containerSize}
        className="sizing-layout-container"
        style={{
          background: "var(--dixy-surface-muted)",
          paddingBlock: "var(--dixy-spacing-inset-md)",
        }}
      >
        <Stack gap="md">
          <Heading as="h3" variant="heading.sm">
            A workspace that fits
          </Heading>
          <Text>
            Container gutters follow the viewport. Control size stays
            independent of density.
          </Text>
          <Field.Root>
            <Field.Label>Workspace name</Field.Label>
            <TextField size={controlSize} defaultValue="Dixy Studio" />
          </Field.Root>
          <Inline gap="md">
            <Button
              size={controlSize}
              onClick={() => setMessage("Workspace saved.")}
            >
              <ActionIcon />
              Save workspace
            </Button>
            <IconButton
              size={controlSize}
              variant="outline"
              aria-label="More workspace actions"
              onClick={() => setMessage("More actions selected.")}
            >
              <ActionIcon />
            </IconButton>
          </Inline>
          <Text role="status" variant="body.sm">
            {message}
          </Text>
        </Stack>
      </Container>
    </DensityScope>
  );
}
