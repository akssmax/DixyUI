import { Autocomplete, Stack } from "@dixy-ui/react";
import type { AutocompleteInputProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";

type Props = Pick<
  AutocompleteInputProps,
  "size" | "variant" | "radius" | "material"
> & {
  disabled?: boolean;
};

export default function AutocompleteExample({
  size = "md",
  variant = "outline",
  radius,
  material,
  disabled = false,
}: Props) {
  const items = ["React", "Vue", "Svelte", "Solid", "Angular"];
  return (
    <Stack gap="md" style={{ width: "min(100%, 22rem)" }}>
      <Autocomplete.Root items={items} disabled={disabled}>
        <Autocomplete.InputGroup
          size={size}
          variant={variant}
          radius={radius}
          material={material}
        >
          {" "}
          <Autocomplete.Input
            size={size}
            variant={variant}
            radius={radius}
            material={material}
            aria-label="Find a framework"
            placeholder="Find a framework…"
          />
          <Autocomplete.Clear aria-label="Clear framework" />
        </Autocomplete.InputGroup>
        <Autocomplete.Portal>
          <Autocomplete.Positioner sideOffset={8}>
            <Autocomplete.Popup
              size={size}
              variant={variant}
              radius={radius}
              material={material}
            >
              <Autocomplete.Empty>No frameworks found.</Autocomplete.Empty>
              <Autocomplete.List>
                {(item: string) => (
                  <Autocomplete.Item key={item} value={item}>
                    {item}
                  </Autocomplete.Item>
                )}
              </Autocomplete.List>
            </Autocomplete.Popup>
          </Autocomplete.Positioner>
        </Autocomplete.Portal>
      </Autocomplete.Root>
    </Stack>
  );
}
