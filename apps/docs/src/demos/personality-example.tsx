import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  Heading,
  Inline,
  Stack,
  Text,
  Theme as PersonalityScope,
  useMotionPreferences,
} from "@dixy-ui/react";
import { personalityPresets, type Personality } from "@dixy-ui/tokens";
import "@dixy-ui/react/materials.css";

interface PersonalityExampleProps {
  personality?: Personality;
  reduceMotion?: boolean;
  reduceEffects?: boolean;
  rtl?: boolean;
}
export default function PersonalityExample({
  personality = "tactile",
  reduceMotion = false,
  reduceEffects = false,
  rtl = false,
}: PersonalityExampleProps) {
  return (
    <PersonalityScope
      personality={personality}
      effects={reduceEffects ? "reduced" : "static"}
      motion={reduceMotion ? "reduced" : "system"}
      dir={rtl ? "rtl" : "ltr"}
    >
      <PersonalityContents personality={personality} />
    </PersonalityScope>
  );
}
function PersonalityContents({ personality }: { personality: Personality }) {
  const [saved, setSaved] = useState(false);
  const { scheme, reducedMotion } = useMotionPreferences();
  return (
    <Box
      as="section"
      aria-label="Personality specimen"
      style={{ padding: "var(--dixy-card-padding)" }}
    >
      <Stack gap="md">
        <Heading as="h3" variant="heading.sm">
          Your next small idea.
        </Heading>
        <Text variant="body.sm">
          {personalityPresets[personality].guidance}
        </Text>
        <Inline>
          <Button onClick={() => setSaved(true)}>Save idea</Button>
          <Dialog.Root>
            <Dialog.Trigger render={<Button variant="outline" />}>
              Open details
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Backdrop />
              <Dialog.Viewport>
                <Dialog.Popup>
                  <Dialog.Title>A consistent personality</Dialog.Title>
                  <Dialog.Description>
                    Geometry, finish, response and reduction settings follow the
                    theme into this dialog.
                  </Dialog.Description>
                  <Dialog.Close render={<Button />}>Close details</Dialog.Close>
                </Dialog.Popup>
              </Dialog.Viewport>
            </Dialog.Portal>
          </Dialog.Root>
        </Inline>
        <Text role="status" variant="body.sm">
          {saved ? "Idea saved." : "Your idea is ready to save."}
        </Text>
        <Text variant="caption">
          Spring scheme: {scheme}. Motion:{" "}
          {reducedMotion ? "reduced" : "system"}.
        </Text>
      </Stack>
    </Box>
  );
}
