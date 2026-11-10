// Written by scripts/save-theme-fix.mjs (pnpm themes:fix). Each entry
// patches one starter in documents.ts; run `pnpm themes:fix <id> --reset`
// to return that theme to its starter values.
import type { ThemeFix } from "./theme-fix.ts";

export const themeFixes: Readonly<Record<string, ThemeFix>> = {};
