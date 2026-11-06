import assert from "node:assert/strict";
import { test } from "node:test";
import {
  compileThemeDocument,
  parseThemeDocument,
  ThemeDocumentError,
  controlStyles,
  motionStyles,
  stateStyles,
  backdropPatterns,
  defaultCharacter,
} from "../src/authoring.ts";
import { themeDocuments } from "../src/documents.ts";

const clone = (value) => structuredClone(value);
const base = () => {
  const document = clone(themeDocuments[0]);
  document.id = "test/character";
  document.character = clone(defaultCharacter);
  return document;
};
const componentLayer = (css) =>
  css.slice(css.indexOf("@layer dixy.components"));

test("every starter ships its own control language, motion and backdrop", () => {
  const signatures = new Set(
    themeDocuments.map((d) =>
      [
        d.character.controls,
        d.character.motion.style,
        d.character.backdrop.pattern,
      ].join("/"),
    ),
  );
  assert.equal(signatures.size, themeDocuments.length);
  assert.equal(
    new Set(themeDocuments.map((d) => d.character.controls)).size,
    12,
  );
});

test("neutral character adds no component rules, so v3 documents keep their look", () => {
  const neutral = compileThemeDocument(base()).css;
  const legacy = clone(base());
  legacy.schemaVersion = 3;
  delete legacy.character;
  for (const key of ["backdropBlur", "backdropSaturate"])
    delete legacy.recipes.material.parameters[key];
  const migrated = parseThemeDocument(legacy);
  assert.deepEqual(migrated.character, defaultCharacter);
  assert.equal(compileThemeDocument(migrated).css, neutral);
  assert.doesNotMatch(
    neutral,
    /::selection|font-variant-numeric|scrollbar-color|svg\[stroke/,
  );
});

test("each control language compiles to rules scoped to the skin's own parts", () => {
  const neutral = new Set(compileThemeDocument(base()).css.split("\n"));
  for (const controls of controlStyles) {
    if (controls === "standard") continue;
    const document = base();
    document.character.controls = controls;
    const added = compileThemeDocument(document)
      .css.split("\n")
      .filter((line) => !neutral.has(line) && line.trim());
    assert.ok(
      added.some((line) => line.includes("dixy-switch-thumb")),
      controls,
    );
    // Every added rule is rooted in this theme and targets parts carrying this skin.
    for (const line of added)
      assert.match(
        line,
        /^\s*\.dixy-theme\[data-dixy-skin="test\/character"\][^{]*\[data-dixy-skin(="test\/character")?\]/,
        controls + ": " + line.slice(0, 80),
      );
    // Explicit Square radius still wins over a language's own corners.
    assert.ok(
      added.some((line) =>
        /\[data-radius="none"\].*\{ border-radius:0; \}/.test(line),
      ),
      controls,
    );
    // Focus outlines are never replaced by control shapes.
    assert.ok(
      !added.some((line) => /outline:\s*none|outline:0/.test(line)),
      controls,
    );
  }
});

test("motion personalities never lengthen durations under reduced motion", () => {
  for (const style of motionStyles) {
    const document = base();
    document.character.motion = { style, press: 2, tempo: 1.5 };
    const css = compileThemeDocument(document).css;
    for (const match of css.matchAll(/--dixy-motion-duration-\w+:\d+ms/g)) {
      const before = css.slice(0, match.index);
      const media = before.slice(before.lastIndexOf("@media"));
      const depth = media.split("{").length - media.split("}").length;
      assert.ok(
        media.startsWith("@media (prefers-reduced-motion:no-preference)") &&
          depth >= 2,
        `${style} sets durations outside the no-preference guard`,
      );
    }
    assert.match(css, /:not\(\[data-motion="reduced"\]\)/);
    // Press distance is multiplied by the spatial factor elsewhere, which reduced motion sets to 0.
    assert.match(css, /--dixy-personality-press-distance:2px/);
  }
});

test("animated state cues and backdrops respect reductions", () => {
  const document = base();
  document.character.states = "marching";
  document.character.backdrop.pattern = "sunburst";
  const css = compileThemeDocument(document).css;
  assert.match(
    css,
    /prefers-reduced-motion:no-preference\) \{[^}]*:not\(\[data-effects="reduced"\]\)[^{]*\{ animation:dixy-character-march/,
  );
  assert.match(css, /\[data-effects="reduced"\]::before \{ display:none; \}/);
  assert.match(
    css,
    /prefers-contrast:more\),\(forced-colors:active\) \{[^}]*::before \{ display:none; \}/,
  );
  for (const pattern of backdropPatterns) {
    document.character.backdrop.pattern = pattern;
    const output = compileThemeDocument(document).css;
    assert.doesNotMatch(output, /url\(/, pattern);
    if (pattern !== "none")
      assert.match(output, /pointer-events:none/, pattern);
  }
  for (const states of stateStyles) {
    document.character.states = states;
    assert.doesNotMatch(compileThemeDocument(document).css, /outline:\s*none/);
  }
});

test("focus styles keep a visible outline of at least 2px", () => {
  for (const focus of ["double", "dashed", "glow", "offset"]) {
    const document = base();
    document.character.details.focus = focus;
    const css = compileThemeDocument(document).css;
    const rule = css.match(/:focus-visible \{([^}]*)\}/)[1];
    const width = rule.match(/outline-width:(\d+)px/);
    if (width) assert.ok(Number(width[1]) >= 2, focus);
    assert.doesNotMatch(rule, /outline-style:none|outline:\s*none/, focus);
  }
});

test("character values are closed data", () => {
  for (const change of [
    { controls: "javascript:alert(1)" },
    { motion: { style: "standard", press: 9, tempo: 1 } },
    { backdrop: { pattern: "url(x)", intensity: 0.5, scale: 1 } },
    { details: { ...defaultCharacter.details, iconStroke: 0 } },
    { css: "body{}" },
  ]) {
    const document = base();
    Object.assign(document.character, change);
    assert.throws(() => parseThemeDocument(document), ThemeDocumentError);
  }
});

test("window chrome rebuilds card parts without new markup and migrates from v4", async () => {
  const {
    titlebarStyles,
    edgeStyles,
    wellStyles,
    cornerStyles,
    defaultChrome,
  } = await import("../src/authoring.ts");
  const neutral = compileThemeDocument(base()).css;
  assert.doesNotMatch(neutral, /dixy-card-header \{|dixy-card-header \+/);
  const v4 = base();
  v4.schemaVersion = 4;
  delete v4.character.chrome;
  for (const key of ["backdropBlur", "backdropSaturate"])
    delete v4.recipes.material.parameters[key];
  const migrated = parseThemeDocument(v4);
  assert.equal(migrated.schemaVersion, 6);
  assert.deepEqual(migrated.character.chrome, defaultChrome);
  assert.equal(compileThemeDocument(migrated).css, neutral);
  const scoped =
    /\.dixy-theme\[data-dixy-skin="test\/character"\] :is\(\.dixy-card(,\.dixy-dialog-popup)?\)\[data-dixy-skin="test\/character"\]/;
  for (const [key, values] of [
    ["titlebar", titlebarStyles],
    ["edge", edgeStyles],
    ["well", wellStyles],
    ["corners", cornerStyles],
  ])
    for (const value of values) {
      if (value === defaultChrome[key]) continue;
      const document = base();
      document.character.chrome = { ...defaultChrome, [key]: value };
      const css = compileThemeDocument(document).css;
      assert.ok(css.length > neutral.length, key + "=" + value);
      assert.match(css, scoped, key + "=" + value);
      assert.doesNotMatch(
        css,
        /url\(|outline:\s*none|display:none; \}\s*$/,
        value,
      );
      // Decorative chrome pieces are empty pseudo-elements: nothing is announced.
      for (const content of css.matchAll(/content:("[^"]*")/g))
        assert.equal(content[1], '""', value);
    }
  const bar = base();
  bar.character.chrome = { ...defaultChrome, titlebar: "grip" };
  const css = compileThemeDocument(bar).css;
  assert.match(
    css,
    /forced-colors:active\) \{[^}]*dixy-card-header \{ background:Canvas/,
  );
  assert.match(css, /--dixy-color-text-secondary:/);
  const document = base();
  document.character.chrome = { ...defaultChrome, titlebar: "javascript:x" };
  assert.throws(() => parseThemeDocument(document), ThemeDocumentError);
});

test("starters ship structural chrome without title bars", () => {
  const chrome = Object.fromEntries(
    themeDocuments.map((d) => [d.id, d.character.chrome]),
  );
  assert.deepEqual(chrome["dixy/winamp-signal"], {
    titlebar: "none",
    edge: "bevel",
    well: "lcd",
    corners: "pixel",
  });
  assert.equal(chrome["dixy/art-deco"].edge, "stepped");
  assert.equal(chrome["dixy/studio-hardware"].well, "recessed");
  // No starter ships a title bar; it stays an opt-in playground choice.
  for (const [id, value] of Object.entries(chrome))
    assert.equal(value.titlebar, "none", id);
  // Every starter carries some window structure, and no two share the same chrome.
  const { defaultChrome } = {
    defaultChrome: {
      titlebar: "none",
      edge: "line",
      well: "none",
      corners: "inherit",
    },
  };
  for (const [id, value] of Object.entries(chrome))
    assert.notDeepEqual(value, defaultChrome, id);
  assert.equal(
    new Set(Object.values(chrome).map((value) => JSON.stringify(value))).size,
    themeDocuments.length,
  );
});

test("colour-carrying easings never overshoot, so hover tints cannot flash", () => {
  // An overshooting curve extrapolates colours beyond their target.
  const overshoots = (value) =>
    /linear\(/.test(value) &&
    [...value.matchAll(/(-?\d*\.?\d+)(?=\s+\d+%|,|\))/g)].some(
      ([, n]) => Number(n) > 1 || Number(n) < 0,
    );
  for (const style of motionStyles) {
    const document = base();
    document.character.motion = { style, press: 1, tempo: 1 };
    const css = compileThemeDocument(document).css;
    for (const [, value] of css.matchAll(
      /--dixy-motion-easing-standard:([^;]+);/g,
    )) {
      assert.ok(!overshoots(value), `${style} standard easing overshoots`);
      const bezier = value.match(/cubic-bezier\(([^)]+)\)/);
      if (bezier) {
        const [, y1, , y2] = bezier[1].split(",").map(Number);
        assert.ok(
          y1 <= 1 && y2 <= 1 && y1 >= 0 && y2 >= 0,
          `${style} bezier overshoots`,
        );
      }
    }
  }
  const springy = base();
  springy.character.motion = { style: "springy", press: 1, tempo: 1 };
  const css = compileThemeDocument(springy).css;
  assert.match(css, /--dixy-motion-easing-spatial:linear\(/);
  assert.match(css, /--dixy-switch-motion-thumb-easing:linear\(/);
});
