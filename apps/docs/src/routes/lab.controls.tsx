import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { Plus } from "lucide-react";
import {
  Autocomplete,
  Button,
  Combobox,
  DateField,
  DatePicker,
  DateRangePicker,
  Heading,
  IconButton,
  InputGroup,
  NativeSelect,
  NumberField,
  OTPField,
  SearchField,
  Select,
  Tabs,
  Text,
  TextField,
  Theme,
  TimeField,
  Toggle,
  ToggleGroup,
} from "@dixy-ui/react";
import { useAppAppearance } from "../components/app-appearance-provider";
import {
  playgroundThemeProps,
  skinCatalog,
  skinThemePreset,
} from "../lib/theme-playground";
import {
  deduplicateSkinStyles,
  loadMaterialCSS,
  loadSkinCSS,
} from "../lib/theme-skin-catalogue";
import "../styles/controls-lab.css";

/**
 * Control alignment harness. Every field-like control renders at sm, md and
 * lg in one row, and each visible box carries `data-audit` so a script (or a
 * reviewer) can check that a row shares one height. Use `?skin=` to check a
 * starter skin.
 */
const sizes = ["sm", "md", "lg"] as const;
type Size = (typeof sizes)[number];

export const Route = createFileRoute("/lab/controls")({
  validateSearch: (search: Record<string, unknown>): { skin?: string } => ({
    skin: skinCatalog.some((skin) => skin.slug === search.skin)
      ? (search.skin as string)
      : undefined,
  }),
  loaderDeps: ({ search }) => ({
    id: skinCatalog.find((skin) => skin.slug === search.skin)?.id ?? "none",
  }),
  loader: async ({ deps }) => {
    try {
      const preset = skinThemePreset(deps.id);
      return {
        id: deps.id,
        css: await loadSkinCSS(deps.id),
        materialCSS:
          preset.material !== "inherit" ? await loadMaterialCSS() : "",
      };
    } catch {
      return { id: deps.id, css: "", materialCSS: "" };
    }
  },
  head: ({ loaderData }) => ({
    meta: [{ title: "Control alignment — Dixy UI lab" }],
    styles: [
      ...(loaderData?.css
        ? [{ "data-dixy-skin-style": loaderData.id, children: loaderData.css }]
        : []),
      ...(loaderData?.materialCSS
        ? [{ children: loaderData.materialCSS }]
        : []),
    ],
  }),
  component: ControlsLab,
});

