import {
  ThemeInspectorAccordion,
  ThemeInspectorSection,
} from "./theme-inspector-accordion";
import { useEffect, useMemo, useState } from "react";
import { Button, TextField } from "@dixy-ui/react";
import { DocsSelect } from "./docs-controls";
import { Slider as DialSlider } from "dialkit";
import "dialkit/styles.css";
import {
  editableThemeDocument,
  mixThemeRecipe,
  changeThemeParameter,
  changeThemeOrnament,
  changeThemeCharacter,
  applyStarterCharacter,
  parseThemePreset,
  serializeThemePreset,
  playgroundThemeProps,
  wellClash,
  type ThemePreset,
} from "../lib/theme-playground";
import {
  materialRecipes,
  frameRecipes,
  renameTheme,
  themeDocumentSchema,
  organicFrameRecipes,
  isOrganicFrame,
  canopyShapes,
  stemCharacters,
  installedThemeDocuments,
} from "../lib/theme-authoring";
import {
  backdropPatterns,
  characterLabels,
  chromeLabels,
  controlStyles,
  cornerStyles,
  edgeStyles,
  titlebarStyles,
  wellStyles,
  dividerStyles,
  focusStyles,
  headingCases,
  headingWeights,
  motionStyles,
  numeralStyles,
  scrollbarStyles,
  selectionStyles,
  stateStyles,
} from "@dixy-ui/themes/authoring";

const titleCase = (value: string | number) =>
  String(value).replace(
    /(^|-)([a-z])/g,
    (_, gap, letter) => (gap ? " " : "") + letter.toUpperCase(),
  );

const storageKey = "dixy.custom-themes.v1";
type SavedTheme = { id: string; name: string; preset: string };

