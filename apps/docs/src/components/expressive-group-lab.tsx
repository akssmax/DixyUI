import { DocsSwitch } from "./docs-controls";
import { Button } from "@dixy-ui/react";
import { useState } from "react";
import { Theme } from "@dixy-ui/react";
import Example from "../demos/expressive-group-example";
import source from "../demos/expressive-group-example?raw";
import { configureExample } from "../lib/example-source";
import { useDocsAppearance } from "./docs-shell";
import { CodeBlock } from "./code-block";

export function ExpressiveGroupLab() {
  const [enabled, setEnabled] = useState(false);
  const [reduceMotion, setReduced] = useState(false);
  const [rtl, setRtl] = useState(false);
  const [key, setKey] = useState(0);
  const appearance = useDocsAppearance();
  return (
    <section>
      <h2>Connected press experiment</h2>
      <p>
        Three controls redistribute a small amount of space during a press. This
        is an opt-in documentation prototype: flex growth does layout work, so
        it stays outside the default component recipes. Selection remains
        independent of press feedback. Narrow containers keep equal widths, and
        reduced motion removes expansion.
      </p>
      <div className="foundation-toolbar expressive-controls">
        <label>
          <DocsSwitch
            checked={enabled}
            onCheckedChange={(nextChecked) => setEnabled(nextChecked)}
          />
          Enable press expansion
        </label>
        <label>
          <DocsSwitch
            checked={reduceMotion}
            onCheckedChange={(nextChecked) => setReduced(nextChecked)}
          />
          Reduce group motion
        </label>
        <label>
          <DocsSwitch
            checked={rtl}
            onCheckedChange={(nextChecked) => setRtl(nextChecked)}
          />
          Right to left group
        </label>
        <Button
          variant="ghost"
          color="neutral"
          size="sm"
          type="button"
          className="sizing-reset"
          onClick={() => {
            setEnabled(false);
            setReduced(false);
            setRtl(false);
            setKey((value) => value + 1);
          }}
        >
          Reset group
        </Button>
      </div>
      <Theme appearance={appearance} className="expressive-preview">
        <Example
          key={key}
          enabled={enabled}
          reduceMotion={reduceMotion}
          rtl={rtl}
        />
      </Theme>
      <CodeBlock
        code={configureExample(
          source,
          { enabled, reduceMotion, rtl },
          { appearance, accentColor: "blue", radius: "md" },
        )}
        collapsible
        filename="expressive-group-example.tsx"
      />
    </section>
  );
}
