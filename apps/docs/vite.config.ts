import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";

export default defineConfig({
  plugins: [
    { ...mdx({ remarkPlugins: [remarkGfm] }), enforce: "pre" },
    tanstackStart(),
    react({ include: /\.(jsx|tsx|mdx)$/ }),
  ],
  resolve: { dedupe: ["react", "react-dom"] },
});
