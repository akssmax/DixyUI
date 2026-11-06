import { Suspense, useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Progress,
  Radio,
  RadioGroup,
  Separator,
  Slider,
  Switch,
  Text,
  TextField,
  Theme,
} from "@dixy-ui/react";
import { DocsSelect } from "./docs-controls";
import {
  playgroundThemeProps,
  skinCatalog,
  skinThemePreset,
  type ThemePreset,
} from "../lib/theme-playground";
import { prepareSkin } from "../lib/theme-skin-catalogue";
import { previewVoice, type PreviewVoice } from "./theme-preview-voice";

const defaultPicks = [
  "dixy/retro-os",
  "dixy/scrapbook",
  "dixy/art-deco",
] as const;

/** One compact specimen per theme: the same controls, so differences come only from the theme. */
function CompareColumn({
  label,
  preset,
  voice,
}: {
  label: string;
  preset: ThemePreset;
  voice: PreviewVoice;
}) {
  const props = playgroundThemeProps(preset);
  return (
    <Suspense fallback={<p role="status">Loading {label}…</p>}>
      <Theme
        {...props}
        className="theme-compare-column"
        animateOrnaments={false}
      >
        <Card.Root>
          <Card.Header>
            <span className="theme-scene-eyebrow">{voice.eyebrow}</span>
          </Card.Header>
          <Card.Content className="theme-specimen-display">
            <Card.Title as="h3">{voice.headline}</Card.Title>
            <Card.Description>{voice.body}</Card.Description>
          </Card.Content>
          <Card.Content className="theme-compare-controls">
            <div className="theme-compare-row">
              <Button size="sm">{voice.primary}</Button>
              <Button size="sm" variant="outline" color="neutral">
                {voice.secondary}
              </Button>
            </div>
            <Separator />
            <div className="theme-compare-row">
              <Switch.Root defaultChecked aria-label={`${label} switch on`}>
                <Switch.Thumb />
              </Switch.Root>
              <Switch.Root aria-label={`${label} switch off`}>
                <Switch.Thumb />
              </Switch.Root>
              <Checkbox.Root defaultChecked aria-label={`${label} checkbox`}>
                <Checkbox.Indicator />
              </Checkbox.Root>
              <Checkbox.Root aria-label={`${label} unchecked checkbox`}>
                <Checkbox.Indicator />
              </Checkbox.Root>
            </div>
            <RadioGroup
              defaultValue="a"
              aria-label={`${label} radio`}
              className="theme-compare-row"
            >
              <Radio.Root value="a" aria-label="First">
                <Radio.Indicator />
              </Radio.Root>
              <Radio.Root value="b" aria-label="Second">
                <Radio.Indicator />
              </Radio.Root>
              <Badge variant="soft">2 of 2</Badge>
            </RadioGroup>
            <Slider.Root defaultValue={62}>
              <Slider.Control>
                <Slider.Track>
                  <Slider.Indicator />
                </Slider.Track>
                <Slider.Thumb aria-label={`${label} slider`} />
              </Slider.Control>
            </Slider.Root>
            <Progress.Root value={48} aria-label={`${label} progress`}>
              <Progress.Track>
                <Progress.Indicator />
              </Progress.Track>
            </Progress.Root>
            <TextField
              aria-label={`${label} invalid field`}
              aria-invalid="true"
              defaultValue="Needs a fix"
            />
            <Text size="sm" tone="muted">
              {label}
            </Text>
          </Card.Content>
        </Card.Root>
      </Theme>
    </Suspense>
  );
}

export default function CompareScene({ current }: { current: ThemePreset }) {
  const [picks, setPicks] = useState<string[]>([...defaultPicks]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let live = true;
    setReady(false);
    Promise.all(picks.map((id) => prepareSkin(id)))
      .catch(() => undefined)
      .finally(() => live && setReady(true));
    return () => {
      live = false;
    };
  }, [picks]);
  const currentName =
    current.document?.name ??
    skinCatalog.find((skin) => skin.id === current.skin)?.name ??
    "Original Dixy";
  return (
    <section className="theme-compare" aria-label="Compare themes">
      <div className="theme-compare-pickers">
        <span>Your theme vs.</span>
        {picks.map((id, index) => (
          <DocsSelect
            key={index}
            aria-label={`Comparison theme ${index + 1}`}
            value={id}
            onValueChange={(value) =>
              setPicks((all) => all.map((p, i) => (i === index ? value : p)))
            }
          >
            <option value="none">Original Dixy</option>
            {skinCatalog.map((skin) => (
              <option key={skin.id} value={skin.id}>
                {skin.name}
              </option>
            ))}
          </DocsSelect>
        ))}
      </div>
      <div className="theme-compare-grid" aria-busy={!ready || undefined}>
        <CompareColumn
          label={currentName}
          preset={current}
          voice={previewVoice(current.skin)}
        />
        {ready &&
          picks.map((id, index) => (
            <CompareColumn
              key={id + index}
              label={
                skinCatalog.find((skin) => skin.id === id)?.name ??
                "Original Dixy"
              }
              preset={{ ...skinThemePreset(id), motion: current.motion }}
              voice={previewVoice(id)}
            />
          ))}
      </div>
    </section>
  );
}
