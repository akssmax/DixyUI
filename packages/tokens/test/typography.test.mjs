import assert from "node:assert/strict";
import test from "node:test";
import { font, typography, fontWeightPrimitives } from "../dist/index.js";

test("reading defaults remain readable while compact styles stay explicit", () => {
  assert.equal(typography["body.md"].size, 16);
  assert.equal(typography["body.md"].lineHeight, 24);
  assert.equal(typography["body.sm"].size, 14);
  assert.equal(Object.keys(typography).length, 18);
  for (const token of Object.values(typography)) {
    assert.ok(token.size >= 12);
    assert.ok(token.lineHeight > token.size);
    assert.ok(fontWeightPrimitives[token.weight] >= 400);
  }
});

test("the public helper maps semantic paths to the published CSS namespace", () => {
  assert.equal(font("body.md"), "var(--dixy-font-body-md)");
  assert.equal(font("caption"), "var(--dixy-font-caption)");
});
