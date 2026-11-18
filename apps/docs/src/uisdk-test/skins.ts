import type { AccentColor, Material } from "@dixy-ui/tokens";

/**
 * Player skins are Dixy accents; finishes are Dixy materials. `appearance`
 * pins the player windows, as the originals looked the same in any OS theme:
 * Modern is the silver Winamp 5 skin, Classic the black 2.x base skin.
 */
export const skins: {
  id: string;
  name: string;
  accent: AccentColor;
  appearance?: "light" | "dark";
}[] = [
  { id: "modern", name: "Modern", accent: "blue", appearance: "light" },
  { id: "classic", name: "Classic", accent: "green", appearance: "dark" },
  { id: "ocean", name: "Ocean", accent: "blue" },
  { id: "phosphor", name: "Phosphor", accent: "green" },
  { id: "amber", name: "Amber", accent: "amber" },
  { id: "plum", name: "Plum", accent: "plum" },
];
export const materials: Material[] = ["bevel", "glossy", "metal", "matte"];
