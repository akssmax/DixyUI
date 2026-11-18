import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Theme, Tooltip } from "@dixy-ui/react";
import type { Material } from "@dixy-ui/tokens";
import "@dixy-ui/react/materials.css";
import { useAppAppearance } from "../components/app-appearance-provider";
import { PlayerBench } from "../uisdk-test/player";
import { skins } from "../uisdk-test/skins";
import "../styles/uisdk-test.css";

export const Route = createFileRoute("/uisdk-test")({
  head: () => ({
    meta: [
      { title: "UI SDK × Dixy test bench" },
      {
        name: "description",
        content:
          "A classic desktop media player built from Dixy UI, with UI SDK behaviors and live WAI-ARIA conformance checks.",
      },
    ],
  }),
  component: UiSdkTest,
});

function UiSdkTest() {
  const { appearance, setAppearance } = useAppAppearance();
  const [skin, setSkin] = useState("modern");
  const [material, setMaterial] = useState<Material>("glossy");
  const accent = skins.find((s) => s.id === skin)?.accent ?? "blue";
  return (
    <Theme
      appearance={appearance}
      accentColor={accent}
      material={material}
      className="uisdk-app"
      data-skin={skin}
    >
      <Tooltip.Provider delay={500}>
        <PlayerBench
          appearance={appearance}
          onAppearance={setAppearance}
          skin={skin}
          onSkin={setSkin}
          material={material}
          onMaterial={setMaterial}
        />
      </Tooltip.Provider>
    </Theme>
  );
}
