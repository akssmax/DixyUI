import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";

// Emit optional CSS as separate assets; importing the core never loads these recipes.
const optionalStyles = () => ({
  name: "dixy-optional-styles",
  buildStart(this: { addWatchFile: (path: string) => void }) {
    for (const name of ["materials", "backdrop-pilot", "ai"])
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
    for (const name of ["materials", "backdrop-pilot", "ai"]) {
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
        ai: "src/ai.tsx",
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
        /^react-markdown(?:\/|$)/,
        /^remark-gfm(?:\/|$)/,
      ],
    },
  },
}));
