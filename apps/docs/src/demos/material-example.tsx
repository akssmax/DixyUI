import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  Heading,
  IconButton,
  Inline,
  Stack,
  Text,
  Theme as MaterialScope,
} from "@dixy-ui/react";
import type { Material, ShapePreset, EffectsPreference } from "@dixy-ui/tokens";
import "@dixy-ui/react/materials.css";

interface MaterialExampleProps {
  finish?: Material;
  shape?: ShapePreset;
  emphasis?: "solid" | "soft" | "outline" | "ghost";
  tone?: "accent" | "neutral" | "danger" | "success";
  effects?: EffectsPreference;
  disabled?: boolean;
  loading?: boolean;
  reduceMotion?: boolean;
  rtl?: boolean;
}
export default function MaterialExample({
  finish = "glossy",
  shape,
  emphasis = "solid",
  tone = "accent",
  effects = "static",
  disabled = false,
  loading = false,
  reduceMotion = false,
  rtl = false,
}: MaterialExampleProps) {
  const [count, setCount] = useState(0);
  return (
    <MaterialScope
      material={finish}
      shape={shape}
      effects={effects}
      motion={reduceMotion ? "reduced" : "system"}
      dir={rtl ? "rtl" : "ltr"}
    >
      <Box
        as="section"
        aria-label="Material specimen"
        style={{ padding: "var(--dixy-card-padding)" }}
      >
        <Stack gap="md">
          <Heading as="h3" variant="heading.sm">
            Made to be used.
          </Heading>
          <Text variant="body.sm">
            A finish adds character. The action keeps its meaning.
          </Text>
          <Inline gap="sm">
            <Button
              variant={emphasis}
              color={tone}
              disabled={disabled}
              loading={loading}
              onClick={() => setCount((value) => value + 1)}
            >
              Save project
            </Button>
            <IconButton
              aria-label="Favorite project"
              variant={emphasis}
              color={tone}
              disabled={disabled}
              loading={loading}
              onClick={() => setCount((value) => value + 1)}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
              >
                <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z" />
              </svg>
            </IconButton>
            <Dialog.Root>
              <Dialog.Trigger
                render={<Button material="matte" variant="outline" />}
              >
                Inspect portal
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Backdrop />
                <Dialog.Viewport>
                  <Dialog.Popup>
                    <Dialog.Title>
                      The same foundation, another layer
                    </Dialog.Title>
                    <Dialog.Description>
                      The theme carries finish, shape and effects policy into
                      this portal. Dialog content keeps an opaque surface.
                    </Dialog.Description>
                    <Dialog.Close render={<Button />}>
                      Return to project
                    </Dialog.Close>
                  </Dialog.Popup>
                </Dialog.Viewport>
              </Dialog.Portal>
            </Dialog.Root>
          </Inline>
          <Text role="status" variant="body.sm">
            {count === 0
              ? "Ready when you are."
              : `Project saved ${count} ${count === 1 ? "time" : "times"}.`}
          </Text>
        </Stack>
      </Box>
    </MaterialScope>
  );
}
