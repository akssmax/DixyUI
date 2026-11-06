import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  radiusPrimitives,
  radiusPresets,
  borderWidths,
  borderRoles,
  focusRing,
  shadowLayers,
  shadowValue,
  radius,
  surfaceRadius,
  border,
  borderWidth,
  shadow,
} from "../src/surfaces.ts";
import { semanticColors } from "../src/color.ts";

const read = (name) =>
  readFileSync(new URL(`../src/${name}.css`, import.meta.url), "utf8");

test("radius presets resolve to valid fixed primitives, square every role and constrain full panels", () => {
  assert.deepEqual(radiusPrimitives, {
    0: 0,
    2: 2,
    4: 4,
    6: 6,
    8: 8,
    10: 10,
    12: 12,
    16: 16,
    24: 24,
    full: 9999,
  });
  assert.deepEqual(radiusPresets.md, {
    control: "10",
    card: "12",
    overlay: "16",
  });
  assert.deepEqual(radiusPresets.none, {
    control: "0",
    card: "0",
    overlay: "0",
  });
  assert.deepEqual(radiusPresets.full, {
    control: "full",
    card: "16",
    overlay: "24",
  });
  for (const roles of Object.values(radiusPresets))
    for (const token of Object.values(roles))
      assert.ok(Object.hasOwn(radiusPrimitives, token));
  const css = read("radius");
  assert.ok(css.indexOf(":root") < css.indexOf('[data-radius="none"]'));
  assert.doesNotMatch(css, /data-dixy-density/);
});

test("border roles use valid widths and existing semantic colors while focus stays distinct", () => {
  assert.deepEqual(borderWidths, { 0: 0, 1: 1, 2: 2 });
  for (const role of Object.values(borderRoles)) {
    assert.ok(Object.hasOwn(borderWidths, role.width));
    assert.ok(Object.hasOwn(semanticColors, role.color));
  }
  assert.ok(read("border").includes("[data-neutral]"));
  // Decorative/control contrast roles share a configurable stroke, while strong and focus retain 2px.
  assert.match(
    read("border"),
    /--dixy-stroke-width: var\(--dixy-border-width-1\)/,
  );
  assert.match(
    read("border"),
    /--dixy-border-default: var\(--dixy-stroke-width\)/,
  );
  assert.match(
    read("border"),
    /--dixy-border-strong: var\(--dixy-border-width-2\)/,
  );
  assert.equal(focusRing.width, "2");
  assert.equal(focusRing.offset, 3);
  assert.ok(
    read("border").includes(
      "--dixy-focus-ring-width: var(--dixy-border-width-2)",
    ),
  );
});

test("shadow appearances preserve geometry and increase occlusion without negative blur", () => {
  assert.equal(shadowValue("none", "light"), "none");
  assert.equal(shadowValue("none", "dark"), "none");
  for (const [role, layers] of Object.entries(shadowLayers)) {
    for (const layer of layers) {
      assert.ok(layer.blur >= 0);
      assert.ok(layer.opacity.dark >= layer.opacity.light);
      assert.ok(layer.opacity.light >= 0 && layer.opacity.dark <= 1);
    }
    if (layers.length)
      assert.notEqual(shadowValue(role, "light"), shadowValue(role, "dark"));
  }
  assert.equal(shadowLayers.raised.length, 2);
  assert.equal(shadowLayers.overlay.length, 2);
  const css = read("shadow");
  const forced = css.slice(css.indexOf("@media (forced-colors: active)"));
  for (const role of Object.keys(shadowLayers))
    assert.ok(forced.includes(`--dixy-shadow-${role}: none;`));
});

test("helpers preserve CSS scope inheritance rather than flattening semantic roles", () => {
  assert.equal(radius("12"), "var(--dixy-radius-12)");
  assert.equal(surfaceRadius("overlay"), "var(--dixy-radius-overlay)");
  assert.equal(borderWidth("1"), "var(--dixy-border-width-1)");
  assert.equal(border("strong"), "var(--dixy-border-strong)");
  assert.equal(shadow("floating"), "var(--dixy-shadow-floating)");
});

test("generated declarations are unique within each rule and remain synchronized", () => {
  for (const name of ["radius", "border", "shadow"]) {
    for (const block of read(name).matchAll(/([^{}]+)\{([^{}]+)\}/g)) {
      const names = [...block[2].matchAll(/(--dixy-[\w-]+):/g)].map(
        (match) => match[1],
      );
      assert.equal(new Set(names).size, names.length, block[1]);
    }
  }
  const components = readFileSync(
    new URL("../../react/src/tokens/component-surfaces.css", import.meta.url),
    "utf8",
  );
  const radiusScope = [...components.matchAll(/([^{}]+)\{([^{}]+)\}/g)].find(
    ([, selector]) => selector.includes("[data-radius]"),
  );
  assert.ok(radiusScope);
  // A component radius attribute must not reset a parent's custom depth or border width.
  assert.doesNotMatch(
    radiusScope[2],
    /--dixy-(?:card-shadow|\w+-border-width):/,
  );
  execFileSync(process.execPath, ["scripts/generate-surfaces.mjs", "--check"], {
    cwd: new URL("../../../", import.meta.url),
    stdio: "pipe",
  });
});
