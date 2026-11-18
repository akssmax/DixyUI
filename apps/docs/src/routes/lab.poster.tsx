import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Combobox,
  ListBox,
  Menu,
  Select,
  Switch,
  Tabs,
  Text,
  Theme,
} from "@dixy-ui/react";
import { useAppAppearance } from "../components/app-appearance-provider";
import { playgroundThemeProps, skinThemePreset } from "../lib/theme-playground";
import { loadStarterStyles } from "../lib/theme-engine";
import { deduplicateSkinStyles } from "../lib/theme-skin-catalogue";
import "../styles/poster-lab.css";

/**
 * Prototype of an expressive "poster" layer on top of the Swiss Poster skin.
 * The layer is token overrides only (see poster-lab.css): the fluid
 * display.3xl/xl roles, an accent-filled surface and an inverse highlight band.
 * Toggle it to compare with the stock skin.
 */
const SKIN = "dixy/swiss-poster";

export const Route = createFileRoute("/lab/poster")({
  loader: () => loadStarterStyles(SKIN),
  head: ({ loaderData }) => ({
    meta: [{ title: "Poster layer — Dixy UI lab" }],
    styles: [
      ...(loaderData?.css
        ? [{ "data-dixy-skin-style": loaderData.id, children: loaderData.css }]
        : []),
      ...(loaderData?.materialCSS
        ? [{ children: loaderData.materialCSS }]
        : []),
    ],
  }),
  component: PosterLab,
});

const cities = [
  "Lagos",
  "Lima",
  "Lisbon",
  "Ljubljana",
  "Lyon",
  "Oslo",
  "Osaka",
];

const languages = [
  { value: "en", label: "English" },
  { value: "nl", label: "Nederlands" },
  { value: "de", label: "Deutsch" },
  { value: "fr", label: "Français" },
  { value: "es", label: "Español" },
];

function PosterLab() {
  const { appearance, setAppearance } = useAppAppearance();
  const [poster, setPoster] = useState(true);
  const [language, setLanguage] = useState("nl");
  useEffect(() => deduplicateSkinStyles(SKIN), []);
  const themeProps = useMemo(
    () => playgroundThemeProps({ ...skinThemePreset(SKIN), appearance }),
    [appearance],
  );
  const current = languages.find((l) => l.value === language)!;

  return (
    <Theme
      {...themeProps}
      className={`poster-lab${poster ? " poster-layer" : ""}`}
    >
      <header className="poster-lab-bar">
        <Text as="span" size="sm">
          Swiss Poster skin
        </Text>
        <label className="poster-lab-switch">
          <Text as="span" size="sm">
            Accent surface
          </Text>
          <Switch.Root checked={poster} onCheckedChange={setPoster}>
            <Switch.Thumb />
          </Switch.Root>
        </label>
        <label className="poster-lab-switch">
          <Text as="span" size="sm">
            Dark
          </Text>
          <Switch.Root
            checked={appearance === "dark"}
            onCheckedChange={(on) => setAppearance(on ? "dark" : "light")}
          >
            <Switch.Thumb />
          </Switch.Root>
        </label>
      </header>

      <main className="poster-lab-main">
        {/* The skin's character sets highlight="band"; the accent surface
            is a library Box that remaps text, border and button tokens. */}
        <Box
          as="section"
          surface={poster ? "accent" : "default"}
          className="poster-surface"
          aria-labelledby="poster-title"
        >
          <p className="poster-eyebrow">Language · Taal · Sprache</p>
          <h1 id="poster-title" className="poster-display" lang={current.value}>
            {current.label}
          </h1>
          <ListBox.Root
            aria-label="Language"
            className="poster-list"
            size="xl"
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={[language]}
            onSelectionChange={(keys) => {
              const [first] = keys === "all" ? [] : [...keys];
              if (first) setLanguage(String(first));
            }}
          >
            {languages.map((l) => (
              <ListBox.Item
                key={l.value}
                id={l.value}
                textValue={l.label}
                lang={l.value}
              >
                {l.label}
              </ListBox.Item>
            ))}
          </ListBox.Root>
          <div className="poster-actions">
            <Button>Continue</Button>
            <Button variant="outline" color="neutral">
              Skip
            </Button>
          </div>
        </Box>

        <section className="poster-controls" aria-labelledby="poster-controls">
          <h2 id="poster-controls" className="poster-heading">
            Same layer, everyday controls
          </h2>
          <div className="poster-row">
            <Menu.Root>
              <Menu.Trigger
                render={<Button variant="outline" color="neutral" />}
              >
                Edit
              </Menu.Trigger>
              <Menu.Portal>
                <Menu.Positioner sideOffset={6} align="start">
                  <Menu.Popup>
                    <Menu.Item>Cut</Menu.Item>
                    <Menu.Item>Copy</Menu.Item>
                    <Menu.Item>Paste</Menu.Item>
                    <Menu.Item color="danger">Delete</Menu.Item>
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.Root>
            <Select.Root
              value={language}
              onValueChange={(v) => v && setLanguage(String(v))}
              items={languages}
            >
              <Select.Trigger aria-label="Language">
                <Select.Value />
                <Select.Icon />
              </Select.Trigger>
              <Select.Portal>
                <Select.Positioner>
                  <Select.Popup aria-label="Languages" size="xl">
                    <Select.List>
                      {languages.map((l) => (
                        <Select.Item key={l.value} value={l.value}>
                          <Select.ItemText>{l.label}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.List>
                  </Select.Popup>
                </Select.Positioner>
              </Select.Portal>
            </Select.Root>
          </div>
          <div className="poster-where" lang="en">
            <Combobox.Root items={cities}>
              <Combobox.InputGroup size="xl" variant="outline">
                <Combobox.Input
                  size="xl"
                  aria-label="Where to?"
                  placeholder="Where to?"
                />
                <Combobox.Clear aria-label="Clear destination" />
              </Combobox.InputGroup>
              <Combobox.Portal>
                <Combobox.Positioner sideOffset={8}>
                  <Combobox.Popup size="xl">
                    <Combobox.Empty>No match.</Combobox.Empty>
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
          </div>
          <Tabs.Root defaultValue="type">
            <Tabs.List aria-label="What the layer changes">
              <Tabs.Tab value="type">Type</Tabs.Tab>
              <Tabs.Tab value="surface">Surface</Tabs.Tab>
              <Tabs.Tab value="states">States</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="type">
              <Text>
                Uses display.3xl and display.xl: poster sizes that scale with
                their container, from a phone-safe minimum up to 128px.
              </Text>
            </Tabs.Panel>
            <Tabs.Panel value="surface">
              <Text>
                An accent-filled surface remaps text, border and focus tokens so
                content inside stays readable.
              </Text>
            </Tabs.Panel>
            <Tabs.Panel value="states">
              <Text>
                Highlighted and selected items become a solid inverse band
                instead of a tint.
              </Text>
            </Tabs.Panel>
          </Tabs.Root>
        </section>
      </main>
    </Theme>
  );
}