export function ThemeRecipeMixer({
  preset,
  onChange,
}: {
  preset: ThemePreset;
  onChange: (next: ThemePreset) => void;
}) {
  const document = useMemo(() => editableThemeDocument(preset), [preset]);
  const [name, setName] = useState(document.name);
  const [saved, setSaved] = useState<SavedTheme[]>([]);
  const [notice, setNotice] = useState("");
  useEffect(() => setName(document.name), [document.name]);
  const clash = useMemo(() => wellClash(preset), [preset]);
  useEffect(() => {
    try {
      const entries: unknown = JSON.parse(
        localStorage.getItem(storageKey) ?? "[]",
      );
      if (!Array.isArray(entries) || entries.length > 12)
        throw new Error("Unsupported saved theme shelf.");
      const valid: SavedTheme[] = [];
      for (const entry of entries) {
        try {
          const parsed = parseThemePreset(entry.preset);
          if (parsed.document)
            valid.push({
              id: parsed.document.id,
              name: parsed.document.name,
              preset: serializeThemePreset(parsed),
            });
        } catch {
          setNotice(
            "Some saved themes could not be restored. You can still import an exported theme.",
          );
        }
      }
      setSaved(valid);
    } catch {
      setNotice(
        "Local theme storage is unavailable. Export your theme to keep it.",
      );
    }
  }, []);
  function save() {
    try {
      const renamed = renameTheme(document, name);
      const next = { ...preset, document: renamed };
      playgroundThemeProps(next);
      if (saved.length >= 12 && !saved.some((s) => s.id === renamed.id))
        throw new Error(
          "Your 12 local slots are full. Export this theme to keep it.",
        );
      const items = [
        {
          id: renamed.id,
          name: renamed.name,
          preset: serializeThemePreset(next),
        },
        ...saved.filter((s) => s.id !== renamed.id),
      ];
      localStorage.setItem(storageKey, JSON.stringify(items));
      setSaved(items);
      onChange(next);
      setNotice(`Saved “${renamed.name}” in this browser.`);
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "This theme could not be saved. Export it instead.",
      );
    }
  }
  const parameterSchema = themeDocumentSchema.properties.recipes.properties;
  function parameters(kind: "material" | "frame", keys?: string[]) {
    return Object.entries(
      parameterSchema[kind].properties.parameters.properties,
    )
      .filter(
        ([key]) =>
          (!keys || keys.includes(key)) &&
          (kind !== "frame" ||
            document.recipes.frame.id !== "none" ||
            key.startsWith("padding")),
      )
      .map(([key, schema]) => (
        <DialSlider
          key={key}
          label={schema.title}
          value={
            document.recipes[kind].parameters[
              key as keyof (typeof document.recipes)[typeof kind]["parameters"]
            ]
          }
          min={schema.minimum}
          max={schema.maximum}
          step={schema.maximum <= 3 ? 0.05 : 1}
          onChange={(value) =>
            onChange(changeThemeParameter(preset, kind, key, value))
          }
        />
      ));
  }
  const frame = document.recipes.frame;
  const organic = isOrganicFrame(frame.id)
    ? organicFrameRecipes[frame.id]
    : null;
  const ornamentSchema = parameterSchema.frame.properties.ornament.properties;
  function ornamentSlider(
    key:
      | "density"
      | "cornerDensity"
      | "canopyDepth"
      | "variation"
      | "motion"
      | "scale"
      | "stemWeight"
      | "seed",
    label?: string,
  ) {
    const schema = ornamentSchema[key];
    return (
      <DialSlider
        key={key}
        label={label ?? schema.title}
        min={schema.minimum}
        max={schema.maximum}
        step={1}
        value={frame.ornament[key]}
        unit={key === "scale" ? "px" : key === "seed" ? undefined : "%"}
        onChange={(value) => onChange(changeThemeOrnament(preset, key, value))}
      />
    );
  }
  const character = document.character;
  const characterSchema = themeDocumentSchema.properties.character.properties;
  function characterSlider(
    group: "motion" | "type" | "details" | "backdrop",
    key: string,
    step: number,
    unit?: string,
  ) {
    const schema = (
      characterSchema[group].properties as Record<
        string,
        { title?: string; minimum?: number; maximum?: number }
      >
    )[key]!;
    return (
      <DialSlider
        key={group + key}
        label={schema.title ?? key}
        min={schema.minimum}
        max={schema.maximum}
        step={step}
        unit={unit}
        value={(character[group] as unknown as Record<string, number>)[key]!}
        onChange={(value) =>
          onChange(changeThemeCharacter(preset, [group, key], value))
        }
      />
    );
  }
  function characterSelect(
    group: "type" | "details" | "chrome",
    key: string,
    label: string,
    values: readonly (string | number)[],
    labels?: Readonly<Record<string, string>>,
  ) {
    const current = (character[group] as Record<string, string | number>)[key]!;
    return (
      <label className="theme-recipe-picker" key={group + key}>
        <span>{label}</span>
        <DocsSelect
          value={String(current)}
          onValueChange={(value) =>
            onChange(
              changeThemeCharacter(
                preset,
                [group, key],
                typeof current === "number" ? Number(value) : value,
              ),
            )
          }
        >
          {values.map((value) => (
            <option key={value} value={String(value)}>
              {labels?.[value] ?? titleCase(value)}
            </option>
          ))}
        </DocsSelect>
      </label>
    );
  }
  return (
    <section
      className="theme-recipe-mixer dialkit-root"
      aria-label="Theme recipe mixer"
      data-theme={preset.appearance === "dark" ? "dark" : "light"}
      data-mode="inline"
    >
      <div className="theme-inspector-section-title">
        <h3>Character</h3>
        <span>Controls · motion · voice</span>
      </div>
      <label className="theme-recipe-picker">
        <span>Control language</span>
        <DocsSelect
          value={character.controls}
          onValueChange={(value) =>
            onChange(changeThemeCharacter(preset, "controls", value))
          }
        >
          {controlStyles.map((id) => (
            <option key={id} value={id}>
              {characterLabels.controls[id]}
            </option>
          ))}
        </DocsSelect>
      </label>
      <label className="theme-recipe-picker">
        <span>Motion personality</span>
        <DocsSelect
          value={character.motion.style}
          onValueChange={(value) =>
            onChange(changeThemeCharacter(preset, ["motion", "style"], value))
          }
        >
          {motionStyles.map((id) => (
            <option key={id} value={id}>
              {characterLabels.motion[id]}
            </option>
          ))}
        </DocsSelect>
      </label>
      <div className="theme-dial-stack">
        {characterSlider("motion", "press", 0.25, "px")}
        {characterSlider("motion", "tempo", 0.05, "×")}
      </div>
      <label className="theme-recipe-picker">
        <span>Backdrop</span>
        <DocsSelect
          value={character.backdrop.pattern}
          onValueChange={(value) =>
            onChange(
              changeThemeCharacter(preset, ["backdrop", "pattern"], value),
            )
          }
        >
          {backdropPatterns.map((id) => (
            <option key={id} value={id}>
              {characterLabels.backdrop[id]}
            </option>
          ))}
        </DocsSelect>
      </label>
      {character.backdrop.pattern !== "none" && (
        <div className="theme-dial-stack">
          {characterSlider("backdrop", "intensity", 0.05)}
          {characterSlider("backdrop", "scale", 0.05, "×")}
        </div>
      )}
      <ThemeInspectorAccordion>
        <ThemeInspectorSection title="Window chrome" value="chrome">
          {characterSelect(
            "chrome",
            "titlebar",
            "Title bar",
            titlebarStyles,
            chromeLabels.titlebar,
          )}
          {characterSelect(
            "chrome",
            "edge",
            "Window edge",
            edgeStyles,
            chromeLabels.edge,
          )}
          {characterSelect(
            "chrome",
            "well",
            "Display well",
            wellStyles,
            chromeLabels.well,
          )}
          {clash && (
            <div className="theme-mixer-warning" role="status">
              <p>
                {chromeLabels.well[character.chrome.well]} stays {clash.tone} in
                both appearances, so the {clash.appearance} theme gets a{" "}
                {clash.tone === "dark" ? "near-black" : "near-white"} panel on a{" "}
                {clash.appearance} card ({clash.step.toFixed(0)}:1). That can
                read as a hole in the page. Keep it if that is the look you
                want.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={(event) => {
                  // The warning unmounts on swap; return focus to the well picker just above it.
                  const picker = event.currentTarget
                    .closest(".theme-mixer-warning")
                    ?.previousElementSibling?.querySelector<HTMLElement>(
                      '[role="combobox"]',
                    );
                  onChange(
                    changeThemeCharacter(
                      preset,
                      ["chrome", "well"],
                      clash.substitute,
                    ),
                  );
                  requestAnimationFrame(() => picker?.focus());
                }}
              >
                Use{" "}
                {
                  chromeLabels.well[
                    clash.substitute as keyof typeof chromeLabels.well
                  ]
                }
              </Button>
            </div>
          )}
          {characterSelect(
            "chrome",
            "corners",
            "Corners",
            cornerStyles,
            chromeLabels.corners,
          )}
          <p className="theme-mixer-help">
            Card.Header becomes the title bar; the Card.Content right after it
            becomes the display well.
          </p>
        </ThemeInspectorSection>
        <ThemeInspectorSection title="Type voice" value="type-voice">
          {characterSelect("type", "headingCase", "Heading case", headingCases)}
          {characterSelect(
            "type",
            "headingWeight",
            "Heading weight",
            headingWeights,
          )}
          {characterSelect("type", "numerals", "Numerals", numeralStyles)}
          <div className="theme-dial-stack">
            {characterSlider("type", "headingTracking", 0.005, "em")}
          </div>
        </ThemeInspectorSection>
        <ThemeInspectorSection title="States &amp; details" value="details">
          <label className="theme-recipe-picker">
            <span>State cues</span>
            <DocsSelect
              value={character.states}
              onValueChange={(value) =>
                onChange(changeThemeCharacter(preset, "states", value))
              }
            >
              {stateStyles.map((id) => (
                <option key={id} value={id}>
                  {characterLabels.states[id]}
                </option>
              ))}
            </DocsSelect>
          </label>
          {characterSelect("details", "focus", "Focus style", focusStyles)}
          {characterSelect("details", "divider", "Dividers", dividerStyles)}
          {characterSelect(
            "details",
            "selection",
            "Text selection",
            selectionStyles,
          )}
          {characterSelect(
            "details",
            "scrollbar",
            "Scrollbars",
            scrollbarStyles,
          )}
          <div className="theme-dial-stack">
            {characterSlider("details", "iconStroke", 0.25, "px")}
          </div>
        </ThemeInspectorSection>
        <ThemeInspectorSection title="Borrow a character" value="borrow">
          <label className="theme-recipe-picker">
            <span>Copy character from</span>
            <DocsSelect
              value=""
              onValueChange={(id) =>
                id && onChange(applyStarterCharacter(preset, id))
              }
            >
              <option value="">Choose a starter</option>
              <option value="none">Neutral (Original Dixy)</option>
              {Object.values(installedThemeDocuments).map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name}
                </option>
              ))}
            </DocsSelect>
          </label>
        </ThemeInspectorSection>
      </ThemeInspectorAccordion>
      <div className="theme-inspector-section-title">
        <h3>Surface</h3>
        <span>DialKit</span>
      </div>
      <label className="theme-recipe-picker">
        <span>Material</span>
        <DocsSelect
          value={document.recipes.material.id}
          onValueChange={(id) =>
            onChange(mixThemeRecipe(preset, "material", id))
          }
        >
          {Object.entries(materialRecipes).map(([id, recipe]) => (
            <option key={id} value={id}>
              {recipe.label}
            </option>
          ))}
        </DocsSelect>
      </label>
      <div className="theme-dial-stack">
        {parameters("material", ["sheen", "cushion", "textureScale"])}
      </div>
      <ThemeInspectorAccordion
        key={frame.id}
        defaultValue={organic ? ["organic"] : []}
      >
        {organic && (
          <ThemeInspectorSection title={organic.label} value="organic">
            <label className="theme-recipe-picker">
              <span>
                {frame.id === "forest" ? "Botanical mix" : "Frame style"}
              </span>
              <DocsSelect
                value={frame.ornament.style}
                onValueChange={(value) =>
                  onChange(changeThemeOrnament(preset, "style", value))
                }
              >
                {organic.styles.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </DocsSelect>
            </label>
            <div className="theme-dial-stack">
              {ornamentSlider(
                "density",
                frame.id === "forest" ? "Leaf density" : undefined,
              )}
              {ornamentSlider(
                "cornerDensity",
                frame.id === "forest" ? "Corner groves" : undefined,
              )}
              {ornamentSlider(
                "canopyDepth",
                frame.id === "forest"
                  ? "Canopy depth"
                  : frame.id === "cushion"
                    ? "Squish"
                    : frame.id === "coral"
                      ? "Wave depth"
                      : "Relief",
              )}
              {ornamentSlider("variation")}
            </div>
            <ThemeInspectorAccordion>
              <ThemeInspectorSection
                title="Shape & motion"
                value="organic-shape"
              >
                {frame.id === "forest" && (
                  <>
                    <label className="theme-recipe-picker">
                      <span>Canopy shape</span>
                      <DocsSelect
                        value={frame.ornament.canopy}
                        onValueChange={(value) =>
                          onChange(changeThemeOrnament(preset, "canopy", value))
                        }
                      >
                        {canopyShapes.map((shape) => (
                          <option key={shape} value={shape}>
                            {shape}
                          </option>
                        ))}
                      </DocsSelect>
                    </label>
                    <label className="theme-recipe-picker">
                      <span>Stem character</span>
                      <DocsSelect
                        value={frame.ornament.stem}
                        onValueChange={(value) =>
                          onChange(changeThemeOrnament(preset, "stem", value))
                        }
                      >
                        {stemCharacters.map((stem) => (
                          <option key={stem} value={stem}>
                            {stem}
                          </option>
                        ))}
                      </DocsSelect>
                    </label>
                  </>
                )}
                <div className="theme-dial-stack">
                  {ornamentSlider("scale")}
                  {ornamentSlider("stemWeight")}
                  {ornamentSlider(
                    "motion",
                    frame.id === "forest" ? "Breeze" : "Motion strength",
                  )}
                  {ornamentSlider("seed")}
                </div>
              </ThemeInspectorSection>
            </ThemeInspectorAccordion>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                onChange(
                  changeThemeOrnament(
                    preset,
                    "seed",
                    (frame.ornament.seed % 9999) + 1,
                  ),
                )
              }
            >
              New variation
            </Button>
          </ThemeInspectorSection>
        )}
        <ThemeInspectorSection title="Frame &amp; spacing" value="frame">
          <label className="theme-recipe-picker">
            <span>Frame</span>
            <DocsSelect
              value={document.recipes.frame.id}
              onValueChange={(id) =>
                onChange(mixThemeRecipe(preset, "frame", id))
              }
            >
              {Object.entries(frameRecipes).map(([id, recipe]) => (
                <option key={id} value={id}>
                  {recipe.label}
                </option>
              ))}
            </DocsSelect>
          </label>
          <div className="theme-dial-stack">{parameters("frame")}</div>
        </ThemeInspectorSection>
        <ThemeInspectorSection title="Advanced surface" value="surface">
          <div className="theme-dial-stack">
            {parameters("material", [
              "surfaceMix",
              "darkSurfaceMix",
              "inkTint",
              "lightAngle",
              "backdropBlur",
              "backdropSaturate",
            ])}
          </div>
        </ThemeInspectorSection>
        <ThemeInspectorSection title="Save &amp; restore" value="save">
          <div className="theme-mixer-controls">
            <label>
              <span>Theme name</span>
              <TextField
                aria-label="Theme name"
                value={name}
                maxLength={80}
                onChange={(event) => setName(event.target.value)}
              />
            </label>
            <Button size="sm" onClick={save}>
              Save theme locally
            </Button>
            {saved.length > 0 && (
              <label>
                <span>Saved themes</span>
                <DocsSelect
                  value={
                    saved.some((s) => s.id === document.id) ? document.id : ""
                  }
                  onValueChange={(id) => {
                    const entry = saved.find((s) => s.id === id);
                    if (entry) onChange(parseThemePreset(entry.preset));
                  }}
                >
                  <option value="">Choose a saved theme</option>
                  {saved.map((entry) => (
                    <option key={entry.id} value={entry.id}>
                      {entry.name}
                    </option>
                  ))}
                </DocsSelect>
              </label>
            )}
          </div>
        </ThemeInspectorSection>
      </ThemeInspectorAccordion>
      {notice && (
        <p role="status" className="theme-mixer-notice">
          {notice}
        </p>
      )}
      <p className="theme-mixer-help">Changes are included in Get code.</p>
    </section>
  );
}