function Row({ size }: { size: Size }) {
  return (
    <section className="controls-row" aria-labelledby={`row-${size}`}>
      <Heading as="h2" id={`row-${size}`} variant="title.sm">
        size="{size}"
      </Heading>
      <div className="controls-line">
        <Button size={size} data-audit="Button">
          Button
        </Button>
        <IconButton
          size={size}
          variant="outline"
          aria-label="Add"
          data-audit="IconButton"
        >
          <Plus />
        </IconButton>
        <TextField
          size={size}
          placeholder="TextField"
          aria-label="Text"
          data-audit="TextField"
        />
        <NativeSelect
          size={size}
          aria-label="Native select"
          data-audit="NativeSelect"
          defaultValue="a"
        >
          <option value="a">NativeSelect</option>
        </NativeSelect>
        <Select.Root defaultValue="a" items={[{ value: "a", label: "Select" }]}>
          <Select.Trigger size={size} aria-label="Select" data-audit="Select">
            <Select.Value />
            <Select.Icon />
          </Select.Trigger>
          <Select.Portal>
            <Select.Positioner>
              <Select.Popup size={size}>
                <Select.List>
                  <Select.Item value="a">
                    <Select.ItemText>Select</Select.ItemText>
                  </Select.Item>
                </Select.List>
              </Select.Popup>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
        <Toggle
          size={size}
          variant="outline"
          aria-label="Bold"
          data-audit="Toggle"
        >
          B
        </Toggle>
      </div>
      <div className="controls-line">
        <SearchField.Root size={size} aria-label="Search">
          <SearchField.Group data-audit="SearchField">
            <SearchField.Input placeholder="SearchField" />
            <SearchField.Clear />
          </SearchField.Group>
        </SearchField.Root>
        <Combobox.Root items={["One", "Two"]}>
          <Combobox.InputGroup size={size} data-audit="Combobox">
            <Combobox.Input
              size={size}
              placeholder="Combobox"
              aria-label="Combobox"
            />
            <Combobox.Trigger aria-label="Open" />
          </Combobox.InputGroup>
        </Combobox.Root>
        <Autocomplete.Root items={["One", "Two"]}>
          <Autocomplete.InputGroup size={size} data-audit="Autocomplete">
            <Autocomplete.Input
              size={size}
              placeholder="Autocomplete"
              aria-label="Autocomplete"
            />
          </Autocomplete.InputGroup>
        </Autocomplete.Root>
        <NumberField.Root size={size} defaultValue={3}>
          <NumberField.Group data-audit="NumberField">
            <NumberField.Decrement aria-label="Decrease" />
            <NumberField.Input aria-label="Number" />
            <NumberField.Increment aria-label="Increase" />
          </NumberField.Group>
        </NumberField.Root>
        <InputGroup.Root size={size} data-audit="InputGroup">
          <InputGroup.Addon aria-hidden="true">https://</InputGroup.Addon>
          <TextField size={size} placeholder="InputGroup" aria-label="Site" />
        </InputGroup.Root>
      </div>
      <div className="controls-line">
        <DateField.Root size={size} aria-label="Date">
          <DateField.Input data-audit="DateField">
            {(segment) => <DateField.Segment segment={segment} />}
          </DateField.Input>
        </DateField.Root>
        <TimeField.Root size={size} aria-label="Time">
          <TimeField.Input data-audit="TimeField">
            {(segment) => <TimeField.Segment segment={segment} />}
          </TimeField.Input>
        </TimeField.Root>
        <DatePicker.Root size={size} aria-label="Date picker">
          <DatePicker.Group data-audit="DatePicker">
            <DatePicker.Input>
              {(segment) => <DatePicker.Segment segment={segment} />}
            </DatePicker.Input>
            <DatePicker.Button />
          </DatePicker.Group>
        </DatePicker.Root>
        <DateRangePicker.Root size={size} aria-label="Date range">
          <DateRangePicker.Group data-audit="DateRangePicker">
            <DateRangePicker.Input slot="start">
              {(segment) => <DateRangePicker.Segment segment={segment} />}
            </DateRangePicker.Input>
            <span aria-hidden="true">–</span>
            <DateRangePicker.Input slot="end">
              {(segment) => <DateRangePicker.Segment segment={segment} />}
            </DateRangePicker.Input>
            <DateRangePicker.Button />
          </DateRangePicker.Group>
        </DateRangePicker.Root>
      </div>
      <div className="controls-line">
        <ToggleGroup
          segmented
          defaultValue={["a"]}
          aria-label="Segmented"
          data-audit="ToggleGroup segmented"
        >
          <Toggle size={size} value="a">
            All
          </Toggle>
          <Toggle size={size} value="b">
            In
          </Toggle>
        </ToggleGroup>
        <ToggleGroup
          attached
          defaultValue={["a"]}
          aria-label="Attached"
          data-audit="ToggleGroup attached"
        >
          <Toggle size={size} value="a" variant="outline">
            Day
          </Toggle>
          <Toggle size={size} value="b" variant="outline">
            Week
          </Toggle>
        </ToggleGroup>
        <Tabs.Root defaultValue="a" size={size}>
          <Tabs.List aria-label="Tabs" data-audit="Tabs">
            <Tabs.Tab value="a">Tab</Tabs.Tab>
            <Tabs.Tab value="b">Tab</Tabs.Tab>
            <Tabs.Indicator />
          </Tabs.List>
        </Tabs.Root>
        <OTPField.Root size={size} length={3} aria-label="Code">
          <OTPField.Input data-audit="OTPField" />
          <OTPField.Input aria-label="Digit 2" />
          <OTPField.Input aria-label="Digit 3" />
        </OTPField.Root>
      </div>
    </section>
  );
}

function ControlsLab() {
  const { id } = Route.useLoaderData();
  const { appearance } = useAppAppearance();
  useEffect(() => deduplicateSkinStyles(id), [id]);
  const themeProps = useMemo(
    () => playgroundThemeProps({ ...skinThemePreset(id), appearance }),
    [id, appearance],
  );
  return (
    <Theme {...themeProps} className="controls-lab">
      <main className="controls-main">
        <Heading as="h1" variant="heading.sm">
          Control alignment
        </Heading>
        <Text tone="muted">
          Every row should share one height per size. Outlines mark each
          measured box.
        </Text>
        {sizes.map((size) => (
          <Row key={size} size={size} />
        ))}
      </main>
    </Theme>
  );
}
