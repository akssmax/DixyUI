import { createRoot } from "react-dom/client";
import { Theme, Card, Button, TextField } from "@dixy-ui/react";
import { ForestOrnament } from "@dixy-ui/themes/living-forest/react";
import { livingForest, livingForestTheme } from "@dixy-ui/themes/living-forest";
import { defineSkin } from "@dixy-ui/themes/authoring";
import "@dixy-ui/react/styles.css";
import "@dixy-ui/themes/living-forest.css";
const ownSkin = defineSkin({
  ...livingForest,
  id: "example/notebook",
  name: "Notebook",
});
void ownSkin;
createRoot(document.getElementById("root")!).render(
  <Theme
    {...livingForestTheme}
    ornamentRenderer={ForestOrnament}
    animateOrnaments
    ornament="expressive"
    relief={1}
  >
    <Card.Root>
      <Card.Title>Growing ideas</Card.Title>
      <TextField aria-label="Project" />
      <Button>Save</Button>
      <Theme skin={null}>
        <Button>Original Dixy</Button>
      </Theme>
    </Card.Root>
  </Theme>,
);
