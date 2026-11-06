import { useState } from "react";
import {
  Avatar,
  Radio,
  RadioGroup,
  Toggle,
  ToggleGroup,
  Slider,
  Accordion,
  Checkbox,
  Switch,
  Tabs,
  Tooltip,
  Combobox,
  Select,
  Stack,
  Theme,
  DirectionProvider,
  CSPProvider,
  Field,
  Dialog,
} from "@dixy-ui/react";

/** Compiles against the packed declarations, including generic object values. */
export function ExpandedConsumer() {
  const [checked, setChecked] = useState(false);
  const items = [
    { id: 1, label: "Personal" },
    { id: 2, label: "Team" },
  ];
  return (
    <CSPProvider nonce="consumer-example">
      <DirectionProvider direction="rtl">
        <Theme>
          <Stack>
            <Checkbox.Root
              checked={checked}
              onCheckedChange={setChecked}
              aria-label="Updates"
              size="sm"
              variant="outline"
              color="success"
              radius="full"
              material="paper"
            >
              <Checkbox.Indicator
                checkedIcon={<svg />}
                indeterminateIcon={<svg />}
              />
            </Checkbox.Root>
            <Switch.Root
              aria-label="Notifications"
              size="lg"
              color="success"
              variant="soft"
              radius="full"
              material="metal"
            >
              <Switch.Thumb
                checkedIcon={
                  <svg viewBox="0 0 16 16">
                    <path d="m3 8 3 3 7-7" />
                  </svg>
                }
              />
            </Switch.Root>
            <Tabs.Root
              defaultValue="one"
              size="lg"
              variant="solid"
              color="success"
              radius="full"
              material="metal"
              align="start"
              fullWidth
            >
              <Tabs.List>
                <Tabs.Tab value="one">One</Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel value="one">Content</Tabs.Panel>
            </Tabs.Root>
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger>Help</Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Positioner>
                    <Tooltip.Popup>Help</Tooltip.Popup>
                  </Tooltip.Positioner>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
            <Combobox.Root<(typeof items)[number]>
              items={items}
              onValueChange={(item) => {
                if (item) item.id.toFixed();
              }}
            >
              <Combobox.Input
                aria-label="Plan"
                size="lg"
                variant="soft"
                radius="full"
                material="paper"
              />
            </Combobox.Root>
            <Select.Root<(typeof items)[number]>
              items={items.map((item) => ({ label: item.label, value: item }))}
              onValueChange={(item) => {
                if (item) item.id.toFixed();
              }}
            >
              <Select.Trigger
                aria-label="Selected plan"
                size="sm"
                radius="none"
                material="metal"
              >
                <Select.Value />
              </Select.Trigger>
            </Select.Root>
            <ToggleGroup<string> attached multiple>
              <Toggle value="bold" size="sm" variant="solid" color="success">
                Bold
              </Toggle>
            </ToggleGroup>
            <RadioGroup<string>
              defaultValue="personal"
              orientation="horizontal"
              onValueChange={(value) => value?.toUpperCase()}
              aria-label="Plan type"
            >
              <Radio.Root
                value="personal"
                size="lg"
                color="success"
                variant="outline"
              >
                <Radio.Indicator />
              </Radio.Root>
            </RadioGroup>
            <Avatar.Root
              size="lg"
              radius="none"
              color="success"
              material="paper"
            >
              <Avatar.Fallback>AS</Avatar.Fallback>
            </Avatar.Root>
            <Slider.Root
              defaultValue={[25, 75]}
              size="sm"
              color="success"
              onValueChange={(value) => value[0]?.toFixed()}
            >
              <Slider.Control>
                <Slider.Track>
                  <Slider.Indicator />
                </Slider.Track>
                <Slider.Thumb index={0} aria-label="Minimum" />
                <Slider.Thumb index={1} aria-label="Maximum" />
              </Slider.Control>
            </Slider.Root>
            <Accordion.Root size="sm" variant="outline">
              <Accordion.Item value="one">
                <Accordion.Header>
                  <Accordion.Trigger>Question</Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Panel>Answer</Accordion.Panel>
              </Accordion.Item>
            </Accordion.Root>
            <Field.Root orientation="horizontal">
              <Field.Label>Project</Field.Label>
              <Field.Control />
              <Field.Item>Context item</Field.Item>
            </Field.Root>
          </Stack>
        </Theme>
      </DirectionProvider>
    </CSPProvider>
  );
}
const handle = Dialog.createHandle<{ projectId: number }>();
void handle;
// @ts-expect-error Checkbox checked state remains boolean, not an arbitrary string.
const invalidCheckbox = <Checkbox.Root checked="yes" />;
const invalidCombobox = (
  <Combobox.Root
    items={[{ id: 1 }]}
    onValueChange={(item) => {
      // @ts-expect-error The generic callback retains the item shape.
      return item?.missingProperty;
    }}
  />
);
void invalidCheckbox;
void invalidCombobox;
