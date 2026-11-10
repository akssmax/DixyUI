import assert from "node:assert/strict";
import fs from "node:fs";
import { test } from "node:test";
import { parseChangelog } from "../src/lib/changelog.ts";

const read = (pkg) =>
  fs.readFileSync(
    new URL(`../../../packages/${pkg}/CHANGELOG.md`, import.meta.url),
    "utf8",
  );

test("parses Changesets releases newest first, with commits and kinds", () => {
  const releases = parseChangelog(`# @dixy-ui/react

## 0.1.0-beta.2

### Patch Changes

- abc1234: Fix a thing.

  - Nested detail.

- Updated dependencies [abc1234]
  - @dixy-ui/tokens@0.1.0-beta.1

## 0.1.0-beta.1

### Minor Changes

- def5678: Add a thing.
`);
  assert.deepEqual(
    releases.map((r) => r.version),
    ["0.1.0-beta.2", "0.1.0-beta.1"],
  );
  const [entry] = releases[0].changes[0].entries;
  assert.equal(releases[0].changes[0].kind, "Patch");
  assert.equal(entry.commit, "abc1234");
  assert.equal(entry.body, "Fix a thing.\n\n- Nested detail.");
  assert.deepEqual(releases[0].dependencies, ["@dixy-ui/tokens@0.1.0-beta.1"]);
  assert.equal(releases[1].changes[0].kind, "Minor");
});

test("every published package changelog parses with no empty releases", () => {
  for (const pkg of ["react", "themes", "tokens"]) {
    const releases = parseChangelog(read(pkg));
    assert.ok(releases.length > 0, pkg);
    for (const release of releases) {
      assert.match(release.version, /^\d+\.\d+\.\d+/, pkg);
      assert.ok(
        release.changes.length > 0 || release.dependencies.length > 0,
        `${pkg} ${release.version} has nothing to show`,
      );
      for (const { entries } of release.changes)
        for (const entry of entries)
          assert.doesNotMatch(entry.body, /^Updated dependencies/, pkg);
    }
  }
});
