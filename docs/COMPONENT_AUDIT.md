# Base component audit — 2026-11-09

Compared against shadcn/ui and HeroUI. Three problems kept coming up: icons the consumer had to type as text, extra wrapper boxes, and controls whose heights didn't match. Heights were measured on `/lab/controls`, a permanent regression page that renders every field-like control at sm/md/lg and marks each measured box with `data-audit`.

## How the references handle it

- **shadcn/ui**
  - Controls share one height (`h-9`), and icons come from Lucide.
  - `InputGroup` is the bordered box. Its addons and buttons sit inside, borderless.
  - Calendar uses chevron icons, and when it's in a popover only the popover draws a frame.
- **HeroUI** (built on React Aria, like our date and search parts)
  - `SearchField` has a search icon and a clear button built in.
  - Date pickers carry their own calendar button, sized to fit inside the field.
  - The sm/md/lg heights match across every field.

## Findings (before → after, px at sm / md / lg)

| Component                                             | Problem                                                                                             | Before            | After                                            |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ----------------- | ------------------------------------------------ |
| IconButton                                            | 44px minimum target overrode the control height                                                     | 44 / 44 / 48      | 32 / 40 / 48                                     |
| NativeSelect, DateField, TimeField, SearchField input | 8px vertical padding on top of the height                                                           | 39.5–42 / 42 / 48 | 32 / 40 / 48                                     |
| InputGroup                                            | Group border plus padding, with a full-height bordered input inside                                 | 50 / 58 / 66      | 32 / 40 / 48                                     |
| DatePicker, DateRangePicker                           | Same nesting, plus a separate bordered button and a "▦" glyph                                       | 52 / 58 / 66      | 32 / 40 / 48                                     |
| Combobox, Autocomplete                                | Input kept its full height inside the group's border; trigger had padding                           | 42 / 42 / 50      | 32 / 40 / 48                                     |
| NumberField                                           | Same, plus "−"/"+" glyphs, an input that filled its row, and a focus ring inside the frame          | 42 / 42 / 50      | 32 / 40 / 48                                     |
| ToggleGroup (segmented, attached)                     | Track padding and skin borders added on top of the items; attached drew nested borders              | +4–6              | exact                                            |
| Tabs list                                             | List padding and border added on top of the tabs                                                    | 41 / 49 / 57      | 32 / 40 / 48                                     |
| SearchField                                           | Needed the consumer's `Inline` wrapper; clear button was a second bordered "×" box beside the input | —                 | `SearchField.Group` frames icon, input and clear |
| Calendar in a popover                                 | Two frames: the popover's and the calendar's                                                        | —                 | Popover frame only                               |
| Calendar nav, TagGroup.Remove, Combobox.ChipRemove    | Text glyphs ‹ › × supplied by the consumer                                                          | —                 | Built-in SVG icons                               |

All 30 starter skins plus the default theme now measure exactly 32/40/48 on every row.

## What changed

- `utilities/default-artwork.tsx` gained calendar, chevron-left/right, minus, plus and search icons.
  - All of them are 16px strokes at the same weight, with no icon dependency.
  - Parts render a default icon only when `children` is undefined. Passing your own children still replaces it.
- New `SearchField.Group`, with an `icon` prop.
- New stylesheet `styles/alignment.css`:
  - A framed group owns the border and height. The parts inside stretch to fill it, with no border or minimum height of their own.
  - Toggle tracks and tab lists own the control height, and their items stretch. That way, a skin that adds a border to the track no longer adds height.
  - Focus is drawn once, on the frame.

## Not changed yet

- **Accordion:** the chevron is still an SVG the consumer writes (`data-dixy-chevron`). Base UI has no indicator part for it, so adding one would be a new API.
- **Touch targets:** IconButton now follows the control height. On coarse pointers, 32px small controls are under the 44px comfortable target. A hit-area extension would fix that without changing the layout.
- **Standalone `SearchField.Input`** (with no Group) still works and is still a bordered input on its own.

## Second pass — kitchen sink review

| Component                       | Problem                                                           | Fix                                                                             |
| ------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Badge, Chip                     | `outline` (the default) ignored `color`; no warning or info       | Outline/ghost use the color; `warning` and `info` added to the shared color set |
| Alert                           | Outline ignored `color`                                           | Tinted edge and colored title                                                   |
| ButtonGroup (attached)          | Neighbouring borders drew 2px seams; disabled outline filled grey | Borders overlap by one width; disabled keeps its treatment                      |
| Accordion                       | Bordered, centred triggers (outranked by a shared `:is()` reset)  | Full-width rows, chevron at the end, hairline separators                        |
| Breadcrumbs                     | Every crumb an accent underlined link; current page a faded link  | Quiet links, current page as plain text                                         |
| Item                            | Actions next to the title with a top margin                       | Actions at the end of the row                                                   |
| Meter, Progress, Slider         | Label and value stacked                                           | `Value` part; label and value on one row                                        |
| Skeleton                        | Bordered boxes, static                                            | Borderless fill, pulse (off for reduced motion)                                 |
| TagGroup                        | Remove button was a bordered box inside the tag                   | Borderless 24px icon button                                                     |
| Checkbox                        | Description started under the box, not the text                   | Indented to the label text                                                      |
| ColorField, NavigationMenu link | Label beside the input; link styled as body text                  | Label above; link matches triggers                                              |

NativeSelect now has the same 16px chevron as Select (a wrapper, because materials own the select's background).

Still open: Avatar shape in groups, Toggle and ToggleGroup default treatment (no visible frame at rest).

## Third pass — against shadcn/ui source

Table and DataTable, TagGroup, Kbd, ScrollArea, Empty, the AvatarGroup count, Carousel controls and Item separators were brought in line with shadcn's v4 styles; see docs/BUILD_LOG.md (2026-11-09, "second pass against shadcn/ui") for the before/after table.
