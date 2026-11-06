# Dixy learning notes

Use these notes beside the source. The objective is to understand and change the system independently, not just have a working demo.

## 1. A package boundary makes the contract real

The docs depend on the compiled `@dixy-ui/react` package. Its exports define which JavaScript, types, and CSS are public. An independent fixture installs a tarball so workspace resolution cannot conceal a missing file.

```tsx
import { Button, Theme } from "@dixy-ui/react";
import "@dixy-ui/react/styles.css";
```

Read `packages/react/package.json`, `vite.config.ts`, and `scripts/verify-package.mjs`. Explain why React is a peer, why Base UI is a dependency, and why both remain external to the library bundle.

**Exercise:** remove the CSS export in a local experiment. Which check catches it? Restore it and explain the difference between a source import and a public package export.

## 2. Styling and behavior are one contract

Button adds a constrained visual vocabulary while preserving Base UI props, state-based className callbacks, refs and event handlers.

```tsx
<Button loading>Save changes</Button>
```

Loading renders a progress indicator, sets `aria-busy`, and disables activation. A spinner alone would not prevent duplicate requests. Reduced motion stops rotation while the busy state remains available.

Read `packages/react/src/components/button.tsx` and its behavioral tests. The initial composition test exposed that a Base UI Button rendered as an anchor retains button semantics by default. An anchor intended for navigation needs explicit link semantics:

```tsx
<Button nativeButton={false} role="link" render={<a href="/guide" />}>
  Read the guide
</Button>
```

**Exercise:** explain why changing the tag does not necessarily change the accessible role.

## 3. Tokens express roles

```css
.dixy-button {
  background: var(--dixy-accent);
  color: var(--dixy-accent-contrast);
}
```

A theme maps these roles to light/dark palettes. Components reference the roles rather than individual colors. Radius, spacing, typography and motion use the same principle.

Read `packages/react/src/tokens/tokens.css`. Add another accent without changing Button. Check every foreground/background pairing before calling it complete.

## 4. The cascade is part of the API

Library styles live in CSS layers. Unlayered application CSS has higher cascade priority. During browser review, the docs' generic `button { color: inherit }` reset overrode the library's contrasting button text. The fix scoped the reset to documentation controls rather than fighting specificity.

```css
button:not(.dixy-button) {
  color: inherit;
}
```

**Exercise:** reproduce the cascade issue, inspect the winning declaration in DevTools, and explain why adding a more specific selector inside the library's layer would not solve it.

## 5. React and CSS follow different trees

Portals preserve React context but move DOM nodes. A nested Theme can therefore reach a Dialog through React while its CSS variables no longer inherit from the original DOM ancestor.

```tsx
<Primitive.Portal>
  <ThemeScope>{children}</ThemeScope>
</Primitive.Portal>
```

Read `theme/theme.tsx` and `components/dialog.tsx`. ThemeScope reapplies appearance, accent, radius, and merged inline overrides. It does not promise to clone arbitrary ancestor CSS selectors.

**Exercise:** reproduce a light dialog inside a dark page, remove ThemeScope, observe the difference, then fix it. Explain stacking contexts separately from inheritance.

## 6. A field is a relationship

```tsx
<Field.Root>
  <Field.Label>Project name</Field.Label>
  <TextField />
  <Field.Description>Visible to your team.</Field.Description>
</Field.Root>
```

Base UI context connects the visible label and description to the input. A controlled value needs its matching callback; invalid state needs a useful recovery message. Placeholder text does not replace a label.

**Exercise:** inspect the accessibility tree, then intentionally break the description relationship and write a test that catches the regression.

## 7. Docs are another consumer

Playgrounds use real typed demo modules. Code views load those same files and apply selected prop defaults; API tables come from local TypeScript members and JSDoc. Conceptual guidance remains authored. This reduces drift without pretending all behavior can be generated.

Read `scripts/generate-api.mjs`, the component registry, and `component-page.tsx`. Notice lazy demos, lazy implementation source, finite controls, and an error boundary around the preview.

**Exercise:** extend a prop union and update every consumer. Explain where automated extraction helps and where a human explanation is still necessary.

## 8. Verification has boundaries

Unit tests establish specific behavior. A production build establishes compilation. A packed consumer checks distribution. Browser interaction tests check what actually happens with focus, layout, and state. An axe scan detects a subset of accessibility issues.

None of these substitutes for manual screen-reader, zoom, high-contrast or touch testing. Keep those checklist items unchecked until there is real evidence.

**Next exercise:** implement Checkbox yourself using the existing token and API conventions. Before asking for a review, explain its controlled/uncontrolled states, label relationship, checked and indeterminate states, keyboard behavior, and form submission value.

