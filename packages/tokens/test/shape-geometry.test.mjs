import assert from "node:assert/strict";
import { test } from "node:test";
import {
  expressiveShapes,
  shapeOutline,
  shapePolygon,
  shapeSamples,
  shapeSvgPath,
} from "../dist/index.js";

test("every expressive shape is a fitted, clockwise outline of the same length", () => {
  assert.equal(expressiveShapes.length, 35);
  for (const name of expressiveShapes) {
    const points = shapeOutline(name);
    assert.equal(points.length, shapeSamples, name);
    const xs = points.map((p) => p[0]);
    const ys = points.map((p) => p[1]);
    for (const v of [...xs, ...ys]) assert.ok(v >= 0 && v <= 100, name);
    // Fitted: the longer side spans the whole box.
    const span = Math.max(
      Math.max(...xs) - Math.min(...xs),
      Math.max(...ys) - Math.min(...ys),
    );
    assert.ok(span > 99, `${name} span ${span}`);
    // Clockwise on screen (y down): positive shoelace area.
    let area = 0;
    points.forEach(([x, y], i) => {
      const [nx, ny] = points[(i + 1) % points.length];
      area += x * ny - nx * y;
    });
    assert.ok(area > 0, `${name} winds clockwise`);
    // Starts at the top, near the vertical centre line, so morphs line up.
    const [sx, sy] = points[0];
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
    assert.ok(Math.abs(sx - cx) < 8 && sy < 50, `${name} starts at top centre`);
  }
});

test("points are spaced evenly along the outline, so morphs don't bunch", () => {
  for (const name of expressiveShapes) {
    const points = shapeOutline(name);
    const gaps = points.map(([x, y], i) => {
      const [nx, ny] = points[(i + 1) % points.length];
      return Math.hypot(nx - x, ny - y);
    });
    const mean = gaps.reduce((a, b) => a + b) / gaps.length;
    // Chords across tight corners are shorter than the arc they cut; allow that.
    assert.ok(Math.max(...gaps) < mean * 1.6, `${name} max gap`);
  }
});

test("CSS polygon and SVG path carry the same point count for every shape", () => {
  for (const name of expressiveShapes) {
    assert.equal(shapePolygon(name).split(",").length, shapeSamples);
    assert.equal(
      (shapeSvgPath(name).match(/[ML]/g) ?? []).length,
      shapeSamples,
    );
  }
});
