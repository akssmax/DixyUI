# Six skins — implementation and coverage

Date: 2026-10-20. This is implementation evidence, not a WCAG certification or a claim of personal mastery.

The existing components power Living Forest, Retro OS, Winamp Signal, Studio Hardware, Prism Glass and Tactile Atelier. They share behavior and use independent definition/CSS imports. The generated direction boards remain visual references; this implementation adapts their material language to working responsive controls. All six now use optional procedural React/SVG geometry, with live HTML text and controls. See FOREST_PROCEDURAL_THEME.md and PROCEDURAL_SKINS.md for the 2026-10-21 refinements.

## Preview scenes

- Overview: real navigation buttons, Cards, Tabs, TextField, Select, Switch, Checkbox, Radio, Slider, Progress, Dialog and Toast.
- Player: local playlist, selection, play/pause UI, favorite/shuffle/repeat and volume. No audio service or animation timer runs.
- Email: Postbox folder/list/reading-pane composition, search, All mail/Unread, starring, archive/trash with recovery, compose and inline reply. Sending changes local mock state only. Layout reference: [shadcn mail](https://v3.shadcn.com/examples/mail); all components are Dixy's.
- States: real invalid, disabled, loading and save feedback; library and surface views remain separate and lazy.

## Component coverage

All 78 registered previews retain their existing behaviors and inherit selected colors, typography, density and applicable geometry. The gallery omits material/radius/shape overrides so skin defaults can reach components; the ordinary component-page controls still supply their explicit values. “Recipe” describes styling support through the shared selectors, not exhaustive visual/state/AT verification for every part. Specialized chart marks, color editing canvases, decorative Shape artwork and icons retain their own semantics/artwork. No six-way component forks exist.

| Preview family      | Current treatment in all six skins                   |
| ------------------- | ---------------------------------------------------- |
| Accordion           | Shared foundations; specialist artwork remains plain |
| Alert               | Shared foundations + authored surface/control recipe |
| Alert Dialog        | Shared foundations + authored surface/control recipe |
| AspectRatio         | Shared foundations; specialist artwork remains plain |
| Autocomplete        | Shared foundations + authored surface/control recipe |
| Avatar              | Shared foundations; specialist artwork remains plain |
| Avatar Group        | Shared foundations; specialist artwork remains plain |
| Badge               | Shared foundations; specialist artwork remains plain |
| Box, Shape & layout | Shared foundations + authored surface/control recipe |
| Breadcrumbs         | Shared foundations; specialist artwork remains plain |
| Button              | Shared foundations + authored surface/control recipe |
| Button Group        | Shared foundations + authored surface/control recipe |
| Calendar            | Shared foundations + authored surface/control recipe |
| Card                | Shared foundations + authored surface/control recipe |
| Carousel            | Shared foundations; specialist artwork remains plain |
| Chart               | Shared foundations; specialist artwork remains plain |
| Checkbox            | Shared foundations + authored surface/control recipe |
| Checkbox Group      | Shared foundations; specialist artwork remains plain |
| Chip                | Shared foundations; specialist artwork remains plain |
| Collapsible         | Shared foundations; specialist artwork remains plain |
| ColorPicker         | Shared foundations; specialist artwork remains plain |
| Combobox            | Shared foundations + authored surface/control recipe |
| Command             | Shared foundations; specialist artwork remains plain |
| Context Menu        | Shared foundations + authored surface/control recipe |
| DataTable           | Shared foundations; specialist artwork remains plain |
| DateField           | Shared foundations; specialist artwork remains plain |
| DatePicker          | Shared foundations; specialist artwork remains plain |
| DateRangePicker     | Shared foundations; specialist artwork remains plain |
| Dialog              | Shared foundations + authored surface/control recipe |
| Drawer              | Shared foundations + authored surface/control recipe |
| Empty State         | Shared foundations; specialist artwork remains plain |
| Field               | Shared foundations; specialist artwork remains plain |
| Fieldset            | Shared foundations; specialist artwork remains plain |
| Form                | Shared foundations; specialist artwork remains plain |
| Icon                | Shared foundations; specialist artwork remains plain |
| Icon Button         | Shared foundations + authored surface/control recipe |
| Input Group         | Shared foundations + authored surface/control recipe |
| Item                | Shared foundations; specialist artwork remains plain |
| Kbd                 | Shared foundations; specialist artwork remains plain |
| Link                | Shared foundations; specialist artwork remains plain |
| ListBox             | Shared foundations + authored surface/control recipe |
| Menu                | Shared foundations + authored surface/control recipe |
| Menubar             | Shared foundations; specialist artwork remains plain |
| Meter               | Shared foundations + authored surface/control recipe |
| NativeSelect        | Shared foundations + authored surface/control recipe |
| Navigation Menu     | Shared foundations + authored surface/control recipe |
| Number Field        | Shared foundations + authored surface/control recipe |
| OTP Field           | Shared foundations + authored surface/control recipe |
| Pagination          | Shared foundations; specialist artwork remains plain |
| Popover             | Shared foundations + authored surface/control recipe |
| Preview Card        | Shared foundations + authored surface/control recipe |
| Progress            | Shared foundations + authored surface/control recipe |
| ProgressCircle      | Shared foundations; specialist artwork remains plain |
| Radio Group         | Shared foundations + authored surface/control recipe |
| RangeCalendar       | Shared foundations + authored surface/control recipe |
| Resizable Panels    | Shared foundations; specialist artwork remains plain |
| Scroll Area         | Shared foundations; specialist artwork remains plain |
| ScrollShadow        | Shared foundations; specialist artwork remains plain |
| Search Field        | Shared foundations; specialist artwork remains plain |
| Select              | Shared foundations + authored surface/control recipe |
| Separator           | Shared foundations; specialist artwork remains plain |
| Sidebar             | Shared foundations; specialist artwork remains plain |
| Skeleton            | Shared foundations; specialist artwork remains plain |
| Slider              | Shared foundations + authored surface/control recipe |
| Spinner             | Shared foundations; specialist artwork remains plain |
| Switch              | Shared foundations + authored surface/control recipe |
| Table               | Shared foundations; specialist artwork remains plain |
| Tabs                | Shared foundations + authored surface/control recipe |
| TagGroup            | Shared foundations; specialist artwork remains plain |
| Text Field          | Shared foundations + authored surface/control recipe |
| Textarea            | Shared foundations + authored surface/control recipe |
| TimeField           | Shared foundations; specialist artwork remains plain |
| Toast               | Shared foundations + authored surface/control recipe |
| Toggle              | Shared foundations; specialist artwork remains plain |
| Toggle Group        | Shared foundations; specialist artwork remains plain |
| Toolbar             | Shared foundations; specialist artwork remains plain |
| Tooltip             | Shared foundations + authored surface/control recipe |
| Typography          | Shared foundations; specialist artwork remains plain |

Frame treatment belongs to Card/Dialog. Generic popups receive a static surface finish; every popup is not wrapped in a botanical frame. Table/collection content, advanced date/color editors and navigation anatomy keep their component layout. Focus outlines, selection, errors and disabled semantics remain owned by the existing components. Explicit material overrides suppress skin finish recipes; the skin border vocabulary can remain.

## Architecture and authoring

SkinDefinition lives in framework-independent tokens; React depends on no skin package. Undefined skin inherits, null clears, explicit foundations win, and ancestor reduction wins. ThemeScope updates open portals. Themes ship compact independent definitions and CSS, a metadata-only catalog and a separate authoring entry. `defineSkin` still validates compact metadata; the new `parseThemeDocument`/`compileThemeDocument` path validates versioned source data and emits the six skins through trusted recipes. See [the shared engine contract](THEME_ENGINE.md) for current parameters and limits.

The playground allows installed skin IDs only. Version-1 foundation presets migrate to plain Dixy; version 2 stores the skin ID/version and bounded overrides. Unknown fields never become styles or executable code. The same resolved preset produces preview props and complete React/JSON/CSS exports. Share URLs are debounced; undo/redo is bounded to 30 snapshots and per-skin drafts last for the current session. The first visit to a skin uses its reference appearance (Signal/Prism dark); subsequent visits recover its draft. Direction and reductions persist across selection.

Community hosting, asset upload/ingestion, arbitrary preset CSS/shaders, a visual recipe compiler and a marketplace are future features. Custom developer definition/CSS pairs already work through public imports; external unknown IDs cannot be imported as installed playground skins.

## Performance boundaries

See packages/themes/dist/bytes.json for generated measurements. Each selected CSS entry is below the 5 KiB gzip budget. Forest's earlier WebP is retired; the optional React renderer draws the artwork in code. No skin requires a runtime bitmap. Core CSS is 34.55 kB gzip and imports no skins. Core runtime includes the small context/hooks needed for scoping, but no theme catalog, authoring tools, Motion requirement, Three.js, WebGL/WebGPU runtime or shader loop.

Only the requested skin CSS module is loaded; SSR includes its processed CSS and resolves relative assets. The overview does not mount Player, Email or the component gallery until selected. All six have separate optional React/SVG renderers. Forest has leaves, twigs, moss, flowers and paper grain; the five other packs add pixel chrome, rails/meters, machined hardware, spectral light, and walnut/paper/linen geometry. No JavaScript rendering loop, will-change promotion or per-card backdrop blur is introduced. Decorative motion is opt-in CSS animation; the playground stops its preview after 20 seconds. Prism has one explicit opt-in frosted toolbar; static is the default and reduction/unsupported support retains opaque content. A shader was not required for these six directions and remains deferred.

## Verification and limits

Required build/package and focused in-app browser results are recorded in BUILD_LOG.md and output/in-app-browser/six-skins/evidence.json. Automated coverage protects nested/cleared skins, explicit material, refs/native values, open portal identity/focus, preset migration/round trips, six complete exported wrappers, schema failures, independent CSS/assets and budgets. Packed core and selected-skin consumers verify declarations, ESM/SSR, browser builds and tree shaking.

Framework evidence is React 19 in an independent Vite consumer and the existing TanStack Start SSR docs. Next App Router and React Router SSR fixtures have not been added; no compatibility certification is claimed for them. Hardware energy, frame distributions, low-end mobile blur cost, screen readers, physical touch, 200/400% zoom, OS forced-colors and OS reduced-transparency remain release follow-ups. Static byte/structure checks and browser rendering do not substitute for those measurements. The backdrop option is experimental until profiled on target devices.
