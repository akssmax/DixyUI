import assert from "node:assert/strict";
import { test } from "node:test";
import * as dixy from "@dixy-ui/react";
import { componentRegistry } from "../src/registry/components.ts";
import {
  filterThemePreviews,
  themePreviewEntries,
} from "../src/lib/theme-preview-catalogue.ts";

test("the theme gallery covers every public visual component and every registered family", () => {
  const slugs = themePreviewEntries.map((entry) => entry.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const slug of Object.keys(componentRegistry))
    assert.ok(slugs.includes(slug), `Missing registered example: ${slug}`);
  // Theme scopes the whole gallery. Providers and utilities have no separate visual surface.
  const covered = new Set([
    "Theme",
    ...themePreviewEntries.flatMap((entry) => entry.coveredExports),
  ]);
  const nonvisual = new Set([
    "CSPProvider",
    "DirectionProvider",
    "LocaleProvider",
    "CalendarDate",
    "CalendarDateTime",
    "ZonedDateTime",
    "Time",
  ]);
  const components = Object.keys(dixy).filter(
    (name) => /^[A-Z]/.test(name) && !nonvisual.has(name),
  );
  assert.deepEqual(
    components.filter((name) => !covered.has(name)),
    [],
    "A public visual component needs a theme preview.",
  );
  for (const entry of themePreviewEntries) {
    assert.equal(typeof entry.load, "function");
    for (const name of entry.coveredExports)
      assert.ok(name in dixy, `Unknown public export: ${name}`);
  }
});

test("search finds compound members and combines with the selected category", () => {
  assert.equal(
    filterThemePreviews("", "All components").length,
    themePreviewEntries.length,
  );
  assert.deepEqual(
    filterThemePreviews("Radio", "Inputs").map((entry) => entry.slug),
    ["radio-group"],
  );
  assert.deepEqual(
    filterThemePreviews(" Inline ", "Layout").map((entry) => entry.slug),
    ["layout"],
  );
  assert.deepEqual(
    filterThemePreviews("icon button", "Actions").map((entry) => entry.slug),
    ["icon-button"],
  );
  assert.equal(filterThemePreviews("Slider", "Overlays").length, 0);
  assert.equal(
    filterThemePreviews("does-not-exist", "All components").length,
    0,
  );
});
