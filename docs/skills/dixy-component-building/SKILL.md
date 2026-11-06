---
name: dixy-component-building
description: Add or update Dixy React design-system components with Base UI contracts, Dixy visual foundations, composition documentation, synchronized examples, and WCAG 2.2 accessibility evidence. Use for component implementation and coverage planning in Dixy, rather than standalone app design.
---

# Build Dixy components

Work from the repository’s actual public contracts. Read its AGENTS.md and inspect the requested component, its styles, Theme, motion aliases, docs registry, examples, generated API scripts and packed consumer. Keep unrelated components as planned work unless requested. For prioritization, read `docs/COMPONENT_ROADMAP.md` in the repository and recheck current exports before treating its dated inventory as current.

## Establish behavior and anatomy

Use current official shadcn Base UI and HeroUI pages as references when requested. Inspect relevant live interactions with Codex’s in-app browser. Explain where their part names differ from Dixy’s Base UI names; do not import a second component stack to copy appearance.

Define the actual composition before adding controls. Show Root, behavior-owning parts, decoration and matching value/ID relationships in the documentation. Document native elements as native elements. Keep nested interactive controls out of triggers when their semantics prohibit them.

Preserve the installed Base UI refs, event details/cancellation, controlled/uncontrolled state, render/className/style callbacks, form values, focus, hidden/presence state and accessibility contracts. React 19 permits forwarding ref through props. Check the local primitive rather than assuming disabled items always skip roving focus: Tabs currently permits disabled arrow-key focus for discovery while blocking activation. Keep nested component instances independent.

## Add meaningful visual foundations

Use Dixy’s existing vocabulary where it fits: sm/md/lg, semantic action colors, selected emphasis, contextual radii, Theme inheritance, and optional static materials. Do not force every prop onto every component. Text and focus must remain readable across appearances, selected/inactive/invalid/disabled states and materials. For checkbox/switch, unchecked state stays neutral. For tabs, inactive labels stay neutral. Reserve the active bar for the line variant; solid/soft/outline use their selected surface without another underline inside pill or segmented triggers.

Keep visual size separate from `--dixy-interaction-target`; density does not currently change that minimum token. Let consumers override shared geometry without losing native semantics. Avoid clipping focus with radius or overflow. A decorative optional part must not make the base control unreadable when omitted or before hydration.

Use component motion aliases generated from the shared motion contract. Keep feedback finite and reductions inherited. Base UI owns presence; do not add a second mount/exit lifecycle. Prefer CSS and existing primitive geometry measurements for simple motion. Static materials must not add a rendering loop, texture request or required Motion dependency. Use blur/refraction only when explicitly within scope and profile it separately.

## Keep documentation executable

Docs consume compiled public exports; the library remains independent of the docs/router. Add authored anatomy/usage guidance to the registry, generate prop metadata from local interfaces, and never hand-edit generated CSS/API files.

Use one focused primary playground. Keep controls, rendered props and complete copied source aligned. Reset props, local state, events and theme settings consistently. Put useful variants, sizes, semantic colors, radii, materials, composition and behavior examples below the playground. Reuse the shared comparison cards and lazy source loading. Each copied example includes its imports, helper functions, data, state and Theme configuration; typecheck complete examples against the built package.

Inspect computed browser styles. Unlayered documentation resets can override layered library colors/fonts despite correct component CSS. Keep docs resets scoped to documentation controls. Defer docs-shell redesign or mobile polish when the user does, while still checking the component’s reflow, focus visibility and operability.

## Accessibility evidence gate

Target WCAG 2.2 AA unless the user specifies another level. Use [WCAG 2.2](https://www.w3.org/TR/WCAG22/) for success criteria and [APG patterns](https://www.w3.org/WAI/ARIA/apg/patterns/) for interaction guidance; an APG match alone does not establish WCAG conformance.

For the changed component, record the applicable checks:

- Names, descriptions, roles, state, relationships, errors and status announcements; prefer native HTML semantics and avoid redundant announcements from decorative icons.
- Keyboard entry/exit, activation, orientation, RTL, Home/End, disabled behavior, focus restoration, and no keyboard trap. For Tabs, distinguish manual selection from focus and use automatic activation only when panels appear promptly.
- Text contrast (normally 4.5:1, 3:1 for qualifying large text), applicable 3:1 non-text contrast, selection cues beyond color, and a visible focus indicator that is not obscured. Test actual composited surfaces when materials affect them.
- AA target-size minimum/spacing exceptions, reflow at 320 CSS px, 200% text resize and 400% zoom where applicable. Do not confuse a small visual mark with its larger interaction target.
- Light/dark, reduced motion/effects, forced colors and usable native/JS fallback as applicable. Reduced-motion support is also Dixy policy; it is not evidence that all AA criteria pass.
- Screen-reader output with a named browser/assistive-technology combination. Record untested physical touch, platforms, zoom or preference modes rather than claiming coverage.

Use meaningful regression tests for contracts at risk and applicable automated accessibility checks. DOM-only tooling cannot verify rendered contrast, clipping, zoom, real screen-reader output or complete WCAG conformance. Record exclusions and pending manual checks. Never label all components WCAG compliant merely because Base UI or axe tests pass.

## Finish with reviewable evidence

Run `pnpm check`; run `pnpm package:check` for public types/exports, CSS or packaging changes. Keep independent consumer fixtures representative. Typecheck copied examples, then verify the fresh production build in the in-app browser; restart an owned preview after rebuilding SSR output. A package rebuild may require a full development reload because of the known appearance-provider Fast Refresh issue.

Check relevant desktop/component reflow, keyboard, light/dark and normal/reduced behavior. Save screenshots and concise DOM measurements as local review evidence, restore temporary viewport/preferences, and state remaining release checks. Update `DESIGN_ENGINEERING_CHECKLIST.md` and `docs/BUILD_LOG.md`; implementation evidence does not establish the user’s mastery, so personal learning items stay unchecked.

For a coverage audit, distinguish present public equivalents, supported compositions, partial/private implementations, and absent exports. Count families/pages separately from compound parts and providers. Use a dated mapping to current official catalogs, prioritize basic gaps, and separate new components from upgrades to existing wrappers. Do not add all planned components during an audit.
