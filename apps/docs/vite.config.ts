import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";

/**
 * Dev server only: the theme audit page (/lab/theme-audit) posts its report
 * here, and it is written to .dixy/theme-audit.json so an agent can read the
 * findings without a browser. Only same-origin JSON posts are accepted.
 */
function themeAuditReport(): Plugin {
  const file = path.resolve(
    import.meta.dirname,
    "../../.dixy/theme-audit.json",
  );
  return {
    name: "dixy-theme-audit-report",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/__dixy/theme-audit", (req, res) => {
        const host = req.headers.host;
        const origin = req.headers.origin;
        if (
          req.method !== "POST" ||
          !req.headers["content-type"]?.startsWith("application/json") ||
          !host ||
          (origin && new URL(origin).host !== host)
        ) {
          res.statusCode = 403;
          res.end();
          return;
        }
        let body = "";
        req.setEncoding("utf8");
        req.on("data", (chunk: string) => {
          body += chunk;
          if (body.length > 2_000_000) req.destroy();
        });
        req.on("end", () => {
          try {
            const report = JSON.parse(body);
            fs.mkdirSync(path.dirname(file), { recursive: true });
            fs.writeFileSync(file, JSON.stringify(report, null, 2) + "\n");
            res.setHeader("content-type", "application/json");
            res.end(JSON.stringify({ file: ".dixy/theme-audit.json" }));
          } catch {
            res.statusCode = 400;
            res.end();
          }
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [
    themeAuditReport(),
    // Builds and runs the SSR environment as a Cloudflare Worker (wrangler.jsonc).
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    // Only .mdx is content. Plain .md (package changelogs) loads as ?raw text.
    {
      ...mdx({ remarkPlugins: [remarkGfm], mdExtensions: [] }),
      enforce: "pre",
    },
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
