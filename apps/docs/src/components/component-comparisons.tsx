import { Button } from "@dixy-ui/react";
import {
  Suspense,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { Theme } from "@dixy-ui/react";
import { CodeBlock } from "./code-block";
import { usePreviewTheme } from "./app-appearance-provider";
import { configureExample } from "../lib/example-source";

export interface ComparisonExample {
  name: string;
  slug: string;
  detail: string;
  Example: ComponentType;
}

type Sources = Record<string, () => Promise<string>>;

/** One shared preview and one complete source block for a comparison category. */
export function ComparisonCard({
  children,
  code,
  filename,
  pending,
  defer = false,
}: {
  children: ReactNode;
  code: string;
  filename: string;
  pending?: ReactNode;
  defer?: boolean;
}) {
  const { settings, appearance } = usePreviewTheme();
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(!defer);
  useEffect(() => {
    const element = host.current;
    if (!defer || !element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [defer]);
  return (
    <div className="component-comparison-card" ref={host}>
      <Theme
        appearance={appearance}
        accentColor={settings.accentColor}
        neutralColor={settings.neutralColor}
        radius={settings.radius}
        density={settings.density}
        motion={settings.motion}
        dir={settings.dir}
        className="component-comparison-preview"
      >
        {ready ? (
          <Suspense fallback={<p>Loading example…</p>}>{children}</Suspense>
        ) : (
          <span className="prop-panel-note">
            Example loads as it comes into view.
          </span>
        )}
      </Theme>
      {code ? (
        <CodeBlock
          code={code}
          filename={filename}
          collapsible
          collapsedLines={5}
        />
      ) : (
        pending
      )}
    </div>
  );
}

function Comparison({
  name,
  slug,
  detail,
  Example,
  family,
  sources,
}: ComparisonExample & { family: string; sources: Sources }) {
  const { settings, appearance } = usePreviewTheme();
  const [source, setSource] = useState("");
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setFailed(false);
    sources[`../demos/${family}-${slug}-comparison.tsx`]?.()
      .then((code) => {
        if (active) setSource(code);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, [family, sources, slug, attempt]);
  return (
    <section
      className="component-comparison"
      aria-labelledby={`${family}-${slug}-heading`}
    >
      <h3 id={`${family}-${slug}-heading`}>{name}</h3>
      <p className="section-description">{detail}</p>
      <ComparisonCard
        code={
          source
            ? configureExample(source, {}, { ...settings, appearance })
            : ""
        }
        filename={`${family}-${slug}.tsx`}
        pending={
          <p>
            {failed ? (
              <Button
                variant="ghost"
                color="neutral"
                size="sm"
                type="button"
                onClick={() => setAttempt((value) => value + 1)}
              >
                Retry example source
              </Button>
            ) : (
              "Loading source…"
            )}
          </p>
        }
      >
        <Example />
      </ComparisonCard>
    </section>
  );
}

export function ComponentComparisons({
  family,
  examples,
  sources,
}: {
  family: string;
  examples: ComparisonExample[];
  sources: Sources;
}) {
  return (
    <div className="component-comparisons">
      {examples.map((example) => (
        <Comparison
          key={example.slug}
          {...example}
          family={family}
          sources={sources}
        />
      ))}
    </div>
  );
}
