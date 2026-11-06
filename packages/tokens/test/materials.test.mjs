import assert from "node:assert/strict";
import { test } from "node:test";
import fs from "node:fs";
import { gzipSync } from "node:zlib";
import {
  neutralColorFamilies,
  semanticColors,
  resolveColor,
  oklchToLinearSrgb,
} from "../dist/index.js";
import {
  materialRecipes,
  materialBudgets,
  personalityPresets,
  shapePresets,
  shapePaths,
  feedbackEvents,
  radiusPrimitives,
} from "../dist/index.js";

test("personality references remain within shared geometry, materials and feedback contracts", () => {
  for (const preset of Object.values(personalityPresets)) {
    assert.ok(preset.material in materialRecipes);
    assert.ok(preset.shape in shapePresets);
    assert.ok(preset.pressDistance >= 0 && preset.pressDistance <= 2);
  }
  for (const preset of Object.values(shapePresets)) {
    for (const value of Object.values(preset))
      assert.ok(value in radiusPrimitives);
    assert.notEqual(preset.container, "full");
  }
  for (const path of Object.values(shapePaths))
    assert.ok(path.startsWith("M") && path.endsWith("Z"));
  for (const event of Object.values(feedbackEvents))
    assert.ok(event.vibration.reduce((sum, ms) => sum + ms, 0) <= 100);
});

test("optional static CSS stays in budget and excludes active rendering work", () => {
  const css = fs.readFileSync(
    new URL("../../react/src/styles/materials.css", import.meta.url),
    "utf8",
  );
  assert.ok(gzipSync(css).length <= materialBudgets.cssGzipBytes);
  assert.doesNotMatch(
    css,
    /backdrop-filter|feTurbulence|url\(|animation:|will-change|filter:/,
  );
  const core = fs.readFileSync(
    new URL("../../react/src/styles/index.css", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(core, /materials\.css|backdrop-pilot/);
  // Preference rules must beat the solid/soft control selector specificity.
  assert.match(css, /background-image: none !important/);
});

test("primary text on material surfaces retains contrast at the recipe shade extremes", () => {
  const encode = (value) =>
    value <= 0.0031308 ? 12.92 * value : 1.055 * value ** (1 / 2.4) - 0.055;
  const decode = (value) =>
    value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  const luminance = (rgb) =>
    0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  for (const mode of ["light", "dark"])
    for (const neutral of neutralColorFamilies) {
      const get = (role) =>
        resolveColor(semanticColors[role][mode], mode, "blue", neutral);
      const foreground = luminance(oklchToLinearSrgb(get("text.primary")));
      const surface = oklchToLinearSrgb(get("background.surface.raised"));
      for (const [shade, alpha] of [
        [0, 0.07],
        [1, 0.2],
      ]) {
        const background = luminance(
          surface.map((value) =>
            decode(encode(value) * (1 - alpha) + shade * alpha),
          ),
        );
        const ratio =
          (Math.max(foreground, background) + 0.05) /
          (Math.min(foreground, background) + 0.05);
        assert.ok(ratio >= 4.5, `${mode}/${neutral}/${shade}: ${ratio}`);
      }
    }
});