## 9. Typography is a coordinated contract

A type style pairs family, size, leading, weight and tracking. Changing only size makes hierarchy accidental. Our source uses meaning-based paths such as `font.body.md`; CSS uses `--dixy-font-body-md`. Primitive sizes can include their reference number (`font.size.16`), but semantic names describe purpose.

```tsx
<Heading as="h2" variant="title.lg">Project details</Heading>
<Text variant="body.md">A comfortable reading default.</Text>
```

The h2 defines document structure. The title role defines visual hierarchy. Text's `size="sm|md|lg"` remains a convenience for body roles; Heading's size selects heading roles. An explicit variant takes precedence. Avoid passing both unless that precedence is intentional.

```css
.article {
  font: var(--dixy-font-body-md);
  letter-spacing: var(--dixy-font-body-md-letter-spacing);
}
```

The font shorthand cannot contain tracking, so it needs its own property. Size and leading use rem to respect root preferences. Tracking uses em to follow its own text size. A body style is 16/24 at the default root, compact text is 14/20, and 12px styles are supporting metadata. Spacing density does not change typography.

The recommendation combines [Atlassian's semantic tokens](https://atlassian.design/foundations/tokens/design-tokens), [Material 3's role families](https://m3.material.io/styles/typography/overview), [Primer's practical UI styles](https://primer.style/product/primitives/typography/), and [Radix's separation of visual size from HTML](https://www.radix-ui.com/themes/docs/theme/typography). [Apple's typography guidance](https://developer.apple.com/design/human-interface-guidelines/typography) informs legibility and resizing; native platform point sizes are not web defaults. These are design inputs, not compatibility claims or a copy of any reference system.

Inter is the interface/heading default; Space Grotesk is reserved for expressive display. The previous Inter weight-only font file could not exercise optical sizing. The docs now load Inter's standard variable file, which includes wght and opsz. Inter's documented weight and optical-size designs are described in [its official documentation](https://rsms.me/inter/). In our bundled metadata Inter has weight 100–900 and optical size 14–32; Space Grotesk has weight 300–700 only. Use font-weight and font-optical-sizing before low-level font-variation-settings. An axis control must match the actual file, not just the typeface's marketing name.

Browser review found that the largest display role overflowed the narrow component preview even though the outer page had no horizontal scroll. Adding `overflow-wrap: anywhere` to demo text fixed the clipped words. Check the inner preview's bounds as well as the page's bounds.

**Exercises:** trace body.md from the TypeScript contract to generated CSS and computed style; explain how 650 is rendered by a variable font; override the sans family on a nested Theme; test zoom and custom text spacing; change a role without changing the HTML outline. Explain why the library supplies stacks while the app owns font files and licensing.

## 10. Icon selection and icon rendering are different responsibilities

An icon pack owns geometry: its viewBox, stroke construction, fill and supported weights. Dixy owns the common visual and accessibility contract. The existing `size.icon.*` and `color.icon.*` families already provided those primitives; the Icon component reuses them instead of introducing competing names. The new 2xl step is 48px/3rem.

```tsx
<Icon render={<Search />} size="sm" color="secondary" />
<Icon render={<HeartIcon weight="duotone" />} color="danger" />
```

The render prop follows Base UI composition. Pack-only props remain on the actual element, where its own TypeScript contract checks them. This avoids pretending Lucide's strokeWidth and Phosphor's weight are the same operation. No icon pack becomes a runtime dependency of Dixy. Docs install Lucide and Phosphor, while the packed consumer can use a native SVG without either.

The wrapper uses Base UI's useRender to merge the render element's and caller's refs, classes, styles and event handlers. It then normalizes accessible naming so a pack default cannot hide a labeled image or expose decoration accidentally. A meaningful standalone image gets role=img and its label; decoration gets aria-hidden and no keyboard stop.

```tsx
<IconButton aria-label="Search projects">
  <Icon render={<Search />} />
</IconButton>
```

The action is the button. A 16px glyph is not its activation target, and a disabled foreground is not disabled behavior. Inherit currentColor within controls so the icon follows the button's contrasting foreground. Explicit icon roles suit standalone/status content, with text when meaning matters.

**Exercises:** swap Lucide for Phosphor while preserving semantic size/color; explain why their 24-unit and 256-unit viewBoxes should stay unchanged; verify both SVG refs and both click handlers survive composition; inspect the accessibility tree with and without label; compare a filled icon with an outline without forcing a shared stroke width; explain why Iconify's runtime name lookup differs from a static SVG import.

The docs' pack matrix distinguishes the two exercised integrations and custom SVG tests from future Iconify exploration, semantic registries, Material Symbols axes and other untested adapters. A compatible-looking API is a hypothesis until exercised in the target app and packaged build.

## 11. A complete primitive contract can share a visual recipe

Dixy now wraps all 37 documented Base UI component families in the installed 1.9.0 release. Radio and RadioGroup are separate modules within one family. Input is called TextField in Dixy. A family includes its compound parts and helpers, not just the default example: Menu has submenu/checkbox/radio items; Combobox has chips, collection and filter helpers; popup families expose detached handles where upstream supports them.

The wrappers keep the primitive namespace and replace DOM-rendering parts with styled versions. `styledPrimitive` preserves the exact component type, including generic values, and adds only a merged className. React 19 passes refs as props. The wrapper introduces no DOM element, state or event callback. `themedPortal` is the deliberate exception: its ThemeScope restores the CSS inheritance that a DOM portal loses. Theme now also coordinates Base UI direction and the actual DOM `dir`, so RTL affects keyboard behavior and portal text direction together.

```tsx
const [checked, setChecked] = useState(false);

<label>
  <Checkbox.Root name="updates" checked={checked} onCheckedChange={setChecked}>
    <Checkbox.Indicator aria-hidden="true">✓</Checkbox.Indicator>
  </Checkbox.Root>
  Product updates
</label>;
```

Checked state and indeterminate state are separate. An indeterminate checkbox can communicate a partially selected set without submitting a made-up string value. The real label owns the control's name; the checkmark is visual decoration. Switch uses the same controlled pattern with on/off setting semantics.

A recipe references semantic roles, then component geometry aliases:

```css
.dixy-checkbox-root[data-checked]::before {
  background: var(--dixy-color-background-action-primary);
  border-color: var(--dixy-color-background-action-primary);
}

.dixy-switch-thumb {
  inline-size: var(--dixy-switch-thumb-size);
  transition: transform var(--dixy-motion-transition-feedback);
}
```

The visible mark is independent from the interaction target. Density changes padding and gaps while label fonts and activation floors remain stable. Circular radios and slider thumbs use circular geometry; other surfaces follow control/card/overlay corner roles. Simple state feedback uses CSS motion tokens; Base UI owns presence and positioning. Tooltip delays, toast lifetimes and gesture offsets are behavior inputs rather than animation duration tokens.

### Read upstream contracts instead of guessing them

- [Base UI 1.9 Tooltip](https://base-ui.com/react/components/tooltip) is a visual hint for sighted users. The trigger has its own accessible name; essential help stays visible. Our tooltip repeats its trigger's label and preserves upstream behavior.
- OTPField ignores `aria-label` on its first input. Use a real label targeting the root's input id (or Field.Label), then name later slots if needed. Paste/autofill is coordinated by the root.
- Select picks a value; Combobox combines filtering with selection; Autocomplete accepts free text with suggestions. These are related surfaces with different value contracts.
- Progress reports task completion. Meter reports a scalar measurement. Their widths are driven by real values; a demo does not invent elapsed progress.
- Drawer has gesture and snap-point behavior that a positioned Dialog does not provide. The default recipe is a bottom drawer; directional recipes retain Base UI swipe variables.

For object values, keep generic information explicit when the primitive cannot infer it from items alone. Select's label catalog uses label/value entries:

```tsx
type Plan = { id: number; label: string };
const plans: Plan[] = [{ id: 1, label: "Personal" }];

<Select.Root<Plan>
  items={plans.map((plan) => ({ label: plan.label, value: plan }))}
  onValueChange={(plan) => console.log(plan?.id)}
>
  <Select.Trigger aria-label="Plan">
    <Select.Value />
  </Select.Trigger>
</Select.Root>;
```

### Documentation and distribution are part of the component

Every family has a lazy live demo, complete copyable source, controls for relevant example props, theme settings, keyboard/accessibility notes, token guidance and implementation source. API metadata follows the installed public TypeScript contract. Native HTML props are forwarded rather than copied into a giant table. Each family's part/prop reference is loaded separately, so its data is not bundled into the documentation shell.

Factory calls are marked pure because constructing a wrapper has no side effects. Without that annotation a bundler can retain unused styled wrappers and their upstream imports. This matters when a consumer uses only Button while the library exports dozens of other families. The packed consumer checks public exports, generic callbacks, negative type cases, styles, ESM/SSR and a browser build independently of workspace source.

Personal exercise: implement a controlled checkbox, explain its submitted form value, switch the surrounding Theme to RTL/dark/reduced motion, then explain what must cross a popup portal. Successful tests establish implementation evidence, not your personal mastery.
