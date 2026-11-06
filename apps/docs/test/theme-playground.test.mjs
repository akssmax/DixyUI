import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import ts from "typescript";
import { compileThemeDocument } from "@dixy-ui/themes/authoring";
import { themeDocuments } from "@dixy-ui/themes/documents";
import {
  actionColors,
  contrastRatio,
  colorThemeVariables,
} from "@dixy-ui/tokens";
import {
  defaultThemePreset,
  parseThemePreset,
  playgroundThemeProps,
  presetPalette,
  serializeThemePreset,
  starterPresets,
  skinCatalog,
  skinThemePreset,
  themeReactCode,
  themeCSSCode,
  mixThemeRecipe,
  changeThemeParameter,
  changeThemeOrnament,
  editableThemeDocument,
  exportThemeDocument,
  changeThemeCharacter,
  applyStarterCharacter,
  shuffleTheme,
  themeContrast,
  shuffleContrastTargets,
  adaptWellForShuffle,
  wellClash,
} from "../src/lib/theme-playground.ts";
import { wellGrounds } from "@dixy-ui/themes/authoring";

test("a saved or linked preset restores every foundation without accepting executable styles", () => {
  const preset = {
    ...defaultThemePreset,
    appearance: "dark",
    customAccent: true,
    hue: 262,
    motion: "reduced",
    border: 2,
    bodyFont: "system",
  };
  assert.deepEqual(parseThemePreset(serializeThemePreset(preset)), preset);
  assert.deepEqual(
    parseThemePreset(JSON.stringify({ ...preset, version: 1 })),
    preset,
  );
  const imported = parseThemePreset(
    JSON.stringify({
      ...JSON.parse(serializeThemePreset(preset)),
      style: { background: "url(unsafe)" },
      __extra: true,
    }),
  );
  assert.equal(Object.hasOwn(imported, "style"), false);
  assert.equal(Object.hasOwn(imported, "__extra"), false);
});

test("invalid, unsupported, incomplete and oversized presets are rejected", () => {
  for (const input of [
    "null",
    "[]",
    "{}",
    "invalid",
    " ".repeat(8001),
    JSON.stringify({ version: 3, skin: "none", skinVersion: 1, overrides: {} }),
    JSON.stringify({
      version: 2,
      skin: "remote/unknown",
      skinVersion: 1,
      overrides: {},
    }),
    JSON.stringify({ version: 2, skin: "none", skinVersion: 2, overrides: {} }),
    JSON.stringify({
      version: 2,
      skin: "none",
      skinVersion: 1,
      overrides: { radius: "huge" },
    }),
    JSON.stringify({ ...defaultThemePreset, version: 1, hue: 361 }),
    JSON.stringify({ ...defaultThemePreset, version: 1, lightness: null }),
  ])
    assert.throws(() => parseThemePreset(input));
});

test("custom preview and exported tokens retain readable action states in both appearances", () => {
  const preset = { ...defaultThemePreset, customAccent: true, hue: 262 };
  const palette = presetPalette(preset);
  for (const appearance of ["light", "dark"]) {
    const props = playgroundThemeProps(preset, appearance);
    for (const [key, value] of Object.entries(
      colorThemeVariables(palette, appearance),
    ))
      assert.equal(props.style[key], value);
    const action = actionColors(palette[appearance], appearance);
    for (const background of [action.background, action.hover, action.pressed])
      assert.ok(contrastRatio(action.foreground, background) >= 4.5);
  }
  assert.throws(
    () => presetPalette({ ...preset, lightness: 0.59, chroma: 0.14, hue: 155 }),
    /4.5:1/,
  );
});

test("theme overrides preserve separate shape, spacing, font and motion contracts", () => {
  const props = playgroundThemeProps({
    ...defaultThemePreset,
    radius: "full",
    density: "compact",
    motion: "reduced",
    bodyFont: "serif",
    headingFont: "system",
    depth: "none",
    border: 2,
  });
  assert.equal(props.radius, "full");
  assert.equal(props.density, "compact");
  assert.equal(props.motion, "reduced");
  assert.equal(props.style["--dixy-card-shadow"], "var(--dixy-shadow-none)");
  assert.equal(props.style["--dixy-input-border-width"], "2px");
  assert.equal(props.style["--dixy-stroke-width"], "2px");
  assert.match(props.style["--dixy-font-sans"], /Georgia/);
  assert.match(props.style["--dixy-font-heading-sm-family"], /system-ui/);
});

