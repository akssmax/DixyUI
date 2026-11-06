# Common component additions — 2026-10-15

All 37 common families from the approved gap list now have public implementations, complete demos, composition guidance, local API metadata and comparison cards where applicable. This is an implementation milestone, not a WCAG conformance claim or full feature parity with the reference catalogs.

Dixy now has **76 component documentation pages** and **92 uppercase runtime exports**. Five of those exports are the nonvisual LocaleProvider and internationalized date/time value constructors. Families, compound parts, providers and utility classes are different inventories; do not treat these counts as accessibility coverage.

## Behavior ownership

Prefer the installed Base UI primitive and existing Dixy parts. React Aria Components 1.22.1 provides unstyled fallback behavior for collections, navigation links, search, date/time and color controls. Native HTML remains the source of truth for static content and native editing/navigation. No component or styling is imported from shadcn or HeroUI.

| Documentation page | Public family   | Behavior foundation |
| ------------------ | --------------- | ------------------- |
| Button Group       | ButtonGroup     | Base UI + native    |
| Avatar Group       | AvatarGroup     | Base UI + native    |
| Card               | Card            | Native HTML         |
| Alert              | Alert           | Native HTML         |
| Badge              | Badge           | Native HTML         |
| Chip               | Chip            | Native HTML         |
| Kbd                | Kbd             | Native HTML         |
| Textarea           | Textarea        | Native HTML         |
| Input Group        | InputGroup      | Base UI + native    |
| Link               | Link            | React Aria          |
| Skeleton           | Skeleton        | Native HTML         |
| Spinner            | Spinner         | Native HTML         |
| Empty State        | Empty           | Native HTML         |
| Breadcrumbs        | Breadcrumbs     | React Aria          |
| Pagination         | Pagination      | Native HTML         |
| Command            | Command         | Base UI             |
| ListBox            | ListBox         | React Aria          |
| TagGroup           | TagGroup        | React Aria          |
| Search Field       | SearchField     | React Aria          |
| Table              | Table           | Native HTML         |
| DataTable          | DataTable       | React Aria          |
| Sidebar            | Sidebar         | Base UI + native    |
| Item               | Item            | Native HTML         |
| AspectRatio        | AspectRatio     | Native HTML         |
| Resizable Panels   | Resizable       | Native HTML         |
| Carousel           | Carousel        | Native HTML         |
| Chart              | Chart           | Native HTML / SVG   |
| ProgressCircle     | ProgressCircle  | Native HTML / SVG   |
| ScrollShadow       | ScrollShadow    | Native HTML         |
| Calendar           | Calendar        | React Aria          |
| RangeCalendar      | RangeCalendar   | React Aria          |
| DateField          | DateField       | React Aria          |
| TimeField          | TimeField       | React Aria          |
| DatePicker         | DatePicker      | React Aria          |
| DateRangePicker    | DateRangePicker | React Aria          |
| NativeSelect       | NativeSelect    | Native HTML         |
| ColorPicker        | ColorPicker     | React Aria          |

Base UI references: [components](https://base-ui.com/react/overview/quick-start). React Aria references: [getting started](https://react-aria.adobe.com/getting-started), [DatePicker](https://react-aria.adobe.com/DatePicker), [Table](https://react-aria.adobe.com/Table), [ColorPicker](https://react-aria.adobe.com/ColorPicker). The catalogs inform scope; local public contracts determine the API.

## Public contracts

- Native compound parts preserve native attributes/events, React 19 refs and a typed `as` override for semantic elements. Card titles can use the appropriate heading level. Native Textarea and NativeSelect need a wrapping label or explicit id/htmlFor; they do not silently acquire a Field label through context.
- ButtonGroup and AvatarGroup provide visual defaults without cloning children. Explicit child settings override them. ButtonGroup retains ordinary Tab stops; Toolbar remains the roving-focus pattern. Counts and static labels do not acquire fake interactive roles.
- React Aria wrappers retain generic collections, render callbacks, slots, controlled/uncontrolled values, disabled keys, validation and focus behavior. Calendar/date/time values stay typed internationalized objects rather than a hand-written Date parser. `LocaleProvider` selects locale/calendar conventions; match locale direction to the intended Theme direction. Cross-locale/RTL release review remains pending.
- Date pickers use React Aria Button/Popover/Calendar parts together. Dixy's popup requires an accessible name and restores CSS tokens through its portal while the primitive owns presence and focus. Reduced motion removes its finite fade. Do not mix Base UI triggers into React Aria slot contexts.
- Command composes Base UI Combobox and optional Dialog. Its inline list stays logically open and highlights matches by default, following the installed primitive contract. The application owns the selected action.
- DataTable is a React Aria collection adapter: selection, cell navigation, sortable-column callbacks and optional column resizers remain primitive-owned. The application sorts, filters, paginates and loads rows. Table is the separate native semantic table.
- Resizable currently models exactly two panes with a named separator, bounded percentage state, pointer capture and orientation/RTL-aware keyboard resizing. Nested roots can form larger layouts. Pointer movement is immediate and reads geometry at drag start. The 24px interaction target surrounds a thin visual divider; there is no layout interpolation.
- Carousel uses native scrolling and snap points with explicit previous/next actions, boundary states and slide announcements. It does not rotate automatically or run a background timer. Chart starts with a lightweight nonnegative SVG bar recipe and an expandable native data table. Other chart types and advanced carousel features remain extensions.
- Skeleton is static. ScrollShadow uses local/scroll gradient attachments rather than an event/render loop. ProgressCircle has a named progressbar role and bounded values. Optional materials add no texture requests or blur.

## Documentation and packaging

The 37 new pages add **94 grouped comparison categories**, using the same single preview/source card as Checkbox and Switch. Copied examples preserve helpers, state, all sibling configurations and Theme. All families also appear in the existing lazy theming gallery. Docs use the new public Table for API/token tables, Kbd for shortcut labels and Textarea for preset JSON editing.

Local API generation includes inherited Dixy visual fields, excludes native/third-party attributes from the own-prop table, and separately discovers React Aria compound-part contracts. No generated API file is hand-edited. The example checker still checks every configuration against a snapshot of compiled public declarations; bounded batches of 16 share the declaration graph instead of rebuilding it for each example.

React Aria uses leaf imports and remains a package dependency rather than bundled implementation code. Pure namespace initialization keeps unused families out of a basic consumer build. The isolated packed fixture checks all new public families, typed dates and collections, semantic heading/ref composition, and a named popup type. Existing unused-family/tree-shaking assertions are retained and extended to the fallback families. The final build/check results are recorded in BUILD_LOG.md.

## Verification boundary

Focused contract and browser evidence is recorded in BUILD_LOG.md and `output/in-app-browser/component-additions/`. Broad per-component visual/state/contrast matrices, real assistive technology, forced colors, text resize/zoom, physical touch, Safari/Firefox, locale/calendar/time-zone combinations, narrow reflow, durable baselines and hardware energy measurements remain release work. The documentation mobile shell remains deferred. Passing primitive or automated tests does not establish WCAG 2.2 AA conformance or personal mastery.
