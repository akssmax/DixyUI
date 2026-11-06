import { DocsSelect, DocsSwitch } from "./docs-controls";
import { Button } from "@dixy-ui/react";
import { useState } from "react";
import { componentMotion, Theme } from "@dixy-ui/react";
import { motionDurations, motionTransitions } from "@dixy-ui/tokens";
import ComponentMotionExample from "../demos/component-motion-example";
import source from "../demos/component-motion-example?raw";
import { configureExample } from "../lib/example-source";
import { CodeBlock } from "./code-block";
import { useDocsAppearance } from "./docs-shell";

export function ComponentMotionExamples() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [drawerDirection, setDrawerDirection] = useState<
    "up" | "down" | "left" | "right"
  >("right");
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">(
    "horizontal",
  );
  const [rtl, setRtl] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const appearance = useDocsAppearance();
  const state = { reduceMotion, drawerDirection, orientation, rtl };
  const code = configureExample(source, state, {
    appearance,
    accentColor: "blue",
    radius: "md",
  });
  function reset() {
    setReduceMotion(false);
    setDrawerDirection("right");
    setOrientation("horizontal");
    setRtl(false);
    setResetKey((key) => key + 1);
  }
  return (
    <section id="component-motion" aria-label="Applied component motion">
      <h2>One motion language across components</h2>
      <p>
        Use the real controls together. Buttons and menu highlights respond in
        120ms; dialogs and menus enter in 200ms and exit in 120ms. Drawers enter
        in 280ms and use the same shorter exit, scaled by swipe release
        velocity. Tabs move their indicator in 200ms while panel content changes
        immediately.
      </p>
      <div className="foundation-toolbar motion-controls">
        <label>
          Component motion
          <DocsSelect
            value={reduceMotion ? "reduced" : "system"}
            onValueChange={(nextValue) =>
              setReduceMotion(nextValue === "reduced")
            }
          >
            <option value="system">System preference</option>
            <option value="reduced">Reduced motion</option>
          </DocsSelect>
        </label>
        <label>
          Drawer edge
          <DocsSelect
            value={drawerDirection}
            onValueChange={(nextValue) =>
              setDrawerDirection(nextValue as typeof drawerDirection)
            }
          >
            {["up", "down", "left", "right"].map((value) => (
              <option key={value}>{value}</option>
            ))}
          </DocsSelect>
        </label>
        <label>
          Tab orientation
          <DocsSelect
            value={orientation}
            onValueChange={(nextValue) =>
              setOrientation(nextValue as typeof orientation)
            }
          >
            <option>horizontal</option>
            <option>vertical</option>
          </DocsSelect>
        </label>
        <label>
          <DocsSwitch
            checked={rtl}
            onCheckedChange={(nextChecked) => setRtl(nextChecked)}
          />
          Component right to left
        </label>
        <Button
          variant="ghost"
          color="neutral"
          size="sm"
          type="button"
          className="sizing-reset"
          onClick={reset}
        >
          Reset components
        </Button>
      </div>
      <Theme
        appearance={appearance}
        accentColor="blue"
        className="component-motion-preview"
      >
        <ComponentMotionExample key={resetKey} {...state} />
      </Theme>
      <CodeBlock
        code={code}
        filename="component-motion-example.tsx"
        collapsible
      />
      <div
        className="table-scroll"
        tabIndex={0}
        aria-label="Component motion recipes"
      >
        <table className="api-table motion-token-table">
          <thead>
            <tr>
              <th>Component / phase</th>
              <th>Shared recipe</th>
              <th>Normal duration</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(componentMotion).flatMap(([component, phases]) =>
              Object.entries(phases).map(([phase, role]) => (
                <tr key={`${component}-${phase}`}>
                  <th scope="row">
                    <code>
                      {component}.{phase}
                    </code>
                  </th>
                  <td>{role}</td>
                  <td>{motionDurations[motionTransitions[role].duration]}ms</td>
                </tr>
              )),
            )}
          </tbody>
        </table>
      </div>
      <p>
        These component aliases are generated from the public{" "}
        <code>componentMotion</code> map. For example,{" "}
        <code>--dixy-menu-motion-enter</code> combines its duration and easing
        aliases; customize those on Theme to carry them through portals. Focus,
        disabled states, action callbacks, keyboard navigation and Base UI
        presence remain independent of timing.
      </p>
      <p>
        Reduced motion makes transitions immediate and removes decorative press,
        scale and entrance travel. It preserves the final tab-indicator
        location, drawer snap offset and direct pointer tracking. Swipe tracking
        has no interpolation lag in either mode. Progress uses a separate 700ms
        loop cadence and becomes static under reduction; it does not redefine
        the duration limits for ordinary UI feedback.
      </p>
    </section>
  );
}
