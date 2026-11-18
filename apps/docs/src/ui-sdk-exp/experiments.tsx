import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  Checkbox,
  Combobox,
  Icon,
  Kbd,
  ListBox,
  Menu,
  Menubar,
  Meter,
  Slider,
} from "@dixy-ui/react";
import {
  PasswordInput,
  PasswordInputControl,
  PasswordInputToggle,
} from "@ui-sdk/react/password-input";
import {
  SegmentedControl,
  SegmentedControlIndicator,
  SegmentedControlItem,
} from "@ui-sdk/react/segmented-control";
import {
  TokenInput,
  TokenInputEditor,
  TokenInputToken,
  TokenInputTokenRemove,
  type Token,
} from "@ui-sdk/react/token-input";
import { Tile } from "./tile";

/* ---------------------------------------------------------------- */
/* 1. Where to? — a combobox where the typed word is the poster      */
/* ---------------------------------------------------------------- */

const cities: Record<string, string> = {
  Lagos: "Nigeria",
  Lima: "Peru",
  Lisbon: "Portugal",
  Ljubljana: "Slovenia",
  Lyon: "France",
  Luang: "Laos",
  Lucerne: "Switzerland",
  Oslo: "Norway",
  Osaka: "Japan",
};

function WhereTo() {
  return (
    <Tile
      id="where"
      title="Where to?"
      dixy="Combobox size=xl, display.3xl input"
      appearance="light"
      accent="indigo"
    >
      <p className="exp-where-eyebrow" id="exp-where-label">
        Where to?
      </p>
      <Combobox.Root items={Object.keys(cities)}>
        <Combobox.InputGroup size="xl" className="exp-where-group">
          <Combobox.Input
            size="xl"
            aria-labelledby="exp-where-label"
            placeholder="L…"
            className="exp-where-input"
          />
        </Combobox.InputGroup>
        <Combobox.Portal>
          <Combobox.Positioner sideOffset={4}>
            <Combobox.Popup className="exp-where-popup">
              <Combobox.Empty>No city by that name.</Combobox.Empty>
              <Combobox.List>
                {(city: string) => (
                  <Combobox.Item
                    key={city}
                    value={city}
                    className="exp-where-item"
                  >
                    <span>{city}</span>
                    <span className="exp-where-country">{cities[city]}</span>
                  </Combobox.Item>
                )}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </Tile>
  );
}

/* ---------------------------------------------------------------- */
/* 2. Playback speed — a vertical segmented control of numerals      */
/* ---------------------------------------------------------------- */

const speeds = [
  { value: "0.75", hint: "Slower" },
  { value: "1", hint: "Normal" },
  { value: "1.25", hint: "" },
  { value: "1.5", hint: "" },
  { value: "2", hint: "Fastest" },
];

function PlaybackSpeed() {
  const [speed, setSpeed] = useState<string>("1.25");
  return (
    <Tile
      id="speed"
      title="Playback speed"
      dixy="tokens, display.2xl numerals"
      sdk="SegmentedControl (vertical), Indicator"
      appearance="dark"
      accent="lime"
    >
      <p className="exp-speed-eyebrow" id="exp-speed-label">
        Playback speed
      </p>
      <SegmentedControl
        aria-labelledby="exp-speed-label"
        orientation="vertical"
        value={speed}
        onValueChange={(v) => v && setSpeed(v)}
        className="exp-speed"
      >
        <SegmentedControlIndicator className="exp-speed-indicator" />
        {speeds.map((s) => (
          <SegmentedControlItem
            key={s.value}
            value={s.value}
            className="exp-speed-item"
            aria-label={`${s.value} times${s.hint ? `, ${s.hint.toLowerCase()}` : ""}`}
          >
            <span className="exp-speed-num" aria-hidden="true">
              {s.value}×
            </span>
            {s.hint && (
              <span className="exp-speed-hint" aria-hidden="true">
                {s.hint}
              </span>
            )}
          </SegmentedControlItem>
        ))}
      </SegmentedControl>
    </Tile>
  );
}

/* ---------------------------------------------------------------- */
/* 3. Menubar — hard edges, offset shadow, shapes behind             */
/* ---------------------------------------------------------------- */

const menus: Record<string, [string, string?][]> = {
  File: [
    ["New drawing", "⌘N"],
    ["Open…", "⌘O"],
    ["Save", "⌘S"],
    ["Print…", "⌘P"],
  ],
  Edit: [
    ["Undo", "⌘Z"],
    ["Redo", "⇧⌘Z"],
    ["Duplicate", "⌘D"],
  ],
  Shape: [["Circle"], ["Triangle"], ["Square"]],
  View: [
    ["Zoom in", "⌘+"],
    ["Zoom out", "⌘−"],
    ["Fit to screen", "⇧1"],
  ],
};

