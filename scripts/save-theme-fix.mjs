// Patch one built-in theme, then rebuild @dixy-ui/themes so the docs app
// (and the theme audit) pick it up. Fixes live in
// packages/themes/src/theme-fixes.ts as the smallest patch over the starter.
//
//   pnpm themes:fix dixy/riso-zine '{"foundations":{"neutralColor":"slate"}}'
//   pnpm themes:fix dixy/riso-zine --reset      # back to starter values
//   pnpm themes:fix --list                       # print every saved fix
//   pnpm themes:fix dixy/riso-zine --show        # starter, fix and result
//
// A patch merges into the theme's current fix (objects key by key; other
// values replace). The result is validated by the theme schema before saving.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { format } from "prettier";
import { starterDocuments } from "../packages/themes/src/documents.ts";
import { themeFixes } from "../packages/themes/src/theme-fixes.ts";
import {
  applyThemeFix,
  diffThemeDocument,
} from "../packages/themes/src/theme-fix.ts";
import { parseThemeDocument } from "../packages/themes/src/theme-schema.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fixesFile = path.join(root, "packages/themes/src/theme-fixes.ts");
const [target, arg] = process.argv.slice(2);
const print = (value) => console.log(JSON.stringify(value, null, 2));

if (target === "--list") {
  print(themeFixes);
  process.exit(0);
}
const starter = starterDocuments.find(
  (d) => d.id === target || d.id === `dixy/${target}`,
);
if (!starter) {
  console.error(
    `Unknown theme "${target}". Built-in themes:\n  ` +
      starterDocuments.map((d) => d.id).join("\n  "),
  );
  process.exit(1);
}
const current = themeFixes[starter.id];
if (arg === "--show") {
  print({
    id: starter.id,
    fix: current ?? null,
    result: applyThemeFix(starter, current),
  });
  process.exit(0);
}

let fix;
if (arg === "--reset") fix = undefined;
else {
  let patch;
  try {
    patch = JSON.parse(arg ?? "");
  } catch {
    console.error("Pass a JSON patch, --reset or --show after the theme id.");
    process.exit(1);
  }
  // Keep the starter's identity whatever the patch says.
  const next = parseThemeDocument({
    ...applyThemeFix(applyThemeFix(starter, current), patch),
    id: starter.id,
    name: starter.name,
    schemaVersion: starter.schemaVersion,
  });
  fix = diffThemeDocument(starter, next);
}

const fixes = { ...themeFixes };
if (fix) fixes[starter.id] = fix;
else delete fixes[starter.id];
const sorted = Object.fromEntries(
  Object.entries(fixes).sort(([a], [b]) => a.localeCompare(b)),
);
fs.writeFileSync(
  fixesFile,
  await format(
    `// Written by scripts/save-theme-fix.mjs (pnpm themes:fix). Each entry
// patches one starter in documents.ts; run \`pnpm themes:fix <id> --reset\`
// to return that theme to its starter values.
import type { ThemeFix } from "./theme-fix.ts";

export const themeFixes: Readonly<Record<string, ThemeFix>> = ${JSON.stringify(sorted)};
`,
    { parser: "typescript" },
  ),
);

// Regenerate skins and rebuild dist, which the docs app consumes.
execFileSync("pnpm", ["--filter", "@dixy-ui/themes", "build"], {
  cwd: root,
  stdio: ["ignore", "ignore", "inherit"],
});
print({ id: starter.id, fix: fix ?? null });
