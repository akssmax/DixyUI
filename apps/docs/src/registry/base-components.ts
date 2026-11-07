// Authored guidance; public part/prop metadata is generated from local TypeScript.
export const baseComponentRegistry = {
  checkbox: {
    title: "Checkbox",
    category: "Inputs",
    description: "A clear choice, with room for a mixed state.",
    detail:
      "Centered check and mixed marks, with three sizes, semantic colors, custom artwork and static materials. The labeled root owns the interaction.",
    primitive: "Checkbox",
    api: ["CheckboxRootProps", "CheckboxIndicatorProps"],
    source: "components/checkbox.tsx",
    load: () => import("../demos/checkbox-example"),
    code: () => import("../demos/checkbox-example?raw"),
    composition: {
      tree: "Field.Root\n├── Field.Label → Checkbox.Root → Checkbox.Indicator\n├── Field.Description\n└── Field.Error",
      detail:
        "Root owns checked, mixed, disabled, readOnly and form state. Indicator is decorative and supports custom artwork. Field owns validation and labeling; CheckboxGroup owns array selection and select-all parent relationships.",
    },
    controls: [
      {
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
        initial: "md",
      },
      {
        name: "variant",
        label: "Variant",
        options: ["solid", "soft", "outline"],
        initial: "solid",
      },
      {
        name: "color",
        label: "Color",
        options: ["accent", "neutral", "danger", "success"],
        initial: "accent",
      },
      {
        name: "radius",
        label: "Control radius",
        options: ["none", "sm", "md", "lg", "full"],
        initial: "md",
      },
      {
        name: "material",
        label: "Material",
        options: ["matte", "glossy", "soft", "metal", "paper"],
        initial: "matte",
      },
      {
        name: "indicator",
        label: "Indicator",
        options: ["check", "heart", "plus"],
        initial: "check",
      },
      { name: "description", label: "Description", initial: true },
      { name: "indeterminate", label: "Indeterminate", initial: false },
      { name: "invalid", label: "Invalid", initial: false },
      { name: "disabled", label: "Disabled", initial: false },
      { name: "readOnly", label: "Read only", initial: false },
    ],
    keyboard: [
      ["Tab / Shift + Tab", "Move through the available controls."],
      [
        "Space",
        "Toggle the focused checkbox. Disabled and read-only controls preserve their state.",
      ],
    ],
    accessibility:
      "Use a stable visible label or aria-label. Field.Description and Field.Error associate supporting text and validation; Field.Root owns invalid state. The default marks and custom icon slots are decorative. Checked, mixed and unchecked remain distinct; disabled and readOnly preserve their Base UI behavior.",
    lesson:
      "Root adds sm, md and lg sizes; solid, soft and outline emphasis; four semantic colors; five contextual radii; and optional static materials. Unchecked boxes stay neutral. Radius and material inherit Theme when omitted. Indicator accepts checkedIcon and indeterminateIcon; custom children, including null, take precedence. Centered SVG defaults and finite 120ms feedback retain Base UI presence. Reduced motion changes immediately. Use Field for validation and CheckboxGroup with a parent checkbox for select-all behavior; these keep primitive refs, events, keyboard and form contracts.",
    token: "--dixy-choice-size",
  },
  switch: {
    title: "Switch",
    category: "Inputs",
    description: "A setting that changes immediately.",
    detail:
      "An immediate on/off setting with three sizes, semantic colors, custom thumb icons and static materials. Keep its label stable as the thumb changes position.",
    primitive: "Switch",
    api: ["SwitchRootProps", "SwitchThumbProps"],
    source: "components/switch.tsx",
    load: () => import("../demos/switch-example"),
    code: () => import("../demos/switch-example?raw"),
    composition: {
      tree: "Field.Root\n├── Field.Label → Switch.Root → Switch.Thumb\n└── Field.Description",
      detail:
        "Root owns the immediate on/off setting and native form state. Thumb owns optional decorative icons. Keep the visible label stable; Field.Label and Field.Description establish accessible relationships.",
    },
    controls: [
      {
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
        initial: "md",
      },
      {
        name: "variant",
        label: "Variant",
        options: ["solid", "soft", "outline"],
        initial: "solid",
      },
      {
        name: "color",
        label: "Color",
        options: ["accent", "neutral", "danger", "success"],
        initial: "accent",
      },
      {
        name: "radius",
        label: "Control radius",
        options: ["none", "sm", "md", "lg", "full"],
        initial: "md",
      },
      {
        name: "material",
        label: "Material",
        options: ["matte", "glossy", "soft", "metal", "paper"],
        initial: "matte",
      },
      {
        name: "icons",
        label: "Icons",
        options: ["none", "check", "theme", "notifications"],
        initial: "check",
      },
      { name: "description", label: "Description", initial: true },
      { name: "disabled", label: "Disabled", initial: false },
      { name: "readOnly", label: "Read only", initial: false },
    ],
    keyboard: [
      ["Tab / Shift + Tab", "Move through the available controls."],
      [
        "Space",
        "Toggle the focused switch. Disabled and read-only settings do not change.",
      ],
    ],
    accessibility:
      "Use a stable visible label or aria-label, and connect supporting text with aria-describedby. Icons are decorative; the labeled root exposes the checked state. Disabled controls skip keyboard focus; readOnly preserves focus and the current setting. Thumb position communicates state independently of color and materials.",
    lesson:
      "Choose sm/md/lg proportions, solid/soft/outline emphasis, and accent/neutral/danger/success color. Accent follows any Theme accent palette. Radius and material inherit Theme unless overridden on Root. Thumb accepts checkedIcon/uncheckedIcon from your SVG or icon library; custom children take precedence. Import materials.css for all five static finishes. Track color, thumb travel and icon crossfade use the shared 120ms feedback recipe; reduced motion changes immediately while preserving the selected thumb position. Base UI owns refs, controlled/uncontrolled state, forms, readOnly, disabled and render composition.",
    token: "--dixy-switch-track-width",
  },
  tabs: {
    title: "Tabs",
    category: "Navigation",
    description: "Related views, one focused workspace.",
    detail:
      "Four selected treatments, three sizes and a clear composition. Base UI owns selection, roving focus and tab-to-panel relationships.",
    primitive: "Tabs",
    api: ["TabsRootProps"],
    source: "components/tabs.tsx",
    load: () => import("../demos/tabs-example"),
    code: () => import("../demos/tabs-example?raw"),
    composition: {
      tree: "Tabs.Root\n├── Tabs.List (accessible name)\n│   ├── Tabs.Tab value=overview\n│   ├── Tabs.Tab value=activity\n│   └── Tabs.Indicator (decoration)\n├── Tabs.Panel value=overview\n└── Tabs.Panel value=activity",
      detail:
        "Root owns value/defaultValue and orientation. List owns the accessible group name, activateOnFocus and loopFocus. Each Tab value matches its Panel value. Indicator belongs inside List; it adds decoration while the tab still exposes aria-selected. Omit Indicator when you want the static selected treatment. Keep action buttons and links inside panels rather than nesting them inside a Tab.",
    },
    controls: [
      {
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
        initial: "md",
      },
      {
        name: "variant",
        label: "Variant",
        options: ["line", "solid", "soft", "outline", "segmented"],
        initial: "line",
      },
      {
        name: "color",
        label: "Color",
        options: ["accent", "neutral", "danger", "success"],
        initial: "accent",
      },
      {
        name: "radius",
        label: "Control radius",
        options: ["none", "sm", "md", "lg", "full"],
        initial: "md",
      },
      {
        name: "material",
        label: "Material",
        options: ["matte", "glossy", "soft", "metal", "paper"],
        initial: "matte",
      },
      {
        name: "align",
        label: "Label alignment",
        options: ["start", "center", "end"],
        initial: "center",
      },
      {
        name: "orientation",
        label: "Orientation",
        options: ["horizontal", "vertical"],
        initial: "horizontal",
      },
      { name: "fullWidth", label: "Fill list", initial: false },
      { name: "icons", label: "Icons", initial: false },
      { name: "activateOnFocus", label: "Activate on focus", initial: false },
      { name: "disabled", label: "Disable activity", initial: false },
    ],
    keyboard: [
      [
        "Tab / Shift + Tab",
        "Enter the list at its current focus stop, then move to the active panel or its first focusable control.",
      ],
      [
        "Left / Right",
        "Move focus horizontally; direction follows LTR or RTL. Disabled tabs remain discoverable by arrow-key focus but cannot activate.",
      ],
      [
        "Up / Down",
        "Move focus in vertical lists; horizontal lists leave these keys available for page scrolling.",
      ],
      [
        "Home / End",
        "Move to the first or last tab. List.loopFocus controls arrow-key wrapping.",
      ],
      [
        "Enter / Space",
        "Select the focused tab in manual mode. List.activateOnFocus opts into automatic selection.",
      ],
    ],
    accessibility:
      "Name every List with aria-label or aria-labelledby. Base UI connects each tab/panel pair and manages aria-selected and roving focus. Use automatic activation only when panels appear without noticeable latency; manual activation is the default. The selected shape/underline provides a cue beyond color, and focus has its own outline. Icons are decorative beside a stable text label. Disabled tabs remain discoverable by arrow-key focus but cannot activate. WCAG 2.2 AA is the validation target; passing primitive and automated tests does not certify the whole application.",
    lesson:
      "Root adds visual settings while the primitive keeps selection, refs, events, render composition and panel presence. List keeps activateOnFocus and loopFocus. Material applies to the moving selected surface in filled variants, never to text. Indicator uses Base UI physical coordinates, logical inline edges for a vertical line, and shared 200ms enter motion. Reduced motion makes geometry changes immediate. Panels switch immediately without a second animation lifecycle. Nested Roots scope their visual settings independently.",
    token: "--dixy-tabs-height",
  },
  tooltip: {
    title: "Tooltip",
    category: "Overlays",
    description: "A little context, at the right moment.",
    detail:
      "The trigger needs its own accessible name. Installed Base UI tooltips are visual hints; essential instructions belong in persistent text. Keep popup content non-interactive, and use Popover for actions.",
    primitive: "Tooltip",
    api: ["TooltipPopupProps"],
    source: "components/tooltip.tsx",
    load: () => import("../demos/tooltip-example"),
    code: () => import("../demos/tooltip-example?raw"),
    composition: {
      tree: "Tooltip.Provider (delay)\n\u2514\u2500\u2500 Tooltip.Root\n    \u251c\u2500\u2500 Tooltip.Trigger render=Button\n    \u2514\u2500\u2500 Tooltip.Portal \u2192 Tooltip.Positioner \u2192 Tooltip.Popup",
      detail:
        "The trigger needs its own accessible name. Installed Base UI tooltips are visual hints; essential instructions belong in persistent text. Keep popup content non-interactive, and use Popover for actions.",
    },
    controls: [
      {
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
        initial: "md",
      },
      {
        name: "variant",
        label: "Variant",
        options: ["outline", "soft"],
        initial: "outline",
      },
      {
        name: "radius",
        label: "Control radius",
        options: ["none", "sm", "md", "lg", "full"],
        initial: "md",
      },
      {
        name: "material",
        label: "Material",
        options: ["matte", "glossy", "soft", "metal", "paper"],
        initial: "matte",
      },
      {
        name: "disabled",
        label: "Disabled",
        initial: false,
      },
      {
        name: "side",
        label: "Side",
        initial: "top",
        options: ["top", "bottom", "left", "right"],
      },
    ],
    keyboard: [
      ["Tab", "Focus the trigger to reveal its description."],
      ["Escape", "Dismiss the tooltip."],
    ],
    accessibility:
      "Base UI 1.9 tooltips are visual hints for sighted users. Give the trigger its own accessible name and repeat it in the hint. Essential instructions belong in persistent text, and interactive content belongs in Popover. Provide meaningful names and verify the complete interaction with a keyboard. Color alone must not communicate state.",
    lesson:
      "Base UI 1.9 tooltips are visual hints for sighted users. Give the trigger its own accessible name and repeat it in the hint. Essential instructions belong in persistent text, and interactive content belongs in Popover. Component aliases reference Dixy semantic tokens; refs, events and render composition are forwarded unchanged. Visual settings follow Dixy shirt sizes, contextual radii and semantic tokens where applicable. Static finishes are optional, and reduced motion is immediate. Base UI keeps refs, state, events, keyboard and presence; this implementation pass does not establish WCAG conformance.",
    token: "--dixy-popup-background",
  },
  accordion: {
    title: "Accordion",
    category: "Content",
    description: "A little structure for a longer story.",
    detail:
      "Root owns expanded values. Header preserves heading semantics; Trigger is the only disclosure control. Put panel padding on an inner container so measured block-size motion does not clip content.",
    primitive: "Accordion",
    api: ["AccordionRootProps"],
    source: "components/accordion.tsx",
    load: () => import("../demos/accordion-example"),
    code: () => import("../demos/accordion-example?raw"),
    composition: {
      tree: "Accordion.Root (value, multiple)\n\u2514\u2500\u2500 Accordion.Item value=question\n    \u251c\u2500\u2500 Accordion.Header\n    \u2502   \u2514\u2500\u2500 Accordion.Trigger \u2192 label + decorative chevron\n    \u2514\u2500\u2500 Accordion.Panel \u2192 content container",
      detail:
        "Root owns expanded values. Header preserves heading semantics; Trigger is the only disclosure control. Put panel padding on an inner container so measured block-size motion does not clip content.",
    },
    controls: [
      {
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
        initial: "md",
      },
      {
        name: "variant",
        label: "Variant",
        options: ["plain", "outline", "soft"],
        initial: "plain",
      },
      {
        name: "radius",
        label: "Control radius",
        options: ["none", "sm", "md", "lg", "full"],
        initial: "md",
      },
      {
        name: "disabled",
        label: "Disabled",
        initial: false,
      },
      {
        name: "multiple",
        label: "Multiple",
        initial: false,
      },
    ],
    keyboard: [],
    accessibility:
      "Headers contain triggers; panels contain content. Expansion state and keyboard navigation are preserved by Base UI. Provide meaningful names and verify the complete interaction with a keyboard. Color alone must not communicate state.",
    lesson:
      "Headers contain triggers; panels contain content. Expansion state and keyboard navigation are preserved by Base UI. Component aliases reference Dixy semantic tokens; refs, events and render composition are forwarded unchanged. Visual settings follow Dixy shirt sizes, contextual radii and semantic tokens where applicable. Static finishes are optional, and reduced motion is immediate. Base UI keeps refs, state, events, keyboard and presence; this implementation pass does not establish WCAG conformance.",
    token: "--dixy-primitive-gap",
  },
  "alert-dialog": {
    title: "Alert Dialog",
    category: "Overlays",
    description: "A considered pause before a consequential action.",
    detail:
      "Use an alert dialog for an interrupting decision. This example initially focuses Cancel, the least destructive action. Confirmation is explicit and local to the demo; Base UI retains modal/dismissal and final-focus contracts.",
    primitive: "AlertDialog",
    api: ["AlertDialogPopupProps"],
    source: "components/alert-dialog.tsx",
    load: () => import("../demos/alert-dialog-example"),
    code: () => import("../demos/alert-dialog-example?raw"),
    composition: {
      tree: "AlertDialog.Root\n\u251c\u2500\u2500 AlertDialog.Trigger render=Button\n\u2514\u2500\u2500 AlertDialog.Portal\n    \u251c\u2500\u2500 AlertDialog.Backdrop\n    \u2514\u2500\u2500 AlertDialog.Viewport \u2192 AlertDialog.Popup\n        \u251c\u2500\u2500 AlertDialog.Title + AlertDialog.Description\n        \u2514\u2500\u2500 Cancel + explicit confirm action",
      detail:
        "Use an alert dialog for an interrupting decision. This example initially focuses Cancel, the least destructive action. Confirmation is explicit and local to the demo; Base UI retains modal/dismissal and final-focus contracts.",
    },
    controls: [
      {
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
        initial: "md",
      },
      {
        name: "variant",
        label: "Variant",
        options: ["outline", "soft"],
        initial: "outline",
      },
      {
        name: "radius",
        label: "Control radius",
        options: ["none", "sm", "md", "lg", "full"],
        initial: "md",
      },
      {
        name: "material",
        label: "Material",
        options: ["matte", "glossy", "soft", "metal", "paper"],
        initial: "matte",
      },
      {
        name: "disabled",
        label: "Disabled",
        initial: false,
      },
    ],
    keyboard: [
      [
        "Enter / Space",
        "Activate a focused trigger or action, where applicable.",
      ],
      ["Escape", "Dismiss the popup where supported."],
    ],
    accessibility:
      "Use AlertDialog for a required decision. Make the consequence clear and provide an explicit safe action. Provide meaningful names and verify the complete interaction with a keyboard. Color alone must not communicate state.",
    lesson:
      "Use AlertDialog for a required decision. Make the consequence clear and provide an explicit safe action. Component aliases reference Dixy semantic tokens; refs, events and render composition are forwarded unchanged. Visual settings follow Dixy shirt sizes, contextual radii and semantic tokens where applicable. Static finishes are optional, and reduced motion is immediate. Base UI keeps refs, state, events, keyboard and presence; this implementation pass does not establish WCAG conformance.",
    token: "--dixy-popup-background",
  },
  autocomplete: {
    title: "Autocomplete",
    category: "Inputs",
    description: "Suggestions that leave room for your own words.",
    detail:
      "Base UI Autocomplete supports text suggestions; it is not the same contract as HeroUI’s selection-based Autocomplete. Preserve editable text, label the clear action and keep results/empty states inside the popup.",
    primitive: "Autocomplete",
    api: [
      "AutocompleteInputProps",
      "AutocompleteInputGroupProps",
      "AutocompletePopupProps",
    ],
    source: "components/autocomplete.tsx",
    load: () => import("../demos/autocomplete-example"),
    code: () => import("../demos/autocomplete-example?raw"),
    composition: {
      tree: "Autocomplete.Root (items, value)\n\u251c\u2500\u2500 Autocomplete.InputGroup\n\u2502   \u251c\u2500\u2500 Autocomplete.Input\n\u2502   \u2514\u2500\u2500 Autocomplete.Clear\n\u2514\u2500\u2500 Autocomplete.Portal \u2192 Autocomplete.Positioner \u2192 Autocomplete.Popup\n    \u251c\u2500\u2500 Autocomplete.Empty\n    \u2514\u2500\u2500 Autocomplete.List \u2192 Autocomplete.Item",
      detail:
        "Base UI Autocomplete supports text suggestions; it is not the same contract as HeroUI\u2019s selection-based Autocomplete. Preserve editable text, label the clear action and keep results/empty states inside the popup.",
    },
    controls: [
      {
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
        initial: "md",
      },
      {
        name: "variant",
        label: "Variant",
        options: ["outline", "soft"],
        initial: "outline",
      },
      {
        name: "radius",
        label: "Control radius",
        options: ["none", "sm", "md", "lg", "full"],
        initial: "md",
      },
      {
        name: "material",
        label: "Material",
        options: ["matte", "glossy", "soft", "metal", "paper"],
        initial: "matte",
      },
      {
        name: "disabled",
        label: "Disabled",
        initial: false,
      },
    ],
    keyboard: [
      ["Tab / Shift + Tab", "Move through the available controls."],
      [
        "Arrow keys / Space",
        "Use the primitive’s directional or activation behavior where applicable.",
      ],
    ],
    accessibility:
      "Autocomplete helps enter free text. Combobox and Select also manage a selected value; these contracts are different. Provide meaningful names and verify the complete interaction with a keyboard. Color alone must not communicate state.",
    lesson:
      "Autocomplete helps enter free text. Combobox and Select also manage a selected value; these contracts are different. Component aliases reference Dixy semantic tokens; refs, events and render composition are forwarded unchanged. Visual settings follow Dixy shirt sizes, contextual radii and semantic tokens where applicable. Static finishes are optional, and reduced motion is immediate. Base UI keeps refs, state, events, keyboard and presence; this implementation pass does not establish WCAG conformance.",
    token: "--dixy-primitive-gap",
  },
  avatar: {
    title: "Avatar",
    category: "Content",
    description: "A recognizable face, with a dependable fallback.",
    detail:
      "Root controls the frame; Image and Fallback share it. A failed image reveals the fallback. Supply a useful alternative name, or make redundant artwork decorative when visible text already identifies the person.",
    primitive: "Avatar",
    api: ["AvatarRootProps"],
    source: "components/avatar.tsx",
    load: () => import("../demos/avatar-example"),
    code: () => import("../demos/avatar-example?raw"),
    composition: {
      tree: "Avatar.Root\n\u251c\u2500\u2500 Avatar.Image (alt)\n\u2514\u2500\u2500 Avatar.Fallback (initials or artwork)",
      detail:
        "Root controls the frame; Image and Fallback share it. A failed image reveals the fallback. Supply a useful alternative name, or make redundant artwork decorative when visible text already identifies the person.",
    },
    controls: [
      {
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
        initial: "md",
      },
      {
        name: "variant",
        label: "Variant",
        options: ["solid", "soft", "outline"],
        initial: "soft",
      },
      {
        name: "color",
        label: "Color",
        options: ["accent", "neutral", "danger", "success"],
        initial: "accent",
      },
      {
        name: "radius",
        label: "Control radius",
        options: ["none", "sm", "md", "lg", "full"],
        initial: "md",
      },
      {
        name: "material",
        label: "Material",
        options: ["matte", "glossy", "soft", "metal", "paper"],
        initial: "matte",
      },
      {
        name: "image",
        label: "Show image",
        initial: false,
      },
    ],
    keyboard: [],
    accessibility:
      "The image and initials share a frame. A fallback is a loading/error path, not evidence that the image loaded. Provide meaningful names and verify the complete interaction with a keyboard. Color alone must not communicate state.",
    lesson:
      "The image and initials share a frame. A fallback is a loading/error path, not evidence that the image loaded. Component aliases reference Dixy semantic tokens; refs, events and render composition are forwarded unchanged. Visual settings follow Dixy shirt sizes, contextual radii and semantic tokens where applicable. Static finishes are optional, and reduced motion is immediate. Base UI keeps refs, state, events, keyboard and presence; this implementation pass does not establish WCAG conformance.",
    token: "--dixy-primitive-gap",
  },
  "checkbox-group": {
    title: "Checkbox Group",
    category: "Inputs",
    description: "Independent choices, one coherent group.",
    detail:
      "CheckboxGroup coordinates a collection of values. Name the group separately from each checkbox and preserve native form serialization.",
    primitive: "CheckboxGroup",
    api: ["CheckboxGroupProps"],
    source: "components/checkbox-group.tsx",
    load: () => import("../demos/checkbox-group-example"),
    code: () => import("../demos/checkbox-group-example?raw"),
    composition: {
      tree: "Fieldset.Root → Fieldset.Legend + CheckboxGroup\n└── label → Checkbox.Root + Checkbox.Indicator",
      detail:
        "CheckboxGroup owns an array of selected values. Individual Checkbox roots own their own visuals. Use Fieldset.Legend or an accessible group name; orientation and gap affect layout only.",
    },
    controls: [
      {
        name: "orientation",
        label: "Orientation",
        options: ["horizontal", "vertical"],
        initial: "vertical",
      },
      {
        name: "gap",
        label: "Gap",
        options: ["sm", "md", "lg"],
        initial: "md",
      },
      { name: "disabled", label: "Disabled", initial: false },
    ],
    keyboard: [
      ["Tab / Shift + Tab", "Move through the available controls."],
      [
        "Arrow keys / Space",
        "Use the primitive’s directional or activation behavior where applicable.",
      ],
    ],
    accessibility:
      "CheckboxGroup coordinates a collection of values. Name the group separately from each checkbox and preserve native form serialization. Provide meaningful names and verify the complete interaction with a keyboard. Color alone must not communicate state.",
    lesson:
      "CheckboxGroup coordinates a collection of values. Name the group separately from each checkbox and preserve native form serialization. Component aliases reference Dixy semantic tokens; refs, events and render composition are forwarded unchanged.",
    token: "--dixy-primitive-gap",
  },
  collapsible: {
    title: "Collapsible",
    category: "Content",
    description: "Details when you need them.",
    detail:
      "Root owns open state; Trigger exposes expansion and controls Panel. Panel height and presence remain Base UI owned. Use a heading around the trigger when the content needs a section heading.",
    primitive: "Collapsible",
    api: ["CollapsibleRootProps"],
    source: "components/collapsible.tsx",
    load: () => import("../demos/collapsible-example"),
    code: () => import("../demos/collapsible-example?raw"),
    composition: {
      tree: "Collapsible.Root (open)\n\u251c\u2500\u2500 Collapsible.Trigger \u2192 label + decorative chevron\n\u2514\u2500\u2500 Collapsible.Panel \u2192 content container",
      detail:
        "Root owns open state; Trigger exposes expansion and controls Panel. Panel height and presence remain Base UI owned. Use a heading around the trigger when the content needs a section heading.",
    },
    controls: [
      {
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
        initial: "md",
      },
      {
        name: "variant",
        label: "Variant",
        options: ["plain", "outline", "soft"],
        initial: "plain",
      },
      {
        name: "radius",
        label: "Control radius",
        options: ["none", "sm", "md", "lg", "full"],
        initial: "md",
      },
      {
        name: "disabled",
        label: "Disabled",
        initial: false,
      },
    ],
    keyboard: [],
    accessibility:
      "A disclosure trigger exposes expanded state. Panel presence and focus need to agree when the content closes. Provide meaningful names and verify the complete interaction with a keyboard. Color alone must not communicate state.",
    lesson:
      "A disclosure trigger exposes expanded state. Panel presence and focus need to agree when the content closes. Component aliases reference Dixy semantic tokens; refs, events and render composition are forwarded unchanged. Visual settings follow Dixy shirt sizes, contextual radii and semantic tokens where applicable. Static finishes are optional, and reduced motion is immediate. Base UI keeps refs, state, events, keyboard and presence; this implementation pass does not establish WCAG conformance.",
    token: "--dixy-primitive-gap",
  },
  combobox: {
    title: "Combobox",
    category: "Inputs",
    description: "Find a choice without losing your place.",
    detail:
      "Root retains generic item/value inference, filtering and selection. Name the input, trigger and clear control. Put popup-only empty/status content inside Popup and provide itemToStringLabel for object-valued items.",
    primitive: "Combobox",
    api: [
      "ComboboxInputProps",
      "ComboboxInputGroupProps",
      "ComboboxPopupProps",
    ],
    source: "components/combobox.tsx",
    load: () => import("../demos/combobox-example"),
    code: () => import("../demos/combobox-example?raw"),
    composition: {
      tree: "Combobox.Root (items, value, multiple)\n\u251c\u2500\u2500 Combobox.InputGroup\n\u2502   \u251c\u2500\u2500 Combobox.Input\n\u2502   \u251c\u2500\u2500 Combobox.Trigger\n\u2502   \u2514\u2500\u2500 Combobox.Clear\n\u2514\u2500\u2500 Combobox.Portal \u2192 Combobox.Positioner \u2192 Combobox.Popup\n    \u251c\u2500\u2500 Combobox.Empty\n    \u2514\u2500\u2500 Combobox.List \u2192 Combobox.Item + Combobox.ItemIndicator",
      detail:
        "Root retains generic item/value inference, filtering and selection. Name the input, trigger and clear control. Put popup-only empty/status content inside Popup and provide itemToStringLabel for object-valued items.",
    },
    controls: [
      {
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
        initial: "md",
      },
      {
        name: "variant",
        label: "Variant",
        options: ["outline", "soft"],
        initial: "outline",
      },
      {
        name: "radius",
        label: "Control radius",
        options: ["none", "sm", "md", "lg", "full"],
        initial: "md",
      },
      {
        name: "material",
        label: "Material",
        options: ["matte", "glossy", "soft", "metal", "paper"],
        initial: "matte",
      },
      {
        name: "disabled",
        label: "Disabled",
        initial: false,
      },
    ],
    keyboard: [
      ["Tab / Shift + Tab", "Move through the available controls."],
      [
        "Arrow keys / Space",
        "Use the primitive’s directional or activation behavior where applicable.",
      ],
    ],
    accessibility:
      "Base UI owns filtering, highlight and selection. Preserve generic item types and keep empty results explicit. Provide meaningful names and verify the complete interaction with a keyboard. Color alone must not communicate state.",
    lesson:
      "Base UI owns filtering, highlight and selection. Preserve generic item types and keep empty results explicit. Component aliases reference Dixy semantic tokens; refs, events and render composition are forwarded unchanged. Visual settings follow Dixy shirt sizes, contextual radii and semantic tokens where applicable. Static finishes are optional, and reduced motion is immediate. Base UI keeps refs, state, events, keyboard and presence; this implementation pass does not establish WCAG conformance.",
    token: "--dixy-primitive-gap",
  },
  "context-menu": {
    title: "Context Menu",
    category: "Overlays",
    description: "Useful actions, close to their context.",
    detail:
      "ContextMenu opens from the pointer or its keyboard context command. Keep an ordinary visible route to essential actions as well. Items, indicators, grouping and disabled behavior remain primitive-owned.",
    primitive: "ContextMenu",
    api: [
      "ContextMenuPopupProps",
      "ContextMenuItemProps",
      "ContextMenuLinkItemProps",
    ],
    source: "components/context-menu.tsx",
    load: () => import("../demos/context-menu-example"),
    code: () => import("../demos/context-menu-example?raw"),
    composition: {
      tree: "ContextMenu.Root\n\u251c\u2500\u2500 ContextMenu.Trigger (context target)\n\u2514\u2500\u2500 ContextMenu.Portal \u2192 ContextMenu.Positioner \u2192 ContextMenu.Popup\n    \u251c\u2500\u2500 ContextMenu.Item / ContextMenu.LinkItem\n    \u251c\u2500\u2500 ContextMenu.Separator\n    \u2514\u2500\u2500 ContextMenu.CheckboxItem \u2192 ContextMenu.CheckboxItemIndicator",
      detail:
        "ContextMenu opens from the pointer or its keyboard context command. Keep an ordinary visible route to essential actions as well. Items, indicators, grouping and disabled behavior remain primitive-owned.",
    },
    controls: [
      {
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
        initial: "md",
      },
      {
        name: "variant",
        label: "Variant",
        options: ["outline", "soft"],
        initial: "outline",
      },
      {
        name: "radius",
        label: "Control radius",
        options: ["none", "sm", "md", "lg", "full"],
        initial: "md",
      },
      {
        name: "material",
        label: "Material",
        options: ["matte", "glossy", "soft", "metal", "paper"],
        initial: "matte",
      },
      {
        name: "disabled",
        label: "Disabled",
        initial: false,
      },
    ],
    keyboard: [
      [
        "Enter / Space",
        "Activate a focused trigger or action, where applicable.",
      ],
      ["Escape", "Dismiss the popup where supported."],
    ],
    accessibility:
      "A context menu needs a keyboard path as well as a pointer path. Its popup uses the same item recipes as Menu. Provide meaningful names and verify the complete interaction with a keyboard. Color alone must not communicate state.",
    lesson:
      "A context menu needs a keyboard path as well as a pointer path. Its popup uses the same item recipes as Menu. Component aliases reference Dixy semantic tokens; refs, events and render composition are forwarded unchanged. Visual settings follow Dixy shirt sizes, contextual radii and semantic tokens where applicable. Static finishes are optional, and reduced motion is immediate. Base UI keeps refs, state, events, keyboard and presence; this implementation pass does not establish WCAG conformance.",
    token: "--dixy-popup-background",
  },
  drawer: {
    title: "Drawer",
    category: "Overlays",
    description: "A focused task, within reach.",
    detail:
      "Root owns swipe direction and dismissal. Popup owns dimensions and surface; Content contains scrollable content. Direct swipe positioning remains immediate and uses Base UI movement variables.",
    primitive: "Drawer",
    api: ["DrawerPopupProps"],
    source: "components/drawer.tsx",
    load: () => import("../demos/drawer-example"),
    code: () => import("../demos/drawer-example?raw"),
    composition: {
      tree: "Drawer.Root (open, swipeDirection)\n\u251c\u2500\u2500 Drawer.Trigger render=Button\n\u2514\u2500\u2500 Drawer.Portal\n    \u251c\u2500\u2500 Drawer.Backdrop\n    \u2514\u2500\u2500 Drawer.Viewport \u2192 Drawer.Popup \u2192 Drawer.Content\n        \u251c\u2500\u2500 Drawer.Title + Drawer.Description\n        \u2514\u2500\u2500 Drawer.Close render=Button",
      detail:
        "Root owns swipe direction and dismissal. Popup owns dimensions and surface; Content contains scrollable content. Direct swipe positioning remains immediate and uses Base UI movement variables.",
    },
    controls: [
      {
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
        initial: "md",
      },
      {
        name: "variant",
        label: "Variant",
        options: ["outline", "soft"],
        initial: "outline",
      },
      {
        name: "radius",
        label: "Control radius",
        options: ["none", "sm", "md", "lg", "full"],
        initial: "md",
      },
      {
        name: "material",
        label: "Material",
        options: ["matte", "glossy", "soft", "metal", "paper"],
        initial: "matte",
      },
      {
        name: "disabled",
        label: "Disabled",
        initial: false,
      },
      {
        name: "swipeDirection",
        label: "Drawer edge",
        initial: "down",
        options: ["up", "down", "left", "right"],
      },
    ],
    keyboard: [
      [
        "Enter / Space",
        "Activate a focused trigger or action, where applicable.",
      ],
      ["Escape", "Dismiss the popup where supported."],
    ],
    accessibility:
      "Drawer has its own gesture and snap-point model. A positioned Dialog does not provide that behavior. Provide meaningful names and verify the complete interaction with a keyboard. Color alone must not communicate state.",
    lesson:
      "Drawer has its own gesture and snap-point model. A positioned Dialog does not provide that behavior. Component aliases reference Dixy semantic tokens; refs, events and render composition are forwarded unchanged. Visual settings follow Dixy shirt sizes, contextual radii and semantic tokens where applicable. Static finishes are optional, and reduced motion is immediate. Base UI keeps refs, state, events, keyboard and presence; this implementation pass does not establish WCAG conformance.",
    token: "--dixy-popup-background",
  },
  fieldset: {
    title: "Fieldset",
    category: "Inputs",
    description: "Related fields, clearly introduced.",
    detail:
      "Use Legend to name related fields. Disabled state belongs on Fieldset.Root; each Field owns its name and validation. The fieldset surface is optional.",
    primitive: "Fieldset",
    api: ["FieldsetRootProps"],
    source: "components/fieldset.tsx",
    load: () => import("../demos/fieldset-example"),
    code: () => import("../demos/fieldset-example?raw"),
    composition: {
      tree: "Fieldset.Root\n\u251c\u2500\u2500 Fieldset.Legend\n\u2514\u2500\u2500 Field.Root\n    \u251c\u2500\u2500 Field.Label\n    \u251c\u2500\u2500 TextField\n    \u2514\u2500\u2500 Field.Description / Field.Error",
      detail:
        "Use Legend to name related fields. Disabled state belongs on Fieldset.Root; each Field owns its name and validation. The fieldset surface is optional.",
    },
    controls: [
      {
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
        initial: "md",
      },
      {
        name: "variant",
        label: "Variant",
        options: ["plain", "outline", "soft"],
        initial: "plain",
      },
      {
        name: "radius",
        label: "Control radius",
        options: ["none", "sm", "md", "lg", "full"],
        initial: "md",
      },
      {
        name: "disabled",
        label: "Disabled",
        initial: false,
      },
    ],
    keyboard: [
      ["Tab / Shift + Tab", "Move through the available controls."],
      [
        "Arrow keys / Space",
        "Use the primitive’s directional or activation behavior where applicable.",
      ],
    ],
    accessibility:
      "Legend names the fieldset; labels name individual controls. Disabled state should flow to the grouped fields. Provide meaningful names and verify the complete interaction with a keyboard. Color alone must not communicate state.",
    lesson:
      "Legend names the fieldset; labels name individual controls. Disabled state should flow to the grouped fields. Component aliases reference Dixy semantic tokens; refs, events and render composition are forwarded unchanged. Visual settings follow Dixy shirt sizes, contextual radii and semantic tokens where applicable. Static finishes are optional, and reduced motion is immediate. Base UI keeps refs, state, events, keyboard and presence; this implementation pass does not establish WCAG conformance.",
    token: "--dixy-primitive-gap",
  },
  form: {
    title: "Form",
    category: "Inputs",
    description: "A complete path from input to feedback.",
    detail:
      "Form remains a native form and keeps Base UI validation. Field names connect server errors to controls. gap changes spacing only; it does not replace submit handling or error recovery.",
    primitive: "Form",
    api: ["FormProps"],
    source: "components/form.tsx",
    load: () => import("../demos/form-example"),
    code: () => import("../demos/form-example?raw"),
    composition: {
      tree: "Form (onSubmit, errors)\n\u251c\u2500\u2500 Field.Root \u2192 label + control + help/error\n\u2514\u2500\u2500 Button type=submit",
      detail:
        "Form remains a native form and keeps Base UI validation. Field names connect server errors to controls. gap changes spacing only; it does not replace submit handling or error recovery.",
    },
    controls: [
      {
        name: "gap",
        label: "Gap",
        initial: "md",
        options: ["sm", "md", "lg"],
      },
      {
        name: "disabled",
        label: "Disabled",
        initial: false,
      },
    ],
    keyboard: [
      ["Tab / Shift + Tab", "Move through the available controls."],
      [
        "Arrow keys / Space",
        "Use the primitive’s directional or activation behavior where applicable.",
      ],
    ],
    accessibility:
      "Form coordinates validation and submission. Native required, name and submit semantics remain valuable. Provide meaningful names and verify the complete interaction with a keyboard. Color alone must not communicate state.",
    lesson:
      "Form coordinates validation and submission. Native required, name and submit semantics remain valuable. Component aliases reference Dixy semantic tokens; refs, events and render composition are forwarded unchanged. Visual settings follow Dixy shirt sizes, contextual radii and semantic tokens where applicable. Static finishes are optional, and reduced motion is immediate. Base UI keeps refs, state, events, keyboard and presence; this implementation pass does not establish WCAG conformance.",
    token: "--dixy-primitive-gap",
  },
  menu: {
    title: "Menu",
    category: "Overlays",
    description: "A concise collection of actions.",
    detail:
      "Menu contains actions and checkable menu items. Use LinkItem for navigation and a separate RadioGroup for exclusive choices. Popup controls list visuals; Item can signal a destructive action with color=danger.",
    primitive: "Menu",
    api: ["MenuPopupProps", "MenuItemProps", "MenuLinkItemProps"],
    source: "components/menu.tsx",
    load: () => import("../demos/menu-example"),
    code: () => import("../demos/menu-example?raw"),
    composition: {
      tree: "Menu.Root\n\u251c\u2500\u2500 Menu.Trigger render=Button\n\u2514\u2500\u2500 Menu.Portal \u2192 Menu.Positioner \u2192 Menu.Popup\n    \u251c\u2500\u2500 Menu.Group \u2192 Menu.GroupLabel + Menu.Item / Menu.LinkItem\n    \u251c\u2500\u2500 Menu.Separator\n    \u251c\u2500\u2500 Menu.CheckboxItem \u2192 Menu.CheckboxItemIndicator\n    \u2514\u2500\u2500 Menu.RadioGroup \u2192 Menu.RadioItem + Menu.RadioItemIndicator",
      detail:
        "Menu contains actions and checkable menu items. Use LinkItem for navigation and a separate RadioGroup for exclusive choices. Popup controls list visuals; Item can signal a destructive action with color=danger.",
    },
    controls: [
      {
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
        initial: "md",
      },
      {
        name: "variant",
        label: "Variant",
        options: ["outline", "soft"],
        initial: "outline",
      },
      {
        name: "radius",
        label: "Control radius",
        options: ["none", "sm", "md", "lg", "full"],
        initial: "md",
      },
      {
        name: "material",
        label: "Material",
        options: ["matte", "glossy", "soft", "metal", "paper"],
        initial: "matte",
      },
      {
        name: "disabled",
        label: "Disabled",
        initial: false,
      },
    ],
    keyboard: [
      [
        "Enter / Space",
        "Activate a focused trigger or action, where applicable.",
      ],
      ["Escape", "Dismiss the popup where supported."],
    ],
    accessibility:
      "Action menus use roving focus and highlight. Links, checkboxes and radio items retain their distinct semantics. Provide meaningful names and verify the complete interaction with a keyboard. Color alone must not communicate state.",
    lesson:
      "Action menus use roving focus and highlight. Links, checkboxes and radio items retain their distinct semantics. Component aliases reference Dixy semantic tokens; refs, events and render composition are forwarded unchanged. Visual settings follow Dixy shirt sizes, contextual radii and semantic tokens where applicable. Static finishes are optional, and reduced motion is immediate. Base UI keeps refs, state, events, keyboard and presence; this implementation pass does not establish WCAG conformance.",
    token: "--dixy-popup-background",
  },
  menubar: {
    title: "Menubar",
    category: "Navigation",
    description: "Familiar menus, working together.",
    detail:
      "Menubar coordinates keyboard movement between Menu roots. Each Menu keeps its own popup and item state. Use this desktop command pattern when menu semantics are appropriate, rather than replacing ordinary site links.",
    primitive: "Menubar",
    api: ["MenubarProps"],
    source: "components/menubar.tsx",
    load: () => import("../demos/menubar-example"),
    code: () => import("../demos/menubar-example?raw"),
    composition: {
      tree: "Menubar\n\u2514\u2500\u2500 Menu.Root\n    \u251c\u2500\u2500 Menu.Trigger\n    \u2514\u2500\u2500 Menu.Portal \u2192 Menu.Positioner \u2192 Menu.Popup \u2192 Menu.Item",
      detail:
        "Menubar coordinates keyboard movement between Menu roots. Each Menu keeps its own popup and item state. Use this desktop command pattern when menu semantics are appropriate, rather than replacing ordinary site links.",
    },
    controls: [
      {
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
        initial: "md",
      },
      {
        name: "variant",
        label: "Variant",
        options: ["plain", "outline", "soft"],
        initial: "plain",
      },
      {
        name: "radius",
        label: "Control radius",
        options: ["none", "sm", "md", "lg", "full"],
        initial: "md",
      },
      {
        name: "disabled",
        label: "Disabled",
        initial: false,
      },
    ],
    keyboard: [
      ["Tab / Shift + Tab", "Move through the available controls."],
      [
        "Arrow keys / Space",
        "Use the primitive’s directional or activation behavior where applicable.",
      ],
    ],
    accessibility:
      "A menubar coordinates movement between Menu roots. Arrow keys move between menus and into their contents. Provide meaningful names and verify the complete interaction with a keyboard. Color alone must not communicate state.",
    lesson:
      "A menubar coordinates movement between Menu roots. Arrow keys move between menus and into their contents. Component aliases reference Dixy semantic tokens; refs, events and render composition are forwarded unchanged. Visual settings follow Dixy shirt sizes, contextual radii and semantic tokens where applicable. Static finishes are optional, and reduced motion is immediate. Base UI keeps refs, state, events, keyboard and presence; this implementation pass does not establish WCAG conformance.",
    token: "--dixy-primitive-gap",
  },
  meter: {
    title: "Meter",
    category: "Content",
    description: "A measurement with meaningful bounds.",
    detail:
      "Meter describes a measurement within a known range, rather than task completion. Name the measurement and retain numeric semantics; semantic color supplements the actual value.",
    primitive: "Meter",
    api: ["MeterRootProps"],
    source: "components/meter.tsx",
    load: () => import("../demos/meter-example"),
    code: () => import("../demos/meter-example?raw"),
    composition: {
      tree: "Meter.Root (value, min, max)\n\u251c\u2500\u2500 Meter.Label + Meter.Value\n\u2514\u2500\u2500 Meter.Track \u2192 Meter.Indicator",
      detail:
        "Meter describes a measurement within a known range, rather than task completion. Name the measurement and retain numeric semantics; semantic color supplements the actual value.",
    },
    controls: [
      {
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
        initial: "md",
      },
      {
        name: "color",
        label: "Color",
        options: ["accent", "neutral", "danger", "success"],
        initial: "accent",
      },
      {
        name: "radius",
        label: "Control radius",
        options: ["none", "sm", "md", "lg", "full"],
        initial: "md",
      },
      {
        name: "material",
        label: "Material",
        options: ["matte", "glossy", "soft", "metal", "paper"],
        initial: "matte",
      },
      {
        name: "level",
        label: "Value",
        initial: "65",
        options: ["25", "65", "90"],
      },
    ],
    keyboard: [],
    accessibility:
      "Meter represents a scalar measurement. Progress represents completion of a task; their semantics are not interchangeable. Provide meaningful names and verify the complete interaction with a keyboard. Color alone must not communicate state.",
    lesson:
      "Meter represents a scalar measurement. Progress represents completion of a task; their semantics are not interchangeable. Component aliases reference Dixy semantic tokens; refs, events and render composition are forwarded unchanged. Visual settings follow Dixy shirt sizes, contextual radii and semantic tokens where applicable. Static finishes are optional, and reduced motion is immediate. Base UI keeps refs, state, events, keyboard and presence; this implementation pass does not establish WCAG conformance.",
    token: "--dixy-primitive-gap",
  },
  "navigation-menu": {
    title: "Navigation Menu",
    category: "Navigation",
    description: "A clear route into your product.",
    detail:
      "Keep real links inside Content and use render composition for router links. Root coordinates selection; Popup uses measured width/height and Viewport clips transitions. This is navigation, not an action Menu.",
    primitive: "NavigationMenu",
    api: ["NavigationMenuRootProps"],
    source: "components/navigation-menu.tsx",
    load: () => import("../demos/navigation-menu-example"),
    code: () => import("../demos/navigation-menu-example?raw"),
    composition: {
      tree: "NavigationMenu.Root\n\u251c\u2500\u2500 NavigationMenu.List\n\u2502   \u2514\u2500\u2500 NavigationMenu.Item\n\u2502       \u251c\u2500\u2500 NavigationMenu.Trigger\n\u2502       \u2514\u2500\u2500 NavigationMenu.Content \u2192 NavigationMenu.Link\n\u2514\u2500\u2500 NavigationMenu.Portal \u2192 NavigationMenu.Positioner\n    \u2514\u2500\u2500 NavigationMenu.Popup \u2192 NavigationMenu.Viewport",
      detail:
        "Keep real links inside Content and use render composition for router links. Root coordinates selection; Popup uses measured width/height and Viewport clips transitions. This is navigation, not an action Menu.",
    },
    controls: [
      {
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
        initial: "md",
      },
      {
        name: "variant",
        label: "Variant",
        options: ["plain", "outline", "soft"],
        initial: "plain",
      },
      {
        name: "radius",
        label: "Control radius",
        options: ["none", "sm", "md", "lg", "full"],
        initial: "md",
      },
      {
        name: "disabled",
        label: "Disabled",
        initial: false,
      },
    ],
    keyboard: [
      ["Tab / Shift + Tab", "Move through the available controls."],
      [
        "Arrow keys / Space",
        "Use the primitive’s directional or activation behavior where applicable.",
      ],
    ],
    accessibility:
      "Navigation destinations remain real links. The shared popup follows active content and Base UI positioning. Provide meaningful names and verify the complete interaction with a keyboard. Color alone must not communicate state.",
    lesson:
      "Navigation destinations remain real links. The shared popup follows active content and Base UI positioning. Component aliases reference Dixy semantic tokens; refs, events and render composition are forwarded unchanged. Visual settings follow Dixy shirt sizes, contextual radii and semantic tokens where applicable. Static finishes are optional, and reduced motion is immediate. Base UI keeps refs, state, events, keyboard and presence; this implementation pass does not establish WCAG conformance.",
    token: "--dixy-primitive-gap",
  },
  "number-field": {
    title: "Number Field",
    category: "Inputs",
    description: "A number, with considered ways to adjust it.",
    detail:
      "Root owns numeric parsing, formatting, bounds and scrubbing. Name increment/decrement actions and associate the input label. Input and steppers share one frame; direct scrubbing has no added interpolation.",
    primitive: "NumberField",
    api: ["NumberFieldRootProps"],
    source: "components/number-field.tsx",
    load: () => import("../demos/number-field-example"),
    code: () => import("../demos/number-field-example?raw"),
    composition: {
      tree: "NumberField.Root (value, min, max, step)\n\u251c\u2500\u2500 NumberField.ScrubArea \u2192 label\n\u2514\u2500\u2500 NumberField.Group\n    \u251c\u2500\u2500 NumberField.Decrement\n    \u251c\u2500\u2500 NumberField.Input\n    \u2514\u2500\u2500 NumberField.Increment",
      detail:
        "Root owns numeric parsing, formatting, bounds and scrubbing. Name increment/decrement actions and associate the input label. Input and steppers share one frame; direct scrubbing has no added interpolation.",
    },
    controls: [
      {
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
        initial: "md",
      },
      {
        name: "variant",
        label: "Variant",
        options: ["outline", "soft"],
        initial: "outline",
      },
      {
        name: "radius",
        label: "Control radius",
        options: ["none", "sm", "md", "lg", "full"],
        initial: "md",
      },
      {
        name: "material",
        label: "Material",
        options: ["matte", "glossy", "soft", "metal", "paper"],
        initial: "matte",
      },
      {
        name: "disabled",
        label: "Disabled",
        initial: false,
      },
    ],
    keyboard: [
      ["Tab / Shift + Tab", "Move through the available controls."],
      [
        "Arrow keys / Space",
        "Use the primitive’s directional or activation behavior where applicable.",
      ],
    ],
    accessibility:
      "Parsing, locale, min/max, keyboard stepping and scrubbing belong to NumberField. Dixy styles its controls. Provide meaningful names and verify the complete interaction with a keyboard. Color alone must not communicate state.",
    lesson:
      "Parsing, locale, min/max, keyboard stepping and scrubbing belong to NumberField. Dixy styles its controls. Component aliases reference Dixy semantic tokens; refs, events and render composition are forwarded unchanged. Visual settings follow Dixy shirt sizes, contextual radii and semantic tokens where applicable. Static finishes are optional, and reduced motion is immediate. Base UI keeps refs, state, events, keyboard and presence; this implementation pass does not establish WCAG conformance.",
    token: "--dixy-primitive-gap",
  },
  "otp-field": {
    title: "OTP Field",
    category: "Inputs",
    description: "One code, a sequence of focused slots.",
    detail:
      "Root owns length, validation, paste and value. Label the overall code and later digit inputs. Use a unique ID per instance and allow native autofill/paste; do not announce every keystroke as an error.",
    primitive: "OTPField",
    api: ["OTPFieldRootProps"],
    source: "components/otp-field.tsx",
    load: () => import("../demos/otp-field-example"),
    code: () => import("../demos/otp-field-example?raw"),
    composition: {
      tree: "label htmlFor=inputId\nOTPField.Root id=inputId (length, value)\n\u251c\u2500\u2500 OTPField.Input\n\u251c\u2500\u2500 OTPField.Input\n\u2514\u2500\u2500 \u2026 remaining inputs / OTPField.Separator",
      detail:
        "Root owns length, validation, paste and value. Label the overall code and later digit inputs. Use a unique ID per instance and allow native autofill/paste; do not announce every keystroke as an error.",
    },
    controls: [
      {
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
        initial: "md",
      },
      {
        name: "variant",
        label: "Variant",
        options: ["outline", "soft"],
        initial: "outline",
      },
      {
        name: "radius",
        label: "Control radius",
        options: ["none", "sm", "md", "lg", "full"],
        initial: "md",
      },
      {
        name: "material",
        label: "Material",
        options: ["matte", "glossy", "soft", "metal", "paper"],
        initial: "matte",
      },
      {
        name: "disabled",
        label: "Disabled",
        initial: false,
      },
    ],
    keyboard: [
      ["Tab / Shift + Tab", "Move through the available controls."],
      [
        "Arrow keys / Space",
        "Use the primitive’s directional or activation behavior where applicable.",
      ],
    ],
    accessibility:
      "Base UI coordinates paste, autofill and focus. Keep slot labels meaningful and never log real verification codes. Provide meaningful names and verify the complete interaction with a keyboard. Color alone must not communicate state.",
    lesson:
      "Base UI coordinates paste, autofill and focus. Keep slot labels meaningful and never log real verification codes. Component aliases reference Dixy semantic tokens; refs, events and render composition are forwarded unchanged. Visual settings follow Dixy shirt sizes, contextual radii and semantic tokens where applicable. Static finishes are optional, and reduced motion is immediate. Base UI keeps refs, state, events, keyboard and presence; this implementation pass does not establish WCAG conformance.",
    token: "--dixy-primitive-gap",
  },
  popover: {
    title: "Popover",
    category: "Overlays",
    description: "A small surface for a focused interaction.",
    detail:
      "Positioner owns side, alignment and collision handling. Popup owns size and surface. Interactive controls belong inside the popup; Base UI owns focus and dismissal.",
    primitive: "Popover",
    api: ["PopoverPopupProps"],
    source: "components/popover.tsx",
    load: () => import("../demos/popover-example"),
    code: () => import("../demos/popover-example?raw"),
    composition: {
      tree: "Popover.Root\n\u251c\u2500\u2500 Popover.Trigger render=Button\n\u2514\u2500\u2500 Popover.Portal \u2192 Popover.Positioner \u2192 Popover.Popup\n    \u251c\u2500\u2500 Popover.Title + Popover.Description\n    \u251c\u2500\u2500 Content\n    \u2514\u2500\u2500 Popover.Close render=Button",
      detail:
        "Positioner owns side, alignment and collision handling. Popup owns size and surface. Interactive controls belong inside the popup; Base UI owns focus and dismissal.",
    },
    controls: [
      {
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
        initial: "md",
      },
      {
        name: "variant",
        label: "Variant",
        options: ["outline", "soft"],
        initial: "outline",
      },
      {
        name: "radius",
        label: "Control radius",
        options: ["none", "sm", "md", "lg", "full"],
        initial: "md",
      },
      {
        name: "material",
        label: "Material",
        options: ["matte", "glossy", "soft", "metal", "paper"],
        initial: "matte",
      },
      {
        name: "disabled",
        label: "Disabled",
        initial: false,
      },
    ],
    keyboard: [
      [
        "Enter / Space",
        "Activate a focused trigger or action, where applicable.",
      ],
      ["Escape", "Dismiss the popup where supported."],
    ],
    accessibility:
      "Popover can contain interactive content. Base UI positions it; ThemeScope restores the token inheritance lost at the DOM portal boundary. Provide meaningful names and verify the complete interaction with a keyboard. Color alone must not communicate state.",
    lesson:
      "Popover can contain interactive content. Base UI positions it; ThemeScope restores the token inheritance lost at the DOM portal boundary. Component aliases reference Dixy semantic tokens; refs, events and render composition are forwarded unchanged. Visual settings follow Dixy shirt sizes, contextual radii and semantic tokens where applicable. Static finishes are optional, and reduced motion is immediate. Base UI keeps refs, state, events, keyboard and presence; this implementation pass does not establish WCAG conformance.",
    token: "--dixy-popup-background",
  },
  "preview-card": {
    title: "Preview Card",
    category: "Overlays",
    description: "A glimpse before you follow a link.",
    detail:
      "Use this for supplementary link previews, with an actual destination on the trigger. Essential information must remain available without hovering. Use Popover for an explicitly opened interactive workflow.",
    primitive: "PreviewCard",
    api: ["PreviewCardPopupProps"],
    source: "components/preview-card.tsx",
    load: () => import("../demos/preview-card-example"),
    code: () => import("../demos/preview-card-example?raw"),
    composition: {
      tree: "PreviewCard.Root\n\u251c\u2500\u2500 PreviewCard.Trigger href=destination\n\u2514\u2500\u2500 PreviewCard.Portal \u2192 PreviewCard.Positioner \u2192 PreviewCard.Popup",
      detail:
        "Use this for supplementary link previews, with an actual destination on the trigger. Essential information must remain available without hovering. Use Popover for an explicitly opened interactive workflow.",
    },
    controls: [
      {
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
        initial: "md",
      },
      {
        name: "variant",
        label: "Variant",
        options: ["outline", "soft"],
        initial: "outline",
      },
      {
        name: "radius",
        label: "Control radius",
        options: ["none", "sm", "md", "lg", "full"],
        initial: "md",
      },
      {
        name: "material",
        label: "Material",
        options: ["matte", "glossy", "soft", "metal", "paper"],
        initial: "matte",
      },
    ],
    keyboard: [
      [
        "Enter / Space",
        "Activate a focused trigger or action, where applicable.",
      ],
      ["Escape", "Dismiss the popup where supported."],
    ],
    accessibility:
      "PreviewCard adds context to a destination. The trigger still needs a useful link and a readable accessible name. Provide meaningful names and verify the complete interaction with a keyboard. Color alone must not communicate state.",
    lesson:
      "PreviewCard adds context to a destination. The trigger still needs a useful link and a readable accessible name. Component aliases reference Dixy semantic tokens; refs, events and render composition are forwarded unchanged. Visual settings follow Dixy shirt sizes, contextual radii and semantic tokens where applicable. Static finishes are optional, and reduced motion is immediate. Base UI keeps refs, state, events, keyboard and presence; this implementation pass does not establish WCAG conformance.",
    token: "--dixy-popup-background",
  },
  progress: {
    title: "Progress",
    category: "Content",
    description: "Make real work visible.",
    detail:
      "Use a determinate value for measured work and null when progress is unknown. Keep an accessible name. This pass uses a static indeterminate fill rather than adding a decorative continuous animation.",
    primitive: "Progress",
    api: ["ProgressRootProps"],
    source: "components/progress.tsx",
    load: () => import("../demos/progress-example"),
    code: () => import("../demos/progress-example?raw"),
    composition: {
      tree: "Progress.Root (value or null)\n\u251c\u2500\u2500 Progress.Label + Progress.Value\n\u2514\u2500\u2500 Progress.Track \u2192 Progress.Indicator",
      detail:
        "Use a determinate value for measured work and null when progress is unknown. Keep an accessible name. This pass uses a static indeterminate fill rather than adding a decorative continuous animation.",
    },
    controls: [
      {
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
        initial: "md",
      },
      {
        name: "color",
        label: "Color",
        options: ["accent", "neutral", "danger", "success"],
        initial: "accent",
      },
      {
        name: "radius",
        label: "Control radius",
        options: ["none", "sm", "md", "lg", "full"],
        initial: "md",
      },
      {
        name: "material",
        label: "Material",
        options: ["matte", "glossy", "soft", "metal", "paper"],
        initial: "matte",
      },
      {
        name: "indeterminate",
        label: "Indeterminate",
        initial: false,
      },
      {
        name: "level",
        label: "Value",
        initial: "65",
        options: ["25", "65", "90"],
      },
    ],
    keyboard: [],
    accessibility:
      "The indicator width follows the actual value. Indeterminate progress must not invent a completion percentage. Provide meaningful names and verify the complete interaction with a keyboard. Color alone must not communicate state.",
    lesson:
      "The indicator width follows the actual value. Indeterminate progress must not invent a completion percentage. Component aliases reference Dixy semantic tokens; refs, events and render composition are forwarded unchanged. Visual settings follow Dixy shirt sizes, contextual radii and semantic tokens where applicable. Static finishes are optional, and reduced motion is immediate. Base UI keeps refs, state, events, keyboard and presence; this implementation pass does not establish WCAG conformance.",
    token: "--dixy-primitive-gap",
  },
  "radio-group": {
    title: "Radio Group",
    category: "Inputs",
    description: "One clear answer from a set of choices.",
    detail:
      "RadioGroup owns the selected value and native radio navigation. Each labeled Radio.Root owns its visual settings. The group orientation controls layout; radios remain circular and unchecked choices stay neutral.",
    primitive: "RadioGroup",
    api: ["RadioRootProps", "RadioGroupProps"],
    source: "components/radio-group.tsx",
    load: () => import("../demos/radio-group-example"),
    code: () => import("../demos/radio-group-example?raw"),
    composition: {
      tree: "RadioGroup (accessible name, value, disabled)\n\u2514\u2500\u2500 label\n    \u251c\u2500\u2500 Radio.Root value=plan\n    \u2502   \u2514\u2500\u2500 Radio.Indicator (decoration)\n    \u2514\u2500\u2500 Plan label",
      detail:
        "RadioGroup owns the selected value and native radio navigation. Each labeled Radio.Root owns its visual settings. The group orientation controls layout; radios remain circular and unchecked choices stay neutral.",
    },
    controls: [
      {
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
        initial: "md",
      },
      {
        name: "variant",
        label: "Variant",
        options: ["solid", "soft", "outline"],
        initial: "solid",
      },
      {
        name: "color",
        label: "Color",
        options: ["accent", "neutral", "danger", "success"],
        initial: "accent",
      },
      {
        name: "material",
        label: "Material",
        options: ["matte", "glossy", "soft", "metal", "paper"],
        initial: "matte",
      },
      {
        name: "orientation",
        label: "Orientation",
        initial: "vertical",
        options: ["horizontal", "vertical"],
      },
      {
        name: "disabled",
        label: "Disabled",
        initial: false,
      },
    ],
    keyboard: [
      ["Tab", "Enter or leave the group."],
      ["Arrow keys", "Move focus and select a radio."],
      ["Space", "Select the focused option."],
    ],
    accessibility:
      "RadioGroup coordinates values; Radio owns each option. Arrow keys select within the group while Tab moves between groups. Provide meaningful names and verify the complete interaction with a keyboard. Color alone must not communicate state.",
    lesson:
      "RadioGroup coordinates values; Radio owns each option. Arrow keys select within the group while Tab moves between groups. Component aliases reference Dixy semantic tokens; refs, events and render composition are forwarded unchanged. Visual settings follow Dixy shirt sizes, contextual radii and semantic tokens where applicable. Static finishes are optional, and reduced motion is immediate. Base UI keeps refs, state, events, keyboard and presence; this implementation pass does not establish WCAG conformance.",
    token: "--dixy-choice-size",
  },
  "scroll-area": {
    title: "Scroll Area",
    category: "Content",
    description: "Native scrolling, a considered frame.",
    detail:
      "The viewport owns native scrolling and its accessible name. Add the corresponding scrollbar for each overflowing axis. Preserve native keyboard scrolling and visible viewport focus; visual size adjusts scrollbar thickness.",
    primitive: "ScrollArea",
    api: ["ScrollAreaRootProps"],
    source: "components/scroll-area.tsx",
    load: () => import("../demos/scroll-area-example"),
    code: () => import("../demos/scroll-area-example?raw"),
    composition: {
      tree: "ScrollArea.Root (bounded size)\n\u251c\u2500\u2500 ScrollArea.Viewport (keyboard focus)\n\u2502   \u2514\u2500\u2500 ScrollArea.Content\n\u251c\u2500\u2500 ScrollArea.Scrollbar orientation=vertical \u2192 ScrollArea.Thumb\n\u251c\u2500\u2500 ScrollArea.Scrollbar orientation=horizontal \u2192 ScrollArea.Thumb\n\u2514\u2500\u2500 ScrollArea.Corner",
      detail:
        "The viewport owns native scrolling and its accessible name. Add the corresponding scrollbar for each overflowing axis. Preserve native keyboard scrolling and visible viewport focus; visual size adjusts scrollbar thickness.",
    },
    controls: [
      {
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
        initial: "md",
      },
      {
        name: "variant",
        label: "Variant",
        options: ["plain", "outline", "soft"],
        initial: "plain",
      },
      {
        name: "radius",
        label: "Control radius",
        options: ["none", "sm", "md", "lg", "full"],
        initial: "md",
      },
      {
        name: "horizontal",
        label: "Horizontal overflow",
        initial: false,
      },
      {
        name: "long",
        label: "Overflow content",
        initial: true,
      },
    ],
    keyboard: [],
    accessibility:
      "Base UI keeps native scrolling behavior. A bounded viewport must remain keyboard reachable and work with touch. Provide meaningful names and verify the complete interaction with a keyboard. Color alone must not communicate state.",
    lesson:
      "Base UI keeps native scrolling behavior. A bounded viewport must remain keyboard reachable and work with touch. Component aliases reference Dixy semantic tokens; refs, events and render composition are forwarded unchanged. Visual settings follow Dixy shirt sizes, contextual radii and semantic tokens where applicable. Static finishes are optional, and reduced motion is immediate. Base UI keeps refs, state, events, keyboard and presence; this implementation pass does not establish WCAG conformance.",
    token: "--dixy-primitive-gap",
  },
  select: {
    title: "Select",
    category: "Inputs",
    description: "A familiar choice, precisely presented.",
    detail:
      "Root owns value, multiple and disabled state. Trigger owns control visuals; Popup independently owns portaled list visuals. ItemText provides option text. Keep clear actions beside the trigger rather than nesting another button inside it.",
    primitive: "Select",
    api: ["SelectTriggerProps", "SelectPopupProps"],
    source: "components/select.tsx",
    load: () => import("../demos/select-example"),
    code: () => import("../demos/select-example?raw"),
    composition: {
      tree: "Field.Root\n\u251c\u2500\u2500 Field.Label\n\u251c\u2500\u2500 Select.Root\n\u2502   \u251c\u2500\u2500 Select.Trigger \u2192 Select.Value + Select.Icon\n\u2502   \u2514\u2500\u2500 Select.Portal \u2192 Select.Positioner \u2192 Select.Popup \u2192 Select.List\n\u2502       \u2514\u2500\u2500 Select.Item \u2192 Select.ItemText + Select.ItemIndicator\n\u251c\u2500\u2500 Field.Description\n\u2514\u2500\u2500 Field.Error",
      detail:
        "Root owns value, multiple and disabled state. Trigger owns control visuals; Popup independently owns portaled list visuals. ItemText provides option text. Keep clear actions beside the trigger rather than nesting another button inside it.",
    },
    controls: [
      {
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
        initial: "md",
      },
      {
        name: "variant",
        label: "Variant",
        options: ["outline", "soft"],
        initial: "outline",
      },
      {
        name: "radius",
        label: "Control radius",
        options: ["none", "sm", "md", "lg", "full"],
        initial: "md",
      },
      {
        name: "material",
        label: "Material",
        options: ["matte", "glossy", "soft", "metal", "paper"],
        initial: "matte",
      },
      {
        name: "multiple",
        label: "Multiple selection",
        initial: false,
      },
      {
        name: "invalid",
        label: "Invalid",
        initial: false,
      },
      {
        name: "disableEnterprise",
        label: "Disable enterprise",
        initial: false,
      },
      {
        name: "disabled",
        label: "Disabled",
        initial: false,
      },
    ],
    keyboard: [
      ["Tab / Shift + Tab", "Move through the available controls."],
      [
        "Arrow keys / Space",
        "Use the primitive’s directional or activation behavior where applicable.",
      ],
    ],
    accessibility:
      "Select chooses from a defined set. Keep labels, placeholder, value display and native form values aligned. Provide meaningful names and verify the complete interaction with a keyboard. Color alone must not communicate state.",
    lesson:
      "Select chooses from a defined set. Keep labels, placeholder, value display and native form values aligned. Component aliases reference Dixy semantic tokens; refs, events and render composition are forwarded unchanged. Visual settings follow Dixy shirt sizes, contextual radii and semantic tokens where applicable. Static finishes are optional, and reduced motion is immediate. Base UI keeps refs, state, events, keyboard and presence; this implementation pass does not establish WCAG conformance.",
    token: "--dixy-primitive-gap",
  },
  separator: {
    title: "Separator",
    category: "Content",
    description: "A quiet boundary between related things.",
    detail:
      "Use semantic separation only when it communicates structure. Decorative lines should not add unnecessary announcements.",
    primitive: "Separator",
    api: ["SeparatorProps"],
    source: "components/separator.tsx",
    load: () => import("../demos/separator-example"),
    code: () => import("../demos/separator-example?raw"),
    composition: {
      tree: "Separator (orientation, emphasis)",
      detail:
        "Separator is a single semantic divider rather than a compound family. Orientation comes from Base UI. Emphasis adjusts visual contrast without changing semantics.",
    },
    controls: [
      {
        name: "emphasis",
        label: "Emphasis",
        options: ["subtle", "strong"],
        initial: "subtle",
      },
      {
        name: "orientation",
        label: "Orientation",
        options: ["horizontal", "vertical"],
        initial: "horizontal",
      },
    ],
    keyboard: [],
    accessibility:
      "Use semantic separation only when it communicates structure. Decorative lines should not add unnecessary announcements. Provide meaningful names and verify the complete interaction with a keyboard. Color alone must not communicate state.",
    lesson:
      "Use semantic separation only when it communicates structure. Decorative lines should not add unnecessary announcements. Component aliases reference Dixy semantic tokens; refs, events and render composition are forwarded unchanged.",
    token: "--dixy-primitive-gap",
  },
  slider: {
    title: "Slider",
    category: "Inputs",
    description: "Adjust a value along a meaningful range.",
    detail:
      "Root preserves scalar/array value inference. Label each thumb separately for a range. Control owns pointer interaction; thumb and fill positioning follow Base UI immediately, including RTL and vertical use.",
    primitive: "Slider",
    api: ["SliderRootProps"],
    source: "components/slider.tsx",
    load: () => import("../demos/slider-example"),
    code: () => import("../demos/slider-example?raw"),
    composition: {
      tree: "Slider.Root (value, orientation, min/max)\n\u251c\u2500\u2500 Slider.Label + Slider.Value\n\u2514\u2500\u2500 Slider.Control\n    \u251c\u2500\u2500 Slider.Track \u2192 Slider.Indicator\n    \u251c\u2500\u2500 Slider.Thumb index=0\n    \u2514\u2500\u2500 Slider.Thumb index=1 (range)",
      detail:
        "Root preserves scalar/array value inference. Label each thumb separately for a range. Control owns pointer interaction; thumb and fill positioning follow Base UI immediately, including RTL and vertical use.",
    },
    controls: [
      {
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
        initial: "md",
      },
      {
        name: "color",
        label: "Color",
        options: ["accent", "neutral", "danger", "success"],
        initial: "accent",
      },
      {
        name: "radius",
        label: "Control radius",
        options: ["none", "sm", "md", "lg", "full"],
        initial: "md",
      },
      {
        name: "material",
        label: "Material",
        options: ["matte", "glossy", "soft", "metal", "paper"],
        initial: "matte",
      },
      {
        name: "orientation",
        label: "Orientation",
        options: ["horizontal", "vertical"],
        initial: "horizontal",
      },
      {
        name: "range",
        label: "Range",
        initial: false,
      },
      {
        name: "disabled",
        label: "Disabled",
        initial: false,
      },
    ],
    keyboard: [
      ["Tab / Shift + Tab", "Move through the available controls."],
      [
        "Arrow keys / Space",
        "Use the primitive’s directional or activation behavior where applicable.",
      ],
    ],
    accessibility:
      "The visible thumb and activation target differ. Preserve min/max/step, keyboard controls and multiple-thumb constraints. Provide meaningful names and verify the complete interaction with a keyboard. Color alone must not communicate state.",
    lesson:
      "The visible thumb and activation target differ. Preserve min/max/step, keyboard controls and multiple-thumb constraints. Component aliases reference Dixy semantic tokens; refs, events and render composition are forwarded unchanged. Visual settings follow Dixy shirt sizes, contextual radii and semantic tokens where applicable. Static finishes are optional, and reduced motion is immediate. Base UI keeps refs, state, events, keyboard and presence; this implementation pass does not establish WCAG conformance.",
    token: "--dixy-slider-thumb-size",
  },
  toast: {
    title: "Toast",
    category: "Overlays",
    description: "Useful feedback that does not interrupt the task.",
    detail:
      "Provider and manager own queue, timing and announcements. Root renders each toast record; do not add a second live region. Dismiss has a stable accessible name, and long-lived actionable messages need appropriate timeout behavior.",
    primitive: "Toast",
    api: ["ToastRootProps"],
    source: "components/toast.tsx",
    load: () => import("../demos/toast-example"),
    code: () => import("../demos/toast-example?raw"),
    composition: {
      tree: "Toast.Provider\n\u251c\u2500\u2500 Button \u2192 Toast.useToastManager().add\n\u2514\u2500\u2500 Toast.Portal \u2192 Toast.Viewport\n    \u2514\u2500\u2500 Toast.Root toast=record\n        \u251c\u2500\u2500 Toast.Content \u2192 Toast.Title + Toast.Description\n        \u251c\u2500\u2500 Toast.Action (optional)\n        \u2514\u2500\u2500 Toast.Close",
      detail:
        "Provider and manager own queue, timing and announcements. Root renders each toast record; do not add a second live region. Dismiss has a stable accessible name, and long-lived actionable messages need appropriate timeout behavior.",
    },
    controls: [
      {
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
        initial: "md",
      },
      {
        name: "variant",
        label: "Variant",
        options: ["outline", "soft"],
        initial: "outline",
      },
      {
        name: "radius",
        label: "Control radius",
        options: ["none", "sm", "md", "lg", "full"],
        initial: "md",
      },
      {
        name: "material",
        label: "Material",
        options: ["matte", "glossy", "soft", "metal", "paper"],
        initial: "matte",
      },
      {
        name: "disabled",
        label: "Disabled",
        initial: false,
      },
    ],
    keyboard: [
      [
        "Enter / Space",
        "Activate a focused trigger or action, where applicable.",
      ],
      ["Escape", "Dismiss the popup where supported."],
    ],
    accessibility:
      "Use a provider and manager for lifecycle and announcements. Lifetime, pause and dismissal are distinct from enter/exit animation. Provide meaningful names and verify the complete interaction with a keyboard. Color alone must not communicate state.",
    lesson:
      "Use a provider and manager for lifecycle and announcements. Lifetime, pause and dismissal are distinct from enter/exit animation. Component aliases reference Dixy semantic tokens; refs, events and render composition are forwarded unchanged. Visual settings follow Dixy shirt sizes, contextual radii and semantic tokens where applicable. Static finishes are optional, and reduced motion is immediate. Base UI keeps refs, state, events, keyboard and presence; this implementation pass does not establish WCAG conformance.",
    token: "--dixy-popup-background",
  },
  toggle: {
    title: "Toggle",
    category: "Inputs",
    description: "A button that remembers its state.",
    detail:
      "Toggle is a single pressed-state button. Keep its accessible label stable and use it for persistent formatting or modes, rather than a momentary action.",
    primitive: "Toggle",
    api: ["ToggleProps"],
    source: "components/toggle.tsx",
    load: () => import("../demos/toggle-example"),
    code: () => import("../demos/toggle-example?raw"),
    composition: {
      tree: "Toggle (pressed, accessible name)\n\u2514\u2500\u2500 Text or decorative artwork",
      detail:
        "Toggle is a single pressed-state button. Keep its accessible label stable and use it for persistent formatting or modes, rather than a momentary action.",
    },
    controls: [
      {
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
        initial: "md",
      },
      {
        name: "variant",
        label: "Variant",
        options: ["solid", "soft", "outline", "ghost"],
        initial: "soft",
      },
      {
        name: "color",
        label: "Color",
        options: ["accent", "neutral", "danger", "success"],
        initial: "accent",
      },
      {
        name: "radius",
        label: "Control radius",
        options: ["none", "sm", "md", "lg", "full"],
        initial: "md",
      },
      {
        name: "material",
        label: "Material",
        options: ["matte", "glossy", "soft", "metal", "paper"],
        initial: "matte",
      },
      {
        name: "disabled",
        label: "Disabled",
        initial: false,
      },
    ],
    keyboard: [
      ["Tab / Shift + Tab", "Move through the available controls."],
      [
        "Arrow keys / Space",
        "Use the primitive’s directional or activation behavior where applicable.",
      ],
    ],
    accessibility:
      "Toggle exposes pressed state. A stable accessible name lets assistive technology announce the changed state clearly. Provide meaningful names and verify the complete interaction with a keyboard. Color alone must not communicate state.",
    lesson:
      "Toggle exposes pressed state. A stable accessible name lets assistive technology announce the changed state clearly. Component aliases reference Dixy semantic tokens; refs, events and render composition are forwarded unchanged. Visual settings follow Dixy shirt sizes, contextual radii and semantic tokens where applicable. Static finishes are optional, and reduced motion is immediate. Base UI keeps refs, state, events, keyboard and presence; this implementation pass does not establish WCAG conformance.",
    token: "--dixy-primitive-gap",
  },
  "toggle-group": {
    title: "Toggle Group",
    category: "Inputs",
    description: "Related states, held together.",
    detail:
      "ToggleGroup owns selection and roving focus. Toggle owns size, emphasis, color, radius and finish. attached connects borders; it does not turn the group into a ButtonGroup. segmented draws a sunken track with a raised thumb on the pressed toggle, for compact exclusive choices.",
    primitive: "ToggleGroup",
    api: ["ToggleProps", "ToggleGroupProps"],
    source: "components/toggle-group.tsx",
    load: () => import("../demos/toggle-group-example"),
    code: () => import("../demos/toggle-group-example?raw"),
    composition: {
      tree: "ToggleGroup (value, multiple, orientation)\n\u251c\u2500\u2500 Toggle value=bold\n\u251c\u2500\u2500 Toggle value=italic\n\u2514\u2500\u2500 Toggle value=underline",
      detail:
        "ToggleGroup owns selection and roving focus. Toggle owns size, emphasis, color, radius and finish. attached connects borders; it does not turn the group into a ButtonGroup. segmented draws a sunken track with a raised thumb on the pressed toggle, for compact exclusive choices.",
    },
    controls: [
      {
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
        initial: "md",
      },
      {
        name: "variant",
        label: "Variant",
        options: ["solid", "soft", "outline", "ghost"],
        initial: "soft",
      },
      {
        name: "color",
        label: "Color",
        options: ["accent", "neutral", "danger", "success"],
        initial: "accent",
      },
      {
        name: "radius",
        label: "Control radius",
        options: ["none", "sm", "md", "lg", "full"],
        initial: "md",
      },
      {
        name: "material",
        label: "Material",
        options: ["matte", "glossy", "soft", "metal", "paper"],
        initial: "matte",
      },
      {
        name: "orientation",
        label: "Orientation",
        initial: "horizontal",
        options: ["horizontal", "vertical"],
      },
      {
        name: "attached",
        label: "Attached",
        initial: false,
      },
      {
        name: "segmented",
        label: "Segmented",
        initial: false,
      },
      {
        name: "disabled",
        label: "Disabled",
        initial: false,
      },
      {
        name: "multiple",
        label: "Multiple",
        initial: false,
      },
    ],
    keyboard: [
      ["Tab / Shift + Tab", "Move through the available controls."],
      [
        "Arrow keys / Space",
        "Use the primitive’s directional or activation behavior where applicable.",
      ],
    ],
    accessibility:
      "Single and multiple selection use the same value-array contract. Base UI handles group focus and disabled behavior. Provide meaningful names and verify the complete interaction with a keyboard. Color alone must not communicate state.",
    lesson:
      "Single and multiple selection use the same value-array contract. Base UI handles group focus and disabled behavior. Component aliases reference Dixy semantic tokens; refs, events and render composition are forwarded unchanged. Visual settings follow Dixy shirt sizes, contextual radii and semantic tokens where applicable. Static finishes are optional, and reduced motion is immediate. Base UI keeps refs, state, events, keyboard and presence; this implementation pass does not establish WCAG conformance.",
    token: "--dixy-primitive-gap",
  },
  toolbar: {
    title: "Toolbar",
    category: "Navigation",
    description: "A focused home for related tools.",
    detail:
      "Toolbar uses roving focus to reduce Tab stops. Preserve the roles of links, inputs, buttons and separators inside it.",
    primitive: "Toolbar",
    api: ["ToolbarRootProps"],
    source: "components/toolbar.tsx",
    load: () => import("../demos/toolbar-example"),
    code: () => import("../demos/toolbar-example?raw"),
    composition: {
      tree: "Toolbar.Root (accessible name, orientation)\n├── Toolbar.Group → Toolbar.Button / Toolbar.Link\n├── Toolbar.Separator\n└── Toolbar.Input",
      detail:
        "Toolbar owns roving focus. Use its Button, Link and Input parts to participate in that behavior, and a visible or accessible name. Use ordinary buttons when ordinary Tab stops are intended.",
    },
    controls: [
      {
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
        initial: "md",
      },
      {
        name: "variant",
        label: "Variant",
        options: ["plain", "outline", "soft"],
        initial: "plain",
      },
      {
        name: "radius",
        label: "Control radius",
        options: ["none", "sm", "md", "lg", "full"],
        initial: "md",
      },
      { name: "disabled", label: "Disabled", initial: false },
    ],
    keyboard: [
      ["Tab / Shift + Tab", "Move through the available controls."],
      [
        "Arrow keys / Space",
        "Use the primitive’s directional or activation behavior where applicable.",
      ],
    ],
    accessibility:
      "Toolbar uses roving focus to reduce Tab stops. Preserve the roles of links, inputs, buttons and separators inside it. Provide meaningful names and verify the complete interaction with a keyboard. Color alone must not communicate state.",
    lesson:
      "Toolbar uses roving focus to reduce Tab stops. Preserve the roles of links, inputs, buttons and separators inside it. Component aliases reference Dixy semantic tokens; refs, events and render composition are forwarded unchanged.",
    token: "--dixy-primitive-gap",
  },
  field: {
    title: "Field",
    category: "Inputs",
    description: "The relationship around an input.",
    detail:
      "Field connects labels, controls, help and errors. TextField adds the richer input visuals; Field.Control remains the low-level input contract. Horizontal layout keeps help and errors with the control.",
    primitive: "Field",
    api: ["FieldRootProps", "TextFieldProps"],
    source: "components/text-field.tsx",
    load: () => import("../demos/field-example"),
    code: () => import("../demos/field-example?raw"),
    composition: {
      tree: "Field.Root (name, invalid, disabled)\n\u251c\u2500\u2500 Field.Label\n\u251c\u2500\u2500 TextField or Field.Control\n\u251c\u2500\u2500 Field.Description\n\u2514\u2500\u2500 Field.Error",
      detail:
        "Field connects labels, controls, help and errors. TextField adds the richer input visuals; Field.Control remains the low-level input contract. Horizontal layout keeps help and errors with the control.",
    },
    controls: [
      {
        name: "orientation",
        label: "Orientation",
        initial: "vertical",
        options: ["vertical", "horizontal"],
      },
      {
        name: "disabled",
        label: "Disabled",
        initial: false,
      },
      {
        name: "invalid",
        label: "Invalid",
        initial: false,
      },
    ],
    keyboard: [["Tab", "Focus the labeled control."]],
    accessibility:
      "Field.Label and Field.Description establish accessible relationships. Field.Error describes recovery; never rely on border color alone.",
    lesson:
      "Field is a relationship between parts. Control and Item retain registration and validation context; Validity exposes the current validation state without rendering a control. Visual settings follow Dixy shirt sizes, contextual radii and semantic tokens where applicable. Static finishes are optional, and reduced motion is immediate. Base UI keeps refs, state, events, keyboard and presence; this implementation pass does not establish WCAG conformance.",
    token: "--dixy-input-border",
  },
} as const;
