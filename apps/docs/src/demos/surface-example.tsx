import { useState, type CSSProperties } from "react";
import {
  Button,
  Dialog,
  Field,
  Heading,
  Inline,
  Stack,
  Text,
  TextField,
  Theme as SurfaceScope,
} from "@dixy-ui/react";
import {
  border,
  shadow,
  surfaceRadius,
  type BorderRole,
  type Density,
  type RadiusPreset,
  type ShadowRole,
} from "@dixy-ui/tokens";

interface SurfaceExampleProps {
  radiusPreset?: RadiusPreset;
  borderRole?: BorderRole;
  elevation?: ShadowRole;
  density?: Density;
  rtl?: boolean;
}

export default function SurfaceExample({
  radiusPreset = "md",
  borderRole = "default",
  elevation = "raised",
  density = "default",
  rtl = false,
}: SurfaceExampleProps) {
  const [message, setMessage] = useState("No changes saved.");
  const cardStyle = {
    padding: "var(--dixy-card-padding)",
    background: "var(--dixy-color-background-surface-raised)",
    border: border(borderRole),
    borderRadius: surfaceRadius("card"),
    boxShadow: shadow(elevation),
  } as CSSProperties;
  return (
    <SurfaceScope
      radius={radiusPreset}
      density={density}
      dir={rtl ? "rtl" : "ltr"}
    >
      <section
        aria-label="Surface preview"
        className="surface-example-card"
        style={cardStyle}
      >
        <Stack gap="md">
          <Heading as="h3" variant="heading.sm">
            A place for the details
          </Heading>
          <Text>
            Borders define the edge. Corners give it character. Shadows explain
            depth.
          </Text>
          <Field.Root>
            <Field.Label>Project name</Field.Label>
            <TextField defaultValue="Dixy Studio" />
          </Field.Root>
          <Inline gap="md">
            <Button onClick={() => setMessage("Project saved.")}>
              Save project
            </Button>
            <Dialog.Root>
              <Dialog.Trigger render={<Button variant="outline" />}>
                Inspect overlay
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Backdrop />
                <Dialog.Viewport>
                  <Dialog.Popup>
                    <Dialog.Title>A distinct layer</Dialog.Title>
                    <Dialog.Description>
                      The dialog inherits this radius setting and appearance.
                      Its corners and shadow use the overlay roles.
                    </Dialog.Description>
                    <Dialog.Close render={<Button />}>
                      Back to the surface
                    </Dialog.Close>
                  </Dialog.Popup>
                </Dialog.Viewport>
              </Dialog.Portal>
            </Dialog.Root>
          </Inline>
          <Text role="status" variant="body.sm">
            {message}
          </Text>
        </Stack>
      </section>
    </SurfaceScope>
  );
}
