import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";

// Emit optional CSS as separate assets; importing the core never loads these recipes.
const optionalStyles = () => ({
  name: "dixy-optional-styles",
  buildStart(this: { addWatchFile: (path: string) => void }) {
    for (const name of ["materials", "backdrop-pilot"])
      this.addWatchFile(
        new URL(`./src/styles/${name}.css`, import.meta.url).pathname,
      );
  },
  generateBundle(this: {
    emitFile: (asset: {
      type: "asset";
      fileName: string;
      source: string;
    }) => void;
  }) {
    for (const name of ["materials", "backdrop-pilot"]) {
      this.emitFile({
        type: "asset",
        fileName: `${name}.css`,
        source: fs.readFileSync(
          new URL(`./src/styles/${name}.css`, import.meta.url),
          "utf8",
        ),
      });
    }
  },
});

export default defineConfig(({ mode }) => ({
  plugins: [react(), optionalStyles()],
  build: {
    lib: {
      entry: {
        dixy: "src/build.ts",
        motion: "src/motion.tsx",
        feedback: "src/feedback.tsx",
      },
      formats: ["es"],
      fileName: (_format, name) => `${name}.js`,
      cssFileName: "styles",
    },
    sourcemap: true,
    minify: false,
    // Rebuild JS/CSS without deleting the concurrently watched declarations.
    emptyOutDir: mode !== "development",
    rolldownOptions: {
      external: [
        /^react(?:\/|$)/,
        /^react-dom(?:\/|$)/,
        /^@base-ui\/react(?:\/|$)/,
        /^motion(?:\/|$)/,
        /^react-aria-components(?:\/|$)/,
        /^@internationalized\/date(?:\/|$)/,
      ],
      // One file per source module, not one flat dixy.js. A consumer's
      // bundler splits chunks by module, so a single file put every component
      // (and all of Base UI and react-aria behind them) in one shared chunk on
      // every page. Separate modules let each page load only what it renders.
      output: { preserveModules: true, preserveModulesRoot: "src" },
    },
  },
}));
