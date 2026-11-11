import { Toggle, ToggleGroup } from "@dixy-ui/react";
import { lazy, useEffect, useState, type ComponentType } from "react";
import { ComparisonCard } from "./component-comparisons";
import { usePreviewTheme } from "./app-appearance-provider";
import { configureExample } from "../lib/example-source";

type Recipe = { slug: string; name: string; detail: string };
const groups: { type: string; recipes: Recipe[] }[] = [
  {
    type: "Area",
    recipes: [
      {
        slug: "area-stacked",
        name: "Stacked",
        detail: "Series add up to a total; the top edge is the sum.",
      },
      {
        slug: "area-gradient",
        name: "Gradient",
        detail:
          "Chart.Gradient fades a series color, so fills follow the theme.",
      },
      {
        slug: "area-step",
        name: "Step",
        detail: "Values that change at discrete moments, like seats or plans.",
      },
      {
        slug: "area-expanded",
        name: "Share (100%)",
        detail:
          'stackOffset="expand" shows each series as a share of the whole.',
      },
    ],
  },
  {
    type: "Bar",
    recipes: [
      {
        slug: "bar-grouped",
        name: "Grouped",
        detail: "Compare series side by side within each category.",
      },
      {
        slug: "bar-stacked",
        name: "Stacked",
        detail: "Totals with their parts; round only the outer ends.",
      },
      {
        slug: "bar-horizontal",
        name: "Horizontal",
        detail: "Long category names and ranked lists read better across.",
      },
      {
        slug: "bar-negative",
        name: "Negative values",
        detail: "A zero line and a semantic danger color for losses.",
      },
      {
        slug: "bar-labeled",
        name: "Labeled",
        detail:
          "Values above bars, names inside them; the inside label flips for dark mode.",
      },
      {
        slug: "bar-highlight",
        name: "Highlight",
        detail: "Fade every bar but the one the takeaway is about.",
      },
      {
        slug: "bar-table",
        name: "With data table",
        detail: 'tableDisplay="toggle" adds a Chart | Table switch.',
      },
      {
        slug: "bar-interactive",
        name: "Interactive",
        detail: "A ToggleGroup switches the series; caption and totals follow.",
      },
    ],
  },
  {
    type: "Line",
    recipes: [
      {
        slug: "line-dots",
        name: "Dots",
        detail: "Marked points for sparse data; the active dot grows on hover.",
      },
      {
        slug: "line-step",
        name: "Step",
        detail: "Prices and limits change in steps, not slopes.",
      },
      {
        slug: "line-labeled",
        name: "Labeled",
        detail: "Values on each point, so the chart reads without hovering.",
      },
      {
        slug: "line-target",
        name: "Against a target",
        detail:
          "A neutral dashed line marks the reference, not another series.",
      },
    ],
  },
  {
    type: "Pie",
    recipes: [
      {
        slug: "pie-donut",
        name: "Donut with total",
        detail: "Center text uses dixy-charts-center-value and -label.",
      },
      {
        slug: "pie-labeled",
        name: "Labeled",
        detail: "Values beside each slice, joined by leader lines.",
      },
      {
        slug: "pie-highlight",
        name: "Highlight",
        detail: "One slice at full strength; the rest recede.",
      },
    ],
  },
  {
    type: "Radar",
    recipes: [
      {
        slug: "radar-basic",
        name: "Basic",
        detail: "One series around a polygon grid.",
      },
      {
        slug: "radar-multiple",
        name: "Comparison",
        detail: "Two releases; the comparison sits behind at lower opacity.",
      },
      {
        slug: "radar-circle",
        name: "Circle grid",
        detail: 'gridType="circle" with dots on each value.',
      },
    ],
  },
  {
    type: "Radial",
    recipes: [
      {
        slug: "radial-bars",
        name: "Radial bars",
        detail: "Rings per category on the chart.track color.",
      },
      {
        slug: "radial-progress",
        name: "Progress to goal",
        detail: "A fixed angle domain makes the ring a share of the goal.",
      },
      {
        slug: "radial-stacked",
        name: "Stacked half ring",
        detail: "Two series stacked on a 180° arc with a total in the middle.",
      },
    ],
  },
];

const examples = import.meta.glob<{ default: ComponentType }>(
  "../demos/chart-gallery/*.tsx",
);
const sources = import.meta.glob<string>("../demos/chart-gallery/*.tsx", {
  query: "?raw",
  import: "default",
});
const components = Object.fromEntries(
  Object.entries(examples).map(([path, load]) => [
    path.match(/([\w-]+)\.tsx$/)![1]!,
    lazy(load),
  ]),
);

function RecipeCard({ slug, name, detail }: Recipe) {
  const { settings, appearance } = usePreviewTheme();
  const [source, setSource] = useState("");
  useEffect(() => {
    let active = true;
    sources[`../demos/chart-gallery/${slug}.tsx`]?.().then((code) => {
      if (active) setSource(code);
    });
    return () => {
      active = false;
    };
  }, [slug]);
  const Example = components[slug];
  return (
    <section className="chart-recipe" aria-labelledby={`chart-${slug}`}>
      <h4 id={`chart-${slug}`}>{name}</h4>
      <p className="section-description">{detail}</p>
      <ComparisonCard
        defer
        code={
          source
            ? configureExample(source, {}, { ...settings, appearance })
            : ""
        }
        filename={`${slug}.tsx`}
        pending={<p>Loading source…</p>}
      >
        {Example ? <Example /> : null}
      </ComparisonCard>
    </section>
  );
}

/** Every chart recipe, grouped by type, with a filter like shadcn's gallery. */
export default function ChartGallery() {
  const [type, setType] = useState("All");
  const shown = groups.filter((group) => type === "All" || group.type === type);
  return (
    <div className="chart-gallery">
      <ToggleGroup
        aria-label="Chart type"
        className="chart-gallery-filter"
        value={[type]}
        onValueChange={(values) => values[0] && setType(values[0])}
      >
        {["All", ...groups.map((group) => group.type)].map((value) => (
          <Toggle
            key={value}
            value={value}
            size="sm"
            variant="outline"
            color="neutral"
          >
            {value}
          </Toggle>
        ))}
      </ToggleGroup>
      {shown.map((group) => (
        <section
          key={group.type}
          className="chart-gallery-group"
          aria-labelledby={`chart-group-${group.type}`}
        >
          <h3 id={`chart-group-${group.type}`}>
            {group.type}
            <span className="chart-gallery-count">{group.recipes.length}</span>
          </h3>
          <div className="chart-gallery-grid">
            {group.recipes.map((recipe) => (
              <RecipeCard key={recipe.slug} {...recipe} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
