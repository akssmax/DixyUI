import { createRoot } from "react-dom/client";
import { createRef } from "react";
import { Box, Button, IconButton, Shape, Theme } from "@dixy-ui/react";
import {
  FeedbackProvider,
  useFeedback,
  vibrationAdapter,
} from "@dixy-ui/react/feedback";
import {
  materialImage,
  shapeRadius,
  personalityPresets,
  type FeedbackEvent,
} from "@dixy-ui/tokens";
import "@dixy-ui/react/styles.css";
import "@dixy-ui/react/materials.css";
const ref = createRef<HTMLElement>();
function Action() {
  const feedback = useFeedback();
  return (
    <Button material="metal" shape="pill" onClick={() => feedback("success")}>
      Save
    </Button>
  );
}
function App() {
  return (
    <Theme personality="tactile" effects="static">
      <FeedbackProvider adapter={vibrationAdapter}>
        <Box as="section" ref={ref} material="paper" shape="rounded">
          <Shape kind="clover" label="Award" />
          <Action />
          <IconButton aria-label="Favorite" material="glossy">
            ★
          </IconButton>
        </Box>
      </FeedbackProvider>
    </Theme>
  );
}
void materialImage("paper");
void shapeRadius("container");
void personalityPresets.playful;
const event: FeedbackEvent = "toggle";
void event;
// @ts-expect-error Material recipes are finite.
const invalidMaterial = <Button material="webgl" />;
// @ts-expect-error Shape artwork is separate from supported control geometry.
const invalidShape = <Button shape="flower" />;
// @ts-expect-error Personality presets are finite.
const invalidPersonality = <Theme personality="angry" />;
void invalidMaterial;
void invalidShape;
void invalidPersonality;
createRoot(document.getElementById("root")!).render(<App />);
