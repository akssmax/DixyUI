// Bundles tiny consumers of the built @dixy-ui/react and fails when an import
// pulls in heavy dependencies it does not use. Run after the package build.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const reactPackage = path.join(root, "packages/react");
// Use the library's own Vite, so dependency resolution matches a consumer install.
const { build } = await import(
  createRequire(path.join(reactPackage, "package.json")).resolve("vite")
);
const entry = path.join(reactPackage, "dist/dixy.js");
if (!fs.existsSync(entry))
  throw new Error("Build @dixy-ui/react before checking tree shaking.");

const forbiddenForCore = [
  "react-aria-components",
  "react-aria",
  "@react-aria",
  "react-stately",
  "@react-stately",
  "@internationalized/date",
  "motion",
  "framer-motion",
];
// Budgets are minified KiB, React excluded, with headroom over the measured
// size (17, 140 and 44 KiB on 2026-11-08). Raise one only on purpose.
const cases = [
  {
    name: "Button only",
    source: "export { Button } from 'dixy';",
    budgetKiB: 30,
  },
  {
    name: "Theme + Field + TextField + Dialog",
    source: "export { Theme, Field, TextField, Dialog } from 'dixy';",
    budgetKiB: 170,
  },
  {
    name: "Navbar + Snippet + DataList",
    source: "export { Navbar, Snippet, DataList } from 'dixy';",
    budgetKiB: 60,
  },
];

const directory = fs.mkdtempSync(path.join(os.tmpdir(), "dixy-shake-"));
const sizes = [];
let failed = false;
try {
  for (const testCase of cases) {
    const file = path.join(directory, "entry.js");
    fs.writeFileSync(file, testCase.source);
    const result = await build({
      configFile: false,
      logLevel: "silent",
      root: directory,
      resolve: { alias: { dixy: entry } },
      build: {
        write: false,
        minify: true,
        lib: { entry: file, formats: ["es"], fileName: "out" },
        rollupOptions: {
          external: ["react", "react-dom", /^react\//, /^react-dom\//],
        },
      },
    });
    const output = (Array.isArray(result) ? result[0] : result).output;
    const chunks = output.filter((item) => item.type === "chunk");
    const included = new Set();
    let bytes = 0;
    for (const chunk of chunks) {
      bytes += Buffer.byteLength(chunk.code);
      for (const [id, info] of Object.entries(chunk.modules ?? {}))
        if (info.renderedLength > 0) included.add(id);
    }
    const leaks = forbiddenForCore.filter((name) =>
      [...included].some((id) => id.includes(`/node_modules/${name}/`)),
    );
    const kib = bytes / 1024;
    sizes.push(
      `${testCase.name}: ${kib.toFixed(1)} KiB minified (budget ${testCase.budgetKiB})`,
    );
    if (kib > testCase.budgetKiB) {
      failed = true;
      console.error(
        `FAIL: ${testCase.name} is ${kib.toFixed(1)} KiB, over its ${testCase.budgetKiB} KiB budget.`,
      );
    }
    if (included.size === 0)
      throw new Error("The bundler reported no module information.");
    if (leaks.length) {
      failed = true;
      console.error(
        `FAIL: ${testCase.name} includes ${leaks.join(", ")}, which it does not use.`,
      );
    }
  }
} finally {
  fs.rmSync(directory, { recursive: true, force: true });
}
for (const line of sizes) console.log(line);
if (failed) process.exit(1);
console.log(
  "PASS: core imports exclude React Aria, @internationalized/date and Motion, within size budgets.",
);
