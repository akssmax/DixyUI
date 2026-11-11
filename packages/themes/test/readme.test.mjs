import assert from "node:assert/strict";
import fs from "node:fs";
import { test } from "node:test";
import { skinCatalog } from "../src/catalog.ts";

// READMEs ship to npm, so a hard-coded theme count goes stale silently.
test("README theme counts match the catalog", () => {
  for (const file of ["../README.md", "../../../README.md"]) {
    const text = fs.readFileSync(new URL(file, import.meta.url), "utf8");
    const counts = [
      ...text.matchAll(/\b(\d+) (?:optional )?starter(?: themes|s)\b/g),
    ].map((match) => Number(match[1]));
    assert.ok(counts.length > 0, file + " mentions no count");
    for (const count of counts) assert.equal(count, skinCatalog.length, file);
    assert.doesNotMatch(text, /workers\.dev/, file + " links the old domain");
  }
});
