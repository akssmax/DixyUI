import { additionComponentRegistry } from "./addition-components.ts";
import { baseComponentRegistry } from "./base-components.ts";
import { aiComponentRegistry } from "./ai-components.ts";
export type Control = {
  name: string;
  label: string;
  options?: readonly string[];
  initial: string | boolean;
};
export type DemoState = Record<string, string | boolean>;

export const componentRegistry = {
  ...baseComponentRegistry,
  ...additionComponentRegistry,
  ...aiComponentRegistry,
  button: {
    title: "Button",
    category: "Actions",
    description: "A little push. A clear next step.",
    detail:
      "A button turns intent into action. Choose the right emphasis, give it a clear label, and let the details do their work.",
    primitive: "Button",
    api: ["ButtonProps", "IconButtonProps"],
    source: "components/button.tsx",
    load: () => import("../demos/button-example"),
    code: () => import("../demos/button-example?raw"),
    controls: [
      {
        name: "variant",
        label: "Variant",
        options: ["solid", "soft", "outline", "ghost"],
        initial: "solid",
      },
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
        name: "material",
        label: "Material",
        options: ["matte", "glossy", "soft", "metal", "paper"],
        initial: "matte",
      },
      {
        name: "shape",
        label: "Shape",
        options: ["rounded", "pill", "square"],
        initial: "rounded",
      },
      { name: "disabled", label: "Disabled", initial: false },
      { name: "loading", label: "Loading", initial: false },
    ],
    keyboard: [
      ["Tab", "Move focus to the button."],
      ["Enter / Space", "Activate the focused button."],
    ],
    accessibility:
      'Use a verb that explains the action. IconButton requires an aria-label. Loading communicates aria-busy and disables activation; keep a visible label. For navigation, use render with an anchor, nativeButton={false}, and role="link" so its semantics match its purpose.',
    lesson:
      "The wrapper adds a visual API while forwarding Base UI props and refs. Loading changes behavior as well as appearance: it must prevent duplicate actions.",
    token: "--dixy-button-primary-background",
  },
  "text-field": {
    title: "Text Field",
    category: "Inputs",
    description: "Room for a thought to take shape.",
    detail:
      "TextField is the styled input; Field owns label, description and validation relationships. Native editing, autocomplete, refs and value callbacks remain with Base UI. Use Field.Control for the lower-level input contract.",
    primitive: "Input",
    api: ["TextFieldProps"],
    source: "components/text-field.tsx",
    load: () => import("../demos/text-field-example"),
    code: () => import("../demos/text-field-example?raw"),
    composition: {
      tree: "Field.Root (invalid, disabled)\n\u251c\u2500\u2500 Field.Label\n\u251c\u2500\u2500 TextField (size, variant, radius, material)\n\u251c\u2500\u2500 Field.Description\n\u2514\u2500\u2500 Field.Error",
      detail:
        "TextField is the styled input; Field owns label, description and validation relationships. Native editing, autocomplete, refs and value callbacks remain with Base UI. Use Field.Control for the lower-level input contract.",
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
        name: "invalid",
        label: "Invalid",
        initial: false,
      },
    ],
    keyboard: [
      ["Tab", "Move focus into or out of the input."],
      ["Arrow keys", "Move the text caret using native input behavior."],
    ],
    accessibility:
      "A placeholder is not a label. Field.Label and Field.Description establish accessible relationships. Invalid fields should explain how to recover through Field.Error. Keep native autocomplete and form semantics.",
    lesson:
      "Field and Input share Base UI context. The label and description are linked without hand-written IDs. Controlled values need a matching onValueChange callback. Visual settings follow Dixy shirt sizes, contextual radii and semantic tokens where applicable. Static finishes are optional, and reduced motion is immediate. Base UI keeps refs, state, events, keyboard and presence; this implementation pass does not establish WCAG conformance.",
    token: "--dixy-input-border",
  },
  dialog: {
    title: "Dialog",
    category: "Overlays",
    description: "A moment of focus, thoughtfully framed.",
    detail:
      "Popup owns size, surface, rounding and finish. Title names the dialog; Description supplies concise context. Keep a visible close action and let Base UI handle modal focus and return focus.",
    primitive: "Dialog",
    api: ["DialogPopupProps"],
    source: "components/dialog.tsx",
    load: () => import("../demos/dialog-example"),
    code: () => import("../demos/dialog-example?raw"),
    composition: {
      tree: "Dialog.Root (open)\n\u251c\u2500\u2500 Dialog.Trigger render=Button\n\u2514\u2500\u2500 Dialog.Portal\n    \u251c\u2500\u2500 Dialog.Backdrop\n    \u2514\u2500\u2500 Dialog.Viewport \u2192 Dialog.Popup\n        \u251c\u2500\u2500 Dialog.Title + Dialog.Description\n        \u251c\u2500\u2500 Form / content\n        \u2514\u2500\u2500 Dialog.Close render=Button + submit action",
      detail:
        "Popup owns size, surface, rounding and finish. Title names the dialog; Description supplies concise context. Keep a visible close action and let Base UI handle modal focus and return focus.",
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
      ["Enter / Space", "Open the dialog from its trigger."],
      [
        "Tab / Shift + Tab",
        "Move between focusable controls inside the modal.",
      ],
      ["Escape", "Close the dialog and restore focus to its trigger."],
    ],
    accessibility:
      "Include Dialog.Title and Dialog.Description. Keep an explicit close action. Base UI manages modal focus behavior; Dixy preserves those parts and reapplies the nearest theme inside the portal.",
    lesson:
      "React context crosses a portal, but CSS inheritance follows the DOM. ThemeScope uses context to reapply theme attributes to the portaled subtree. Test a light dialog inside a dark page. Visual settings follow Dixy shirt sizes, contextual radii and semantic tokens where applicable. Static finishes are optional, and reduced motion is immediate. Base UI keeps refs, state, events, keyboard and presence; this implementation pass does not establish WCAG conformance.",
    token: "--dixy-shadow",
  },
  icon: {
    title: "Icon",
    category: "Content",
    description: "One contract. Your choice of character.",
    detail:
      "Consistent size, semantic color and accessible naming for the SVG icons you already use. Keep each pack’s artwork and install only what your application needs.",
    primitive: null,
    api: ["IconProps"],
    source: "components/icon.tsx",
    load: () => import("../demos/icon-example"),
    code: () => import("../demos/icon-example?raw"),
    controls: [
      {
        name: "pack",
        label: "Icon pack",
        options: ["lucide", "phosphor"],
        initial: "lucide",
      },
      {
        name: "size",
        label: "Icon size",
        options: ["xs", "sm", "md", "lg", "xl", "2xl"],
        initial: "lg",
      },
      {
        name: "color",
        label: "Icon color",
        options: [
          "inherit",
          "primary",
          "secondary",
          "disabled",
          "success",
          "danger",
          "warning",
          "information",
          "discovery",
        ],
        initial: "primary",
      },
      { name: "named", label: "Named image", initial: false },
    ],
    keyboard: [],
    accessibility:
      "Icons are decorative and hidden from assistive technology by default. Supply label for a meaningful standalone image. Put an action’s accessible name on IconButton; keep its child Icon decorative. Color never replaces status text. Icon itself is not a keyboard control.",
    lesson:
      "The design system owns the visual and accessibility contract. The icon pack owns SVG geometry, fill, stroke and pack-specific props. render composition preserves SVG refs, events and viewBox without adding a wrapper or a runtime network dependency.",
    token: "--dixy-size-icon-md",
  },
  typography: {
    title: "Typography",
    category: "Content",
    description: "Give every word its own weight.",
    detail:
      "Expressive headings. Comfortable reading. A small type system that separates visual hierarchy from semantic meaning.",
    primitive: null,
    api: ["TextProps", "HeadingProps"],
    source: "components/typography.tsx",
    load: () => import("../demos/typography-example"),
    code: () => import("../demos/typography-example?raw"),
    controls: [
      {
        name: "headingVariant",
        label: "Heading role",
        options: [
          "display.lg",
          "display.md",
          "display.sm",
          "heading.lg",
          "heading.md",
          "heading.sm",
          "title.lg",
          "title.md",
          "title.sm",
        ],
        initial: "heading.sm",
      },
      {
        name: "textVariant",
        label: "Text role",
        options: [
          "body.lg",
          "body.md",
          "body.sm",
          "label.lg",
          "label.md",
          "label.sm",
          "caption",
          "code.md",
          "code.sm",
        ],
        initial: "body.md",
      },
      {
        name: "tone",
        label: "Text tone",
        options: ["default", "muted", "accent"],
        initial: "muted",
      },
    ],
    keyboard: [],
    accessibility:
      "Choose the heading element for document structure, then choose its size for visual hierarchy. Keep body text readable at zoom. Font families inherit from theme tokens and can be overridden by the consuming app.",
    lesson:
      "A heading’s semantic level and its visual size are independent. A component library should make correct HTML easier without imposing a page outline.",
    token: "--dixy-font-body-md",
  },
} as const;

export type ComponentSlug = keyof typeof componentRegistry;
export function isComponentSlug(value: string): value is ComponentSlug {
  return Object.hasOwn(componentRegistry, value);
}