function MenubarExp() {
  return (
    <Tile
      id="menubar"
      title="Shape editor menubar"
      dixy="Menubar, Menu, Kbd"
      appearance="light"
      accent="amber"
    >
      <div className="exp-shapes" aria-hidden="true">
        <span className="exp-shape-tri" />
        <span className="exp-shape-sq" />
        <span className="exp-shape-circle" />
      </div>
      <Menubar aria-label="Shape editor" className="exp-menubar">
        {Object.entries(menus).map(([label, items]) => (
          <Menu.Root key={label}>
            <Menu.Trigger className="exp-menubar-trigger">{label}</Menu.Trigger>
            <Menu.Portal>
              <Menu.Positioner sideOffset={6} align="start">
                <Menu.Popup className="exp-menubar-popup">
                  {items.map(([item, keys]) => (
                    <Menu.Item key={item} className="exp-menubar-item">
                      <span>{item}</span>
                      {keys && (
                        <Kbd
                          size="sm"
                          aria-hidden="true"
                          className="exp-menubar-kbd"
                        >
                          {keys}
                        </Kbd>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Popup>
              </Menu.Positioner>
            </Menu.Portal>
          </Menu.Root>
        ))}
      </Menubar>
    </Tile>
  );
}

/* ---------------------------------------------------------------- */
/* 4. Grind setting — a ruled slider on brushed metal                */
/* ---------------------------------------------------------------- */

const methods = [
  { label: "Espresso", max: 8 },
  { label: "Pour-over", max: 20 },
  { label: "French press", max: 30 },
];
const methodFor = (v: number) => methods.find((m) => v <= m.max)!.label;

function GrindSetting() {
  const [grind, setGrind] = useState(14);
  const method = methodFor(grind);
  return (
    <Tile
      id="grind"
      title="Grind setting"
      dixy="Slider on the metal material"
      appearance="light"
      accent="orange"
      material="metal"
    >
      <div className="exp-grind-readout" aria-hidden="true">
        <span className="exp-grind-num">{grind}</span>
        <span className="exp-grind-method">{method}</span>
      </div>
      <Slider.Root
        min={1}
        max={30}
        step={1}
        value={grind}
        onValueChange={(v) => setGrind(Array.isArray(v) ? v[0]! : v)}
        className="exp-grind"
      >
        <Slider.Control>
          <Slider.Track className="exp-grind-track">
            <Slider.Indicator />
          </Slider.Track>
          <Slider.Thumb
            aria-label="Grind setting"
            getAriaValueText={(_, v) => `${v}, ${methodFor(v)}`}
          />
        </Slider.Control>
      </Slider.Root>
      <ul className="exp-grind-scale" aria-hidden="true">
        {methods.map((m) => (
          <li key={m.label} data-active={m.label === method || undefined}>
            {m.label}
          </li>
        ))}
      </ul>
    </Tile>
  );
}

/* ---------------------------------------------------------------- */
/* 5. Newsletters — an editorial checklist                           */
/* ---------------------------------------------------------------- */

const letters = [
  ["World", "Daily"],
  ["Climate", "Weekly"],
  ["Science", "Weekly"],
  ["Culture", "Fridays"],
  ["Food", "Sundays"],
  ["Travel", "Monthly"],
] as const;

function Newsletters() {
  const [on, setOn] = useState<string[]>(["World", "Climate"]);
  return (
    <Tile
      id="news"
      title="Your newsletters"
      dixy="Checkbox, serif display type"
      appearance="dark"
      accent="tomato"
    >
      <fieldset className="exp-news">
        <legend className="exp-news-legend">Your newsletters</legend>
        {letters.map(([name, when]) => (
          <label key={name} className="exp-news-row">
            <span className="exp-news-name">{name}</span>
            <span className="exp-news-when">{when}</span>
            <Checkbox.Root
              checked={on.includes(name)}
              onCheckedChange={(c) =>
                setOn((list) =>
                  c ? [...list, name] : list.filter((n) => n !== name),
                )
              }
            >
              <Checkbox.Indicator />
            </Checkbox.Root>
          </label>
        ))}
      </fieldset>
    </Tile>
  );
}

/* ---------------------------------------------------------------- */
/* 6. Password — big dots, a pressed-state reveal, a strength meter  */
/* ---------------------------------------------------------------- */

function Password() {
  const id = useId();
  const [length, setLength] = useState(9);
  return (
    <Tile
      id="pass"
      title="Password"
      dixy="Meter, Icon"
      sdk="PasswordInput, Control, Toggle"
      appearance="light"
      accent="brown"
    >
      <label htmlFor={`${id}-pw`} className="exp-pass-label">
        Password
      </label>
      <PasswordInput defaultValue="clayfield" className="exp-pass">
        <PasswordInputControl
          id={`${id}-pw`}
          className="exp-pass-control"
          aria-describedby={`${id}-hint`}
          onInput={(e) => setLength(e.currentTarget.value.length)}
        />
        <PasswordInputToggle
          aria-label="Show password"
          className="exp-pass-toggle"
        >
          <Icon render={<Eye />} className="exp-pass-eye" />
          <Icon render={<EyeOff />} className="exp-pass-eye-off" />
        </PasswordInputToggle>
      </PasswordInput>
      <Meter.Root
        value={Math.min(length, 16)}
        max={16}
        aria-label="Password length"
        getAriaValueText={() => `${length} characters`}
        className="exp-pass-meter"
      >
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>
      <p id={`${id}-hint`} className="exp-pass-hint">
        At least 8 characters{length >= 8 ? " ✓" : ""}
      </p>
    </Tile>
  );
}

/* ---------------------------------------------------------------- */
/* 7. Label maker — tokens as embossed tape                          */
/* ---------------------------------------------------------------- */

const label = (text: string): Token => ({
  type: "label",
  value: text.toUpperCase(),
  label: text.toUpperCase(),
});

function LabelMaker() {
  const [value, setValue] = useState<(string | Token)[]>(
    ["Socks", "Map", "Tent", "Soap", "Flask"].map(label),
  );
  return (
    <Tile
      id="labels"
      title="Label maker"
      dixy="tokens, mono type"
      sdk="TokenInput, Editor, Token, TokenRemove"
      appearance="dark"
      accent="teal"
    >
      <p className="exp-labels-hint" id="exp-labels-hint">
        Type a word, press Enter to print it. Backspace peels one off.
      </p>
      <TokenInput
        value={value}
        onValueChange={(v) => setValue(v)}
        onSubmit={(v) =>
          // Enter prints every loose word as a label.
          setValue(
            v.flatMap((part) =>
              typeof part === "string"
                ? part.split(/\s+/).filter(Boolean).map(label)
                : [part],
            ),
          )
        }
        renderToken={(token) => (
          <TokenInputToken className="exp-label">
            {token.label}
            <TokenInputTokenRemove className="exp-label-remove">
              ×
            </TokenInputTokenRemove>
          </TokenInputToken>
        )}
      >
        <TokenInputEditor
          aria-label="Labels"
          aria-describedby="exp-labels-hint"
          placeholder="TYPE A LABEL"
          className="exp-labels-editor"
        />
      </TokenInput>
    </Tile>
  );
}

/* ---------------------------------------------------------------- */
/* 8. Departures — a transit-sign list                               */
/* ---------------------------------------------------------------- */

const stops = [
  { id: "harbour", name: "Harbour", platform: "2" },
  { id: "station", name: "Station", platform: "5" },
  { id: "museum", name: "Museum", platform: "9" },
  { id: "airport", name: "Airport", platform: "12" },
];

function Departures() {
  return (
    <Tile
      id="transit"
      title="Departures"
      dixy="ListBox size=xl, inverse selection band"
      appearance="light"
      accent="yellow"
    >
      <ListBox.Root
        aria-label="Destination"
        size="xl"
        selectionMode="single"
        defaultSelectedKeys={["station"]}
        className="exp-transit"
      >
        {stops.map((s) => (
          <ListBox.Item
            key={s.id}
            id={s.id}
            textValue={s.name}
            className="exp-transit-item"
          >
            <span className="exp-transit-platform" aria-hidden="true">
              {s.platform}
            </span>
            <span className="exp-transit-name">{s.name}</span>
            {/* ListBox.Item drops aria-description, so say it in text. */}
            <span className="exp-sr">, platform {s.platform}</span>
          </ListBox.Item>
        ))}
      </ListBox.Root>
    </Tile>
  );
}

export function Experiments() {
  return (
    <div className="exp-grid">
      <WhereTo />
      <PlaybackSpeed />
      <MenubarExp />
      <GrindSetting />
      <Newsletters />
      <Password />
      <LabelMaker />
      <Departures />
    </div>
  );
}
