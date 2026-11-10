import assert from "node:assert/strict";
import test from "node:test";
import {
  colorFamilies,
  neutralColorFamilies,
  overlayFamilies,
  overlayAlpha,
  toOverlayColor,
  overlayColor,
  colorSteps,
  colorPalettes,
  semanticColors,
  resolveColor,
  actionColors,
  focusColor,
  contrastRatio,
  isInSrgb,
  toOklch,
  createColorPalette,
  colorThemeVariables,
  color,
  semanticColor,
} from "../dist/index.js";
const modes = ["light", "dark"];
const minimum = (fg, bg, ratio, label) =>
  assert.ok(
    contrastRatio(fg, bg) >= ratio,
    `${label}: ${contrastRatio(fg, bg).toFixed(3)} < ${ratio}`,
  );

test("39 complete 12-stop palettes have independent, sRGB-safe light and dark ramps", () => {
  assert.equal(colorFamilies.length, 39);
  assert.equal(neutralColorFamilies.length, 11);
  for (const family of colorFamilies) {
    assert.notDeepEqual(
      Object.values(colorPalettes[family].light).reverse(),
      Object.values(colorPalettes[family].dark),
    );
    for (const mode of modes) {
      assert.deepEqual(
        Object.keys(colorPalettes[family][mode]).map(Number),
        colorSteps,
      );
      for (const step of colorSteps) {
        const value = colorPalettes[family][mode][step];
        assert.ok(isInSrgb(value), `${family}/${mode}/${step}`);
        const emitted = toOklch(value).slice(6, -1).split(" ").map(Number);
        // Serialization must preserve gamut; allow only numerical rounding error.
        assert.ok(isInSrgb(emitted), `serialized ${family}/${mode}/${step}`);
      }
    }
  }
});

test("every action foreground passes across default, hover and pressed states", () => {
  for (const mode of modes)
    for (const family of colorFamilies) {
      const action = actionColors(colorPalettes[family][mode], mode);
      for (const state of ["background", "hover", "pressed"])
        minimum(
          action.foreground,
          action[state],
          4.5,
          `${family}/${mode}/${state}`,
        );
    }
});

test("readable surface, soft-action, selection and feedback pairs meet their contracts", () => {
  for (const mode of modes)
    for (const accent of colorFamilies)
      for (const neutral of neutralColorFamilies) {
        const get = (role) =>
          resolveColor(semanticColors[role][mode], mode, accent, neutral);
        for (const surface of [
          "background.canvas",
          "background.surface",
          "background.surface.raised",
          "background.surface.sunken",
          "background.subtle",
        ]) {
          for (const text of [
            "text.primary",
            "text.secondary",
            "text.tertiary",
            "text.link",
            "icon.primary",
            "icon.secondary",
          ])
            minimum(
              get(text),
              get(surface),
              4.5,
              `${mode}/${accent}/${text}/${surface}`,
            );
          minimum(
            get("border.focus"),
            get(surface),
            3,
            `${mode}/${accent}/focus/${surface}`,
          );
          minimum(
            get("border.default"),
            get(surface),
            3,
            `${mode}/${accent}/input/${surface}`,
          );
          minimum(
            get("border.danger"),
            get(surface),
            3,
            `${mode}/${accent}/invalid/${surface}`,
          );
        }
        minimum(
          get("text.inverse"),
          get("background.inverse"),
          4.5,
          `${mode}/inverse`,
        );
        minimum(
          get("text.selected"),
          get("background.selected"),
          4.5,
          `${mode}/selected`,
        );
        for (const intent of ["primary", "secondary", "destructive", "success"])
          for (const state of ["", ".hover", ".pressed"])
            minimum(
              get(`text.action.${intent}`),
              get(`background.action.${intent}.subtle${state}`),
              4.5,
              `${mode}/${intent}/subtle${state}`,
            );
        for (const status of [
          "success",
          "danger",
          "warning",
          "information",
          "discovery",
        ]) {
          minimum(
            get(`text.${status}`),
            get(`background.${status}`),
            4.5,
            `${mode}/${status}/subtle`,
          );
          minimum(
            get(`text.on.${status}`),
            get(`background.${status}.bold`),
            4.5,
            `${mode}/${status}/bold`,
          );
        }
      }
});

