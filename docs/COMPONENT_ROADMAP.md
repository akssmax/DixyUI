# Dixy component inventory and delivery plan

Reviewed 2026-10-15 against local compiled runtime exports and the docs registry, [HeroUI’s React catalog](https://heroui.com/en/docs/react/components) and [shadcn’s Base UI catalog](https://ui.shadcn.com/docs/components). This is a dated capability mapping, not a parity score or a WCAG certification. Tabs was implemented first. The approved existing-component refresh is now recorded in [COMPONENT_REFRESH.md](COMPONENT_REFRESH.md); the subsequent common additions are recorded in COMPONENT_ADDITIONS.md.

**Current status:** all 37 common families in the approved missing-component list are now implemented as public Dixy families. See [COMPONENT_ADDITIONS.md](COMPONENT_ADDITIONS.md) for exact scope, behavior ownership and remaining release checks. There are now 76 component pages and 92 uppercase runtime exports (including five new nonvisual provider/value utilities). The original inventory and delivery sequence below are retained as a baseline; the catalog mapping has been updated for the new public equivalents. Chart remains a deliberately scoped basic bar recipe rather than a complete general chart package.

## Original inventory before the additions pass

There are **39 component documentation pages** and **50 uppercase runtime exports**, including compound families, layout, typography and providers. Compound subparts and type-only re-exports are not counted as extra runtime components. These counts describe different inventories.

| Docs category | Components with pages                                                                                                                                                   |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Inputs        | Checkbox, Switch, Autocomplete, Checkbox Group, Combobox, Fieldset, Form, Number Field, OTP Field, Radio Group, Select, Slider, Toggle, Toggle Group, Field, Text Field |
| Navigation    | Tabs, Menubar, Navigation Menu, Toolbar                                                                                                                                 |
| Overlays      | Tooltip, Alert Dialog, Context Menu, Drawer, Menu, Popover, Preview Card, Toast, Dialog                                                                                 |
| Content       | Accordion, Avatar, Collapsible, Meter, Progress, Scroll Area, Separator, Icon, Typography                                                                               |
| Actions       | Button                                                                                                                                                                  |

Additional runtime exports without separate pages include Radio, IconButton, Box, Container, Stack, Inline, Text, Heading, Shape, Theme, DirectionProvider and CSPProvider; some share a family page. The exact runtime list is: `Accordion`, `AlertDialog`, `Autocomplete`, `Avatar`, `Box`, `Button`, `CSPProvider`, `Checkbox`, `CheckboxGroup`, `Collapsible`, `Combobox`, `Container`, `ContextMenu`, `Dialog`, `DirectionProvider`, `Drawer`, `Field`, `Fieldset`, `Form`, `Heading`, `Icon`, `IconButton`, `Inline`, `Menu`, `Menubar`, `Meter`, `NavigationMenu`, `NumberField`, `OTPField`, `Popover`, `PreviewCard`, `Progress`, `Radio`, `RadioGroup`, `ScrollArea`, `Select`, `Separator`, `Shape`, `Slider`, `Stack`, `Switch`, `Tabs`, `Text`, `TextField`, `Theme`, `Toast`, `Toggle`, `ToggleGroup`, `Toolbar`, `Tooltip`.

The approved existing-component refresh adds component-specific visual APIs, composition guidance and aligned examples across the Base UI families, alongside Button, Checkbox, Switch and Tabs. This implementation does not establish full feature parity or complete accessibility validation; see [the refresh record](COMPONENT_REFRESH.md).

## Original basic gaps — implemented in the additions pass

The shared basic gaps across the two systems include **ButtonGroup, Card, Alert, Badge, Breadcrumbs, Pagination, Table, Textarea, InputGroup, Skeleton, Spinner and Kbd**. Calendar/DatePicker are also shared gaps, but need a dedicated internationalized date architecture. HeroUI additionally exposes useful ListBox, TagGroup, Link, SearchField, ProgressCircle and color/date inputs. These do not all warrant new dependencies or immediate implementation.

Avatar now has a typed size/radius/color/material API and image/fallback composition. Grouped-avatar composition was a baseline gap and is now delivered. **AvatarGroup was a real gap in Dixy and is offered by both references**: HeroUI lists it separately, while [shadcn documents it inside Avatar](https://ui.shadcn.com/docs/components/base/avatar#composition), together with AvatarBadge and AvatarGroupCount. A catalog-only name comparison would miss this distinction.

Avoid duplicate components for renamed equivalents: Modal → Dialog; Dropdown/Dropdown Menu → Menu; Hover Card → PreviewCard; Input → TextField; InputOTP → OTPField; Disclosure → Collapsible; ToggleButton → Toggle; ProgressBar → Progress. Field.Label, Field.Description and Field.Error already provide labeled form composition. Sheet can be a documented Drawer/Dialog side-panel composition. Box already supplies a material surface, but it does not provide a Card’s named header/content/footer recipe.

## Original delivery sequence — see current status above

| Order         | Work                                                                                                                   | Acceptance scope                                                                                                                                                                                                                                                                                                     |
| ------------- | ---------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0 — delivered | Tabs refresh                                                                                                           | Line/solid/soft/outline, sm/md/lg, semantic colors, inherited radii/materials, alignment/fill, anatomy, icons, orientation, manual/automatic activation, overflow, generated API, complete examples and evidence. Full conformance remains subject to manual release checks.                                         |
| 1a — next     | ButtonGroup                                                                                                            | Connected and separated actions, orientation, inherited sizes/radii, borders and disabled/loading combinations. Ordinary buttons keep ordinary Tab stops; opt into Toolbar when roving focus is the intended pattern. Do not reuse ToggleGroup for momentary actions.                                                |
| 1b            | Avatar upgrade delivered; AvatarGroup planned                                                                          | sm/md/lg, contextual radius, accent/neutral fallback colors, fallback/border materials, finite fallback motion, image/error states, optional status badge, overlap/count composition and RTL. Preserve image alt/fallback semantics and avoid duplicate names. Make a count focusable only if it performs an action. |
| 1c            | Card, Alert, Badge/Chip                                                                                                | Named anatomy and semantic HTML; distinguish passive status from dismissible controls. Alert announcements are explicit, not automatic for every decorative card. Add contrast and close-button naming checks.                                                                                                       |
| 1d            | Textarea, InputGroup, Link, Skeleton, Spinner, Kbd, Empty                                                              | Reuse Field for labels/errors, keep native editing/link semantics and addons out of the input’s value. Loading placeholders avoid repeated announcements and respect reduced motion.                                                                                                                                 |
| 2             | Breadcrumbs, Pagination, semantic Table, NativeSelect                                                                  | Native nav/table/form semantics, current-page/sort state and visible focus. Table precedes a DataTable adapter; do not turn every table into an ARIA grid.                                                                                                                                                           |
| 2             | ListBox, TagGroup, SearchField, ProgressCircle, ScrollShadow                                                           | Specify standalone selection, removal/focus recovery, search clear/status behavior, bounded progress semantics and overflow affordances. Reuse existing primitives where they actually cover the pattern.                                                                                                            |
| 3             | Command, DataTable, Sidebar, Item, AspectRatio, Resizable, Carousel, Chart                                             | Compositions/adapters after their basic dependencies. Keep heavy dependencies optional; include keyboard resizing, alternative data representations and carousel pause controls where applicable. Docs-only implementations do not count as public library components.                                               |
| 4             | Calendar, date/time/range inputs; color controls                                                                       | Separate architecture decision for parsing, localization, range/timezone behavior and accessible keyboard interaction. Evaluate maintained specialist primitives only when implementation is authorized.                                                                                                             |
| 5             | Attachment, Bubble, Marker, Message, MessageScroller, Questionnaire, Trace, public CodeBlock and other domain patterns | Product-driven scope after core controls. Do not add specialized chat/AI components just to match a catalog count.                                                                                                                                                                                                   |

The approved updates to existing Base UI components are implemented as documented in [COMPONENT_REFRESH.md](COMPONENT_REFRESH.md). Comprehensive interaction, visual and accessibility release checks remain pending. The new-component sequence above is independent of that implementation pass.

## WCAG 2.2 AA gate for every component

Use [WCAG 2.2](https://www.w3.org/TR/WCAG22/) as the conformance standard and [APG](https://www.w3.org/WAI/ARIA/apg/patterns/) for pattern guidance. A primitive implementation or axe pass is evidence for part of this work, not certification. Track each criterion as passed with evidence, failed, not applicable with a reason, or pending; do not collapse those into one “accessible” checkbox.

| Area                     | Required evidence                                                                                                                                                                                                  |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Meaning and forms        | Names/roles/states/relationships; label/description/error associations; correct native elements; text alternatives; no duplicate icon announcements; appropriate live status.                                      |
| Keyboard and focus       | Entry/exit, activation, orientation/RTL, disabled behavior, focus restoration, no trap; focus visible and not obscured. Verify the installed primitive’s actual contract.                                          |
| Contrast and state       | Normally 4.5:1 text, 3:1 qualifying large text and applicable non-text contrast. Check active/inactive/hover/focus/invalid states on actual surfaces and with material overlays; selection has a cue beyond color. |
| Size and reflow          | Applicable AA 24 CSS px target-size/spacing requirements, 320 CSS px reflow, text resize and zoom. The small visible checkbox mark is distinct from its larger target.                                             |
| Preferences and fallback | Light/dark, reduced motion/effects, forced colors and relevant native/hydration fallback. Reduced motion is also a Dixy policy beyond individual AA criteria.                                                      |
| Assistive technology     | Named screen-reader/browser/platform combinations, with actual announcements and interaction results. Record untested combinations.                                                                                |
| Implementation/packaging | Contract regressions, applicable automated checks, production browser evidence, generated API/example freshness and isolated packed consumer checks.                                                               |

For Tabs specifically, Root owns selection/orientation; List owns its name and activation/looping. Base UI permits disabled arrow-key focus for discovery but blocks activation. Manual mode moves focus before selection; automatic mode is appropriate only for promptly available panels. Panel hiding/inert state remains primitive-owned. Indicator is decorative; selected styling remains usable without it. Only the line variant uses an active bar; solid/soft/outline use the selected surface with no extra underline. See the [APG Tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) and the local docs page.

Mobile documentation-shell optimization is deferred as requested. Component reflow, reachability and focus visibility remain accessibility checks. Manual screen-reader/platform, real zoom, forced-colors and physical-device reviews are pending unless the build log records otherwise. No blanket WCAG 2.2 claim is made.

## Catalog mapping after common additions

“Present” means a public equivalent exists, not full visual parity. “Composition” means existing public parts cover the pattern, with documentation/custom layout as noted. “Partial” means ingredients/private implementation exist but the public pattern is incomplete. “Missing” means no reusable public equivalent was found. Priorities correspond to the delivery sequence; “Maintain” is an existing-component review, not an accessibility pass. Catalog entries are counted independently; aliases are deliberately many-to-one.

### HeroUI React

72 catalog entries. Status reflects public equivalents after the common-component additions; it does not establish feature parity or conformance.

| Reference component                                                                  | Dixy equivalent / gap             | Status      | Priority  |
| ------------------------------------------------------------------------------------ | --------------------------------- | ----------- | --------- |
| [Accordion](https://heroui.com/en/docs/react/components/accordion)                   | Accordion                         | Present     | Maintain  |
| [Alert](https://heroui.com/en/docs/react/components/alert)                           | Alert                             | Present     | Maintain  |
| [AlertDialog](https://heroui.com/en/docs/react/components/alert-dialog)              | AlertDialog                       | Present     | Maintain  |
| [Autocomplete](https://heroui.com/en/docs/react/components/autocomplete)             | Autocomplete                      | Present     | Maintain  |
| [Avatar](https://heroui.com/en/docs/react/components/avatar)                         | Avatar                            | Present     | 1 upgrade |
| [AvatarGroup](https://heroui.com/en/docs/react/components/avatar-group)              | AvatarGroup                       | Present     | Maintain  |
| [Badge](https://heroui.com/en/docs/react/components/badge)                           | Badge                             | Present     | Maintain  |
| [Breadcrumbs](https://heroui.com/en/docs/react/components/breadcrumbs)               | Breadcrumbs                       | Present     | Maintain  |
| [Button](https://heroui.com/en/docs/react/components/button)                         | Button                            | Present     | Maintain  |
| [ButtonGroup](https://heroui.com/en/docs/react/components/button-group)              | ButtonGroup                       | Present     | Maintain  |
| [Calendar](https://heroui.com/en/docs/react/components/calendar)                     | Calendar                          | Present     | Maintain  |
| [Card](https://heroui.com/en/docs/react/components/card)                             | Card                              | Present     | Maintain  |
| [Checkbox](https://heroui.com/en/docs/react/components/checkbox)                     | Checkbox                          | Present     | Maintain  |
| [CheckboxGroup](https://heroui.com/en/docs/react/components/checkbox-group)          | CheckboxGroup                     | Present     | Maintain  |
| [Chip](https://heroui.com/en/docs/react/components/chip)                             | Chip                              | Present     | Maintain  |
| [CloseButton](https://heroui.com/en/docs/react/components/close-button)              | IconButton + an owning Close part | Composition | Document  |
| [ColorArea](https://heroui.com/en/docs/react/components/color-area)                  | ColorPicker.Area                  | Present     | Maintain  |
| [ColorField](https://heroui.com/en/docs/react/components/color-field)                | ColorPicker.Field                 | Present     | Maintain  |
| [ColorPicker](https://heroui.com/en/docs/react/components/color-picker)              | ColorPicker                       | Present     | Maintain  |
| [ColorSlider](https://heroui.com/en/docs/react/components/color-slider)              | ColorPicker.Slider                | Present     | Maintain  |
| [ColorSwatch](https://heroui.com/en/docs/react/components/color-swatch)              | ColorPicker.Swatch                | Present     | Maintain  |
| [ColorSwatchPicker](https://heroui.com/en/docs/react/components/color-swatch-picker) | No public equivalent              | Missing     | 4         |
| [ComboBox](https://heroui.com/en/docs/react/components/combo-box)                    | Combobox                          | Present     | Maintain  |
| [DateField](https://heroui.com/en/docs/react/components/date-field)                  | DateField                         | Present     | Maintain  |
| [DatePicker](https://heroui.com/en/docs/react/components/date-picker)                | DatePicker                        | Present     | Maintain  |
| [DateRangePicker](https://heroui.com/en/docs/react/components/date-range-picker)     | DateRangePicker                   | Present     | Maintain  |
| [Description](https://heroui.com/en/docs/react/components/description)               | Field.Description                 | Composition | Document  |
| [Disclosure](https://heroui.com/en/docs/react/components/disclosure)                 | Collapsible                       | Present     | Maintain  |
| [DisclosureGroup](https://heroui.com/en/docs/react/components/disclosure-group)      | Accordion (multiple)              | Present     | Maintain  |
| [Drawer](https://heroui.com/en/docs/react/components/drawer)                         | Drawer                            | Present     | Maintain  |
| [Dropdown](https://heroui.com/en/docs/react/components/dropdown)                     | Menu                              | Present     | Maintain  |
| [ErrorMessage](https://heroui.com/en/docs/react/components/error-message)            | Field.Error                       | Composition | Document  |
| [FieldError](https://heroui.com/en/docs/react/components/field-error)                | Field.Error                       | Composition | Document  |
| [Fieldset](https://heroui.com/en/docs/react/components/fieldset)                     | Fieldset                          | Present     | Maintain  |
| [Form](https://heroui.com/en/docs/react/components/form)                             | Form                              | Present     | Maintain  |
| [Input](https://heroui.com/en/docs/react/components/input)                           | TextField                         | Present     | Maintain  |
| [InputGroup](https://heroui.com/en/docs/react/components/input-group)                | InputGroup                        | Present     | Maintain  |
| [InputOTP](https://heroui.com/en/docs/react/components/input-otp)                    | OTPField                          | Present     | Maintain  |
| [Kbd](https://heroui.com/en/docs/react/components/kbd)                               | Kbd                               | Present     | Maintain  |
| [Label](https://heroui.com/en/docs/react/components/label)                           | Field.Label                       | Composition | Document  |
| [Link](https://heroui.com/en/docs/react/components/link)                             | Link                              | Present     | Maintain  |
| [ListBox](https://heroui.com/en/docs/react/components/list-box)                      | ListBox                           | Present     | Maintain  |
| [Meter](https://heroui.com/en/docs/react/components/meter)                           | Meter                             | Present     | Maintain  |
| [Modal](https://heroui.com/en/docs/react/components/modal)                           | Dialog                            | Present     | Maintain  |
| [NumberField](https://heroui.com/en/docs/react/components/number-field)              | NumberField                       | Present     | Maintain  |
| [Pagination](https://heroui.com/en/docs/react/components/pagination)                 | Pagination                        | Present     | Maintain  |
| [Popover](https://heroui.com/en/docs/react/components/popover)                       | Popover                           | Present     | Maintain  |
| [ProgressBar](https://heroui.com/en/docs/react/components/progress-bar)              | Progress                          | Present     | Maintain  |
| [ProgressCircle](https://heroui.com/en/docs/react/components/progress-circle)        | ProgressCircle                    | Present     | Maintain  |
| [RadioGroup](https://heroui.com/en/docs/react/components/radio-group)                | RadioGroup                        | Present     | Maintain  |
| [RangeCalendar](https://heroui.com/en/docs/react/components/range-calendar)          | RangeCalendar                     | Present     | Maintain  |
| [ScrollShadow](https://heroui.com/en/docs/react/components/scroll-shadow)            | ScrollShadow                      | Present     | Maintain  |
| [SearchField](https://heroui.com/en/docs/react/components/search-field)              | SearchField                       | Present     | Maintain  |
| [Select](https://heroui.com/en/docs/react/components/select)                         | Select                            | Present     | Maintain  |
| [Separator](https://heroui.com/en/docs/react/components/separator)                   | Separator                         | Present     | Maintain  |
| [Skeleton](https://heroui.com/en/docs/react/components/skeleton)                     | Skeleton                          | Present     | Maintain  |
| [Slider](https://heroui.com/en/docs/react/components/slider)                         | Slider                            | Present     | Maintain  |
| [Spinner](https://heroui.com/en/docs/react/components/spinner)                       | Spinner                           | Present     | Maintain  |
| [Surface](https://heroui.com/en/docs/react/components/surface)                       | Box (material surface)            | Composition | Document  |
| [Switch](https://heroui.com/en/docs/react/components/switch)                         | Switch                            | Present     | Maintain  |
| [Table](https://heroui.com/en/docs/react/components/table)                           | Table                             | Present     | Maintain  |
| [Tabs](https://heroui.com/en/docs/react/components/tabs)                             | Tabs                              | Present     | Maintain  |
| [TagGroup](https://heroui.com/en/docs/react/components/tag-group)                    | TagGroup                          | Present     | Maintain  |
| [TextArea](https://heroui.com/en/docs/react/components/text-area)                    | Textarea                          | Present     | Maintain  |
| [TextField](https://heroui.com/en/docs/react/components/text-field)                  | Field + TextField                 | Composition | Document  |
| [TimeField](https://heroui.com/en/docs/react/components/time-field)                  | TimeField                         | Present     | Maintain  |
| [Toast](https://heroui.com/en/docs/react/components/toast)                           | Toast                             | Present     | Maintain  |
| [ToggleButton](https://heroui.com/en/docs/react/components/toggle-button)            | Toggle                            | Present     | Maintain  |
| [ToggleButtonGroup](https://heroui.com/en/docs/react/components/toggle-button-group) | ToggleGroup                       | Present     | Maintain  |
| [Toolbar](https://heroui.com/en/docs/react/components/toolbar)                       | Toolbar                           | Present     | Maintain  |
| [Tooltip](https://heroui.com/en/docs/react/components/tooltip)                       | Tooltip                           | Present     | Maintain  |
| [Typography](https://heroui.com/en/docs/react/components/typography)                 | Text / Heading                    | Present     | Maintain  |

### shadcn Base UI

66 catalog entries. Status reflects public equivalents after the common-component additions; advanced chart coverage remains partial.

| Reference component                                                             | Dixy equivalent / gap                                                   | Status      | Priority  |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------- | --------- |
| [Accordion](https://ui.shadcn.com/docs/components/base/accordion)               | Accordion                                                               | Present     | Maintain  |
| [Alert](https://ui.shadcn.com/docs/components/base/alert)                       | Alert                                                                   | Present     | Maintain  |
| [Alert Dialog](https://ui.shadcn.com/docs/components/base/alert-dialog)         | AlertDialog                                                             | Present     | Maintain  |
| [Aspect Ratio](https://ui.shadcn.com/docs/components/base/aspect-ratio)         | AspectRatio                                                             | Present     | Maintain  |
| [Attachment](https://ui.shadcn.com/docs/components/base/attachment)             | No public equivalent                                                    | Missing     | 5         |
| [Avatar](https://ui.shadcn.com/docs/components/base/avatar)                     | Avatar                                                                  | Present     | 1 upgrade |
| [Badge](https://ui.shadcn.com/docs/components/base/badge)                       | Badge                                                                   | Present     | Maintain  |
| [Breadcrumb](https://ui.shadcn.com/docs/components/base/breadcrumb)             | Breadcrumbs                                                             | Present     | Maintain  |
| [Bubble](https://ui.shadcn.com/docs/components/base/bubble)                     | No public equivalent                                                    | Missing     | 5         |
| [Button](https://ui.shadcn.com/docs/components/base/button)                     | Button                                                                  | Present     | Maintain  |
| [Button Group](https://ui.shadcn.com/docs/components/base/button-group)         | ButtonGroup                                                             | Present     | Maintain  |
| [Calendar](https://ui.shadcn.com/docs/components/base/calendar)                 | Calendar                                                                | Present     | Maintain  |
| [Card](https://ui.shadcn.com/docs/components/base/card)                         | Card                                                                    | Present     | Maintain  |
| [Carousel](https://ui.shadcn.com/docs/components/base/carousel)                 | Carousel                                                                | Present     | Maintain  |
| [Chart](https://ui.shadcn.com/docs/components/base/chart)                       | Chart (basic SVG bars and native data table; other chart types pending) | Partial     | Extend    |
| [Checkbox](https://ui.shadcn.com/docs/components/base/checkbox)                 | Checkbox                                                                | Present     | Maintain  |
| [Code Block](https://ui.shadcn.com/docs/components/base/code-block)             | Docs-only CodeBlock; no public package export                           | Partial     | 5         |
| [Collapsible](https://ui.shadcn.com/docs/components/base/collapsible)           | Collapsible                                                             | Present     | Maintain  |
| [Combobox](https://ui.shadcn.com/docs/components/base/combobox)                 | Combobox                                                                | Present     | Maintain  |
| [Command](https://ui.shadcn.com/docs/components/base/command)                   | Command                                                                 | Present     | Maintain  |
| [Context Menu](https://ui.shadcn.com/docs/components/base/context-menu)         | ContextMenu                                                             | Present     | Maintain  |
| [Data Table](https://ui.shadcn.com/docs/components/base/data-table)             | DataTable (application owns data transforms)                            | Present     | Maintain  |
| [Date Picker](https://ui.shadcn.com/docs/components/base/date-picker)           | DatePicker                                                              | Present     | Maintain  |
| [Dialog](https://ui.shadcn.com/docs/components/base/dialog)                     | Dialog                                                                  | Present     | Maintain  |
| [Direction](https://ui.shadcn.com/docs/components/base/direction)               | DirectionProvider                                                       | Present     | Maintain  |
| [Drawer](https://ui.shadcn.com/docs/components/base/drawer)                     | Drawer                                                                  | Present     | Maintain  |
| [Dropdown Menu](https://ui.shadcn.com/docs/components/base/dropdown-menu)       | Menu                                                                    | Present     | Maintain  |
| [Empty](https://ui.shadcn.com/docs/components/base/empty)                       | Empty                                                                   | Present     | Maintain  |
| [Field](https://ui.shadcn.com/docs/components/base/field)                       | Field                                                                   | Present     | Maintain  |
| [Hover Card](https://ui.shadcn.com/docs/components/base/hover-card)             | PreviewCard                                                             | Present     | Maintain  |
| [Input](https://ui.shadcn.com/docs/components/base/input)                       | TextField                                                               | Present     | Maintain  |
| [Input Group](https://ui.shadcn.com/docs/components/base/input-group)           | InputGroup                                                              | Present     | Maintain  |
| [Input OTP](https://ui.shadcn.com/docs/components/base/input-otp)               | OTPField                                                                | Present     | Maintain  |
| [Item](https://ui.shadcn.com/docs/components/base/item)                         | Item                                                                    | Present     | Maintain  |
| [Kbd](https://ui.shadcn.com/docs/components/base/kbd)                           | Kbd                                                                     | Present     | Maintain  |
| [Label](https://ui.shadcn.com/docs/components/base/label)                       | Field.Label                                                             | Composition | Document  |
| [Marker](https://ui.shadcn.com/docs/components/base/marker)                     | No public equivalent                                                    | Missing     | 5         |
| [Menubar](https://ui.shadcn.com/docs/components/base/menubar)                   | Menubar                                                                 | Present     | Maintain  |
| [Message](https://ui.shadcn.com/docs/components/base/message)                   | No public equivalent                                                    | Missing     | 5         |
| [Message Scroller](https://ui.shadcn.com/docs/components/base/message-scroller) | No public equivalent                                                    | Missing     | 5         |
| [Native Select](https://ui.shadcn.com/docs/components/base/native-select)       | NativeSelect                                                            | Present     | Maintain  |
| [Navigation Menu](https://ui.shadcn.com/docs/components/base/navigation-menu)   | NavigationMenu                                                          | Present     | Maintain  |
| [Pagination](https://ui.shadcn.com/docs/components/base/pagination)             | Pagination                                                              | Present     | Maintain  |
| [Popover](https://ui.shadcn.com/docs/components/base/popover)                   | Popover                                                                 | Present     | Maintain  |
| [Progress](https://ui.shadcn.com/docs/components/base/progress)                 | Progress                                                                | Present     | Maintain  |
| [Questionnaire](https://ui.shadcn.com/docs/components/base/questionnaire)       | No public equivalent                                                    | Missing     | 5         |
| [Radio Group](https://ui.shadcn.com/docs/components/base/radio-group)           | RadioGroup                                                              | Present     | Maintain  |
| [Resizable](https://ui.shadcn.com/docs/components/base/resizable)               | Resizable (two-pane root)                                               | Present     | Maintain  |
| [Scroll Area](https://ui.shadcn.com/docs/components/base/scroll-area)           | ScrollArea                                                              | Present     | Maintain  |
| [Select](https://ui.shadcn.com/docs/components/base/select)                     | Select                                                                  | Present     | Maintain  |
| [Separator](https://ui.shadcn.com/docs/components/base/separator)               | Separator                                                               | Present     | Maintain  |
| [Sheet](https://ui.shadcn.com/docs/components/base/sheet)                       | Drawer / Dialog + side-panel layout                                     | Composition | Document  |
| [Sidebar](https://ui.shadcn.com/docs/components/base/sidebar)                   | Sidebar (Collapsible / mobile Drawer composition)                       | Present     | Maintain  |
| [Skeleton](https://ui.shadcn.com/docs/components/base/skeleton)                 | Skeleton                                                                | Present     | Maintain  |
| [Slider](https://ui.shadcn.com/docs/components/base/slider)                     | Slider                                                                  | Present     | Maintain  |
| [Spinner](https://ui.shadcn.com/docs/components/base/spinner)                   | Spinner                                                                 | Present     | Maintain  |
| [Switch](https://ui.shadcn.com/docs/components/base/switch)                     | Switch                                                                  | Present     | Maintain  |
| [Table](https://ui.shadcn.com/docs/components/base/table)                       | Table                                                                   | Present     | Maintain  |
| [Tabs](https://ui.shadcn.com/docs/components/base/tabs)                         | Tabs                                                                    | Present     | Maintain  |
| [Textarea](https://ui.shadcn.com/docs/components/base/textarea)                 | Textarea                                                                | Present     | Maintain  |
| [Toast](https://ui.shadcn.com/docs/components/base/toast)                       | Toast                                                                   | Present     | Maintain  |
| [Toggle](https://ui.shadcn.com/docs/components/base/toggle)                     | Toggle                                                                  | Present     | Maintain  |
| [Toggle Group](https://ui.shadcn.com/docs/components/base/toggle-group)         | ToggleGroup                                                             | Present     | Maintain  |
| [Tooltip](https://ui.shadcn.com/docs/components/base/tooltip)                   | Tooltip                                                                 | Present     | Maintain  |
| [Trace](https://ui.shadcn.com/docs/components/base/trace)                       | No public equivalent                                                    | Missing     | 5         |
| [Typography](https://ui.shadcn.com/docs/components/base/typography)             | Text / Heading                                                          | Present     | Maintain  |

This snapshot covers the two core component catalogs, including domain entries currently listed there; separate AI Elements catalogs, templates, showcase applications and every compound subpart are outside these catalog counts. The targeted Avatar review above adds compound-group evidence that catalogs alone omit. Local sources: `packages/react/src/index.ts`, built `packages/react/dist/dixy.js`, `apps/docs/src/registry/components.ts` and component/style implementations. Recheck upstream pages and local exports before taking the next roadmap item.
