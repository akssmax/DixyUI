import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { Theme, Button, Icon, componentMotion } from "@dixy-ui/react";
import { motionTransitions, motionDurations } from "@dixy-ui/tokens";

for (const phases of Object.values(componentMotion)) {
  for (const role of Object.values(phases)) {
    assert.ok(motionDurations[motionTransitions[role].duration] < 300);
  }
  if ("enter" in phases && "exit" in phases) {
    assert.ok(
      motionDurations[motionTransitions[phases.exit].duration] <
        motionDurations[motionTransitions[phases.enter].duration],
    );
  }
}

const html = renderToString(
  createElement(
    Theme,
    { appearance: "dark" },
    createElement(Button, null, "Consumer works"),
  ),
);
assert.match(html, /data-appearance="dark"/);
assert.match(html, /Consumer works/);
console.log("Packed ESM exports render successfully outside the workspace.");

const iconHtml = renderToString(
  createElement(Icon, {
    render: createElement(
      "svg",
      { viewBox: "0 0 24 24" },
      createElement("path", { d: "m4 12 5 5 11-11" }),
    ),
    label: "Changes saved",
    color: "success",
    size: "2xl",
  }),
);
assert.match(iconHtml, /role="img"/);
assert.match(iconHtml, /aria-label="Changes saved"/);
assert.match(iconHtml, /<svg/);
assert.match(iconHtml, /<path/);

const library = await import("@dixy-ui/react");
const families = [
  "Accordion",
  "AlertDialog",
  "Autocomplete",
  "Avatar",
  "Button",
  "Checkbox",
  "CheckboxGroup",
  "Collapsible",
  "Combobox",
  "ContextMenu",
  "Dialog",
  "Drawer",
  "Field",
  "Fieldset",
  "Form",
  "TextField",
  "Menu",
  "Menubar",
  "Meter",
  "NavigationMenu",
  "NumberField",
  "OTPField",
  "Popover",
  "PreviewCard",
  "Progress",
  "Radio",
  "RadioGroup",
  "ScrollArea",
  "Select",
  "Separator",
  "Slider",
  "Switch",
  "Tabs",
  "Toast",
  "Toggle",
  "ToggleGroup",
  "Toolbar",
  "Tooltip",
];
for (const name of families)
  assert.ok(library[name], `Missing packed export: ${name}`);
for (const name of [
  "DirectionProvider",
  "CSPProvider",
  "mergeProps",
  "useRender",
])
  assert.equal(typeof library[name], "function");
const controls = renderToString(
  createElement(
    library.Theme,
    { dir: "rtl" },
    createElement(
      library.Checkbox.Root,
      {
        defaultChecked: true,
        "aria-label": "Updates",
        size: "lg",
        variant: "soft",
        color: "danger",
        radius: "full",
        material: "metal",
      },
      createElement(library.Checkbox.Indicator),
    ),
    createElement(
      library.Tabs.Root,
      {
        defaultValue: "one",
        variant: "solid",
        size: "lg",
        color: "success",
        radius: "full",
        material: "metal",
      },
      createElement(
        library.Tabs.List,
        { "aria-label": "SSR sections" },
        createElement(library.Tabs.Tab, { value: "one" }, "Overview"),
        createElement(library.Tabs.Indicator, { renderBeforeHydration: true }),
      ),
      createElement(library.Tabs.Panel, { value: "one" }, "Overview content"),
    ),
    createElement(
      library.Switch.Root,
      {
        "aria-label": "Notifications",
        size: "sm",
        variant: "outline",
        color: "success",
        radius: "none",
        material: "paper",
      },
      createElement(library.Switch.Thumb, {
        checkedIcon: createElement("svg"),
      }),
    ),
  ),
);
assert.match(controls, /dixy-checkbox-root/);
assert.match(controls, /dixy-checkbox-mark/);
assert.match(controls, /data-color="danger"/);
assert.match(controls, /data-radius="full"/);
assert.match(controls, /dixy-checkbox-symbol/);
assert.match(controls, /aria-hidden="true"/);
assert.match(controls, /dixy-tabs-root/);
assert.match(controls, /role="tablist"/);
assert.match(controls, /role="tabpanel"/);
assert.match(controls, /data-variant="solid"/);
assert.match(controls, /dixy-switch-thumb/);
assert.match(controls, /data-variant="outline"/);
assert.match(controls, /data-radius="none"/);
assert.match(controls, /dixy-switch-icon/);
assert.match(controls, /dir="rtl"/);
console.log(
  "All 37 Base UI families and stable utilities are available from the packed package.",
);
