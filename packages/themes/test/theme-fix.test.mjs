import assert from "node:assert/strict";
import { test } from "node:test";
import { applyThemeFix, diffThemeDocument } from "../src/theme-fix.ts";
import { starterDocuments, themeDocuments } from "../src/documents.ts";
import { themeFixes } from "../src/theme-fixes.ts";
import { parseThemeDocument } from "../src/theme-schema.ts";

test("a fix merges objects key by key and replaces other values", () => {
  const base = { a: { b: 1, c: [1, 2] }, d: "x" };
  const fixed = applyThemeFix(base, { a: { c: [3] } });
  assert.deepEqual(fixed, { a: { b: 1, c: [3] }, d: "x" });
  assert.deepEqual(base, { a: { b: 1, c: [1, 2] }, d: "x" });
  assert.equal(applyThemeFix(base, undefined), base);
});

test("diff is the smallest patch and round-trips through apply", () => {
  const [starter] = starterDocuments;
  assert.equal(diffThemeDocument(starter, starter), undefined);
  const next = parseThemeDocument({
    ...starter,
    foundations: { ...starter.foundations, radius: "none" },
  });
  const patch = diffThemeDocument(starter, next);
  assert.deepEqual(patch, { foundations: { radius: "none" } });
  assert.deepEqual(applyThemeFix(starter, patch), next);
});

test("installed themes are starters with their saved fixes", () => {
  assert.equal(themeDocuments.length, starterDocuments.length);
  for (const [index, starter] of starterDocuments.entries()) {
    const expected = parseThemeDocument(
      applyThemeFix(starter, themeFixes[starter.id]),
    );
    assert.deepEqual(themeDocuments[index], expected);
  }
  for (const id of Object.keys(themeFixes))
    assert.ok(
      starterDocuments.some((d) => d.id === id),
      `Fix for unknown theme ${id}`,
    );
});
