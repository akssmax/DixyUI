import assert from "node:assert/strict";
import { test } from "node:test";
import {
  defaultPreviewTheme,
  parsePreviewTheme,
  serializePreviewTheme,
  updatePreviewTheme,
} from "../src/lib/preview-theme.ts";

test("saved preview themes round-trip every shared setting and explicit appearance", () => {
  const settings = {
    ...defaultPreviewTheme,
    appearance: "light",
    accentColor: "cyan",
    neutralColor: "stone",
    radius: "full",
    density: "comfortable",
    motion: "reduced",
    dir: "rtl",
  };
  assert.deepEqual(
    parsePreviewTheme(serializePreviewTheme(settings)),
    settings,
  );
  assert.equal(
    parsePreviewTheme(serializePreviewTheme(defaultPreviewTheme)).appearance,
    null,
  );
});

test("invalid cookies fail safely and only known theme fields survive", () => {
  for (const input of [
    undefined,
    "invalid",
    "null",
    "[]",
    "{}",
    "x".repeat(2049),
    '{"version":2}',
  ])
    assert.deepEqual(parsePreviewTheme(input), defaultPreviewTheme);
  const restored = parsePreviewTheme(
    JSON.stringify({
      version: 1,
      ...defaultPreviewTheme,
      accentColor: "mint",
      neutralColor: "unknown",
      radius: "huge",
      motion: "full",
      dir: "sideways",
      appearance: "system",
      style: { color: "arbitrary" },
    }),
  );
  assert.equal(restored.accentColor, "mint");
  assert.equal(restored.neutralColor, "neutral");
  assert.equal(restored.radius, "md");
  assert.equal(restored.motion, "system");
  assert.equal(restored.dir, "ltr");
  assert.equal(restored.appearance, null);
  assert.equal(Object.hasOwn(restored, "style"), false);
});

test("named color personalities remain coherent when individual axes change", () => {
  const nostalgic = updatePreviewTheme(defaultPreviewTheme, {
    personality: "nostalgic",
    accentColor: "purple",
    neutralColor: "sand",
  });
  assert.equal(nostalgic.personality, "nostalgic");
  assert.equal(
    updatePreviewTheme(nostalgic, { radius: "lg" }).personality,
    "nostalgic",
  );
  const custom = updatePreviewTheme(nostalgic, { accentColor: "amber" });
  assert.equal(custom.personality, "custom");
  assert.equal(custom.neutralColor, "sand");
  assert.equal(
    parsePreviewTheme(
      serializePreviewTheme({ ...nostalgic, neutralColor: "stone" }),
    ).personality,
    "custom",
  );
});
