import { useCallback, useSyncExternalStore } from "react";
import { skinCatalog } from "@dixy-ui/themes/catalog";
import { themeFontPackages } from "@dixy-ui/themes/foundations";

/** Package managers the docs show install commands for. pnpm is the default. */
export const packageManagers = ["pnpm", "npm", "yarn", "bun"] as const;
export type PackageManager = (typeof packageManagers)[number];

/** Published on npm under the beta dist-tag. */
export const dixyPackages = ["@dixy-ui/react@beta", "@dixy-ui/themes@beta"];

export const siteUrl = "https://dixyui.com";

/** `pnpm add a b`, `npm install a b`, `yarn add a b`, `bun add a b`. */
export function installCommand(
  manager: PackageManager,
  packages: readonly string[] = dixyPackages,
) {
  const verb = manager === "npm" ? "install" : "add";
  return `${manager} ${verb} ${packages.join(" ")}`;
}

/**
 * The @fontsource packages a starter's body and heading fonts come from.
 * Themes name their fonts but don't bundle them, so apps install these.
 * Empty for system-font themes.
 */
export function fontPackages(slug: string): string[] {
  const skin = skinCatalog.find((entry) => entry.slug === slug);
  if (!skin) return [];
  const names = [skin.bodyFont, skin.headingFont] as const;
  return [
    ...new Set(
      names
        .map(
          (font) => themeFontPackages[font as keyof typeof themeFontPackages],
        )
        .filter((pkg): pkg is string => Boolean(pkg)),
    ),
  ];
}

/** The theme a prompt should use: its package slug and catalog symbol. */
export type PromptTheme = { slug: string; symbol: string; name: string };

/**
 * Instructions for a coding agent (Claude Code, Cursor, Codex…) to set Dixy up
 * in an existing React app. Kept short and specific: what to install, the two
 * imports that must happen once, and the rules that keep components accessible.
 */
export function agentPrompt(
  manager: PackageManager,
  theme: PromptTheme = { slug: "signal", symbol: "signal", name: "Signal" },
) {
  const settings = `${theme.symbol}Theme`;
  const fonts = fontPackages(theme.slug);
  const fontStep = fonts.length
    ? `
3. Load the theme's fonts (themes name them but don't bundle them):
   ${installCommand(manager, fonts)}
${fonts.map((pkg) => `   import "${pkg}";`).join("\n")}`
    : "";
  const n = fonts.length ? 1 : 0;
  return `Set up Dixy UI (React component library, public beta) in this project.

1. Install: ${installCommand(manager)}
   Peer dependencies: react and react-dom 19.
2. At the app root, import the stylesheets once, library first:
   import "@dixy-ui/react/styles.css";
   import "@dixy-ui/themes/${theme.slug}.css";
   If the project uses Tailwind CSS v4, import them from the main CSS file
   instead, after a layer order that puts Dixy above Tailwind's reset:
   @layer theme, base, dixy, components, utilities;
   @import "tailwindcss";
   @import "@dixy-ui/react/styles.css";
   @import "@dixy-ui/themes/${theme.slug}.css";${fontStep}
${3 + n}. Wrap the app in Theme with the ${theme.name} theme settings:
   import { Theme } from "@dixy-ui/react";
   import { ${settings} } from "@dixy-ui/themes/${theme.slug}";
   <Theme {...${settings}}>{children}</Theme>
${4 + n}. Give the layout root \`isolation: isolate\` and keep \`body\` position: relative, so dialogs and popovers layer correctly.

Rules:
- Import only from public entry points (@dixy-ui/react, @dixy-ui/themes/<slug>), never from src or dist paths.
- Compose with the components' parts (for example Tabs.Root, Tabs.List, Tabs.Tab) instead of rebuilding them from divs.
- Don't restyle component internals. Use Theme props (accentColor, radius, appearance) or your own CSS layered after Dixy's.
- Keep accessible names: every IconButton needs aria-label; every form control needs a label.
- Don't hard-code colours. Use Dixy's CSS variables (for example var(--dixy-color-text-primary)).

Docs: ${siteUrl}/docs/installation
Themes: ${siteUrl}/#themes`;
}

/* The chosen manager is shared by every install block on the page and kept
   per visitor. Storage can be blocked, so every read and write is guarded. */
const storageKey = "dixy-package-manager";
const listeners = new Set<() => void>();
let current: PackageManager | null = null;

function read(): PackageManager {
  if (current) return current;
  try {
    const saved = window.localStorage.getItem(storageKey);
    if (packageManagers.includes(saved as PackageManager))
      current = saved as PackageManager;
  } catch {
    /* storage blocked */
  }
  return current ?? "pnpm";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function usePackageManager() {
  const manager = useSyncExternalStore(subscribe, read, () => "pnpm" as const);
  const setManager = useCallback((next: PackageManager) => {
    current = next;
    try {
      window.localStorage.setItem(storageKey, next);
    } catch {
      /* storage blocked: the choice lasts for this page */
    }
    listeners.forEach((listener) => listener());
  }, []);
  return [manager, setManager] as const;
}
