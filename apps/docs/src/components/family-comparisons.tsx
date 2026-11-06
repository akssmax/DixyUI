import type { ComponentType } from "react";
import {
  Inline as ComparisonRow,
  Stack as ComparisonItem,
  Text as ComparisonLabel,
} from "@dixy-ui/react";
import type { Control, DemoState } from "../registry/components";
import {
  comparisonItemStyle,
  comparisonRowStyle,
  familyComparisons,
} from "../lib/comparison-layout";
import { configureComparisonExample } from "../lib/example-source";
import { usePreviewTheme } from "./app-appearance-provider";
import { ComparisonCard } from "./component-comparisons";

/** All options share the same category card, as in Checkbox and Switch. */
export default function FamilyComparisons({
  slug,
  controls,
  Preview,
  source,
}: {
  slug: string;
  controls: readonly Control[];
  Preview: ComponentType<DemoState>;
  source: string;
}) {
  const { settings, appearance } = usePreviewTheme();
  return (
    <div className="component-comparisons">
      {familyComparisons(slug, controls).map((comparison) => (
        <section
          key={comparison.slug}
          className="component-comparison"
          aria-labelledby={`${slug}-${comparison.slug}-comparison-heading`}
        >
          <h3 id={`${slug}-${comparison.slug}-comparison-heading`}>
            {comparison.name}
          </h3>
          <p className="section-description">{comparison.detail}</p>
          <ComparisonCard
            defer
            filename={`${slug}-${comparison.slug}.tsx`}
            code={
              source
                ? configureComparisonExample(source, slug, comparison, {
                    ...settings,
                    appearance,
                  })
                : ""
            }
            pending={<p>Loading source…</p>}
          >
            <ComparisonRow gap="lg" align="start" style={comparisonRowStyle}>
              {comparison.items.map(({ label, props }) => (
                <ComparisonItem
                  key={label}
                  gap="md"
                  role="group"
                  aria-label={`${comparison.name}: ${label}`}
                  style={comparisonItemStyle(slug)}
                >
                  <ComparisonLabel variant="body.sm">{label}</ComparisonLabel>
                  <Preview {...props} />
                </ComparisonItem>
              ))}
            </ComparisonRow>
          </ComparisonCard>
        </section>
      ))}
    </div>
  );
}
