/**
 * Canned replies for the Wren demo. Each script exercises a different set of
 * AI parts, so every suggestion shows something new. All data is made up.
 */
import type { ChatOptions } from "./mock-chat";

export type ScriptStep =
  | { kind: "reasoning"; text: string }
  | { kind: "text"; text: string }
  | { kind: "sources"; sources: { href: string; title: string }[] }
  | {
      kind: "tool";
      name: string;
      input: unknown;
      output?: unknown;
      error?: string;
      duration?: number;
    };

export const suggestions = [
  "Plan a rainy-day weekend in Lisbon",
  "Write a useDebouncedValue hook in TypeScript",
  "Compare Base UI and React Aria for a design system",
  "Check my deploy status",
];

const lisbon: ScriptStep[] = [
  {
    kind: "reasoning",
    text: "The reader wants a weekend plan that survives rain. I should check the forecast first, then lean on indoor places close together so a downpour never strands them. Two days, a morning and afternoon each, plus one food stop a day.",
  },
  {
    kind: "tool",
    name: "get_forecast",
    input: { city: "Lisbon", days: 2, units: "metric" },
    output: {
      note: "Mock data for the Dixy demo",
      saturday: { high: 17, low: 12, rain: "80%" },
      sunday: { high: 18, low: 13, rain: "45%" },
    },
  },
  {
    kind: "text",
    text: `## A rainy-day weekend in Lisbon

Saturday looks **properly wet** (80% chance of rain) and Sunday clears a little, so the plan front-loads the indoor stops.

| Day | Morning | Afternoon | Eat |
| --- | --- | --- | --- |
| Saturday | Tile museum | Covered market hall | Pastry café nearby |
| Sunday | Riverside art centre | Tram ride if dry | Seafood tasca |

### Packing list

- [x] Light rain jacket
- [x] Shoes with grip: the stone pavements get *slippery*
- [ ] A tram day pass

> Tip: the markets get busy after noon, so go early on Saturday.

Want me to swap anything for a day trip instead?`,
  },
];

const hook: ScriptStep[] = [
  {
    kind: "reasoning",
    text: "A debounced value hook: store the latest value in state, reset a timer on every change, and clear the timer on unmount so nothing updates after the component is gone.",
  },
  {
    kind: "text",
    text: `Here is a small, typed hook. It returns the value only after it has stopped changing for \`delay\` milliseconds.

\`\`\`tsx
import { useEffect, useState } from "react";

export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
\`\`\`

**How it behaves**

1. Every change to \`value\` cancels the pending timer.
2. When the input goes quiet, the latest value lands once.
3. Unmounting clears the timer, so there is no update after unmount.

Use it to keep a search request from firing on every keystroke:

\`\`\`tsx
const query = useDebouncedValue(input, 250);
useEffect(() => { search(query); }, [query]);
\`\`\``,
  },
];

const compare: ScriptStep[] = [
  {
    kind: "tool",
    name: "search_docs",
    input: { query: "Base UI vs React Aria components", limit: 3 },
    output: { results: 3 },
  },
  {
    kind: "text",
    text: `Both are unstyled, accessible primitive libraries, so the choice is mostly about **API shape** and coverage.

| | Base UI | React Aria |
| --- | --- | --- |
| Styling hooks | \`data-*\` state attributes | render props and \`data-*\` |
| Composition | \`render\` prop on every part | slots and contexts |
| Date and color pickers | few | extensive |
| Internationalisation | basic | deep: calendars, number formats |

Dixy uses **Base UI for most parts** and reaches for React Aria where its coverage is unmatched, such as the calendar, date fields and color picker. ~~One library for everything~~ is less important than keeping each part's contract intact.`,
  },
  {
    kind: "sources",
    sources: [
      {
        href: "https://base-ui.com/react/overview/quick-start",
        title: "Base UI: Quick start",
      },
      {
        href: "https://react-spectrum.adobe.com/react-aria/",
        title: "React Aria",
      },
      { href: "https://github.com/akssmax/DixyUI", title: "Dixy UI on GitHub" },
    ],
  },
];

const deploy: ScriptStep[] = [
  {
    kind: "tool",
    name: "get_deployments",
    input: { project: "dixy-docs", environment: "production" },
    error: "403: this demo has no access to a real deployment service.",
    duration: 900,
  },
  {
    kind: "text",
    text: "I couldn't reach the deployment service, so I can't check the status. This demo runs on scripted replies with no real integrations. In a real app, this is where the tool's error would let you **retry** or connect an account.",
  },
];

const fallback = (prompt: string): ScriptStep[] => [
  {
    kind: "text",
    text: `You asked: *“${prompt.replace(/[*_`[\]]/g, "").slice(0, 140)}”*

Wren is a **scripted demo**, so it can't answer that for real. It replays canned replies to show off the Dixy AI parts: streaming markdown, reasoning, tool calls and sources. Try one of the suggestions to see each part in action.`,
  },
];

/** Choose a script from the prompt, then shape it for the chosen options. */
export function pickScript(prompt: string, options: ChatOptions): ScriptStep[] {
  const text = prompt.toLowerCase();
  let steps: ScriptStep[];
  if (/lisbon|weekend|trip|rain/.test(text)) steps = lisbon;
  else if (/hook|debounce|typescript/.test(text)) steps = hook;
  else if (/base ui|react aria|compare|radix/.test(text)) steps = compare;
  else if (/deploy|status|error/.test(text)) steps = deploy;
  else steps = fallback(prompt);

  return steps.filter((step) => {
    if (step.kind === "reasoning") return options.model === "deep";
    if (step.kind === "sources") return options.webSearch;
    if (step.kind === "tool" && step.name === "search_docs")
      return options.webSearch;
    return true;
  });
}
