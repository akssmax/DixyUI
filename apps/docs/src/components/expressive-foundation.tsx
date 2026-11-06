import { DocsSwitch, DocsSelect } from "./docs-controls";
import { Button } from "@dixy-ui/react";
import { useState } from "react";
import { Theme } from "@dixy-ui/react";
import {
  materialRecipes,
  shapePresets,
  shapePaths,
  personalityPresets,
  feedbackEvents,
} from "@dixy-ui/tokens";
import MaterialExample from "../demos/material-example";
import materialSource from "../demos/material-example?raw";
import ShapeExample from "../demos/shape-example";
import shapeSource from "../demos/shape-example?raw";
import PersonalityExample from "../demos/personality-example";
import personalitySource from "../demos/personality-example?raw";
import FeedbackExample from "../demos/feedback-example";
import feedbackSource from "../demos/feedback-example?raw";
import { configureExample } from "../lib/example-source";
import { useDocsAppearance } from "./docs-shell";
import { CodeBlock } from "./code-block";
import { MaterialPerformanceLab } from "./material-performance-lab";
import api from "../generated/api.json";

type Kind = "materials" | "shape" | "emotion" | "haptics";
const configurations = {
  materials: {
    source: materialSource,
    defaults: {
      finish: "glossy",
      shape: "rounded",
      emphasis: "solid",
      tone: "accent",
      effects: "static",
      disabled: false,
      loading: false,
      reduceMotion: false,
      rtl: false,
    },
    controls: {
      finish: Object.keys(materialRecipes),
      shape: Object.keys(shapePresets),
      emphasis: ["solid", "soft", "outline", "ghost"],
      tone: ["accent", "neutral", "danger", "success"],
      effects: ["static", "reduced"],
    },
  },
  shape: {
    source: shapeSource,
    defaults: { geometry: "pill", silhouette: "flower", rtl: false },
    controls: {
      geometry: Object.keys(shapePresets),
      silhouette: Object.keys(shapePaths),
    },
  },
  emotion: {
    source: personalitySource,
    defaults: {
      personality: "tactile",
      reduceMotion: false,
      reduceEffects: false,
      rtl: false,
    },
    controls: { personality: Object.keys(personalityPresets) },
  },
  haptics: {
    source: feedbackSource,
    defaults: { enabled: false, reduceMotion: false, reduceEffects: false },
    controls: {},
  },
} satisfies Record<
  Kind,
  {
    source: string;
    defaults: Record<string, string | boolean>;
    controls: Record<string, readonly string[]>;
  }
>;
const labels: Record<string, string> = {
  finish: "Finish",
  shape: "Control shape",
  emphasis: "Emphasis",
  tone: "Semantic color",
  effects: "Effects",
  disabled: "Disabled",
  loading: "Loading",
  reduceMotion: "Reduce motion",
  reduceEffects: "Reduce effects",
  rtl: "Right to left",
  geometry: "Geometry",
  silhouette: "Decorative silhouette",
  personality: "Personality",
  enabled: "Enable optional web vibration",
};

