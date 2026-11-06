import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import tsx from "shiki/langs/tsx.mjs";
import css from "shiki/langs/css.mjs";
import shell from "shiki/langs/shellscript.mjs";
import json from "shiki/langs/json.mjs";
import light from "shiki/themes/github-light.mjs";
import dark from "shiki/themes/github-dark.mjs";

function luminance(hex: string) {
  const channels = [1, 3, 5].map(
    (index) => parseInt(hex.slice(index, index + 2), 16) / 255,
  );
  const linear = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return linear[0]! * 0.2126 + linear[1]! * 0.7152 + linear[2]! * 0.0722;
}

// Syntax themes also need contrast against our actual documentation surface.
function readableLightColor(
  foreground: string | undefined,
  background = "#f7f5f1",
) {
  if (
    !foreground ||
    !/^#[\da-f]{6}$/i.test(foreground) ||
    !/^#[\da-f]{6}$/i.test(background)
  )
    return foreground;
  let color = foreground;
  for (let step = 0; step < 30; step++) {
    const a = luminance(color);
    const b = luminance(background);
    if ((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) >= 4.7) break;
    color = `#${[1, 3, 5]
      .map((index) =>
        Math.round(parseInt(color.slice(index, index + 2), 16) * 0.9)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")}`;
  }
  return color;
}

const accessibleLight = {
  ...light,
  name: "dixy-light",
  tokenColors: light.tokenColors?.map((token) => ({
    ...token,
    settings: {
      ...token.settings,
      foreground: readableLightColor(
        token.settings.foreground,
        token.settings.background,
      ),
    },
  })),
};

const highlighter = createHighlighterCore({
  langs: [tsx, css, shell, json],
  themes: [accessibleLight, dark],
  engine: createJavaScriptRegexEngine(),
});
const cache = new Map<string, string>();

export async function highlight(code: string, language: string) {
  const key = `${language}:${code}`;
  const cached = cache.get(key);
  if (cached) return cached;
  const result = (await highlighter).codeToHtml(code, {
    lang: language,
    themes: { light: "dixy-light", dark: "github-dark" },
    defaultColor: false,
    transformers: [
      {
        pre(node) {
          node.properties.tabIndex = 0;
          node.properties["aria-label"] = "Code example";
        },
      },
    ],
  });
  if (cache.size >= 40) cache.delete(cache.keys().next().value!);
  cache.set(key, result);
  return result;
}
