import { useState } from "react";
import {
  Button,
  Inline,
  Stack,
  Text,
  Theme as FeedbackScope,
} from "@dixy-ui/react";
import {
  FeedbackProvider,
  useFeedback,
  vibrationAdapter,
} from "@dixy-ui/react/feedback";
import { feedbackEvents, type FeedbackEvent } from "@dixy-ui/tokens";

interface FeedbackExampleProps {
  enabled?: boolean;
  reduceMotion?: boolean;
  reduceEffects?: boolean;
}
export default function FeedbackExample({
  enabled = false,
  reduceMotion = false,
  reduceEffects = false,
}: FeedbackExampleProps) {
  return (
    <FeedbackScope
      motion={reduceMotion ? "reduced" : "system"}
      effects={reduceEffects ? "reduced" : "static"}
    >
      <FeedbackProvider enabled={enabled} adapter={vibrationAdapter}>
        <FeedbackActions />
      </FeedbackProvider>
    </FeedbackScope>
  );
}
function FeedbackActions() {
  const feedback = useFeedback();
  const [message, setMessage] = useState(
    "Feedback is optional. Every action has a visible result.",
  );
  function act(event: FeedbackEvent) {
    setMessage(`${feedbackEvents[event].description}.`);
    feedback(event);
  }
  return (
    <Stack gap="md">
      <Inline gap="sm">
        {(Object.keys(feedbackEvents) as FeedbackEvent[]).map((event) => (
          <Button key={event} variant="soft" onClick={() => act(event)}>
            {event}
          </Button>
        ))}
      </Inline>
      <Text role="status" variant="body.sm">
        {message}
      </Text>
      <Text variant="caption">
        Vibration depends on browser, device and permissions. No delivery is
        guaranteed.
      </Text>
    </Stack>
  );
}
