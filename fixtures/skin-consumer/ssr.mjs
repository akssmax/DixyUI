import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { Theme, Button, Card } from "@dixy-ui/react";
import { ForestOrnament } from "@dixy-ui/themes/living-forest/react";
import { livingForest } from "@dixy-ui/themes/living-forest";
import {
  compileThemeDocument,
  parseThemeDocument,
} from "@dixy-ui/themes/authoring";
import { themeDocuments } from "@dixy-ui/themes/documents";
import schema from "@dixy-ui/themes/theme-document.schema.json" with { type: "json" };

const fork = structuredClone(themeDocuments[0]);
fork.id = "example/grove";
fork.foundations.radius = "none";
fork.foundations.relief = 0;
const compiled = compileThemeDocument(JSON.stringify(fork));
assert.equal(schema.properties.schemaVersion.enum[0], 6);
assert.ok(schema.properties.character, "schema publishes theme character");
assert.match(compiled.css, /border-radius:60% 4% 60% 4%/);
assert.deepEqual(parseThemeDocument(compiled.document), fork);
assert.match(compiled.css, /data-dixy-skin="example\/grove"/);
const forkHTML = renderToString(
  createElement(
    Theme,
    compiled.themeProps,
    createElement(Card.Root, null, "Custom grove"),
  ),
);
assert.match(forkHTML, /data-radius="none"/);
assert.match(forkHTML, /data-relief="0"/);
assert.doesNotMatch(forkHTML, /data-dixy-material-override/);
const html = renderToString(
  createElement(
    Theme,
    {
      skin: livingForest,
      ornamentRenderer: ForestOrnament,
      animateOrnaments: true,
    },
    createElement(Card.Root, null, createElement(Button, null, "Save")),
  ),
);
assert.match(html, /data-dixy-skin="dixy\/living-forest"/);
assert.match(html, /data-material="paper"/);
assert.match(html, /data-accent="grass"/);
console.log(
  "Packed skin definition and core Theme render without browser globals.",
);

assert.match(html, /dixy-forest-ornament-card/);
assert.match(html, /<canvas[^>]*dixy-organic-canvas/);
assert.doesNotMatch(html, /<image|data:image|\.webp/);
assert.doesNotMatch(html, /ornament-button/);
const ids = [...html.matchAll(/id="(dixy-forest-[^"]+)"/g)].map((m) => m[1]);
assert.equal(
  new Set(ids).size,
  ids.length,
  "Procedural SVG IDs must be unique across instances",
);
for (const reference of [
  ...html.matchAll(/(?:href="#|url\(#)(dixy-forest-[^"\)]+)/g),
])
  assert.ok(ids.includes(reference[1]), "Local SVG reference must resolve");

assert.match(
  html,
  /dixy-skin-ornament-card/,
  "Forest participates in the shared content-safe frame contract",
);

// Exercise every published renderer through the independently packed packages.
// The browser fixture above still imports only Forest, so bundle isolation is tested separately.
for (const slug of [
  "retro-os",
  "winamp-signal",
  "studio-hardware",
  "prism-glass",
  "tactile-atelier",
  "ocean-depths",
  "candy-clay",
  "art-deco",
  "y2k-titanium",
  "material-light",
  "blueprint",
  "riso-zine",
  "neon-night-market",
  "sumi-ink",
  "tokyo-transit",
  "phosphor-terminal",
  "ansi-panes",
  "swiss-poster",
  "azulejo-tile",
  "brutalist-concrete",
  "atomic-lounge",
  "orbital-hud",
  "freighter",
  "solar-sail",
  "diwali-lights",
  "papel-picado",
  "holi-colours",
  "yule-knit",
  "glass-ui",
]) {
  const { default: skin } = await import("@dixy-ui/themes/" + slug);
  const { default: Renderer } = await import(
    "@dixy-ui/themes/" + slug + "/react"
  );
  const render = (overrides = {}) =>
    renderToString(
      createElement(
        Theme,
        {
          skin,
          ornamentRenderer: Renderer,
          animateOrnaments: true,
          ...overrides,
        },
        createElement(Card.Root, null, createElement(Button, null, "Save")),
        createElement(Card.Root, null, "Another independent instance"),
      ),
    );
  const markup = render();
  assert.match(markup, /dixy-skin-ornament-card/);
  assert.match(markup, /aria-hidden="true"/);
  assert.doesNotMatch(markup, /<image|data:image|\.webp|<script/);
  if (
    [
      "ocean-depths",
      "candy-clay",
      "art-deco",
      "blueprint",
      "riso-zine",
      "neon-night-market",
      "sumi-ink",
      "tokyo-transit",
      "phosphor-terminal",
      "ansi-panes",
      "swiss-poster",
      "azulejo-tile",
      "brutalist-concrete",
      "atomic-lounge",
      "orbital-hud",
      "freighter",
      "solar-sail",
      "diwali-lights",
      "papel-picado",
      "holi-colours",
      "yule-knit",
      "glass-ui",
    ].includes(slug)
  )
    assert.match(markup, /dixy-organic-canvas/);
  else assert.doesNotMatch(markup, /<canvas/);
  assert.doesNotMatch(markup, /ornament-button/);
  if (slug === "retro-os")
    assert.doesNotMatch(
      markup,
      /retro-titlebar|retro-window-marks|retro-disk|retro-corner/,
    );
  const localIds = [...markup.matchAll(/id="(dixy-[^"]+)"/g)].map((m) => m[1]);
  assert.equal(
    new Set(localIds).size,
    localIds.length,
    slug + " must have unique SVG IDs",
  );
  for (const reference of markup.matchAll(/(?:href="#|url\(#)(dixy-[^"\)]+)/g))
    assert.ok(
      localIds.includes(reference[1]),
      slug + " has a broken local SVG reference",
    );
  assert.match(markup, /data-animated/);
  assert.doesNotMatch(render({ motion: "reduced" }), /data-animated/);
  assert.doesNotMatch(
    render({ effects: "reduced" }),
    /dixy-skin-ornament-card/,
  );
  assert.doesNotMatch(render({ ornament: "quiet" }), /dixy-skin-ornament-card/);
}
console.log(
  "PASS: all ten additional packed renderers, repeated SSR instances, SVG references and inherited reductions.",
);
