import assert from "node:assert/strict";
import test from "node:test";
import { font, typography, fontWeightPrimitives } from "../dist/index.js";

test("reading defaults remain readable while compact styles stay explicit", () => {
  assert.equal(typography["body.md"].size, 16);
  assert.equal(typography["body.md"].lineHeight, 24);
  assert.equal(typography["body.sm"].size, 14);
  assert.equal(Object.keys(typography).length, 21);
  for (const token of Object.values(typography)) {
    assert.ok(token.size >= 12);
    // Poster roles are fluid with solid leading; every other role has air.
    if (token.fluid) assert.equal(token.lineHeight, token.size);
    else assert.ok(token.lineHeight > token.size);
    assert.ok(fontWeightPrimitives[token.weight] >= 400);
  }
});

test("fluid poster roles shrink to a readable minimum and stop at their size", () => {
  const fluid = Object.entries(typography).filter(([, t]) => t.fluid);
  assert.deepEqual(
    fluid.map(([role]) => role),
    ["display.3xl", "display.2xl", "display.xl"],
  );
  for (const [, token] of fluid) {
    assert.ok(token.fluid.min >= 36, "minimum stays display-sized");
    assert.ok(token.fluid.min < token.size);
    assert.ok(token.fluid.min > typography["display.sm"].size - 1);
  }
});

test("the public helper maps semantic paths to the published CSS namespace", () => {
  assert.equal(font("body.md"), "var(--dixy-font-body-md)");
  assert.equal(font("caption"), "var(--dixy-font-caption)");
});
