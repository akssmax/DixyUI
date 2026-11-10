import { defineConfig } from "vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";

export default defineConfig({
  plugins: [
    // Builds and runs the SSR environment as a Cloudflare Worker (wrangler.jsonc).
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    { ...mdx({ remarkPlugins: [remarkGfm] }), enforce: "pre" },
    tanstackStart(),
    react({ include: /\.(jsx|tsx|mdx)$/ }),
  ],
  resolve: { dedupe: ["react", "react-dom"] },
  environments: {
    client: {
      build: {
        rolldownOptions: {
          output: {
            codeSplitting: {
              groups: [
                {
                  // @dixy-ui/react ships one module per component, so each
                  // page loads only what it renders. Modules most chunks
                  // share (Theme, Button, Text, floating-ui…) would otherwise
                  // arrive as dozens of tiny requests; keep those together.
                  name: "dixy-common",
                  test: (id: string) =>
                    !id.endsWith(".css") &&
                    /[\\/](packages[\\/]react[\\/]dist|node_modules[\\/](@base-ui|@floating-ui|tabbable|reselect|use-sync-external-store))[\\/]/.test(
                      id,
                    ),
                  // Measured 4, 15, 40 and unset: 15 kept /docs/installation at 14 requests
                  // (vs 92 with no group) without regrowing a site-wide chunk.
                  minShareCount: 15,
                },
              ],
            },
          },
        },
      },
    },
  },
});
