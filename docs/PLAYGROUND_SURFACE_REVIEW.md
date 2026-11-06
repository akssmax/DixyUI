# Playground and surface review

The playground follows the preview-first arrangement of the [HeroUI theme builder](https://heroui.com/en/themes): a compact toolbar, a dense workspace of real components and primary theme controls underneath. Dixy keeps its own components, tokens and visual identity. Overview, All components and Surfaces & borders provide separate views; less-used settings live in the More foundations dialog. The library gallery remains lazy and searchable.

Preview appearance now applies to the whole playground, including its editor chrome, without changing the documentation app's saved appearance. Existing preset links, import/export and complete generated React code remain supported.

## Border decisions

| Token                       | Purpose                               | Decision                                                                                  |
| --------------------------- | ------------------------------------- | ----------------------------------------------------------------------------------------- |
| `--dixy-border-width-0/1/2` | Fixed CSS pixel primitives            | Keep independent of spacing density.                                                      |
| `--dixy-stroke-width`       | Configurable 1px/2px theme stroke     | New inherited token used by subtle/default/danger shorthands and component width aliases. |
| `--dixy-border-subtle`      | Decorative dividers and content edges | Use on cards; not sufficient alone to identify an interactive control.                    |
| `--dixy-border-default`     | Identifiable control boundary         | Keep the existing tested neutral color.                                                   |
| `--dixy-border-strong`      | Extra emphasis                        | Keep fixed 2px and its own color role.                                                    |
| Focus ring width/offset     | Keyboard focus                        | Keep 2px/3px independently of theme stroke.                                               |

The previous width labels “Subtle” and “Strong” confused thickness with contrast. The editor now says “1px · Standard” and “2px · Bold.” The public role names remain compatible. Existing explicit per-component width overrides remain supported.

Canonical OKLCH values were checked across 39 accents, 11 neutral families, two appearances and five opaque surfaces: **4,290 combinations per role**.

| Role                     | Minimum contrast |
| ------------------------ | ---------------: |
| Default control border   |          3.368:1 |
| Focus border             |          3.299:1 |
| Primary text             |         14.276:1 |
| Secondary text           |          7.360:1 |
| Subtle decorative border |          1.386:1 |

These are token calculations for named themes, not a complete browser or WCAG conformance result. Custom compositions, alpha surfaces, disabled states and consumer overrides need their own review.

## Surface decisions

| Semantic role               | Light  | Dark   | Use                           |
| --------------------------- | ------ | ------ | ----------------------------- |
| `background.canvas`         | base.1 | base.1 | Page background               |
| `background.surface.sunken` | base.3 | base.1 | Wells within a parent surface |
| `background.surface`        | base.2 | base.2 | Grouped content               |
| `background.surface.raised` | white  | base.3 | Cards and floating surfaces   |

Keep the existing neutral hierarchy. Sunken is contextual: in dark mode it shares the canvas color and is recessed within a lighter parent surface. The playground shows all four roles together and keeps elevation separate from surface color.

Card now uses the raised surface, decorative border and its existing `--dixy-card-shadow` alias. Material styling preserves the card's chosen elevation; the static image still supplies the finish. For cards, the depth token takes priority over a material's inset edge so additional shadow layers do not accumulate. Reduced effects and forced-colors rules retain priority.

The generator previously rebound shadow and border aliases on every `data-radius` element. This reset inherited overrides on card roots. Radius, appearance-dependent shadows and width aliases now have separate scope rules. A regression assertion prevents radius scopes from resetting depth or stroke aliases. Generated CSS is rebuilt from canonical sources.

## Validation boundary

Implementation checks cover canonical token generation, typechecking, unit contracts, complete consumer examples and independent package builds. Browser evidence covers the production workspace, keyboard tab selection and dialog focus restoration, theme export/copy, gallery filtering, stroke/elevation changes, light/dark, reduced motion and narrow reflow. Full WCAG 2.2 AA, assistive technology, physical touch and platform testing remain pending. See `docs/BUILD_LOG.md` for final run results and evidence paths.
