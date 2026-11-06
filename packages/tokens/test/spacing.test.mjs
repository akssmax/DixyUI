import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { test } from "node:test";
import {
  spacingPrimitives,
  semanticSpacing,
  spacingDensity,
  space,
  spacing,
} from "../src/spacing.ts";

const css = readFileSync(
  new URL("../src/spacing.css", import.meta.url),
  "utf8",
);
test("the published 8px scale and every generated rem value match the specification", () => {
  const expected = {
    0: 0,
    "025": 2,
    "050": 4,
    "075": 6,
    100: 8,
    150: 12,
    200: 16,
    250: 20,
    300: 24,
    400: 32,
    500: 40,
    600: 48,
    800: 64,
    1000: 80,
    1200: 96,
    2000: 160,
  };
  assert.deepEqual(spacingPrimitives, expected);
  for (const [id, px] of Object.entries(expected)) {
    assert.ok(
      css.includes(`--dixy-space-${id}: ${px === 0 ? "0" : `${px / 16}rem`};`),
    );
  }
  assert.equal([...css.matchAll(/--dixy-space-\d+:/g)].length, 16);
});
test("all densities resolve to real primitives and keep inline/section mappings fixed", () => {
  for (const [density, families] of Object.entries(spacingDensity)) {
    assert.deepEqual(families.inline, semanticSpacing.inline);
    assert.deepEqual(families.section, semanticSpacing.section);
    for (const sizes of Object.values(families)) {
      for (const id of Object.values(sizes))
        assert.ok(Object.hasOwn(spacingPrimitives, id), `${density}: ${id}`);
    }
  }
  assert.equal(spacingDensity.compact.stack.md, "150");
  assert.equal(spacingDensity.comfortable.inset.md, "250");
});
test("generated selectors contain no duplicate declarations or negative spacing", () => {
  for (const block of css.matchAll(/([^{}]+)\{([^{}]+)\}/g)) {
    const names = [...block[2].matchAll(/(--dixy-[\w-]+):/g)].map(
      (match) => match[1],
    );
    assert.equal(new Set(names).size, names.length, block[1]);
  }
  assert.doesNotMatch(css, /!important|--dixy-space-\d+:\s*-/);
});
test("typed helpers preserve CSS inheritance instead of flattening to pixels", () => {
  assert.equal(space("200"), "var(--dixy-space-200)");
  assert.equal(spacing("stack", "md"), "var(--dixy-spacing-stack-md)");
});

test("density on the document root overrides the :root defaults", () => {
  const defaults = css.indexOf('[data-dixy-density="default"]');
  assert.ok(defaults < css.indexOf('[data-dixy-density="compact"]'));
  assert.ok(defaults < css.indexOf('[data-dixy-density="comfortable"]'));
});
test("committed generated CSS is fresh", () => {
  execFileSync(process.execPath, ["scripts/generate-spacing.mjs", "--check"], {
    cwd: new URL("../../../", import.meta.url),
    stdio: "pipe",
  });
});
