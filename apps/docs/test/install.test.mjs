import assert from "node:assert/strict";
import { test } from "node:test";
import { skinCatalog } from "@dixy-ui/themes/catalog";
import * as signal from "@dixy-ui/themes/signal";
import {
  agentPrompt,
  fontPackages,
  installCommand,
  packageManagers,
} from "../src/lib/install.ts";

test("each package manager gets its own install verb", () => {
  assert.deepEqual(
    packageManagers.map((manager) => installCommand(manager, ["a", "b"])),
    ["pnpm add a b", "npm install a b", "yarn add a b", "bun add a b"],
  );
});

test("the agent prompt names the chosen manager and a real theme export", () => {
  const meta = skinCatalog.find((skin) => skin.slug === "signal");
  const prompt = agentPrompt("bun", meta);
  assert.match(prompt, /bun add @dixy-ui\/react@beta @dixy-ui\/themes@beta/);
  assert.match(prompt, /@dixy-ui\/themes\/signal\.css/);
  // The prompt builds the settings name from the catalog symbol; it must exist.
  assert.match(
    prompt,
    /import \{ signalTheme \} from "@dixy-ui\/themes\/signal"/,
  );
  assert.ok(signal.signalTheme);
});

test("every catalog theme exposes the settings export the prompt names", async () => {
  for (const skin of skinCatalog) {
    const entry = await import(`@dixy-ui/themes/${skin.slug}`);
    assert.ok(
      entry[`${skin.symbol}Theme`],
      `${skin.slug} → ${skin.symbol}Theme`,
    );
  }
});

test("the agent prompt loads the theme's fonts and covers Tailwind v4", () => {
  const prompt = agentPrompt("npm", {
    slug: "retro-os",
    symbol: "retroOS",
    name: "Retro OS",
  });
  assert.match(
    prompt,
    /npm install @fontsource-variable\/inter @fontsource\/silkscreen/,
  );
  assert.match(prompt, /import "@fontsource\/silkscreen";/);
  assert.match(prompt, /@layer theme, base, dixy, components, utilities;/);
  // Steps stay numbered 1–5 when there is a font step.
  assert.match(prompt, /\n5\. Give the layout root/);
});

test("every starter with a web font names a package to load it", () => {
  for (const skin of skinCatalog) {
    const fonts = fontPackages(skin.slug);
    if (skin.bodyFont === "system" && skin.headingFont === "system")
      assert.deepEqual(fonts, [], skin.slug);
    else assert.ok(fonts.length > 0, skin.slug);
  }
  assert.deepEqual(fontPackages("signal"), [
    "@fontsource/atkinson-hyperlegible",
  ]);
});