test("brand changes cannot recolor destructive actions or status roles", () => {
  for (const mode of modes)
    for (const role of [
      "background.action.destructive",
      "text.on.action.destructive",
      "text.danger",
      "background.success",
      "text.warning",
      "icon.information",
    ]) {
      const values = colorFamilies.map((accent) =>
        resolveColor(semanticColors[role][mode], mode, accent),
      );
      values.forEach((value) => assert.deepEqual(value, values[0]));
    }
});

test("custom seeds are deterministic, gamut-mapped and reject invalid input", () => {
  for (const seed of [
    [0.54, 0.18, 260],
    [0.8, 0.16, 85],
    [0.54, 0.35, 295],
  ]) {
    const palette = createColorPalette(seed);
    assert.deepEqual(palette, createColorPalette(seed));
    for (const mode of modes) {
      for (const value of Object.values(palette[mode]))
        assert.ok(isInSrgb(value));
      const action = actionColors(palette[mode], mode);
      for (const state of ["background", "hover", "pressed"])
        minimum(
          action.foreground,
          action[state],
          4.5,
          `custom/${mode}/${state}`,
        );
      assert.equal(Object.keys(colorThemeVariables(palette, mode)).length, 15);
    }
  }
  for (const seed of [
    [NaN, 0.1, 260],
    [-1, 0.1, 260],
    [0.5, -0.1, 260],
    [0.5, 0.41, 260],
  ])
    assert.throws(() => createColorPalette(seed), RangeError);
  assert.ok(Math.abs(contrastRatio([1, 0, 0], [0, 0, 0]) - 21) < 0.00001);
  assert.equal(color("blue", 9), "var(--dixy-color-blue-9)");
  assert.equal(semanticColor("text.danger"), "var(--dixy-color-text-danger)");
});

test("black and white overlays have 12 increasing alpha stops and semantic scrims", () => {
  assert.equal(Object.keys(overlayAlpha).length, 12);
  const alpha = Object.values(overlayAlpha);
  alpha.forEach((value, index) => {
    assert.ok(value > 0 && value < 1);
    if (index) assert.ok(value > alpha[index - 1]);
  });
  for (const family of overlayFamilies)
    for (const step of colorSteps)
      assert.match(toOverlayColor(family, step), /^oklch\([01] 0 0 \/ 0\./);
  assert.equal(overlayColor("white", 8), "var(--dixy-color-white-a8)");
  assert.equal(semanticColors["background.overlay"].dark, "black.a9");
  assert.equal(semanticColors["background.overlay.inverse"].light, "white.a8");
  assert.throws(() => resolveColor("black.a8", "light"), /surface underneath/);
});

test("zero-chroma custom seeds remain achromatic and unsafe action seeds are rejected", () => {
  const palette = createColorPalette([0.54, 0, 260]);
  for (const mode of modes)
    for (const value of Object.values(palette[mode])) assert.equal(value[1], 0);
  assert.throws(
    () => createColorPalette([0.59, 0.14, 155]),
    /common 4.5:1 foreground/,
  );
});

test("focus rings stay at 3:1 on mid-grey light surfaces and against dark ones", () => {
  // 4.4:1 against white is what 3:1 needs on a light-grey surface such as
  // Brutalist Concrete's #d6d4cf; step 8 alone was under that for every family.
  const white = [1, 0, 0];
  for (const family of colorFamilies) {
    const light = colorPalettes[family].light;
    minimum(focusColor(light, "light"), white, 4.4, `${family}/light/focus`);
    const dark = colorPalettes[family].dark;
    minimum(focusColor(dark, "dark"), dark[2], 3, `${family}/dark/focus`);
    assert.deepEqual(
      resolveColor(`${family}.focus`, "light"),
      focusColor(light, "light"),
    );
  }
});
