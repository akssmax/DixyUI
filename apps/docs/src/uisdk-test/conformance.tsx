import { useState } from "react";
import { Badge, Button, Card, Collapsible, Icon, Text } from "@dixy-ui/react";
import { ChevronRight, ShieldCheck } from "lucide-react";

type Pattern =
  | "listbox"
  | "menu"
  | "menubar"
  | "tabs"
  | "radio-group"
  | "toolbar"
  | "tree"
  | "dialog"
  | "alertdialog"
  | "disclosure"
  | "accordion"
  | "combobox"
  | "slider"
  | "switch"
  | "checkbox";

export type Check = {
  id: string;
  label: string;
  /** Which library renders the widget. */
  source: "Dixy" | "UI SDK";
  pattern: Pattern;
  find: () => Element | null | undefined;
  /** Open a popup before checking; returns the element to check. */
  open?: () => Promise<Element | null | undefined>;
  close?: () => Promise<void>;
};

type Result = { ok: boolean; problems: string[]; skipped?: string };

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Exit animations keep a closing popup in the DOM; wait it out. */
export async function settle() {
  await wait(60);
  await new Promise((r) =>
    requestAnimationFrame(() => requestAnimationFrame(r)),
  );
  await wait(350);
}

/**
 * Runs UI SDK's `checkPattern` (WAI-ARIA APG rules) against live widgets on
 * this page, whichever library rendered them. The testing kit loads on demand.
 */
export function ConformancePanel({ checks }: { checks: Check[] }) {
  const [results, setResults] = useState<Record<string, Result>>({});
  const [running, setRunning] = useState<string | null>(null);

  async function runAll() {
    const { checkPattern } = await import("@ui-sdk/core/testing");
    setResults({});
    for (const check of checks) {
      setRunning(check.id);
      let result: Result;
      try {
        const root = check.open ? await check.open() : check.find();
        if (!root) {
          result = { ok: false, problems: [], skipped: "Not on screen" };
        } else {
          await settle();
          await checkPattern(root, check.pattern);
          result = { ok: true, problems: [] };
        }
      } catch (error) {
        const lines = String((error as Error)?.message ?? error).split("\n");
        result = {
          ok: false,
          problems: lines.slice(1).map((l) => l.replace(/^- /, "")),
        };
        if (!result.problems.length)
          result.problems = [lines[0] ?? "Unknown error"];
      }
      await check.close?.();
      await settle();
      setResults((r) => ({ ...r, [check.id]: result }));
    }
    setRunning(null);
    // checkPattern drives keys; hand focus back to the button.
    document.getElementById("uisdk-run-checks")?.focus();
  }

  const done = Object.values(results);
  const passed = done.filter((r) => r.ok).length;

  return (
    <Card.Root className="uisdk-checks" aria-labelledby="uisdk-checks-title">
      <Card.Header>
        <Card.Title id="uisdk-checks-title">UI SDK conformance</Card.Title>
        <Card.Description>
          <code>checkPattern</code> from <code>@ui-sdk/core/testing</code>, run
          against the live player. It presses keys and runs a menu item, so
          playback may change.
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <ul className="uisdk-check-list">
          {checks.map((check) => {
            const result = results[check.id];
            return (
              <li key={check.id} className="uisdk-check">
                <div className="uisdk-check-row">
                  <span className="uisdk-check-label">
                    {check.label}
                    <Badge
                      size="sm"
                      variant="soft"
                      color={check.source === "Dixy" ? "accent" : "neutral"}
                    >
                      {check.source}
                    </Badge>
                    <code className="uisdk-check-pattern">{check.pattern}</code>
                  </span>
                  <span aria-live="polite">
                    {running === check.id ? (
                      <Badge size="sm" variant="outline" color="info">
                        Checking…
                      </Badge>
                    ) : result ? (
                      <Badge
                        size="sm"
                        variant="solid"
                        color={
                          result.ok
                            ? "success"
                            : result.skipped
                              ? "warning"
                              : "danger"
                        }
                      >
                        {result.ok
                          ? "Pass"
                          : result.skipped
                            ? result.skipped
                            : `${result.problems.length} problem${result.problems.length === 1 ? "" : "s"}`}
                      </Badge>
                    ) : null}
                  </span>
                </div>
                {result && !result.ok && result.problems.length > 0 && (
                  <Collapsible.Root>
                    <Collapsible.Trigger className="uisdk-check-toggle">
                      <Icon render={<ChevronRight />} size="sm" />
                      Details
                    </Collapsible.Trigger>
                    <Collapsible.Panel>
                      <ul className="uisdk-check-problems">
                        {result.problems.map((p, i) => (
                          <li key={i}>
                            <Text size="sm">{p}</Text>
                          </li>
                        ))}
                      </ul>
                    </Collapsible.Panel>
                  </Collapsible.Root>
                )}
              </li>
            );
          })}
        </ul>
      </Card.Content>
      <Card.Footer className="uisdk-check-footer">
        <Button
          id="uisdk-run-checks"
          onClick={runAll}
          loading={running !== null}
          disabled={running !== null}
        >
          <Icon render={<ShieldCheck />} />
          {done.length ? "Run again" : "Run checks"}
        </Button>
        {done.length === checks.length && (
          <Text size="sm" role="status">
            {passed} of {checks.length} pass
          </Text>
        )}
      </Card.Footer>
    </Card.Root>
  );
}
