import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import assert from "node:assert/strict";
import { gzipSync } from "node:zlib";
import { createRequire } from "node:module";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "dixy-consumer-"));
const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
// A stable cache for isolated consumers; never link workspace source.
const storeDirectory = path.join(root, ".pnpm-store");
const offline = process.argv.includes("--online") ? [] : ["--offline"];
const run = (args, cwd) => execFileSync(pnpm, args, { cwd, stdio: "inherit" });

try {
  const tarball = path.join(temporary, "dixy.tgz");
  run(["--dir", "packages/react", "pack", "--out", tarball], root);
  const tokensTarball = path.join(temporary, "tokens.tgz");
  run(["--dir", "packages/tokens", "pack", "--out", tokensTarball], root);
  const themesTarball = path.join(temporary, "themes.tgz");
  run(["--dir", "packages/themes", "pack", "--out", themesTarball], root);
  const consumer = path.join(temporary, "consumer");
  fs.cpSync(path.join(root, "fixtures/consumer"), consumer, {
    recursive: true,
  });
  const manifestPath = path.join(consumer, "package.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  manifest.dependencies["@dixy-ui/react"] = `file:${tarball}`;
  manifest.dependencies["@dixy-ui/tokens"] = `file:${tokensTarball}`;
  // pnpm 12 reads overrides from workspace configuration in this isolated app.
  fs.writeFileSync(
    path.join(consumer, "pnpm-workspace.yaml"),
    `overrides:\n  '@dixy-ui/tokens': ${JSON.stringify(`file:${tokensTarball}`)}\n`,
  );
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  // Reuse the workspace store, but never link the consumer to workspace source.
  run(["install", ...offline, "--store-dir", storeDirectory], consumer);
  run(["exec", "tsc", "--noEmit"], consumer);
  execFileSync(process.execPath, ["ssr.mjs"], {
    cwd: consumer,
    stdio: "inherit",
  });
  run(["exec", "vite", "build"], consumer);
  const css = fs
    .readdirSync(path.join(consumer, "dist/assets"))
    .filter((file) => file.endsWith(".css"))
    .map((file) =>
      fs.readFileSync(path.join(consumer, "dist/assets", file), "utf8"),
    )
    .join("");
  assert.match(css, /dixy-icon/);
  assert.ok(
    !css.includes("--dixy-skin-art"),
    "Core consumer must not load skins",
  );
  assert.ok(
    !css.includes("--dixy-material-glossy-image"),
    "Core CSS must not load optional materials",
  );
  assert.ok(
    !css.includes("dixy-backdrop-pilot"),
    "Core CSS must not load the backdrop pilot",
  );
  assert.ok(
    !css.includes("dixy-prompt-input"),
    "Core CSS must not load the optional AI styles",
  );
  assert.match(css, /--dixy-size-icon-2xl/);
  for (const selector of [
    "dixy-checkbox-root",
    "dixy-switch-thumb",
    "dixy-tabs-tab",
    "dixy-tooltip-popup",
    "dixy-drawer-popup",
    "dixy-toast-root",
  ])
    assert.ok(css.includes(selector), `Missing packed styles: ${selector}`);
  const consumerJs = fs
    .readdirSync(path.join(consumer, "dist/assets"))
    .filter((file) => file.endsWith(".js"))
    .map((file) =>
      fs.readFileSync(path.join(consumer, "dist/assets", file), "utf8"),
    )
    .join("");
  for (const unused of [
    "dixy-combobox",
    "dixy-otp-field",
    "dixy-drawer",
    "dixy-toast",
    "dixy-calendar",
    "dixy-color-area",
    "dixy-data-table",
  ])
    assert.ok(
      !consumerJs.includes(unused),
      `Unused family survived tree shaking: ${unused}`,
    );
  assert.match(css, /--dixy-color-icon-success/);
  const coreManifest = JSON.parse(
    fs.readFileSync(
      path.join(consumer, "node_modules/@dixy-ui/react/package.json"),
      "utf8",
    ),
  );
  for (const pack of [
    "lucide-react",
    "@phosphor-icons/react",
    "@iconify/react",
  ]) {
    assert.ok(!coreManifest.dependencies?.[pack]);
    assert.ok(!fs.existsSync(path.join(consumer, "node_modules", pack)));
  }
  assert.match(css, /--dixy-accent/);
  assert.match(css, /--dixy-color-blue-12/);
  assert.match(css, /--dixy-color-stone-12/);
  assert.match(css, /--dixy-color-white-a12/);
  assert.match(css, /--dixy-color-black-a1/);
  assert.match(css, /--dixy-color-background-action-destructive/);
  assert.match(css, /--dixy-button-destructive-foreground/);
  assert.match(css, /--dixy-font-body-md/);
  assert.match(css, /data-typography/);
  assert.match(css, /dixy-dialog-popup/);
  assert.match(css, /dixy-input/);
  assert.match(css, /--dixy-space-2000/);
  assert.match(css, /--dixy-spacing-stack-md/);
  assert.match(css, /dixy-stack/);
  assert.match(css, /dixy-container/);
  assert.match(css, /--dixy-size-control-md/);
  assert.match(css, /--dixy-layout-gutter/);
  assert.match(css, /--dixy-dialog-radius/);
  assert.match(css, /--dixy-border-width-2/);
  assert.match(css, /--dixy-shadow-overlay/);
  assert.match(css, /--dixy-motion-transition-enter/);
  for (const component of [
    "button",
    "checkbox",
    "dialog",
    "drawer",
    "menu",
    "switch",
    "tabs",
  ])
    assert.match(css, new RegExp(`--dixy-${component}-motion-`));
  assert.match(css, /--dixy-motion-spatial-factor/);
  assert.match(css, /--dixy-switch-travel-direction/);
  assert.match(css, /--dixy-motion-loop-progress/);
  assert.ok(
    !fs.existsSync(path.join(consumer, "node_modules/motion")),
    "Core consumer must not require Motion",
  );

  const skinConsumer = path.join(temporary, "skin-consumer");
  fs.cpSync(path.join(root, "fixtures/skin-consumer"), skinConsumer, {
    recursive: true,
  });
  const skinManifestPath = path.join(skinConsumer, "package.json");
  const skinManifest = JSON.parse(fs.readFileSync(skinManifestPath, "utf8"));
  Object.assign(skinManifest.dependencies, {
    "@dixy-ui/react": `file:${tarball}`,
    "@dixy-ui/tokens": `file:${tokensTarball}`,
    "@dixy-ui/themes": `file:${themesTarball}`,
  });
  fs.writeFileSync(skinManifestPath, JSON.stringify(skinManifest, null, 2));
  fs.copyFileSync(
    path.join(consumer, "pnpm-workspace.yaml"),
    path.join(skinConsumer, "pnpm-workspace.yaml"),
  );
  run(["install", ...offline, "--store-dir", storeDirectory], skinConsumer);
  run(["exec", "tsc", "--noEmit"], skinConsumer);
  execFileSync(process.execPath, ["ssr.mjs"], {
    cwd: skinConsumer,
    stdio: "inherit",
  });
  run(["exec", "vite", "build"], skinConsumer);
  const skinAssets = path.join(skinConsumer, "dist/assets");
  const skinCSS = fs
    .readdirSync(skinAssets)
    .filter((f) => f.endsWith(".css"))
    .map((f) => fs.readFileSync(path.join(skinAssets, f), "utf8"))
    .join("");
  assert.ok(
    skinCSS.includes("living-forest"),
    "Selected skin CSS must be present",
  );
  for (const other of [
    "retro-os",
    "winamp-signal",
    "studio-hardware",
    "prism-glass",
    "tactile-atelier",
  ])
    assert.ok(
      !skinCSS.includes(other),
      "Unselected skin CSS leaked into consumer",
    );
  assert.ok(
    !fs.readdirSync(skinAssets).some((f) => /\.(webp|png|jpg)$/.test(f)),
    "Procedural Forest must not bundle bitmap sprites",
  );
  assert.ok(!fs.existsSync(path.join(skinConsumer, "node_modules/motion")));
  const packedThemes = path.join(
    skinConsumer,
    "node_modules/@dixy-ui/themes/dist",
  );
  for (const row of JSON.parse(
    fs.readFileSync(path.join(packedThemes, "bytes.json"), "utf8"),
  ))
    assert.ok(row.gzipBytes <= 5120);
  const proceduralSkins = [
    ["retro-os", "RetroOrnament", "retro-inlay", "retroOSTheme"],
    ["winamp-signal", "SignalOrnament", "signal-rail", "winampSignalTheme"],
    [
      "studio-hardware",
      "HardwareOrnament",
      "hardware-registration",
      "studioHardwareTheme",
    ],
    ["prism-glass", "PrismOrnament", "prism-atmosphere", "prismGlassTheme"],
    [
      "tactile-atelier",
      "AtelierOrnament",
      "atelier-wood",
      "tactileAtelierTheme",
    ],
    ["ocean-depths", "OceanOrnament", "ocean-ornament", "oceanDepthsTheme"],
    ["candy-clay", "ClayOrnament", "clay-ornament", "candyClayTheme"],
    ["art-deco", "DecoOrnament", "deco-ornament", "artDecoTheme"],
    [
      "y2k-titanium",
      "TitaniumOrnament",
      "titanium-ornament",
      "y2kTitaniumTheme",
    ],
    ["material-light", "LightOrnament", "light-ornament", "materialLightTheme"],
    ["blueprint", "BlueprintOrnament", "blueprint-ornament", "blueprintTheme"],
    ["riso-zine", "RisoOrnament", "riso-ornament", "risoZineTheme"],
    [
      "neon-night-market",
      "NeonOrnament",
      "neon-ornament",
      "neonNightMarketTheme",
    ],
    ["sumi-ink", "SumiOrnament", "sumi-ornament", "sumiInkTheme"],
    [
      "tokyo-transit",
      "TransitOrnament",
      "transit-ornament",
      "tokyoTransitTheme",
    ],
    [
      "phosphor-terminal",
      "PhosphorOrnament",
      "phosphor-ornament",
      "phosphorTerminalTheme",
    ],
    ["ansi-panes", "AnsiOrnament", "ansi-ornament", "ansiPanesTheme"],
    ["swiss-poster", "SwissOrnament", "swiss-ornament", "swissPosterTheme"],
    ["azulejo-tile", "AzulejoOrnament", "azulejo-ornament", "azulejoTileTheme"],
    [
      "brutalist-concrete",
      "BrutalistOrnament",
      "brutalist-ornament",
      "brutalistConcreteTheme",
    ],
    ["atomic-lounge", "AtomicOrnament", "atomic-ornament", "atomicLoungeTheme"],
    ["orbital-hud", "HudOrnament", "hud-ornament", "orbitalHudTheme"],
    ["freighter", "FreighterOrnament", "freighter-ornament", "freighterTheme"],
    ["solar-sail", "SailOrnament", "sail-ornament", "solarSailTheme"],
    ["diwali-lights", "DiwaliOrnament", "diwali-ornament", "diwaliLightsTheme"],
    ["papel-picado", "PicadoOrnament", "picado-ornament", "papelPicadoTheme"],
    ["holi-colours", "HoliOrnament", "holi-ornament", "holiColoursTheme"],
    ["yule-knit", "YuleOrnament", "yule-ornament", "yuleKnitTheme"],
    ["glass-ui", "GlassOrnament", "glass-ornament", "glassUITheme"],
  ];
  const rendererPresent = (runtime, prefix) => {
    const token = prefix.split("-")[0];
    return (
      runtime.includes("dixy-" + prefix) ||
      ['"', "'", "`"].some((quote) =>
        runtime.includes("skin:" + quote + token + quote),
      )
    );
  };
  const skinEntry = ([slug, symbol, , settings]) => `
      import { createRoot } from "react-dom/client";
      import { Theme, Card, Button } from "@dixy-ui/react";
      import { ${settings} } from "@dixy-ui/themes/${slug}";
      import { ${symbol} } from "@dixy-ui/themes/${slug}/react";
      import "@dixy-ui/react/styles.css";
      import "@dixy-ui/themes/${slug}.css";
      createRoot(document.getElementById("root")!).render(
        <Theme {...${settings}} ornamentRenderer={${symbol}}><Card.Root><Button>Save</Button></Card.Root></Theme>
      );
    `;
  // Type-check every skin's entry in one tsc run: one module per skin, so
  // each still resolves its own subpath exports. One run per skin cost ~1s
  // each, the largest share of this script.
  const skinChecks = path.join(skinConsumer, "src/skin-checks");
  fs.mkdirSync(skinChecks);
  for (const skin of proceduralSkins)
    fs.writeFileSync(path.join(skinChecks, `${skin[0]}.tsx`), skinEntry(skin));
  run(["exec", "tsc", "--noEmit"], skinConsumer);
  fs.rmSync(skinChecks, { recursive: true });
  // Bundle each skin on its own to prove the others stay out.
  for (const skin of proceduralSkins) {
    const [slug, , prefix] = skin;
    fs.writeFileSync(path.join(skinConsumer, "src/main.tsx"), skinEntry(skin));
    run(["exec", "vite", "build"], skinConsumer);
    const files = fs.readdirSync(skinAssets);
    const styles = files
      .filter((f) => f.endsWith(".css"))
      .map((f) => fs.readFileSync(path.join(skinAssets, f), "utf8"))
      .join("");
    const runtime = files
      .filter((f) => f.endsWith(".js"))
      .map((f) => fs.readFileSync(path.join(skinAssets, f), "utf8"))
      .join("");
    assert.ok(styles.includes(slug));
    assert.ok(rendererPresent(runtime, prefix));
    assert.ok(!runtime.includes("dixy-forest-ornament"));
    assert.ok(
      !runtime.includes("Theme document exceeds 32 KiB"),
      "Authoring validator leaked into the static consumer",
    );
    assert.ok(
      !runtime.includes("Organic corner variation"),
      "Authoring schema leaked into the static consumer",
    );
    for (const [other, , otherPrefix] of proceduralSkins.filter(
      ([id]) => id !== slug,
    )) {
      assert.ok(!styles.includes(other), "Unselected CSS leaked into " + slug);
      assert.ok(
        !rendererPresent(runtime, otherPrefix),
        "Unselected renderer leaked into " + slug,
      );
    }
    assert.ok(
      !files.some((f) => /\.(webp|png|jpg|svg)$/.test(f)),
      "Procedural skins must not bundle sprite assets",
    );
  }
  console.log(
    "PASS: all eleven independently packed skins, declarations, SSR, procedural artwork and CSS/renderer exclusion.",
  );

  const tokensConsumer = path.join(temporary, "tokens-consumer");
  fs.cpSync(path.join(root, "fixtures/tokens-consumer"), tokensConsumer, {
    recursive: true,
  });
  const tokenManifestPath = path.join(tokensConsumer, "package.json");
  const tokenManifest = JSON.parse(fs.readFileSync(tokenManifestPath, "utf8"));
  tokenManifest.dependencies = { "@dixy-ui/tokens": `file:${tokensTarball}` };
  fs.writeFileSync(tokenManifestPath, JSON.stringify(tokenManifest, null, 2));
  run(["install", ...offline, "--store-dir", storeDirectory], tokensConsumer);
  run(["exec", "tsc", "--noEmit"], tokensConsumer);
  run(["exec", "vite", "build"], tokensConsumer);
  const standaloneCss = fs
    .readdirSync(path.join(tokensConsumer, "dist/assets"))
    .filter((file) => file.endsWith(".css"))
    .map((file) =>
      fs.readFileSync(path.join(tokensConsumer, "dist/assets", file), "utf8"),
    )
    .join("");
  assert.match(standaloneCss, /--dixy-color-purple-12/);
  assert.match(standaloneCss, /--dixy-color-text-on-action-primary/);
  assert.match(standaloneCss, /oklch\(/);
  assert.match(standaloneCss, /--dixy-font-body-md/);
  assert.match(standaloneCss, /--dixy-font-display-lg/);
  assert.match(standaloneCss, /--dixy-space-025/);
  assert.match(standaloneCss, /data-dixy-density/);
  assert.match(standaloneCss, /--dixy-size-target-comfortable/);
  assert.match(standaloneCss, /--dixy-container-xl/);
  assert.match(standaloneCss, /--dixy-layout-gutter/);
  assert.match(standaloneCss, /--dixy-radius-24/);
  assert.match(standaloneCss, /--dixy-border-strong/);
  assert.match(standaloneCss, /--dixy-shadow-floating/);
  assert.match(standaloneCss, /--dixy-motion-duration-normal/);
  assert.match(standaloneCss, /prefers-reduced-motion/);
  assert.ok(!fs.existsSync(path.join(tokensConsumer, "node_modules/react")));
  const entry = path.join(
    tokensConsumer,
    "node_modules/@dixy-ui/tokens/dist/index.js",
  );
  const {
    space,
    spacing,
    size,
    container,
    minWidth,
    radius,
    surfaceRadius,
    border,
    shadow,
  } = await import(entry);
  assert.equal(radius("12"), "var(--dixy-radius-12)");
  assert.equal(surfaceRadius("card"), "var(--dixy-radius-card)");
  assert.equal(border("strong"), "var(--dixy-border-strong)");
  assert.equal(shadow("overlay"), "var(--dixy-shadow-overlay)");
  assert.equal(size("control", "md"), "var(--dixy-size-control-md)");
  assert.equal(container("lg"), "var(--dixy-container-lg)");
  assert.equal(minWidth("lg"), "(min-width: 64rem)");
  assert.equal(space("200"), "var(--dixy-space-200)");
  assert.equal(spacing("stack", "md"), "var(--dixy-spacing-stack-md)");

  const { springTransition, tweenTransition } = await import(entry);
  assert.equal(tweenTransition("enter").duration, 0.2);
  assert.deepEqual(springTransition("standard", "spatial", "default", true), {
    type: "tween",
    duration: 0,
  });
  const motionConsumer = path.join(temporary, "motion-consumer");
  fs.cpSync(path.join(root, "fixtures/motion-consumer"), motionConsumer, {
    recursive: true,
  });
  const motionManifestPath = path.join(motionConsumer, "package.json");
  const motionManifest = JSON.parse(
    fs.readFileSync(motionManifestPath, "utf8"),
  );
  motionManifest.dependencies["@dixy-ui/react"] = `file:${tarball}`;
  motionManifest.dependencies["@dixy-ui/tokens"] = `file:${tokensTarball}`;
  fs.writeFileSync(motionManifestPath, JSON.stringify(motionManifest, null, 2));
  fs.copyFileSync(
    path.join(consumer, "pnpm-workspace.yaml"),
    path.join(motionConsumer, "pnpm-workspace.yaml"),
  );
  run(["install", ...offline, "--store-dir", storeDirectory], motionConsumer);
  run(["exec", "tsc", "--noEmit"], motionConsumer);
  execFileSync(process.execPath, ["ssr.mjs"], {
    cwd: motionConsumer,
    stdio: "inherit",
  });
  run(["exec", "vite", "build"], motionConsumer);
  const expressiveConsumer = path.join(temporary, "expressive-consumer");
  fs.cpSync(
    path.join(root, "fixtures/expressive-consumer"),
    expressiveConsumer,
    { recursive: true },
  );
  const expressiveManifestPath = path.join(expressiveConsumer, "package.json");
  const expressiveManifest = JSON.parse(
    fs.readFileSync(expressiveManifestPath, "utf8"),
  );
  expressiveManifest.dependencies["@dixy-ui/react"] = `file:${tarball}`;
  expressiveManifest.dependencies["@dixy-ui/tokens"] = `file:${tokensTarball}`;
  fs.writeFileSync(
    expressiveManifestPath,
    JSON.stringify(expressiveManifest, null, 2),
  );
  fs.copyFileSync(
    path.join(consumer, "pnpm-workspace.yaml"),
    path.join(expressiveConsumer, "pnpm-workspace.yaml"),
  );
  run(
    ["install", ...offline, "--store-dir", storeDirectory],
    expressiveConsumer,
  );
  run(["exec", "tsc", "--noEmit"], expressiveConsumer);
  execFileSync(process.execPath, ["ssr.mjs"], {
    cwd: expressiveConsumer,
    stdio: "inherit",
  });
  run(["exec", "vite", "build"], expressiveConsumer);
  const materialPackage = path.join(
    expressiveConsumer,
    "node_modules/@dixy-ui/react/dist",
  );
  const optionalCss = fs.readFileSync(
    path.join(materialPackage, "materials.css"),
    "utf8",
  );
  assert.ok(
    gzipSync(optionalCss).length <= 5120,
    "Material pack exceeds its 5 KiB gzip budget",
  );
  assert.match(optionalCss, /--dixy-material-paper-image/);
  assert.match(optionalCss, /dixy-switch-root\[data-material/);
  assert.match(optionalCss, /dixy-checkbox-root\[data-material/);
  assert.match(optionalCss, /dixy-tabs-indicator\[data-material/);
  assert.match(optionalCss, /dixy-radio-root\[data-material/);
  assert.match(optionalCss, /dixy-select-trigger/);
  assert.doesNotMatch(optionalCss, /backdrop-filter|url\(/);
  assert.match(
    fs.readFileSync(path.join(materialPackage, "backdrop-pilot.css"), "utf8"),
    /blur\(8px\)/,
  );
  assert.ok(
    !fs.existsSync(path.join(expressiveConsumer, "node_modules/motion")),
  );
  console.log(
    `Optional static material CSS: ${gzipSync(optionalCss).length} bytes gzip; no texture requests or Motion requirement.`,
  );
  const cliRequire = createRequire(
    fs.realpathSync(
      path.join(root, "node_modules/@tailwindcss/cli/package.json"),
    ),
  );
  const tailwindCore = path.join(
    path.dirname(cliRequire.resolve("tailwindcss/package.json")),
    "index.css",
  );
  const input = path.join(tokensConsumer, "tailwind-input.css");
  const output = path.join(tokensConsumer, "tailwind-output.css");
  fs.writeFileSync(
    input,
    `@import ${JSON.stringify(tailwindCore)};\n@import "@dixy-ui/tokens/tailwind.css";\n@source inline("bg-dixy-canvas bg-dixy-cyan-9 bg-dixy-white-a8 bg-dixy-overlay-strong bg-dixy-action-primary text-dixy-on-action-primary hover:bg-dixy-action-primary-hover active:bg-dixy-action-primary-pressed border-dixy-border-focus");\n`,
  );
  execFileSync(
    path.join(root, "node_modules/.bin/tailwindcss"),
    ["-i", input, "-o", output, "--minify"],
    { cwd: tokensConsumer, stdio: "inherit" },
  );
  const utilities = fs.readFileSync(output, "utf8");
  assert.match(utilities, /\.bg-dixy-action-primary/);
  assert.match(utilities, /background-color:var\(--dixy-color-white-a8\)/);
  assert.match(utilities, /background-color:var\(--dixy-color-cyan-9\)/);
  assert.match(
    utilities,
    /background-color:var\(--dixy-color-background-overlay-strong\)/,
  );
  assert.match(
    utilities,
    /background-color:var\(--dixy-color-background-action-primary\)/,
  );
  assert.match(utilities, /color:var\(--dixy-color-text-on-action-primary\)/);
  assert.match(utilities, /--dixy-color-background-action-primary-hover/);
  assert.match(utilities, /--dixy-color-background-action-primary-pressed/);
  console.log(
    "PASS: independent installation, declarations, ESM/SSR, browser builds and CSS exports, including standalone tokens, the optional Motion entry and compiled Tailwind v4 semantic utilities.",
  );
} finally {
  fs.rmSync(temporary, { recursive: true, force: true });
}
