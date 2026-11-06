import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rolldownOptions: {
      onwarn(warning, warn) {
        // This fixture is a client application, so React Server Component
        // boundaries are intentionally irrelevant to its browser bundle.
        if (
          warning.code === "MODULE_LEVEL_DIRECTIVE" &&
          warning.message.includes("use client")
        )
          return;
        warn(warning);
      },
    },
  },
});
