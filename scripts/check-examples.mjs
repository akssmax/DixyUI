import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import {
  configureComparisonExample,
  configureExample,
} from "../apps/docs/src/lib/example-source.ts";
import { familyComparisons } from "../apps/docs/src/lib/comparison-layout.ts";
import { spacingExample } from "../apps/docs/src/lib/spacing-example.ts";
import { componentRegistry } from "../apps/docs/src/registry/components.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const configPath = path.join(root, "apps/docs/tsconfig.json");
const config = ts.readConfigFile(configPath, ts.sys.readFile);
const { options } = ts.parseJsonConfigFileContent(
  config.config,
  ts.sys,
  path.dirname(configPath),
  undefined,
  configPath,
);
process.chdir(path.dirname(configPath));
let count = 0;
let oldProgram;
const examples = [];
function queueExample(filename, code) {
  examples.push({
    filename: filename.replace(/\.tsx$/, `.case_${count++}.tsx`),
    code,
  });
}

// Validate against one built public contract even if another chat rebuilds dist.
const compiledFiles = new Map();
const compiledDirectories = new Set();
function snapshotDirectory(directory) {
  compiledDirectories.add(directory);
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) snapshotDirectory(filename);
    else if (entry.name.endsWith(".d.ts") || entry.name === "package.json") {
      compiledFiles.set(filename, fs.readFileSync(filename, "utf8"));
    }
  }
}
for (const name of ["react", "tokens"]) {
  const packageDirectory = path.join(root, "packages", name);
  snapshotDirectory(path.join(packageDirectory, "dist"));
  const manifest = path.join(packageDirectory, "package.json");
  compiledFiles.set(manifest, fs.readFileSync(manifest, "utf8"));
}
function createExampleHost() {
  const host = ts.createCompilerHost(options);
  const compiledPath = (file) => {
    const absolute = path.resolve(file);
    for (const name of ["react", "tokens"]) {
      const marker = `${path.sep}node_modules${path.sep}@dixy-ui${path.sep}${name}${path.sep}`;
      const offset = absolute.lastIndexOf(marker);
      if (offset !== -1) {
        return path.join(
          root,
          "packages",
          name,
          absolute.slice(offset + marker.length),
        );
      }
    }
    return absolute;
  };
  const readFile = host.readFile.bind(host);
  const fileExists = host.fileExists.bind(host);
  const directoryExists = host.directoryExists?.bind(host);
  host.readFile = (file) =>
    compiledFiles.get(compiledPath(file)) ?? readFile(file);
  host.fileExists = (file) =>
    compiledFiles.has(compiledPath(file)) || fileExists(file);
  host.directoryExists = (directory) =>
    compiledDirectories.has(compiledPath(directory)) ||
    Boolean(directoryExists?.(directory));
  return host;
}

for (const [slug, entry] of Object.entries(componentRegistry)) {
  const filename = path.join(root, `apps/docs/src/demos/${slug}-example.tsx`);
  const source = fs.readFileSync(filename, "utf8");
  const defaults = Object.fromEntries(
    entry.controls.map((control) => [control.name, control.initial]),
  );
  const states = [
    defaults,
    ...entry.controls.flatMap((control) =>
      (control.options ?? [false, true]).map((value) => ({
        ...defaults,
        [control.name]: value,
      })),
    ),
  ];
  const unique = [
    ...new Map(states.map((state) => [JSON.stringify(state), state])).values(),
  ];
  for (const state of unique) {
    const code = configureExample(source, state, {
      appearance: "dark",
      accentColor: "blue",
      radius: "lg",
    });
    queueExample(filename, code);
  }
  // The grouped card copies every sibling instance, not only one selected prop.
  if ("composition" in entry && !["checkbox", "switch", "tabs"].includes(slug))
    for (const comparison of familyComparisons(slug, entry.controls)) {
      const code = configureComparisonExample(source, slug, comparison, {
        appearance: "dark",
        accentColor: "blue",
        radius: "lg",
        density: "compact",
        motion: "reduced",
        dir: "rtl",
      });
      queueExample(filename, code);
    }
}
// Validate every complete spacing playground configuration against packed-style exports.
const spacingFilename = path.join(
  root,
  "apps/docs/src/demos/spacing-example.tsx",
);
for (const density of ["compact", "default", "comfortable"]) {
  for (const gap of ["sm", "md", "lg"]) {
    for (const rtl of [false, true]) {
      const code = spacingExample(density, gap, rtl);
      queueExample(spacingFilename, code);
    }
  }
}

