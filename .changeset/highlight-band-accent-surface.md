---
"@dixy-ui/react": minor
"@dixy-ui/themes": minor
---

Add an option highlight and an accent surface.

- `Theme highlight="tint" | "band"`: `band` marks highlighted and selected list options (Menu, Select, Combobox, Autocomplete, ListBox) with a full-ink band. The portal scope carries it, so popups follow. One token pair, `--dixy-highlight-band` / `--dixy-highlight-on-band`, is read before each item's own tint.
- `Box surface="accent"`: paints the Box with the brand solid and remaps text, border, skin, material, button and highlight tokens so Dixy parts inside stay legible, in light and dark.
- Themes: new `character.details.highlight` (schema version 7; v6 documents migrate to `tint`, which changes nothing). It compiles to the `highlight` Theme prop, not skin CSS. Swiss Poster, Brutalist Concrete, Tokyo Transit, Riso Zine, Freighter and Signal now use `band`.
- Themes: Retro OS, Mainframe, Save Point, Arcade Cabinet and ANSI Panes default to the `bevel` material.
- Themes: catalog `voice.display` adds large-type starter content (a word or numeral in a fluid display role) for 12 serif and numeral starters.
