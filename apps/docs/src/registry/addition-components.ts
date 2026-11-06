// Authored examples for native, Base UI compositions and React Aria fallbacks.
export const additionComponentRegistry = {
  "button-group": {
    exportName: "ButtonGroup",
    title: "Button Group",
    category: "Content",
    description: "Related actions, connected or separated.",
    detail:
      "Group ordinary buttons without changing their Tab order. Root supplies size, treatment, color and material defaults; explicit Button props override them. Use Toolbar when roving focus is intended.",
    primitive: "",
    engine: "Base UI + native",
    api: ["ButtonGroupProps"],
    source: "components/basic-controls.tsx",
    load: () => import("../demos/button-group-example"),
    code: () => import("../demos/button-group-example?raw"),
    composition: {
      tree: "ButtonGroup (role=group, aria-label)\n\u251c\u2500\u2500 Button\n\u251c\u2500\u2500 Button\n\u2514\u2500\u2500 Button (disabled)",
      detail:
        "Group ordinary buttons without changing their Tab order. Root supplies size, treatment, color and material defaults; explicit Button props override them. Use Toolbar when roving focus is intended.",
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
        label: "Treatment",
        options: ["outline", "soft"],
        initial: "outline",
      },
      {
        name: "color",
        label: "Color",
        options: ["accent", "neutral", "danger", "success"],
        initial: "accent",
      },
      {
        name: "radius",
        label: "Radius",
        options: ["none", "sm", "md", "lg", "full"],
        initial: "md",
      },
      {
        name: "material",
        label: "Material",
        options: ["matte", "glossy", "soft", "metal", "paper"],
        initial: "matte",
      },
      { name: "attached", label: "Connected edges", initial: true },
      {
        name: "orientation",
        label: "Orientation",
        initial: "horizontal",
        options: ["horizontal", "vertical"],
      },
    ],
    keyboard: [
      ["Tab / Shift + Tab", "Visit each enabled button in document order."],
      ["Enter / Space", "Activate the focused action."],
    ],
    accessibility:
      "Provide visible labels and meaningful names. Preserve native semantics, selected/disabled state and visible focus. Target WCAG 2.2 AA; full contrast, assistive-technology and platform verification remains pending.",
    lesson:
      "Group ordinary buttons without changing their Tab order. Root supplies size, treatment, color and material defaults; explicit Button props override them. Use Toolbar when roving focus is intended.",
    token: "--dixy-color-background-surface",
  },
  "avatar-group": {
    exportName: "AvatarGroup",
    title: "Avatar Group",
    category: "Content",
    description: "A team, in one compact frame.",
    detail:
      "Root overlaps Avatar instances and supplies their visual defaults. Count is passive text unless it performs a real action; give meaningful image/fallback names without repeating a nearby visible name.",
    primitive: "",
    engine: "Base UI + native",
    api: ["AvatarGroupProps"],
    source: "components/content.tsx",
    load: () => import("../demos/avatar-group-example"),
    code: () => import("../demos/avatar-group-example?raw"),
    composition: {
      tree: "AvatarGroup.Root (visual defaults, optional named group)\n\u251c\u2500\u2500 Avatar.Root \u2192 Avatar.Image + Avatar.Fallback\n\u251c\u2500\u2500 Avatar.Root \u2192 Avatar.Image + Avatar.Fallback\n\u2514\u2500\u2500 AvatarGroup.Count (passive count)",
      detail:
        "Root overlaps Avatar instances and supplies their visual defaults. Count is passive text unless it performs a real action; give meaningful image/fallback names without repeating a nearby visible name.",
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
        label: "Treatment",
        options: ["outline", "soft", "solid"],
        initial: "outline",
      },
      {
        name: "color",
        label: "Color",
        options: ["accent", "neutral", "danger", "success"],
        initial: "accent",
      },
      {
        name: "radius",
        label: "Radius",
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
    keyboard: [],
    accessibility:
      "Provide visible labels and meaningful names. Preserve native semantics, selected/disabled state and visible focus. Target WCAG 2.2 AA; full contrast, assistive-technology and platform verification remains pending.",
    lesson:
      "Root overlaps Avatar instances and supplies their visual defaults. Count is passive text unless it performs a real action; give meaningful image/fallback names without repeating a nearby visible name.",
    token: "--dixy-color-background-surface",
  },
  card: {
    exportName: "Card",
    title: "Card",
    category: "Content",
    description: "A clear frame for related content.",
    detail:
      'Compose Header, Title, Description, Content and Footer inside a section. Set Title as="h4" when the surrounding heading hierarchy requires it. Put actual actions in Button or Link; the entire card is not automatically interactive.',
    primitive: "",
    engine: "Native HTML",
    api: ["CardProps"],
    source: "components/content.tsx",
    load: () => import("../demos/card-example"),
    code: () => import("../demos/card-example?raw"),
    composition: {
      tree: "Card.Root (section)\n\u251c\u2500\u2500 Card.Header \u2192 Card.Title + Card.Description\n\u251c\u2500\u2500 Card.Content\n\u2514\u2500\u2500 Card.Footer",
      detail:
        'Compose Header, Title, Description, Content and Footer inside a section. Set Title as="h4" when the surrounding heading hierarchy requires it. Put actual actions in Button or Link; the entire card is not automatically interactive.',
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
        label: "Treatment",
        options: ["outline", "soft", "solid"],
        initial: "outline",
      },
      {
        name: "color",
        label: "Color",
        options: ["accent", "neutral", "danger", "success"],
        initial: "accent",
      },
      {
        name: "radius",
        label: "Radius",
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
    keyboard: [],
    accessibility:
      "Provide visible labels and meaningful names. Preserve native semantics, selected/disabled state and visible focus. Target WCAG 2.2 AA; full contrast, assistive-technology and platform verification remains pending.",
    lesson:
      'Compose Header, Title, Description, Content and Footer inside a section. Set Title as="h4" when the surrounding heading hierarchy requires it. Put actual actions in Button or Link; the entire card is not automatically interactive.',
    token: "--dixy-color-background-surface",
  },
  alert: {
    exportName: "Alert",
    title: "Alert",
    category: "Content",
    description: "A message that deserves attention.",
    detail:
      'Static alerts remain ordinary content. Add role="status" for a dynamically inserted polite announcement, or role="alert" for urgent feedback. Title and Description provide structure; do not announce decorative examples automatically.',
    primitive: "",
    engine: "Native HTML",
    api: ["AlertProps"],
    source: "components/content.tsx",
    load: () => import("../demos/alert-example"),
    code: () => import("../demos/alert-example?raw"),
    composition: {
      tree: "Alert.Root (native div; role=status/alert only for appropriate announcements)\n\u251c\u2500\u2500 Alert.Title (heading; as changes level)\n\u2514\u2500\u2500 Alert.Description",
      detail:
        'Static alerts remain ordinary content. Add role="status" for a dynamically inserted polite announcement, or role="alert" for urgent feedback. Title and Description provide structure; do not announce decorative examples automatically.',
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
        label: "Treatment",
        options: ["outline", "soft", "solid"],
        initial: "outline",
      },
      {
        name: "color",
        label: "Color",
        options: ["accent", "neutral", "danger", "success"],
        initial: "accent",
      },
      {
        name: "radius",
        label: "Radius",
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
    keyboard: [],
    accessibility:
      "Provide visible labels and meaningful names. Preserve native semantics, selected/disabled state and visible focus. Target WCAG 2.2 AA; full contrast, assistive-technology and platform verification remains pending.",
    lesson:
      'Static alerts remain ordinary content. Add role="status" for a dynamically inserted polite announcement, or role="alert" for urgent feedback. Title and Description provide structure; do not announce decorative examples automatically.',
    token: "--dixy-color-background-surface",
  },
  badge: {
    exportName: "Badge",
    title: "Badge",
    category: "Content",
    description: "A compact piece of status.",
    detail:
      "Badge is passive inline status text. Include an understandable word or icon label so color is not the only signal. Use a real Button or Link for an actionable badge.",
    primitive: "",
    engine: "Native HTML",
    api: ["BadgeProps"],
    source: "components/content.tsx",
    load: () => import("../demos/badge-example"),
    code: () => import("../demos/badge-example?raw"),
    composition: {
      tree: "Badge (native span; passive status text)",
      detail:
        "Badge is passive inline status text. Include an understandable word or icon label so color is not the only signal. Use a real Button or Link for an actionable badge.",
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
        label: "Treatment",
        options: ["outline", "soft", "solid"],
        initial: "outline",
      },
      {
        name: "color",
        label: "Color",
        options: ["accent", "neutral", "danger", "success"],
        initial: "accent",
      },
      {
        name: "radius",
        label: "Radius",
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
    keyboard: [],
    accessibility:
      "Provide visible labels and meaningful names. Preserve native semantics, selected/disabled state and visible focus. Target WCAG 2.2 AA; full contrast, assistive-technology and platform verification remains pending.",
    lesson:
      "Badge is passive inline status text. Include an understandable word or icon label so color is not the only signal. Use a real Button or Link for an actionable badge.",
    token: "--dixy-color-background-surface",
  },
  chip: {
    exportName: "Chip",
    title: "Chip",
    category: "Content",
    description: "A small, readable label.",
    detail:
      "Chip is passive text for a category or attribute. Use TagGroup for removable or selectable collections, where focus and removal behavior belong to the collection primitive.",
    primitive: "",
    engine: "Native HTML",
    api: ["ChipProps"],
    source: "components/content.tsx",
    load: () => import("../demos/chip-example"),
    code: () => import("../demos/chip-example?raw"),
    composition: {
      tree: "Chip (native span; passive category text)\nFor removable collections use TagGroup instead.",
      detail:
        "Chip is passive text for a category or attribute. Use TagGroup for removable or selectable collections, where focus and removal behavior belong to the collection primitive.",
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
        label: "Treatment",
        options: ["outline", "soft", "solid"],
        initial: "outline",
      },
      {
        name: "color",
        label: "Color",
        options: ["accent", "neutral", "danger", "success"],
        initial: "accent",
      },
      {
        name: "radius",
        label: "Radius",
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
    keyboard: [],
    accessibility:
      "Provide visible labels and meaningful names. Preserve native semantics, selected/disabled state and visible focus. Target WCAG 2.2 AA; full contrast, assistive-technology and platform verification remains pending.",
    lesson:
      "Chip is passive text for a category or attribute. Use TagGroup for removable or selectable collections, where focus and removal behavior belong to the collection primitive.",
    token: "--dixy-color-background-surface",
  },
  kbd: {
    exportName: "Kbd",
    title: "Kbd",
    category: "Content",
    description: "Make the shortcut visible.",
    detail:
      "Kbd uses the native kbd element for key names. It describes a shortcut; it does not register one or create another focus stop.",
    primitive: "",
    engine: "Native HTML",
    api: ["KbdProps"],
    source: "components/content.tsx",
    load: () => import("../demos/kbd-example"),
    code: () => import("../demos/kbd-example?raw"),
    composition: {
      tree: "Kbd (native kbd)\n\u2514\u2500\u2500 Visible key names; no shortcut handler is registered.",
      detail:
        "Kbd uses the native kbd element for key names. It describes a shortcut; it does not register one or create another focus stop.",
    },
    controls: [
      {
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
        initial: "md",
      },
      {
        name: "radius",
        label: "Radius",
        options: ["none", "sm", "md", "lg", "full"],
        initial: "md",
      },
    ],
    keyboard: [],
    accessibility:
      "Provide visible labels and meaningful names. Preserve native semantics, selected/disabled state and visible focus. Target WCAG 2.2 AA; full contrast, assistive-technology and platform verification remains pending.",
    lesson:
      "Kbd uses the native kbd element for key names. It describes a shortcut; it does not register one or create another focus stop.",
    token: "--dixy-color-background-surface",
  },
  textarea: {
    exportName: "Textarea",
    title: "Textarea",
    category: "Inputs",
    description: "Room for more than one line.",
    detail:
      "Native multiline editing, selection, form values and resizing remain intact. Wrap the control in a label, or connect a separate label using id/htmlFor. Field validation composition requires explicit label/error relationships for this native control.",
    primitive: "",
    engine: "Native HTML",
    api: ["TextareaProps"],
    source: "components/basic-controls.tsx",
    load: () => import("../demos/textarea-example"),
    code: () => import("../demos/textarea-example?raw"),
    composition: {
      tree: "label (wrapping or connected with htmlFor/id)\n\u2514\u2500\u2500 Textarea (native multiline textarea; name/value/onChange)",
      detail:
        "Native multiline editing, selection, form values and resizing remain intact. Wrap the control in a label, or connect a separate label using id/htmlFor. Field validation composition requires explicit label/error relationships for this native control.",
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
        label: "Treatment",
        options: ["outline", "soft"],
        initial: "outline",
      },
      {
        name: "radius",
        label: "Radius",
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
      ["Enter", "Insert a newline."],
      ["Tab / Shift + Tab", "Move into or out of the control."],
    ],
    accessibility:
      "Provide visible labels and meaningful names. Preserve native semantics, selected/disabled state and visible focus. Target WCAG 2.2 AA; full contrast, assistive-technology and platform verification remains pending.",
    lesson:
      "Native multiline editing, selection, form values and resizing remain intact. Wrap the control in a label, or connect a separate label using id/htmlFor. Field validation composition requires explicit label/error relationships for this native control.",
    token: "--dixy-color-background-surface",
  },
  "input-group": {
    exportName: "InputGroup",
    title: "Input Group",
    category: "Inputs",
    description: "One input, with useful context.",
    detail:
      "Root arranges Input or Textarea with Addon and Button parts. Field owns the input label and help/error relationships. Keep addons out of the editable value and give icon-only actions an accessible name.",
    primitive: "",
    engine: "Base UI + native",
    api: ["InputGroupProps"],
    source: "components/basic-controls.tsx",
    load: () => import("../demos/input-group-example"),
    code: () => import("../demos/input-group-example?raw"),
    composition: {
      tree: "Field.Root\n\u251c\u2500\u2500 Field.Label\n\u251c\u2500\u2500 InputGroup.Root\n\u2502   \u251c\u2500\u2500 InputGroup.Addon (decoration or supporting text)\n\u2502   \u251c\u2500\u2500 InputGroup.Input (TextField)\n\u2502   \u2514\u2500\u2500 InputGroup.Button (named action)\n\u251c\u2500\u2500 Field.Description\n\u2514\u2500\u2500 Field.Error\nNative InputGroup.Textarea needs explicit labeling relationships.",
      detail:
        "Root arranges Input or Textarea with Addon and Button parts. Field owns the input label and help/error relationships. Keep addons out of the editable value and give icon-only actions an accessible name.",
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
        label: "Treatment",
        options: ["outline", "soft"],
        initial: "outline",
      },
      {
        name: "radius",
        label: "Radius",
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
      ["Tab / Shift + Tab", "Visit the input and enabled action buttons."],
    ],
    accessibility:
      "Provide visible labels and meaningful names. Preserve native semantics, selected/disabled state and visible focus. Target WCAG 2.2 AA; full contrast, assistive-technology and platform verification remains pending.",
    lesson:
      "Root arranges Input or Textarea with Addon and Button parts. Field owns the input label and help/error relationships. Keep addons out of the editable value and give icon-only actions an accessible name.",
    token: "--dixy-color-background-surface",
  },
  link: {
    exportName: "Link",
    title: "Link",
    category: "Content",
    description: "A clear route to the next place.",
    detail:
      "React Aria preserves anchor semantics, keyboard activation, disabled behavior and render composition. Use href for a destination; use Button for an action that does not navigate.",
    primitive: "",
    engine: "React Aria",
    api: ["LinkProps"],
    source: "components/link.tsx",
    load: () => import("../demos/link-example"),
    code: () => import("../demos/link-example?raw"),
    composition: {
      tree: "Link (React Aria anchor; href or disabled/current semantics)\n\u2514\u2500\u2500 Descriptive visible text or an accessible name",
      detail:
        "React Aria preserves anchor semantics, keyboard activation, disabled behavior and render composition. Use href for a destination; use Button for an action that does not navigate.",
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
    ],
    keyboard: [["Tab / Enter", "Focus and follow an enabled link."]],
    accessibility:
      "Provide visible labels and meaningful names. Preserve native semantics, selected/disabled state and visible focus. Target WCAG 2.2 AA; full contrast, assistive-technology and platform verification remains pending.",
    lesson:
      "React Aria preserves anchor semantics, keyboard activation, disabled behavior and render composition. Use href for a destination; use Button for an action that does not navigate.",
    token: "--dixy-color-background-surface",
  },
  skeleton: {
    exportName: "Skeleton",
    title: "Skeleton",
    category: "Content",
    description: "Reserve the shape while content loads.",
    detail:
      "The placeholder is static and hidden from assistive technology. Announce loading once on the owning region rather than repeating a live message for each skeleton.",
    primitive: "",
    engine: "Native HTML",
    api: ["SkeletonProps"],
    source: "components/basic-controls.tsx",
    load: () => import("../demos/skeleton-example"),
    code: () => import("../demos/skeleton-example?raw"),
    composition: {
      tree: "Owning loading region (announce once)\n\u251c\u2500\u2500 Skeleton (native div; aria-hidden)\n\u2514\u2500\u2500 Accessible loading/status text",
      detail:
        "The placeholder is static and hidden from assistive technology. Announce loading once on the owning region rather than repeating a live message for each skeleton.",
    },
    controls: [
      {
        name: "radius",
        label: "Radius",
        options: ["none", "sm", "md", "lg", "full"],
        initial: "md",
      },
    ],
    keyboard: [],
    accessibility:
      "Provide visible labels and meaningful names. Preserve native semantics, selected/disabled state and visible focus. Target WCAG 2.2 AA; full contrast, assistive-technology and platform verification remains pending.",
    lesson:
      "The placeholder is static and hidden from assistive technology. Announce loading once on the owning region rather than repeating a live message for each skeleton.",
    token: "--dixy-color-background-surface",
  },
  spinner: {
    exportName: "Spinner",
    title: "Spinner",
    category: "Content",
    description: "A named loading state.",
    detail:
      "Spinner exposes one status label and hides its decorative mark. Reduced motion stops rotation. Remove the spinner when work finishes and avoid mounting decorative loading loops.",
    primitive: "",
    engine: "Native HTML",
    api: ["SpinnerProps"],
    source: "components/basic-controls.tsx",
    load: () => import("../demos/spinner-example"),
    code: () => import("../demos/spinner-example?raw"),
    composition: {
      tree: "Spinner (native span; role=status)\n\u251c\u2500\u2500 Decorative mark (aria-hidden)\n\u2514\u2500\u2500 Visually hidden loading label",
      detail:
        "Spinner exposes one status label and hides its decorative mark. Reduced motion stops rotation. Remove the spinner when work finishes and avoid mounting decorative loading loops.",
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
    ],
    keyboard: [],
    accessibility:
      "Provide visible labels and meaningful names. Preserve native semantics, selected/disabled state and visible focus. Target WCAG 2.2 AA; full contrast, assistive-technology and platform verification remains pending.",
    lesson:
      "Spinner exposes one status label and hides its decorative mark. Reduced motion stops rotation. Remove the spinner when work finishes and avoid mounting decorative loading loops.",
    token: "--dixy-color-background-surface",
  },
  empty: {
    exportName: "Empty",
    title: "Empty State",
    category: "Content",
    description: "A useful next step when nothing is here.",
    detail:
      "Title explains the empty state, Description supplies context, and Content contains a genuine next action. Empty content is not an error announcement by default.",
    primitive: "",
    engine: "Native HTML",
    api: ["EmptyProps"],
    source: "components/content.tsx",
    load: () => import("../demos/empty-example"),
    code: () => import("../demos/empty-example?raw"),
    composition: {
      tree: "Empty.Root (section)\n\u251c\u2500\u2500 Empty.Title\n\u251c\u2500\u2500 Empty.Description\n\u2514\u2500\u2500 Empty.Content \u2192 Button / Link (optional real next action)",
      detail:
        "Title explains the empty state, Description supplies context, and Content contains a genuine next action. Empty content is not an error announcement by default.",
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
        label: "Treatment",
        options: ["outline", "soft"],
        initial: "outline",
      },
      {
        name: "radius",
        label: "Radius",
        options: ["none", "sm", "md", "lg", "full"],
        initial: "md",
      },
    ],
    keyboard: [],
    accessibility:
      "Provide visible labels and meaningful names. Preserve native semantics, selected/disabled state and visible focus. Target WCAG 2.2 AA; full contrast, assistive-technology and platform verification remains pending.",
    lesson:
      "Title explains the empty state, Description supplies context, and Content contains a genuine next action. Empty content is not an error announcement by default.",
    token: "--dixy-color-background-surface",
  },
  breadcrumbs: {
    exportName: "Breadcrumbs",
    title: "Breadcrumbs",
    category: "Content",
    description: "Keep the current place in view.",
    detail:
      "React Aria owns the breadcrumb collection and current-item semantics. Give the navigation a name, use real destinations, and omit href for the current item.",
    primitive: "",
    engine: "React Aria",
    api: [],
    source: "components/breadcrumbs.tsx",
    load: () => import("../demos/breadcrumbs-example"),
    code: () => import("../demos/breadcrumbs-example?raw"),
    composition: {
      tree: "Breadcrumbs.Root (named React Aria navigation)\n\u251c\u2500\u2500 Breadcrumbs.Item \u2192 Breadcrumbs.Link (href)\n\u2514\u2500\u2500 Breadcrumbs.Item \u2192 Breadcrumbs.Link (current item; omit href)",
      detail:
        "React Aria owns the breadcrumb collection and current-item semantics. Give the navigation a name, use real destinations, and omit href for the current item.",
    },
    controls: [
      {
        name: "state",
        label: "State",
        options: ["enabled", "disabled"],
        initial: "enabled",
      },
    ],
    keyboard: [["Tab / Enter", "Move through and follow linked ancestors."]],
    accessibility:
      "Provide visible labels and meaningful names. Preserve native semantics, selected/disabled state and visible focus. Target WCAG 2.2 AA; full contrast, assistive-technology and platform verification remains pending.",
    lesson:
      "React Aria owns the breadcrumb collection and current-item semantics. Give the navigation a name, use real destinations, and omit href for the current item.",
    token: "--dixy-color-background-surface",
  },
  pagination: {
    exportName: "Pagination",
    title: "Pagination",
    category: "Content",
    description: "Move through a defined set of pages.",
    detail:
      'Root is a named navigation landmark. List and Item preserve list structure; Link represents a destination and aria-current="page" identifies the current page. The application owns page state and data loading.',
    primitive: "",
    engine: "Native HTML",
    api: ["PaginationProps"],
    source: "components/basic-controls.tsx",
    load: () => import("../demos/pagination-example"),
    code: () => import("../demos/pagination-example?raw"),
    composition: {
      tree: "Pagination.Root (native nav; aria-label)\n\u2514\u2500\u2500 Pagination.List (ul)\n    \u251c\u2500\u2500 Pagination.Item \u2192 Pagination.Link (href, aria-current=page)\n    \u2514\u2500\u2500 Pagination.Item \u2192 Pagination.Ellipsis\nApplication owns the current page and data.",
      detail:
        'Root is a named navigation landmark. List and Item preserve list structure; Link represents a destination and aria-current="page" identifies the current page. The application owns page state and data loading.',
    },
    controls: [
      {
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
        initial: "md",
      },
      {
        name: "radius",
        label: "Radius",
        options: ["none", "sm", "md", "lg", "full"],
        initial: "md",
      },
    ],
    keyboard: [
      [
        "Tab / Enter",
        "Focus a page link and navigate or update the owning application.",
      ],
    ],
    accessibility:
      "Provide visible labels and meaningful names. Preserve native semantics, selected/disabled state and visible focus. Target WCAG 2.2 AA; full contrast, assistive-technology and platform verification remains pending.",
    lesson:
      'Root is a named navigation landmark. List and Item preserve list structure; Link represents a destination and aria-current="page" identifies the current page. The application owns page state and data loading.',
    token: "--dixy-color-background-surface",
  },
  command: {
    exportName: "Command",
    title: "Command",
    category: "Content",
    description: "Find an action without searching the whole interface.",
    detail:
      "Base UI Combobox owns filtering, highlighted options and selection. Command.Root defaults to inline, logically open and automatic highlighting, following Base UI’s inline-list contract. Compose the same command surface inside Command.Dialog for modal focus containment and return focus.",
    primitive: "Combobox",
    engine: "Base UI",
    api: ["CommandRootProps"],
    source: "components/command.tsx",
    load: () => import("../demos/command-example"),
    code: () => import("../demos/command-example?raw"),
    composition: {
      tree: "Command.Root (inline/open, items, onValueChange)\n\u251c\u2500\u2500 Command.Input (aria-label)\n\u251c\u2500\u2500 Command.List \u2192 Command.Item\n\u2514\u2500\u2500 Command.Empty\nOptional modal: Command.Dialog parts surround the combobox",
      detail:
        "Base UI Combobox owns filtering, highlighted options and selection. Command.Root defaults to inline, logically open and automatic highlighting, following Base UI’s inline-list contract. Compose the same command surface inside Command.Dialog for modal focus containment and return focus.",
    },
    controls: [
      {
        name: "mode",
        label: "Composition",
        options: ["inline", "modal"],
        initial: "inline",
      },
    ],
    keyboard: [
      ["Arrow keys", "Move through matching commands from the input."],
      ["Enter", "Choose the highlighted command."],
      ["Escape", "Dismiss a modal command menu."],
    ],
    accessibility:
      "Provide visible labels and meaningful names. Preserve native semantics, selected/disabled state and visible focus. Target WCAG 2.2 AA; full contrast, assistive-technology and platform verification remains pending.",
    lesson:
      "Base UI Combobox owns filtering, highlighted options and selection. Command.Root defaults to inline, logically open and automatic highlighting, following Base UI’s inline-list contract. Compose the same command surface inside Command.Dialog for modal focus containment and return focus.",
    token: "--dixy-color-background-surface",
  },
  "list-box": {
    exportName: "ListBox",
    title: "ListBox",
    category: "Content",
    description: "A visible collection of choices.",
    detail:
      "React Aria owns single/multiple selection, disabled keys, typeahead and focus. Item IDs identify selection keys; textValue supplies text for complex item content. Keep generic item values and render functions intact.",
    primitive: "",
    engine: "React Aria",
    api: ["ListBoxRootProps"],
    source: "components/list-box.tsx",
    load: () => import("../demos/list-box-example"),
    code: () => import("../demos/list-box-example?raw"),
    composition: {
      tree: "ListBox.Root (items, selectionMode, selectedKeys/onSelectionChange)\n\u251c\u2500\u2500 ListBox.Item (id, textValue)\n\u2514\u2500\u2500 ListBox.Section (optional)\n    \u251c\u2500\u2500 ListBox.Header\n    \u2514\u2500\u2500 ListBox.Item \u2192 ListBox.Text (optional label/description slots)",
      detail:
        "React Aria owns single/multiple selection, disabled keys, typeahead and focus. Item IDs identify selection keys; textValue supplies text for complex item content. Keep generic item values and render functions intact.",
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
        label: "Treatment",
        options: ["outline", "soft"],
        initial: "outline",
      },
      {
        name: "radius",
        label: "Radius",
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
      ["Arrow keys / Home / End", "Navigate enabled items."],
      ["Space / Enter", "Select an item using the configured selection mode."],
    ],
    accessibility:
      "Provide visible labels and meaningful names. Preserve native semantics, selected/disabled state and visible focus. Target WCAG 2.2 AA; full contrast, assistive-technology and platform verification remains pending.",
    lesson:
      "React Aria owns single/multiple selection, disabled keys, typeahead and focus. Item IDs identify selection keys; textValue supplies text for complex item content. Keep generic item values and render functions intact.",
    token: "--dixy-color-background-surface",
  },
  "tag-group": {
    exportName: "TagGroup",
    title: "TagGroup",
    category: "Content",
    description: "Labels that can be selected or removed.",
    detail:
      'React Aria owns the tag collection, selection and focus recovery after removal. Give the group a Label and use Remove with slot="remove". Update the owning items in onRemove; the primitive does not delete application data itself.',
    primitive: "",
    engine: "React Aria",
    api: ["TagGroupRootProps"],
    source: "components/tag-group.tsx",
    load: () => import("../demos/tag-group-example"),
    code: () => import("../demos/tag-group-example?raw"),
    composition: {
      tree: "TagGroup.Root (onRemove, optional selection)\n\u251c\u2500\u2500 TagGroup.Label\n\u2514\u2500\u2500 TagGroup.List (items)\n    \u2514\u2500\u2500 TagGroup.Item (id, textValue)\n        \u2514\u2500\u2500 TagGroup.Remove (slot=remove)",
      detail:
        'React Aria owns the tag collection, selection and focus recovery after removal. Give the group a Label and use Remove with slot="remove". Update the owning items in onRemove; the primitive does not delete application data itself.',
    },
    controls: [
      {
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
        initial: "md",
      },
      {
        name: "radius",
        label: "Radius",
        options: ["none", "sm", "md", "lg", "full"],
        initial: "md",
      },
    ],
    keyboard: [
      ["Arrow keys / Home / End", "Navigate tags."],
      ["Delete / Backspace", "Request removal of the focused removable tag."],
    ],
    accessibility:
      "Provide visible labels and meaningful names. Preserve native semantics, selected/disabled state and visible focus. Target WCAG 2.2 AA; full contrast, assistive-technology and platform verification remains pending.",
    lesson:
      'React Aria owns the tag collection, selection and focus recovery after removal. Give the group a Label and use Remove with slot="remove". Update the owning items in onRemove; the primitive does not delete application data itself.',
    token: "--dixy-color-background-surface",
  },
  "search-field": {
    exportName: "SearchField",
    title: "Search Field",
    category: "Inputs",
    description: "An editable query, with a way to clear it.",
    detail:
      "React Aria owns the query, clear action, validation and submission events. Label names the field; Description and Error keep their slots. Keep controlled value and onChange paired; the application owns search results.",
    primitive: "",
    engine: "React Aria",
    api: ["SearchFieldRootProps"],
    source: "components/search-field.tsx",
    load: () => import("../demos/search-field-example"),
    code: () => import("../demos/search-field-example?raw"),
    composition: {
      tree: "SearchField.Root (value/onChange, onSubmit)\n\u251c\u2500\u2500 SearchField.Label\n\u251c\u2500\u2500 SearchField.Input\n\u251c\u2500\u2500 SearchField.Clear (primitive clear action)\n\u251c\u2500\u2500 SearchField.Description (slot=description)\n\u2514\u2500\u2500 SearchField.Error",
      detail:
        "React Aria owns the query, clear action, validation and submission events. Label names the field; Description and Error keep their slots. Keep controlled value and onChange paired; the application owns search results.",
    },
    controls: [
      {
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
        initial: "md",
      },
      {
        name: "radius",
        label: "Radius",
        options: ["none", "sm", "md", "lg", "full"],
        initial: "md",
      },
    ],
    keyboard: [
      ["Enter", "Call onSubmit with the current query."],
      ["Escape / Clear", "Clear the query through the primitive."],
    ],
    accessibility:
      "Provide visible labels and meaningful names. Preserve native semantics, selected/disabled state and visible focus. Target WCAG 2.2 AA; full contrast, assistive-technology and platform verification remains pending.",
    lesson:
      "React Aria owns the query, clear action, validation and submission events. Label names the field; Description and Error keep their slots. Keep controlled value and onChange paired; the application owns search results.",
    token: "--dixy-color-background-surface",
  },
  table: {
    exportName: "Table",
    title: "Table",
    category: "Content",
    description: "Rows and columns with native meaning.",
    detail:
      "Use a caption, column header scope and row headers where appropriate. This is a native table, not an interactive grid. Use DataTable when collection selection, cell navigation or sorting behavior is required.",
    primitive: "",
    engine: "Native HTML",
    api: ["TableProps"],
    source: "components/content.tsx",
    load: () => import("../demos/table-example"),
    code: () => import("../demos/table-example?raw"),
    composition: {
      tree: "Table.Root (native table)\n\u251c\u2500\u2500 Table.Caption\n\u251c\u2500\u2500 Table.Header \u2192 Table.Row \u2192 Table.Head (scope=col)\n\u2514\u2500\u2500 Table.Body \u2192 Table.Row \u2192 Table.Head (scope=row) + Table.Cell",
      detail:
        "Use a caption, column header scope and row headers where appropriate. This is a native table, not an interactive grid. Use DataTable when collection selection, cell navigation or sorting behavior is required.",
    },
    controls: [
      {
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
        initial: "md",
      },
    ],
    keyboard: [],
    accessibility:
      "Provide visible labels and meaningful names. Preserve native semantics, selected/disabled state and visible focus. Target WCAG 2.2 AA; full contrast, assistive-technology and platform verification remains pending.",
    lesson:
      "Use a caption, column header scope and row headers where appropriate. This is a native table, not an interactive grid. Use DataTable when collection selection, cell navigation or sorting behavior is required.",
    token: "--dixy-color-background-surface",
  },
  "data-table": {
    exportName: "DataTable",
    title: "DataTable",
    category: "Content",
    description: "A table with collection behavior.",
    detail:
      "React Aria owns table/grid navigation, selection, column sorting requests and optional column resizing. The application sorts, filters and paginates its data; onSortChange alone does not reorder rows. Header, Body, Column, Row and Cell retain their generic collection contracts.",
    primitive: "",
    engine: "React Aria",
    api: ["DataTableRootProps"],
    source: "components/data-table.tsx",
    load: () => import("../demos/data-table-example"),
    code: () => import("../demos/data-table-example?raw"),
    composition: {
      tree: "DataTable.Root (named table; selection and sortDescriptor/onSortChange)\n\u251c\u2500\u2500 DataTable.Header \u2192 DataTable.Column (id, isRowHeader, allowsSorting)\n\u2514\u2500\u2500 DataTable.Body (items) \u2192 DataTable.Row (id) \u2192 DataTable.Cell\nOptional: DataTable.ResizeContainer + DataTable.ColumnResizer\nApplication owns sorting/filtering/pagination of the items.",
      detail:
        "React Aria owns table/grid navigation, selection, column sorting requests and optional column resizing. The application sorts, filters and paginates its data; onSortChange alone does not reorder rows. Header, Body, Column, Row and Cell retain their generic collection contracts.",
    },
    controls: [
      {
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
        initial: "md",
      },
    ],
    keyboard: [
      [
        "Arrow keys",
        "Navigate the table using its configured selection/focus behavior.",
      ],
      [
        "Enter / Space on a sortable header",
        "Request the next sort direction.",
      ],
    ],
    accessibility:
      "Provide visible labels and meaningful names. Preserve native semantics, selected/disabled state and visible focus. Target WCAG 2.2 AA; full contrast, assistive-technology and platform verification remains pending.",
    lesson:
      "React Aria owns table/grid navigation, selection, column sorting requests and optional column resizing. The application sorts, filters and paginates its data; onSortChange alone does not reorder rows. Header, Body, Column, Row and Cell retain their generic collection contracts.",
    token: "--dixy-color-background-surface",
  },
  sidebar: {
    exportName: "Sidebar",
    title: "Sidebar",
    category: "Content",
    description: "Navigation that can make room.",
    detail:
      "Compose Base UI Collapsible Root, Trigger and Panel with a semantic aside and named nav. Mobile exposes the existing Drawer family for modal composition. Keep the trigger outside the panel so closed content remains reachable.",
    primitive: "",
    engine: "Base UI + native",
    api: ["SidebarProps"],
    source: "components/basic-controls.tsx",
    load: () => import("../demos/sidebar-example"),
    code: () => import("../demos/sidebar-example?raw"),
    composition: {
      tree: "Sidebar.Root (Base UI Collapsible state)\n\u251c\u2500\u2500 Sidebar.Trigger\n\u2514\u2500\u2500 Sidebar.Panel\n    \u2514\u2500\u2500 Sidebar.Content (aside)\n        \u251c\u2500\u2500 Sidebar.Header\n        \u251c\u2500\u2500 Sidebar.Nav (named nav) \u2192 Link\n        \u2514\u2500\u2500 Sidebar.Footer\nModal/mobile composition: Sidebar.Mobile (the Drawer family)",
      detail:
        "Compose Base UI Collapsible Root, Trigger and Panel with a semantic aside and named nav. Mobile exposes the existing Drawer family for modal composition. Keep the trigger outside the panel so closed content remains reachable.",
    },
    controls: [
      {
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
        initial: "md",
      },
      {
        name: "radius",
        label: "Radius",
        options: ["none", "sm", "md", "lg", "full"],
        initial: "md",
      },
    ],
    keyboard: [
      ["Enter / Space", "Toggle the collapsible panel."],
      ["Tab / Enter", "Visit and follow navigation links."],
    ],
    accessibility:
      "Provide visible labels and meaningful names. Preserve native semantics, selected/disabled state and visible focus. Target WCAG 2.2 AA; full contrast, assistive-technology and platform verification remains pending.",
    lesson:
      "Compose Base UI Collapsible Root, Trigger and Panel with a semantic aside and named nav. Mobile exposes the existing Drawer family for modal composition. Keep the trigger outside the panel so closed content remains reachable.",
    token: "--dixy-color-background-surface",
  },
  item: {
    exportName: "Item",
    title: "Item",
    category: "Content",
    description: "One clear row of related content.",
    detail:
      "Media, Content and Actions arrange a list or settings row without assigning a false interactive role. Title accepts an appropriate heading level. Use real controls for actions.",
    primitive: "",
    engine: "Native HTML",
    api: ["ItemProps"],
    source: "components/content.tsx",
    load: () => import("../demos/item-example"),
    code: () => import("../demos/item-example?raw"),
    composition: {
      tree: "Item.Root (native div; as=li within a list)\n\u251c\u2500\u2500 Item.Media\n\u251c\u2500\u2500 Item.Content \u2192 Item.Title + Item.Description\n\u2514\u2500\u2500 Item.Actions \u2192 Button / Link",
      detail:
        "Media, Content and Actions arrange a list or settings row without assigning a false interactive role. Title accepts an appropriate heading level. Use real controls for actions.",
    },
    controls: [
      {
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
        initial: "md",
      },
    ],
    keyboard: [],
    accessibility:
      "Provide visible labels and meaningful names. Preserve native semantics, selected/disabled state and visible focus. Target WCAG 2.2 AA; full contrast, assistive-technology and platform verification remains pending.",
    lesson:
      "Media, Content and Actions arrange a list or settings row without assigning a false interactive role. Title accepts an appropriate heading level. Use real controls for actions.",
    token: "--dixy-color-background-surface",
  },
  "aspect-ratio": {
    exportName: "AspectRatio",
    title: "AspectRatio",
    category: "Content",
    description: "A predictable frame for media.",
    detail:
      "Ratio is a positive width divided by height. Image/video content fills the frame without changing its intrinsic meaning. Supply alternative text on the media itself.",
    primitive: "",
    engine: "Native HTML",
    api: ["AspectRatioProps"],
    source: "components/basic-controls.tsx",
    load: () => import("../demos/aspect-ratio-example"),
    code: () => import("../demos/aspect-ratio-example?raw"),
    composition: {
      tree: "AspectRatio (native div; ratio = width / height)\n\u2514\u2500\u2500 img / video / content (media owns its accessible name)",
      detail:
        "Ratio is a positive width divided by height. Image/video content fills the frame without changing its intrinsic meaning. Supply alternative text on the media itself.",
    },
    controls: [
      {
        name: "radius",
        label: "Radius",
        options: ["none", "sm", "md", "lg", "full"],
        initial: "md",
      },
    ],
    keyboard: [],
    accessibility:
      "Provide visible labels and meaningful names. Preserve native semantics, selected/disabled state and visible focus. Target WCAG 2.2 AA; full contrast, assistive-technology and platform verification remains pending.",
    lesson:
      "Ratio is a positive width divided by height. Image/video content fills the frame without changing its intrinsic meaning. Supply alternative text on the media itself.",
    token: "--dixy-color-background-surface",
  },
  resizable: {
    exportName: "Resizable",
    title: "Resizable Panels",
    category: "Content",
    description: "Adjust the workspace without losing the keyboard.",
    detail:
      "Root owns the start-panel percentage and bounds. Use exactly one start Panel, one named Handle and one end Panel. The separator supports pointer capture and immediate keyboard resizing; controlled value changes remain with the application.",
    primitive: "",
    engine: "Native HTML",
    api: ["ResizableRootProps"],
    source: "components/resizable.tsx",
    load: () => import("../demos/resizable-example"),
    code: () => import("../demos/resizable-example?raw"),
    composition: {
      tree: "Resizable.Root (value/defaultValue, min/max, orientation)\n\u251c\u2500\u2500 Resizable.Panel (side=start)\n\u251c\u2500\u2500 Resizable.Handle (named separator)\n\u2514\u2500\u2500 Resizable.Panel (side=end)",
      detail:
        "Root owns the start-panel percentage and bounds. Use exactly one start Panel, one named Handle and one end Panel. The separator supports pointer capture and immediate keyboard resizing; controlled value changes remain with the application.",
    },
    controls: [
      {
        name: "radius",
        label: "Radius",
        options: ["none", "sm", "md", "lg", "full"],
        initial: "md",
      },
    ],
    keyboard: [
      ["Arrow keys", "Resize by 1%, following orientation and RTL."],
      ["Shift + Arrow", "Resize by 10%."],
      ["Home / End", "Move to the minimum or maximum permitted size."],
    ],
    accessibility:
      "Provide visible labels and meaningful names. Preserve native semantics, selected/disabled state and visible focus. Target WCAG 2.2 AA; full contrast, assistive-technology and platform verification remains pending.",
    lesson:
      "Root owns the start-panel percentage and bounds. Use exactly one start Panel, one named Handle and one end Panel. The separator supports pointer capture and immediate keyboard resizing; controlled value changes remain with the application.",
    token: "--dixy-color-background-surface",
  },
  carousel: {
    exportName: "Carousel",
    title: "Carousel",
    category: "Content",
    description: "A sequence the reader controls.",
    detail:
      "Native horizontal scrolling and snap points remain available. Previous and Next expose boundaries, and each Item needs a slide name. There is no automatic rotation or background timer; Root announces slide changes.",
    primitive: "",
    engine: "Native HTML",
    api: ["CarouselRootProps"],
    source: "components/carousel.tsx",
    load: () => import("../demos/carousel-example"),
    code: () => import("../demos/carousel-example?raw"),
    composition: {
      tree: "Carousel.Root (aria-label)\n\u251c\u2500\u2500 Carousel.Viewport \u2192 Carousel.Item (aria-label)\n\u251c\u2500\u2500 Carousel.Previous\n\u2514\u2500\u2500 Carousel.Next\nNo automatic rotation; native scrolling stays available",
      detail:
        "Native horizontal scrolling and snap points remain available. Previous and Next expose boundaries, and each Item needs a slide name. There is no automatic rotation or background timer; Root announces slide changes.",
    },
    controls: [
      {
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
        initial: "md",
      },
    ],
    keyboard: [
      ["Tab / Enter / Space", "Focus and activate previous/next controls."],
      [
        "Scroll keys / touch scroll",
        "Move within the focusable native viewport.",
      ],
    ],
    accessibility:
      "Provide visible labels and meaningful names. Preserve native semantics, selected/disabled state and visible focus. Target WCAG 2.2 AA; full contrast, assistive-technology and platform verification remains pending.",
    lesson:
      "Native horizontal scrolling and snap points remain available. Previous and Next expose boundaries, and each Item needs a slide name. There is no automatic rotation or background timer; Root announces slide changes.",
    token: "--dixy-color-background-surface",
  },
  chart: {
    exportName: "Chart",
    title: "Chart",
    category: "Content",
    description: "A small bar chart, with its data intact.",
    detail:
      "This lightweight SVG recipe accepts finite nonnegative values. The caption names the chart, and View chart data exposes a native table with every value. Complex series, axes, interactions and chart types remain separate future extensions.",
    primitive: "",
    engine: "Native HTML / SVG",
    api: ["ChartProps"],
    source: "components/chart.tsx",
    load: () => import("../demos/chart-example"),
    code: () => import("../demos/chart-example?raw"),
    composition: {
      tree: "Chart (native figure; label, nonnegative data)\n\u251c\u2500\u2500 figcaption\n\u251c\u2500\u2500 svg (named image; bars and labels)\n\u2514\u2500\u2500 details \u2192 summary + native Table (all values)",
      detail:
        "This lightweight SVG recipe accepts finite nonnegative values. The caption names the chart, and View chart data exposes a native table with every value. Complex series, axes, interactions and chart types remain separate future extensions.",
    },
    controls: [
      {
        name: "color",
        label: "Color",
        options: ["accent", "neutral", "danger", "success"],
        initial: "accent",
      },
    ],
    keyboard: [
      [
        "Enter / Space on View chart data",
        "Expand or collapse the native data disclosure.",
      ],
    ],
    accessibility:
      "Provide visible labels and meaningful names. Preserve native semantics, selected/disabled state and visible focus. Target WCAG 2.2 AA; full contrast, assistive-technology and platform verification remains pending.",
    lesson:
      "This lightweight SVG recipe accepts finite nonnegative values. The caption names the chart, and View chart data exposes a native table with every value. Complex series, axes, interactions and chart types remain separate future extensions.",
    token: "--dixy-color-background-surface",
  },
  "progress-circle": {
    exportName: "ProgressCircle",
    title: "ProgressCircle",
    category: "Content",
    description: "Progress, in a compact ring.",
    detail:
      "Provide an accessible name and a positive maximum. Values are clamped to the range; omitting value creates an indeterminate state without aria-valuenow. Progress is information, not another keyboard stop.",
    primitive: "",
    engine: "Native HTML / SVG",
    api: ["ProgressCircleProps"],
    source: "components/basic-controls.tsx",
    load: () => import("../demos/progress-circle-example"),
    code: () => import("../demos/progress-circle-example?raw"),
    composition: {
      tree: "ProgressCircle (named native progressbar; value/max)\n\u2514\u2500\u2500 svg (aria-hidden) \u2192 track + value ring\nOmit value for indeterminate progress.",
      detail:
        "Provide an accessible name and a positive maximum. Values are clamped to the range; omitting value creates an indeterminate state without aria-valuenow. Progress is information, not another keyboard stop.",
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
    ],
    keyboard: [],
    accessibility:
      "Provide visible labels and meaningful names. Preserve native semantics, selected/disabled state and visible focus. Target WCAG 2.2 AA; full contrast, assistive-technology and platform verification remains pending.",
    lesson:
      "Provide an accessible name and a positive maximum. Values are clamped to the range; omitting value creates an indeterminate state without aria-valuenow. Progress is information, not another keyboard stop.",
    token: "--dixy-color-background-surface",
  },
  "scroll-shadow": {
    exportName: "ScrollShadow",
    title: "ScrollShadow",
    category: "Content",
    description: "Show when the content continues.",
    detail:
      "A focusable native scroll region uses local/scroll background attachments to reveal edge shadows as overflow moves. No scroll listener, animation loop or blur is required. Give the region an accessible name.",
    primitive: "",
    engine: "Native HTML",
    api: ["ScrollShadowProps"],
    source: "components/basic-controls.tsx",
    load: () => import("../demos/scroll-shadow-example"),
    code: () => import("../demos/scroll-shadow-example?raw"),
    composition: {
      tree: "ScrollShadow (named native scroll region; tabindex=0)\n\u2514\u2500\u2500 Overflowing content (CSS scroll shadows; no render loop)",
      detail:
        "A focusable native scroll region uses local/scroll background attachments to reveal edge shadows as overflow moves. No scroll listener, animation loop or blur is required. Give the region an accessible name.",
    },
    controls: [
      {
        name: "radius",
        label: "Radius",
        options: ["none", "sm", "md", "lg", "full"],
        initial: "md",
      },
    ],
    keyboard: [
      [
        "Tab / Arrow / Page Up / Page Down",
        "Focus and scroll the native region.",
      ],
    ],
    accessibility:
      "Provide visible labels and meaningful names. Preserve native semantics, selected/disabled state and visible focus. Target WCAG 2.2 AA; full contrast, assistive-technology and platform verification remains pending.",
    lesson:
      "A focusable native scroll region uses local/scroll background attachments to reveal edge shadows as overflow moves. No scroll listener, animation loop or blur is required. Give the region an accessible name.",
    token: "--dixy-color-background-surface",
  },
  calendar: {
    exportName: "Calendar",
    title: "Calendar",
    category: "Content",
    description: "Choose a date with a familiar grid.",
    detail:
      "React Aria owns date navigation, selection, bounds, unavailable dates and calendar systems. Root retains typed date values and render callbacks; Grid and Cell retain collection relationships. Use LocaleProvider for an explicit locale and match the intended writing direction.",
    primitive: "",
    engine: "React Aria",
    api: ["CalendarRootProps"],
    source: "components/calendar.tsx",
    load: () => import("../demos/calendar-example"),
    code: () => import("../demos/calendar-example?raw"),
    composition: {
      tree: "Calendar.Root (value/defaultValue, bounds, unavailable dates)\n\u251c\u2500\u2500 Button (slot=previous) + Heading + Button (slot=next)\n\u2514\u2500\u2500 Grid \u2192 GridHeader / GridBody \u2192 Cell",
      detail:
        "React Aria owns date navigation, selection, bounds, unavailable dates and calendar systems. Root retains typed date values and render callbacks; Grid and Cell retain collection relationships. Use LocaleProvider for an explicit locale and match the intended writing direction.",
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
        label: "Treatment",
        options: ["outline", "soft"],
        initial: "outline",
      },
      {
        name: "radius",
        label: "Radius",
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
      ["Arrow keys", "Move by day or week."],
      ["Page Up / Page Down", "Navigate months."],
      ["Enter / Space", "Select the focused available date."],
    ],
    accessibility:
      "Provide visible labels and meaningful names. Preserve native semantics, selected/disabled state and visible focus. Target WCAG 2.2 AA; full contrast, assistive-technology and platform verification remains pending.",
    lesson:
      "React Aria owns date navigation, selection, bounds, unavailable dates and calendar systems. Root retains typed date values and render callbacks; Grid and Cell retain collection relationships. Use LocaleProvider for an explicit locale and match the intended writing direction.",
    token: "--dixy-color-background-surface",
  },
  "range-calendar": {
    exportName: "RangeCalendar",
    title: "RangeCalendar",
    category: "Content",
    description: "Choose the beginning and the end.",
    detail:
      "React Aria owns range selection, date navigation and unavailable-date rules. Value and onChange use typed start/end dates. Use LocaleProvider for the intended locale and calendar system.",
    primitive: "",
    engine: "React Aria",
    api: ["RangeCalendarRootProps"],
    source: "components/range-calendar.tsx",
    load: () => import("../demos/range-calendar-example"),
    code: () => import("../demos/range-calendar-example?raw"),
    composition: {
      tree: "RangeCalendar.Root (value/defaultValue, bounds, unavailable dates)\n\u251c\u2500\u2500 Button (slot=previous) + Heading + Button (slot=next)\n\u2514\u2500\u2500 Grid \u2192 GridHeader / GridBody \u2192 Cell",
      detail:
        "React Aria owns range selection, date navigation and unavailable-date rules. Value and onChange use typed start/end dates. Use LocaleProvider for the intended locale and calendar system.",
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
        label: "Treatment",
        options: ["outline", "soft"],
        initial: "outline",
      },
      {
        name: "radius",
        label: "Radius",
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
      ["Arrow keys", "Navigate the date grid."],
      ["Enter / Space", "Set the start or end of the range."],
    ],
    accessibility:
      "Provide visible labels and meaningful names. Preserve native semantics, selected/disabled state and visible focus. Target WCAG 2.2 AA; full contrast, assistive-technology and platform verification remains pending.",
    lesson:
      "React Aria owns range selection, date navigation and unavailable-date rules. Value and onChange use typed start/end dates. Use LocaleProvider for the intended locale and calendar system.",
    token: "--dixy-color-background-surface",
  },
  "date-field": {
    exportName: "DateField",
    title: "DateField",
    category: "Inputs",
    description: "A date, edited one segment at a time.",
    detail:
      "React Aria owns localized segments, parsing, validation and typed date values. Input renders Segment parts; Label, description and error remain associated with the root. Use LocaleProvider for a chosen locale; no hand-written date parser is added.",
    primitive: "",
    engine: "React Aria",
    api: ["DateFieldRootProps"],
    source: "components/date-field.tsx",
    load: () => import("../demos/date-field-example"),
    code: () => import("../demos/date-field-example?raw"),
    composition: {
      tree: "DateField.Root (typed value/onChange, validation)\n\u251c\u2500\u2500 DateField.Label\n\u251c\u2500\u2500 DateField.Input \u2192 DateField.Segment (render function)\n\u251c\u2500\u2500 DateField.Description (slot=description)\n\u2514\u2500\u2500 DateField.Error",
      detail:
        "React Aria owns localized segments, parsing, validation and typed date values. Input renders Segment parts; Label, description and error remain associated with the root. Use LocaleProvider for a chosen locale; no hand-written date parser is added.",
    },
    controls: [
      {
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
        initial: "md",
      },
      {
        name: "radius",
        label: "Radius",
        options: ["none", "sm", "md", "lg", "full"],
        initial: "md",
      },
    ],
    keyboard: [
      ["Left / Right", "Move between segments."],
      ["Up / Down / digits", "Adjust or enter the focused date segment."],
    ],
    accessibility:
      "Provide visible labels and meaningful names. Preserve native semantics, selected/disabled state and visible focus. Target WCAG 2.2 AA; full contrast, assistive-technology and platform verification remains pending.",
    lesson:
      "React Aria owns localized segments, parsing, validation and typed date values. Input renders Segment parts; Label, description and error remain associated with the root. Use LocaleProvider for a chosen locale; no hand-written date parser is added.",
    token: "--dixy-color-background-surface",
  },
  "time-field": {
    exportName: "TimeField",
    title: "TimeField",
    category: "Inputs",
    description: "Time editing that follows the locale.",
    detail:
      "React Aria owns typed time values, hour cycles, segment editing and validation. Input renders Segment parts. Pair value with onChange and use LocaleProvider to choose the format; time-zone conversion remains an application concern.",
    primitive: "",
    engine: "React Aria",
    api: ["TimeFieldRootProps"],
    source: "components/time-field.tsx",
    load: () => import("../demos/time-field-example"),
    code: () => import("../demos/time-field-example?raw"),
    composition: {
      tree: "TimeField.Root (typed time value/onChange, hour cycle)\n\u251c\u2500\u2500 TimeField.Label\n\u251c\u2500\u2500 TimeField.Input \u2192 TimeField.Segment (render function)\n\u251c\u2500\u2500 TimeField.Description (slot=description)\n\u2514\u2500\u2500 TimeField.Error",
      detail:
        "React Aria owns typed time values, hour cycles, segment editing and validation. Input renders Segment parts. Pair value with onChange and use LocaleProvider to choose the format; time-zone conversion remains an application concern.",
    },
    controls: [
      {
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
        initial: "md",
      },
      {
        name: "radius",
        label: "Radius",
        options: ["none", "sm", "md", "lg", "full"],
        initial: "md",
      },
    ],
    keyboard: [
      ["Left / Right", "Move between time segments."],
      ["Up / Down / digits", "Adjust or enter the focused segment."],
    ],
    accessibility:
      "Provide visible labels and meaningful names. Preserve native semantics, selected/disabled state and visible focus. Target WCAG 2.2 AA; full contrast, assistive-technology and platform verification remains pending.",
    lesson:
      "React Aria owns typed time values, hour cycles, segment editing and validation. Input renders Segment parts. Pair value with onChange and use LocaleProvider to choose the format; time-zone conversion remains an application concern.",
    token: "--dixy-color-background-surface",
  },
  "date-picker": {
    exportName: "DatePicker",
    title: "DatePicker",
    category: "Inputs",
    description: "Edit a date or choose it from the calendar.",
    detail:
      "React Aria owns the segmented field, open state, calendar selection, validation and focus restoration. Name Popover with aria-label and use its Button and Popover parts within the root; the portaled surface restores Dixy theme tokens. Values use @internationalized/date, re-exported through Dixy.",
    primitive: "",
    engine: "React Aria",
    api: ["DatePickerRootProps", "AriaPopoverProps"],
    source: "components/date-picker.tsx",
    load: () => import("../demos/date-picker-example"),
    code: () => import("../demos/date-picker-example?raw"),
    composition: {
      tree: "DatePicker.Root (React Aria value / onChange)\n\u251c\u2500\u2500 Label\n\u251c\u2500\u2500 Group \u2192 Input \u2192 Segment + Button\n\u251c\u2500\u2500 Error\n\u2514\u2500\u2500 Popover \u2192 Calendar.Root \u2192 Grid \u2192 Cell",
      detail:
        "React Aria owns the segmented field, open state, calendar selection, validation and focus restoration. Name Popover with aria-label and use its Button and Popover parts within the root; the portaled surface restores Dixy theme tokens. Values use @internationalized/date, re-exported through Dixy.",
    },
    controls: [
      {
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
        initial: "md",
      },
      {
        name: "radius",
        label: "Radius",
        options: ["none", "sm", "md", "lg", "full"],
        initial: "md",
      },
    ],
    keyboard: [
      ["Tab", "Visit segments and the calendar trigger."],
      ["Enter / Space on the trigger", "Open the calendar."],
      ["Escape", "Close the calendar and restore focus."],
    ],
    accessibility:
      "Provide visible labels and meaningful names. Preserve native semantics, selected/disabled state and visible focus. Target WCAG 2.2 AA; full contrast, assistive-technology and platform verification remains pending.",
    lesson:
      "React Aria owns the segmented field, open state, calendar selection, validation and focus restoration. Name Popover with aria-label and use its Button and Popover parts within the root; the portaled surface restores Dixy theme tokens. Values use @internationalized/date, re-exported through Dixy.",
    token: "--dixy-color-background-surface",
  },
  "date-range-picker": {
    exportName: "DateRangePicker",
    title: "DateRangePicker",
    category: "Inputs",
    description: "Two dates, one connected choice.",
    detail:
      "Use start/end Input slots inside Group and a RangeCalendar inside Popover. React Aria owns the range, validation, open state and focus behavior. Keep the segmented field and calendar connected to the same Root.",
    primitive: "",
    engine: "React Aria",
    api: ["DateRangePickerRootProps", "AriaPopoverProps"],
    source: "components/date-range-picker.tsx",
    load: () => import("../demos/date-range-picker-example"),
    code: () => import("../demos/date-range-picker-example?raw"),
    composition: {
      tree: "DateRangePicker.Root (React Aria value / onChange)\n\u251c\u2500\u2500 Label\n\u251c\u2500\u2500 Group \u2192 Input \u2192 Segment + Button\n\u251c\u2500\u2500 Error\n\u2514\u2500\u2500 Popover \u2192 RangeCalendar.Root \u2192 Grid \u2192 Cell",
      detail:
        "Use start/end Input slots inside Group and a RangeCalendar inside Popover. React Aria owns the range, validation, open state and focus behavior. Keep the segmented field and calendar connected to the same Root.",
    },
    controls: [
      {
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
        initial: "md",
      },
      {
        name: "radius",
        label: "Radius",
        options: ["none", "sm", "md", "lg", "full"],
        initial: "md",
      },
    ],
    keyboard: [
      ["Tab", "Visit range segments and the calendar trigger."],
      ["Enter / Space", "Open the picker or select a focused date."],
      ["Escape", "Dismiss the popup."],
    ],
    accessibility:
      "Provide visible labels and meaningful names. Preserve native semantics, selected/disabled state and visible focus. Target WCAG 2.2 AA; full contrast, assistive-technology and platform verification remains pending.",
    lesson:
      "Use start/end Input slots inside Group and a RangeCalendar inside Popover. React Aria owns the range, validation, open state and focus behavior. Keep the segmented field and calendar connected to the same Root.",
    token: "--dixy-color-background-surface",
  },
  "native-select": {
    exportName: "NativeSelect",
    title: "NativeSelect",
    category: "Inputs",
    description: "The platform\u2019s own choice control.",
    detail:
      "The native select keeps option semantics, keyboard behavior, form values and the platform picker. Visual size is sm/md/lg; disabled and multiple remain native props. Label the control with a wrapping label or explicit id/htmlFor.",
    primitive: "",
    engine: "Native HTML",
    api: ["NativeSelectProps"],
    source: "components/basic-controls.tsx",
    load: () => import("../demos/native-select-example"),
    code: () => import("../demos/native-select-example?raw"),
    composition: {
      tree: "label (wrapping or connected with htmlFor/id)\n\u2514\u2500\u2500 NativeSelect (native select; name/value/onChange)\n    \u251c\u2500\u2500 option (value, disabled)\n    \u2514\u2500\u2500 optgroup \u2192 option (optional)",
      detail:
        "The native select keeps option semantics, keyboard behavior, form values and the platform picker. Visual size is sm/md/lg; disabled and multiple remain native props. Label the control with a wrapping label or explicit id/htmlFor.",
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
        label: "Treatment",
        options: ["outline", "soft"],
        initial: "outline",
      },
      {
        name: "radius",
        label: "Radius",
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
        "Arrow keys / typing",
        "Use the platform\u2019s option navigation and typeahead.",
      ],
      ["Enter / Space", "Use the platform picker and commit behavior."],
    ],
    accessibility:
      "Provide visible labels and meaningful names. Preserve native semantics, selected/disabled state and visible focus. Target WCAG 2.2 AA; full contrast, assistive-technology and platform verification remains pending.",
    lesson:
      "The native select keeps option semantics, keyboard behavior, form values and the platform picker. Visual size is sm/md/lg; disabled and multiple remain native props. Label the control with a wrapping label or explicit id/htmlFor.",
    token: "--dixy-color-background-surface",
  },
  "color-picker": {
    exportName: "ColorPicker",
    title: "ColorPicker",
    category: "Inputs",
    description: "Edit color without inventing its interaction.",
    detail:
      "React Aria owns Color values, color-space conversion, two-dimensional area input, sliders and editable fields. Area and Slider need Thumb parts; Field supplies an accessible text alternative. Root can be controlled with value/onChange, and Swatch displays the same shared value.",
    primitive: "",
    engine: "React Aria",
    api: [],
    source: "components/color-picker.tsx",
    load: () => import("../demos/color-picker-example"),
    code: () => import("../demos/color-picker-example?raw"),
    composition: {
      tree: "ColorPicker.Root (value/defaultValue, onChange)\n\u251c\u2500\u2500 Area \u2192 Thumb\n\u251c\u2500\u2500 Slider (channel=hue) \u2192 Track \u2192 Thumb\n\u251c\u2500\u2500 Field \u2192 Label + Input\n\u2514\u2500\u2500 Swatch",
      detail:
        "React Aria owns Color values, color-space conversion, two-dimensional area input, sliders and editable fields. Area and Slider need Thumb parts; Field supplies an accessible text alternative. Root can be controlled with value/onChange, and Swatch displays the same shared value.",
    },
    controls: [
      {
        name: "format",
        label: "Color format",
        options: ["hex", "hsl", "rgb"],
        initial: "hex",
      },
    ],
    keyboard: [
      ["Arrow keys", "Adjust the focused area axis or slider."],
      ["Tab / typing", "Reach and edit the named color field."],
    ],
    accessibility:
      "Provide visible labels and meaningful names. Preserve native semantics, selected/disabled state and visible focus. Target WCAG 2.2 AA; full contrast, assistive-technology and platform verification remains pending.",
    lesson:
      "React Aria owns Color values, color-space conversion, two-dimensional area input, sliders and editable fields. Area and Slider need Thumb parts; Field supplies an accessible text alternative. Root can be controlled with value/onChange, and Swatch displays the same shared value.",
    token: "--dixy-color-background-surface",
  },
} as const;