test("complete generated React exports typecheck against built public Dixy packages", () => {
  const directory = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
  );
  const configPath = path.join(directory, "tsconfig.json");
  const config = ts.readConfigFile(configPath, ts.sys.readFile);
  const { options } = ts.parseJsonConfigFileContent(
    config.config,
    ts.sys,
    directory,
  );
  const presets = [
    ...starterPresets.map(({ theme }) => theme),
    ...skinCatalog.map((s) => skinThemePreset(s.id)),
    mixThemeRecipe(
      skinThemePreset("dixy/living-forest"),
      "material",
      "sea-glass",
    ),
    mixThemeRecipe(skinThemePreset("dixy/candy-clay"), "frame", "chamfer"),
    mixThemeRecipe(skinThemePreset("dixy/studio-hardware"), "frame", "none"),
    {
      ...defaultThemePreset,
      customAccent: true,
      hue: 262,
      bodyFont: "system",
      headingFont: "serif",
      motion: "reduced",
      border: 2,
    },
  ];
  const files = new Map(
    presets.map((preset, index) => [
      path.join(directory, `src/__theme_export_${index}.tsx`),
      themeReactCode(preset),
    ]),
  );
  const host = ts.createCompilerHost(options);
  const original = host.getSourceFile.bind(host);
  host.getSourceFile = (file, version, onError, fresh) =>
    files.has(file)
      ? ts.createSourceFile(
          file,
          files.get(file),
          version,
          true,
          ts.ScriptKind.TSX,
        )
      : original(file, version, onError, fresh);
  const program = ts.createProgram({
    rootNames: [...files.keys()],
    options,
    host,
  });
  const errors = ts.getPreEmitDiagnostics(program);
  assert.equal(
    errors.length,
    0,
    ts.formatDiagnosticsWithColorAndContext(errors, {
      getCanonicalFileName: (file) => file,
      getCurrentDirectory: () => directory,
      getNewLine: () => "\n",
    }),
  );
});

test("custom mixes round-trip recipes, seed colors, settings and static exports", () => {
  const source = skinThemePreset("dixy/living-forest");
  let mixed = mixThemeRecipe(source, "material", "titanium");
  mixed = changeThemeParameter(mixed, "material", "sheen", 0.75);
  const beforeFrame = mixed.document.recipes.material;
  mixed = mixThemeRecipe(mixed, "frame", "deco");
  assert.deepEqual(mixed.document.recipes.material, beforeFrame);
  assert.equal(mixed.accentColor, source.accentColor);
  mixed = {
    ...mixed,
    customAccent: true,
    hue: 262,
    border: 2,
    radius: "none",
    headingFont: "serif",
    material: "paper",
    motion: "reduced",
  };
  const restored = parseThemePreset(serializeThemePreset(mixed));
  assert.deepEqual(restored, mixed);
  assert.equal(JSON.parse(serializeThemePreset(mixed)).version, 3);
  const document = editableThemeDocument(mixed);
  const imported = parseThemePreset(exportThemeDocument(mixed));
  assert.equal(imported.document.schemaVersion, 6);
  // Character travels with the document: the Forest starter's leaves survive a material/frame mix.
  assert.equal(imported.document.character.controls, "botanical");
  assert.equal(imported.hue, 262);
  assert.equal(imported.customAccent, true);
  assert.equal(imported.material, "paper");
  assert.equal(document.recipes.material.id, "titanium");
  assert.equal(document.recipes.frame.id, "deco");
  assert.equal(playgroundThemeProps(restored).skin.id, "custom/my-theme");
  const code = themeReactCode(restored),
    css = themeCSSCode(restored);
  assert.match(code, /@dixy-ui\/themes\/art-deco\/react/);
  assert.match(code, /import "\.\/dixy-theme.css"/);
  assert.doesNotMatch(
    code,
    /compileThemeDocument|\/authoring|\/living-forest.css/,
  );
  assert.match(css, /custom\/my-theme/);
  assert.match(css, /data-appearance="dark"/);
  assert.match(css, /--dixy-color-brand-9:oklch/);
  assert.throws(() => changeThemeParameter(mixed, "frame", "width", 100));
  assert.equal(source.document, null);
});

test("every skin has portable bounded overrides and explicit independent imports", () => {
  for (const skin of skinCatalog) {
    const preset = {
      ...skinThemePreset(skin.id),
      ornament: "quiet",
      relief: 0,
      effects: "reduced",
      dir: "rtl",
      appearance: "light",
      material: "metal",
    };
    assert.deepEqual(parseThemePreset(serializeThemePreset(preset)), preset);
    const encoded = JSON.parse(serializeThemePreset(preset));
    assert.equal(encoded.skin, skin.id);
    assert.equal(Object.hasOwn(encoded.overrides, "skin"), false);
    const code = themeReactCode(preset);
    assert.ok(code.includes("@dixy-ui/themes/" + skin.slug + ".css"));
    assert.ok(code.includes("skin={" + skin.symbol + "}"));
    // Chrome-only skins (no ornament renderer) import no React entry at all.
    const rendered = Boolean(skin.rendererSymbol);
    assert.equal(
      code.includes("@dixy-ui/themes/" + skin.slug + "/react"),
      rendered,
    );
    assert.equal(code.includes("ornamentRenderer={"), rendered);
    assert.equal(
      Boolean(playgroundThemeProps(preset).ornamentRenderer),
      rendered,
    );
    for (const other of skinCatalog.filter((s) => s.id !== skin.id))
      assert.ok(!code.includes("@dixy-ui/themes/" + other.slug));
  }
});

