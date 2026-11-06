import assert from "node:assert/strict";
import { test } from "node:test";
import {
  roundedBorder,
  cssCornerRadius,
  boundedLeafLength,
} from "../src/organic-geometry.ts";
import {
  parseThemeDocument,
  compileThemeDocument,
  ThemeDocumentError,
} from "../src/authoring.ts";
import { themeDocuments } from "../src/documents.ts";
import {
  organicFrameRecipes,
  defaultOrganicOrnament,
} from "../src/organic-settings.ts";

test("one continuous perimeter follows resized, asymmetric elliptical CSS corners", () => {
  for (const [width, height] of [
    [90, 300],
    [800, 120],
    [320, 240],
    [40, 40],
  ]) {
    const radii = [
      { x: 70, y: 40 },
      { x: 14, y: 90 },
      { x: 35, y: 17 },
      { x: 9, y: 32 },
    ];
    const path = roundedBorder(width, height, radii);
    assert.ok(path.total > 0);
    assert.equal(path.corners.length, 4);
    const first = path.at(0),
      end = path.at(path.total);
    assert.ok(Math.hypot(first.x - end.x, first.y - end.y) < 1e-7);
    let previous = path.at(0);
    for (let distance = 0.5; distance < path.total; distance += 0.5) {
      const point = path.at(distance);
      assert.ok(point.x >= -1e-6 && point.x <= width + 1e-6);
      assert.ok(point.y >= -1e-6 && point.y <= height + 1e-6);
      assert.ok(
        Math.hypot(point.x - previous.x, point.y - previous.y) <= 0.50001,
        "No gaps or jumps at corner joins",
      );
      previous = point;
    }
    const last = path.at(path.total - 0.001);
    assert.ok(Math.hypot(last.x - first.x, last.y - first.y) < 0.002);
  }
  assert.deepEqual(cssCornerRadius("25% 10px", 200, 80), { x: 50, y: 10 });
});

test("leaf envelopes remain inside the overflow gutter at every rotation", () => {
  for (const [x, y] of [
    [0, 0],
    [140, 0],
    [140, 90],
    [0, 90],
    [40, 0],
    [-9, 30],
  ])
    for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
      const length = boundedLeafLength(x, y, angle, 64, 140, 90);
      assert.ok(length >= 0 && length <= 64);
      const dx =
        (Math.abs(Math.cos(angle)) + 0.45 * Math.abs(Math.sin(angle))) * length;
      const dy =
        (Math.abs(Math.sin(angle)) + 0.45 * Math.abs(Math.cos(angle))) * length;
      assert.ok(x - dx >= -28.0001 && x + dx <= 168.0001);
      assert.ok(y - dy >= -28.0001 && y + dy <= 118.0001);
    }
});

test("v2 saved documents migrate with per-frame defaults and keep geometry and paint", () => {
  for (const frame of Object.keys(organicFrameRecipes)) {
    const legacy = structuredClone(themeDocuments[0]);
    legacy.schemaVersion = 2;
    legacy.recipes.frame.id = frame;
    for (const key of ["backdropBlur", "backdropSaturate"]) delete legacy.recipes.material.parameters[key];
    delete legacy.recipes.frame.ornament;
    delete legacy.character;
    legacy.recipes.frame.parameters.paddingTop = 19;
    const migrated = parseThemeDocument(JSON.stringify(legacy));
    assert.equal(migrated.schemaVersion, 6);
    assert.equal(migrated.recipes.frame.parameters.paddingTop, 19);
    assert.deepEqual(
      migrated.recipes.frame.ornament,
      defaultOrganicOrnament(frame),
    );
    // Paint is kept; v6 adds neutral card glass (no blur, no saturation boost).
    assert.deepEqual(migrated.recipes.material, {
      ...legacy.recipes.material,
      parameters: {
        ...legacy.recipes.material.parameters,
        backdropBlur: 0,
        backdropSaturate: 100,
      },
    });
    assert.deepEqual(parseThemeDocument(JSON.stringify(migrated)), migrated);
    assert.ok(Object.isFrozen(migrated.recipes.frame.ornament));
  }
});

test("all ornament controls survive compilation and reject out-of-range or executable inputs", () => {
  const document = structuredClone(themeDocuments[0]);
  Object.assign(document.recipes.frame.ornament, {
    density: 92,
    cornerDensity: 67,
    canopyDepth: 44,
    variation: 88,
    scale: 29,
    stemWeight: 62,
    motion: 71,
    seed: 204,
    style: "Fern grove",
    canopy: "Corner cascades",
    stem: "Woody branches",
  });
  const compiled = compileThemeDocument(document);
  assert.equal(compiled.themeProps.style["--dixy-organic-density"], "92");
  assert.equal(compiled.themeProps.style["--dixy-organic-style"], "2");
  assert.match(compiled.css, /--dixy-organic-seed:204/);
  assert.match(
    compiled.css,
    /dixy-organic-ornament \{ clip-path:none; overflow:visible/,
  );
  assert.deepEqual(
    compiled.document.recipes.frame.ornament,
    document.recipes.frame.ornament,
  );
  for (const change of [
    { density: 101 },
    { seed: 2.5 },
    { scale: 9 },
    { style: "url(https://example.com/code.js)" },
    { canopy: "run code" },
    { css: "body{}" },
  ]) {
    const invalid = structuredClone(document);
    Object.assign(invalid.recipes.frame.ornament, change);
    assert.throws(() => parseThemeDocument(invalid), ThemeDocumentError);
  }
  const legacy = structuredClone(document);
  legacy.schemaVersion = 2;
  delete legacy.character;
  assert.throws(() => parseThemeDocument(legacy), /Not a version-2 field/);
});
