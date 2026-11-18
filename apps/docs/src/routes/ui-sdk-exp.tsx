import { createFileRoute } from "@tanstack/react-router";
import { Switch, Text, Theme, Tooltip } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";
import { useAppAppearance } from "../components/app-appearance-provider";
import { Experiments } from "../ui-sdk-exp/experiments";
import "../styles/ui-sdk-exp.css";

export const Route = createFileRoute("/ui-sdk-exp")({
  head: () => ({
    meta: [
      { title: "UI SDK experiments — Dixy UI" },
      {
        name: "description",
        content:
          "Expressive interface experiments: Dixy components and tokens with UI SDK behaviors, each in its own palette and type.",
      },
    ],
  }),
  component: UiSdkExp,
});

function UiSdkExp() {
  const { appearance, setAppearance } = useAppAppearance();
  return (
    <Theme appearance={appearance} className="exp-page">
      <Tooltip.Provider delay={400}>
        <header className="exp-header">
          <div>
            <h1 className="exp-title">Interface experiments</h1>
            <Text tone="muted" className="exp-lede">
              Small interfaces where type and a single idea carry the design.
              Dixy supplies the parts and tokens. UI SDK supplies behaviors Dixy
              doesn't have yet. Every tile is keyboard-operable.
            </Text>
          </div>
          <label className="exp-mode">
            <Text as="span" size="sm">
              Dark page
            </Text>
            <Switch.Root
              checked={appearance === "dark"}
              onCheckedChange={(on) => setAppearance(on ? "dark" : "light")}
            >
              <Switch.Thumb />
            </Switch.Root>
          </label>
        </header>
        <main>
          <Experiments />
        </main>
      </Tooltip.Provider>
    </Theme>
  );
}
