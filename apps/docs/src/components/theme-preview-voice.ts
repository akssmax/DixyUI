import { createContext, useContext } from "react";
import { skinCatalog } from "../lib/theme-playground";

export interface PreviewVoice {
  eyebrow: string;
  headline: string;
  body: string;
  primary: string;
  secondary: string;
}

export const defaultVoice: PreviewVoice = {
  eyebrow: "YOUR COMPONENTS, YOUR CHARACTER",
  headline: "Make something playful.",
  body: "A little character in every interaction.",
  primary: "Explore",
  secondary: "Save changes",
};

/** Sample copy written for each starter's personality; custom and Original themes use the default. */
export function previewVoice(skin: string): PreviewVoice {
  return skinCatalog.find((entry) => entry.id === skin)?.voice ?? defaultVoice;
}

export const PreviewVoiceContext = createContext<PreviewVoice>(defaultVoice);
export const usePreviewVoice = () => useContext(PreviewVoiceContext);