// Every sizing/layout control combination comes from the actual rendered demo source.
const sizingFilename = path.join(
  root,
  "apps/docs/src/demos/sizing-layout-example.tsx",
);
const sizingSource = fs.readFileSync(sizingFilename, "utf8");
for (const controlSize of ["sm", "md", "lg"]) {
  for (const targetSize of ["minimum", "comfortable"]) {
    for (const density of ["compact", "default", "comfortable"]) {
      for (const containerSize of ["sm", "md", "lg", "xl"]) {
        for (const rtl of [false, true]) {
          const code = configureExample(
            sizingSource,
            { controlSize, targetSize, density, containerSize, rtl },
            { appearance: "dark", accentColor: "violet", radius: "md" },
          );
          queueExample(sizingFilename, code);
        }
      }
    }
  }
}

// Check every value in each independent surface control, plus all presets in both appearances.
const surfaceFilename = path.join(
  root,
  "apps/docs/src/demos/surface-example.tsx",
);
const surfaceSource = fs.readFileSync(surfaceFilename, "utf8");
const surfaceDefaults = {
  radiusPreset: "md",
  borderRole: "default",
  elevation: "raised",
  density: "default",
  rtl: false,
};
const surfaceStates = [
  surfaceDefaults,
  ...["none", "sm", "md", "lg", "full"].map((radiusPreset) => ({
    ...surfaceDefaults,
    radiusPreset,
  })),
  ...["subtle", "default", "strong", "danger"].map((borderRole) => ({
    ...surfaceDefaults,
    borderRole,
  })),
  ...["none", "inset", "raised", "floating", "overlay"].map((elevation) => ({
    ...surfaceDefaults,
    elevation,
  })),
  ...["compact", "comfortable"].map((density) => ({
    ...surfaceDefaults,
    density,
  })),
  { ...surfaceDefaults, rtl: true },
];
const uniqueSurfaceStates = [
  ...new Map(
    surfaceStates.map((state) => [JSON.stringify(state), state]),
  ).values(),
];
for (const state of uniqueSurfaceStates)
  for (const appearance of ["light", "dark"]) {
    const code = configureExample(surfaceSource, state, {
      appearance,
      accentColor: "blue",
      radius: "md",
    });
    queueExample(surfaceFilename, code);
  }

// Typecheck the actual Motion source for every independent control in both appearances.
const motionFilename = path.join(
  root,
  "apps/docs/src/demos/motion-example.tsx",
);
const motionSource = fs.readFileSync(motionFilename, "utf8");
const motionDefaults = {
  recipe: "retarget",
  scheme: "standard",
  speed: "default",
  kind: "spatial",
  reduceMotion: false,
  rtl: false,
};
const motionStates = [
  motionDefaults,
  ...["presence", "sequence"].map((recipe) => ({ ...motionDefaults, recipe })),
  { ...motionDefaults, scheme: "expressive" },
  ...["fast", "slow"].map((speed) => ({ ...motionDefaults, speed })),
  { ...motionDefaults, kind: "effects" },
  ...["retarget", "presence", "sequence"].map((recipe) => ({
    ...motionDefaults,
    recipe,
    reduceMotion: true,
  })),
  { ...motionDefaults, rtl: true },
];
for (const state of motionStates)
  for (const appearance of ["light", "dark"]) {
    const code = configureExample(motionSource, state, {
      appearance,
      accentColor: "blue",
      radius: "md",
    });
    queueExample(motionFilename, code);
  }
// Exercise the composed controls and copied source together, including physical edges.
const componentMotionFilename = path.join(
  root,
  "apps/docs/src/demos/component-motion-example.tsx",
);
const componentMotionSource = fs.readFileSync(componentMotionFilename, "utf8");
for (const drawerDirection of ["up", "down", "left", "right"])
  for (const reduceMotion of [false, true])
    for (const orientation of ["horizontal", "vertical"])
      for (const appearance of ["light", "dark"]) {
        const code = configureExample(
          componentMotionSource,
          {
            drawerDirection,
            reduceMotion,
            orientation,
            rtl: orientation === "vertical",
          },
          { appearance, accentColor: "blue", radius: "md" },
        );
        queueExample(componentMotionFilename, code);
      }

