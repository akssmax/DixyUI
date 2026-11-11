import assert from "node:assert/strict";
import fs from "node:fs";
import { gzipSync } from "node:zlib";
import { test } from "node:test";
import { defineSkin } from "../src/authoring.ts";
import { manifests } from "../src/manifests.ts";

test("custom skin metadata is validated, copied, and immutable", () => {
  const source = {
    id: "acme/notebook",
    name: "Notebook",
    version: 1,
    defaults: { ...manifests[0].defaults },
    style: "unsafe",
  };
  const skin = defineSkin(source);
  source.defaults.accentColor = "blue";
  assert.equal(skin.defaults.accentColor, "grass");
  assert.equal(Object.hasOwn(skin, "style"), false);
  assert.ok(Object.isFrozen(skin.defaults));
  for (const bad of [
    { ...skin, id: "../escape" },
    { ...skin, version: 2 },
    { ...skin, defaults: { ...skin.defaults, material: "webgl" } },
  ])
    assert.throws(() => defineSkin(bad));
});

test("skin CSS stays independent, bounded and scoped to each actual component", () => {
  for (const manifest of manifests) {
    const css = fs.readFileSync(
      new URL("../generated/" + manifest.slug + ".css", import.meta.url),
      "utf8",
    );
    assert.ok(gzipSync(css).length <= 5120);
    assert.match(css, /data-effects="reduced"/);
    assert.match(css, /forced-colors: active/);
    assert.match(css, /data-dixy-material-override/);
    assert.doesNotMatch(
      css,
      /requestAnimationFrame|will-change|<canvas|WebGL/i,
    );
    for (const other of manifests.filter((m) => m !== manifest))
      assert.ok(!css.includes("dixy/" + other.slug));
    assert.ok(css.includes(".dixy-card"));
    assert.ok(css.includes('[data-dixy-skin="dixy/' + manifest.slug + '"]'));
    // Popups portal into a zero-height .dixy-portal-scope at the end of <body>.
    // Positioning or isolating it makes it their containing block, and they
    // render a page height away from their trigger.
    for (const [, selector, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      if (
        !/position\s*:|isolation\s*:|transform\s*:|filter\s*:|contain\s*:/.test(
          body,
        )
      )
        continue;
      for (const part of selector.split(","))
        assert.doesNotMatch(
          part.trim(),
          /^\.dixy-theme\[data-dixy-skin="[^"]+"\](\[[^\]]+\])*$/,
          manifest.slug + " positions the portal scope: " + part.trim(),
        );
    }
  }
  const forest = fs.readFileSync(
    new URL("../generated/living-forest.css", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(forest, /forest-frame|\.webp|\.png|data:image/);
  assert.match(forest, /data-animated/);
  assert.match(forest, /prefers-reduced-motion/);
});

test("no-frame skins keep a passed ornament renderer out of flow (issue #24)", async () => {
  const { themeDocuments } = await import("../src/documents.ts");
  const unframed = themeDocuments.filter(
    (document) => document.recipes.frame.id === "none",
  );
  assert.ok(
    unframed.some((document) => document.id === "dixy/candy-clay"),
    "Candy Clay ships plain cards",
  );
  for (const document of unframed) {
    const css = fs.readFileSync(
      new URL(
        "../generated/" + document.id.split("/")[1] + ".css",
        import.meta.url,
      ),
      "utf8",
    );
    const scope = `.dixy-theme[data-dixy-skin="${document.id}"] .dixy-skin-ornament`;
    const rule = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].find(
      ([, selector]) => selector.trim() === scope,
    );
    assert.ok(rule, `${document.id} has no rule for its ornament wrapper`);
    // Wrapper (and the canvas inside it) must not take up layout space.
    assert.match(rule[2], /position:\s*absolute/);
    assert.match(rule[2], /inset:\s*0/);
    assert.match(rule[2], /display:\s*none/);
    assert.match(rule[2], /pointer-events:\s*none/);
  }
});