export default function ExpressiveFoundation({ kind }: { kind: Kind }) {
  // The route key isolates each foundation's controls, reset, and local example state.
  return <FoundationLab key={kind} kind={kind} />;
}
function FoundationLab({ kind }: { kind: Kind }) {
  const config = configurations[kind];
  const [state, setState] = useState<Record<string, string | boolean>>({
    ...config.defaults,
  });
  const [resetKey, setResetKey] = useState(0);
  const appearance = useDocsAppearance();
  const code = configureExample(config.source, state, {
    appearance,
    accentColor: "blue",
    radius: "md",
  });
  return (
    <>
      <h2>
        {kind === "materials"
          ? "Finish without a rendering engine"
          : kind === "shape"
            ? "Geometry and artwork have different jobs"
            : kind === "emotion"
              ? "A personality is a coordinated preset"
              : "Meaningful feedback, optional delivery"}
      </h2>
      <p>
        {kind === "materials"
          ? "Static CSS creates matte, enamel, clay, brushed metal and paper finishes. No texture downloads, render loop, backdrop sampling, or additional rendering dependency is needed. Solid and soft controls accept finishes; outline and ghost keep their original emphasis."
          : kind === "shape"
            ? "Semantic shapes reuse the radius scale. Pills round controls while panels keep readable corners. Decorative SVG silhouettes sit beside content; they never clip labels, hit areas, or focus rings."
            : kind === "emotion"
              ? "Restrained, playful and tactile coordinate radius, shape, material, press travel, and the optional spring scheme. Semantic colors and status meanings stay stable. Explicit settings override a preset; inherited reduction always wins."
              : "Selection, toggle, snap, success and warning describe events, not hardware. The optional feedback entry defaults to no output. Enable vibration only by choice; reduced motion or effects suppress it. The visual result never depends on device feedback."}
      </p>
      <div className="foundation-toolbar expressive-controls">
        {Object.entries(state).map(([name, value]) => (
          <label key={name}>
            {typeof value === "boolean" ? (
              <>
                <DocsSwitch
                  checked={value}
                  onCheckedChange={(nextChecked) => {
                    const checked = nextChecked;
                    setState((current) => ({ ...current, [name]: checked }));
                  }}
                />
                {labels[name]}
              </>
            ) : (
              <>
                {labels[name]}
                <DocsSelect
                  value={value}
                  onValueChange={(nextValue) => {
                    const selected = nextValue;
                    setState((current) => ({ ...current, [name]: selected }));
                  }}
                >
                  {(
                    (config.controls as Record<string, readonly string[]>)[
                      name
                    ] ?? []
                  ).map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </DocsSelect>
              </>
            )}
          </label>
        ))}
        <Button
          variant="ghost"
          color="neutral"
          size="sm"
          type="button"
          className="sizing-reset"
          onClick={() => {
            setState({ ...config.defaults });
            setResetKey((value) => value + 1);
          }}
        >
          Reset {kind}
        </Button>
      </div>
      <Theme
        appearance={appearance}
        accentColor="blue"
        className="expressive-preview"
      >
        <div key={resetKey}>
          {kind === "materials" && <MaterialExample {...state} />}
          {kind === "shape" && <ShapeExample {...state} />}
          {kind === "emotion" && <PersonalityExample {...state} />}
          {kind === "haptics" && <FeedbackExample {...state} />}
        </div>
      </Theme>
      <CodeBlock code={code} collapsible filename={`${kind}-example.tsx`} />
      {kind === "materials" && (
        <>
          <h2>Recipe contracts</h2>
          <ContractTable
            headings={["Material", "Finish", "Texture", "Depth"]}
            rows={Object.entries(materialRecipes).map(([name, recipe]) => [
              name,
              recipe.finish,
              recipe.texture,
              recipe.depth,
            ])}
          />
          <h2>Keep content readable</h2>
          <p>
            Decorations live in the background. Text keeps its semantic
            foreground; focus, loading, disabled, hover and pressed states keep
            their contracts. The paper and metal textures are CSS
            approximations. Reduced effects, increased contrast, reduced
            transparency and forced colors remove decorative layers. Materials
            are an optional stylesheet.
          </p>
          <h2>Compare rendering modes</h2>
          <MaterialPerformanceLab />
          <h2>Surface API</h2>
          <p>
            Button and Box inherit their finish and geometry from Theme. Box
            forwards native semantics, refs, events and styles. Import the
            optional material stylesheet once in the application that uses it.
          </p>
          <ContractTable
            headings={["Contract", "Property", "Type"]}
            rows={[
              ...api.ButtonProps.map((prop) => [
                "Button",
                prop.name,
                prop.type,
              ]),
              ...api.BoxOwnProps.map((prop) => ["Box", prop.name, prop.type]),
            ]}
          />
        </>
      )}
      {kind === "shape" && (
        <>
          <h2>Semantic geometry</h2>
          <ContractTable
            headings={["Preset", "Control", "Container", "Feature"]}
            rows={Object.entries(shapePresets).map(([name, roles]) => [
              name,
              roles.control,
              roles.container,
              roles.feature,
            ])}
          />
          <p>
            Rounded geometry follows the current contextual radius roles; the
            rounded row shows the default primitives. Per-component overrides
            preserve a stable rectangular interaction area. Shape is decorative
            SVG artwork, hidden from assistive technology unless a label is
            supplied.
          </p>
          <ContractTable
            headings={["Property", "Type", "Default"]}
            rows={api.ShapeProps.map((prop) => [
              prop.name,
              prop.type,
              prop.default,
            ])}
          />
        </>
      )}
      {kind === "emotion" && (
        <>
          <h2>Preset mappings</h2>
          <ContractTable
            headings={["Personality", "Material", "Shape", "Radius", "Springs"]}
            rows={Object.entries(personalityPresets).map(([name, preset]) => [
              name,
              preset.material,
              preset.shape,
              preset.radius,
              preset.motionScheme,
            ])}
          />
          <p>
            Button press travel uses the preset with the shared finite feedback
            timing. Custom spring compositions can read{" "}
            <code>useMotionPreferences().scheme</code> and pass it to{" "}
            <code>springTransition</code>. The existing CSS controls keep their
            established timings. A personality does not infer anyone’s mood.
          </p>
        </>
      )}
      {kind === "haptics" && (
        <>
          <h2>Provider API</h2>
          <ContractTable
            headings={["Property", "Type", "Default"]}
            rows={api.FeedbackProviderProps.map((prop) => [
              prop.name,
              prop.type,
              prop.default,
            ])}
          />
          <h2>Events and adapters</h2>
          <ContractTable
            headings={["Event", "Meaning", "Web fallback in ms"]}
            rows={Object.entries(feedbackEvents).map(([name, event]) => [
              name,
              event.description,
              event.vibration.join(", "),
            ])}
          />
          <p>
            A native host can supply its own FeedbackAdapter. The provider
            requires explicit opt-in; omitting the adapter does nothing.
            Synchronous throws and rejected adapter promises are isolated from
            application actions. Emit after a confirmed change, never on focus
            or every pointer movement. Browser vibration is best effort and
            cannot reproduce native Core Haptics.
          </p>
        </>
      )}
    </>
  );
}
function ContractTable({
  headings,
  rows,
}: {
  headings: string[];
  rows: string[][];
}) {
  return (
    <div className="table-scroll" tabIndex={0} aria-label={headings.join(", ")}>
      <table className="api-table">
        <thead>
          <tr>
            {headings.map((heading) => (
              <th key={heading}>{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, column) =>
                column === 0 ? (
                  <th key={column} scope="row">
                    <code>{cell}</code>
                  </th>
                ) : (
                  <td key={column}>
                    <code>{cell}</code>
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