// Public expressive examples: each independent control and representative combinations.
const expressiveExamples = {
  material: [
    ...["matte", "glossy", "soft", "metal", "paper"].map((finish) => ({
      finish,
    })),
    ...["rounded", "pill", "square"].map((shape) => ({ shape })),
    ...["solid", "soft", "outline", "ghost"].map((emphasis) => ({ emphasis })),
    ...["accent", "neutral", "danger", "success"].map((tone) => ({ tone })),
    { effects: "reduced", reduceMotion: true, rtl: true },
    { disabled: true },
    { loading: true },
  ],
  shape: [
    ...["rounded", "pill", "square"].map((geometry) => ({ geometry })),
    ...["flower", "clover", "arch", "cut"].map((silhouette) => ({
      silhouette,
      rtl: true,
    })),
  ],
  personality: [
    ...["restrained", "playful", "tactile"].map((personality) => ({
      personality,
    })),
    {
      personality: "playful",
      reduceMotion: true,
      reduceEffects: true,
      rtl: true,
    },
  ],
  feedback: [
    { enabled: false },
    { enabled: true },
    { enabled: true, reduceMotion: true },
    { enabled: true, reduceEffects: true },
  ],
  "expressive-group": [
    { enabled: false },
    { enabled: true },
    { enabled: true, reduceMotion: true },
    { enabled: true, rtl: true },
  ],
};
for (const [name, states] of Object.entries(expressiveExamples)) {
  const filename = path.join(root, `apps/docs/src/demos/${name}-example.tsx`);
  const source = fs.readFileSync(filename, "utf8");
  for (const state of states)
    for (const appearance of ["light", "dark"]) {
      const code = configureExample(source, state, {
        appearance,
        accentColor: "blue",
        radius: "md",
      });
      queueExample(filename, code);
    }
}
// Complete comparison exports, including their shared Theme wrapper.
for (const [family, names] of Object.entries({
  switch: ["sizes", "variants", "colors", "icons", "radii", "materials"],
  tabs: [
    "variants",
    "sizes",
    "colors",
    "icons",
    "radii",
    "materials",
    "orientation",
    "overflow",
  ],
  checkbox: [
    "sizes",
    "variants",
    "colors",
    "indicators",
    "radii",
    "materials",
    "states",
    "group",
    "validation",
  ],
}))
  for (const name of names) {
    const filename = path.join(
      root,
      `apps/docs/src/demos/${family}-${name}-comparison.tsx`,
    );
    const source = fs.readFileSync(filename, "utf8");
    for (const appearance of ["light", "dark"])
      for (const motion of ["system", "reduced"]) {
        const code = configureExample(
          source,
          {},
          { appearance, accentColor: "blue", radius: "md", motion, dir: "rtl" },
        );
        queueExample(filename, code);
      }
  }

// Share the declaration graph within bounded batches instead of rebuilding it per example.
// Every complete example remains a separate TSX module checked against the same snapshot.
// Measured with 1,624 examples: batches of 16 took 40s and peaked at 1.9 GB,
// because each program keeps its predecessor alive through oldProgram;
// batches of 1,024 take 5s and peak at 1.2 GB.
const batchSize = 1024;
for (let offset = 0; offset < examples.length; offset += batchSize) {
  const files = new Map(
    examples
      .slice(offset, offset + batchSize)
      .map((example) => [example.filename, example.code]),
  );
  const host = createExampleHost();
  const originalSource = host.getSourceFile.bind(host);
  const originalRead = host.readFile.bind(host);
  const originalExists = host.fileExists.bind(host);
  host.readFile = (file) => files.get(path.resolve(file)) ?? originalRead(file);
  host.fileExists = (file) =>
    files.has(path.resolve(file)) || originalExists(file);
  host.getSourceFile = (file, version, onError, fresh) =>
    files.has(path.resolve(file))
      ? ts.createSourceFile(
          file,
          files.get(path.resolve(file)),
          version,
          true,
          ts.ScriptKind.TSX,
        )
      : originalSource(file, version, onError, fresh);
  const program = ts.createProgram({
    rootNames: [...files.keys()],
    options,
    host,
    oldProgram,
  });
  const errors = ts.getPreEmitDiagnostics(program);
  if (errors.length) {
    console.error(
      ts.formatDiagnosticsWithColorAndContext(errors, {
        getCurrentDirectory: () => root,
        getCanonicalFileName: (file) => file,
        getNewLine: () => "\n",
      }),
    );
    process.exit(1);
  }
  oldProgram = program;
  if (offset && offset % 256 === 0)
    console.log(
      `Validated ${Math.min(offset + batchSize, examples.length)}/${examples.length} complete examples.`,
    );
}

console.log(
  `Typechecked ${count} complete generated examples against the public package.`,
);
