import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { test } from "node:test";
import { sizing, size } from "../src/sizing.ts";
import {
  breakpoints,
  containerWidths,
  responsiveGutters,
  minWidth,
  container,
  layoutGutter,
} from "../src/layout.ts";
import { spacingPrimitives } from "../src/spacing.ts";

const css = readFileSync(new URL("../src/sizing.css", import.meta.url), "utf8");
const layout = readFileSync(
  new URL("../src/layout.css", import.meta.url),
  "utf8",
);

test("control contracts preserve existing sizes and targets have CSS-pixel floors", () => {
  assert.deepEqual(sizing.control, { sm: 32, md: 40, lg: 48 });
  assert.equal(sizing.target.minimum, 24);
  assert.equal(sizing.target.comfortable, 44);
  for (const [family, tokens] of Object.entries(sizing)) {
    for (const [token, px] of Object.entries(tokens)) {
      const value =
        family === "target" ? `max(${px}px, ${px / 16}rem)` : `${px / 16}rem`;
      assert.ok(css.includes(`--dixy-size-${family}-${token}: ${value};`));
    }
  }
  assert.doesNotMatch(css, /data-dixy-density/);
});

test("breakpoints are ascending and CSS conditions use the same rem thresholds as JS", () => {
  const thresholds = Object.values(breakpoints);
  assert.deepEqual(
    thresholds,
    [...thresholds].sort((a, b) => a - b),
  );
  assert.equal(new Set(thresholds).size, thresholds.length);
  assert.deepEqual(breakpoints, {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    wide: 1536,
  });
  for (const name of Object.keys(responsiveGutters).filter(
    (name) => name !== "base",
  )) {
    assert.ok(layout.includes(`@media ${minWidth(name)}`));
  }
  assert.doesNotMatch(layout, /@media[^{}]*var\(/);
});

test("gutters reference real immutable spacing and never exceed the smallest container", () => {
  assert.deepEqual(responsiveGutters, { base: "200", sm: "300", lg: "400" });
  for (const token of Object.values(responsiveGutters)) {
    assert.ok(Object.hasOwn(spacingPrimitives, token));
    for (const width of Object.values(containerWidths))
      assert.ok(width > spacingPrimitives[token] * 2);
  }
  assert.equal(containerWidths.xl, 1280);
});

test("helpers provide framework-independent CSS references and media conditions", () => {
  assert.equal(size("control", "md"), "var(--dixy-size-control-md)");
  assert.equal(
    size("target", "comfortable"),
    "var(--dixy-size-target-comfortable)",
  );
  assert.equal(container("lg"), "var(--dixy-container-lg)");
  assert.equal(minWidth("lg"), "(min-width: 64rem)");
  assert.equal(layoutGutter, "var(--dixy-layout-gutter)");
});

test("generated sizing and layout outputs are synchronized", () => {
  execFileSync(
    process.execPath,
    ["scripts/generate-sizing-layout.mjs", "--check"],
    { cwd: new URL("../../../", import.meta.url), stdio: "pipe" },
  );
});