test("playground and standalone settings share the portable foundation documents", () => {
  for (const document of themeDocuments) {
    const compiled = compileThemeDocument(document);
    const preset = skinThemePreset(document.id);
    const props = playgroundThemeProps(preset);
    for (const [key, value] of Object.entries(compiled.themeProps.style))
      assert.equal(props.style[key], value);
    if (document.foundations.customAccent) {
      for (const appearance of ["light", "dark"]) {
        const palette = presetPalette(preset);
        const colors = colorThemeVariables(palette, appearance);
        for (const [key, value] of Object.entries(colors))
          assert.ok(compiled.css.includes(`${key}:${value};`));
      }
    }
    for (const key of [
      "appearance",
      "accentColor",
      "neutralColor",
      "radius",
      "density",
      "ornament",
      "relief",
      "effects",
    ])
      assert.equal(
        props[key],
        compiled.themeProps[key],
        `${document.id}: ${key}`,
      );
    assert.equal(props.material, undefined);
    assert.deepEqual(parseThemePreset(serializeThemePreset(preset)), preset);
  }
});

test("No frame round-trips and exports without importing a renderer", () => {
  const source = skinThemePreset("dixy/studio-hardware");
  const preset = mixThemeRecipe(source, "frame", "none");
  assert.equal(preset.document.recipes.material.id, "ceramic");
  assert.equal(preset.document.recipes.frame.parameters.width, 0);
  assert.equal(playgroundThemeProps(preset).ornamentRenderer, null);
  assert.deepEqual(parseThemePreset(serializeThemePreset(preset)), preset);
  assert.equal(
    parseThemePreset(exportThemeDocument(preset)).document.recipes.frame.id,
    "none",
  );
  assert.match(themeReactCode(preset), /ornamentRenderer=\{null\}/);
  assert.doesNotMatch(themeReactCode(preset), /themes\/[^"\n]+\/react/);
  assert.match(themeCSSCode(preset), /border:0px solid/);
  const restored = mixThemeRecipe(preset, "frame", "ceramic");
  assert.ok(playgroundThemeProps(restored).ornamentRenderer);
  assert.deepEqual(
    restored.document.recipes.material,
    preset.document.recipes.material,
  );
});

test("organic frame controls round-trip through presets, exports and frame changes", () => {
  let preset = skinThemePreset("dixy/living-forest");
  preset = changeThemeOrnament(preset, "density", 87);
  preset = changeThemeOrnament(preset, "style", "Wild ivy");
  preset = changeThemeOrnament(preset, "canopy", "Corner cascades");
  preset = changeThemeOrnament(preset, "stem", "Woody branches");
  const restored = parseThemePreset(serializeThemePreset(preset));
  assert.deepEqual(restored, preset);
  assert.match(themeCSSCode(restored), /--dixy-organic-density:87/);
  assert.match(themeReactCode(restored), /--dixy-organic-density/);
  assert.equal(
    JSON.parse(exportThemeDocument(restored)).recipes.frame.ornament.stem,
    "Woody branches",
  );
  assert.equal(
    playgroundThemeProps(restored).style["--dixy-organic-density"],
    "87",
  );
  preset = mixThemeRecipe(preset, "frame", "cushion");
  assert.equal(preset.document.recipes.frame.ornament.style, "Piped petals");
  assert.equal(preset.document.recipes.frame.ornament.density, 42);
  assert.throws(() => changeThemeOrnament(preset, "density", 101));
});

test("character edits fork the starter, round-trip and export as static CSS", () => {
  let preset = skinThemePreset("dixy/retro-os");
  preset = changeThemeCharacter(preset, "controls", "clay");
  preset = changeThemeCharacter(preset, ["motion", "style"], "springy");
  preset = changeThemeCharacter(preset, ["backdrop", "pattern"], "grid");
  assert.equal(preset.document.character.controls, "clay");
  assert.equal(preset.document.character.motion.style, "springy");
  const restored = parseThemePreset(serializeThemePreset(preset));
  assert.deepEqual(restored.document.character, preset.document.character);
  const css = themeCSSCode(restored);
  assert.match(css, /scale:1 calc\(1 - \.18/);
  assert.match(css, /linear\(0,0\.22/);
  assert.throws(() => changeThemeCharacter(preset, ["motion", "press"], 99));
  const borrowed = applyStarterCharacter(preset, "dixy/art-deco");
  assert.equal(borrowed.document.character.controls, "brass");
});

test("Original Dixy keeps a neutral character when edited", () => {
  const document = editableThemeDocument(defaultThemePreset);
  assert.equal(document.character.controls, "standard");
  assert.equal(document.character.backdrop.pattern, "none");
});

test("shuffle is deterministic per seed and always valid", () => {
  const a = shuffleTheme(defaultThemePreset, 42);
  const b = shuffleTheme(defaultThemePreset, 42);
  assert.deepEqual(a, b);
  for (let seed = 1; seed < 40; seed++) {
    const next = shuffleTheme(defaultThemePreset, seed);
    assert.ok(next.document);
    assert.doesNotThrow(() => playgroundThemeProps(next));
    assert.deepEqual(parseThemePreset(serializeThemePreset(next)), next);
  }
});

test("starter catalog carries a voice for every theme", () => {
  for (const skin of skinCatalog)
    for (const key of ["eyebrow", "headline", "body", "primary", "secondary"])
      assert.ok(skin.voice[key]?.length > 0, skin.id + " " + key);
});

test("shuffle only returns themes that meet text and button contrast in both appearances", () => {
  for (let seed = 1; seed <= 120; seed++) {
    const { text, action } = themeContrast(
      shuffleTheme(defaultThemePreset, seed),
    );
    assert.ok(text >= shuffleContrastTargets.text, `seed ${seed} text ${text}`);
    assert.ok(
      action >= shuffleContrastTargets.action,
      `seed ${seed} action ${action}`,
    );
  }
});

test("shuffle never sets a fixed dark well inside a light card", () => {
  for (let seed = 1; seed <= 400; seed++) {
    const next = shuffleTheme(defaultThemePreset, seed);
    const well = next.document.character.chrome.well;
    const { text, action, well: step } = themeContrast(next);
    assert.notEqual(wellGrounds[well].kind, "fixed", `seed ${seed} ${well}`);
    assert.ok(step <= shuffleContrastTargets.wellStep, `seed ${seed} step ${step}`);
    // Text and the accent button are measured on the well's own ground as well as the card.
    assert.ok(text >= shuffleContrastTargets.text, `seed ${seed} text ${text}`);
    assert.ok(action >= shuffleContrastTargets.action, `seed ${seed} action ${action}`);
  }
});

test("well traits flag the LCD clash and swap in its substitute", () => {
  // Winamp Signal ships the dark LCD on a light gunmetal card: deliberate by hand, a clash for shuffle.
  const winamp = applyStarterCharacter(
    skinThemePreset("dixy/winamp-signal"),
    "dixy/winamp-signal",
  );
  assert.equal(winamp.document.character.chrome.well, "lcd");
  assert.ok(
    themeContrast(winamp, ["light"]).well > shuffleContrastTargets.wellStep,
  );
  assert.ok(
    themeContrast(winamp, ["dark"]).well <= shuffleContrastTargets.wellStep,
  );
  const adapted = adaptWellForShuffle(winamp);
  assert.equal(
    adapted.document.character.chrome.well,
    wellGrounds.lcd.substitute,
  );
  assert.ok(themeContrast(adapted).well <= shuffleContrastTargets.wellStep);
  // The inspector warns about the same clash but leaves the choice to the author.
  assert.deepEqual(
    { ...wellClash(winamp), step: undefined },
    { appearance: "light", step: undefined, tone: "dark", substitute: "recessed" },
  );
  assert.equal(wellClash(adapted), null);
  // Appearance-following wells are left alone.
  const clay = applyStarterCharacter(
    skinThemePreset("dixy/candy-clay"),
    "dixy/candy-clay",
  );
  assert.equal(adaptWellForShuffle(clay), clay);
  assert.equal(wellClash(clay), null);
});

test("contrast measurement flags a pale accent on a pale surface", () => {
  // A pale peach fill on Candy Clay's light clay surface: label text passes, the fill does not stand out.
  const candy = {
    ...skinThemePreset("dixy/candy-clay"),
    customAccent: true,
    lightness: 0.74,
    chroma: 0.12,
    hue: 48,
  };
  assert.ok(
    themeContrast(candy, ["light"]).action < shuffleContrastTargets.action,
  );
  assert.ok(
    themeContrast(candy, ["dark"]).action >= shuffleContrastTargets.action,
  );
  assert.ok(themeContrast(skinThemePreset("dixy/art-deco")).action >= 3);
});
