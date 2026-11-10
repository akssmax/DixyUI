import assert from "node:assert/strict";
import { test } from "node:test";
import { skinCatalog } from "@dixy-ui/themes/catalog";
import * as signal from "@dixy-ui/themes/signal";
import {
  agentPrompt,
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
