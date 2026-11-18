---
"@dixy-ui/react": minor
---

Add `size="xl"` to list-like parts: `ListBox.Root`, `Select.Trigger`/`Select.Popup`, `Menu.Popup`/`Menu.Item`/`Menu.LinkItem` and `Combobox.Input`/`Combobox.InputGroup`/`Combobox.Popup`. It sets options and inputs in the fluid `display.xl` role (36–72px), with row height `size + 2 × space-150`. Tracking is declared on each descendant, so `em` resolves at each element's own size. A grouped Combobox input takes the display font from its group. Menu items without their own size still inherit the popup's. Buttons, fields and other controls stay sm/md/lg.
