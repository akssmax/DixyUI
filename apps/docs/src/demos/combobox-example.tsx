import { Combobox, Stack } from "@dixy-ui/react";
import type { ComboboxInputProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";

type Props = Pick<
  ComboboxInputProps,
  "size" | "variant" | "radius" | "material"
> & {
  disabled?: boolean;
};

export default function ComboboxExample({
  size = "md",
  variant = "outline",
  radius,
  material,
  disabled = false,
}: Props) {
  const items = ["React", "Vue", "Svelte", "Solid", "Angular"];
  return (
    <Stack gap="md" style={{ width: "min(100%, 22rem)" }}>
      <Combobox.Root items={items} disabled={disabled}>
        <Combobox.InputGroup
          size={size}
          variant={variant}
          radius={radius}
          material={material}
        >
          {" "}
          <Combobox.Input
            size={size}
            variant={variant}
            radius={radius}
            material={material}
            aria-label="Find a framework"
            placeholder="Find a framework…"
          />
          <Combobox.Trigger aria-label="Show frameworks" />
          <Combobox.Clear aria-label="Clear framework" />
        </Combobox.InputGroup>
        <Combobox.Portal>
          <Combobox.Positioner sideOffset={8}>
            <Combobox.Popup
              size={size}
              variant={variant}
              radius={radius}
              material={material}
            >
              <Combobox.Empty>No frameworks found.</Combobox.Empty>
              <Combobox.List>
                {(item: string) => (
                  <Combobox.Item key={item} value={item}>
                    {item}
                    <Combobox.ItemIndicator />
                  </Combobox.Item>
                )}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </Stack>
  );
}
